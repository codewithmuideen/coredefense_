import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { configGuard, fail, readJson } from "@/lib/auth/api";
import { getOrigin } from "@/lib/auth/request-meta";
import { displayName } from "@/lib/auth/events";
import { sendEmail } from "@/lib/email/send";
import { verifyEmailTemplate } from "@/lib/email/templates";

const schema = z.object({ email: z.string().trim().email() });

export async function POST(request: Request) {
  const guard = configGuard();
  if (guard) return guard;
  const parsed = schema.safeParse(await readJson(request));
  if (!parsed.success) return fail("Enter a valid email address.");
  const email = parsed.data.email.toLowerCase();

  // A magic link confirms the address when followed, so it doubles as a fresh confirmation link.
  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.generateLink({ type: "magiclink", email });
  if (!error && data.properties && !data.user.email_confirmed_at) {
    const origin = await getOrigin();
    const link = `${origin}/auth/confirm?token_hash=${data.properties.hashed_token}&type=magiclink&next=/dashboard`;
    const sent = await sendEmail({ to: email, ...verifyEmailTemplate(displayName(data.user), link) });
    if (!sent.ok) return fail(`We couldn't send the email: ${sent.error}`, 502);
  }
  return NextResponse.json({ ok: true });
}
