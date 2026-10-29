import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { configGuard, fail, readJson } from "@/lib/auth/api";
import { getOrigin } from "@/lib/auth/request-meta";
import { displayName, logAuthEvent } from "@/lib/auth/events";
import { sendEmail } from "@/lib/email/send";
import { passwordResetTemplate } from "@/lib/email/templates";

const schema = z.object({ email: z.string().trim().email("Enter a valid email address") });

/** Always answers the same way, so the form can't be used to discover which emails have accounts. */
export async function POST(request: Request) {
  const guard = configGuard();
  if (guard) return guard;

  const parsed = schema.safeParse(await readJson(request));
  if (!parsed.success) return fail(parsed.error.issues[0].message);
  const email = parsed.data.email.toLowerCase();

  const admin = createAdminClient();
  const since = new Date(Date.now() - 60 * 60_000).toISOString();
  const { count } = await admin
    .from("login_events")
    .select("id", { count: "exact", head: true })
    .eq("email", email)
    .eq("event", "password_reset_requested")
    .gte("created_at", since);

  let emailError: string | undefined;
  if ((count ?? 0) < 3) {
    const { data, error } = await admin.auth.admin.generateLink({ type: "recovery", email });
    if (!error && data.properties) {
      const origin = await getOrigin();
      const link = `${origin}/auth/confirm?token_hash=${data.properties.hashed_token}&type=recovery&next=/reset-password`;
      const sent = await sendEmail({ to: email, ...passwordResetTemplate(displayName(data.user), link) });
      if (!sent.ok) emailError = sent.error;
      await logAuthEvent("password_reset_requested", { userId: data.user.id, email });
    }
  }

  // Delivery problems are a server configuration issue, not an account-existence signal, so surface them in development.
  return NextResponse.json({ ok: true, ...(emailError && process.env.NODE_ENV !== "production" ? { emailError } : {}) });
}
