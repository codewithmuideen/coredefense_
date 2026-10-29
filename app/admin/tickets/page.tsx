import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { PageHeader } from "@/components/app/ui";
import TicketInbox, { type AdminTicket } from "@/components/app/TicketInbox";

export const metadata: Metadata = { title: "Support tickets" };
export const dynamic = "force-dynamic";

export default async function AdminTicketsPage() {
  const { data } = await createAdminClient()
    .from("tickets")
    .select("*, profiles(email, first_name, last_name, company, avatar_url)")
    .order("created_at", { ascending: false })
    .limit(500);
  return (
    <>
      <PageHeader eyebrow="Admin console" title="Support tickets" description="Reply to customers, change status and keep urgent requests moving. Replies are emailed and appear in the customer's notifications." />
      <TicketInbox initial={(data ?? []) as AdminTicket[]} />
    </>
  );
}
