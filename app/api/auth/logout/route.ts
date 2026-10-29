import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { logAuthEvent } from "@/lib/auth/events";

export async function POST() {
  if (!isSupabaseConfigured()) return NextResponse.json({ ok: true });
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  await supabase.auth.signOut({ scope: "local" });
  if (user) await logAuthEvent("sign_out", { userId: user.id, email: user.email });
  return NextResponse.json({ ok: true });
}
