import type { Finding, Severity } from "@/types/app";
import { SEVERITIES } from "@/lib/app/format";

const WEIGHT: Record<Severity, number> = { critical: 16, high: 8, medium: 3, low: 1, info: 0 };
const DAY = 86_400_000;

export const isOpen = (f: Finding) => f.status === "open" || f.status === "in_progress";

/** 0–100, higher is better: starts at 100 and loses points for each open finding by severity. */
export function exposureScore(findings: Finding[]) {
  const penalty = findings.filter(isOpen).reduce((s, f) => s + WEIGHT[f.severity], 0);
  return Math.max(5, Math.round(100 - penalty));
}

export function summarise(findings: Finding[]) {
  const now = Date.now();
  const open = findings.filter(isOpen);
  const resolved = findings.filter((f) => f.status === "resolved" && f.resolved_at);
  const mttr = resolved.length
    ? resolved.reduce((s, f) => s + (new Date(f.resolved_at!).getTime() - new Date(f.detected_at).getTime()), 0) / resolved.length / DAY
    : null;
  const actionable = findings.filter((f) => f.status !== "accepted").length;
  return {
    total: findings.length,
    open: open.length,
    critical: open.filter((f) => f.severity === "critical").length,
    high: open.filter((f) => f.severity === "high").length,
    overdue: open.filter((f) => f.due_at && new Date(f.due_at).getTime() < now).length,
    resolved: resolved.length,
    resolved30: resolved.filter((f) => now - new Date(f.resolved_at!).getTime() < 30 * DAY).length,
    mttr,
    progress: actionable ? (resolved.length / actionable) * 100 : 0,
    bySeverity: SEVERITIES.map((s) => ({ severity: s, count: open.filter((f) => f.severity === s).length })),
  };
}

/** Findings detected vs resolved per week, oldest first. */
export function weeklyTrend(findings: Finding[], weeks = 12) {
  const now = new Date();
  const start = new Date(now.getTime() - weeks * 7 * DAY);
  const labels: string[] = [];
  const detected = Array<number>(weeks).fill(0);
  const resolved = Array<number>(weeks).fill(0);
  for (let i = 0; i < weeks; i++) {
    const d = new Date(start.getTime() + (i + 1) * 7 * DAY);
    labels.push(new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(d));
  }
  const bucket = (iso: string) => Math.floor((new Date(iso).getTime() - start.getTime()) / (7 * DAY));
  for (const f of findings) {
    const b = bucket(f.detected_at);
    if (b >= 0 && b < weeks) detected[b]++;
    if (f.resolved_at) {
      const r = bucket(f.resolved_at);
      if (r >= 0 && r < weeks) resolved[r]++;
    }
  }
  return { labels, detected, resolved };
}

/** Per-day counts for the last `days` days, oldest first. */
export function dailyCounts(dates: string[], days = 30) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const labels: string[] = [];
  const values = Array<number>(days).fill(0);
  for (let i = days - 1; i >= 0; i--) {
    labels.push(new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(new Date(today.getTime() - i * DAY)));
  }
  for (const iso of dates) {
    const d = new Date(iso);
    d.setHours(0, 0, 0, 0);
    const idx = days - 1 - Math.round((today.getTime() - d.getTime()) / DAY);
    if (idx >= 0 && idx < days) values[idx]++;
  }
  return { labels, values };
}
