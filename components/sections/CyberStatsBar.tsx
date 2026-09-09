"use client";

import { Zap } from "lucide-react";
import StatCounter from "@/components/ui/StatCounter";
import CTAButton from "@/components/ui/CTAButton";

const stats = [
  { value: 18750, suffix: "+", label: "Threats Resolved" },
  { value: 3784, suffix: "+", label: "Jobs Completed" },
  { value: 99, suffix: "%", label: "Platform Uptime" },
];

export default function CyberStatsBar() {
  return (
    <section className="relative overflow-hidden bg-ink-900 py-20 sm:py-24">
      <div className="absolute inset-0 bg-grid-dark opacity-30" aria-hidden />
      <div className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-primary-500/15 blur-[120px]" aria-hidden />

      <div className="container-page relative">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-400/20 bg-primary-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary-400">
          <Zap className="h-3.5 w-3.5" />
          Proven at Scale
        </span>
        <h2 className="mt-4 max-w-xl text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Stay ahead of every cyber threat
        </h2>
        <p className="mt-3 max-w-xl text-balance text-base leading-relaxed text-white/60">
          Real outcomes from CoreDefense engagements across IT, cloud and OT environments — not projected figures.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-3 sm:gap-6">
          {stats.map((s) => (
            <div
              key={s.label}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm"
            >
              <StatCounter value={s.value} suffix={s.suffix} label={s.label} dark />
            </div>
          ))}
        </div>

        <div className="mt-10">
          <CTAButton href="/book-consultation" size="lg">
            Book a Consultation
          </CTAButton>
        </div>
      </div>
    </section>
  );
}
