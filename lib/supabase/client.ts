"use client";

import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_PUBLIC_KEY, SUPABASE_URL } from "@/lib/supabase/env";

/** Browser client. Row Level Security limits it to the signed-in user's own rows (admins see more). */
export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
}
