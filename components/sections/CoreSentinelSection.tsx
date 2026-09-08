"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ShieldCheck, BarChart3, Settings2, Users } from "lucide-react";
import Logo from "@/components/ui/Logo";
import CTAButton from "@/components/ui/CTAButton";

const pillars = [
  { icon: ShieldCheck, label: "Security Intelligence" },
  { icon: BarChart3, label: "Business Context" },
  { icon: Settings2, label: "Automation" },
  { icon: Users, label: "Human Expertise" },
];

export default function CoreSentinelSection() {
  return (
    <section className="bg-surface pb-24 sm:pb-32">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-3xl bg-ink-900"
        >
          <div className="absolute inset-0 bg-grid-dark opacity-30" aria-hidden />
          <div className="pointer-events-none absolute -left-16 top-0 h-[420px] w-[420px] rounded-full bg-primary-500/20 blur-[130px]" aria-hidden />
          <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-primary-400/10 blur-[110px]" aria-hidden />

          <div className="relative grid gap-10 p-8 sm:p-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:p-16">
            {/* Character — desktop, standing on the left */}
            <div className="relative hidden lg:block">
              <div className="absolute left-1/2 top-[62%] h-40 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-500/25 blur-[70px]" aria-hidden />
              <div className="relative mx-auto aspect-[2/3] w-full max-w-md">
                <Image
                  src="/images/photos/core-sentinel-cutout-half.png"
                  alt="Core Sentinel, the CoreDefense brand guardian"
                  fill
                  sizes="(min-width: 1024px) 45vw, 0px"
                  className="object-contain object-bottom"
                  priority
                />
              </div>
            </div>

            <div>
              <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <Logo dark className="opacity-90" />
                <span className="hidden h-4 w-px bg-white/20 sm:block" aria-hidden />
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-400">
                  The CoreDefense Ecosystem
                </p>
              </div>
              <h2 className="text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Meet <span className="whitespace-nowrap">Core<span className="text-primary-400">Sentinel</span></span>
              </h2>
              <p className="mt-3 text-lg font-medium text-white/80">
                The visual guardian of the CoreDefense ecosystem.
              </p>
              <p className="mt-4 max-w-lg text-balance text-base leading-relaxed text-white/60">
                Core Sentinel represents how security intelligence, business context, automation and human
                expertise work together to turn complex risk into clear action.
              </p>

              {/* Character — mobile only, sits beneath the copy */}
              <div className="relative mx-auto -mt-2 mb-8 aspect-[2/3] w-[260px] lg:hidden">
                <div className="absolute left-1/2 top-[62%] h-32 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-500/25 blur-[60px]" aria-hidden />
                <Image
                  src="/images/photos/core-sentinel-cutout-half.png"
                  alt="Core Sentinel, the CoreDefense brand guardian"
                  fill
                  sizes="260px"
                  className="object-contain object-bottom"
                  priority
                />
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3 sm:max-w-md">
                {pillars.map((pillar) => (
                  <div
                    key={pillar.label}
                    className="flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-4 py-2.5"
                  >
                    <pillar.icon className="h-4 w-4 shrink-0 text-primary-400" aria-hidden />
                    <span className="text-sm font-medium text-white/85">{pillar.label}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <CTAButton href="/platform/features" variant="ghost" size="lg">
                  Explore the Platform
                </CTAButton>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
