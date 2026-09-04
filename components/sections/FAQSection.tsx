"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { faqItems } from "@/lib/faq-data";
import { cn } from "@/lib/utils";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

export default function FAQSection({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState<number | null>(0);
  const items = compact ? faqItems.slice(0, 6) : faqItems;

  return (
    <section id="faq" className="bg-surface py-24 sm:py-32">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="container-page mx-auto max-w-3xl">
        <SectionHeading eyebrow="FAQ" title="Frequently asked questions" align="center" />

        <div className="mt-12 divide-y divide-ink-900/8 rounded-2xl border border-ink-900/8 bg-white">
          {items.map((item, i) => (
            <div key={item.question}>
              <button
                onClick={() => setOpen((cur) => (cur === i ? null : i))}
                className="focus-ring flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                aria-expanded={open === i}
              >
                <span className="text-sm font-semibold text-ink-900 sm:text-base">{item.question}</span>
                <ChevronDown className={cn("h-4 w-4 shrink-0 text-ink-400 transition-transform", open === i && "rotate-180 text-primary-500")} />
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 text-sm leading-relaxed text-ink-600">{item.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
