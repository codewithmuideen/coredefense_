"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { serviceDetails } from "@/lib/service-detail-data";

export default function ServiceGrid({ category }: { category: string }) {
  const items = Object.values(serviceDetails).filter((s) => s.category === category);

  return (
    <section className="bg-surface py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading eyebrow="Capabilities" title={`${category} services`} />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <motion.div
              key={item.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
            >
              <Link
                href={item.slug}
                className="focus-ring group flex h-full flex-col overflow-hidden rounded-2xl border border-ink-900/8 bg-white transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-36 w-full bg-surface-near">
                  {/* Icon tile rather than the service photo, which is reserved for the service's own page */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-500 to-ink-900">
                    <div className="absolute inset-0 bg-grid-dark opacity-30" aria-hidden />
                    {item.icon && (
                      <item.icon className="relative h-10 w-10 text-white/90 transition-transform duration-300 group-hover:scale-110" strokeWidth={1.25} />
                    )}
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-sm font-bold text-ink-900">{item.title}</h3>
                  <p className="mt-2 flex-1 text-xs leading-relaxed text-ink-600">{item.summary}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary-600">
                    Learn more
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
