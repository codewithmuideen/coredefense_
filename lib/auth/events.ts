import "server-only";
import type { User } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";
import { getOrigin, getRequestMeta, type RequestMeta } from "@/lib/auth/request-meta";
import { sendEmail } from "@/lib/email/send";
import { newSignInTemplate, securityChangeTemplate } from "@/lib/email/templates";

export type AuthEvent =
  | "sign_in"
  | "sign_out"
  | "failed_password"
  | "code_sent"
  | "code_failed"
  | "mfa_failed"
  | "locked_out"
  | "password_reset_requested"
  | "password_changed"
  | "email_2fa_on"
  | "email_2fa_off"
  | "totp_on"
  | "totp_off"
  | "signed_out_everywhere"
  | "account_created"
  | "email_confirmed";

export async function logAuthEvent(event: AuthEvent, opts: { userId?: string | null; email?: string | null; meta?: RequestMeta }) {
  try {
    const meta = opts.meta ?? (await getRequestMeta());
    await createAdminClient().from("login_events").insert({
      user_id: opts.userId ?? null,
      email: opts.email?.toLowerCase() ?? null,
      event,
      ip: meta.ip,
      user_agent: meta.userAgent.slice(0, 400),
      device: meta.device,
      location: meta.location,
    });
  } catch (err) {
    console.error("[auth] could not record event", event, err);
  }
}

export async function notify(userId: string, n: { title: string; body: string; kind?: "security" | "finding" | "system" | "support"; link?: string }) {
  try {
    await createAdminClient().from("notifications").insert({ user_id: userId, kind: n.kind ?? "system", title: n.title, body: n.body, link: n.link ?? null });
  } catch (err) {
    console.error("[auth] could not create notification", err);
  }
}

export async function recordAudit(actor: { id: string; email?: string | null }, action: string, target: string | null, detail: Record<string, unknown> = {}) {
  try {
    await createAdminClient().from("audit_log").insert({ actor_id: actor.id, actor_email: actor.email ?? null, action, target, detail });
  } catch (err) {
    console.error("[audit] could not record", action, err);
  }
}

export function displayName(user: Pick<User, "email" | "user_metadata">) {
  return (user.user_metadata?.first_name as string | undefined) || user.email?.split("@")[0] || "there";
}

/** Everything that should happen once a sign-in is fully complete (password + any second factor). */
export async function completeSignIn(user: User) {
  const meta = await getRequestMeta();
  const origin = await getOrigin();
  await logAuthEvent("sign_in", { userId: user.id, email: user.email, meta });
  await notify(user.id, { kind: "security", title: "New sign-in", body: `${meta.device} · ${meta.location}`, link: "/dashboard/security" });

  const { data: profile } = await createAdminClient().from("profiles").select("notify_sign_in").eq("id", user.id).maybeSingle();
  if (profile?.notify_sign_in !== false && user.email) {
    const tpl = newSignInTemplate(displayName(user), meta, `${origin}/dashboard/security`);
    await sendEmail({ to: user.email, ...tpl });
  }
}

/** Security changes always email the owner, whatever their notification preferences. */
export async function alertSecurityChange(user: User, change: string, event: AuthEvent) {
  const meta = await getRequestMeta();
  const origin = await getOrigin();
  await logAuthEvent(event, { userId: user.id, email: user.email, meta });
  await notify(user.id, { kind: "security", title: change, body: `${meta.device} · ${meta.location}`, link: "/dashboard/security" });
  if (user.email) {
    await sendEmail({ to: user.email, ...securityChangeTemplate(displayName(user), change, meta, `${origin}/dashboard/security`) });
  }
}
