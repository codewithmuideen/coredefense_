import { NextResponse } from "next/server";
import { createAdminClient, createEphemeralClient } from "@/lib/supabase/admin";
import { fail, readJson, requireUser } from "@/lib/auth/api";
import { recordAudit } from "@/lib/auth/events";

export async function POST(request: Request) {
  const auth = await requireUser();
  if (auth.response) return auth.response;
  const body = await readJson<{ password?: string; confirm?: string }>(request);
  if (body?.confirm !== "DELETE") return fail('Type DELETE to confirm.');

  const probe = createEphemeralClient();
  const { error: wrong } = await probe.auth.signInWithPassword({ email: auth.user.email!, password: body.password ?? "" });
  if (wrong) return fail("Your password is incorrect.", 401);
  await probe.auth.signOut({ scope: "local" });

  if (auth.user.app_metadata?.role === "admin") {
    const { count } = await createAdminClient().from("profiles").select("id", { count: "exact", head: true }).eq("role", "admin");
    if ((count ?? 0) <= 1) return fail("You're the only admin. Make someone else an admin before deleting your account.", 409);
  }

  await recordAudit({ id: auth.user.id, email: auth.user.email }, "account.self_delete", auth.user.email ?? auth.user.id);
  await auth.supabase.auth.signOut({ scope: "global" });
  // Profile, findings, tickets and notifications cascade from auth.users.
  const { error } = await createAdminClient().auth.admin.deleteUser(auth.user.id);
  if (error) return fail(error.message, 500);
  return NextResponse.json({ ok: true });
}
