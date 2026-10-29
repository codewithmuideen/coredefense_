"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Megaphone, Send } from "lucide-react";
import { Card, CardHeader, Spinner, Switch, btn, field } from "@/components/app/ui";
import { postJson, useToast } from "@/components/app/Toaster";
import { cn } from "@/lib/utils";

export default function BroadcastForm() {
  const router = useRouter();
  const toast = useToast();
  const [form, setForm] = useState({ title: "", message: "", audience: "all", kind: "system", email: false });
  const [sending, setSending] = useState(false);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const who = form.audience === "all" ? "every active user" : form.audience === "admins" ? "all admins" : "all non-admin users";
    if (!confirm(`Send "${form.title}" to ${who}${form.email ? " by notification and email" : ""}?`)) return;
    setSending(true);
    try {
      const res = await postJson<{ recipients: number; emailed: number; emailError?: string }>("/api/admin/broadcast", form);
      toast({
        tone: res.emailError ? "info" : "success",
        title: `Sent to ${res.recipients} ${res.recipients === 1 ? "user" : "users"}`,
        description: form.email ? (res.emailError ? `${res.emailed} emailed. Some emails failed: ${res.emailError}` : `${res.emailed} emails delivered.`) : "Delivered to notification bells.",
      });
      setForm({ title: "", message: "", audience: "all", kind: "system", email: false });
      router.refresh();
    } catch (err) {
      toast({ tone: "error", title: "Broadcast failed", description: (err as Error).message });
    } finally {
      setSending(false);
    }
  }

  return (
    <Card>
      <CardHeader title="Compose" description="Keep it short. The title is the notification headline and the email subject." />
      <form onSubmit={send} className="space-y-5 p-5 sm:p-6">
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-ink-700">Title</span>
          <input required minLength={3} maxLength={120} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={field} placeholder="Scheduled maintenance this Saturday" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-ink-700">Message</span>
          <textarea required minLength={10} maxLength={2000} rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={cn(field, "resize-y")} placeholder="What's happening, when, and whether anyone needs to do anything." />
          <span className="mt-1 block text-right text-[11px] text-slate-400">{form.message.length} / 2000</span>
        </label>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-ink-700">Audience</span>
            <select value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })} className={field}>
              <option value="all">Everyone</option>
              <option value="users">Customers only</option>
              <option value="admins">Admins only</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-ink-700">Type</span>
            <select value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value })} className={field}>
              <option value="system">Announcement</option>
              <option value="security">Security notice (ignores email opt-outs)</option>
            </select>
          </label>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-ink-900/[0.07] bg-slate-50/60 p-4">
          <div className="flex-1">
            <p className="text-sm font-semibold text-ink-900">Also send by email</p>
            <p className="text-[13px] text-slate-500">Announcements respect each user&apos;s email preferences.</p>
          </div>
          <Switch checked={form.email} onChange={(v) => setForm({ ...form, email: v })} label="Also send by email" />
        </div>

        {/* Preview */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Preview</p>
          <div className="flex gap-3 rounded-xl border border-ink-900/[0.07] p-4">
            <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", form.kind === "security" ? "bg-emerald-50 text-emerald-600" : "bg-primary-50 text-primary-600")}>
              {form.kind === "security" ? <Bell className="h-4 w-4" /> : <Megaphone className="h-4 w-4" />}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-ink-900">{form.title || "Your title"}</p>
              <p className="mt-0.5 whitespace-pre-line text-[13px] text-slate-500">{form.message || "Your message appears here."}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={sending || form.title.length < 3 || form.message.length < 10} className={btn.primary}>
            {sending ? <Spinner /> : <Send className="h-4 w-4" />} Send broadcast
          </button>
        </div>
      </form>
    </Card>
  );
}
