import "server-only";
import { cookies } from "next/headers";
import type { User } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";
import { CHALLENGE_COOKIE, CODE_TTL_MINUTES, generateCode, hashCode } from "@/lib/auth/codes";
import { displayName, logAuthEvent } from "@/lib/auth/events";
import { getRequestMeta } from "@/lib/auth/request-meta";
import { sendEmail, type SendEmailResult } from "@/lib/email/send";
import { loginCodeTemplate } from "@/lib/email/templates";

/** Starts (or restarts) an email sign-in challenge: stores a hashed code, emails it and pins the challenge to this browser. */
export async function startEmailChallenge(user: User, opts: { remember: boolean; next: string }): Promise<SendEmailResult> {
  const admin = createAdminClient();
  // Only one live challenge per user.
  await admin.from("login_challenges").update({ consumed_at: new Date().toISOString() }).eq("user_id", user.id).is("consumed_at", null);

  const id = crypto.randomUUID();
  const code = generateCode();
  const expires = new Date(Date.now() + CODE_TTL_MINUTES * 60_000);
  const { error } = await admin.from("login_challenges").insert({
    id,
    user_id: user.id,
    code_hash: hashCode(id, code),
    remember: opts.remember,
    next_path: opts.next,
    expires_at: expires.toISOString(),
  });
  if (error) throw error;

  const store = await cookies();
  store.set(CHALLENGE_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: CODE_TTL_MINUTES * 60,
  });

  const meta = await getRequestMeta();
  await logAuthEvent("code_sent", { userId: user.id, email: user.email, meta });
  return sendEmail({ to: user.email!, ...loginCodeTemplate(displayName(user), code, meta) });
}
