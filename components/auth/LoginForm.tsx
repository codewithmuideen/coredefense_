"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Loader2, LogIn } from "lucide-react";
import { loginSchema, type LoginInput } from "@/lib/validations";
import { AuthNotice, FieldError, PasswordInput, SsoButtons, fieldBorder, inputClass, submitClass } from "@/components/auth/AuthFields";
import { cn } from "@/lib/utils";

const URL_MESSAGES: Record<string, { tone: "info" | "error" | "success"; text: string }> = {
  "link-expired": { tone: "error", text: "That link has expired or was already used. Log in, or request a new link." },
  "invalid-link": { tone: "error", text: "That link isn't valid. Request a new one." },
  "not-configured": { tone: "error", text: "Accounts aren't connected on this server yet (Supabase keys missing)." },
};

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const urlNotice =
    URL_MESSAGES[params.get("error") ?? ""] ??
    (params.get("signed-out") === "all"
      ? { tone: "success" as const, text: "You've been signed out on every device." }
      : params.get("signed-out")
        ? { tone: "success" as const, text: "You've signed out. See you soon." }
        : params.get("reset") === "1"
          ? { tone: "success" as const, text: "Password updated. Log in with your new password." }
          : null);

  const [notice, setNotice] = useState<{ tone: "info" | "error" | "success"; text: React.ReactNode } | null>(urlNotice);
  const [unconfirmedEmail, setUnconfirmedEmail] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema), mode: "onTouched", defaultValues: { remember: true } });

  async function onSubmit(values: LoginInput) {
    setChecking(true);
    setNotice(null);
    setUnconfirmedEmail(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, next: params.get("next") ?? undefined }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data.code === "unconfirmed") setUnconfirmedEmail(values.email);
        setNotice({ tone: "error", text: data.error ?? "Sign-in failed. Please try again." });
        return;
      }
      if (data.next === "/login/verify") {
        sessionStorage.setItem("cd_code_email", data.email ?? "");
        sessionStorage.setItem("cd_code_test", data.redirected ? "1" : data.logged ? "log" : "");
      }
      router.push(data.next);
      router.refresh();
    } catch {
      setNotice({ tone: "error", text: "Network error. Check your connection and try again." });
    } finally {
      setChecking(false);
    }
  }

  async function resendConfirmation() {
    if (!unconfirmedEmail) return;
    const res = await fetch("/api/auth/resend-confirmation", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: unconfirmedEmail }) });
    const data = await res.json().catch(() => ({}));
    setUnconfirmedEmail(null);
    setNotice(res.ok ? { tone: "success", text: "Confirmation email sent. Check your inbox (and spam)." } : { tone: "error", text: data.error ?? "Couldn't send the email." });
  }

  return (
    <div className="space-y-6">
      <SsoButtons onSelect={(p) => setNotice({ tone: "info", text: `Single sign-on with ${p} is coming soon. Use your work email for now.` })} />

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-ink-700">Work email</span>
          <input
            type="email"
            autoComplete="username"
            placeholder="name@company.com"
            className={cn(inputClass, fieldBorder(!!errors.email))}
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          <FieldError message={errors.email?.message} />
        </label>

        <label className="block">
          <span className="mb-1.5 flex items-center justify-between text-xs font-semibold text-ink-700">
            Password
            <Link
              href={`/forgot-password${getValues("email") ? `?email=${encodeURIComponent(getValues("email"))}` : ""}`}
              className="focus-ring rounded font-semibold text-primary-600 hover:text-primary-700"
            >
              Forgot password?
            </Link>
          </span>
          <PasswordInput autoComplete="current-password" placeholder="Enter your password" hasError={!!errors.password} {...register("password")} />
          <FieldError message={errors.password?.message} />
        </label>

        <label className="flex items-center gap-2.5 text-sm text-ink-600">
          <input type="checkbox" className="h-4 w-4 rounded border-ink-900/20 text-primary-500 focus:ring-primary-400" {...register("remember")} />
          Keep me signed in on this device
        </label>

        {notice && (
          <AuthNotice tone={notice.tone}>
            {notice.text}
            {unconfirmedEmail && (
              <button type="button" onClick={resendConfirmation} className="ml-1 font-semibold underline">Resend confirmation email</button>
            )}
          </AuthNotice>
        )}

        <button type="submit" disabled={checking} className={submitClass}>
          {checking ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
          {checking ? "Signing in…" : "Log in"}
        </button>

        <button
          type="button"
          onClick={() => setNotice({ tone: "info", text: "SAML single sign-on for Okta, Entra ID and other identity providers is planned. Ask your admin or contact info@coredefense.co.uk." })}
          className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-lg border border-ink-900/15 px-5 py-2.5 text-sm font-semibold text-ink-700 hover:border-ink-900/30"
        >
          <KeyRound className="h-4 w-4" /> Use enterprise SSO
        </button>
      </form>

      <p className="text-center text-sm text-ink-500">
        New to CoreDefense?{" "}
        <Link href="/signup" className="focus-ring rounded font-semibold text-primary-600 hover:text-primary-700">
          Create an account
        </Link>
      </p>
    </div>
  );
}
