"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { cyberCapabilities } from "@/lib/capabilities-data";

export default function CyberCapabilities() {
  return (
    <section className="bg-surface py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading
          eyebrow="Capabilities"
          title="Cybersecurity capabilities built for real environments"
          description="Every capability is designed to work together — from first scan to remediation to audit-ready evidence."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cyberCapabilities.map((cap, i) => (
            <motion.div
              key={cap.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.06 }}
            >
              <Link
                href={cap.slug}
                className="focus-ring group flex h-full flex-col rounded-2xl border border-ink-900/8 bg-white p-6 transition-all hover:-translate-y-1 hover:border-primary-200 hover:shadow-lg"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-500 group-hover:text-white">
                  <cap.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-sm font-bold text-ink-900">{cap.title}</h3>
                <p className="mt-2 flex-1 text-xs leading-relaxed text-ink-600">{cap.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary-600">
                  Learn more
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
