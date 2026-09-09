import { z } from "zod";

const FREE_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "yahoo.co.uk",
  "ymail.com",
  "hotmail.com",
  "hotmail.co.uk",
  "outlook.com",
  "live.com",
  "msn.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "aol.com",
  "protonmail.com",
  "proton.me",
  "gmx.com",
  "gmx.co.uk",
  "mail.com",
  "yandex.com",
  "zoho.com",
  "fastmail.com",
  "hey.com",
  "web.de",
  "inbox.com",
]);

function isCompanyEmail(email: string) {
  const domain = email.split("@")[1]?.toLowerCase().trim();
  return !!domain && !FREE_EMAIL_DOMAINS.has(domain);
}

export const contactSchema = z.object({
  name: z.string().min(2, "Please enter your full name").max(120),
  company: z.string().min(2, "Please enter your company name").max(120),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(5, "Please enter a valid phone number").max(30),
  service: z.string().min(1, "Please select a service"),
  message: z.string().min(10, "Please tell us a little more (10 characters minimum)").max(2000),
  website: z.string().max(0, "Spam detected").optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const trialSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(80),
  lastName: z.string().min(1, "Last name is required").max(80),
  workEmail: z
    .string()
    .email("Please enter a valid work email")
    .refine(isCompanyEmail, "Please use your company email address. Personal email domains aren't accepted"),
  company: z.string().min(2, "Company name is required").max(120),
  jobTitle: z.string().min(2, "Job title is required").max(120),
  phone: z.string().min(5, "Please enter a valid phone number").max(30),
  employees: z.string().min(1, "Please select company size"),
  concern: z.string().min(1, "Please select your primary concern"),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Please confirm you agree to be contacted" }),
  }),
  website: z.string().max(0, "Spam detected").optional().or(z.literal("")),
});

export type TrialInput = z.infer<typeof trialSchema>;

export const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  website: z.string().max(0, "Spam detected").optional().or(z.literal("")),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;
