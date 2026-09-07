"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import CTAButton from "@/components/ui/CTAButton";
import TrialModal from "@/components/forms/TrialModal";
import BookingModal from "@/components/forms/BookingModal";

interface Crumb {
  label: string;
  href: string;
}

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  breadcrumbs?: Crumb[];
  primaryCta?: "consultation" | "request-access";
  primaryLabel?: string;
}

export default function PageHero({
  eyebrow,
  title,
  description,
  breadcrumbs = [],
  primaryCta = "consultation",
  primaryLabel,
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-ink-900 pb-20 pt-14 sm:pb-24 sm:pt-20">
      <div className="absolute inset-0 bg-grid-dark opacity-40" aria-hidden />
      <div className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-primary-500/20 blur-[110px]" aria-hidden />

      <div className="container-page relative">
        {breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-1.5 text-xs text-white/40">
            <Link href="/" className="hover:text-white/70">
              Home
            </Link>
            {breadcrumbs.map((crumb) => (
              <span key={crumb.href} className="flex items-center gap-1.5">
                <ChevronRight className="h-3 w-3" />
                <Link href={crumb.href} className="hover:text-white/70">
                  {crumb.label}
                </Link>
              </span>
            ))}
          </nav>
        )}

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary-400"
        >
          <span className="h-px w-6 bg-primary-400" />
          {eyebrow}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="max-w-3xl text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-5 max-w-2xl text-balance text-base leading-relaxed text-white/65 sm:text-lg"
        >
          {description}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-8 flex flex-wrap gap-4"
        >
          {primaryCta === "request-access" ? (
            <TrialModal trigger={<CTAButton size="lg">{primaryLabel ?? "Request Early Access"}</CTAButton>} />
          ) : (
            <BookingModal trigger={<CTAButton size="lg">{primaryLabel ?? "Book a Consultation"}</CTAButton>} />
          )}
          <CTAButton href="/platform/features" variant="ghost" size="lg" icon={false}>
            Explore Our Capabilities
          </CTAButton>
        </motion.div>
      </div>
    </section>
  );
}
