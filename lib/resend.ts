import { Resend } from "resend";

let client: Resend | null = null;

export function getResendClient(): Resend {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured on the server");
  }
  if (!client) {
    client = new Resend(process.env.RESEND_API_KEY);
  }
  return client;
}

// Until coredefense.co.uk is verified in Resend, only Resend's shared sender works.
export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "CoreDefense <onboarding@resend.dev>";
export const TO_EMAIL = process.env.RESEND_TO_EMAIL || process.env.RESEND_TEST_INBOX || "info@coredefense.co.uk";
