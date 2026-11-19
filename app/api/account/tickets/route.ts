import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { fail, readJson, requireUser } from "@/lib/auth/api";
import { getOrigin } from "@/lib/auth/request-meta";
import { sendEmail } from "@/lib/email/send";
import { ticketReceivedTemplate } from "@/lib/email/templates";
import { PRIORITIES, PRIORITY, TICKET_CATEGORIES } from "@/lib/app/support";
import { alertStaff, loadTicket, ownerName } from "@/lib/app/tickets-server";

const schema = z.object({
  subject: z.string().trim().min(3, "Add a short subject").max(140),
  category: z.enum(TICKET_CATEGORIES),
  priority: z.enum(PRIORITIES),
  message: z.string().trim().min(10, "Tell us a little more (10 characters minimum)").max(4000),
});

export async function POST(request: Request) {
  const auth = await requireUser();
  if (auth.response) return auth.response;
  const parsed = schema.safeParse(await readJson(request));
  if (!parsed.success) return fail(parsed.error.issues[0].message);

  // Inserted by the server; the database trigger assigns the reference (CD-10001-0001) and response target.
  const admin = createAdminClient();
  const { data: created, error } = await admin
    .from("tickets")
    .insert({ ...parsed.data, user_id: auth.user.id, status: "open" })
    .select("id")
    .single();
  if (error) return fail(error.message, 500);

  const ticket = await loadTicket(created.id);
  if (!ticket) return fail("Ticket was created but couldn't be loaded.", 500);

  await auth.supabase.from("activity").insert({ user_id: auth.user.id, action: `Opened support ticket ${ticket.ref}`, detail: ticket.subject });

  const p = PRIORITY[ticket.priority];
  const origin = await getOrigin();
  if (ticket.profiles?.email) {
    await sendEmail({
      to: ticket.profiles.email,
      ...ticketReceivedTemplate(ownerName(ticket.profiles), ticket.ref ?? "", ticket.subject, p.label, p.target, `${origin}/dashboard/support?t=${ticket.id}`),
    });
  }
  await alertStaff(ticket, "New ticket", ticket.message);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- the client only needs the ticket row
  const { profiles: _owner, ...plain } = ticket;
  return NextResponse.json({ ok: true, ticket: plain });
}
