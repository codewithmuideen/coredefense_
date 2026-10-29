import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const btn = {
  primary:
    "focus-ring-light inline-flex items-center justify-center gap-2 rounded-lg bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-600 hover:shadow-[0_8px_20px_-8px_rgba(30,106,255,0.6)] disabled:pointer-events-none disabled:opacity-60",
  secondary:
    "focus-ring-light inline-flex items-center justify-center gap-2 rounded-lg border border-ink-900/12 bg-white px-4 py-2.5 text-sm font-semibold text-ink-800 shadow-sm transition-colors hover:border-ink-900/25 hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-60",
  ghost:
    "focus-ring-light inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-ink-600 transition-colors hover:bg-ink-900/5 hover:text-ink-900 disabled:opacity-60",
  danger:
    "focus-ring-light inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700 disabled:pointer-events-none disabled:opacity-60",
};

export const field =
  "focus-ring-light w-full rounded-lg border border-ink-900/12 bg-white px-3.5 py-2.5 text-sm text-ink-900 shadow-sm placeholder:text-slate-400 transition-colors focus:border-primary-400 disabled:bg-slate-50 disabled:text-slate-500";

export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("rounded-2xl border border-ink-900/[0.07] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]", className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ title, description, action, className }: { title: string; description?: string; action?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-start justify-between gap-3 border-b border-ink-900/[0.06] px-5 py-4 sm:px-6", className)}>
      <div className="min-w-0">
        <h2 className="text-[15px] font-bold text-ink-900">{title}</h2>
        {description && <p className="mt-0.5 text-[13px] leading-relaxed text-slate-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function PageHeader({ title, description, actions, eyebrow }: { title: string; description?: string; actions?: React.ReactNode; eyebrow?: string }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4 sm:mb-8">
      <div className="min-w-0">
        {eyebrow && <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-primary-600">{eyebrow}</p>}
        <h1 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-[28px]">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-slate-500">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Badge({ className, children, dot }: { className?: string; children: React.ReactNode; dot?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset", className)}>
      {dot && <span className="h-1.5 w-1.5 rounded-full" style={{ background: dot }} aria-hidden />}
      {children}
    </span>
  );
}

export function Switch({ checked, onChange, disabled, label }: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "focus-ring-light relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:opacity-50",
        checked ? "bg-primary-500" : "bg-slate-300"
      )}
    >
      <span className={cn("inline-block h-5 w-5 rounded-full bg-white shadow transition-transform", checked ? "translate-x-[22px]" : "translate-x-0.5")} />
    </button>
  );
}

export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn("h-4 w-4 animate-spin", className)} aria-hidden />;
}

export function EmptyState({ icon: Icon, title, description, action }: { icon: React.ComponentType<{ className?: string }>; title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
        <Icon className="h-6 w-6" />
      </span>
      <p className="mt-4 font-semibold text-ink-900">{title}</p>
      <p className="mt-1 max-w-sm text-sm leading-relaxed text-slate-500">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Avatar({ src, name, size = 36, className }: { src?: string | null; name: string; size?: number; className?: string }) {
  const letters = name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return src ? (
    // eslint-disable-next-line @next/next/no-img-element -- user uploads on the Supabase CDN, already resized
    <img src={src} alt="" width={size} height={size} className={cn("shrink-0 rounded-full object-cover", className)} style={{ width: size, height: size }} />
  ) : (
    <span
      className={cn("flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-700 font-bold text-white", className)}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      aria-hidden
    >
      {letters || "?"}
    </span>
  );
}
