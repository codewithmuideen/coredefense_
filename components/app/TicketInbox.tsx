"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, CheckCircle2, ExternalLink, Inbox, Lock, Search, Send, Star } from "lucide-react";
import { Avatar, Badge, Card, EmptyState, Spinner, btn, field } from "@/components/app/ui";
import { Bubble, SlaLine } from "@/components/app/SupportCenter";
import { postJson, useToast } from "@/components/app/Toaster";
import { TICKET_STATUS, formatDate, timeAgo } from "@/lib/app/format";
import { PRIORITIES, PRIORITY, STATUSES, customerId, slaState, ticketRef } from "@/lib/app/support";
import type { Ticket, TicketMessage, TicketPriority, TicketStatus } from "@/types/app";
import { cn } from "@/lib/utils";

export type AdminTicket = Ticket & {
  profiles: { email: string; first_name: string | null; last_name: string | null; company: string | null; avatar_url: string | null; customer_no: number | null } | null;
};

type View = "needs_reply" | "awaiting_customer" | "done" | "all";
const VIEWS: [View, string][] = [["needs_reply", "Needs reply"], ["awaiting_customer", "Awaiting customer"], ["done", "Resolved"], ["all", "All"]];

export default function TicketInbox({ initial, messages: initialMessages, selectedId: initialSelected }: { initial: AdminTicket[]; messages: TicketMessage[]; selectedId?: string }) {
  const router = useRouter();
  const toast = useToast();
  const [tickets, setTickets] = useState(initial);
  const [view, setView] = useState<View>(initialSelected ? "all" : "needs_reply");
  const [urgency, setUrgency] = useState<"all" | TicketPriority | "overdue">("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(initialSelected ?? null);
  const [reply, setReply] = useState("");
  const [internal, setInternal] = useState(false);
  const [busy, setBusy] = useState(false);
  useEffect(() => setTickets(initial), [initial]);

  const matchesView = (t: AdminTicket, v: View) =>
    v === "all" ? true : v === "done" ? t.status === "resolved" || t.status === "closed" : v === "awaiting_customer" ? t.status === "awaiting_customer" : t.status === "open" || t.status === "in_progress";

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tickets
      .filter((t) => matchesView(t, view))
      .filter((t) => (urgency === "all" ? true : urgency === "overdue" ? slaState(t).kind === "breached" : t.priority === urgency))
      .filter((t) => !q || `${t.ref ?? ""} ${t.subject} ${t.message} ${t.category} ${t.profiles?.email ?? ""} ${t.profiles?.first_name ?? ""} ${t.profiles?.last_name ?? ""} ${customerId(t.profiles?.customer_no)}`.toLowerCase().includes(q))
      .sort((a, b) => PRIORITY[a.priority].rank - PRIORITY[b.priority].rank || (a.due_at ?? a.created_at).localeCompare(b.due_at ?? b.created_at));
  }, [tickets, view, urgency, query]);
  const selected = tickets.find((t) => t.id === (selectedId ?? visible[0]?.id)) ?? null;
  const thread = useMemo(() => initialMessages.filter((m) => m.ticket_id === selected?.id), [initialMessages, selected?.id]);
  const customerTickets = selected ? tickets.filter((t) => t.user_id === selected.user_id) : [];
  useEffect(() => { setReply(""); setInternal(false); }, [selected?.id]);

  const overdue = tickets.filter((t) => slaState(t).kind === "breached").length;

  async function update(body: { status?: TicketStatus; priority?: TicketPriority; reply?: string; internal?: boolean }, success: string) {
    if (!selected) return;
    setBusy(true);
    try {
      await postJson(`/api/admin/tickets/${selected.id}`, body, "PATCH");
      setTickets((all) => all.map((t) => (t.id === selected.id ? { ...t, ...(body.status ? { status: body.status } : {}), ...(body.priority ? { priority: body.priority } : {}) } : t)));
      setReply("");
      setInternal(false);
      toast({ tone: "success", title: success });
      router.refresh();
    } catch (err) {
      toast({ tone: "error", title: "Update failed", description: (err as Error).message });
    } finally {
      setBusy(false);
    }
  }

  const customer = (t: AdminTicket) => [t.profiles?.first_name, t.profiles?.last_name].filter(Boolean).join(" ") || t.profiles?.email || "Unknown";
  const sendReply = () => reply.trim() && update({ reply: reply.trim(), internal }, internal ? "Internal note added" : "Reply sent: the customer was emailed and notified");

  return (
    <div className="space-y-4">
      {/* Queue health */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {PRIORITIES.map((p) => {
          const n = tickets.filter((t) => t.priority === p && (t.status === "open" || t.status === "in_progress")).length;
          return (
            <button key={p} onClick={() => { setUrgency(urgency === p ? "all" : p); setView("needs_reply"); }} className={cn("rounded-2xl border bg-white p-4 text-left transition-colors", urgency === p ? "border-primary-500 ring-1 ring-primary-500" : "border-ink-900/[0.06] hover:border-primary-300")}>
              <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500"><span className="h-2 w-2 rounded-full" style={{ background: PRIORITY[p].dot }} />{PRIORITY[p].label}</p>
              <p className="mt-1 text-2xl font-bold text-ink-900">{n}</p>
              <p className="text-[11px] text-slate-400">need a reply · target {PRIORITY[p].target}</p>
            </button>
          );
        })}
        <button onClick={() => { setUrgency(urgency === "overdue" ? "all" : "overdue"); setView("all"); }} className={cn("rounded-2xl border p-4 text-left transition-colors", overdue ? "border-red-200 bg-red-50" : "border-ink-900/[0.06] bg-white", urgency === "overdue" && "ring-1 ring-red-500")}>
          <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-red-700"><AlertTriangle className="h-3.5 w-3.5" /> Overdue</p>
          <p className="mt-1 text-2xl font-bold text-ink-900">{overdue}</p>
          <p className="text-[11px] text-slate-500">past their response target</p>
        </button>
        <div className="rounded-2xl border border-ink-900/[0.06] bg-white p-4">
          <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500"><Star className="h-3.5 w-3.5" /> Satisfaction</p>
          {(() => {
            const rated = tickets.filter((t) => t.rating);
            const avg = rated.length ? rated.reduce((s, t) => s + (t.rating ?? 0), 0) / rated.length : 0;
            return <><p className="mt-1 text-2xl font-bold text-ink-900">{rated.length ? `${avg.toFixed(1)} / 5` : "—"}</p><p className="text-[11px] text-slate-400">{rated.length} rated {rated.length === 1 ? "ticket" : "tickets"}</p></>;
          })()}
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="grid min-h-[640px] lg:grid-cols-[390px_1fr] 2xl:grid-cols-[390px_1fr_280px]">
          {/* Queue */}
          <div className="flex flex-col border-b border-ink-900/[0.06] lg:border-b-0 lg:border-r">
            <div className="space-y-3 border-b border-ink-900/[0.06] p-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Reference, customer ID, name, email…" className={cn(field, "pl-9")} />
              </div>
              <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
                {VIEWS.map(([id, label]) => (
                  <button key={id} onClick={() => setView(id)} className={cn("flex-1 rounded-md px-1.5 py-1 text-[11px] font-semibold transition-colors", view === id ? "bg-white text-ink-900 shadow-sm" : "text-slate-500 hover:text-ink-800")}>
                    {label} <span className="text-slate-400">{tickets.filter((t) => matchesView(t, id)).length}</span>
                  </button>
                ))}
              </div>
            </div>
            <ul className="scroll-slim max-h-[580px] flex-1 divide-y divide-ink-900/[0.05] overflow-y-auto">
              {visible.length === 0 && <li className="px-6 py-14 text-center text-sm text-slate-500">Nothing in this view.</li>}
              {visible.map((t) => {
                const sla = slaState(t);
                return (
                  <li key={t.id}>
                    <button onClick={() => setSelectedId(t.id)} className={cn("w-full px-4 py-3.5 text-left transition-colors", selected?.id === t.id ? "bg-primary-50/70" : "hover:bg-slate-50")}>
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: PRIORITY[t.priority].dot }} title={PRIORITY[t.priority].label} />
                        <span className="font-mono text-[11px] font-semibold text-primary-700">{ticketRef(t)}</span>
                        {t.last_reply_by === "customer" && (t.status === "open" || t.status === "in_progress") && <span className="rounded bg-primary-500 px-1.5 text-[9px] font-bold uppercase text-white">New</span>}
                        <span className="ml-auto shrink-0 text-[11px] text-slate-400">{timeAgo(t.last_activity_at ?? t.created_at)}</span>
                      </div>
                      <p className="mt-1 truncate pl-4 text-sm font-semibold text-ink-900">{t.subject}</p>
                      <p className="mt-0.5 truncate pl-4 text-xs text-slate-500">{customer(t)} · {t.category}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-1.5 pl-4">
                        <Badge className={TICKET_STATUS[t.status].badge}>{TICKET_STATUS[t.status].staffLabel}</Badge>
                        {(sla.kind === "breached" || sla.kind === "soon") && <span className={cn("text-[11px] font-semibold", sla.kind === "breached" ? "text-red-600" : "text-orange-600")} suppressHydrationWarning>{sla.label}</span>}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Conversation */}
          {!selected ? (
            <div className="2xl:col-span-2"><EmptyState icon={Inbox} title="Inbox zero" description="No tickets to show. New requests appear here and in your notifications." /></div>
          ) : (
            <>
              <div className="flex min-w-0 flex-col">
                <div className="flex flex-wrap items-start gap-3 border-b border-ink-900/[0.06] p-5 sm:p-6">
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-xs font-bold text-primary-700">{ticketRef(selected)}</p>
                    <h2 className="mt-1 text-lg font-bold text-ink-900">{selected.subject}</h2>
                    <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                      <span>{selected.category}</span>
                      <span>Opened {formatDate(selected.created_at, true)}</span>
                      <SlaLine ticket={selected} />
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <select value={selected.priority} disabled={busy} onChange={(e) => update({ priority: e.target.value as TicketPriority }, "Urgency updated")} className={cn(field, "w-auto py-2 text-xs")} aria-label="Urgency">
                      {PRIORITIES.map((p) => <option key={p} value={p}>{PRIORITY[p].label}</option>)}
                    </select>
                    <select value={selected.status} disabled={busy} onChange={(e) => update({ status: e.target.value as TicketStatus }, "Status updated")} className={cn(field, "w-auto py-2 text-xs")} aria-label="Status">
                      {STATUSES.map((s) => <option key={s} value={s}>{TICKET_STATUS[s].staffLabel}</option>)}
                    </select>
                  </div>
                </div>

                <div className="scroll-slim max-h-[520px] flex-1 space-y-4 overflow-y-auto p-5 sm:p-6">
                  <Bubble mine={false} name={customer(selected)} at={selected.created_at} body={selected.message} />
                  {thread.map((m) =>
                    m.author_role === "system" ? (
                      <p key={m.id} className="flex items-center justify-center gap-1 text-center text-[11px] text-slate-400">{m.internal && <Lock className="h-3 w-3" />}{m.body} · {timeAgo(m.created_at)}</p>
                    ) : (
                      <Bubble
                        key={m.id}
                        mine={m.author_role === "staff" && !m.internal}
                        note={m.internal}
                        name={m.internal ? `Internal note · ${m.author_name ?? "Staff"}` : m.author_role === "staff" ? (m.author_name ?? "CoreDefense team") : customer(selected)}
                        at={m.created_at}
                        body={m.body}
                      />
                    )
                  )}
                  {selected.rating && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3 text-sm">
                      <span className="flex items-center gap-1">{[1, 2, 3, 4, 5].map((n) => <Star key={n} className={cn("h-4 w-4", n <= selected.rating! ? "fill-amber-400 text-amber-400" : "text-slate-300")} />)} <span className="ml-1 font-semibold text-ink-900">Customer rating</span></span>
                      {selected.rating_comment && <p className="mt-1 text-slate-600">“{selected.rating_comment}”</p>}
                    </div>
                  )}
                </div>

                <form onSubmit={(e) => { e.preventDefault(); sendReply(); }} className={cn("border-t p-4 sm:p-5", internal ? "border-amber-200 bg-amber-50/60" : "border-ink-900/[0.06] bg-slate-50/60")}>
                  <div className="mb-2 flex gap-1 rounded-lg bg-white/80 p-1 text-xs font-semibold ring-1 ring-ink-900/[0.06] sm:w-fit">
                    <button type="button" onClick={() => setInternal(false)} className={cn("rounded-md px-3 py-1", !internal ? "bg-primary-500 text-white" : "text-slate-500")}>Reply to customer</button>
                    <button type="button" onClick={() => setInternal(true)} className={cn("inline-flex items-center gap-1 rounded-md px-3 py-1", internal ? "bg-amber-500 text-white" : "text-slate-500")}><Lock className="h-3 w-3" /> Internal note</button>
                  </div>
                  <textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) sendReply(); }}
                    rows={4}
                    maxLength={8000}
                    placeholder={internal ? "Only admins can see this note…" : `Reply to ${customer(selected)}…`}
                    className={cn(field, "resize-y bg-white")}
                  />
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs text-slate-400">{internal ? "Not emailed, never shown to the customer" : "Ctrl + Enter to send · emailed with the ticket reference"}</p>
                    <div className="flex gap-2">
                      {selected.status !== "resolved" && selected.status !== "closed" && (
                        <button type="button" disabled={busy} onClick={() => update({ status: "resolved" }, `Resolved ${ticketRef(selected)}`)} className={cn(btn.secondary, "py-2")}><CheckCircle2 className="h-4 w-4" /> Resolve</button>
                      )}
                      <button type="submit" disabled={busy || !reply.trim()} className={cn(internal ? "inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50" : btn.primary, "py-2")}>
                        {busy ? <Spinner /> : internal ? <Lock className="h-4 w-4" /> : <Send className="h-4 w-4" />} {internal ? "Add note" : "Send reply"}
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* Customer panel */}
              <aside className="hidden border-l border-ink-900/[0.06] p-5 2xl:block">
                <div className="flex items-center gap-3">
                  <Avatar src={selected.profiles?.avatar_url} name={customer(selected)} size={44} />
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-ink-900">{customer(selected)}</p>
                    <p className="font-mono text-xs font-semibold text-primary-700">{customerId(selected.profiles?.customer_no)}</p>
                  </div>
                </div>
                <dl className="mt-4 space-y-2 text-xs">
                  <div><dt className="text-slate-400">Email</dt><dd className="break-all font-medium text-ink-800">{selected.profiles?.email}</dd></div>
                  {selected.profiles?.company && <div><dt className="text-slate-400">Company</dt><dd className="font-medium text-ink-800">{selected.profiles.company}</dd></div>}
                  <div><dt className="text-slate-400">Tickets</dt><dd className="font-medium text-ink-800">{customerTickets.length} total · {customerTickets.filter((t) => t.status !== "resolved" && t.status !== "closed").length} active</dd></div>
                </dl>
                <Link href={`/admin/users/${selected.user_id}`} className={cn(btn.secondary, "mt-4 w-full justify-center py-2 text-xs")}><ExternalLink className="h-3.5 w-3.5" /> Customer profile</Link>
                {customerTickets.length > 1 && (
                  <>
                    <p className="mt-6 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Other requests</p>
                    <ul className="mt-2 space-y-1">
                      {customerTickets.filter((t) => t.id !== selected.id).slice(0, 8).map((t) => (
                        <li key={t.id}>
                          <button onClick={() => { setSelectedId(t.id); setView("all"); }} className="w-full rounded-lg px-2 py-1.5 text-left hover:bg-slate-50">
                            <p className="font-mono text-[10px] font-semibold text-primary-700">{ticketRef(t)}</p>
                            <p className="truncate text-xs text-ink-800">{t.subject}</p>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </aside>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
