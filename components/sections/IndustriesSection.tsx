"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { industries } from "@/lib/industries-data";

export default function IndustriesSection() {
  return (
    <section className="bg-surface py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading eyebrow="Industries" title="Sector-specific risk, mapped to your business" description="Every industry carries a different risk profile. We tailor cybersecurity and transformation work to yours." />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {industries.map((industry, i) => (
            <motion.div
              key={industry.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.06 }}
            >
              <Link
                href={industry.slug}
                className="focus-ring group relative block overflow-hidden rounded-2xl border border-ink-900/8 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <industry.icon className="h-6 w-6 text-primary-500 transition-transform group-hover:scale-110" />
                <h3 className="mt-4 text-sm font-bold text-ink-900">{industry.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-ink-600">{industry.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
