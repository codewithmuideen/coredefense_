import type { Metadata } from "next";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { Card, PageHeader } from "@/components/app/ui";
import { EVENT_LABELS, formatDate, timeAgo } from "@/lib/app/format";
import type { AuditEntry, LoginEvent } from "@/types/app";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Audit log" };
export const dynamic = "force-dynamic";

const TONE = { good: "bg-emerald-500", warn: "bg-amber-500", bad: "bg-red-500", neutral: "bg-slate-300" };

export default async function AuditPage({ searchParams }: { searchParams: Promise<{ tab?: string; q?: string }> }) {
  const { tab = "admin", q = "" } = await searchParams;
  const admin = createAdminClient();
  // Strip characters that have meaning inside a PostgREST or() filter.
  const term = q.trim().replace(/[,()*%\:]/g, "");

  let adminRows: AuditEntry[] = [];
  let eventRows: LoginEvent[] = [];
  if (tab === "sign-ins") {
    let query = admin.from("login_events").select("*").order("created_at", { ascending: false }).limit(300);
    if (term) query = query.or(`email.ilike.%${term}%,ip.ilike.%${term}%`);
    eventRows = ((await query).data ?? []) as LoginEvent[];
  } else {
    let query = admin.from("audit_log").select("*").order("created_at", { ascending: false }).limit(300);
    if (term) query = query.or(`actor_email.ilike.%${term}%,target.ilike.%${term}%,action.ilike.%${term}%`);
    adminRows = ((await query).data ?? []) as AuditEntry[];
  }

  const tabs = [
    { id: "admin", label: "Admin actions" },
    { id: "sign-ins", label: "Sign-in events" },
  ];

  return (
    <>
      <PageHeader eyebrow="Admin console" title="Audit log" description="A tamper-evident record: every admin action, and every sign-in, failed attempt and security change across the platform." />
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-900/[0.06] p-3 sm:px-5">
          <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
            {tabs.map((t) => (
              <Link key={t.id} href={`/admin/audit?tab=${t.id}`} className={cn("rounded-md px-3 py-1.5 text-xs font-semibold", tab === t.id ? "bg-white text-ink-900 shadow-sm" : "text-slate-500 hover:text-ink-800")}>{t.label}</Link>
            ))}
          </div>
          <form className="flex gap-2">
            <input type="hidden" name="tab" value={tab} />
            <input name="q" defaultValue={q} placeholder={tab === "sign-ins" ? "Filter by email or IP…" : "Filter by admin, target or action…"} className="focus-ring-light w-64 rounded-lg border border-ink-900/12 px-3 py-2 text-sm" />
          </form>
        </div>

        <div className="overflow-x-auto">
          {tab === "sign-ins" ? (
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead><tr className="border-b border-ink-900/[0.06] text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-5 py-3">Event</th><th className="px-3 py-3">Account</th><th className="px-3 py-3">Device</th><th className="px-3 py-3">Location</th><th className="px-3 py-3">IP</th><th className="px-5 py-3 text-right">When</th>
              </tr></thead>
              <tbody className="divide-y divide-ink-900/[0.05]">
                {eventRows.length === 0 && <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-500">No events.</td></tr>}
                {eventRows.map((e) => {
                  const meta = EVENT_LABELS[e.event] ?? { label: e.event, tone: "neutral" as const };
                  return (
                    <tr key={e.id} className="hover:bg-slate-50/70">
                      <td className="px-5 py-3"><span className="flex items-center gap-2.5 font-medium text-ink-900"><span className={cn("h-2 w-2 rounded-full", TONE[meta.tone])} />{meta.label}</span></td>
                      <td className="px-3 py-3 text-slate-700">{e.user_id ? <Link href={`/admin/users/${e.user_id}`} className="hover:text-primary-700">{e.email}</Link> : e.email}</td>
                      <td className="px-3 py-3 text-slate-600">{e.device}</td>
                      <td className="px-3 py-3 text-slate-600">{e.location}</td>
                      <td className="px-3 py-3 font-mono text-xs text-slate-500">{e.ip}</td>
                      <td className="whitespace-nowrap px-5 py-3 text-right text-slate-500" title={formatDate(e.created_at, true)}>{timeAgo(e.created_at)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead><tr className="border-b border-ink-900/[0.06] text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-5 py-3">Action</th><th className="px-3 py-3">Admin</th><th className="px-3 py-3">Target</th><th className="px-5 py-3 text-right">When</th>
              </tr></thead>
              <tbody className="divide-y divide-ink-900/[0.05]">
                {adminRows.length === 0 && <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-500">No admin actions recorded yet.</td></tr>}
                {adminRows.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-3"><code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-semibold text-ink-800">{a.action}</code></td>
                    <td className="px-3 py-3 text-slate-700">{a.actor_email}</td>
                    <td className="px-3 py-3 text-slate-600">{a.target ?? "—"}</td>
                    <td className="whitespace-nowrap px-5 py-3 text-right text-slate-500" title={formatDate(a.created_at, true)}>{timeAgo(a.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </>
  );
}
