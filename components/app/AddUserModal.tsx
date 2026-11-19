"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, MailPlus, UserPlus } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { Spinner, btn, field } from "@/components/app/ui";
import { postJson, useToast } from "@/components/app/Toaster";
import { PASSWORD_RULES } from "@/lib/validations";
import { cn } from "@/lib/utils";

const EMPTY = { firstName: "", lastName: "", email: "", company: "", jobTitle: "", phone: "", role: "user" as "user" | "admin", mode: "invite" as "invite" | "password", password: "" };

export default function AddUserModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const toast = useToast();
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const set = <K extends keyof typeof EMPTY>(k: K, v: (typeof EMPTY)[K]) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await postJson<{ customerId: string; emailNote?: string }>("/api/admin/users", form);
      toast({
        tone: "success",
        title: `Account created · ${res.customerId}`,
        description: res.emailNote ?? (form.mode === "invite" ? `${form.email} has been emailed a link to set their password.` : "Share the temporary password with them securely."),
      });
      setForm(EMPTY);
      onClose();
      router.refresh();
    } catch (err) {
      toast({ tone: "error", title: "Couldn't create the account", description: (err as Error).message });
    } finally {
      setBusy(false);
    }
  }

  const label = "mb-1.5 block text-xs font-semibold text-ink-700";

  return (
    <Modal open={open} onClose={onClose} title="Add a user" size="md">
      <form onSubmit={submit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block"><span className={label}>First name</span><input required value={form.firstName} onChange={(e) => set("firstName", e.target.value)} className={field} /></label>
          <label className="block"><span className={label}>Last name</span><input required value={form.lastName} onChange={(e) => set("lastName", e.target.value)} className={field} /></label>
        </div>
        <label className="block"><span className={label}>Email</span><input required type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={field} placeholder="name@company.com" /></label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block"><span className={label}>Company <span className="font-normal text-slate-400">(optional)</span></span><input value={form.company} onChange={(e) => set("company", e.target.value)} className={field} /></label>
          <label className="block"><span className={label}>Job title <span className="font-normal text-slate-400">(optional)</span></span><input value={form.jobTitle} onChange={(e) => set("jobTitle", e.target.value)} className={field} /></label>
          <label className="block"><span className={label}>Phone <span className="font-normal text-slate-400">(optional)</span></span><input value={form.phone} onChange={(e) => set("phone", e.target.value)} className={field} /></label>
          <label className="block">
            <span className={label}>Role</span>
            <select value={form.role} onChange={(e) => set("role", e.target.value as "user" | "admin")} className={field}>
              <option value="user">User</option>
              <option value="admin">Admin (full console access)</option>
            </select>
          </label>
        </div>

        <fieldset>
          <legend className={label}>How they sign in</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {([
              ["invite", MailPlus, "Email an invite", "They set their own password from a link."],
              ["password", KeyRound, "Set a password", "You give them a temporary password."],
            ] as const).map(([mode, Icon, title, hint]) => (
              <button
                key={mode}
                type="button"
                onClick={() => set("mode", mode)}
                aria-pressed={form.mode === mode}
                className={cn("rounded-xl border p-3 text-left transition-colors", form.mode === mode ? "border-primary-500 bg-primary-50/60 ring-1 ring-primary-500" : "border-ink-900/10 hover:border-primary-300")}
              >
                <Icon className="h-4 w-4 text-primary-600" />
                <p className="mt-1.5 text-sm font-semibold text-ink-900">{title}</p>
                <p className="text-xs text-slate-500">{hint}</p>
              </button>
            ))}
          </div>
        </fieldset>

        {form.mode === "password" && (
          <label className="block">
            <span className={label}>Temporary password</span>
            <input required type="text" autoComplete="new-password" value={form.password} onChange={(e) => set("password", e.target.value)} className={cn(field, "font-mono")} />
            <ul className="mt-2 grid grid-cols-2 gap-1 text-[11px]">
              {PASSWORD_RULES.map((r) => (
                <li key={r.id} className={r.test(form.password) ? "text-emerald-600" : "text-slate-400"}>{r.test(form.password) ? "✓" : "•"} {r.label}</li>
              ))}
            </ul>
          </label>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className={btn.secondary}>Cancel</button>
          <button type="submit" disabled={busy} className={btn.primary}>{busy ? <Spinner /> : <UserPlus className="h-4 w-4" />} Create account</button>
        </div>
      </form>
    </Modal>
  );
}
