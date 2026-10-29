"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Check, KeyRound, Loader2, MailCheck, Send, Sparkles, X } from "lucide-react";
import { AuthNotice, PasswordInput, inputClass, fieldBorder, submitClass } from "@/components/auth/AuthFields";
import { PASSWORD_RULES } from "@/lib/validations";
import { generatePassword, passwordScore, SCORE_LABELS } from "@/lib/password";
import { cn } from "@/lib/utils";

const SCORE_COLOURS = ["bg-ink-900/10", "bg-red-500", "bg-amber-500", "bg-primary-400", "bg-emerald-500"];

export function ForgotPasswordForm() {
  const params = useSearchParams();
  const [email, setEmail] = useState(params.get("email") ?? "");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [devNote, setDevNote] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Enter a valid email address.");
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/forgot", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return setError(data.error ?? "Something went wrong. Try again.");
      setDevNote(data.emailError ?? null);
      setSent(true);
    } catch {
      setError("Network error. Try again.");
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <div className="py-2 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600"><MailCheck className="h-7 w-7" /></span>
        <h2 className="mt-5 text-xl font-bold text-ink-900">Check your inbox</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-500">
          If an account exists for <strong className="text-ink-800">{email}</strong>, a reset link is on its way. It expires in 1 hour.
        </p>
        {devNote && <div className="mt-5 text-left"><AuthNotice tone="error">Development note: the email failed to send: {devNote}</AuthNotice></div>}
        <Link href="/login" className="focus-ring mt-6 inline-flex items-center gap-1.5 rounded font-semibold text-primary-600"><ArrowLeft className="h-4 w-4" /> Back to log in</Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold text-ink-700">Work email</span>
        <input type="email" autoComplete="email" autoFocus value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" className={cn(inputClass, fieldBorder(!!error))} />
      </label>
      {error && <AuthNotice tone="error">{error}</AuthNotice>}
      <button type="submit" disabled={busy} className={submitClass}>
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Send reset link
      </button>
      <p className="text-center text-sm">
        <Link href="/login" className="focus-ring inline-flex items-center gap-1.5 rounded font-semibold text-ink-500 hover:text-ink-800"><ArrowLeft className="h-4 w-4" /> Back to log in</Link>
      </p>
    </form>
  );
}

export function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const score = passwordScore(password);
  const ok = PASSWORD_RULES.every((r) => r.test(password));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!ok) return setError("Your password doesn't meet every requirement yet.");
    if (password !== confirm) return setError("Passwords don't match.");
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/reset", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) return setError("Your reset link has expired. Request a new one from the login page.");
      if (!res.ok) return setError(data.error ?? "Couldn't update your password.");
      router.replace("/dashboard?password-reset=1");
      router.refresh();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label htmlFor="new-password" className="text-xs font-semibold text-ink-700">New password</label>
          <button
            type="button"
            onClick={() => { const pw = generatePassword(); setPassword(pw); setConfirm(pw); setRevealed(true); }}
            className="focus-ring inline-flex items-center gap-1 rounded text-xs font-semibold text-primary-600 hover:text-primary-700"
          >
            <Sparkles className="h-3.5 w-3.5" /> Generate strong password
          </button>
        </div>
        <PasswordInput id="new-password" autoComplete="new-password" autoFocus value={password} revealed={revealed} onRevealChange={setRevealed} onChange={(e) => setPassword(e.target.value)} />
        <div className="mt-3 flex items-center gap-3">
          <div className="grid flex-1 grid-cols-4 gap-1.5" aria-hidden>
            {[1, 2, 3, 4].map((n) => <span key={n} className={cn("h-1.5 rounded-full transition-colors", n <= score ? SCORE_COLOURS[score] : "bg-ink-900/10")} />)}
          </div>
          <span className="w-14 text-right text-xs font-semibold text-ink-500">{SCORE_LABELS[score]}</span>
        </div>
        <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
          {PASSWORD_RULES.map((r) => {
            const met = r.test(password);
            return <li key={r.id} className={cn("flex items-center gap-1.5 text-xs", met ? "text-emerald-700" : "text-ink-400")}>{met ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}{r.label}</li>;
          })}
        </ul>
      </div>
      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold text-ink-700">Confirm new password</span>
        <PasswordInput autoComplete="new-password" value={confirm} revealed={revealed} onRevealChange={setRevealed} hasError={!!confirm && confirm !== password} onChange={(e) => setConfirm(e.target.value)} />
      </label>
      {error && <AuthNotice tone="error">{error}</AuthNotice>}
      <button type="submit" disabled={busy} className={submitClass}>
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />} Save new password
      </button>
    </form>
  );
}
