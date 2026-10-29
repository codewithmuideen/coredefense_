import type { Metadata } from "next";
import Link from "next/link";
import { Activity, ArrowUpRight, KeyRound, LifeBuoy, ShieldAlert, UserPlus, Users } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { listAllUsers } from "@/lib/app/admin-data";
import { dailyCounts } from "@/lib/app/metrics";
import { Avatar, Badge, Card, CardHeader, PageHeader } from "@/components/app/ui";
import { ColumnChart, Donut, Legend, Sparkline, TrendChart } from "@/components/app/charts";
import { EVENT_LABELS, timeAgo } from "@/lib/app/format";
import type { LoginEvent } from "@/types/app";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Overview" };
export const dynamic = "force-dynamic";

const DAY = 86_400_000;

export default async function AdminOverview() {
  const admin = createAdminClient();
  const since30 = new Date(Date.now() - 30 * DAY).toISOString();
  const [users, { data: eventRows }, { count: openTickets }, { count: urgentTickets }, { count: criticalFindings }] = await Promise.all([
    listAllUsers(),
    admin.from("login_events").select("*").gte("created_at", since30).order("created_at", { ascending: false }).limit(5000),
    admin.from("tickets").select("id", { count: "exact", head: true }).neq("status", "resolved"),
    admin.from("tickets").select("id", { count: "exact", head: true }).neq("status", "resolved").in("priority", ["urgent", "high"]),
    admin.from("findings").select("id", { count: "exact", head: true }).eq("severity", "critical").in("status", ["open", "in_progress"]),
  ]);
  const events = (eventRows ?? []) as LoginEvent[];
  const now = Date.now();

  const signups = dailyCounts(users.map((u) => u.createdAt));
  const signIns = dailyCounts(events.filter((e) => e.event === "sign_in").map((e) => e.created_at));
  const failures = dailyCounts(events.filter((e) => ["failed_password", "code_failed", "mfa_failed", "locked_out"].includes(e.event)).map((e) => e.created_at));
  const new30 = users.filter((u) => now - new Date(u.createdAt).getTime() < 30 * DAY).length;
  const active7 = users.filter((u) => u.lastSignInAt && now - new Date(u.lastSignInAt).getTime() < 7 * DAY).length;
  const failed24 = events.filter((e) => EVENT_LABELS[e.event]?.tone === "bad" && now - new Date(e.created_at).getTime() < DAY).length;
  const mfa = {
    authenticator: users.filter((u) => u.twoFactor === "authenticator").length,
    email: users.filter((u) => u.twoFactor === "email").length,
    none: users.filter((u) => u.twoFactor === "none").length,
  };
  const protectedPct = users.length ? Math.round(((mfa.authenticator + mfa.email) / users.length) * 100) : 0;
  const recentSignIns = events.filter((e) => e.event === "sign_in").slice(0, 8);
  const suspicious = events.filter((e) => EVENT_LABELS[e.event]?.tone === "bad").slice(0, 6);

  const kpis = [
    { label: "Total users", value: users.length, sub: `${users.filter((u) => u.role === "admin").length} admins`, icon: Users, spark: signups.values, href: "/admin/users" },
    { label: "New in 30 days", value: new30, sub: "Sign-ups this month", icon: UserPlus, spark: signups.values, href: "/admin/users" },
    { label: "Active in 7 days", value: active7, sub: users.length ? `${Math.round((active7 / users.length) * 100)}% of all users` : "—", icon: Activity, spark: signIns.values, href: "/admin/audit" },
    { label: "2FA coverage", value: `${protectedPct}%`, sub: `${mfa.none} without a second factor`, icon: KeyRound, href: "/admin/users" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Admin console" title="Platform overview" description="Users, sign-in health and support load across every CoreDefense workspace." />

      {(failed24 > 0 || (urgentTickets ?? 0) > 0) && (
        <div className="flex flex-wrap gap-3">
          {failed24 > 0 && (
            <Link href="/admin/audit?tab=sign-ins" className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-100">
              <ShieldAlert className="h-4 w-4" /> {failed24} failed sign-in {failed24 === 1 ? "attempt" : "attempts"} in the last 24 hours
            </Link>
          )}
          {(urgentTickets ?? 0) > 0 && (
            <Link href="/admin/tickets" className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-800 hover:bg-amber-100">
              <LifeBuoy className="h-4 w-4" /> {urgentTickets} high-priority {urgentTickets === 1 ? "ticket needs" : "tickets need"} a reply
            </Link>
          )}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <Link key={k.label} href={k.href} className="group">
            <Card className="h-full p-5 transition-all group-hover:-translate-y-0.5 group-hover:shadow-md">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">{k.label}</p>
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary-600"><k.icon className="h-[18px] w-[18px]" /></span>
              </div>
              <div className="mt-2 flex items-end justify-between gap-2">
                <p className="text-3xl font-bold tracking-tight text-ink-900">{k.value}</p>
                {k.spark && <Sparkline values={k.spark} />}
              </div>
              <p className="mt-1 text-xs text-slate-500">{k.sub}</p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader
            title="Sign-ins vs failed attempts"
            description="Daily, last 30 days"
            action={<Legend items={[{ name: "Sign-ins", color: "#1E6AFF" }, { name: "Failed", color: "#C2410C" }]} />}
          />
          <div className="px-3 pb-3 pt-4 sm:px-5">
            <TrendChart labels={signIns.labels} series={[{ name: "Sign-ins", color: "#1E6AFF", values: signIns.values }, { name: "Failed", color: "#C2410C", values: failures.values }]} />
          </div>
        </Card>
        <Card>
          <CardHeader title="Second-factor coverage" description="How each account signs in" />
          <div className="p-6">
            <Donut
              centerLabel="Users"
              data={[
                { name: "Authenticator app", value: mfa.authenticator, color: "#0E9F8E" },
                { name: "Email codes", value: mfa.email, color: "#1E6AFF" },
                { name: "Password only", value: mfa.none, color: "#D03B3B" },
              ]}
            />
            <ul className="mt-6 space-y-2.5 text-sm">
              {[["Authenticator app", mfa.authenticator, "#0E9F8E"], ["Email codes", mfa.email, "#1E6AFF"], ["Password only", mfa.none, "#D03B3B"]].map(([l, v, c]) => (
                <li key={l as string} className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: c as string }} />
                  <span className="flex-1 text-slate-600">{l}</span>
                  <span className="font-semibold text-ink-900">{v}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="New sign-ups" description="Accounts created per day, last 30 days" />
          <div className="px-3 pb-3 pt-4 sm:px-5">
            <ColumnChart labels={signups.labels} values={signups.values} name="Sign-ups" />
          </div>
        </Card>
        <Card>
          <CardHeader title="Needs attention" />
          <dl className="divide-y divide-ink-900/[0.05]">
            {[
              { label: "Open support tickets", value: openTickets ?? 0, href: "/admin/tickets" },
              { label: "Critical findings open (all workspaces)", value: criticalFindings ?? 0, href: "/admin/users" },
              { label: "Unconfirmed accounts", value: users.filter((u) => u.status === "unconfirmed").length, href: "/admin/users?status=unconfirmed" },
              { label: "Suspended accounts", value: users.filter((u) => u.status === "suspended").length, href: "/admin/users?status=suspended" },
            ].map((r) => (
              <Link key={r.label} href={r.href} className="flex items-center justify-between gap-3 px-5 py-4 hover:bg-slate-50 sm:px-6">
                <dt className="text-sm text-slate-600">{r.label}</dt>
                <dd className="flex items-center gap-2 text-lg font-bold text-ink-900">{r.value}<ArrowUpRight className="h-4 w-4 text-slate-300" /></dd>
              </Link>
            ))}
          </dl>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader title="Latest sign-ins" action={<Link href="/admin/audit?tab=sign-ins" className="text-sm font-semibold text-primary-600">View all</Link>} />
          <ul className="divide-y divide-ink-900/[0.05]">
            {recentSignIns.length === 0 && <li className="px-6 py-10 text-center text-sm text-slate-500">No sign-ins in the last 30 days.</li>}
            {recentSignIns.map((e) => (
              <li key={e.id} className="flex items-center gap-3 px-5 py-3 sm:px-6">
                <Avatar name={e.email ?? "?"} size={32} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink-900">{e.email}</p>
                  <p className="truncate text-xs text-slate-500">{e.device} · {e.location}</p>
                </div>
                <span className="shrink-0 text-xs text-slate-400">{timeAgo(e.created_at)}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <CardHeader title="Suspicious activity" description="Wrong passwords, wrong codes and lockouts" />
          <ul className="divide-y divide-ink-900/[0.05]">
            {suspicious.length === 0 && <li className="px-6 py-10 text-center text-sm text-slate-500">Nothing suspicious in the last 30 days.</li>}
            {suspicious.map((e) => (
              <li key={e.id} className="flex items-center gap-3 px-5 py-3 sm:px-6">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600"><ShieldAlert className="h-4 w-4" /></span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink-900">{EVENT_LABELS[e.event]?.label ?? e.event} <span className="font-normal text-slate-500">· {e.email}</span></p>
                  <p className="truncate text-xs text-slate-500">{e.ip} · {e.device} · {e.location}</p>
                </div>
                <span className="shrink-0 text-xs text-slate-400">{timeAgo(e.created_at)}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card>
        <CardHeader title="Newest accounts" action={<Link href="/admin/users" className="text-sm font-semibold text-primary-600">Manage users</Link>} />
        <ul className="grid divide-y divide-ink-900/[0.05] sm:grid-cols-2 sm:divide-y-0 xl:grid-cols-3">
          {users.slice(0, 6).map((u) => (
            <li key={u.id}>
              <Link href={`/admin/users/${u.id}`} className="flex items-center gap-3 px-5 py-4 hover:bg-slate-50 sm:px-6">
                <Avatar src={u.avatarUrl} name={u.name} size={40} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink-900">{u.name}</p>
                  <p className="truncate text-xs text-slate-500">{u.company ?? u.email}</p>
                </div>
                <Badge className={cn(u.status === "active" ? "bg-emerald-50 text-emerald-700 ring-emerald-600/15" : u.status === "suspended" ? "bg-red-50 text-red-700 ring-red-600/15" : "bg-amber-50 text-amber-800 ring-amber-600/20")}>
                  {u.status[0].toUpperCase() + u.status.slice(1)}
                </Badge>
              </Link>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
