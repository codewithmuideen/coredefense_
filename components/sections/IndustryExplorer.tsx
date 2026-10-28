"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Scale, ShieldAlert } from "lucide-react";
import { serviceDetails } from "@/lib/service-detail-data";
import { industryDetails } from "@/lib/industry-detail-data";
import { cn } from "@/lib/utils";

// Tabbed sector explorer for /industries: sector list on the left, the selected sector's brief on the right.
// Reads the data itself because industry icons are components, which can't be passed from a server page.
const industries = Object.values(industryDetails);

export default function IndustryExplorer() {
  const [active, setActive] = useState(0);
  const industry = industries[active];
  const Icon = industry.icon;

  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="container-page">
        <div className="grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-12">
          {/* Sector tabs: horizontal scroller on phones, vertical list on desktop */}
          <div
            role="tablist"
            aria-label="Industries"
            aria-orientation="vertical"
            className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0 lg:flex-col lg:overflow-visible lg:pb-0"
          >
            {industries.map((item, i) => {
              const TabIcon = item.icon;
              const selected = i === active;
              return (
                <button
                  key={item.slug}
                  role="tab"
                  id={`tab-${i}`}
                  aria-selected={selected}
                  aria-controls="industry-panel"
                  onClick={() => setActive(i)}
                  className={cn(
                    "focus-ring group relative flex shrink-0 items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-all lg:w-full",
                    selected
                      ? "border-primary-500 bg-ink-900 text-white shadow-lg shadow-primary-500/20"
                      : "border-ink-900/8 bg-surface-near text-ink-700 hover:border-primary-200 hover:text-primary-600"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors",
                      selected ? "bg-primary-500 text-white" : "bg-white text-primary-600 group-hover:bg-primary-50"
                    )}
                  >
                    <TabIcon className="h-4 w-4" />
                  </span>
                  <span className="whitespace-nowrap">{item.title}</span>
                  {selected && <ArrowRight className="ml-auto hidden h-4 w-4 text-primary-300 lg:block" />}
                </button>
              );
            })}
          </div>

          <div id="industry-panel" role="tabpanel" aria-labelledby={`tab-${active}`} className="relative min-h-[460px]">
            <AnimatePresence mode="wait">
              <motion.article
                key={industry.slug}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="relative overflow-hidden rounded-3xl bg-ink-900 p-8 text-white sm:p-10 lg:p-12"
              >
                <div className="absolute inset-0 bg-grid-dark opacity-40" aria-hidden />
                <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary-500/30 blur-[100px]" aria-hidden />
                <Icon className="pointer-events-none absolute -bottom-10 -right-10 h-64 w-64 text-white/[0.04]" strokeWidth={1} aria-hidden />

                <div className="relative">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-400">Sector brief</p>
                  <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{industry.title}</h2>
                  <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70">{industry.description}</p>

                  <div className="mt-9 grid gap-6 md:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/50">
                        <Scale className="h-4 w-4 text-primary-400" /> Rules you answer to
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {industry.regulations.map((r) => (
                          <span key={r.name} className="rounded-full border border-primary-400/30 bg-primary-500/10 px-3 py-1 text-xs font-semibold text-primary-200">
                            {r.name}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/50">
                        <ShieldAlert className="h-4 w-4 text-primary-400" /> Services we lead with
                      </p>
                      <ul className="mt-4 space-y-2">
                        {industry.services.map((key) => {
                          const s = serviceDetails[key];
                          return (
                            <li key={key}>
                              <Link href={s.slug} className="focus-ring group/s inline-flex items-center gap-1.5 rounded text-sm text-white/80 hover:text-white">
                                {s.title}
                                <ArrowUpRight className="h-3.5 w-3.5 text-primary-400 transition-transform group-hover/s:-translate-y-0.5 group-hover/s:translate-x-0.5" />
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>

                  <Link
                    href={industry.slug}
                    className="focus-ring mt-9 inline-flex items-center gap-2 rounded-lg bg-primary-500 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-primary-600 hover:shadow-[0_8px_24px_-8px_rgba(30,106,255,0.6)]"
                  >
                    Read the full {industry.title.toLowerCase()} brief <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
