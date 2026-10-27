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

export const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? "CoreDefense <info@coredefense.co.uk>";
export const TO_EMAIL = process.env.RESEND_TO_EMAIL ?? "info@coredefense.co.uk";
