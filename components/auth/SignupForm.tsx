"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Copy, Loader2, MailCheck, Sparkles, UserPlus, X } from "lucide-react";
import { PASSWORD_RULES, signupSchema, type SignupInput } from "@/lib/validations";
import { generatePassword, passwordScore, SCORE_LABELS } from "@/lib/password";
import { AuthNotice, FieldError, PasswordInput, SsoButtons, fieldBorder, inputClass, submitClass } from "@/components/auth/AuthFields";
import { cn } from "@/lib/utils";

const SCORE_COLOURS = ["bg-ink-900/10", "bg-red-500", "bg-amber-500", "bg-primary-400", "bg-emerald-500"];

export default function SignupForm() {
  const [notice, setNotice] = useState<{ tone: "info" | "error"; text: string } | null>(null);
  const [done, setDone] = useState<{ email: string; testMode: boolean; emailError?: string } | null>(null);
  const [checking, setChecking] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<SignupInput>({ resolver: zodResolver(signupSchema), mode: "onTouched" });
  const password = useWatch({ control, name: "password" }) ?? "";
  const score = passwordScore(password);

  function suggest() {
    const pw = generatePassword();
    setValue("password", pw, { shouldValidate: true, shouldDirty: true });
    setValue("confirmPassword", pw, { shouldValidate: true, shouldDirty: true });
    setRevealed(true);
    setCopied(false);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked; the password is visible for manual copying.
    }
  }

  async function onSubmit(values: SignupInput) {
    setChecking(true);
    setNotice(null);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setNotice({ tone: "error", text: data.error ?? "We couldn't create your account. Please try again." });
        return;
      }
      setDone({ email: data.email, testMode: !!data.redirected, emailError: data.emailError });
    } catch {
      setNotice({ tone: "error", text: "Network error. Check your connection and try again." });
    } finally {
      setChecking(false);
    }
  }

  if (done) {
    return (
      <div className="py-4 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
          <MailCheck className="h-7 w-7" />
        </span>
        <h2 className="mt-5 text-xl font-bold text-ink-900">Check your inbox</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-500">
          We sent a confirmation link to <strong className="text-ink-800">{done.email}</strong>. Click it to activate your account. The link expires in 24 hours.
        </p>
        {done.testMode && (
          <div className="mt-5 text-left">
            <AuthNotice>Email is in test mode, so the message was delivered to the site owner&apos;s test inbox instead.</AuthNotice>
          </div>
        )}
        {done.emailError && (
          <div className="mt-5 text-left">
            <AuthNotice tone="error">Your account was created but the email didn&apos;t send: {done.emailError}</AuthNotice>
          </div>
        )}
        <Link href="/login" className="focus-ring mt-6 inline-flex rounded font-semibold text-primary-600 hover:text-primary-700">Back to log in</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SsoButtons onSelect={(p) => setNotice({ tone: "info", text: `${p} sign-up is coming soon. Use your work email for now.` })} />

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-ink-700">First name</span>
            <input autoComplete="given-name" className={cn(inputClass, fieldBorder(!!errors.firstName))} {...register("firstName")} />
            <FieldError message={errors.firstName?.message} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-ink-700">Last name</span>
            <input autoComplete="family-name" className={cn(inputClass, fieldBorder(!!errors.lastName))} {...register("lastName")} />
            <FieldError message={errors.lastName?.message} />
          </label>
        </div>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-ink-700">Work email</span>
          <input
            type="email"
            autoComplete="email"
            placeholder="name@company.com"
            className={cn(inputClass, fieldBorder(!!errors.email))}
            {...register("email")}
          />
          <FieldError message={errors.email?.message} />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-ink-700">Company</span>
          <input autoComplete="organization" className={cn(inputClass, fieldBorder(!!errors.company))} {...register("company")} />
          <FieldError message={errors.company?.message} />
        </label>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="signup-password" className="text-xs font-semibold text-ink-700">Password</label>
            <div className="flex items-center gap-3">
              {password && revealed && (
                <button type="button" onClick={copy} className="focus-ring inline-flex items-center gap-1 rounded text-xs font-semibold text-ink-500 hover:text-ink-800">
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              )}
              <button type="button" onClick={suggest} className="focus-ring inline-flex items-center gap-1 rounded text-xs font-semibold text-primary-600 hover:text-primary-700">
                <Sparkles className="h-3.5 w-3.5" /> Generate strong password
              </button>
            </div>
          </div>
          <PasswordInput
            id="signup-password"
            autoComplete="new-password"
            hasError={!!errors.password}
            revealed={revealed}
            onRevealChange={setRevealed}
            {...register("password")}
          />

          {/* Strength meter */}
          <div className="mt-3 flex items-center gap-3">
            <div className="grid flex-1 grid-cols-4 gap-1.5" aria-hidden>
              {[1, 2, 3, 4].map((n) => (
                <span key={n} className={cn("h-1.5 rounded-full transition-colors", n <= score ? SCORE_COLOURS[score] : "bg-ink-900/10")} />
              ))}
            </div>
            <span className="w-14 text-right text-xs font-semibold text-ink-500" aria-live="polite">{SCORE_LABELS[score]}</span>
          </div>

          <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
            {PASSWORD_RULES.map((rule) => {
              const ok = rule.test(password);
              return (
                <li key={rule.id} className={cn("flex items-center gap-1.5 text-xs", ok ? "text-emerald-700" : "text-ink-400")}>
                  {ok ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                  {rule.label}
                </li>
              );
            })}
          </ul>
          <FieldError message={errors.password?.message} />
        </div>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-ink-700">Confirm password</span>
          <PasswordInput autoComplete="new-password" hasError={!!errors.confirmPassword} revealed={revealed} onRevealChange={setRevealed} {...register("confirmPassword")} />
          <FieldError message={errors.confirmPassword?.message} />
        </label>

        <label className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-600">
          <input type="checkbox" className="mt-1 h-4 w-4 rounded border-ink-900/20 text-primary-500 focus:ring-primary-400" {...register("terms")} />
          <span>
            I agree to the{" "}
            <Link href="/terms" className="font-semibold text-primary-600 hover:underline">Terms</Link> and{" "}
            <Link href="/privacy" className="font-semibold text-primary-600 hover:underline">Privacy Policy</Link>.
          </span>
        </label>
        <FieldError message={errors.terms?.message} />

        {notice && <AuthNotice tone={notice.tone}>{notice.text}</AuthNotice>}

        <button
          type="submit"
          disabled={checking}
          className={submitClass}
        >
          {checking ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
          {checking ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="text-center text-sm text-ink-500">
        Already have an account?{" "}
        <Link href="/login" className="focus-ring rounded font-semibold text-primary-600 hover:text-primary-700">
          Log in
        </Link>
      </p>
    </div>
  );
}
