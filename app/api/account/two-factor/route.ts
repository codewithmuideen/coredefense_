import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { fail, readJson, requireUser } from "@/lib/auth/api";
import { alertSecurityChange } from "@/lib/auth/events";

type Action = "email-on" | "email-off" | "totp-enrolled" | "totp-removed";

/**
 * Email codes are a server-side flag in app_metadata, which users can't edit directly.
 * Authenticator apps are enrolled in the browser with Supabase MFA; this route confirms the change and sends the alert.
 */
export async function POST(request: Request) {
  const auth = await requireUser();
  if (auth.response) return auth.response;
  const body = await readJson<{ action?: Action }>(request);
  const { user, supabase } = auth;

  switch (body?.action) {
    case "email-on":
    case "email-off": {
      const on = body.action === "email-on";
      const { error } = await createAdminClient().auth.admin.updateUserById(user.id, {
        app_metadata: { ...user.app_metadata, email_2fa: on },
      });
      if (error) return fail(error.message, 500);
      await alertSecurityChange(user, on ? "Email sign-in codes turned on" : "Email sign-in codes turned off", on ? "email_2fa_on" : "email_2fa_off");
      return NextResponse.json({ ok: true, emailCodes: on });
    }
    case "totp-enrolled":
    case "totp-removed": {
      const { data } = await supabase.auth.mfa.listFactors();
      const has = (data?.totp ?? []).some((f) => f.status === "verified");
      const expected = body.action === "totp-enrolled";
      if (has !== expected) return fail("Authenticator status didn't change. Refresh and try again.", 409);
      await alertSecurityChange(user, expected ? "Authenticator app added" : "Authenticator app removed", expected ? "totp_on" : "totp_off");
      return NextResponse.json({ ok: true });
    }
    default:
      return fail("Unknown action.");
  }
}
