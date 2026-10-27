"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import CTAButton from "@/components/ui/CTAButton";
import TrialModal from "@/components/forms/TrialModal";
import Image from "next/image";
import JsonLd, { breadcrumbSchema } from "@/components/seo/JsonLd";

interface Crumb {
  label: string;
  href: string;
}

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  breadcrumbs?: Crumb[];
  /** Pages get no hero button unless they have a specific next step to offer. */
  primaryCta?: "request-access";
  primaryLabel?: string;
  primaryHref?: string;
  image?: string;
}

export default function PageHero({
  eyebrow,
  title,
  description,
  breadcrumbs = [],
  primaryCta,
  primaryLabel,
  primaryHref,
  image,
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-ink-900 pb-20 pt-14 sm:pb-24 sm:pt-20">
      {breadcrumbs.length > 0 && <JsonLd data={breadcrumbSchema(breadcrumbs)} />}
      <div className="absolute inset-0 bg-grid-dark opacity-40" aria-hidden />
      <div className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-primary-500/20 blur-[110px]" aria-hidden />

      <div className={image ? "container-page relative grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center" : "container-page relative"}>
        <div>
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
        {(primaryHref || primaryCta) && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-8 flex flex-wrap gap-4"
        >
          {primaryHref ? (
            <CTAButton href={primaryHref} size="lg">
              {primaryLabel ?? "Learn more"}
            </CTAButton>
          ) : (
            <TrialModal trigger={<CTAButton size="lg">{primaryLabel ?? "Request Early Access"}</CTAButton>} />
          )}
        </motion.div>
        )}
        </div>
        {image && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-primary-900/40"
          >
            <Image src={image} alt="" width={0} height={0} priority sizes="(min-width: 1024px) 40vw, 100vw" className="h-auto w-full" />
          </motion.div>
        )}
      </div>
    </section>
  );
}
