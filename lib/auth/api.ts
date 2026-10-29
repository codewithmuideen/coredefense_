import "server-only";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { NOT_CONFIGURED_MESSAGE, REMEMBER_COOKIE, isSupabaseConfigured } from "@/lib/supabase/env";
import { isAdminConfigured } from "@/lib/supabase/admin";

export function fail(error: string, status = 400, extra: Record<string, unknown> = {}) {
  return NextResponse.json({ error, ...extra }, { status });
}

export async function readJson<T = Record<string, unknown>>(request: Request): Promise<T | null> {
  try {
    return (await request.json()) as T;
  } catch {
    return null;
  }
}

/** Returns an error response if Supabase isn't set up yet, so every route fails with the same clear message. */
export function configGuard(needsAdmin = true) {
  if (!isSupabaseConfigured() || (needsAdmin && !isAdminConfigured())) {
    return fail(
      needsAdmin && isSupabaseConfigured() ? "SUPABASE_SECRET_KEY is missing from .env.local, so the server can't manage accounts yet." : NOT_CONFIGURED_MESSAGE,
      503
    );
  }
  return null;
}

/** Only same-site relative paths, so a crafted ?next= can't bounce users to another domain. */
export function safeNext(next: unknown, fallback = "/dashboard"): string {
  return typeof next === "string" && next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\") ? next : fallback;
}

export async function setRememberCookie(remember: boolean) {
  const store = await cookies();
  store.set(REMEMBER_COOKIE, remember ? "1" : "0", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    ...(remember ? { maxAge: 60 * 60 * 24 * 400 } : {}),
  });
}

export function maskEmail(email: string) {
  const [name, domain] = email.split("@");
  if (!domain) return email;
  const visible = name.length <= 2 ? name[0] : `${name[0]}${"•".repeat(Math.min(6, name.length - 2))}${name.at(-1)}`;
  return `${visible}@${domain}`;
}

/** The authenticated caller for API routes, or a 401/403 response. */
export async function requireUser(opts: { admin?: boolean } = {}): Promise<
  { user: User; supabase: Awaited<ReturnType<typeof createClient>>; response?: undefined } | { response: NextResponse; user?: undefined; supabase?: undefined }
> {
  const guard = configGuard();
  if (guard) return { response: guard };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { response: fail("Your session has ended. Please log in again.", 401) };
  if (opts.admin && user.app_metadata?.role !== "admin") return { response: fail("Admins only.", 403) };
  return { user, supabase };
}
