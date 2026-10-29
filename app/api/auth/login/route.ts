import { NextResponse } from "next/server";
import { loginSchema } from "@/lib/validations";
import { createAdminClient, createEphemeralClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { configGuard, fail, maskEmail, readJson, safeNext, setRememberCookie } from "@/lib/auth/api";
import { completeSignIn, logAuthEvent } from "@/lib/auth/events";
import { startEmailChallenge } from "@/lib/auth/challenge";

const LOCKOUT_WINDOW_MINUTES = 15;
const LOCKOUT_THRESHOLD = 8;

export async function POST(request: Request) {
  const guard = configGuard();
  if (guard) return guard;

  const body = await readJson<{ next?: string }>(request);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Enter your email and password.");
  const email = parsed.data.email.toLowerCase();
  const remember = parsed.data.remember ?? false;
  const next = safeNext(body?.next);

  // Brute-force brake: too many recent failures for this address pauses sign-in for it.
  const since = new Date(Date.now() - LOCKOUT_WINDOW_MINUTES * 60_000).toISOString();
  const { count } = await createAdminClient()
    .from("login_events")
    .select("id", { count: "exact", head: true })
    .eq("email", email)
    .in("event", ["failed_password", "code_failed", "mfa_failed"])
    .gte("created_at", since);
  if ((count ?? 0) >= LOCKOUT_THRESHOLD) {
    await logAuthEvent("locked_out", { email });
    return fail(`Too many failed attempts. For your security, sign-in for this account is paused for ${LOCKOUT_WINDOW_MINUTES} minutes.`, 429);
  }

  // Check the password without giving the browser a session yet.
  const probe = createEphemeralClient();
  const { data, error } = await probe.auth.signInWithPassword({ email, password: parsed.data.password });
  if (error || !data.user) {
    const msg = error?.message ?? "";
    if (/email not confirmed/i.test(msg)) {
      return fail("Confirm your email first. We can send the confirmation link again.", 403, { code: "unconfirmed" });
    }
    if (/banned/i.test(msg)) {
      return fail("This account is suspended. Contact info@coredefense.co.uk if you think this is a mistake.", 403);
    }
    await logAuthEvent("failed_password", { email });
    return fail("Email or password is incorrect.", 401);
  }
  await probe.auth.signOut({ scope: "local" });

  const user = data.user;
  const hasTotp = (user.factors ?? []).some((f) => f.factor_type === "totp" && f.status === "verified");
  const emailCodes = user.app_metadata?.email_2fa !== false;

  await setRememberCookie(remember);

  // 1. Authenticator app enrolled: start an aal1 session, the /login/mfa step lifts it to aal2.
  if (hasTotp) {
    const supabase = await createClient({ remember });
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password: parsed.data.password });
    if (signInError) return fail(signInError.message, 500);
    return NextResponse.json({ next: `/login/mfa?next=${encodeURIComponent(next)}` });
  }

  // 2. Email codes (the default): no session until the code is entered.
  if (emailCodes) {
    const sent = await startEmailChallenge(user, { remember, next });
    if (!sent.ok) return fail(`We couldn't send your sign-in code: ${sent.error}`, 502);
    return NextResponse.json({ next: "/login/verify", email: maskEmail(email), redirected: sent.redirected, logged: sent.logged });
  }

  // 3. Second factor turned off by the user: password alone.
  const supabase = await createClient({ remember });
  const { data: session, error: signInError } = await supabase.auth.signInWithPassword({ email, password: parsed.data.password });
  if (signInError || !session.user) return fail(signInError?.message ?? "Sign-in failed.", 500);
  await completeSignIn(session.user);
  return NextResponse.json({ next });
}
