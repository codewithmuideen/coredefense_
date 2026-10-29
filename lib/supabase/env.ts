// Supabase now issues "publishable"/"secret" keys; older projects still have anon/service_role. Either works.
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export function isSupabaseConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_PUBLIC_KEY);
}

export const NOT_CONFIGURED_MESSAGE =
  "Accounts aren't connected yet: add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to .env.local and restart the server.";

/** "0" means the user didn't tick "Keep me signed in", so auth cookies become browser-session cookies. */
export const REMEMBER_COOKIE = "cd_remember";
