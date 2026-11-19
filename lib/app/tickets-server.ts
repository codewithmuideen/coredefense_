import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { getOrigin } from "@/lib/auth/request-meta";
import { notify } from "@/lib/auth/events";
import { sendEmail } from "@/lib/email/send";
import { broadcastTemplate } from "@/lib/email/templates";
import { PRIORITY, customerId, ticketRef } from "@/lib/app/support";
import type { Ticket } from "@/types/app";

export interface TicketOwner {
  email: string;
  first_name: string | null;
  last_name: string | null;
  customer_no: number | null;
}

export type TicketWithOwner = Ticket & { profiles: TicketOwner | null };

export async function loadTicket(id: string): Promise<TicketWithOwner | null> {
  const { data } = await createAdminClient()
    .from("tickets")
    .select("*, profiles(email, first_name, last_name, customer_no)")
    .eq("id", id)
    .maybeSingle();
  return (data as TicketWithOwner | null) ?? null;
}

export function ownerName(owner: TicketOwner | null): string {
  return [owner?.first_name, owner?.last_name].filter(Boolean).join(" ") || owner?.email?.split("@")[0] || "there";
}

/** Tell every admin about a ticket event. Crucial and urgent tickets are also emailed. */
export async function alertStaff(ticket: TicketWithOwner, headline: string, body: string, opts: { email?: boolean } = {}) {
  const admin = createAdminClient();
  const { data: admins } = await admin.from("profiles").select("id, email").eq("role", "admin");
  const ref = ticketRef(ticket);
  const p = PRIORITY[ticket.priority];
  const who = `${ownerName(ticket.profiles)} (${customerId(ticket.profiles?.customer_no)})`;
  const shouldEmail = opts.email ?? ticket.priority !== "not_urgent";
  const origin = await getOrigin();
  const link = `${origin}/admin/tickets?t=${ticket.id}`;
  for (const a of admins ?? []) {
    await notify(a.id, { kind: "support", title: `${headline} · ${ref}`, body: `${p.label} · ${who}: ${ticket.subject}`, link: `/admin/tickets?t=${ticket.id}` });
    if (shouldEmail && a.email) {
      await sendEmail({
        to: a.email,
        ...broadcastTemplate(`[${p.label.toUpperCase()}] ${ref} ${headline}: ${ticket.subject}`, `${who} · ${ticket.category}\nRespond ${p.target}.\n\n${body}`, link),
      });
    }
  }
}
