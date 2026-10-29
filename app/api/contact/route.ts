import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations";
import { TO_EMAIL } from "@/lib/resend";
import { sendEmailOrThrow } from "@/lib/email/send";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }
  if (parsed.data.website) {
    // Honeypot triggered — silently accept to not tip off bots.
    return NextResponse.json({ ok: true });
  }

  const { name, company, email, phone, service, message } = parsed.data;

  try {
    await sendEmailOrThrow({
      to: TO_EMAIL,
      replyTo: email,
      subject: `New enquiry: ${service} (${company})`,
      html: `
        <h2>New CoreDefense enquiry</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Company:</strong> ${escapeHtml(company)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
        <p><strong>Service interest:</strong> ${escapeHtml(service)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
      `,
    });

    await sendEmailOrThrow({
      to: email,
      subject: "Thanks for contacting CoreDefense",
      html: `
        <p>Hi ${escapeHtml(name)},</p>
        <p>Thanks for getting in touch with CoreDefense. We've received your message about
        <strong>${escapeHtml(service)}</strong> and a member of our team will respond shortly.</p>
        <p>The CoreDefense Team</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact form send failed", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 502 });
  }
}

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
