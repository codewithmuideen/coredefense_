import "server-only";
import { createClient } from "@/lib/supabase/server";
import { fullName } from "@/lib/app/format";
import type { Viewer } from "@/lib/auth/session";
import type { ShellUser } from "@/components/app/AppShell";

export function toShellUser({ user, profile, isAdmin }: Viewer): ShellUser {
  return { id: user.id, name: fullName(profile), email: profile.email || user.email || "", avatarUrl: profile.avatar_url, jobTitle: profile.job_title, isAdmin };
}

export async function unreadCount(userId: string) {
  const supabase = await createClient();
  const { count } = await supabase.from("notifications").select("id", { count: "exact", head: true }).eq("user_id", userId).is("read_at", null);
  return count ?? 0;
}
