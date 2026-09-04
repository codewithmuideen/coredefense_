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

          <div className="grid gap-px bg-white/5 p-px sm:grid-cols-[1.4fr_1fr]">
            <div className="bg-ink-800 p-6">
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/40">Threats Resolved (30 days)</p>
              <div className="flex h-32 items-end gap-2">
                {[38, 52, 41, 63, 58, 71, 66, 80, 74, 91, 85, 96].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${h}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.03, ease: [0.16, 1, 0.3, 1] }}
                    className="flex-1 rounded-t bg-gradient-to-t from-primary-600 to-primary-400"
                  />
                ))}
              </div>
            </div>
            <div className="bg-ink-800 p-6">
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/40">Remediation Progress</p>
              <div className="flex items-center justify-center py-2">
                <div
                  className="relative flex h-28 w-28 items-center justify-center rounded-full"
                  style={{
                    background: "conic-gradient(#1E6AFF 0% 78%, rgba(255,255,255,0.08) 78% 100%)",
                  }}
                >
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-ink-800">
                    <span className="text-lg font-bold text-white">78%</span>
                  </div>
                </div>
              </div>
              <p className="text-center text-xs text-white/50">1,248 threats resolved this quarter</p>
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
