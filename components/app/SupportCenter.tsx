"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Copy, IdCard, LifeBuoy, Plus, RotateCcw, Search, Send, Star, Timer } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { Badge, Card, EmptyState, Spinner, btn, field } from "@/components/app/ui";
import { postJson, useToast } from "@/components/app/Toaster";
import { TICKET_STATUS, formatDate, timeAgo } from "@/lib/app/format";
import { PRIORITIES, PRIORITY, TICKET_CATEGORIES, slaState, ticketRef } from "@/lib/app/support";
import type { Ticket, TicketMessage, TicketPriority } from "@/types/app";
import { cn } from "@/lib/utils";

const EMPTY_FORM = { subject: "", category: "Advice" as string, priority: "not_urgent" as TicketPriority, message: "" };

export default function SupportCenter({
  initial,
  messages: initialMessages,
  customerId,
  startOpen,
  selectedId: initialSelected,
}: {
  initial: Ticket[];
  messages: TicketMessage[];
  customerId: string;
  startOpen?: boolean;
  selectedId?: string;
}) {
  const router = useRouter();
  const toast = useToast();
  const [tickets, setTickets] = useState(initial);
  const [messages, setMessages] = useState(initialMessages);
  const [composeOpen, setComposeOpen] = useState(!!startOpen);
  const [selectedId, setSelectedId] = useState<string | null>(initialSelected ?? initial[0]?.id ?? null);
  const [filter, setFilter] = useState<"active" | "done" | "all">("all");
  const [query, setQuery] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [reply, setReply] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [ratingComment, setRatingComment] = useState("");
  useEffect(() => setTickets(initial), [initial]);
  useEffect(() => setMessages(initialMessages), [initialMessages]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tickets
      .filter((t) => (filter === "all" ? true : filter === "done" ? t.status === "resolved" || t.status === "closed" : t.status !== "resolved" && t.status !== "closed"))
      .filter((t) => !q || `${t.ref ?? ""} ${t.subject} ${t.message} ${t.category}`.toLowerCase().includes(q));
  }, [tickets, filter, query]);
  const selected = tickets.find((t) => t.id === selectedId) ?? visible[0] ?? null;
  const thread = useMemo(() => messages.filter((m) => m.ticket_id === selected?.id), [messages, selected?.id]);
  useEffect(() => { setReply(""); setRating(0); setRatingComment(""); }, [selected?.id]);

  const counts = {
    open: tickets.filter((t) => t.status === "open" || t.status === "in_progress").length,
    awaiting: tickets.filter((t) => t.status === "awaiting_customer").length,
    resolved: tickets.filter((t) => t.status === "resolved" || t.status === "closed").length,
  };

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setBusy("create");
    try {
      const { ticket } = await postJson<{ ticket: Ticket }>("/api/account/tickets", form);
      setTickets((all) => [ticket, ...all]);
      setSelectedId(ticket.id);
      setComposeOpen(false);
      setForm(EMPTY_FORM);
      toast({ tone: "success", title: `Request ${ticket.ref} received`, description: `We aim to respond ${PRIORITY[ticket.priority].target}. A confirmation is on its way to your inbox.` });
      router.refresh();
    } catch (err) {
      toast({ tone: "error", title: "Couldn't send your request", description: (err as Error).message });
    } finally {
      setBusy(null);
    }
  }

  async function act(body: Record<string, unknown>, success: string) {
    if (!selected) return;
    setBusy(String(body.action));
    try {
      await postJson(`/api/account/tickets/${selected.id}`, body);
      toast({ tone: "success", title: success });
      setReply("");
      router.refresh();
    } catch (err) {
      toast({ tone: "error", title: "That didn't work", description: (err as Error).message });
    } finally {
      setBusy(null);
    }
  }

  function copyId(text: string) {
    navigator.clipboard?.writeText(text).then(() => toast({ tone: "success", title: `Copied ${text}` }), () => undefined);
  }

  const done = selected && (selected.status === "resolved" || selected.status === "closed");
  const label = "mb-1.5 block text-xs font-semibold text-ink-700";

  return (
    <div className="space-y-6">
      {/* Summary strip */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="flex items-center gap-3 p-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600"><IdCard className="h-5 w-5" /></span>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Your customer ID</p>
            <p className="font-mono text-lg font-bold text-ink-900">{customerId}</p>
          </div>
          <button onClick={() => copyId(customerId)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-ink-900" aria-label="Copy customer ID"><Copy className="h-4 w-4" /></button>
        </Card>
        {[["Open with our team", counts.open], ["Awaiting your reply", counts.awaiting], ["Resolved", counts.resolved]].map(([l, v]) => (
          <Card key={l} className="p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{l}</p>
            <p className="mt-1 text-2xl font-bold text-ink-900">{v}</p>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden">
        <div className="grid min-h-[600px] lg:grid-cols-[360px_1fr]">
          {/* Ticket list */}
          <div className="flex flex-col border-b border-ink-900/[0.06] lg:border-b-0 lg:border-r">
            <div className="space-y-3 border-b border-ink-900/[0.06] p-3">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by reference or subject…" className={cn(field, "pl-9")} />
                </div>
                <button onClick={() => setComposeOpen(true)} className={cn(btn.primary, "px-3 py-2")} aria-label="New request"><Plus className="h-4 w-4" /></button>
              </div>
              <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
                {([["all", "All"], ["active", "Active"], ["done", "Resolved"]] as const).map(([id, l]) => (
                  <button key={id} onClick={() => setFilter(id)} className={cn("flex-1 rounded-md px-2 py-1 text-xs font-semibold transition-colors", filter === id ? "bg-white text-ink-900 shadow-sm" : "text-slate-500 hover:text-ink-800")}>{l}</button>
                ))}
              </div>
            </div>
            <ul className="scroll-slim max-h-[560px] flex-1 divide-y divide-ink-900/[0.05] overflow-y-auto">
              {visible.length === 0 && <li className="px-6 py-14 text-center text-sm text-slate-500">{tickets.length ? "No requests match." : "No requests yet."}</li>}
              {visible.map((t) => (
                <li key={t.id}>
                  <button onClick={() => setSelectedId(t.id)} className={cn("w-full px-4 py-3.5 text-left transition-colors", selected?.id === t.id ? "bg-primary-50/70" : "hover:bg-slate-50")}>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-semibold text-primary-700">{ticketRef(t)}</span>
                      <span className="ml-auto shrink-0 text-[11px] text-slate-400">{timeAgo(t.last_activity_at ?? t.created_at)}</span>
                    </div>
                    <p className="mt-1 truncate text-sm font-semibold text-ink-900">{t.subject}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <Badge className={PRIORITY[t.priority].badge}>{PRIORITY[t.priority].label}</Badge>
                      <Badge className={TICKET_STATUS[t.status].badge}>{TICKET_STATUS[t.status].label}</Badge>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Conversation */}
          {!selected ? (
            <EmptyState
              icon={LifeBuoy}
              title="How can we help?"
              description="Raise a complaint, ask for advice, get help with a course or report a security problem. Every request gets a reference number and a response target."
              action={<button onClick={() => setComposeOpen(true)} className={btn.primary}><Plus className="h-4 w-4" /> Open a request</button>}
            />
          ) : (
            <div className="flex min-w-0 flex-col">
              <div className="border-b border-ink-900/[0.06] p-5 sm:p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <button onClick={() => copyId(ticketRef(selected))} className="inline-flex items-center gap-1 rounded-md bg-primary-50 px-2 py-0.5 font-mono text-xs font-bold text-primary-700 hover:bg-primary-100" title="Copy reference">
                    {ticketRef(selected)} <Copy className="h-3 w-3" />
                  </button>
                  <Badge className={PRIORITY[selected.priority].badge}>{PRIORITY[selected.priority].label}</Badge>
                  <Badge className={TICKET_STATUS[selected.status].badge}>{TICKET_STATUS[selected.status].label}</Badge>
                </div>
                <h2 className="mt-2 text-lg font-bold text-ink-900">{selected.subject}</h2>
                <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                  <span>{selected.category}</span>
                  <span>Opened {formatDate(selected.created_at, true)}</span>
                  <SlaLine ticket={selected} customer />
                </p>
              </div>

              <div className="scroll-slim max-h-[520px] flex-1 space-y-4 overflow-y-auto p-5 sm:p-6">
                <Bubble mine name="You" at={selected.created_at} body={selected.message} />
                {thread.map((m) =>
                  m.author_role === "system" ? (
                    <p key={m.id} className="text-center text-[11px] text-slate-400">{m.body} · {timeAgo(m.created_at)}</p>
                  ) : (
                    <Bubble key={m.id} mine={m.author_role === "customer"} name={m.author_role === "customer" ? "You" : `${m.author_name ?? "CoreDefense team"} · CoreDefense`} at={m.created_at} body={m.body} />
                  )
                )}
                {!thread.some((m) => m.author_role === "staff") && !done && (
                  <p className="flex items-center gap-2 text-xs text-slate-500"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary-500" /> Our team aims to respond {PRIORITY[selected.priority].target}. You&apos;ll get an email and a notification.</p>
                )}
              </div>

              {done ? (
                <div className="space-y-4 border-t border-ink-900/[0.06] bg-slate-50/60 p-4 sm:p-5">
                  {selected.rating ? (
                    <p className="flex items-center gap-2 text-sm text-slate-600">
                      <span className="flex">{[1, 2, 3, 4, 5].map((n) => <Star key={n} className={cn("h-4 w-4", n <= selected.rating! ? "fill-amber-400 text-amber-400" : "text-slate-300")} />)}</span>
                      Thanks for rating this request.
                    </p>
                  ) : (
                    <div>
                      <p className="text-sm font-semibold text-ink-900">How did we do?</p>
                      <div className="mt-2 flex gap-1">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <button key={n} onClick={() => setRating(n)} aria-label={`${n} star${n > 1 ? "s" : ""}`} className="rounded p-0.5">
                            <Star className={cn("h-6 w-6 transition-colors", n <= rating ? "fill-amber-400 text-amber-400" : "text-slate-300 hover:text-amber-300")} />
                          </button>
                        ))}
                      </div>
                      {rating > 0 && (
                        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                          <input value={ratingComment} onChange={(e) => setRatingComment(e.target.value)} maxLength={1000} placeholder="Anything we could do better? (optional)" className={cn(field, "bg-white")} />
                          <button disabled={!!busy} onClick={() => act({ action: "rate", rating, comment: ratingComment }, "Thanks for your feedback")} className={cn(btn.primary, "py-2")}>{busy === "rate" ? <Spinner /> : "Submit"}</button>
                        </div>
                      )}
                    </div>
                  )}
                  <button disabled={!!busy} onClick={() => act({ action: "reopen" }, `Reopened ${ticketRef(selected)}`)} className={cn(btn.secondary, "py-2")}>
                    {busy === "reopen" ? <Spinner /> : <RotateCcw className="h-4 w-4" />} Not fixed? Reopen this request
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => { e.preventDefault(); if (reply.trim()) act({ action: "reply", body: reply.trim() }, "Message sent"); }}
                  className="border-t border-ink-900/[0.06] bg-slate-50/60 p-4 sm:p-5"
                >
                  <textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && reply.trim()) act({ action: "reply", body: reply.trim() }, "Message sent"); }}
                    rows={3}
                    maxLength={8000}
                    placeholder="Add more detail or reply to our team…"
                    className={cn(field, "resize-y bg-white")}
                  />
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                    <button type="button" disabled={!!busy} onClick={() => act({ action: "resolve" }, "Marked as resolved")} className={cn(btn.secondary, "py-2")}>
                      {busy === "resolve" ? <Spinner /> : <CheckCircle2 className="h-4 w-4" />} Mark as resolved
                    </button>
                    <button type="submit" disabled={!!busy || !reply.trim()} className={cn(btn.primary, "py-2")}>{busy === "reply" ? <Spinner /> : <Send className="h-4 w-4" />} Send</button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </Card>

      <Modal open={composeOpen} onClose={() => setComposeOpen(false)} title="New support request" size="md">
        <form onSubmit={create} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-[1fr_200px]">
            <label className="block">
              <span className={label}>Subject</span>
              <input required minLength={3} maxLength={140} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className={field} placeholder="e.g. Can't access my course materials" />
            </label>
            <label className="block">
              <span className={label}>Type of request</span>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={field}>
                {TICKET_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
          </div>
          <fieldset>
            <legend className={label}>How urgent is it?</legend>
            <div className="grid gap-2 sm:grid-cols-3">
              {PRIORITIES.map((p) => {
                const meta = PRIORITY[p];
                const on = form.priority === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setForm({ ...form, priority: p })}
                    aria-pressed={on}
                    className={cn("rounded-xl border p-3 text-left transition-colors", on ? "border-primary-500 bg-primary-50/60 ring-1 ring-primary-500" : "border-ink-900/10 hover:border-primary-300")}
                  >
                    <span className="flex items-center gap-2 text-sm font-semibold text-ink-900"><span className="h-2 w-2 rounded-full" style={{ background: meta.dot }} />{meta.label}</span>
                    <span className="mt-1 block text-[11px] font-semibold text-primary-700">Reply {meta.target}</span>
                    <span className="mt-1 block text-[11px] leading-snug text-slate-500">{meta.hint}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>
          <label className="block">
            <span className={label}>Details</span>
            <textarea required minLength={10} maxLength={4000} rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={cn(field, "resize-y")} placeholder="What happened, when it started, who is affected and what you've tried so far." />
            <span className="mt-1 block text-right text-[11px] text-slate-400">{form.message.length} / 4000</span>
          </label>
          <div className="flex items-center justify-between gap-2 pt-2">
            <p className="text-[11px] text-slate-400">You&apos;ll get a reference number by email.</p>
            <div className="flex gap-2">
              <button type="button" onClick={() => setComposeOpen(false)} className={btn.secondary}>Cancel</button>
              <button type="submit" disabled={busy === "create"} className={btn.primary}>{busy === "create" ? <Spinner /> : <Send className="h-4 w-4" />} Send request</button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function Bubble({ mine, name, at, body, note }: { mine: boolean; name: string; at: string; body: string; note?: boolean }) {
  return (
    <div className={cn("flex", mine ? "justify-end" : "justify-start")}>
      <div className="min-w-0 max-w-[85%]">
        <p className={cn("text-[11px] text-slate-400", mine && "text-right")}>{name} · {formatDate(at, true)}</p>
        <div
          className={cn(
            "mt-1 whitespace-pre-line break-words rounded-2xl p-3.5 text-sm leading-relaxed",
            note ? "rounded-tl-sm border border-amber-200 bg-amber-50 text-amber-900" : mine ? "rounded-tr-sm bg-primary-500 text-white" : "rounded-tl-sm bg-slate-100 text-ink-800"
          )}
        >
          {body}
        </div>
      </div>
    </div>
  );
}

export function SlaLine({ ticket, customer }: { ticket: Ticket; customer?: boolean }) {
  const s = slaState(ticket);
  if (s.kind === "none") return null;
  if (customer && (s.kind === "met" || s.kind === "late")) return <span>First reply {timeAgo(ticket.first_response_at)}</span>;
  if (customer && s.kind === "breached") return <span className="inline-flex items-center gap-1"><Timer className="h-3 w-3" /> Taking longer than usual; we&apos;re on it</span>;
  return (
    <span className={cn("inline-flex items-center gap-1 font-semibold", s.kind === "breached" || s.kind === "late" ? "text-red-600" : s.kind === "soon" ? "text-orange-600" : s.kind === "met" ? "text-emerald-600" : "text-slate-500")} suppressHydrationWarning>
      <Timer className="h-3 w-3" /> {s.label}
    </span>
  );
}

export { Bubble };
