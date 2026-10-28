"use client";

import { forwardRef, useState } from "react";
import { AlertCircle, Eye, EyeOff, Info } from "lucide-react";
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

/** Shown instead of submitting: accounts go live once the platform backend is ready. */
export function NotLiveNotice({ children }: { children: React.ReactNode }) {
  return (
    <div role="status" className="flex gap-3 rounded-xl border border-primary-200 bg-primary-50 p-4 text-sm leading-relaxed text-primary-800">
      <Info className="mt-0.5 h-4 w-4 shrink-0" />
      <div>{children}</div>
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
