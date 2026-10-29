import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { configGuard, fail, maskEmail, safeNext } from "@/lib/auth/api";
import { CHALLENGE_COOKIE, RESEND_COOLDOWN_SECONDS } from "@/lib/auth/codes";
import { startEmailChallenge } from "@/lib/auth/challenge";

export async function POST() {
  const guard = configGuard();
  if (guard) return guard;

  const store = await cookies();
  const challengeId = store.get(CHALLENGE_COOKIE)?.value;
  if (!challengeId) return fail("Your sign-in session has expired. Log in again.", 410, { restart: true });

  const admin = createAdminClient();
  const { data: challenge } = await admin.from("login_challenges").select("*").eq("id", challengeId).maybeSingle();
  if (!challenge) return fail("Your sign-in session has expired. Log in again.", 410, { restart: true });

  const age = (Date.now() - new Date(challenge.created_at).getTime()) / 1000;
  if (age < RESEND_COOLDOWN_SECONDS) {
    return fail(`Please wait ${Math.ceil(RESEND_COOLDOWN_SECONDS - age)} seconds before asking for another code.`, 429);
  }

  const { data: owner } = await admin.auth.admin.getUserById(challenge.user_id);
  if (!owner.user?.email) return fail("This account no longer exists.", 404);

  const sent = await startEmailChallenge(owner.user, { remember: challenge.remember, next: safeNext(challenge.next_path) });
  if (!sent.ok) return fail(`We couldn't send a new code: ${sent.error}`, 502);
  return NextResponse.json({ ok: true, email: maskEmail(owner.user.email), redirected: sent.redirected });
}
