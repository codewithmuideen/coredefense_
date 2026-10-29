// Row shapes for the tables in supabase/schema.sql.

export type Role = "user" | "admin";
export type Severity = "critical" | "high" | "medium" | "low" | "info";
export type FindingStatus = "open" | "in_progress" | "resolved" | "accepted";
export type TicketStatus = "open" | "pending" | "resolved";
export type NotificationKind = "security" | "finding" | "system" | "support";

export interface Profile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  company: string | null;
  job_title: string | null;
  phone: string | null;
  bio: string | null;
  avatar_url: string | null;
  timezone: string;
  role: Role;
  status: "active" | "suspended";
  notify_sign_in: boolean;
  notify_product: boolean;
  notify_weekly: boolean;
  last_sign_in_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Finding {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  severity: Severity;
  status: FindingStatus;
  asset: string;
  category: string;
  cvss: number | null;
  cve: string | null;
  detected_at: string;
  due_at: string | null;
  resolved_at: string | null;
}

export interface AppNotification {
  id: string;
  user_id: string;
  kind: NotificationKind;
  title: string;
  body: string | null;
  link: string | null;
  read_at: string | null;
  created_at: string;
}

export interface Ticket {
  id: string;
  user_id: string;
  subject: string;
  category: string;
  priority: "low" | "normal" | "high" | "urgent";
  status: TicketStatus;
  message: string;
  admin_reply: string | null;
  replied_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface LoginEvent {
  id: number;
  user_id: string | null;
  email: string | null;
  event: string;
  ip: string | null;
  device: string | null;
  location: string | null;
  created_at: string;
}

export interface Activity {
  id: number;
  user_id: string;
  action: string;
  detail: string | null;
  created_at: string;
}

export interface AuditEntry {
  id: number;
  actor_id: string | null;
  actor_email: string | null;
  action: string;
  target: string | null;
  detail: Record<string, unknown>;
  created_at: string;
}
