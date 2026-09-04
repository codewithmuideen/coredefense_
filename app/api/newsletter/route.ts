import { NextResponse } from "next/server";
import { newsletterSchema } from "@/lib/validations";
import { getResendClient, FROM_EMAIL, TO_EMAIL } from "@/lib/resend";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }
  if (parsed.data.website) {
    return NextResponse.json({ ok: true });
  }

  const { email } = parsed.data;

  try {
    const resend = getResendClient();

    await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: "New newsletter subscriber",
      html: `<p>New subscriber: ${escapeHtml(email)}</p>`,
    });

    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "You're subscribed to CoreDefense insights",
      html: `
        <p>Thanks for subscribing to CoreDefense insights. We'll send occasional updates on
        cybersecurity, transformation and AI &amp; automation for UK enterprise.</p>
        <p>— The CoreDefense Team</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Newsletter subscription failed", error);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 502 });
  }
}

function escapeHtml(input: string) {
  return input.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
