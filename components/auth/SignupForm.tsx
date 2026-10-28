"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Copy, Loader2, Sparkles, UserPlus, X } from "lucide-react";
import { PASSWORD_RULES, signupSchema, type SignupInput } from "@/lib/validations";
import { generatePassword, passwordScore, SCORE_LABELS } from "@/lib/password";
import { FieldError, NotLiveNotice, PasswordInput, SsoButtons, fieldBorder, inputClass } from "@/components/auth/AuthFields";
import { cn } from "@/lib/utils";

const SCORE_COLOURS = ["bg-ink-900/10", "bg-red-500", "bg-amber-500", "bg-primary-400", "bg-emerald-500"];

// Validation only: nothing is sent anywhere until the platform's account backend exists.
export default function SignupForm() {
  const [notice, setNotice] = useState<string | null>(null);
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

  async function onSubmit() {
    setChecking(true);
    await new Promise((r) => setTimeout(r, 800));
    setChecking(false);
    setNotice("Everything checks out. Self-service accounts open when the platform launches; nothing has been saved. To get in sooner, request a pilot place.");
  }

  return (
    <div className="space-y-6">
      <SsoButtons onSelect={(p) => setNotice(`${p} sign-up opens alongside the platform itself.`)} />

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

        {notice && (
          <NotLiveNotice>
            {notice}{" "}
            <Link href="/request-access" className="font-semibold underline">Request early access</Link>
          </NotLiveNotice>
        )}

        <button
          type="submit"
          disabled={checking}
          className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary-500 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-primary-600 hover:shadow-[0_8px_24px_-8px_rgba(30,106,255,0.6)] disabled:opacity-70"
        >
          {checking ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
          {checking ? "Checking…" : "Create account"}
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
