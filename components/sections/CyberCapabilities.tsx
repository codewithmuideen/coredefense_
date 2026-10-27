"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { cyberCapabilities } from "@/lib/capabilities-data";

export default function CyberCapabilities() {
  return (
    <section className="relative overflow-hidden bg-ink-900 py-24 sm:py-32">
      <div className="absolute inset-0 bg-grid-dark opacity-30" aria-hidden />
      <div className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-primary-500/15 blur-[120px]" aria-hidden />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-primary-400/10 blur-[120px]" aria-hidden />

      <div className="container-page relative">
        <SectionHeading
          dark
          eyebrow="Capabilities"
          title="Cybersecurity capabilities built for real environments"
          description="Start with a single service or combine several; findings from one feed straight into the next."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cyberCapabilities.map((cap, i) => (
            <motion.div
              key={cap.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.06 }}
              className="h-full"
            >
              <Link
                href={cap.slug}
                className="focus-ring group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary-400/40 hover:bg-white/[0.06]"
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ background: "radial-gradient(160px circle at 30% 0%, rgba(82,139,255,0.18), transparent 70%)" }}
                  aria-hidden
                />
                <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-primary-500/10 text-primary-400 ring-1 ring-inset ring-primary-400/20 transition-all duration-300 group-hover:bg-primary-500/20 group-hover:shadow-[0_0_18px_rgba(82,139,255,0.45)]">
                  <cap.icon className="h-5 w-5" />
                </div>
                <h3 className="relative mt-4 text-sm font-bold text-white">{cap.title}</h3>
                <p className="relative mt-2 flex-1 text-xs leading-relaxed text-white/55">{cap.description}</p>
                <span className="relative mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary-400">
                  Learn more
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
                <div className="pointer-events-none absolute inset-x-4 bottom-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-primary-400/60 to-transparent transition-transform duration-300 group-hover:scale-x-100" aria-hidden />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
