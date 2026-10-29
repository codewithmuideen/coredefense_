import "server-only";
import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_PUBLIC_KEY, SUPABASE_URL } from "@/lib/supabase/env";

const SECRET_KEY = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export function isAdminConfigured() {
  return Boolean(SUPABASE_URL && SECRET_KEY);
}

/**
 * Service-role client: bypasses Row Level Security. Server only, and only after the caller has been
 * authorised (signed in, or an admin). Never import from a client component.
 */
export function createAdminClient(): SupabaseClient {
  if (!isAdminConfigured()) {
    throw new Error("SUPABASE_SECRET_KEY (or SUPABASE_SERVICE_ROLE_KEY) is not configured on the server");
  }
  return createSupabaseClient(SUPABASE_URL, SECRET_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Stateless client with no cookies: used to check a password without starting a session in the browser. */
export function createEphemeralClient(): SupabaseClient {
  return createSupabaseClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
