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
  "outlook.co.uk",
  "live.co.uk",
  "btinternet.com",
  "sky.com",
  "talktalk.net",
  "virginmedia.com",
  "rocketmail.com",
  "tutanota.com",
  "tuta.io",
  "qq.com",
  "163.com",
  "rediffmail.com",
  "mailinator.com",
  "guerrillamail.com",
  "10minutemail.com",
  "tempmail.com",
]);

export function isCompanyEmail(email: string) {
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

// ─── Accounts (UI only for now: nothing is submitted until the platform backend exists) ──────────

const workEmail = z
  .string()
  .trim()
  .min(1, "Enter your work email")
  .email("Enter a valid email address, like name@company.com")
  .refine(isCompanyEmail, "Use your company email. Personal addresses such as Gmail or Outlook aren't accepted");

export const PASSWORD_RULES = [
  { id: "length", label: "At least 12 characters", test: (p: string) => p.length >= 12 },
  { id: "upper", label: "An upper-case letter", test: (p: string) => /[A-Z]/.test(p) },
  { id: "lower", label: "A lower-case letter", test: (p: string) => /[a-z]/.test(p) },
  { id: "number", label: "A number", test: (p: string) => /\d/.test(p) },
  { id: "symbol", label: "A symbol, such as ! # $ or %", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
] as const;

export const loginSchema = z.object({
  // Existing accounts may predate the company-email rule, so login only checks the format.
  email: z.string().trim().min(1, "Enter your work email").email("Enter a valid email address, like name@company.com"),
  password: z.string().min(1, "Enter your password"),
  remember: z.boolean().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    firstName: z.string().trim().min(1, "First name is required").max(80),
    lastName: z.string().trim().min(1, "Last name is required").max(80),
    email: workEmail,
    company: z.string().trim().min(2, "Company name is required").max(120),
    password: z
      .string()
      .refine((p) => PASSWORD_RULES.every((r) => r.test(p)), "Password doesn't meet all the requirements below"),
    confirmPassword: z.string().min(1, "Confirm your password"),
    terms: z.literal(true, { errorMap: () => ({ message: "Please accept the terms to continue" }) }),
  })
  .refine((d) => d.password === d.confirmPassword, { path: ["confirmPassword"], message: "Passwords don't match" })
  .refine((d) => !d.email.split("@")[0] || !d.password.toLowerCase().includes(d.email.split("@")[0].toLowerCase()), {
    path: ["password"],
    message: "Don't include your email name in the password",
  });

export type SignupInput = z.infer<typeof signupSchema>;

export const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  website: z.string().max(0, "Spam detected").optional().or(z.literal("")),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;
