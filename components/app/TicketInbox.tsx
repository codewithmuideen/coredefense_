"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Inbox, Search, Send } from "lucide-react";
import { Avatar, Badge, Card, EmptyState, Spinner, btn, field } from "@/components/app/ui";
import { postJson, useToast } from "@/components/app/Toaster";
import { TICKET_STATUS, formatDate, timeAgo } from "@/lib/app/format";
import type { Ticket, TicketStatus } from "@/types/app";
import { cn } from "@/lib/utils";

export type AdminTicket = Ticket & { profiles: { email: string; first_name: string | null; last_name: string | null; company: string | null; avatar_url: string | null } | null };

const PRIORITY_DOT = { low: "#8B95A7", normal: "#1E6AFF", high: "#EC835A", urgent: "#D03B3B" };
const PRIORITY_RANK = { urgent: 0, high: 1, normal: 2, low: 3 };

export default function TicketInbox({ initial }: { initial: AdminTicket[] }) {
  const router = useRouter();
  const toast = useToast();
  const [tickets, setTickets] = useState(initial);
  const [filter, setFilter] = useState<"active" | TicketStatus | "all">("active");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => setTickets(initial), [initial]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tickets
      .filter((t) => (filter === "all" ? true : filter === "active" ? t.status !== "resolved" : t.status === filter))
      .filter((t) => !q || `${t.subject} ${t.message} ${t.profiles?.email ?? ""}`.toLowerCase().includes(q))
      .sort((a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority] || b.created_at.localeCompare(a.created_at));
  }, [tickets, filter, query]);
  const selected = tickets.find((t) => t.id === (selectedId ?? visible[0]?.id)) ?? null;

  useEffect(() => setReply(""), [selected?.id]);

  async function update(body: { status?: TicketStatus; reply?: string }) {
    if (!selected) return;
    setBusy(true);
    try {
      await postJson(`/api/admin/tickets/${selected.id}`, body, "PATCH");
      setTickets((all) => all.map((t) => (t.id === selected.id ? {
        ...t,
        status: body.status ?? (body.reply ? "pending" : t.status),
        ...(body.reply ? { admin_reply: body.reply, replied_at: new Date().toISOString() } : {}),
      } : t)));
      setReply("");
      toast({ tone: "success", title: body.reply ? "Reply sent" : `Marked ${TICKET_STATUS[body.status!].label.toLowerCase()}`, description: body.reply ? "The customer was emailed and notified." : undefined });
      router.refresh();
    } catch (err) {
      toast({ tone: "error", title: "Update failed", description: (err as Error).message });
    } finally {
      setBusy(false);
    }
  }

  const customer = (t: AdminTicket) => [t.profiles?.first_name, t.profiles?.last_name].filter(Boolean).join(" ") || t.profiles?.email || "Unknown";

  return (
    <Card className="overflow-hidden">
      <div className="grid min-h-[620px] lg:grid-cols-[380px_1fr]">
        {/* List */}
        <div className="flex flex-col border-b border-ink-900/[0.06] lg:border-b-0 lg:border-r">
          <div className="space-y-3 border-b border-ink-900/[0.06] p-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tickets…" className={cn(field, "pl-9")} />
            </div>
            <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
              {([["active", "Active"], ["open", "Open"], ["pending", "Pending"], ["resolved", "Resolved"], ["all", "All"]] as const).map(([id, label]) => (
                <button key={id} onClick={() => setFilter(id)} className={cn("flex-1 rounded-md px-2 py-1 text-xs font-semibold transition-colors", filter === id ? "bg-white text-ink-900 shadow-sm" : "text-slate-500 hover:text-ink-800")}>{label}</button>
              ))}
            </div>
          </div>
          <ul className="scroll-slim max-h-[540px] flex-1 divide-y divide-ink-900/[0.05] overflow-y-auto">
            {visible.length === 0 && <li className="px-6 py-14 text-center text-sm text-slate-500">No tickets here.</li>}
            {visible.map((t) => (
              <li key={t.id}>
                <button onClick={() => setSelectedId(t.id)} className={cn("w-full px-4 py-3.5 text-left transition-colors", selected?.id === t.id ? "bg-primary-50/70" : "hover:bg-slate-50")}>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: PRIORITY_DOT[t.priority] }} title={`${t.priority} priority`} />
                    <p className="flex-1 truncate text-sm font-semibold text-ink-900">{t.subject}</p>
                    <span className="shrink-0 text-[11px] text-slate-400">{timeAgo(t.created_at)}</span>
                  </div>
                  <p className="mt-1 truncate pl-4 text-xs text-slate-500">{customer(t)} · {t.category}</p>
                  <div className="mt-2 pl-4"><Badge className={TICKET_STATUS[t.status].badge}>{t.status === "pending" ? "Awaiting customer" : TICKET_STATUS[t.status].label}</Badge></div>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Conversation */}
        {!selected ? (
          <EmptyState icon={Inbox} title="Inbox zero" description="No tickets to show. New requests appear here and in your notifications." />
        ) : (
          <div className="flex flex-col">
            <div className="flex flex-wrap items-start gap-4 border-b border-ink-900/[0.06] p-5 sm:p-6">
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-bold text-ink-900">{selected.subject}</h2>
                <p className="mt-1 text-sm text-slate-500">{selected.category} · <span className="capitalize">{selected.priority}</span> priority · opened {formatDate(selected.created_at, true)}</p>
              </div>
              <select
                value={selected.status}
                disabled={busy}
                onChange={(e) => update({ status: e.target.value as TicketStatus })}
                className={cn(field, "w-auto py-2")}
                aria-label="Ticket status"
              >
                <option value="open">Open</option>
                <option value="pending">Awaiting customer</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            <div className="scroll-slim flex-1 space-y-5 overflow-y-auto p-5 sm:p-6">
              <div className="flex gap-3">
                <Avatar src={selected.profiles?.avatar_url} name={customer(selected)} size={36} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm"><span className="font-semibold text-ink-900">{customer(selected)}</span> <span className="text-slate-400">· {selected.profiles?.email}{selected.profiles?.company ? ` · ${selected.profiles.company}` : ""}</span></p>
                  <div className="mt-2 whitespace-pre-line rounded-2xl rounded-tl-sm bg-slate-100 p-4 text-sm leading-relaxed text-ink-800">{selected.message}</div>
                </div>
              </div>
              {selected.admin_reply && (
                <div className="flex flex-row-reverse gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-500 text-xs font-bold text-white">CD</span>
                  <div className="min-w-0 max-w-[85%]">
                    <p className="text-right text-xs text-slate-400">CoreDefense team · {formatDate(selected.replied_at, true)}</p>
                    <div className="mt-2 whitespace-pre-line rounded-2xl rounded-tr-sm bg-primary-500 p-4 text-sm leading-relaxed text-white">{selected.admin_reply}</div>
                  </div>
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); if (reply.trim().length >= 2) update({ reply: reply.trim() }); }}
              className="border-t border-ink-900/[0.06] bg-slate-50/60 p-4 sm:p-5"
            >
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && reply.trim()) update({ reply: reply.trim() }); }}
                rows={4}
                placeholder={selected.admin_reply ? "Send a follow-up (replaces the previous reply)…" : "Write a reply…"}
                className={cn(field, "resize-y bg-white")}
              />
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs text-slate-400">Ctrl + Enter to send · the customer gets an email and a notification</p>
                <div className="flex gap-2">
                  {selected.status !== "resolved" && (
                    <button type="button" disabled={busy} onClick={() => update({ status: "resolved" })} className={cn(btn.secondary, "py-2")}><CheckCircle2 className="h-4 w-4" /> Resolve</button>
                  )}
                  <button type="submit" disabled={busy || reply.trim().length < 2} className={cn(btn.primary, "py-2")}>{busy ? <Spinner /> : <Send className="h-4 w-4" />} Send reply</button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </Card>
  );
}
