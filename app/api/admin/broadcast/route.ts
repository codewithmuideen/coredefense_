import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { fail, readJson, requireUser } from "@/lib/auth/api";
import { getOrigin } from "@/lib/auth/request-meta";
import { recordAudit } from "@/lib/auth/events";
import { sendEmail } from "@/lib/email/send";
import { broadcastTemplate } from "@/lib/email/templates";

const schema = z.object({
  title: z.string().trim().min(3, "Add a title").max(120),
  message: z.string().trim().min(10, "Write a message of at least 10 characters").max(2000),
  audience: z.enum(["all", "admins", "users"]),
  kind: z.enum(["system", "security"]).default("system"),
  email: z.boolean().default(false),
});

export async function POST(request: Request) {
  const auth = await requireUser({ admin: true });
  if (auth.response) return auth.response;
  const parsed = schema.safeParse(await readJson(request));
  if (!parsed.success) return fail(parsed.error.issues[0].message);
  const { title, message, audience, kind, email } = parsed.data;

  const admin = createAdminClient();
  let query = admin.from("profiles").select("id, email, notify_product").eq("status", "active");
  if (audience !== "all") query = query.eq("role", audience === "admins" ? "admin" : "user");
  const { data: recipients, error } = await query;
  if (error) return fail(error.message, 500);
  if (!recipients?.length) return fail("Nobody matches that audience.");

  const { error: insertError } = await admin
    .from("notifications")
    .insert(recipients.map((r) => ({ user_id: r.id, kind, title, body: message, link: "/dashboard/notifications" })));
  if (insertError) return fail(insertError.message, 500);

  let emailed = 0;
  let emailError: string | undefined;
  if (email) {
    const origin = await getOrigin();
    const tpl = broadcastTemplate(title, message, `${origin}/dashboard/notifications`);
    // Security notices go to everyone; product news respects the opt-out.
    for (const r of recipients.filter((r) => kind === "security" || r.notify_product)) {
      const sent = await sendEmail({ to: r.email, ...tpl });
      if (sent.ok) emailed++;
      else emailError = sent.error;
    }
  }

  await recordAudit({ id: auth.user.id, email: auth.user.email }, "broadcast.send", audience, { title, recipients: recipients.length, emailed });
  return NextResponse.json({ ok: true, recipients: recipients.length, emailed, emailError });
}
