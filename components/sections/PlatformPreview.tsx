"use client";

import { motion } from "framer-motion";
import { ShieldCheck, TriangleAlert, Activity, Server } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import CTAButton from "@/components/ui/CTAButton";

const tiles = [
  { label: "Risk Score", value: "24", tone: "Low", icon: ShieldCheck },
  { label: "Critical Assets", value: "18", tone: "Monitored", icon: Server },
  { label: "Open Vulnerabilities", value: "127", tone: "8 critical", icon: TriangleAlert },
  { label: "Compliance", value: "94%", tone: "ISO / NIST", icon: Activity },
];

const sources = [
  "Cloud & DevOps",
  "Vulnerability Management",
  "IT/OT Security",
  "Compliance & Governance",
  "AI Threat Triage",
];

export default function PlatformPreview() {
  return (
    <section className="relative overflow-hidden bg-ink-900 py-24 sm:py-32">
      <div className="absolute inset-0 bg-grid-dark opacity-40" aria-hidden />
      <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-[900px] -translate-x-1/2 rounded-full bg-primary-500/10 blur-[140px]" aria-hidden />

      <div className="container-page relative">
        <SectionHeading
          dark
          eyebrow="Platform Preview"
          title="A single view of your security posture — coming to CoreDefense"
          description="This is a concept preview of the CoreDefense platform, currently in development. The data shown is illustrative, not live telemetry."
          align="center"
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto mt-16 max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-ink-800 shadow-2xl"
        >
          <div className="flex items-center gap-2 border-b border-white/10 bg-ink-900/60 px-5 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-primary-400/70" />
            <span className="ml-3 text-xs font-medium text-white/40">app.coredefense.co.uk — Security Overview (concept)</span>
          </div>

          <div className="grid gap-px bg-white/5 sm:grid-cols-2 lg:grid-cols-4">
            {tiles.map((tile) => (
              <div key={tile.label} className="bg-ink-800 p-5">
                <div className="flex items-center justify-between">
                  <tile.icon className="h-4 w-4 text-primary-400" />
                  <span className="text-[10px] font-medium uppercase tracking-widest text-white/30">{tile.tone}</span>
                </div>
                <p className="mt-4 text-2xl font-bold text-white">{tile.value}</p>
                <p className="mt-1 text-xs text-white/50">{tile.label}</p>
              </div>
            ))}
          </div>

          <div className="relative overflow-hidden bg-ink-800 px-6 py-12 sm:px-10">
            <div className="pointer-events-none absolute inset-0 opacity-[0.15]" style={{ backgroundImage: "radial-gradient(circle, rgba(82,139,255,0.6) 1px, transparent 1px)", backgroundSize: "26px 26px" }} aria-hidden />

            <div className="relative grid items-center gap-10 sm:grid-cols-[1fr_auto_1fr] sm:gap-4">
              <div className="space-y-3.5">
                {sources.map((s, i) => (
                  <motion.div
                    key={s}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.06 }}
                    className="flex items-center gap-3"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary-400 shadow-[0_0_8px_2px_rgba(82,139,255,0.6)]" />
                    <span className="whitespace-nowrap text-xs font-medium text-white/60 sm:text-sm">{s}</span>
                    <span className="hidden h-px flex-1 bg-gradient-to-r from-primary-400/50 to-transparent sm:block" />
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="relative mx-auto flex h-52 w-52 shrink-0 items-center justify-center"
              >
                <div className="absolute inset-0 rounded-full bg-primary-500/25 blur-[50px]" aria-hidden />
                {[0, 1, 2].map((ring) => (
                  <div
                    key={ring}
                    className="absolute rounded-full border border-primary-400/20"
                    style={{ inset: `${ring * 18}px` }}
                    aria-hidden
                  />
                ))}
                <div className="absolute inset-6 rounded-full border border-primary-400/40" aria-hidden />
                <div className="relative text-center">
                  <p className="text-3xl font-bold text-white">1,248</p>
                  <p className="mt-1 text-[11px] uppercase tracking-widest text-white/50">Threats Resolved</p>
                  <p className="text-[11px] uppercase tracking-widest text-white/50">This Quarter</p>
                </div>
              </motion.div>

              <div className="space-y-3">
                <motion.div
                  initial={{ opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="flex items-center justify-between gap-3 rounded-xl border border-red-400/20 bg-red-500/[0.06] px-4 py-3"
                >
                  <div>
                    <p className="text-lg font-bold text-white">62</p>
                    <p className="text-[11px] text-white/50">Critical, Active</p>
                  </div>
                  <span className="h-2 w-2 rounded-full bg-red-400 shadow-[0_0_8px_2px_rgba(248,113,113,0.6)]" aria-hidden />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.18 }}
                  className="flex items-center justify-between gap-3 rounded-xl border border-primary-400/20 bg-primary-500/[0.06] px-4 py-3"
                >
                  <div>
                    <p className="text-lg font-bold text-white">318</p>
                    <p className="text-[11px] text-white/50">Resolved, This Month</p>
                  </div>
                  <span className="h-2 w-2 rounded-full bg-primary-400 shadow-[0_0_8px_2px_rgba(82,139,255,0.6)]" aria-hidden />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-10 flex justify-center">
          <CTAButton href="/platform/features" variant="secondary" className="!text-white">
            Explore platform features
          </CTAButton>
        </div>
      </div>
    </section>
  );
}
