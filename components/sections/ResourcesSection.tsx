"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import CTAButton from "@/components/ui/CTAButton";
import { resourceItems } from "@/lib/resources-data";

export default function ResourcesSection() {
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="container-page">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading eyebrow="Resource Center" title="Insights, guides and case studies" className="max-w-2xl" />
          <CTAButton href="/resources" variant="text">
            View all resources
          </CTAButton>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {resourceItems.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.06 }}
            >
              <Link
                href={item.href}
                className="focus-ring group flex h-full flex-col rounded-2xl border border-ink-900/8 p-6 transition-all hover:-translate-y-1 hover:border-primary-200 hover:shadow-lg"
              >
                <span className="inline-flex w-fit rounded-full bg-primary-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary-600">
                  {item.category}
                </span>
                <h3 className="mt-4 text-sm font-bold text-ink-900">{item.title}</h3>
                <p className="mt-2 flex-1 text-xs leading-relaxed text-ink-600">{item.excerpt}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-ink-400">
                  <span>{item.readTime}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-primary-500 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
