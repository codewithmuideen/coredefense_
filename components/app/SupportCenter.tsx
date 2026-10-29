"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, LifeBuoy, MessageSquareReply, Plus, Send } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { Badge, Card, EmptyState, Spinner, btn, field } from "@/components/app/ui";
import { postJson, useToast } from "@/components/app/Toaster";
import { TICKET_STATUS, formatDate, timeAgo } from "@/lib/app/format";
import type { Ticket } from "@/types/app";
import { cn } from "@/lib/utils";

const PRIORITY_TONE = {
  low: "bg-slate-100 text-slate-600 ring-slate-500/15",
  normal: "bg-white text-ink-700 ring-ink-900/15",
  high: "bg-orange-50 text-orange-700 ring-orange-600/15",
  urgent: "bg-red-50 text-red-700 ring-red-600/15",
};

export default function SupportCenter({ initial, startOpen }: { initial: Ticket[]; startOpen?: boolean }) {
  const router = useRouter();
  const toast = useToast();
  const [tickets, setTickets] = useState(initial);
  const [open, setOpen] = useState(!!startOpen);
  const [expanded, setExpanded] = useState<string | null>(initial[0]?.id ?? null);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ subject: "", category: "General", priority: "normal", message: "" });
  useEffect(() => setTickets(initial), [initial]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    try {
      const { ticket } = await postJson<{ ticket: Ticket }>("/api/account/tickets", form);
      setTickets((all) => [ticket, ...all]);
      setExpanded(ticket.id);
      setOpen(false);
      setForm({ subject: "", category: "General", priority: "normal", message: "" });
      toast({ tone: "success", title: "Request sent", description: "Our team has been notified. You'll get an email and a notification when we reply." });
      router.refresh();
    } catch (err) {
      toast({ tone: "error", title: "Couldn't send your request", description: (err as Error).message });
    } finally {
      setSending(false);
    }
  }

  const counts = { open: tickets.filter((t) => t.status === "open").length, pending: tickets.filter((t) => t.status === "pending").length, resolved: tickets.filter((t) => t.status === "resolved").length };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <Card>
        <div className="flex items-center justify-between border-b border-ink-900/[0.06] px-5 py-4">
          <h2 className="text-[15px] font-bold text-ink-900">Your requests</h2>
          <button onClick={() => setOpen(true)} className={cn(btn.primary, "py-2")}>
            <Plus className="h-4 w-4" /> New request
          </button>
        </div>
        {tickets.length === 0 ? (
          <EmptyState icon={LifeBuoy} title="No requests yet" description="When you open a request it appears here, along with our team's replies." action={<button onClick={() => setOpen(true)} className={btn.primary}><Plus className="h-4 w-4" /> Open your first request</button>} />
        ) : (
          <ul className="divide-y divide-ink-900/[0.05]">
            {tickets.map((t) => {
              const isOpen = expanded === t.id;
              return (
                <li key={t.id}>
                  <button onClick={() => setExpanded(isOpen ? null : t.id)} className="flex w-full items-center gap-4 px-5 py-4 text-left hover:bg-slate-50/70" aria-expanded={isOpen}>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink-900">{t.subject}</p>
                      <p className="mt-0.5 text-xs text-slate-500">{t.category} · opened {timeAgo(t.created_at)}</p>
                    </div>
                    <Badge className={PRIORITY_TONE[t.priority]}>{t.priority[0].toUpperCase() + t.priority.slice(1)}</Badge>
                    <Badge className={TICKET_STATUS[t.status].badge}>{TICKET_STATUS[t.status].label}</Badge>
                    <ChevronDown className={cn("h-4 w-4 shrink-0 text-slate-400 transition-transform", isOpen && "rotate-180")} />
                  </button>
                  {isOpen && (
                    <div className="space-y-4 px-5 pb-5">
                      <div className="rounded-xl bg-slate-50 p-4">
                        <p className="text-xs font-semibold text-slate-500">You wrote · {formatDate(t.created_at, true)}</p>
                        <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink-800">{t.message}</p>
                      </div>
                      {t.admin_reply ? (
                        <div className="rounded-xl border border-primary-200 bg-primary-50/60 p-4">
                          <p className="flex items-center gap-1.5 text-xs font-semibold text-primary-700"><MessageSquareReply className="h-3.5 w-3.5" /> CoreDefense team · {formatDate(t.replied_at, true)}</p>
                          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink-800">{t.admin_reply}</p>
                        </div>
                      ) : (
                        <p className="flex items-center gap-2 text-xs text-slate-500"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary-500" /> Waiting for our team to reply. Most requests are answered within one working day.</p>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      <div className="space-y-4">
        <Card className="p-5">
          <h3 className="text-sm font-bold text-ink-900">At a glance</h3>
          <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
            {[["Open", counts.open], ["Awaiting you", counts.pending], ["Resolved", counts.resolved]].map(([l, v]) => (
              <div key={l} className="rounded-xl bg-slate-50 px-2 py-3">
                <dd className="text-xl font-bold text-ink-900">{v}</dd>
                <dt className="mt-0.5 text-[11px] font-medium text-slate-500">{l}</dt>
              </div>
            ))}
          </dl>
        </Card>
        <Card className="overflow-hidden">
          <div className="bg-ink-900 p-5 text-white">
            <p className="text-sm font-bold">Under attack right now?</p>
            <p className="mt-1 text-[13px] leading-relaxed text-white/65">Open an <strong className="text-white">urgent</strong> request with category <strong className="text-white">Incident</strong>. It emails our on-call team immediately.</p>
          </div>
        </Card>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="New support request" size="md">
        <form onSubmit={submit} className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-ink-700">Subject</span>
            <input required minLength={3} maxLength={140} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className={field} placeholder="e.g. Help prioritising the VPN finding" />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-ink-700">Category</span>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={field}>
                {["General", "Finding", "Account", "Billing", "Incident"].map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-ink-700">Priority</span>
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className={field}>
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </label>
          </div>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-ink-700">Message</span>
            <textarea required minLength={10} maxLength={4000} rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={cn(field, "resize-y")} placeholder="What's happening, which assets are involved and what you've tried so far." />
            <span className="mt-1 block text-right text-[11px] text-slate-400">{form.message.length} / 4000</span>
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setOpen(false)} className={btn.secondary}>Cancel</button>
            <button type="submit" disabled={sending} className={btn.primary}>{sending ? <Spinner /> : <Send className="h-4 w-4" />} Send request</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
