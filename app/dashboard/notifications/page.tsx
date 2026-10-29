import type { Metadata } from "next";
import { requireViewer } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/app/ui";
import NotificationsList from "@/components/app/NotificationsList";
import type { AppNotification } from "@/types/app";

export const metadata: Metadata = { title: "Notifications" };

export default async function NotificationsPage() {
  const { user } = await requireViewer();
  const supabase = await createClient();
  const { data } = await supabase.from("notifications").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(200);
  return (
    <>
      <PageHeader eyebrow="Workspace" title="Notifications" description="Security alerts, finding updates, support replies and announcements from the CoreDefense team." />
      <NotificationsList initial={(data ?? []) as AppNotification[]} />
    </>
  );
}
