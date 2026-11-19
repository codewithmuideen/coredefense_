import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { fail, readJson, requireUser } from "@/lib/auth/api";
import { getOrigin } from "@/lib/auth/request-meta";
import { logAuthEvent, recordAudit } from "@/lib/auth/events";
import { sendEmail } from "@/lib/email/send";
import { accountInviteTemplate } from "@/lib/email/templates";
import { PASSWORD_RULES } from "@/lib/validations";
import { customerId } from "@/lib/app/support";

// Admin console: create an account on someone's behalf. Either email them a link to set their own
// password (recommended) or set a temporary password to hand over yourself.
const schema = z
  .object({
    email: z.string().trim().toLowerCase().email("Enter a valid email address"),
    firstName: z.string().trim().min(1, "First name is required").max(80),
    lastName: z.string().trim().min(1, "Last name is required").max(80),
    company: z.string().trim().max(120).optional(),
    jobTitle: z.string().trim().max(120).optional(),
    phone: z.string().trim().max(40).optional(),
    role: z.enum(["user", "admin"]).default("user"),
    mode: z.enum(["invite", "password"]).default("invite"),
    password: z.string().optional(),
  })
  .refine((d) => d.mode === "invite" || PASSWORD_RULES.every((r) => r.test(d.password ?? "")), {
    path: ["password"],
    message: "Temporary password needs 12+ characters with upper and lower case, a number and a symbol",
  });

export async function POST(request: Request) {
  const auth = await requireUser({ admin: true });
  if (auth.response) return auth.response;
  const parsed = schema.safeParse(await readJson(request));
  if (!parsed.success) return fail(parsed.error.issues[0].message);
  const d = parsed.data;

  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.createUser({
    email: d.email,
    // Invites get an unguessable placeholder; the person replaces it from the emailed link.
    password: d.mode === "password" ? d.password : `${randomBytes(24).toString("base64url")}aA1!`,
    email_confirm: true,
    user_metadata: { first_name: d.firstName, last_name: d.lastName, company: d.company ?? null, created_by_admin: true },
    app_metadata: { role: d.role },
  });
  if (error || !data.user) {
    if (/already (been )?registered|already exists/i.test(error?.message ?? "")) return fail("An account with this email already exists.", 409);
    return fail(error?.message ?? "Couldn't create the account.", 500);
  }
  const userId = data.user.id;

  // The signup trigger made the profile; fill in the extra details.
  await admin.from("profiles").update({ job_title: d.jobTitle || null, phone: d.phone || null, company: d.company || null }).eq("id", userId);
  const { data: profile } = await admin.from("profiles").select("customer_no").eq("id", userId).maybeSingle();
  const cid = customerId(profile?.customer_no);

  let emailNote: string | undefined;
  if (d.mode === "invite") {
    const { data: link, error: linkError } = await admin.auth.admin.generateLink({ type: "recovery", email: d.email });
    if (linkError || !link.properties) {
      emailNote = "Account created, but the invite link couldn't be generated. Use “Send password reset” on their profile.";
    } else {
      const origin = await getOrigin();
      const url = `${origin}/auth/confirm?token_hash=${link.properties.hashed_token}&type=recovery&next=/reset-password`;
      const sent = await sendEmail({ to: d.email, ...accountInviteTemplate(d.firstName, cid, url) });
      if (!sent.ok) emailNote = `Account created, but the invite email failed: ${sent.error}`;
      else if (sent.redirected) emailNote = "Email is in test mode, so the invite went to the test inbox instead of the user.";
    }
  }

  await logAuthEvent("account_created", { userId, email: d.email });
  await recordAudit({ id: auth.user.id, email: auth.user.email }, "user.create", d.email, { role: d.role, mode: d.mode, customer: cid });
  return NextResponse.json({ ok: true, id: userId, customerId: cid, emailNote });
}
