import { NextResponse } from "next/server";
import { trialSchema } from "@/lib/validations";
import { getResendClient, FROM_EMAIL, TO_EMAIL } from "@/lib/resend";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = trialSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }
  if (parsed.data.website) {
    return NextResponse.json({ ok: true });
  }

  const { firstName, lastName, workEmail, company, jobTitle, phone, employees, concern } = parsed.data;

  try {
    const resend = getResendClient();

    await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: workEmail,
      subject: `New platform access request from ${company}`,
      html: `
        <h2>New CoreDefense free trial / platform access request</h2>
        <p><strong>Name:</strong> ${escapeHtml(firstName)} ${escapeHtml(lastName)}</p>
        <p><strong>Work email:</strong> ${escapeHtml(workEmail)}</p>
        <p><strong>Company:</strong> ${escapeHtml(company)}</p>
        <p><strong>Job title:</strong> ${escapeHtml(jobTitle)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
        <p><strong>Employees:</strong> ${escapeHtml(employees)}</p>
        <p><strong>Primary security concern:</strong> ${escapeHtml(concern)}</p>
      `,
    });

    await resend.emails.send({
      from: FROM_EMAIL,
      to: workEmail,
      subject: "Your CoreDefense access request",
      html: `
        <p>Hi ${escapeHtml(firstName)},</p>
        <p>Thanks for your interest in CoreDefense. Our cybersecurity platform is currently in active
        development, and your request for early access has been received. A member of our team will be in
        touch about onboarding and timelines.</p>
        <p>In the meantime, feel free to <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/book-consultation">book a consultation</a>
        with our security team.</p>
        <p>The CoreDefense Team</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Trial request send failed", error);
    return NextResponse.json({ error: "Failed to send request" }, { status: 502 });
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
