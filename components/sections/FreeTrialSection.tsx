"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import CTAButton from "@/components/ui/CTAButton";
import TrialModal from "@/components/forms/TrialModal";

const included = [
  "Guided walkthrough of your security posture",
  "Access requests reviewed by our security team",
  "No live platform access required to get started",
];

export default function FreeTrialSection() {
  return (
    <section className="relative overflow-hidden bg-primary-600 py-24 sm:py-28">
      <div className="absolute inset-0 bg-grid-dark opacity-20" aria-hidden />
      <div className="pointer-events-none absolute -right-20 top-0 h-72 w-72 rounded-full bg-white/10 blur-[100px]" aria-hidden />

      <div className="container-page relative grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <div>
          <SectionHeading dark eyebrow="Get Started" title="Start your CoreDefense journey" description="Request access to explore CoreDefense's cybersecurity capabilities. Our platform is in active development. This starts a conversation with our team, not an instant login." />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-2xl bg-white p-8 shadow-2xl"
        >
          <ul className="space-y-3">
            {included.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-ink-700">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <TrialModal trigger={<CTAButton size="lg" className="w-full justify-center">Request Early Access</CTAButton>} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
