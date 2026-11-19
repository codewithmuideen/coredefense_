import type { Metadata } from "next";
import { requireViewer } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/app/ui";
import SupportCenter from "@/components/app/SupportCenter";
import { customerId } from "@/lib/app/support";
import type { Ticket, TicketMessage } from "@/types/app";

export const metadata: Metadata = { title: "Support" };
export const dynamic = "force-dynamic";

export default async function SupportPage({ searchParams }: { searchParams: Promise<{ new?: string; t?: string }> }) {
  const params = await searchParams;
  const { user, profile } = await requireViewer();
  const supabase = await createClient();
  // Messages are embedded in each ticket; Row Level Security hides internal staff notes from customers.
  const { data } = await supabase.from("tickets").select("*, ticket_messages(*)").eq("user_id", user.id).order("last_activity_at", { ascending: false });
  const rows = (data ?? []) as (Ticket & { ticket_messages: TicketMessage[] })[];
  const tickets: Ticket[] = rows.map((r) => Object.fromEntries(Object.entries(r).filter(([k]) => k !== "ticket_messages")) as typeof r);
  const messages = rows.flatMap((r) => r.ticket_messages ?? []).sort((a, b) => a.created_at.localeCompare(b.created_at));
  return (
    <>
      <PageHeader
        eyebrow="Workspace"
        title="Support"
        description="Raise a complaint, ask for advice, get help with training or report a security problem. Each request gets a reference number, and its urgency sets how fast we respond."
      />
      <SupportCenter
        initial={tickets}
        messages={messages}
        customerId={customerId(profile.customer_no)}
        startOpen={params.new === "1"}
        selectedId={params.t}
      />
    </>
  );
}
