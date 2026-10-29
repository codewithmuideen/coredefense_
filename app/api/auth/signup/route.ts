import { NextResponse } from "next/server";
import { signupSchema } from "@/lib/validations";
import { createAdminClient } from "@/lib/supabase/admin";
import { configGuard, fail, maskEmail, readJson } from "@/lib/auth/api";
import { getOrigin } from "@/lib/auth/request-meta";
import { logAuthEvent } from "@/lib/auth/events";
import { sendEmail } from "@/lib/email/send";
import { verifyEmailTemplate } from "@/lib/email/templates";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);

export async function POST(request: Request) {
  const guard = configGuard();
  if (guard) return guard;

  const parsed = signupSchema.safeParse(await readJson(request));
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Check the form and try again.");
  const { firstName, lastName, company, password } = parsed.data;
  const email = parsed.data.email.toLowerCase();

  const admin = createAdminClient();
  // generateLink creates the (unconfirmed) user without Supabase sending its own email, so the
  // confirmation goes out through Resend with our branding.
  const { data, error } = await admin.auth.admin.generateLink({
    type: "signup",
    email,
    password,
    options: { data: { first_name: firstName, last_name: lastName, company } },
  });

  if (error || !data?.properties) {
    if (/already (been )?registered|already exists/i.test(error?.message ?? "")) {
      return fail("An account with this email already exists. Log in, or reset your password if you've forgotten it.", 409);
    }
    console.error("[signup] generateLink failed", error);
    return fail(error?.message ?? "We couldn't create your account. Please try again.", 500);
  }

  if (ADMIN_EMAILS.includes(email)) {
    await admin.auth.admin.updateUserById(data.user.id, { app_metadata: { ...data.user.app_metadata, role: "admin" } });
  }

  const origin = await getOrigin();
  const link = `${origin}/auth/confirm?token_hash=${data.properties.hashed_token}&type=${data.properties.verification_type}&next=/dashboard`;
  const sent = await sendEmail({ to: email, ...verifyEmailTemplate(firstName, link) });
  await logAuthEvent("account_created", { userId: data.user.id, email });

  if (!sent.ok) {
    return NextResponse.json({ ok: true, email: maskEmail(email), emailError: sent.error }, { status: 202 });
  }
  return NextResponse.json({ ok: true, email: maskEmail(email), redirected: sent.redirected, logged: sent.logged });
}
