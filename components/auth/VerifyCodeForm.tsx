"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, MailOpen, RefreshCw, ShieldCheck, Smartphone } from "lucide-react";
import { AuthNotice, CodeInput, submitClass } from "@/components/auth/AuthFields";

const COOLDOWN = 45;

/** Second sign-in step. `mode="email"` checks the emailed code; `mode="totp"` checks the authenticator app. */
export default function VerifyCodeForm({ mode }: { mode: "email" | "totp" }) {
  const router = useRouter();
  const params = useSearchParams();
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ tone: "info" | "error" | "success"; text: string } | null>(null);
  const [restart, setRestart] = useState(false);
  const [email, setEmail] = useState("");
  const [testMode, setTestMode] = useState("");
  const [cooldown, setCooldown] = useState(COOLDOWN);

  useEffect(() => {
    setEmail(sessionStorage.getItem("cd_code_email") ?? "");
    setTestMode(sessionStorage.getItem("cd_code_test") ?? "");
  }, []);

  useEffect(() => {
    if (mode !== "email" || cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown, mode]);

  async function submit(value = code) {
    if (value.length !== 6 || busy) return;
    setBusy(true);
    setNotice(null);
    try {
      const res = await fetch(mode === "email" ? "/api/auth/verify" : "/api/auth/mfa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: value, next: params.get("next") ?? undefined }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setNotice({ tone: "error", text: data.error ?? "That code didn't work." });
        setRestart(!!data.restart);
        setCode("");
        (document.getElementById("code-0") as HTMLInputElement | null)?.focus();
        return;
      }
      sessionStorage.removeItem("cd_code_email");
      sessionStorage.removeItem("cd_code_test");
      setNotice({ tone: "success", text: "Verified. Opening your dashboard…" });
      router.replace(data.next ?? "/dashboard");
      router.refresh();
    } catch {
      setNotice({ tone: "error", text: "Network error. Try again." });
    } finally {
      setBusy(false);
    }
  }

  async function resend() {
    setNotice(null);
    const res = await fetch("/api/auth/resend-code", { method: "POST" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setNotice({ tone: "error", text: data.error ?? "Couldn't send a new code." });
      setRestart(!!data.restart);
      return;
    }
    setCooldown(COOLDOWN);
    setCode("");
    setNotice({ tone: "success", text: "A new code is on its way. Earlier codes no longer work." });
  }

  async function cancel() {
    if (mode === "totp") await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    router.replace("/login");
    router.refresh();
  }

  const Icon = mode === "email" ? MailOpen : Smartphone;

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4 rounded-xl bg-surface p-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-500 text-white shadow-lg shadow-primary-500/30">
          <Icon className="h-5 w-5" />
        </span>
        <p className="text-sm leading-relaxed text-ink-600">
          {mode === "email" ? (
            <>We sent a 6-digit code to <strong className="text-ink-900">{email || "your work email"}</strong>. It expires in 10 minutes.</>
          ) : (
            <>Open your authenticator app and enter the 6-digit code shown for <strong className="text-ink-900">CoreDefense</strong>.</>
          )}
        </p>
      </div>

      {mode === "email" && testMode === "1" && (
        <AuthNotice>Email test mode: the code was delivered to the site owner&apos;s Resend inbox, not to this address.</AuthNotice>
      )}
      {mode === "email" && testMode === "log" && (
        <AuthNotice>Development mode: no Resend key is set, so the code was printed in the server terminal.</AuthNotice>
      )}

      <form onSubmit={(e) => { e.preventDefault(); submit(); }} className="space-y-5">
        <CodeInput
          value={code}
          disabled={busy}
          onChange={(v) => {
            setCode(v);
            if (v.length === 6) submit(v);
          }}
        />

        {notice && (
          <AuthNotice tone={notice.tone}>
            {notice.text}
            {restart && <Link href="/login" className="ml-1 font-semibold underline">Back to log in</Link>}
          </AuthNotice>
        )}

        <button type="submit" disabled={busy || code.length !== 6} className={submitClass}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
          {busy ? "Verifying…" : "Verify and continue"}
        </button>
      </form>

      <div className="flex items-center justify-between text-sm">
        {mode === "email" ? (
          <button
            type="button"
            onClick={resend}
            disabled={cooldown > 0}
            className="focus-ring inline-flex items-center gap-1.5 rounded font-semibold text-primary-600 hover:text-primary-700 disabled:text-ink-500"
          >
            <RefreshCw className="h-3.5 w-3.5" /> {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
          </button>
        ) : (
          <span className="text-ink-500">Lost your device? Contact your admin.</span>
        )}
        <button type="button" onClick={cancel} className="focus-ring rounded font-semibold text-ink-500 hover:text-ink-800">
          Use a different account
        </button>
      </div>
    </div>
  );
}
