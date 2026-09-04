"use client";

import { motion } from "framer-motion";
import CTAButton from "@/components/ui/CTAButton";
import TrialModal from "@/components/forms/TrialModal";
import BookingModal from "@/components/forms/BookingModal";

export default function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-ink-900 py-24 sm:py-32">
      <div className="absolute inset-0 bg-grid-dark opacity-40" aria-hidden />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-500/15 blur-[160px]" aria-hidden />

      <div className="container-page relative text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-2xl text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
        >
          Build with confidence.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-5 max-w-xl text-balance text-base text-white/60 sm:text-lg"
        >
          Secure your organisation. Transform your operations. Engineer better digital experiences. Automate what matters.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <TrialModal trigger={<CTAButton size="lg">Start Free Trial</CTAButton>} />
          <BookingModal
            trigger={
              <CTAButton variant="ghost" size="lg" icon={false}>
                Book a Consultation
              </CTAButton>
            }
          />
        </motion.div>
      </div>
    </section>
  );
}
