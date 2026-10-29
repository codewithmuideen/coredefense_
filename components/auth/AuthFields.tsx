"use client";

import { forwardRef, useState } from "react";
import { AlertCircle, CheckCircle2, Eye, EyeOff, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export const inputClass =
  "focus-ring w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 transition-colors focus:border-primary-400";

export function fieldBorder(hasError: boolean) {
  return hasError ? "border-red-400 bg-red-50/40" : "border-ink-900/15";
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <span role="alert" className="mt-1.5 flex items-start gap-1.5 text-xs text-red-600">
      <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" /> {message}
    </span>
  );
}

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
  revealed?: boolean;
  onRevealChange?: (revealed: boolean) => void;
}

/** Password field with a show/hide toggle. Reveal state can be controlled (e.g. after generating a password). */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(function PasswordInput(
  { hasError = false, revealed, onRevealChange, className, ...props },
  ref
) {
  const [localShow, setLocalShow] = useState(false);
  const show = revealed ?? localShow;
  const toggle = () => (onRevealChange ? onRevealChange(!show) : setLocalShow(!show));
  return (
    <div className="relative">
      <input ref={ref} type={show ? "text" : "password"} className={cn(inputClass, fieldBorder(hasError), "pr-11", className)} {...props} />
      <button
        type="button"
        onClick={toggle}
        className="focus-ring absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-ink-400 hover:text-ink-700"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
});

const NOTICE_TONES = {
  info: { box: "border-primary-200 bg-primary-50 text-primary-800", icon: Info },
  error: { box: "border-red-200 bg-red-50 text-red-800", icon: AlertCircle },
  success: { box: "border-emerald-200 bg-emerald-50 text-emerald-800", icon: CheckCircle2 },
};

/** Inline message on the auth forms: server errors, test-mode hints and confirmations. */
export function AuthNotice({ children, tone = "info" }: { children: React.ReactNode; tone?: keyof typeof NOTICE_TONES }) {
  const t = NOTICE_TONES[tone];
  return (
    <div role={tone === "error" ? "alert" : "status"} className={cn("flex gap-3 rounded-xl border p-4 text-sm leading-relaxed", t.box)}>
      <t.icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="min-w-0">{children}</div>
    </div>
  );
}

export const submitClass =
  "focus-ring inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary-500 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-primary-600 hover:shadow-[0_8px_24px_-8px_rgba(30,106,255,0.6)] disabled:opacity-70";

/** Six single-digit boxes that behave like one field: paste, backspace and arrow keys all work. */
export function CodeInput({ value, onChange, disabled, autoFocus = true }: { value: string; onChange: (v: string) => void; disabled?: boolean; autoFocus?: boolean }) {
  const digits = Array.from({ length: 6 }, (_, i) => value[i] ?? "");
  const focus = (i: number) => (document.getElementById(`code-${Math.max(0, Math.min(5, i))}`) as HTMLInputElement | null)?.focus();
  return (
    <div className="flex justify-between gap-2 sm:gap-3" role="group" aria-label="6-digit code">
      {digits.map((d, i) => (
        <input
          key={i}
          id={`code-${i}`}
          value={d}
          disabled={disabled}
          autoFocus={autoFocus && i === 0}
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          aria-label={`Digit ${i + 1}`}
          maxLength={6}
          onChange={(e) => {
            const typed = e.target.value.replace(/\D/g, "");
            if (!typed) return;
            if (typed.length > 1) {
              const next = (value.slice(0, i) + typed).slice(0, 6);
              onChange(next);
              focus(next.length);
              return;
            }
            const next = (value.slice(0, i) + typed + value.slice(i + 1)).slice(0, 6);
            onChange(next);
            focus(i + 1);
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace") {
              e.preventDefault();
              if (d) onChange(value.slice(0, i) + value.slice(i + 1));
              else if (i > 0) {
                onChange(value.slice(0, i - 1) + value.slice(i));
                focus(i - 1);
              }
            }
            if (e.key === "ArrowLeft") focus(i - 1);
            if (e.key === "ArrowRight") focus(i + 1);
          }}
          onFocus={(e) => e.target.select()}
          className={cn(
            "focus-ring h-14 w-full min-w-0 rounded-xl border bg-white text-center font-mono text-2xl font-bold text-ink-900 transition-colors focus:border-primary-400 disabled:opacity-60",
            d ? "border-primary-300 bg-primary-50/40" : "border-ink-900/15"
          )}
        />
      ))}
    </div>
  );
}

const SSO = [
  {
    label: "Microsoft",
    icon: (
      <svg viewBox="0 0 21 21" className="h-4 w-4" aria-hidden>
        <path fill="#F25022" d="M1 1h9v9H1z" />
        <path fill="#7FBA00" d="M11 1h9v9h-9z" />
        <path fill="#00A4EF" d="M1 11h9v9H1z" />
        <path fill="#FFB900" d="M11 11h9v9h-9z" />
      </svg>
    ),
  },
  {
    label: "Google Workspace",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
        <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.2-2.1 3.5-5.1 3.5-8.7z" />
        <path fill="#34A853" d="M12 24c3.2 0 6-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9h-4v3.1A12 12 0 0 0 12 24z" />
        <path fill="#FBBC05" d="M5.4 14.4a7.2 7.2 0 0 1 0-4.7V6.6h-4a12 12 0 0 0 0 10.8l4-3z" />
        <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.4 6.6l4 3.1C6.3 6.9 8.9 4.8 12 4.8z" />
      </svg>
    ),
  },
];

export function SsoButtons({ onSelect }: { onSelect: (provider: string) => void }) {
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        {SSO.map((s) => (
          <button
            key={s.label}
            type="button"
            onClick={() => onSelect(s.label)}
            className="focus-ring inline-flex items-center justify-center gap-2.5 rounded-lg border border-ink-900/15 bg-white px-4 py-2.5 text-sm font-semibold text-ink-800 transition-colors hover:border-ink-900/30 hover:bg-surface"
          >
            {s.icon}
            {s.label}
          </button>
        ))}
      </div>
      <div className="my-6 flex items-center gap-3 text-xs font-medium uppercase tracking-wider text-ink-400">
        <span className="h-px flex-1 bg-ink-900/10" />
        or with your work email
        <span className="h-px flex-1 bg-ink-900/10" />
      </div>
    </>
  );
}
