import { NextResponse } from "next/server";
import { z } from "zod";
import { PASSWORD_RULES } from "@/lib/validations";
import { fail, readJson, requireUser } from "@/lib/auth/api";
import { alertSecurityChange } from "@/lib/auth/events";

const schema = z.object({
  password: z.string().refine((p) => PASSWORD_RULES.every((r) => r.test(p)), "Password doesn't meet all the requirements"),
});

/** Sets a new password from the session created by the recovery link, then signs out every other device. */
export async function POST(request: Request) {
  const auth = await requireUser();
  if (auth.response) return auth.response;

  const parsed = schema.safeParse(await readJson(request));
  if (!parsed.success) return fail(parsed.error.issues[0].message);

  const { error } = await auth.supabase.auth.updateUser({ password: parsed.data.password });
  if (error) {
    return fail(/different from the old/i.test(error.message) ? "Choose a password you haven't used for this account before." : error.message);
  }
  await auth.supabase.auth.signOut({ scope: "others" });
  await alertSecurityChange(auth.user, "Password reset", "password_changed");
  return NextResponse.json({ ok: true });
}
