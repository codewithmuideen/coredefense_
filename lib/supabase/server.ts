import "server-only";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { REMEMBER_COOKIE, SUPABASE_PUBLIC_KEY, SUPABASE_URL } from "@/lib/supabase/env";

/** Strips the expiry when the user chose not to stay signed in, so the browser drops the session on close. */
export function sessionCookieOptions(options: CookieOptions, remember: boolean): CookieOptions {
  if (remember) return options;
  const rest = { ...options };
  delete rest.maxAge;
  delete rest.expires;
  return rest;
}

/** Cookie-bound client for Server Components, Route Handlers and Server Actions. Acts as the signed-in user. */
export async function createClient(opts: { remember?: boolean } = {}) {
  const cookieStore = await cookies();
  const remember = opts.remember ?? cookieStore.get(REMEMBER_COOKIE)?.value !== "0";
  return createServerClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, sessionCookieOptions(options, remember))
          );
        } catch {
          // Called from a Server Component: the middleware refreshes the session instead.
        }
      },
    },
  });
}
