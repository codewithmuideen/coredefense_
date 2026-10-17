"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Lightbulb, BookOpenText, FileBarChart2 } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import CTAButton from "@/components/ui/CTAButton";
import { resourceItems, type ResourceItem } from "@/lib/resources-data";

const categoryIcon: Record<ResourceItem["category"], typeof Lightbulb> = {
  Insight: Lightbulb,
  Guide: BookOpenText,
  "Case Study": FileBarChart2,
};

// Home-page teaser: the two newest insights and two newest guides.
const featuredResources = [
  ...resourceItems.filter((r) => r.category === "Insight").slice(0, 2),
  ...resourceItems.filter((r) => r.category === "Guide").slice(0, 2),
];

export default function ResourcesSection() {
  return (
    <section className="relative overflow-hidden bg-ink-900 py-24 sm:py-32">
      <div className="absolute inset-0 bg-grid-dark opacity-30" aria-hidden />
      <div className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-primary-500/15 blur-[120px]" aria-hidden />

      <div className="container-page relative">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading dark eyebrow="Resource Center" title="Insights, guides and case studies" className="max-w-2xl" />
          <CTAButton href="/resources" variant="ghost">
            View all resources
          </CTAButton>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featuredResources.map((item, i) => {
            const Icon = categoryIcon[item.category];
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: (i % 4) * 0.06 }}
                className="h-full"
              >
                <Link
                  href={item.href}
                  className="focus-ring group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary-400/40 hover:bg-white/[0.06]"
                >
                  <div
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ background: "radial-gradient(160px circle at 30% 0%, rgba(82,139,255,0.18), transparent 70%)" }}
                    aria-hidden
                  />
                  <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-primary-500/10 text-primary-400 ring-1 ring-inset ring-primary-400/20 transition-all duration-300 group-hover:bg-primary-500/20 group-hover:shadow-[0_0_18px_rgba(82,139,255,0.45)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="relative mt-4 inline-flex w-fit rounded-full bg-primary-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary-400 ring-1 ring-inset ring-primary-400/20">
                    {item.category}
                  </span>
                  <h3 className="relative mt-3 text-sm font-bold text-white">{item.title}</h3>
                  <p className="relative mt-2 flex-1 text-xs leading-relaxed text-white/55">{item.excerpt}</p>
                  <div className="relative mt-4 flex items-center justify-between text-xs text-white/40">
                    <span>{item.readTime}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-primary-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                  <div className="pointer-events-none absolute inset-x-4 bottom-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-primary-400/60 to-transparent transition-transform duration-300 group-hover:scale-x-100" aria-hidden />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
