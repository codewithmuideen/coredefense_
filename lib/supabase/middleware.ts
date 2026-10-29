import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { REMEMBER_COOKIE, SUPABASE_PUBLIC_KEY, SUPABASE_URL, isSupabaseConfigured } from "@/lib/supabase/env";

const PROTECTED = ["/dashboard", "/admin"];
const GUEST_ONLY = ["/login", "/signup"];

function startsWithAny(path: string, prefixes: string[]) {
  return prefixes.some((p) => path === p || path.startsWith(`${p}/`));
}

/** Refreshes the Supabase session on every request and gates the app routes by sign-in, MFA level and role. */
export async function updateSession(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (!isSupabaseConfigured()) {
    if (startsWithAny(path, PROTECTED)) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.search = "?error=not-configured";
      return NextResponse.redirect(url);
    }
    return NextResponse.next({ request });
  }

  const remember = request.cookies.get(REMEMBER_COOKIE)?.value !== "0";
  let response = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          const opts = { ...options };
          if (!remember) {
            delete opts.maxAge;
            delete opts.expires;
          }
          response.cookies.set(name, value, opts);
        });
        Object.entries(headers ?? {}).forEach(([key, value]) => response.headers.set(key, value));
      },
    },
  });

  // getClaims() verifies the JWT (and refreshes it when close to expiry). Don't put code between client creation and this call.
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;

  const redirect = (pathname: string, params?: Record<string, string>) => {
    const url = request.nextUrl.clone();
    url.pathname = pathname;
    url.search = params ? `?${new URLSearchParams(params)}` : "";
    const res = NextResponse.redirect(url);
    response.cookies.getAll().forEach((c) => res.cookies.set(c));
    return res;
  };

  if (startsWithAny(path, PROTECTED)) {
    if (!claims) return redirect("/login", { next: path });

    // An enrolled authenticator app means the session must be stepped up to aal2 first.
    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (aal && aal.nextLevel === "aal2" && aal.currentLevel !== "aal2") {
      return redirect("/login/mfa", { next: path });
    }

    const role = (claims.app_metadata as { role?: string } | undefined)?.role;
    if (startsWithAny(path, ["/admin"]) && role !== "admin") return redirect("/dashboard");
  }

  if (claims && startsWithAny(path, GUEST_ONLY) && path !== "/login/mfa" && path !== "/login/verify") {
    return redirect("/dashboard");
  }

  return response;
}
