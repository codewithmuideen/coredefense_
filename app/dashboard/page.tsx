import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle, ArrowRight, ArrowUpRight, CalendarClock, CheckCircle2, Circle, Clock3, LogIn, ShieldAlert, Sparkles, Timer,
} from "lucide-react";
import { requireViewer } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { Badge, Card, CardHeader } from "@/components/app/ui";
import { Donut, Legend, ProgressBar, ScoreRing, TrendChart } from "@/components/app/charts";
import { EVENT_LABELS, SEVERITY, formatDate, greeting, timeAgo } from "@/lib/app/format";
import { exposureScore, isOpen, summarise, weeklyTrend } from "@/lib/app/metrics";
import type { Activity, Finding, LoginEvent } from "@/types/app";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Overview" };

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ welcome?: string }> }) {
  const { welcome } = await searchParams;
  const { user, profile } = await requireViewer();
  const supabase = await createClient();

  const [{ data: findingRows }, { data: eventRows }, { data: activityRows }, { data: factors }] = await Promise.all([
    supabase.from("findings").select("*").eq("user_id", user.id).order("detected_at", { ascending: false }),
    supabase.from("login_events").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(6),
    supabase.from("activity").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(6),
    supabase.auth.mfa.listFactors(),
  ]);
  const findings = (findingRows ?? []) as Finding[];
  const events = (eventRows ?? []) as LoginEvent[];
  const activity = (activityRows ?? []) as Activity[];

  const s = summarise(findings);
  const score = exposureScore(findings);
  const trend = weeklyTrend(findings);
  const priority = findings
    .filter(isOpen)
    .sort((a, b) => SEVERITY[a.severity].rank - SEVERITY[b.severity].rank || (a.due_at ?? "9").localeCompare(b.due_at ?? "9"))
    .slice(0, 5);

  const hasTotp = (factors?.totp ?? []).some((f) => f.status === "verified");
  const emailCodes = user.app_metadata?.email_2fa !== false;
  const checklist = [
    { done: !!user.email_confirmed_at, label: "Confirm your email", href: "/dashboard/profile" },
    { done: !!profile.avatar_url, label: "Add a profile photo", href: "/dashboard/profile" },
    { done: !!profile.job_title, label: "Add your job title", href: "/dashboard/profile" },
    { done: emailCodes || hasTotp, label: "Two-step sign-in on", href: "/dashboard/security#two-factor" },
    { done: hasTotp, label: "Add an authenticator app", href: "/dashboard/security#two-factor" },
  ];
  const checklistPct = (checklist.filter((c) => c.done).length / checklist.length) * 100;
  const firstName = profile.first_name || profile.email.split("@")[0];

  const kpis = [
    { label: "Open findings", value: s.open, sub: `${s.total} tracked in total`, icon: ShieldAlert, tone: "text-primary-600 bg-primary-50" },
    { label: "Critical & high", value: s.critical + s.high, sub: `${s.critical} critical need action now`, icon: AlertTriangle, tone: "text-red-600 bg-red-50" },
    { label: "Overdue", value: s.overdue, sub: "Past their remediation date", icon: CalendarClock, tone: "text-amber-600 bg-amber-50" },
    { label: "Mean time to fix", value: s.mttr === null ? "—" : `${s.mttr.toFixed(1)}d`, sub: `${s.resolved30} resolved in 30 days`, icon: Timer, tone: "text-emerald-600 bg-emerald-50" },
  ];

  return (
    <div className="space-y-6">
      {welcome && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600 to-primary-500 p-5 text-white shadow-lg shadow-primary-500/20 sm:p-6">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" aria-hidden />
          <div className="relative flex flex-wrap items-center gap-4">
            <Sparkles className="h-6 w-6 shrink-0" />
            <div className="flex-1">
              <p className="font-bold">You&apos;re signed in. Welcome to CoreDefense.</p>
              <p className="text-sm text-white/80">We&apos;ve emailed you a sign-in alert. Finish the setup checklist below to secure your account.</p>
            </div>
            <Link href="/dashboard/profile" className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-primary-700 hover:bg-white/90">Complete profile</Link>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long" }).format(new Date())}</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink-900 sm:text-[28px]">
            {greeting()}, {firstName}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {s.critical > 0
              ? `${s.critical} critical ${s.critical === 1 ? "finding needs" : "findings need"} attention today.`
              : "No critical findings open. Nice work."}
          </p>
        </div>
        <Link href="/dashboard/findings" className="focus-ring-light inline-flex items-center gap-2 rounded-lg bg-ink-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-ink-700">
          Review findings <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* KPI row */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label} className="p-5 transition-shadow hover:shadow-md">
            <div className="flex items-start justify-between">
              <p className="text-sm font-medium text-slate-500">{k.label}</p>
              <span className={cn("flex h-9 w-9 items-center justify-center rounded-xl", k.tone)}>
                <k.icon className="h-[18px] w-[18px]" />
              </span>
            </div>
            <p className="mt-2 text-3xl font-bold tracking-tight text-ink-900">{k.value}</p>
            <p className="mt-1 text-xs text-slate-500">{k.sub}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Trend */}
        <Card className="xl:col-span-2">
          <CardHeader
            title="Detection vs remediation"
            description="Findings detected and resolved each week, last 12 weeks"
            action={<Legend items={[{ name: "Detected", color: "#1E6AFF" }, { name: "Resolved", color: "#0E9F8E" }]} />}
          />
          <div className="px-3 pb-3 pt-4 sm:px-5">
            <TrendChart
              labels={trend.labels}
              series={[
                { name: "Detected", color: "#1E6AFF", values: trend.detected },
                { name: "Resolved", color: "#0E9F8E", values: trend.resolved },
              ]}
            />
          </div>
        </Card>

        {/* Exposure score */}
        <Card className="flex flex-col">
          <CardHeader title="Exposure score" description="Higher is better. Weighted by open severity." />
          <div className="flex flex-1 flex-col items-center justify-center gap-5 p-6">
            <ScoreRing score={score} label={score >= 75 ? "Good" : score >= 50 ? "Fair" : score >= 30 ? "At risk" : "Critical"} size={150} />
            <div className="w-full space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Remediation progress</span>
                <span className="font-semibold text-ink-900">{Math.round(s.progress)}%</span>
              </div>
              <ProgressBar value={s.progress} />
              <p className="text-xs text-slate-500">{s.resolved} of {findings.filter((f) => f.status !== "accepted").length} actionable findings resolved</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Priority queue */}
        <Card className="xl:col-span-2">
          <CardHeader
            title="Priority queue"
            description="The open findings to fix first"
            action={<Link href="/dashboard/findings" className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700">View all <ArrowUpRight className="h-4 w-4" /></Link>}
          />
          <ul className="divide-y divide-ink-900/[0.05]">
            {priority.length === 0 && <li className="px-6 py-10 text-center text-sm text-slate-500">Nothing open. Your queue is clear.</li>}
            {priority.map((f) => {
              const overdue = f.due_at && new Date(f.due_at) < new Date();
              return (
                <li key={f.id}>
                  <Link href={`/dashboard/findings?id=${f.id}`} className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-slate-50 sm:px-6">
                    <span className="h-9 w-1 shrink-0 rounded-full" style={{ background: SEVERITY[f.severity].color }} aria-hidden />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink-900">{f.title}</p>
                      <p className="mt-0.5 truncate text-xs text-slate-500">{f.asset} · {f.category}</p>
                    </div>
                    <Badge className={SEVERITY[f.severity].badge} dot={SEVERITY[f.severity].color}>{SEVERITY[f.severity].label}</Badge>
                    <span className={cn("hidden w-28 text-right text-xs font-medium sm:block", overdue ? "text-red-600" : "text-slate-500")}>
                      {f.due_at ? (overdue ? `Overdue ${timeAgo(f.due_at).replace(" ago", "")}` : `Due ${timeAgo(f.due_at)}`) : "No due date"}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Card>

        {/* Severity mix */}
        <Card>
          <CardHeader title="Open by severity" description="Hover a segment for its count" />
          <div className="p-6">
            <Donut
              data={s.bySeverity.map((b) => ({ name: SEVERITY[b.severity].label, value: b.count, color: SEVERITY[b.severity].color }))}
              centerLabel="Open findings"
            />
            <ul className="mt-6 space-y-2.5">
              {s.bySeverity.map((b) => (
                <li key={b.severity} className="flex items-center gap-3 text-sm">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: SEVERITY[b.severity].color }} aria-hidden />
                  <span className="flex-1 text-slate-600">{SEVERITY[b.severity].label}</span>
                  <span className="font-semibold text-ink-900">{b.count}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {/* Setup checklist */}
        <Card>
          <CardHeader title="Account setup" description={`${Math.round(checklistPct)}% complete`} />
          <div className="p-5 sm:p-6">
            <ProgressBar value={checklistPct} color="bg-emerald-500" />
            <ul className="mt-5 space-y-1">
              {checklist.map((c) => (
                <li key={c.label}>
                  <Link href={c.href} className="group flex items-center gap-3 rounded-lg px-2 py-2 text-sm hover:bg-slate-50">
                    {c.done ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <Circle className="h-5 w-5 text-slate-300" />}
                    <span className={cn("flex-1", c.done ? "text-slate-400 line-through" : "font-medium text-ink-800")}>{c.label}</span>
                    {!c.done && <ArrowRight className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-primary-500" />}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        {/* Sign-in activity */}
        <Card>
          <CardHeader
            title="Recent sign-in activity"
            action={<Link href="/dashboard/security#history" className="text-sm font-semibold text-primary-600 hover:text-primary-700">All</Link>}
          />
          <ul className="divide-y divide-ink-900/[0.05]">
            {events.length === 0 && <li className="px-6 py-8 text-center text-sm text-slate-500">No sign-in activity yet.</li>}
            {events.map((e) => {
              const meta = EVENT_LABELS[e.event] ?? { label: e.event, tone: "neutral" };
              return (
                <li key={e.id} className="flex items-center gap-3 px-5 py-3 sm:px-6">
                  <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                    meta.tone === "good" ? "bg-emerald-50 text-emerald-600" : meta.tone === "bad" ? "bg-red-50 text-red-600" : meta.tone === "warn" ? "bg-amber-50 text-amber-600" : "bg-slate-100 text-slate-500")}>
                    <LogIn className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink-900">{meta.label}</p>
                    <p className="truncate text-xs text-slate-500">{e.device} · {e.location}</p>
                  </div>
                  <span className="shrink-0 text-xs text-slate-400">{timeAgo(e.created_at)}</span>
                </li>
              );
            })}
          </ul>
        </Card>

        {/* Workspace activity */}
        <Card className="lg:col-span-2 xl:col-span-1">
          <CardHeader title="Workspace activity" />
          <ol className="relative space-y-5 p-6">
            {activity.length === 0 && <li className="text-center text-sm text-slate-500">No activity yet.</li>}
            {activity.map((a, i) => (
              <li key={a.id} className="relative flex gap-3 pl-1">
                {i < activity.length - 1 && <span className="absolute left-[9px] top-6 h-[calc(100%+4px)] w-px bg-slate-200" aria-hidden />}
                <span className="relative mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary-100">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink-900">{a.action}</p>
                  {a.detail && <p className="text-xs text-slate-500">{a.detail}</p>}
                  <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-400"><Clock3 className="h-3 w-3" />{formatDate(a.created_at, true)}</p>
                </div>
              </li>
            ))}
          </ol>
        </Card>
      </div>
    </div>
  );
}
