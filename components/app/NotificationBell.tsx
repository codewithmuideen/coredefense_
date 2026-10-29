"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Bell, CheckCheck, LifeBuoy, ShieldAlert, ShieldCheck, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { timeAgo } from "@/lib/app/format";
import type { AppNotification } from "@/types/app";
import { cn } from "@/lib/utils";

export const KIND_ICON = { security: ShieldCheck, finding: ShieldAlert, support: LifeBuoy, system: Sparkles };
export const KIND_TONE = {
  security: "bg-emerald-50 text-emerald-600",
  finding: "bg-red-50 text-red-600",
  support: "bg-violet-50 text-violet-600",
  system: "bg-primary-50 text-primary-600",
};

/** Bell with a live unread count: new rows arrive over Supabase Realtime without a refresh. */
export default function NotificationBell({ userId, initialUnread }: { userId: string; initialUnread: number }) {
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(initialUnread);
  const [items, setItems] = useState<AppNotification[] | null>(null);
  const [pulse, setPulse] = useState(false);

  const load = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase.from("notifications").select("*").order("created_at", { ascending: false }).limit(8);
    setItems((data as AppNotification[]) ?? []);
  }, []);

  useEffect(() => setUnread(initialUnread), [initialUnread]);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`notifications:${userId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${userId}` }, (payload) => {
        setUnread((n) => n + 1);
        setItems((list) => (list ? [payload.new as AppNotification, ...list].slice(0, 8) : list));
        setPulse(true);
        setTimeout(() => setPulse(false), 1600);
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  async function markAllRead() {
    const supabase = createClient();
    const now = new Date().toISOString();
    setItems((list) => list?.map((n) => ({ ...n, read_at: n.read_at ?? now })) ?? null);
    setUnread(0);
    await supabase.from("notifications").update({ read_at: now }).is("read_at", null);
  }

  async function markRead(n: AppNotification) {
    if (n.read_at) return;
    setUnread((c) => Math.max(0, c - 1));
    setItems((list) => list?.map((x) => (x.id === n.id ? { ...x, read_at: new Date().toISOString() } : x)) ?? null);
    await createClient().from("notifications").update({ read_at: new Date().toISOString() }).eq("id", n.id);
  }

  return (
    <div className="relative">
      <button
        onClick={() => {
          setOpen((o) => !o);
          if (!items) load();
        }}
        className="focus-ring-light relative rounded-full p-2.5 text-ink-600 transition-colors hover:bg-ink-900/5 hover:text-ink-900"
        aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
        aria-expanded={open}
      >
        <Bell className={cn("h-5 w-5", pulse && "animate-[wiggle_0.6s_ease-in-out_2]")} />
        {unread > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden />
          <div className="animate-toast-in fixed inset-x-3 top-[68px] z-50 overflow-hidden rounded-xl border border-ink-900/10 bg-white shadow-2xl shadow-ink-900/15 sm:absolute sm:inset-x-auto sm:right-0 sm:top-auto sm:mt-2 sm:w-[380px]">
            <div className="flex items-center justify-between border-b border-ink-900/[0.06] px-4 py-3">
              <p className="text-sm font-bold text-ink-900">Notifications</p>
              <button onClick={markAllRead} disabled={!unread} className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700 disabled:text-slate-300">
                <CheckCheck className="h-3.5 w-3.5" /> Mark all read
              </button>
            </div>
            <ul className="scroll-slim max-h-[60vh] overflow-y-auto">
              {items === null && [0, 1, 2].map((i) => (
                <li key={i} className="flex gap-3 px-4 py-3">
                  <span className="h-9 w-9 animate-pulse rounded-lg bg-slate-100" />
                  <span className="flex-1 space-y-2"><span className="block h-3 w-2/3 animate-pulse rounded bg-slate-100" /><span className="block h-3 w-1/2 animate-pulse rounded bg-slate-100" /></span>
                </li>
              ))}
              {items?.length === 0 && <li className="px-4 py-10 text-center text-sm text-slate-500">You&apos;re all caught up.</li>}
              {items?.map((n) => {
                const Icon = KIND_ICON[n.kind] ?? Sparkles;
                const body = (
                  <div className={cn("flex gap-3 px-4 py-3 transition-colors hover:bg-slate-50", !n.read_at && "bg-primary-50/40")}>
                    <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", KIND_TONE[n.kind])}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-2 text-sm font-semibold text-ink-900">
                        <span className="truncate">{n.title}</span>
                        {!n.read_at && <span className="h-2 w-2 shrink-0 rounded-full bg-primary-500" aria-label="Unread" />}
                      </p>
                      {n.body && <p className="mt-0.5 line-clamp-2 text-[13px] text-slate-500">{n.body}</p>}
                      <p className="mt-1 text-[11px] font-medium text-slate-400">{timeAgo(n.created_at)}</p>
                    </div>
                  </div>
                );
                return (
                  <li key={n.id} className="border-b border-ink-900/[0.04] last:border-0">
                    {n.link ? (
                      <Link href={n.link} onClick={() => { markRead(n); setOpen(false); }}>{body}</Link>
                    ) : (
                      <button className="w-full text-left" onClick={() => markRead(n)}>{body}</button>
                    )}
                  </li>
                );
              })}
            </ul>
            <Link href="/dashboard/notifications" onClick={() => setOpen(false)} className="block border-t border-ink-900/[0.06] px-4 py-3 text-center text-sm font-semibold text-primary-600 hover:bg-slate-50">
              View all notifications
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
