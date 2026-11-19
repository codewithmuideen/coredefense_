// Support desk vocabulary shared by the customer and admin screens and the API routes.
import type { Ticket, TicketPriority, TicketStatus } from "@/types/app";

export const TICKET_CATEGORIES = [
  "Complaint",
  "Advice",
  "Technical support",
  "Training & courses",
  "Account & access",
  "Billing",
  "Security incident",
  "Other",
] as const;
export type TicketCategory = (typeof TICKET_CATEGORIES)[number];

/** Urgency, highest first. `targetHours` is the first-response target (mirrors ticket_before_insert in schema.sql). */
export const PRIORITY: Record<TicketPriority, { label: string; target: string; targetHours: number; hint: string; badge: string; dot: string; rank: number }> = {
  crucial: {
    label: "Crucial",
    target: "within 1 hour",
    targetHours: 1,
    hint: "Business stopped, a live security incident, or people can't work at all.",
    badge: "bg-red-50 text-red-700 ring-red-600/15",
    dot: "#D03B3B",
    rank: 0,
  },
  urgent: {
    label: "Urgent",
    target: "within 4 hours",
    targetHours: 4,
    hint: "Something important is affected and needs attention today.",
    badge: "bg-orange-50 text-orange-700 ring-orange-600/15",
    dot: "#EC835A",
    rank: 1,
  },
  not_urgent: {
    label: "Not urgent",
    target: "within 1 working day",
    targetHours: 24,
    hint: "Questions, advice, feedback or anything that can wait.",
    badge: "bg-slate-100 text-slate-600 ring-slate-500/15",
    dot: "#8B95A7",
    rank: 2,
  },
};
export const PRIORITIES = ["crucial", "urgent", "not_urgent"] as const satisfies readonly TicketPriority[];
export const STATUSES = ["open", "in_progress", "awaiting_customer", "resolved", "closed"] as const satisfies readonly TicketStatus[];

/** Statuses where the team still owes the customer something. */
export const ACTIVE_STATUSES: TicketStatus[] = ["open", "in_progress", "awaiting_customer"];

export function customerId(no: number | null | undefined): string {
  return no ? `CD-${no}` : "CD-pending";
}

export function ticketRef(t: Pick<Ticket, "ref" | "id">): string {
  return t.ref ?? `#${t.id.slice(0, 8).toUpperCase()}`;
}

/** First-response target state: met, still due, or breached. */
export function slaState(t: Pick<Ticket, "due_at" | "first_response_at" | "status">, now = Date.now()) {
  if (t.first_response_at) {
    const met = !t.due_at || new Date(t.first_response_at) <= new Date(t.due_at);
    return { kind: met ? ("met" as const) : ("late" as const), label: met ? "Responded on time" : "Responded late" };
  }
  if (!t.due_at || t.status === "resolved" || t.status === "closed") return { kind: "none" as const, label: "" };
  const mins = Math.round((new Date(t.due_at).getTime() - now) / 60000);
  if (mins < 0) return { kind: "breached" as const, label: `Overdue by ${humanMins(-mins)}` };
  return { kind: mins <= 60 ? ("soon" as const) : ("due" as const), label: `Reply due in ${humanMins(mins)}` };
}

function humanMins(mins: number): string {
  if (mins < 60) return `${Math.max(1, mins)}m`;
  const h = Math.round(mins / 60);
  if (h < 48) return `${h}h`;
  return `${Math.round(h / 24)}d`;
}

export function dueAtFor(priority: TicketPriority, from: Date | string): string {
  return new Date(new Date(from).getTime() + PRIORITY[priority].targetHours * 3_600_000).toISOString();
}
