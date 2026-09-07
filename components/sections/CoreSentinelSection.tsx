"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ShieldCheck, BarChart3, Settings2, Users } from "lucide-react";
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
          <div className="pointer-events-none absolute -left-24 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-primary-500/15 blur-[120px]" aria-hidden />

          <div className="relative grid gap-12 p-8 sm:p-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:p-16">
            <div>
              <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary-400">
                <span className="h-px w-6 bg-primary-400" />
                The CoreDefense Ecosystem
              </p>
              <h2 className="text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Meet <span className="text-primary-400">Core Sentinel</span>
              </h2>
              <p className="mt-3 text-lg font-medium text-white/80">
                The visual guardian of the CoreDefense ecosystem.
              </p>
              <p className="mt-4 max-w-lg text-balance text-base leading-relaxed text-white/60">
                Core Sentinel represents how security intelligence, business context, automation and human
                expertise work together to turn complex risk into clear action.
              </p>

              {/* Character — mobile only, sits beneath the copy per spec */}
              <div className="relative mx-auto -mt-2 mb-6 h-[420px] w-[280px] lg:hidden">
                <div className="absolute inset-0 flex items-center justify-center" aria-hidden>
                  <Image
                    src="/images/brand/logo-white.png"
                    alt=""
                    width={200}
                    height={28}
                    className="h-auto w-40 rotate-90 opacity-[0.07]"
                  />
                </div>
                <Image
                  src="/images/photos/core-sentinel-cutout.png"
                  alt="Core Sentinel, the CoreDefense brand guardian"
                  fill
                  sizes="280px"
                  className="object-contain object-bottom"
                  priority
                />
              </div>

              <div className="grid grid-cols-2 gap-3 sm:max-w-md">
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

            {/* Character — desktop, standing beside the copy */}
            <div className="relative hidden h-[560px] lg:block">
              <div className="absolute inset-0 flex items-center justify-end pr-8" aria-hidden>
                <Image
                  src="/images/brand/logo-white.png"
                  alt=""
                  width={420}
                  height={58}
                  className="h-auto w-[420px] rotate-90 opacity-[0.06]"
                />
              </div>
              <Image
                src="/images/photos/core-sentinel-cutout.png"
                alt="Core Sentinel, the CoreDefense brand guardian"
                fill
                sizes="(min-width: 1024px) 45vw, 0px"
                className="object-contain object-bottom"
                priority
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
