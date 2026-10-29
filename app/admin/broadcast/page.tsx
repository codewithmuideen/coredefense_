import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { Card, CardHeader, PageHeader } from "@/components/app/ui";
import BroadcastForm from "@/components/app/BroadcastForm";
import { formatDate } from "@/lib/app/format";
import type { AuditEntry } from "@/types/app";

export const metadata: Metadata = { title: "Broadcast" };
export const dynamic = "force-dynamic";

export default async function BroadcastPage() {
  const { data } = await createAdminClient().from("audit_log").select("*").eq("action", "broadcast.send").order("created_at", { ascending: false }).limit(10);
  const history = (data ?? []) as AuditEntry[];
  return (
    <>
      <PageHeader eyebrow="Admin console" title="Broadcast" description="Send an announcement to every user's notification bell, and optionally by email." />
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <BroadcastForm />
        <Card>
          <CardHeader title="Recent broadcasts" />
          <ul className="divide-y divide-ink-900/[0.05]">
            {history.length === 0 && <li className="px-6 py-10 text-center text-sm text-slate-500">Nothing sent yet.</li>}
            {history.map((h) => (
              <li key={h.id} className="px-5 py-4 sm:px-6">
                <p className="text-sm font-semibold text-ink-900">{String(h.detail.title ?? "Untitled")}</p>
                <p className="mt-0.5 text-xs text-slate-500">
                  To {h.target} · {String(h.detail.recipients ?? 0)} in-app · {String(h.detail.emailed ?? 0)} emailed
                </p>
                <p className="mt-1 text-[11px] text-slate-400">{h.actor_email} · {formatDate(h.created_at, true)}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
