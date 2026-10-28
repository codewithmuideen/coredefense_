import { PASSWORD_RULES } from "@/lib/validations";

const SETS = {
  upper: "ABCDEFGHJKLMNPQRSTUVWXYZ",
  lower: "abcdefghijkmnopqrstuvwxyz",
  number: "23456789",
  symbol: "!#$%&*+-=?@^_~",
};
const ALL = Object.values(SETS).join("");

function randomIndex(max: number): number {
  // Rejection sampling keeps the distribution uniform.
  const limit = Math.floor(0xffffffff / max) * max;
  const buf = new Uint32Array(1);
  do crypto.getRandomValues(buf);
  while (buf[0] >= limit);
  return buf[0] % max;
}

/** A cryptographically random password with at least one character from every set. Look-alikes (0/O, 1/l) are left out. */
export function generatePassword(length = 18): string {
  const chars = Object.values(SETS).map((set) => set[randomIndex(set.length)]);
  while (chars.length < length) chars.push(ALL[randomIndex(ALL.length)]);
  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomIndex(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join("");
}

/** 0–4: how many of the rules beyond length are met, scaled up for longer passwords. */
export function passwordScore(password: string): number {
  if (!password) return 0;
  const met = PASSWORD_RULES.filter((r) => r.test(password)).length;
  const bonus = password.length >= 16 ? 1 : 0;
  return Math.min(4, Math.max(1, met - 1 + bonus));
}

export const SCORE_LABELS = ["", "Weak", "Fair", "Good", "Strong"];
