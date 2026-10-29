"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle, Check, Copy, KeyRound, LogOut, Mail, MonitorSmartphone, ShieldCheck, Smartphone, Trash2, X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Modal from "@/components/ui/Modal";
import { Badge, Card, CardHeader, Spinner, Switch, btn, field } from "@/components/app/ui";
import { postJson, useToast } from "@/components/app/Toaster";
import { PasswordInput } from "@/components/auth/AuthFields";
import { EVENT_LABELS, formatDate, timeAgo } from "@/lib/app/format";
import { PASSWORD_RULES } from "@/lib/validations";
import { passwordScore, SCORE_LABELS } from "@/lib/password";
import type { LoginEvent } from "@/types/app";
import { cn } from "@/lib/utils";

const SCORE_COLOURS = ["bg-slate-200", "bg-red-500", "bg-amber-500", "bg-primary-400", "bg-emerald-500"];
const TONE = { good: "bg-emerald-500", warn: "bg-amber-500", bad: "bg-red-500", neutral: "bg-slate-300" };

interface Props {
  email: string;
  emailCodes: boolean;
  totp: { id: string; name: string; createdAt: string } | null;
  events: LoginEvent[];
  passwordUpdatedAt: string | null;
}

export default function SecuritySettings({ email, emailCodes: initialEmailCodes, totp, events }: Props) {
  const router = useRouter();
  const toast = useToast();

  // ── Password ──
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [pwSaving, setPwSaving] = useState(false);
  const score = passwordScore(pw.next);
  const rulesOk = PASSWORD_RULES.every((r) => r.test(pw.next));

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!rulesOk) return toast({ tone: "error", title: "Password too weak", description: "Meet every requirement in the list." });
    if (pw.next !== pw.confirm) return toast({ tone: "error", title: "Passwords don't match" });
    setPwSaving(true);
    try {
      await postJson("/api/account/password", { current: pw.current, password: pw.next });
      setPw({ current: "", next: "", confirm: "" });
      toast({ tone: "success", title: "Password changed", description: "Other devices were signed out and we emailed you a confirmation." });
      router.refresh();
    } catch (err) {
      toast({ tone: "error", title: "Couldn't change password", description: (err as Error).message });
    } finally {
      setPwSaving(false);
    }
  }

  // ── Email codes ──
  const [emailCodes, setEmailCodes] = useState(initialEmailCodes);
  const [emailBusy, setEmailBusy] = useState(false);
  async function toggleEmailCodes(on: boolean) {
    setEmailBusy(true);
    try {
      await postJson("/api/account/two-factor", { action: on ? "email-on" : "email-off" });
      setEmailCodes(on);
      toast({ tone: on ? "success" : "info", title: on ? "Email codes on" : "Email codes off", description: on ? "You'll enter a 6-digit code from your inbox at each sign-in." : "Your password alone will sign you in. We recommend an authenticator app instead." });
      router.refresh();
    } catch (err) {
      toast({ tone: "error", title: "Couldn't update", description: (err as Error).message });
    } finally {
      setEmailBusy(false);
    }
  }

  // ── Authenticator app ──
  const [enroll, setEnroll] = useState<{ factorId: string; qr: string; secret: string } | null>(null);
  const [enrollOpen, setEnrollOpen] = useState(false);
  const [totpCode, setTotpCode] = useState("");
  const [totpBusy, setTotpBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  async function startEnroll() {
    setEnrollOpen(true);
    setTotpBusy(true);
    const supabase = createClient();
    // Clear any half-finished enrolment from an earlier attempt.
    const { data: existing } = await supabase.auth.mfa.listFactors();
    for (const f of existing?.all ?? []) if (f.status !== "verified") await supabase.auth.mfa.unenroll({ factorId: f.id });
    const { data, error } = await supabase.auth.mfa.enroll({ factorType: "totp", friendlyName: `Authenticator ${new Date().toISOString().slice(0, 10)}`, issuer: "CoreDefense" });
    setTotpBusy(false);
    if (error || !data) {
      setEnrollOpen(false);
      return toast({ tone: "error", title: "Couldn't start setup", description: error?.message.includes("disabled") ? "TOTP MFA is turned off in Supabase (Authentication → Multi-Factor)." : error?.message });
    }
    setEnroll({ factorId: data.id, qr: data.totp.qr_code, secret: data.totp.secret });
  }

  async function confirmEnroll(e: React.FormEvent) {
    e.preventDefault();
    if (!enroll) return;
    setTotpBusy(true);
    const { error } = await createClient().auth.mfa.challengeAndVerify({ factorId: enroll.factorId, code: totpCode.replace(/\D/g, "") });
    if (error) {
      setTotpBusy(false);
      return toast({ tone: "error", title: "Code didn't match", description: "Check your phone's clock is correct and enter the current code." });
    }
    await postJson("/api/account/two-factor", { action: "totp-enrolled" }).catch(() => {});
    setTotpBusy(false);
    setEnrollOpen(false);
    setEnroll(null);
    setTotpCode("");
    toast({ tone: "success", title: "Authenticator app added", description: "You'll be asked for a code from the app each time you sign in." });
    router.refresh();
  }

  async function removeTotp() {
    if (!totp || !confirm("Remove your authenticator app? Sign-in will fall back to email codes.")) return;
    setTotpBusy(true);
    const { error } = await createClient().auth.mfa.unenroll({ factorId: totp.id });
    if (error) {
      setTotpBusy(false);
      return toast({ tone: "error", title: "Couldn't remove", description: error.message });
    }
    await postJson("/api/account/two-factor", { action: "totp-removed" }).catch(() => {});
    if (!emailCodes) await toggleEmailCodes(true);
    setTotpBusy(false);
    toast({ tone: "info", title: "Authenticator app removed" });
    router.refresh();
  }

  // ── Sessions & danger zone ──
  const [signingOut, setSigningOut] = useState(false);
  async function signOutEverywhere() {
    if (!confirm("Sign out of CoreDefense on every device, including this one?")) return;
    setSigningOut(true);
    await postJson("/api/account/sign-out-everywhere").catch(() => {});
    router.replace("/login?signed-out=all");
    router.refresh();
  }

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [del, setDel] = useState({ password: "", confirm: "" });
  const [deleting, setDeleting] = useState(false);
  async function deleteAccount(e: React.FormEvent) {
    e.preventDefault();
    setDeleting(true);
    try {
      await postJson("/api/account/delete", del);
      router.replace("/?account-deleted=1");
      router.refresh();
    } catch (err) {
      toast({ tone: "error", title: "Couldn't delete account", description: (err as Error).message });
      setDeleting(false);
    }
  }

  const [eventFilter, setEventFilter] = useState<"all" | "sign_in" | "alerts">("all");
  const shownEvents = useMemo(
    () => events.filter((e) => eventFilter === "all" || (eventFilter === "sign_in" ? e.event === "sign_in" : EVENT_LABELS[e.event]?.tone === "bad" || EVENT_LABELS[e.event]?.tone === "warn")),
    [events, eventFilter]
  );
  const failed24h = events.filter((e) => EVENT_LABELS[e.event]?.tone === "bad" && Date.now() - new Date(e.created_at).getTime() < 86_400_000).length;
  const level = totp ? "Strong" : emailCodes ? "Good" : "Weak";

  return (
    <div className="space-y-6">
      {/* Status strip */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="flex items-center gap-4 p-5">
          <span className={cn("flex h-11 w-11 items-center justify-center rounded-xl", level === "Strong" ? "bg-emerald-50 text-emerald-600" : level === "Good" ? "bg-primary-50 text-primary-600" : "bg-red-50 text-red-600")}>
            <ShieldCheck className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-medium text-slate-500">Sign-in protection</p>
            <p className="text-lg font-bold text-ink-900">{level}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 p-5">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600"><MonitorSmartphone className="h-5 w-5" /></span>
          <div>
            <p className="text-xs font-medium text-slate-500">Last sign-in</p>
            <p className="text-lg font-bold text-ink-900">{timeAgo(events.find((e) => e.event === "sign_in")?.created_at)}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 p-5">
          <span className={cn("flex h-11 w-11 items-center justify-center rounded-xl", failed24h ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600")}><AlertTriangle className="h-5 w-5" /></span>
          <div>
            <p className="text-xs font-medium text-slate-500">Failed attempts (24h)</p>
            <p className="text-lg font-bold text-ink-900">{failed24h}</p>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {/* Two-step sign-in */}
        <Card id="two-factor" className="scroll-mt-24">
          <CardHeader title="Two-step sign-in" description="A second check after your password, so a stolen password alone can't get in." />
          <ul className="divide-y divide-ink-900/[0.05]">
            <li className="flex gap-4 px-5 py-5 sm:px-6">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600"><Smartphone className="h-5 w-5" /></span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-ink-900">Authenticator app</p>
                  <Badge className="bg-emerald-50 text-emerald-700 ring-emerald-600/15">Recommended</Badge>
                  {totp && <Badge className="bg-primary-50 text-primary-700 ring-primary-600/15"><Check className="h-3 w-3" /> On</Badge>}
                </div>
                <p className="mt-1 text-[13px] leading-relaxed text-slate-500">
                  {totp ? `Added ${formatDate(totp.createdAt)}. Codes from your app replace email codes.` : "Google Authenticator, Microsoft Authenticator, 1Password or Authy. Works offline and can't be phished by email."}
                </p>
                <div className="mt-3">
                  {totp ? (
                    <button onClick={removeTotp} disabled={totpBusy} className={cn(btn.secondary, "py-2 text-red-600")}>{totpBusy ? <Spinner /> : <Trash2 className="h-4 w-4" />} Remove</button>
                  ) : (
                    <button onClick={startEnroll} className={cn(btn.primary, "py-2")}><Smartphone className="h-4 w-4" /> Set up</button>
                  )}
                </div>
              </div>
            </li>
            <li className="flex gap-4 px-5 py-5 sm:px-6">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600"><Mail className="h-5 w-5" /></span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-ink-900">Email sign-in codes</p>
                <p className="mt-1 text-[13px] leading-relaxed text-slate-500">
                  A 6-digit code sent to <strong className="text-ink-700">{email}</strong> each time you sign in.{totp ? " Used only if you remove your authenticator app." : ""}
                </p>
              </div>
              <Switch checked={emailCodes} disabled={emailBusy} onChange={toggleEmailCodes} label="Email sign-in codes" />
            </li>
          </ul>
          {!totp && !emailCodes && (
            <p className="flex items-center gap-2 border-t border-red-100 bg-red-50 px-5 py-3 text-xs font-medium text-red-700 sm:px-6">
              <AlertTriangle className="h-4 w-4" /> Your account is protected by a password only.
            </p>
          )}
        </Card>

        {/* Password */}
        <Card id="password" className="scroll-mt-24">
          <CardHeader title="Change password" description="Changing it signs you out everywhere else and sends a confirmation email." />
          <form onSubmit={changePassword} className="space-y-4 p-5 sm:p-6">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-ink-700">Current password</span>
              <PasswordInput autoComplete="current-password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} required />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-ink-700">New password</span>
              <PasswordInput autoComplete="new-password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} required />
            </label>
            {pw.next && (
              <div>
                <div className="flex items-center gap-3">
                  <div className="grid flex-1 grid-cols-4 gap-1.5" aria-hidden>
                    {[1, 2, 3, 4].map((n) => <span key={n} className={cn("h-1.5 rounded-full transition-colors", n <= score ? SCORE_COLOURS[score] : "bg-slate-200")} />)}
                  </div>
                  <span className="w-14 text-right text-xs font-semibold text-slate-500">{SCORE_LABELS[score]}</span>
                </div>
                <ul className="mt-2 grid gap-1 sm:grid-cols-2">
                  {PASSWORD_RULES.map((r) => {
                    const ok = r.test(pw.next);
                    return <li key={r.id} className={cn("flex items-center gap-1.5 text-xs", ok ? "text-emerald-700" : "text-slate-400")}>{ok ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}{r.label}</li>;
                  })}
                </ul>
              </div>
            )}
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-ink-700">Confirm new password</span>
              <PasswordInput autoComplete="new-password" value={pw.confirm} hasError={!!pw.confirm && pw.confirm !== pw.next} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} required />
            </label>
            <div className="flex justify-end pt-1">
              <button type="submit" disabled={pwSaving || !pw.current || !rulesOk || pw.next !== pw.confirm} className={btn.primary}>
                {pwSaving ? <Spinner /> : <KeyRound className="h-4 w-4" />} Update password
              </button>
            </div>
          </form>
        </Card>
      </div>

      {/* History */}
      <Card id="history" className="scroll-mt-24">
        <CardHeader
          title="Sign-in history"
          description="Every sign-in, code and security change on your account. Don't recognise something? Change your password now."
          action={
            <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
              {([["all", "All"], ["sign_in", "Sign-ins"], ["alerts", "Alerts"]] as const).map(([id, label]) => (
                <button key={id} onClick={() => setEventFilter(id)} className={cn("rounded-md px-3 py-1 text-xs font-semibold transition-colors", eventFilter === id ? "bg-white text-ink-900 shadow-sm" : "text-slate-500 hover:text-ink-800")}>{label}</button>
              ))}
            </div>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-ink-900/[0.06] text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-5 py-3 sm:px-6">Event</th>
                <th className="px-3 py-3">Device</th>
                <th className="px-3 py-3">Location</th>
                <th className="px-3 py-3">IP address</th>
                <th className="px-5 py-3 text-right sm:px-6">When</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-900/[0.05]">
              {shownEvents.length === 0 && <tr><td colSpan={5} className="px-6 py-10 text-center text-slate-500">No events to show.</td></tr>}
              {shownEvents.map((e) => {
                const meta = EVENT_LABELS[e.event] ?? { label: e.event, tone: "neutral" as const };
                return (
                  <tr key={e.id} className="hover:bg-slate-50/60">
                    <td className="px-5 py-3 sm:px-6"><span className="flex items-center gap-2.5 font-medium text-ink-900"><span className={cn("h-2 w-2 rounded-full", TONE[meta.tone])} />{meta.label}</span></td>
                    <td className="px-3 py-3 text-slate-600">{e.device ?? "—"}</td>
                    <td className="px-3 py-3 text-slate-600">{e.location ?? "—"}</td>
                    <td className="px-3 py-3 font-mono text-xs text-slate-500">{e.ip ?? "—"}</td>
                    <td className="whitespace-nowrap px-5 py-3 text-right text-slate-500 sm:px-6" title={formatDate(e.created_at, true)}>{timeAgo(e.created_at)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5 sm:p-6">
          <p className="text-[15px] font-bold text-ink-900">Sign out everywhere</p>
          <p className="mt-1 text-[13px] leading-relaxed text-slate-500">Ends every session on every device and browser, including this one. Use it if you lost a device or signed in on a shared computer.</p>
          <button onClick={signOutEverywhere} disabled={signingOut} className={cn(btn.secondary, "mt-4")}>{signingOut ? <Spinner /> : <LogOut className="h-4 w-4" />} Sign out of all devices</button>
        </Card>
        <Card className="border-red-200 p-5 sm:p-6">
          <p className="text-[15px] font-bold text-red-700">Delete account</p>
          <p className="mt-1 text-[13px] leading-relaxed text-slate-500">Permanently removes your profile, findings, tickets and history. This can&apos;t be undone.</p>
          <button onClick={() => setDeleteOpen(true)} className={cn(btn.danger, "mt-4")}><Trash2 className="h-4 w-4" /> Delete my account</button>
        </Card>
      </div>

      <Modal open={enrollOpen} onClose={() => { setEnrollOpen(false); setEnroll(null); setTotpCode(""); }} title="Set up your authenticator app" size="md">
        {!enroll ? (
          <div className="flex justify-center py-16"><Spinner className="h-6 w-6 text-primary-500" /></div>
        ) : (
          <form onSubmit={confirmEnroll} className="space-y-5">
            <ol className="space-y-1.5 text-sm text-slate-600">
              <li><strong className="text-ink-900">1.</strong> Open your authenticator app and add a new account.</li>
              <li><strong className="text-ink-900">2.</strong> Scan this QR code, or enter the key by hand.</li>
              <li><strong className="text-ink-900">3.</strong> Type the 6-digit code the app shows.</li>
            </ol>
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-ink-900/[0.07] bg-slate-50 p-5 sm:flex-row">
              {/* eslint-disable-next-line @next/next/no-img-element -- data URL from Supabase */}
              <img src={enroll.qr} alt="QR code for your authenticator app" className="h-44 w-44 rounded-xl bg-white p-2 shadow-sm" />
              <div className="min-w-0 flex-1 text-center sm:text-left">
                <p className="text-xs font-semibold text-slate-500">Can&apos;t scan? Setup key</p>
                <p className="mt-1 break-all font-mono text-sm font-semibold tracking-wide text-ink-900">{enroll.secret.match(/.{1,4}/g)?.join(" ")}</p>
                <button
                  type="button"
                  onClick={async () => { await navigator.clipboard.writeText(enroll.secret).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                  className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary-600"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />} {copied ? "Copied" : "Copy key"}
                </button>
              </div>
            </div>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-ink-700">6-digit code</span>
              <input
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="123456"
                autoFocus
                className={cn(field, "text-center font-mono text-xl tracking-[0.5em]")}
              />
            </label>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setEnrollOpen(false)} className={btn.secondary}>Cancel</button>
              <button type="submit" disabled={totpBusy || totpCode.length !== 6} className={btn.primary}>{totpBusy && <Spinner />} Verify and turn on</button>
            </div>
          </form>
        )}
      </Modal>

      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} title="Delete your account" size="md">
        <form onSubmit={deleteAccount} className="space-y-4">
          <p className="rounded-xl bg-red-50 p-4 text-sm leading-relaxed text-red-800">This permanently deletes your account and everything in it. You&apos;ll be signed out immediately.</p>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-ink-700">Your password</span>
            <PasswordInput autoComplete="current-password" value={del.password} onChange={(e) => setDel({ ...del, password: e.target.value })} required />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-ink-700">Type <strong>DELETE</strong> to confirm</span>
            <input value={del.confirm} onChange={(e) => setDel({ ...del, confirm: e.target.value })} className={field} />
          </label>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setDeleteOpen(false)} className={btn.secondary}>Cancel</button>
            <button type="submit" disabled={deleting || del.confirm !== "DELETE" || !del.password} className={btn.danger}>{deleting && <Spinner />} Delete forever</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
