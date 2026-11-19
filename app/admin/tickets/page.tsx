import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { PageHeader } from "@/components/app/ui";
import TicketInbox, { type AdminTicket } from "@/components/app/TicketInbox";
import type { TicketMessage } from "@/types/app";

export const metadata: Metadata = { title: "Support tickets" };
export const dynamic = "force-dynamic";

export default async function AdminTicketsPage({ searchParams }: { searchParams: Promise<{ t?: string }> }) {
  const { t } = await searchParams;
  const admin = createAdminClient();
  const { data } = await admin
    .from("tickets")
    .select("*, profiles(email, first_name, last_name, company, avatar_url, customer_no), ticket_messages(*)")
    .order("last_activity_at", { ascending: false })
    .limit(500);
  // Messages come embedded in each ticket (one query), then flattened for the inbox.
  const rows = (data ?? []) as (AdminTicket & { ticket_messages: TicketMessage[] })[];
  const tickets: AdminTicket[] = rows.map((r) => Object.fromEntries(Object.entries(r).filter(([k]) => k !== "ticket_messages")) as typeof r);
  const messages = rows.flatMap((r) => r.ticket_messages ?? []).sort((a, b) => a.created_at.localeCompare(b.created_at));
  return (
    <>
      <PageHeader
        eyebrow="Admin console"
        title="Support desk"
        description="Every complaint, advice request and support ticket, sorted by urgency and response target. Replies are emailed with the ticket reference; internal notes stay between admins."
      />
      <TicketInbox initial={tickets} messages={messages} selectedId={t} />
    </>
  );
}
