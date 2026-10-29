import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Building2, CalendarDays, Clock, Mail, Phone, ShieldCheck } from "lucide-react";
import { requireAdmin } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { Avatar, Badge, Card, CardHeader } from "@/components/app/ui";
import UserActions from "@/components/app/UserActions";
import { EVENT_LABELS, SEVERITY, TICKET_STATUS, formatDate, timeAgo } from "@/lib/app/format";
import { exposureScore, summarise } from "@/lib/app/metrics";
import type { Finding, LoginEvent, Profile, Ticket } from "@/types/app";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "User" };
export const dynamic = "force-dynamic";

export default async function AdminUserDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { user: me } = await requireAdmin();
  const admin = createAdminClient();
  const { data: authData } = await admin.auth.admin.getUserById(id);
  const authUser = authData?.user;
  if (!authUser) notFound();

  const [{ data: profileRow }, { data: findingRows }, { data: eventRows }, { data: ticketRows }] = await Promise.all([
    admin.from("profiles").select("*").eq("id", id).maybeSingle(),
    admin.from("findings").select("*").eq("user_id", id),
    admin.from("login_events").select("*").eq("user_id", id).order("created_at", { ascending: false }).limit(25),
    admin.from("tickets").select("*").eq("user_id", id).order("created_at", { ascending: false }),
  ]);
  const profile = profileRow as Profile | null;
  const findings = (findingRows ?? []) as Finding[];
  const events = (eventRows ?? []) as LoginEvent[];
  const tickets = (ticketRows ?? []) as Ticket[];
  const s = summarise(findings);

  const name = [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") || authUser.email?.split("@")[0] || "Unknown";
  const role = authUser.app_metadata?.role === "admin" ? "admin" : "user";
  const banned = !!authUser.banned_until && new Date(authUser.banned_until) > new Date();
  const status = banned ? "suspended" : authUser.email_confirmed_at ? "active" : "unconfirmed";
  const hasTotp = (authUser.factors ?? []).some((f) => f.factor_type === "totp" && f.status === "verified");
  const twoFactor = hasTotp ? "Authenticator app" : authUser.app_metadata?.email_2fa === false ? "Password only" : "Email codes";

  return (
    <div className="space-y-6">
      <Link href="/admin/users" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-ink-900">
        <ArrowLeft className="h-4 w-4" /> All users
      </Link>

      <Card className="overflow-hidden">
        <div className="relative h-28 bg-gradient-to-br from-ink-900 via-primary-900 to-primary-600">
          <div className="absolute inset-0 bg-grid-dark opacity-50" aria-hidden />
        </div>
        <div className="flex flex-col gap-5 px-5 pb-6 sm:flex-row sm:items-end sm:px-8">
          <Avatar src={profile?.avatar_url} name={name} size={96} className="-mt-12 ring-4 ring-white shadow-lg" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-ink-900">{name}</h1>
              {role === "admin" && <Badge className="bg-amber-50 text-amber-800 ring-amber-600/20"><ShieldCheck className="h-3 w-3" /> Admin</Badge>}
              <Badge className={cn(status === "active" ? "bg-emerald-50 text-emerald-700 ring-emerald-600/15" : status === "suspended" ? "bg-red-50 text-red-700 ring-red-600/15" : "bg-amber-50 text-amber-800 ring-amber-600/20")}>
                {status[0].toUpperCase() + status.slice(1)}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-slate-500">{profile?.job_title ?? "No job title"}{profile?.company ? ` · ${profile.company}` : ""}</p>
          </div>
        </div>
        <div className="border-t border-ink-900/[0.06] bg-slate-50/60 px-5 py-4 sm:px-8">
          <UserActions user={{ id, email: authUser.email ?? "", role, status, name }} selfId={me.id} variant="buttons" />
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card>
          <CardHeader title="Account details" />
          <dl className="space-y-4 p-5 text-sm sm:p-6">
            {[
              { icon: Mail, label: "Email", value: authUser.email },
              { icon: Phone, label: "Phone", value: profile?.phone ?? "—" },
              { icon: Building2, label: "Company", value: profile?.company ?? "—" },
              { icon: ShieldCheck, label: "Two-factor", value: twoFactor },
              { icon: CalendarDays, label: "Joined", value: formatDate(authUser.created_at, true) },
              { icon: Clock, label: "Last sign-in", value: authUser.last_sign_in_at ? `${formatDate(authUser.last_sign_in_at, true)} (${timeAgo(authUser.last_sign_in_at)})` : "Never" },
            ].map((r) => (
              <div key={r.label} className="flex gap-3">
                <r.icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                <div className="min-w-0">
                  <dt className="text-xs text-slate-500">{r.label}</dt>
                  <dd className="break-words font-medium text-ink-900">{r.value}</dd>
                </div>
              </div>
            ))}
            {profile?.bio && <p className="rounded-xl bg-slate-50 p-3 text-[13px] leading-relaxed text-slate-600">{profile.bio}</p>}
          </dl>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader title="Workspace risk" description="This user's findings queue" />
          <div className="grid grid-cols-2 gap-px bg-ink-900/[0.06] sm:grid-cols-4">
            {[
              ["Exposure score", exposureScore(findings)],
              ["Open findings", s.open],
              ["Critical open", s.critical],
              ["Resolved", s.resolved],
            ].map(([l, v]) => (
              <div key={l} className="bg-white p-5">
                <p className="text-xs font-medium text-slate-500">{l}</p>
                <p className="mt-1 text-2xl font-bold text-ink-900">{v}</p>
              </div>
            ))}
          </div>
          <div className="space-y-2.5 p-5 sm:p-6">
            {s.bySeverity.map((b) => (
              <div key={b.severity} className="flex items-center gap-3 text-sm">
                <span className="w-16 text-slate-600">{SEVERITY[b.severity].label}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full" style={{ width: `${s.open ? (b.count / s.open) * 100 : 0}%`, background: SEVERITY[b.severity].color }} />
                </div>
                <span className="w-6 text-right font-semibold text-ink-900">{b.count}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader title="Sign-in history" description="Last 25 events" />
          <ul className="divide-y divide-ink-900/[0.05]">
            {events.length === 0 && <li className="px-6 py-10 text-center text-sm text-slate-500">No events recorded.</li>}
            {events.map((e) => {
              const meta = EVENT_LABELS[e.event] ?? { label: e.event, tone: "neutral" as const };
              return (
                <li key={e.id} className="flex items-center gap-3 px-5 py-3 sm:px-6">
                  <span className={cn("h-2 w-2 shrink-0 rounded-full", meta.tone === "good" ? "bg-emerald-500" : meta.tone === "bad" ? "bg-red-500" : meta.tone === "warn" ? "bg-amber-500" : "bg-slate-300")} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink-900">{meta.label}</p>
                    <p className="truncate text-xs text-slate-500">{e.device} · {e.location} · {e.ip}</p>
                  </div>
                  <span className="shrink-0 text-xs text-slate-400">{timeAgo(e.created_at)}</span>
                </li>
              );
            })}
          </ul>
        </Card>
        <Card>
          <CardHeader title="Support tickets" action={<Link href="/admin/tickets" className="text-sm font-semibold text-primary-600">Open inbox</Link>} />
          <ul className="divide-y divide-ink-900/[0.05]">
            {tickets.length === 0 && <li className="px-6 py-10 text-center text-sm text-slate-500">No tickets from this user.</li>}
            {tickets.map((t) => (
              <li key={t.id} className="flex items-center gap-3 px-5 py-3 sm:px-6">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink-900">{t.subject}</p>
                  <p className="text-xs text-slate-500">{t.category} · {t.priority} · {timeAgo(t.created_at)}</p>
                </div>
                <Badge className={TICKET_STATUS[t.status].badge}>{TICKET_STATUS[t.status].label}</Badge>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
