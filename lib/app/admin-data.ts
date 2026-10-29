import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Profile } from "@/types/app";

export interface AdminUserRow {
  id: string;
  email: string;
  name: string;
  company: string | null;
  jobTitle: string | null;
  avatarUrl: string | null;
  role: "user" | "admin";
  status: "active" | "suspended" | "unconfirmed";
  twoFactor: "authenticator" | "email" | "none";
  createdAt: string;
  lastSignInAt: string | null;
}

/** Auth users (role, ban, factors) joined to their profiles. Fine to a few thousand users; paginate past that. */
export async function listAllUsers(): Promise<AdminUserRow[]> {
  const admin = createAdminClient();
  const [{ data: auth }, { data: profiles }] = await Promise.all([
    admin.auth.admin.listUsers({ perPage: 1000 }),
    admin.from("profiles").select("*"),
  ]);
  const byId = new Map((profiles as Profile[] | null)?.map((p) => [p.id, p]) ?? []);
  return (auth?.users ?? []).map((u): AdminUserRow => {
    const p = byId.get(u.id);
    const banned = u.banned_until && new Date(u.banned_until) > new Date();
    const hasTotp = (u.factors ?? []).some((f) => f.factor_type === "totp" && f.status === "verified");
    const name = [p?.first_name ?? u.user_metadata?.first_name, p?.last_name ?? u.user_metadata?.last_name].filter(Boolean).join(" ") || u.email?.split("@")[0] || "Unknown";
    return {
      id: u.id,
      email: u.email ?? "",
      name,
      company: p?.company ?? (u.user_metadata?.company as string) ?? null,
      jobTitle: p?.job_title ?? null,
      avatarUrl: p?.avatar_url ?? null,
      role: u.app_metadata?.role === "admin" ? "admin" : "user",
      status: banned ? "suspended" : u.email_confirmed_at ? "active" : "unconfirmed",
      twoFactor: hasTotp ? "authenticator" : u.app_metadata?.email_2fa === false ? "none" : "email",
      createdAt: u.created_at,
      lastSignInAt: u.last_sign_in_at ?? null,
    };
  }).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
