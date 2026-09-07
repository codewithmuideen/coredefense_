"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Radar, ShieldCheck, Workflow } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import CTAButton from "@/components/ui/CTAButton";

const pillars = [
  { icon: Radar, title: "See", description: "Full visibility of assets, vulnerabilities and exposure across IT, cloud and OT." },
  { icon: ShieldCheck, title: "Understand", description: "Risk contextualised against your business — not a generic severity score." },
  { icon: Workflow, title: "Strengthen", description: "Remediation, automation and governance that reduce risk over time." },
];

export default function CyberIntro() {
  return (
    <section id="cybersecurity" className="bg-white py-24 sm:py-32">
      <div className="container-page grid gap-14 lg:grid-cols-2 lg:items-center">
        <div>
          <SectionHeading
            eyebrow="Cybersecurity"
            title="See your risk. Understand your exposure. Strengthen your defence."
            description="CoreDefense delivers AI-powered, compliance-ready cybersecurity that identifies, prioritises and remediates vulnerabilities across IT, cloud, OT and compliance — backed by workflow automation that keeps remediation moving."
          />

          <div className="mt-10 space-y-6">
            {pillars.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex gap-4"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                  <pillar.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-ink-900">{pillar.title}</p>
                  <p className="mt-1 text-sm text-ink-600">{pillar.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-10">
            <CTAButton href="/cybersecurity" variant="secondary">
              Explore cybersecurity
            </CTAButton>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-ink-900">
            <Image src="/images/illustrations/network_security_globe_FINAL.png" alt="CoreDefense protecting connected infrastructure" fill className="object-cover" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
