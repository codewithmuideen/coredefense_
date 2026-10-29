"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BellOff, CheckCheck, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Card, EmptyState, btn } from "@/components/app/ui";
import { KIND_ICON, KIND_TONE } from "@/components/app/NotificationBell";
import { useToast } from "@/components/app/Toaster";
import { formatDate, timeAgo } from "@/lib/app/format";
import type { AppNotification, NotificationKind } from "@/types/app";
import { cn } from "@/lib/utils";

const FILTERS: { id: "all" | "unread" | NotificationKind; label: string }[] = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "security", label: "Security" },
  { id: "finding", label: "Findings" },
  { id: "support", label: "Support" },
  { id: "system", label: "Announcements" },
];

function dayGroup(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const diff = Math.floor((new Date(today.toDateString()).getTime() - new Date(d.toDateString()).getTime()) / 86_400_000);
  return diff === 0 ? "Today" : diff === 1 ? "Yesterday" : diff < 7 ? "This week" : "Earlier";
}

export default function NotificationsList({ initial }: { initial: AppNotification[] }) {
  const router = useRouter();
  const toast = useToast();
  const [items, setItems] = useState(initial);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  useEffect(() => setItems(initial), [initial]);

  const visible = useMemo(
    () => items.filter((n) => (filter === "all" ? true : filter === "unread" ? !n.read_at : n.kind === filter)),
    [items, filter]
  );
  const groups = useMemo(() => {
    const map = new Map<string, AppNotification[]>();
    visible.forEach((n) => map.set(dayGroup(n.created_at), [...(map.get(dayGroup(n.created_at)) ?? []), n]));
    return [...map.entries()];
  }, [visible]);
  const unread = items.filter((n) => !n.read_at).length;

  async function markAll() {
    const now = new Date().toISOString();
    setItems((all) => all.map((n) => ({ ...n, read_at: n.read_at ?? now })));
    await createClient().from("notifications").update({ read_at: now }).is("read_at", null);
    toast({ tone: "success", title: "All caught up", description: "Every notification is marked as read." });
    router.refresh();
  }

  async function toggleRead(n: AppNotification) {
    const read_at = n.read_at ? null : new Date().toISOString();
    setItems((all) => all.map((x) => (x.id === n.id ? { ...x, read_at } : x)));
    await createClient().from("notifications").update({ read_at }).eq("id", n.id);
    router.refresh();
  }

  async function remove(n: AppNotification) {
    setItems((all) => all.filter((x) => x.id !== n.id));
    const { error } = await createClient().from("notifications").delete().eq("id", n.id);
    if (error) toast({ tone: "error", title: "Couldn't delete", description: error.message });
    router.refresh();
  }

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-900/[0.06] p-3 sm:px-5">
        <div className="scroll-slim flex gap-1.5 overflow-x-auto">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                filter === f.id ? "bg-ink-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              {f.label}
              {f.id === "unread" && unread > 0 && <span className="ml-1.5 rounded-full bg-red-500 px-1.5 text-[10px] text-white">{unread}</span>}
            </button>
          ))}
        </div>
        <button onClick={markAll} disabled={!unread} className={cn(btn.secondary, "py-2")}>
          <CheckCheck className="h-4 w-4" /> Mark all read
        </button>
      </div>

      {visible.length === 0 ? (
        <EmptyState icon={BellOff} title="Nothing here" description={filter === "unread" ? "You've read everything. New alerts will appear here instantly." : "No notifications in this category yet."} />
      ) : (
        groups.map(([label, list]) => (
          <section key={label}>
            <h2 className="bg-slate-50/70 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</h2>
            <ul className="divide-y divide-ink-900/[0.05]">
              {list.map((n) => {
                const Icon = KIND_ICON[n.kind];
                return (
                  <li key={n.id} className={cn("group flex gap-4 px-5 py-4 transition-colors hover:bg-slate-50/70", !n.read_at && "bg-primary-50/30")}>
                    <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", KIND_TONE[n.kind])}>
                      <Icon className="h-[18px] w-[18px]" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start gap-2">
                        <p className="flex-1 text-sm font-semibold text-ink-900">
                          {n.title}
                          {!n.read_at && <span className="ml-2 inline-block h-2 w-2 rounded-full bg-primary-500 align-middle" aria-label="Unread" />}
                        </p>
                        <time className="shrink-0 text-xs text-slate-400" title={formatDate(n.created_at, true)}>{timeAgo(n.created_at)}</time>
                      </div>
                      {n.body && <p className="mt-1 text-sm leading-relaxed text-slate-600">{n.body}</p>}
                      <div className="mt-2 flex items-center gap-4 text-xs font-semibold">
                        {n.link && <Link href={n.link} onClick={() => !n.read_at && toggleRead(n)} className="text-primary-600 hover:text-primary-700">Open</Link>}
                        <button onClick={() => toggleRead(n)} className="text-slate-500 hover:text-ink-800">{n.read_at ? "Mark unread" : "Mark read"}</button>
                        <button onClick={() => remove(n)} className="inline-flex items-center gap-1 text-slate-400 opacity-100 hover:text-red-600 sm:opacity-0 sm:group-hover:opacity-100">
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ))
      )}
    </Card>
  );
}
