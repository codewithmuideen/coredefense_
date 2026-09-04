"use client";

import { motion } from "framer-motion";
import CTAButton from "@/components/ui/CTAButton";
import BookingModal from "@/components/forms/BookingModal";

export default function ConsultationCTA() {
  return (
    <section className="bg-white py-20">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-6 rounded-2xl border border-ink-900/8 bg-surface-near px-6 py-14 text-center sm:px-16"
        >
          <h2 className="text-balance text-2xl font-bold text-ink-900 sm:text-3xl">
            Let&apos;s build a more secure, intelligent business.
          </h2>
          <p className="max-w-xl text-sm text-ink-600 sm:text-base">
            Speak with CoreDefense about cybersecurity, transformation, digital engineering or AI &amp; automation.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <BookingModal trigger={<CTAButton size="lg">Book a Consultation</CTAButton>} />
            <CTAButton href="/contact" variant="secondary" size="lg">
              Talk to CoreDefense
            </CTAButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
