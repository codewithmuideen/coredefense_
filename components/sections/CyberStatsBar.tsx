"use client";

import { Zap } from "lucide-react";
import StatCounter from "@/components/ui/StatCounter";

// Scope of the cybersecurity practice. Outcome figures (threats resolved, uptime) live on the home page only.
const stats = [
  { value: 8, suffix: "", label: "Specialist Security Services" },
  { value: 3, suffix: "", label: "Environments Covered: IT, Cloud & OT" },
  { value: 5, suffix: "", label: "Frameworks Covered, from ISO 27001 to Cyber Essentials" },
];

export default function CyberStatsBar() {
  return (
    <section className="relative overflow-hidden bg-ink-900 py-20 sm:py-24">
      <div className="absolute inset-0 bg-grid-dark opacity-30" aria-hidden />
      <div className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-primary-500/15 blur-[120px]" aria-hidden />

      <div className="container-page relative">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-400/20 bg-primary-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary-400">
          <Zap className="h-3.5 w-3.5" />
          Practice Coverage
        </span>
        <h2 className="mt-4 max-w-xl text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl">
          One practice, every layer of your estate
        </h2>
        <p className="mt-3 max-w-xl text-balance text-base leading-relaxed text-white/60">
          The scope of our security practice at a glance: the services we run, the environments we work in and the standards UK organisations are measured against.
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

      </div>
    </section>
  );
}
