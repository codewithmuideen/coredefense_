"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDownUp, CalendarClock, Download, Gauge, Search, Server, ShieldAlert, Tag, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Badge, Card, EmptyState, btn, field } from "@/components/app/ui";
import { useToast } from "@/components/app/Toaster";
import { FINDING_STATUS, SEVERITIES, SEVERITY, formatDate, timeAgo } from "@/lib/app/format";
import type { Finding, FindingStatus, Severity } from "@/types/app";
import { cn } from "@/lib/utils";

type StatusFilter = "active" | FindingStatus | "all";
type Sort = "severity" | "due" | "newest";

const STATUS_TABS: { id: StatusFilter; label: string }[] = [
  { id: "active", label: "Active" },
  { id: "open", label: "Open" },
  { id: "in_progress", label: "In progress" },
  { id: "resolved", label: "Resolved" },
  { id: "accepted", label: "Accepted" },
  { id: "all", label: "All" },
];

const matchesStatus = (f: Finding, s: StatusFilter) =>
  s === "all" ? true : s === "active" ? f.status === "open" || f.status === "in_progress" : f.status === s;

export default function FindingsBoard({ userId, initial, openId }: { userId: string; initial: Finding[]; openId?: string }) {
  const router = useRouter();
  const toast = useToast();
  const [findings, setFindings] = useState(initial);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("active");
  const [severities, setSeverities] = useState<Severity[]>([]);
  const [sort, setSort] = useState<Sort>("severity");
  const [selectedId, setSelectedId] = useState<string | null>(openId ?? null);
  const [saving, setSaving] = useState(false);

  useEffect(() => setFindings(initial), [initial]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return findings
      .filter((f) => matchesStatus(f, status))
      .filter((f) => !severities.length || severities.includes(f.severity))
      .filter((f) => !q || `${f.title} ${f.asset} ${f.category} ${f.cve ?? ""}`.toLowerCase().includes(q))
      .sort((a, b) =>
        sort === "severity"
          ? SEVERITY[a.severity].rank - SEVERITY[b.severity].rank || (b.cvss ?? 0) - (a.cvss ?? 0)
          : sort === "due"
            ? (a.due_at ?? "9999").localeCompare(b.due_at ?? "9999")
            : b.detected_at.localeCompare(a.detected_at)
      );
  }, [findings, query, status, severities, sort]);

  const selected = findings.find((f) => f.id === selectedId) ?? null;

  async function setFindingStatus(f: Finding, next: FindingStatus) {
    if (f.status === next) return;
    setSaving(true);
    const resolved_at = next === "resolved" ? new Date().toISOString() : null;
    const before = findings;
    setFindings((all) => all.map((x) => (x.id === f.id ? { ...x, status: next, resolved_at } : x)));
    const supabase = createClient();
    const { error } = await supabase.from("findings").update({ status: next, resolved_at }).eq("id", f.id);
    setSaving(false);
    if (error) {
      setFindings(before);
      toast({ tone: "error", title: "Couldn't update the finding", description: error.message });
      return;
    }
    await supabase.from("activity").insert({ user_id: userId, action: `Marked “${f.title}” as ${FINDING_STATUS[next].label.toLowerCase()}`, detail: `${SEVERITY[f.severity].label} · ${f.asset}` });
    toast({ tone: "success", title: `Moved to ${FINDING_STATUS[next].label}`, description: f.title });
    router.refresh();
  }

  function exportCsv() {
    const header = ["Title", "Severity", "Status", "Asset", "Category", "CVSS", "CVE", "Detected", "Due", "Resolved"];
    const rows = visible.map((f) => [f.title, f.severity, f.status, f.asset, f.category, f.cvss ?? "", f.cve ?? "", f.detected_at, f.due_at ?? "", f.resolved_at ?? ""]);
    const csv = [header, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: `coredefense-findings-${new Date().toISOString().slice(0, 10)}.csv` });
    a.click();
    URL.revokeObjectURL(url);
  }

  const toggleSeverity = (s: Severity) => setSeverities((all) => (all.includes(s) ? all.filter((x) => x !== s) : [...all, s]));

  return (
    <>
      <Card>
        {/* Status tabs */}
        <div className="scroll-slim flex gap-1 overflow-x-auto border-b border-ink-900/[0.06] px-3 pt-2 sm:px-5">
          {STATUS_TABS.map((t) => {
            const count = findings.filter((f) => matchesStatus(f, t.id)).length;
            const active = status === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setStatus(t.id)}
                className={cn(
                  "relative flex shrink-0 items-center gap-2 px-3 pb-3 pt-2 text-sm font-semibold transition-colors",
                  active ? "text-primary-700" : "text-slate-500 hover:text-ink-800"
                )}
              >
                {t.label}
                <span className={cn("rounded-full px-1.5 py-px text-[11px]", active ? "bg-primary-100 text-primary-700" : "bg-slate-100 text-slate-500")}>{count}</span>
                {active && <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-primary-500" />}
              </button>
            );
          })}
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 border-b border-ink-900/[0.06] p-3 sm:px-5">
          <div className="relative min-w-[200px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search title, asset, CVE…" className={cn(field, "pl-9")} />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {SEVERITIES.map((s) => {
              const on = severities.includes(s);
              return (
                <button
                  key={s}
                  onClick={() => toggleSeverity(s)}
                  aria-pressed={on}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors",
                    on ? "border-ink-900 bg-ink-900 text-white" : "border-ink-900/12 bg-white text-slate-600 hover:border-ink-900/25"
                  )}
                >
                  <span className="h-2 w-2 rounded-full" style={{ background: SEVERITY[s].color }} />
                  {SEVERITY[s].label}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2">
            <label className="relative">
              <span className="sr-only">Sort by</span>
              <ArrowDownUp className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className={cn(field, "w-auto py-2 pl-9 pr-8")}>
                <option value="severity">Severity</option>
                <option value="due">Due date</option>
                <option value="newest">Newest</option>
              </select>
            </label>
            <button onClick={exportCsv} className={cn(btn.secondary, "py-2")} title="Export the filtered list as CSV">
              <Download className="h-4 w-4" /> <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {visible.length === 0 ? (
          <EmptyState icon={ShieldAlert} title="No findings match" description="Try a different status tab, clear the severity filter or search for something else." />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-ink-900/[0.06] text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="px-5 py-3">Finding</th>
                    <th className="px-3 py-3">Severity</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3 text-right">CVSS</th>
                    <th className="px-3 py-3">Due</th>
                    <th className="px-5 py-3">Detected</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-900/[0.05]">
                  {visible.map((f) => {
                    const overdue = f.due_at && new Date(f.due_at) < new Date() && f.status !== "resolved" && f.status !== "accepted";
                    return (
                      <tr key={f.id} onClick={() => setSelectedId(f.id)} className={cn("cursor-pointer transition-colors hover:bg-slate-50", selectedId === f.id && "bg-primary-50/50")}>
                        <td className="max-w-md px-5 py-3.5">
                          <p className="truncate font-semibold text-ink-900">{f.title}</p>
                          <p className="mt-0.5 truncate text-xs text-slate-500">{f.asset} · {f.category}{f.cve ? ` · ${f.cve}` : ""}</p>
                        </td>
                        <td className="px-3 py-3.5"><Badge className={SEVERITY[f.severity].badge} dot={SEVERITY[f.severity].color}>{SEVERITY[f.severity].label}</Badge></td>
                        <td className="px-3 py-3.5"><Badge className={FINDING_STATUS[f.status].badge}>{FINDING_STATUS[f.status].label}</Badge></td>
                        <td className="px-3 py-3.5 text-right font-mono text-[13px] tabular-nums text-ink-800">{f.cvss?.toFixed(1) ?? "—"}</td>
                        <td className={cn("whitespace-nowrap px-3 py-3.5 text-[13px]", overdue ? "font-semibold text-red-600" : "text-slate-600")}>{overdue ? "Overdue" : formatDate(f.due_at)}</td>
                        <td className="whitespace-nowrap px-5 py-3.5 text-[13px] text-slate-500">{timeAgo(f.detected_at)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <ul className="divide-y divide-ink-900/[0.05] md:hidden">
              {visible.map((f) => (
                <li key={f.id}>
                  <button onClick={() => setSelectedId(f.id)} className="w-full px-4 py-4 text-left active:bg-slate-50">
                    <div className="flex items-center gap-2">
                      <Badge className={SEVERITY[f.severity].badge} dot={SEVERITY[f.severity].color}>{SEVERITY[f.severity].label}</Badge>
                      <Badge className={FINDING_STATUS[f.status].badge}>{FINDING_STATUS[f.status].label}</Badge>
                    </div>
                    <p className="mt-2 font-semibold text-ink-900">{f.title}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{f.asset} · detected {timeAgo(f.detected_at)}</p>
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
        <p className="border-t border-ink-900/[0.06] px-5 py-3 text-xs text-slate-500">
          Showing {visible.length} of {findings.length} findings
        </p>
      </Card>

      {/* Detail drawer */}
      {selected && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-ink-900/40 backdrop-blur-[2px]" onClick={() => setSelectedId(null)} aria-hidden />
          <aside role="dialog" aria-modal="true" aria-label={selected.title} className="absolute inset-y-0 right-0 flex w-full max-w-lg flex-col bg-white shadow-2xl animate-[slide-in_0.3s_cubic-bezier(0.16,1,0.3,1)]">
            <div className="flex items-start gap-3 border-b border-ink-900/[0.06] p-5 sm:p-6">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className={SEVERITY[selected.severity].badge} dot={SEVERITY[selected.severity].color}>{SEVERITY[selected.severity].label}</Badge>
                  <Badge className={FINDING_STATUS[selected.status].badge}>{FINDING_STATUS[selected.status].label}</Badge>
                </div>
                <h2 className="mt-3 text-lg font-bold leading-snug text-ink-900">{selected.title}</h2>
              </div>
              <button onClick={() => setSelectedId(null)} className="focus-ring-light rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-ink-800" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="scroll-slim flex-1 space-y-6 overflow-y-auto p-5 sm:p-6">
              <dl className="grid grid-cols-2 gap-3">
                {[
                  { icon: Server, label: "Asset", value: selected.asset },
                  { icon: Tag, label: "Category", value: selected.category },
                  { icon: Gauge, label: "CVSS", value: selected.cvss?.toFixed(1) ?? "Not scored" },
                  { icon: CalendarClock, label: "Due", value: formatDate(selected.due_at) },
                ].map((d) => (
                  <div key={d.label} className="rounded-xl border border-ink-900/[0.07] bg-slate-50/60 p-3">
                    <dt className="flex items-center gap-1.5 text-xs font-medium text-slate-500"><d.icon className="h-3.5 w-3.5" />{d.label}</dt>
                    <dd className="mt-1 truncate text-sm font-semibold text-ink-900">{d.value}</dd>
                  </div>
                ))}
              </dl>

              {selected.cve && (
                <a href={`https://nvd.nist.gov/vuln/detail/${selected.cve}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-ink-900 px-3 py-1.5 font-mono text-xs font-semibold text-white hover:bg-ink-700">
                  {selected.cve} ↗
                </a>
              )}

              <div>
                <h3 className="text-sm font-bold text-ink-900">What we found and how to fix it</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{selected.description ?? "No description provided."}</p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-ink-900">Timeline</h3>
                <ol className="mt-3 space-y-3 border-l-2 border-slate-100 pl-4 text-sm">
                  <li><p className="font-medium text-ink-800">Detected</p><p className="text-xs text-slate-500">{formatDate(selected.detected_at, true)}</p></li>
                  {selected.due_at && <li><p className="font-medium text-ink-800">Remediation due</p><p className="text-xs text-slate-500">{formatDate(selected.due_at, true)}</p></li>}
                  {selected.resolved_at && <li><p className="font-medium text-emerald-700">Resolved</p><p className="text-xs text-slate-500">{formatDate(selected.resolved_at, true)}</p></li>}
                </ol>
              </div>
            </div>

            <div className="border-t border-ink-900/[0.06] bg-slate-50/60 p-5 sm:p-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Update status</p>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(FINDING_STATUS) as FindingStatus[]).map((s) => (
                  <button
                    key={s}
                    disabled={saving}
                    onClick={() => setFindingStatus(selected, s)}
                    className={cn(
                      "rounded-lg border px-3 py-2.5 text-sm font-semibold transition-all disabled:opacity-60",
                      selected.status === s ? "border-primary-500 bg-primary-500 text-white shadow-sm" : "border-ink-900/12 bg-white text-ink-700 hover:border-primary-300 hover:text-primary-700"
                    )}
                  >
                    {FINDING_STATUS[s].label}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
