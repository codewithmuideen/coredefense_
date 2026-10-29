import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/app";

export interface Viewer {
  user: User;
  profile: Profile;
  isAdmin: boolean;
}

/** The signed-in user and their profile, fetched once per request. getUser() asks Auth directly, so banned users drop out. */
export const getViewer = cache(async (): Promise<Viewer | null> => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  const fallback: Profile = {
    id: user.id,
    email: user.email ?? "",
    first_name: (user.user_metadata?.first_name as string) ?? null,
    last_name: (user.user_metadata?.last_name as string) ?? null,
    company: (user.user_metadata?.company as string) ?? null,
    job_title: null, phone: null, bio: null, avatar_url: null,
    timezone: "Europe/London", role: "user", status: "active",
    notify_sign_in: true, notify_product: true, notify_weekly: false,
    last_sign_in_at: user.last_sign_in_at ?? null, created_at: user.created_at, updated_at: user.created_at,
  };
  return { user, profile: (profile as Profile) ?? fallback, isAdmin: user.app_metadata?.role === "admin" };
});

export async function requireViewer(): Promise<Viewer> {
  const viewer = await getViewer();
  if (!viewer) redirect("/login");
  return viewer;
}

export async function requireAdmin(): Promise<Viewer> {
  const viewer = await requireViewer();
  if (!viewer.isAdmin) redirect("/dashboard");
  return viewer;
}

/** For route handlers: the user or null, without redirecting. */
export async function getRouteUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return { supabase, user };
}
