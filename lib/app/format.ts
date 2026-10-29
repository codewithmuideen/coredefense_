import type { FindingStatus, Profile, Severity, TicketStatus } from "@/types/app";

export function fullName(p: Pick<Profile, "first_name" | "last_name" | "email">) {
  const name = [p.first_name, p.last_name].filter(Boolean).join(" ").trim();
  return name || p.email.split("@")[0];
}

export function initials(p: Pick<Profile, "first_name" | "last_name" | "email">) {
  const a = p.first_name?.[0] ?? p.email[0] ?? "?";
  const b = p.last_name?.[0] ?? "";
  return (a + b).toUpperCase();
}

const rtf = new Intl.RelativeTimeFormat("en-GB", { numeric: "auto" });
const STEPS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 31_536_000],
  ["month", 2_592_000],
  ["week", 604_800],
  ["day", 86_400],
  ["hour", 3_600],
  ["minute", 60],
];

export function timeAgo(iso: string | null | undefined) {
  if (!iso) return "Never";
  const seconds = (new Date(iso).getTime() - Date.now()) / 1000;
  for (const [unit, size] of STEPS) {
    if (Math.abs(seconds) >= size) return rtf.format(Math.round(seconds / size), unit);
  }
  return "just now";
}

export function formatDate(iso: string | null | undefined, withTime = false) {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("en-GB", withTime ? { dateStyle: "medium", timeStyle: "short" } : { dateStyle: "medium" }).format(new Date(iso));
}

export function greeting(date = new Date()) {
  const h = date.getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

// Severity is a status scale, so it uses the reserved status steps and always ships with its label.
export const SEVERITY: Record<Severity, { label: string; color: string; badge: string; rank: number }> = {
  critical: { label: "Critical", color: "#D03B3B", badge: "bg-red-50 text-red-700 ring-red-600/15", rank: 0 },
  high: { label: "High", color: "#EC835A", badge: "bg-orange-50 text-orange-700 ring-orange-600/15", rank: 1 },
  medium: { label: "Medium", color: "#FAB219", badge: "bg-amber-50 text-amber-800 ring-amber-600/20", rank: 2 },
  low: { label: "Low", color: "#1E6AFF", badge: "bg-primary-50 text-primary-700 ring-primary-600/15", rank: 3 },
  info: { label: "Info", color: "#8B95A7", badge: "bg-slate-100 text-slate-600 ring-slate-500/15", rank: 4 },
};
export const SEVERITIES = Object.keys(SEVERITY) as Severity[];

export const FINDING_STATUS: Record<FindingStatus, { label: string; badge: string }> = {
  open: { label: "Open", badge: "bg-white text-ink-700 ring-ink-900/15" },
  in_progress: { label: "In progress", badge: "bg-primary-50 text-primary-700 ring-primary-600/15" },
  resolved: { label: "Resolved", badge: "bg-emerald-50 text-emerald-700 ring-emerald-600/15" },
  accepted: { label: "Risk accepted", badge: "bg-slate-100 text-slate-600 ring-slate-500/15" },
};

export const TICKET_STATUS: Record<TicketStatus, { label: string; badge: string }> = {
  open: { label: "Open", badge: "bg-primary-50 text-primary-700 ring-primary-600/15" },
  pending: { label: "Awaiting you", badge: "bg-amber-50 text-amber-800 ring-amber-600/20" },
  resolved: { label: "Resolved", badge: "bg-emerald-50 text-emerald-700 ring-emerald-600/15" },
};

export const EVENT_LABELS: Record<string, { label: string; tone: "good" | "warn" | "bad" | "neutral" }> = {
  sign_in: { label: "Signed in", tone: "good" },
  sign_out: { label: "Signed out", tone: "neutral" },
  failed_password: { label: "Wrong password", tone: "bad" },
  code_sent: { label: "Sign-in code sent", tone: "neutral" },
  code_failed: { label: "Wrong sign-in code", tone: "bad" },
  mfa_failed: { label: "Wrong authenticator code", tone: "bad" },
  locked_out: { label: "Temporarily locked", tone: "bad" },
  password_reset_requested: { label: "Password reset requested", tone: "warn" },
  password_changed: { label: "Password changed", tone: "warn" },
  email_2fa_on: { label: "Email codes on", tone: "good" },
  email_2fa_off: { label: "Email codes off", tone: "warn" },
  totp_on: { label: "Authenticator added", tone: "good" },
  totp_off: { label: "Authenticator removed", tone: "warn" },
  signed_out_everywhere: { label: "Signed out everywhere", tone: "warn" },
  account_created: { label: "Account created", tone: "neutral" },
  email_confirmed: { label: "Email confirmed", tone: "good" },
};
