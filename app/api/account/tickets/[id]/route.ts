import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { fail, readJson, requireUser } from "@/lib/auth/api";
import { alertStaff, loadTicket, ownerName } from "@/lib/app/tickets-server";

// Customer actions on their own ticket: reply, mark resolved, reopen, rate.
const schema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("reply"), body: z.string().trim().min(1, "Write a message first").max(8000) }),
  z.object({ action: z.literal("resolve") }),
  z.object({ action: z.literal("reopen"), body: z.string().trim().max(8000).optional() }),
  z.object({ action: z.literal("rate"), rating: z.number().int().min(1).max(5), comment: z.string().trim().max(1000).optional() }),
]);

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireUser();
  if (auth.response) return auth.response;
  const { id } = await params;
  const parsed = schema.safeParse(await readJson(request));
  if (!parsed.success) return fail(parsed.error.issues[0].message);
  const input = parsed.data;

  const ticket = await loadTicket(id);
  if (!ticket || ticket.user_id !== auth.user.id) return fail("Ticket not found.", 404);

  const admin = createAdminClient();
  const now = new Date().toISOString();
  const name = ownerName(ticket.profiles);

  async function addMessage(body: string, role: "customer" | "system" = "customer") {
    const { error } = await admin.from("ticket_messages").insert({ ticket_id: id, author_id: auth.user!.id, author_name: role === "system" ? null : name, author_role: role, body });
    if (error) throw new Error(error.message);
  }

  try {
    switch (input.action) {
      case "reply": {
        if (ticket.status === "closed") return fail("This ticket is closed. Open a new request and quote its reference.", 409);
        await addMessage(input.body);
        // A customer reply puts the ticket back in the team's queue.
        const status = ticket.status === "in_progress" ? "in_progress" : "open";
        await admin.from("tickets").update({ status, last_activity_at: now, last_reply_by: "customer", resolved_at: null }).eq("id", id);
        await alertStaff({ ...ticket, status }, "Customer replied", input.body, { email: ticket.priority === "crucial" });
        break;
      }
      case "resolve": {
        if (ticket.status === "resolved" || ticket.status === "closed") return fail("This ticket is already resolved.", 409);
        await addMessage(`${name} marked this request as resolved.`, "system");
        await admin.from("tickets").update({ status: "resolved", resolved_at: now, last_activity_at: now }).eq("id", id);
        break;
      }
      case "reopen": {
        if (ticket.status !== "resolved" && ticket.status !== "closed") return fail("This ticket is still open.", 409);
        await addMessage(`${name} reopened this request.`, "system");
        if (input.body) await addMessage(input.body);
        await admin.from("tickets").update({ status: "open", resolved_at: null, closed_at: null, last_activity_at: now, last_reply_by: "customer" }).eq("id", id);
        await alertStaff({ ...ticket, status: "open" }, "Ticket reopened", input.body || "The customer reopened this request.", { email: ticket.priority !== "not_urgent" });
        break;
      }
      case "rate": {
        if (ticket.status !== "resolved" && ticket.status !== "closed") return fail("You can rate a request once it's resolved.", 409);
        await admin.from("tickets").update({ rating: input.rating, rating_comment: input.comment || null }).eq("id", id);
        break;
      }
    }
  } catch (err) {
    return fail((err as Error).message, 500);
  }

  return NextResponse.json({ ok: true });
}
