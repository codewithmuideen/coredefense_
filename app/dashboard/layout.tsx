import type { Metadata } from "next";
import AppShell from "@/components/app/AppShell";
import { requireViewer } from "@/lib/auth/session";
import { toShellUser, unreadCount } from "@/lib/app/shell";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s | CoreDefense" },
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const viewer = await requireViewer();
  const supabase = await createClient();
  const [unread, { count: openFindings }] = await Promise.all([
    unreadCount(viewer.user.id),
    supabase.from("findings").select("id", { count: "exact", head: true }).eq("user_id", viewer.user.id).in("status", ["open", "in_progress"]),
  ]);
  return (
    <AppShell variant="user" user={toShellUser(viewer)} unread={unread} openFindings={openFindings ?? 0}>
      {children}
    </AppShell>
  );
}
