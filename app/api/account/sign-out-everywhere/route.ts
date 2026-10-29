import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/api";
import { alertSecurityChange } from "@/lib/auth/events";

export async function POST() {
  const auth = await requireUser();
  if (auth.response) return auth.response;
  await alertSecurityChange(auth.user, "Signed out of all devices", "signed_out_everywhere");
  await auth.supabase.auth.signOut({ scope: "global" });
  return NextResponse.json({ ok: true });
}
