"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ShieldCheck, Cpu, Workflow, Sparkles } from "lucide-react";
import CTAButton from "@/components/ui/CTAButton";

const badges = [
  { icon: ShieldCheck, label: "Cybersecurity" },
  { icon: Workflow, label: "Transformation" },
  { icon: Cpu, label: "Digital Engineering" },
  { icon: Sparkles, label: "AI & Automation" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink-900">
      <div className="absolute inset-0 bg-grid-dark" aria-hidden />
      <div className="absolute inset-x-0 top-0 h-[560px] radial-fade" aria-hidden>
        <Image
          src="/images/backgrounds/globe-network.png"
          alt=""
          fill
          priority
          className="object-cover object-top opacity-30"
        />
      </div>
      <div className="pointer-events-none absolute -left-32 top-24 h-96 w-96 rounded-full bg-primary-500/20 blur-[120px]" aria-hidden />
      <div className="pointer-events-none absolute -right-24 top-64 h-80 w-80 rounded-full bg-primary-400/10 blur-[100px]" aria-hidden />

      <div className="container-page relative grid gap-16 pb-24 pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pb-32 lg:pt-24">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white/70"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary-400 animate-glow" />
            UK Technology &amp; Cybersecurity Partner
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
            className="text-balance text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            Secure. Transform.
            <br />
            Engineer. <span className="text-primary-400">Automate.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="mt-6 max-w-xl text-balance text-lg leading-relaxed text-white/65"
          >
            Find the security gaps worth fixing, redesign the processes that hold you back, and ship software and AI
            your auditors can sign off. One senior UK team, start to finish.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <CTAButton href="/solutions" size="lg">
              Explore our services
            </CTAButton>
            <CTAButton href="/platform" variant="ghost" size="lg" icon={false}>
              See the platform
            </CTAButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-14 flex flex-wrap gap-x-8 gap-y-4"
          >
            {badges.map((b) => (
              <div key={b.label} className="flex items-center gap-2 text-sm font-medium text-white/50">
                <b.icon className="h-4 w-4 text-primary-400" />
                {b.label}
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="relative"
        >
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-2xl backdrop-blur">
            <video
              src="/video/hero-reel.mp4"
              autoPlay
              muted
              loop
              playsInline
              aria-hidden
              className="h-auto w-full"
            />
            {/* Caption and risk score sit below the video so none of the footage is covered */}
            <div className="flex flex-col gap-4 border-t border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary-400">Live risk visibility</p>
                <p className="mt-1 text-sm text-white/70">
                  Connected nodes, cloud infrastructure and endpoint signals, mapped in real time.
                </p>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="w-full shrink-0 rounded-xl border border-white/10 bg-ink-800/90 p-4 sm:w-44"
              >
                <p className="text-[11px] font-semibold uppercase tracking-widest text-white/40">Risk Score</p>
                <p className="mt-1 text-2xl font-bold text-white">
                  24 <span className="text-xs font-medium text-primary-400">Low</span>
                </p>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-1/4 rounded-full bg-primary-400" />
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
