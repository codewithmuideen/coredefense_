import "server-only";
import { FROM_EMAIL, getResendClient } from "@/lib/resend";

interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export interface SendEmailResult {
  ok: boolean;
  /** True when the message went to RESEND_TEST_INBOX instead of the real recipient. */
  redirected?: boolean;
  /** True when no API key exists and the email was only printed to the server log (development only). */
  logged?: boolean;
  error?: string;
}

/**
 * The one place that talks to Resend.
 *
 * Test mode: before a sending domain is verified, Resend only delivers to the address that owns the
 * Resend account. Set RESEND_TEST_INBOX to that address and every email (sign-in codes, alerts, form
 * copies) is delivered there, with the intended recipient shown in the subject and a banner.
 * Remove RESEND_TEST_INBOX once the domain is verified and set RESEND_FROM_EMAIL to it.
 */
export async function sendEmail({ to, subject, html, text, replyTo }: SendEmailInput): Promise<SendEmailResult> {
  const testInbox = process.env.RESEND_TEST_INBOX?.trim();
  const redirected = Boolean(testInbox && testInbox.toLowerCase() !== to.toLowerCase());
  const finalTo = testInbox || to;
  const finalSubject = redirected ? `[Test → ${to}] ${subject}` : subject;
  const finalHtml = redirected ? testBanner(to) + html : html;

  if (!process.env.RESEND_API_KEY) {
    if (process.env.NODE_ENV !== "production") {
      console.info(
        `\n[email:dev] RESEND_API_KEY missing, so nothing was sent.\n  To: ${to}\n  Subject: ${subject}\n  ${text ?? stripHtml(html).slice(0, 600)}\n`
      );
      return { ok: true, logged: true };
    }
    return { ok: false, error: "RESEND_API_KEY is not configured on the server" };
  }

  try {
    const { error } = await getResendClient().emails.send({
      from: FROM_EMAIL,
      to: finalTo,
      subject: finalSubject,
      html: finalHtml,
      text,
      replyTo,
    });
    if (error) {
      console.error("[email] Resend rejected the message", { to: finalTo, subject, error });
      return { ok: false, redirected, error: explain(error.message) };
    }
    return { ok: true, redirected };
  } catch (err) {
    console.error("[email] Resend request failed", err);
    return { ok: false, redirected, error: err instanceof Error ? err.message : "Email request failed" };
  }
}

function explain(message: string) {
  if (/only send testing emails to your own email/i.test(message)) {
    return "Resend is in test mode: set RESEND_TEST_INBOX to the email address you signed up to Resend with.";
  }
  return message;
}

function testBanner(intended: string) {
  return `<div style="background:#FFF7E6;border:1px solid #F5C26B;color:#7A4B00;font:13px/1.5 Arial,sans-serif;padding:10px 14px;margin:0 0 12px;border-radius:8px">
  Test mode: this email was meant for <strong>${escapeHtml(intended)}</strong>. It was delivered to your Resend test inbox because the sending domain isn't verified yet.
</div>`;
}

function stripHtml(html: string) {
  return html.replace(/<style[\s\S]*?<\/style>/g, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** For routes that treat a failed send as a failed request. */
export async function sendEmailOrThrow(input: SendEmailInput) {
  const result = await sendEmail(input);
  if (!result.ok) throw new Error(result.error);
  return result;
}
