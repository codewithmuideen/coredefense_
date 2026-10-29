import "server-only";
import { createHmac, randomInt, timingSafeEqual } from "node:crypto";

export const CHALLENGE_COOKIE = "cd_challenge";
export const CODE_TTL_MINUTES = 10;
export const MAX_CODE_ATTEMPTS = 5;
export const RESEND_COOLDOWN_SECONDS = 45;

function secret() {
  const s = process.env.AUTH_SECRET ?? process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!s) throw new Error("AUTH_SECRET is not configured on the server");
  return s;
}

export function generateCode(): string {
  return randomInt(0, 1_000_000).toString().padStart(6, "0");
}

/** Codes are stored only as an HMAC bound to their challenge, so a leaked table row can't be replayed elsewhere. */
export function hashCode(challengeId: string, code: string): string {
  return createHmac("sha256", secret()).update(`${challengeId}:${code}`).digest("hex");
}

export function codesMatch(challengeId: string, code: string, storedHash: string): boolean {
  const a = Buffer.from(hashCode(challengeId, code), "hex");
  const b = Buffer.from(storedHash, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}
