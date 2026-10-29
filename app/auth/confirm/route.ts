import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { safeNext, setRememberCookie } from "@/lib/auth/api";
import { completeSignIn, displayName, logAuthEvent } from "@/lib/auth/events";
import { sendEmail } from "@/lib/email/send";
import { welcomeTemplate } from "@/lib/email/templates";

/** Landing point for every emailed link (confirm email, password reset). Exchanges the one-time token for a session. */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = safeNext(searchParams.get("next"));

  const failTo = (reason: string) => NextResponse.redirect(new URL(`/login?error=${reason}`, origin));
  if (!isSupabaseConfigured()) return failTo("not-configured");
  if (!tokenHash || !type) return failTo("invalid-link");

  await setRememberCookie(type !== "recovery");
  const supabase = await createClient({ remember: type !== "recovery" });
  const { data, error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
  if (error || !data.user) return failTo("link-expired");

  if (type === "recovery") {
    return NextResponse.redirect(new URL("/reset-password", origin));
  }

  // First confirmation: welcome email and a recorded sign-in.
  const confirmedJustNow = data.user.email_confirmed_at && Date.now() - new Date(data.user.email_confirmed_at).getTime() < 5 * 60_000;
  if (confirmedJustNow && data.user.email) {
    await logAuthEvent("email_confirmed", { userId: data.user.id, email: data.user.email });
    await sendEmail({ to: data.user.email, ...welcomeTemplate(displayName(data.user), `${origin}/dashboard`) });
  }
  await completeSignIn(data.user);
  return NextResponse.redirect(new URL(`${next}${next.includes("?") ? "&" : "?"}welcome=1`, origin));
}
