import { NextResponse } from "next/server";
import { z } from "zod";
import { PASSWORD_RULES } from "@/lib/validations";
import { createEphemeralClient } from "@/lib/supabase/admin";
import { fail, readJson, requireUser } from "@/lib/auth/api";
import { alertSecurityChange, logAuthEvent } from "@/lib/auth/events";

const schema = z.object({
  current: z.string().min(1, "Enter your current password"),
  password: z.string().refine((p) => PASSWORD_RULES.every((r) => r.test(p)), "New password doesn't meet all the requirements"),
});

export async function POST(request: Request) {
  const auth = await requireUser();
  if (auth.response) return auth.response;

  const parsed = schema.safeParse(await readJson(request));
  if (!parsed.success) return fail(parsed.error.issues[0].message);
  if (parsed.data.current === parsed.data.password) return fail("Your new password must be different from the current one.");

  // Re-check the current password so a borrowed, unlocked laptop can't be used to take over the account.
  const probe = createEphemeralClient();
  const { error: wrong } = await probe.auth.signInWithPassword({ email: auth.user.email!, password: parsed.data.current });
  if (wrong) {
    await logAuthEvent("failed_password", { userId: auth.user.id, email: auth.user.email });
    return fail("Your current password is incorrect.", 401);
  }
  await probe.auth.signOut({ scope: "local" });

  const { error } = await auth.supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return fail(error.message);
  await auth.supabase.auth.signOut({ scope: "others" });
  await alertSecurityChange(auth.user, "Password changed", "password_changed");
  return NextResponse.json({ ok: true });
}
