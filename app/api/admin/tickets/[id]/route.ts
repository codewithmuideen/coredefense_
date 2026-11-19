import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { fail, readJson, requireUser } from "@/lib/auth/api";
import { getOrigin } from "@/lib/auth/request-meta";
import { notify, recordAudit } from "@/lib/auth/events";
import { sendEmail } from "@/lib/email/send";
import { ticketReplyTemplate, ticketStatusTemplate } from "@/lib/email/templates";
import { PRIORITIES, PRIORITY, STATUSES, dueAtFor, ticketRef } from "@/lib/app/support";
import { TICKET_STATUS } from "@/lib/app/format";
import { loadTicket, ownerName } from "@/lib/app/tickets-server";

const schema = z.object({
  status: z.enum(STATUSES).optional(),
  priority: z.enum(PRIORITIES).optional(),
  reply: z.string().trim().min(1).max(8000).optional(),
  /** Internal notes are visible to admins only and never emailed. */
  internal: z.boolean().optional(),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireUser({ admin: true });
  if (auth.response) return auth.response;
  const { id } = await params;
  const parsed = schema.safeParse(await readJson(request));
  if (!parsed.success) return fail(parsed.error.issues[0].message);
  const { status, priority, reply, internal = false } = parsed.data;
  if (!status && !priority && !reply) return fail("Nothing to update.");

  const ticket = await loadTicket(id);
  if (!ticket) return fail("Ticket not found.", 404);

  const admin = createAdminClient();
  const now = new Date().toISOString();
  const staffName = [auth.user.user_metadata?.first_name, auth.user.user_metadata?.last_name].filter(Boolean).join(" ") || "CoreDefense team";
  const update: Record<string, unknown> = {};
  const publicReply = !!reply && !internal;

  if (reply) {
    const { error } = await admin.from("ticket_messages").insert({ ticket_id: id, author_id: auth.user.id, author_name: staffName, author_role: "staff", body: reply, internal });
    if (error) return fail(error.message, 500);
    if (publicReply) {
      update.last_activity_at = now;
      update.last_reply_by = "staff";
      if (!ticket.first_response_at) update.first_response_at = now;
      if (!status && (ticket.status === "open" || ticket.status === "in_progress")) update.status = "awaiting_customer";
    }
  }

  if (priority && priority !== ticket.priority) {
    update.priority = priority;
    // Until the first response, the target follows the urgency.
    if (!ticket.first_response_at && !update.first_response_at) update.due_at = dueAtFor(priority, ticket.created_at);
    await admin.from("ticket_messages").insert({ ticket_id: id, author_id: auth.user.id, author_role: "system", internal: true, body: `${staffName} changed urgency from ${PRIORITY[ticket.priority].label} to ${PRIORITY[priority].label}.` });
  }

  if (status && status !== ticket.status) {
    update.status = status;
    if (status === "resolved") update.resolved_at = now;
    if (status === "closed") update.closed_at = now;
    if (status === "open" || status === "in_progress") { update.resolved_at = null; update.closed_at = null; }
    await admin.from("ticket_messages").insert({ ticket_id: id, author_id: auth.user.id, author_role: "system", body: `${staffName} set the status to ${TICKET_STATUS[status].staffLabel.toLowerCase()}.` });
  }

  if (Object.keys(update).length) {
    const { error } = await admin.from("tickets").update(update).eq("id", id);
    if (error) return fail(error.message, 500);
  }

  // Tell the customer about public changes.
  const ref = ticketRef(ticket);
  const owner = ticket.profiles;
  const origin = await getOrigin();
  const link = `${origin}/dashboard/support?t=${id}`;
  if (publicReply) {
    await notify(ticket.user_id, { kind: "support", title: `Reply on ${ref}`, body: reply!.slice(0, 160), link: `/dashboard/support?t=${id}` });
    if (owner?.email) await sendEmail({ to: owner.email, ...ticketReplyTemplate(ownerName(owner), ticket.subject, reply!, link, ref) });
  }
  if (status === "resolved" || status === "closed") {
    const label = TICKET_STATUS[status].label;
    await notify(ticket.user_id, { kind: "support", title: `${label}: ${ref}`, body: ticket.subject, link: `/dashboard/support?t=${id}` });
    if (owner?.email && !publicReply) await sendEmail({ to: owner.email, ...ticketStatusTemplate(ownerName(owner), ref, ticket.subject, label, link) });
  }

  await recordAudit({ id: auth.user.id, email: auth.user.email }, reply ? (internal ? "ticket.note" : "ticket.reply") : "ticket.update", ref, { ...update, ...(reply ? { reply: reply.slice(0, 200) } : {}) });
  return NextResponse.json({ ok: true });
}
