import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { fail, readJson, requireUser } from "@/lib/auth/api";
import { getOrigin } from "@/lib/auth/request-meta";
import { displayName, notify, recordAudit } from "@/lib/auth/events";
import { sendEmail } from "@/lib/email/send";
import { passwordResetTemplate } from "@/lib/email/templates";

type Action = "make-admin" | "make-user" | "suspend" | "reactivate" | "reset-mfa" | "send-reset";
const SELF_BLOCKED: Action[] = ["make-user", "suspend"];

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireUser({ admin: true });
  if (auth.response) return auth.response;
  const { id } = await params;
  const body = await readJson<{ action?: Action }>(request);
  const action = body?.action;
  if (!action) return fail("Unknown action.");
  if (id === auth.user.id && SELF_BLOCKED.includes(action)) return fail("You can't do that to your own account.", 409);

  const admin = createAdminClient();
  const { data: target, error: findError } = await admin.auth.admin.getUserById(id);
  if (findError || !target.user) return fail("User not found.", 404);
  const user = target.user;
  const actor = { id: auth.user.id, email: auth.user.email };

  switch (action) {
    case "make-admin":
    case "make-user": {
      const role = action === "make-admin" ? "admin" : "user";
      const { error } = await admin.auth.admin.updateUserById(id, { app_metadata: { ...user.app_metadata, role } });
      if (error) return fail(error.message, 500);
      await notify(id, { kind: "security", title: role === "admin" ? "You're now an admin" : "Admin access removed", body: `Changed by ${auth.user.email}` });
      break;
    }
    case "suspend":
    case "reactivate": {
      const suspend = action === "suspend";
      const { error } = await admin.auth.admin.updateUserById(id, { ban_duration: suspend ? "876000h" : "none" });
      if (error) return fail(error.message, 500);
      await admin.from("profiles").update({ status: suspend ? "suspended" : "active" }).eq("id", id);
      // A ban stops refreshes; also end the sessions that are live right now.
      if (suspend) await admin.from("login_challenges").update({ consumed_at: new Date().toISOString() }).eq("user_id", id).is("consumed_at", null);
      break;
    }
    case "reset-mfa": {
      const { data } = await admin.auth.admin.mfa.listFactors({ userId: id });
      for (const f of data?.factors ?? []) await admin.auth.admin.mfa.deleteFactor({ userId: id, id: f.id });
      await admin.auth.admin.updateUserById(id, { app_metadata: { ...user.app_metadata, email_2fa: true } });
      await notify(id, { kind: "security", title: "Two-factor reset by an admin", body: "Email codes are back on. Add your authenticator app again from Security." , link: "/dashboard/security" });
      break;
    }
    case "send-reset": {
      const { data, error } = await admin.auth.admin.generateLink({ type: "recovery", email: user.email! });
      if (error || !data.properties) return fail(error?.message ?? "Couldn't create a reset link.", 500);
      const origin = await getOrigin();
      const link = `${origin}/auth/confirm?token_hash=${data.properties.hashed_token}&type=recovery&next=/reset-password`;
      const sent = await sendEmail({ to: user.email!, ...passwordResetTemplate(displayName(user), link) });
      if (!sent.ok) return fail(`Email failed: ${sent.error}`, 502);
      break;
    }
    default:
      return fail("Unknown action.");
  }

  await recordAudit(actor, `user.${action}`, user.email ?? id);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireUser({ admin: true });
  if (auth.response) return auth.response;
  const { id } = await params;
  if (id === auth.user.id) return fail("Delete your own account from your profile instead.", 409);

  const admin = createAdminClient();
  const { data: target } = await admin.auth.admin.getUserById(id);
  const { error } = await admin.auth.admin.deleteUser(id);
  if (error) return fail(error.message, 500);
  await recordAudit({ id: auth.user.id, email: auth.user.email }, "user.delete", target.user?.email ?? id);
  return NextResponse.json({ ok: true });
}
