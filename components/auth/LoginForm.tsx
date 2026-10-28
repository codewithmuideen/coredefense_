"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Loader2, LogIn } from "lucide-react";
import { loginSchema, type LoginInput } from "@/lib/validations";
import { FieldError, NotLiveNotice, PasswordInput, SsoButtons, fieldBorder, inputClass } from "@/components/auth/AuthFields";
import { cn } from "@/lib/utils";

// Validation only: nothing is sent anywhere until the platform's authentication backend exists.
export default function LoginForm() {
  const [notice, setNotice] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema), mode: "onTouched" });

  async function onSubmit() {
    setChecking(true);
    await new Promise((r) => setTimeout(r, 700));
    setChecking(false);
    setNotice("Your details look right, but platform sign-in isn't open yet. Pilot customers will receive their login details directly from our team.");
  }

  return (
    <div className="space-y-6">
      <SsoButtons onSelect={(p) => setNotice(`Single sign-on with ${p} will be available when the platform launches.`)} />

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
            <button
              type="button"
              onClick={() => setNotice("Password resets will be handled here once accounts are live. Until then, contact info@coredefense.co.uk.")}
              className="focus-ring rounded font-semibold text-primary-600 hover:text-primary-700"
            >
              Forgot password?
            </button>
          </span>
          <PasswordInput autoComplete="current-password" placeholder="Enter your password" hasError={!!errors.password} {...register("password")} />
          <FieldError message={errors.password?.message} />
        </label>

        <label className="flex items-center gap-2.5 text-sm text-ink-600">
          <input type="checkbox" className="h-4 w-4 rounded border-ink-900/20 text-primary-500 focus:ring-primary-400" {...register("remember")} />
          Keep me signed in on this device
        </label>

        {notice && <NotLiveNotice>{notice}</NotLiveNotice>}

        <button
          type="submit"
          disabled={checking}
          className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary-500 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-primary-600 hover:shadow-[0_8px_24px_-8px_rgba(30,106,255,0.6)] disabled:opacity-70"
        >
          {checking ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
          {checking ? "Checking…" : "Log in"}
        </button>

        <button
          type="button"
          onClick={() => setNotice("SAML single sign-on for Okta, Entra ID and other identity providers is planned for launch.")}
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
