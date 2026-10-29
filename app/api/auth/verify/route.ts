import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { configGuard, fail, readJson, safeNext } from "@/lib/auth/api";
import { CHALLENGE_COOKIE, MAX_CODE_ATTEMPTS, codesMatch } from "@/lib/auth/codes";
import { completeSignIn, logAuthEvent } from "@/lib/auth/events";

export async function POST(request: Request) {
  const guard = configGuard();
  if (guard) return guard;

  const body = await readJson<{ code?: string }>(request);
  const code = String(body?.code ?? "").replace(/\D/g, "");
  if (code.length !== 6) return fail("Enter the 6-digit code from your email.");

  const store = await cookies();
  const challengeId = store.get(CHALLENGE_COOKIE)?.value;
  if (!challengeId) return fail("Your sign-in code has expired. Log in again to get a new one.", 410, { restart: true });

  const admin = createAdminClient();
  const { data: challenge } = await admin.from("login_challenges").select("*").eq("id", challengeId).maybeSingle();
  if (!challenge || challenge.consumed_at || new Date(challenge.expires_at) < new Date()) {
    store.delete(CHALLENGE_COOKIE);
    return fail("Your sign-in code has expired. Log in again to get a new one.", 410, { restart: true });
  }

  if (!codesMatch(challengeId, code, challenge.code_hash)) {
    const attempts = challenge.attempts + 1;
    const exhausted = attempts >= MAX_CODE_ATTEMPTS;
    await admin
      .from("login_challenges")
      .update({ attempts, ...(exhausted ? { consumed_at: new Date().toISOString() } : {}) })
      .eq("id", challengeId);
    const { data: owner } = await admin.auth.admin.getUserById(challenge.user_id);
    await logAuthEvent("code_failed", { userId: challenge.user_id, email: owner.user?.email });
    if (exhausted) {
      store.delete(CHALLENGE_COOKIE);
      return fail("Too many incorrect codes. Log in again to get a new one.", 429, { restart: true });
    }
    const left = MAX_CODE_ATTEMPTS - attempts;
    return fail(`That code isn't right. ${left} ${left === 1 ? "try" : "tries"} left.`, 400);
  }

  await admin.from("login_challenges").update({ consumed_at: new Date().toISOString() }).eq("id", challengeId);
  store.delete(CHALLENGE_COOKIE);

  // The code proves the second factor; mint the session server-side from a one-time magic-link token.
  const { data: owner } = await admin.auth.admin.getUserById(challenge.user_id);
  if (!owner.user?.email) return fail("This account no longer exists.", 404);
  const { data: link, error: linkError } = await admin.auth.admin.generateLink({ type: "magiclink", email: owner.user.email });
  if (linkError || !link.properties) return fail("We couldn't finish signing you in. Please try again.", 500);

  const supabase = await createClient({ remember: challenge.remember });
  const { data: session, error } = await supabase.auth.verifyOtp({ type: "magiclink", token_hash: link.properties.hashed_token });
  if (error || !session.user) return fail(error?.message ?? "We couldn't finish signing you in.", 500);

  await completeSignIn(session.user);
  return NextResponse.json({ next: safeNext(challenge.next_path) });
}
