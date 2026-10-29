import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // Only the routes that read or need a session. Marketing pages stay fully static.
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login/:path*", "/login", "/signup", "/reset-password", "/api/account/:path*", "/api/admin/:path*"],
};
