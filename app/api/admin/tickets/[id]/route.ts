import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { fail, readJson, requireUser } from "@/lib/auth/api";
import { getOrigin } from "@/lib/auth/request-meta";
import { notify, recordAudit } from "@/lib/auth/events";
import { sendEmail } from "@/lib/email/send";
import { ticketReplyTemplate } from "@/lib/email/templates";

const schema = z.object({
  status: z.enum(["open", "pending", "resolved"]).optional(),
  reply: z.string().trim().max(4000).optional(),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireUser({ admin: true });
  if (auth.response) return auth.response;
  const { id } = await params;
  const parsed = schema.safeParse(await readJson(request));
  if (!parsed.success) return fail(parsed.error.issues[0].message);
  const { status, reply } = parsed.data;
  if (!status && !reply) return fail("Nothing to update.");

  const admin = createAdminClient();
  const { data: ticket } = await admin.from("tickets").select("*, profiles(email, first_name)").eq("id", id).maybeSingle();
  if (!ticket) return fail("Ticket not found.", 404);

  const update: Record<string, unknown> = {};
  if (status) update.status = status;
  if (reply) {
    update.admin_reply = reply;
    update.replied_at = new Date().toISOString();
    if (!status) update.status = "pending";
  }
  const { error } = await admin.from("tickets").update(update).eq("id", id);
  if (error) return fail(error.message, 500);

  if (reply) {
    await notify(ticket.user_id, { kind: "support", title: `Reply: ${ticket.subject}`, body: reply.slice(0, 160), link: "/dashboard/support" });
    const owner = ticket.profiles as { email: string; first_name: string | null } | null;
    if (owner?.email) {
      const origin = await getOrigin();
      await sendEmail({ to: owner.email, ...ticketReplyTemplate(owner.first_name ?? "there", ticket.subject, reply, `${origin}/dashboard/support`) });
    }
  } else if (status === "resolved") {
    await notify(ticket.user_id, { kind: "support", title: `Resolved: ${ticket.subject}`, body: "Your request was marked as resolved.", link: "/dashboard/support" });
  }

  await recordAudit({ id: auth.user.id, email: auth.user.email }, reply ? "ticket.reply" : "ticket.status", ticket.subject, update);
  return NextResponse.json({ ok: true });
}
