import { NextResponse } from "next/server";
import { configGuard, fail, readJson, safeNext } from "@/lib/auth/api";
import { createClient } from "@/lib/supabase/server";
import { completeSignIn, logAuthEvent } from "@/lib/auth/events";

/** Second step for accounts with an authenticator app: lifts the aal1 session to aal2. */
export async function POST(request: Request) {
  const guard = configGuard();
  if (guard) return guard;

  const body = await readJson<{ code?: string; next?: string }>(request);
  const code = String(body?.code ?? "").replace(/\D/g, "");
  if (code.length !== 6) return fail("Enter the 6-digit code from your authenticator app.");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return fail("Your sign-in session has expired. Log in again.", 401, { restart: true });

  const { data: factors } = await supabase.auth.mfa.listFactors();
  const totp = factors?.totp?.find((f) => f.status === "verified");
  if (!totp) return NextResponse.json({ next: safeNext(body?.next) });

  const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId: totp.id, code });
  if (error) {
    await logAuthEvent("mfa_failed", { userId: user.id, email: user.email });
    return fail("That code didn't match. Codes change every 30 seconds, so use the current one.", 400);
  }

  await completeSignIn(user);
  return NextResponse.json({ next: safeNext(body?.next) });
}
