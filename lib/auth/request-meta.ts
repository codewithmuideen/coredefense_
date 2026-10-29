import "server-only";
import { headers } from "next/headers";
import type { SignInContext } from "@/lib/email/templates";

export interface RequestMeta extends SignInContext {
  userAgent: string;
}

export function describeUserAgent(ua: string): string {
  if (!ua) return "Unknown device";
  const browser =
    /Edg\//.test(ua) ? "Edge" :
    /OPR\/|Opera/.test(ua) ? "Opera" :
    /Firefox\//.test(ua) ? "Firefox" :
    /Chrome\//.test(ua) ? "Chrome" :
    /Safari\//.test(ua) ? "Safari" : "Browser";
  const os =
    /Windows NT/.test(ua) ? "Windows" :
    /iPhone|iPad/.test(ua) ? "iOS" :
    /Android/.test(ua) ? "Android" :
    /Mac OS X/.test(ua) ? "macOS" :
    /Linux/.test(ua) ? "Linux" : "Unknown OS";
  return `${browser} on ${os}`;
}

/** Who is making this request: device, IP and (on Vercel) city and country from the edge headers. */
export async function getRequestMeta(): Promise<RequestMeta> {
  const h = await headers();
  const userAgent = h.get("user-agent") ?? "";
  const ip = (h.get("x-forwarded-for")?.split(",")[0] ?? h.get("x-real-ip") ?? "").trim() || "Unknown";
  const city = h.get("x-vercel-ip-city");
  const country = h.get("x-vercel-ip-country");
  const location = city || country
    ? [city && decodeURIComponent(city), country].filter(Boolean).join(", ")
    : ip === "::1" || ip.startsWith("127.") ? "This computer (local development)" : "Unknown location";
  const time = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/London" }).format(new Date()) + " UK time";
  return { userAgent, device: describeUserAgent(userAgent), ip, location, time };
}

/** Absolute origin for links in emails: the configured site URL in production, the request's own host otherwise. */
export async function getOrigin(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (host) {
    const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
    return `${proto}://${host}`;
  }
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}
