import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { fail, readJson, requireUser } from "@/lib/auth/api";
import { getOrigin } from "@/lib/auth/request-meta";
import { notify } from "@/lib/auth/events";
import { sendEmail } from "@/lib/email/send";
import { broadcastTemplate } from "@/lib/email/templates";

const schema = z.object({
  subject: z.string().trim().min(3, "Add a short subject").max(140),
  category: z.enum(["General", "Finding", "Account", "Billing", "Incident"]),
  priority: z.enum(["low", "normal", "high", "urgent"]),
  message: z.string().trim().min(10, "Tell us a little more (10 characters minimum)").max(4000),
});

export async function POST(request: Request) {
  const auth = await requireUser();
  if (auth.response) return auth.response;
  const parsed = schema.safeParse(await readJson(request));
  if (!parsed.success) return fail(parsed.error.issues[0].message);

  // Inserted as the user, so Row Level Security still applies.
  const { data: ticket, error } = await auth.supabase
    .from("tickets")
    .insert({ ...parsed.data, user_id: auth.user.id })
    .select()
    .single();
  if (error) return fail(error.message, 500);

  await auth.supabase.from("activity").insert({ user_id: auth.user.id, action: "Opened a support request", detail: parsed.data.subject });

  const { data: admins } = await createAdminClient().from("profiles").select("id, email").eq("role", "admin");
  const origin = await getOrigin();
  for (const a of admins ?? []) {
    await notify(a.id, { kind: "support", title: `New ${parsed.data.priority} ticket`, body: `${auth.user.email}: ${parsed.data.subject}`, link: "/admin/tickets" });
    if (parsed.data.priority === "urgent" || parsed.data.priority === "high") {
      await sendEmail({
        to: a.email,
        ...broadcastTemplate(`[${parsed.data.priority.toUpperCase()}] ${parsed.data.subject}`, `${auth.user.email} opened a ${parsed.data.category.toLowerCase()} ticket:\n\n${parsed.data.message}`, `${origin}/admin/tickets`),
      });
    }
  }

  return NextResponse.json({ ok: true, ticket });
}
