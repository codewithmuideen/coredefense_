import Link from "next/link";
import { ShieldCheck, Radar, FileCheck2, Lock } from "lucide-react";
import Logo from "@/components/ui/Logo";

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  /** Left-panel copy differs per page so the two screens don't repeat each other. */
  panel: { heading: string; points: { title: string; detail: string }[] };
}

const POINT_ICONS = [Radar, ShieldCheck, FileCheck2];

// Split-screen frame for the login and sign-up pages: brand panel on the left, form card on the right.
export default function AuthShell({ title, subtitle, children, panel }: AuthShellProps) {
  return (
    <section className="relative bg-surface">
      <div className="grid min-h-[calc(100vh-72px)] lg:grid-cols-[1fr_1.05fr]">
        <aside className="relative hidden overflow-hidden bg-ink-900 lg:flex lg:flex-col lg:justify-between lg:p-14 xl:p-16">
          <div className="absolute inset-0 bg-grid-dark opacity-40" aria-hidden />
          <div className="pointer-events-none absolute -left-24 top-10 h-96 w-96 rounded-full bg-primary-500/25 blur-[120px]" aria-hidden />
          <div className="pointer-events-none absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-primary-400/15 blur-[110px]" aria-hidden />

          <div className="relative">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-white/70">
              <span className="h-1.5 w-1.5 animate-glow rounded-full bg-primary-400" />
              CoreDefense Platform
            </p>
            <h2 className="mt-8 max-w-md text-balance text-3xl font-bold leading-tight tracking-tight text-white xl:text-4xl">
              {panel.heading}
            </h2>
            <ul className="mt-10 space-y-6">
              {panel.points.map((p, i) => {
                const Icon = POINT_ICONS[i % POINT_ICONS.length];
                return (
                  <li key={p.title} className="flex gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-primary-300">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-semibold text-white">{p.title}</p>
                      <p className="mt-1 max-w-sm text-sm leading-relaxed text-white/55">{p.detail}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="relative flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur">
            <Lock className="h-5 w-5 shrink-0 text-primary-300" />
            <p className="text-xs leading-relaxed text-white/60">
              Sessions are encrypted in transit. Never share your password; CoreDefense staff will never ask for it.
            </p>
          </div>
        </aside>

        <div className="flex items-center justify-center px-4 py-12 sm:px-8 lg:py-16">
          <div className="w-full max-w-md">
            <Link href="/" className="focus-ring mb-8 inline-flex rounded-md lg:hidden" aria-label="CoreDefense home">
              <Logo />
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">{title}</h1>
            <p className="mt-2 text-sm leading-relaxed text-ink-500">{subtitle}</p>
            <div className="mt-8 rounded-2xl border border-ink-900/8 bg-white p-6 shadow-xl shadow-ink-900/5 sm:p-8">{children}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
