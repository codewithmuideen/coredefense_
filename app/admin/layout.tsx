import type { Metadata } from "next";
import AppShell from "@/components/app/AppShell";
import { requireAdmin } from "@/lib/auth/session";
import { toShellUser, unreadCount } from "@/lib/app/shell";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | CoreDefense Admin" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const viewer = await requireAdmin();
  const [unread, { count: openTickets }] = await Promise.all([
    unreadCount(viewer.user.id),
    createAdminClient().from("tickets").select("id", { count: "exact", head: true }).eq("status", "open"),
  ]);
  return (
    <AppShell variant="admin" user={toShellUser(viewer)} unread={unread} openTickets={openTickets ?? 0}>
      {children}
    </AppShell>
  );
}
