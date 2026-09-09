import type { Metadata } from "next";
import { Lock, ShieldCheck, FileText, Mail } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import ConsultationCTA from "@/components/sections/ConsultationCTA";

export const metadata: Metadata = {
  title: "Security Trust Center",
  description: "How CoreDefense approaches security, data handling and responsible disclosure.",
};

const commitments = [
  {
    icon: Lock,
    title: "Data handling",
    description: "Form submissions and enquiry data are handled via secure, server-side processing. We never expose API keys or credentials to the browser.",
  },
  {
    icon: ShieldCheck,
    title: "Security-first engineering",
    description: "Our own website and future platform are built with input validation, secure defaults and least-privilege access in mind.",
  },
  {
    icon: FileText,
    title: "Compliance alignment",
    description: "Our compliance & governance practice works to ISO 27001, NIST, PCI DSS and GDPR frameworks when supporting client engagements.",
  },
  {
    icon: Mail,
    title: "Responsible disclosure",
    description: "If you've identified a potential security issue with our site or services, please contact us directly so we can investigate promptly.",
  },
];

export default function TrustCenterPage() {
  return (
    <>
      <PageHero
        eyebrow="Platform"
        title="Security Trust Center"
        description="Security isn't just what CoreDefense sells. It's how we operate. Here's an overview of our approach to data handling, engineering and disclosure."
        breadcrumbs={[{ label: "Platform", href: "/platform/features" }, { label: "Security Trust Center", href: "/platform/trust-center" }]}
      />

      <section className="bg-white py-20 sm:py-28">
        <div className="container-page">
          <SectionHeading eyebrow="Our commitments" title="How we approach security and trust" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {commitments.map((c) => (
              <div key={c.title} className="flex gap-4 rounded-2xl border border-ink-900/8 bg-surface-near p-6">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                  <c.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-ink-900">{c.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{c.description}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-10 max-w-2xl text-sm text-ink-500">
            The CoreDefense cybersecurity platform is currently in development. Formal certifications and audit
            reports will be published here as they become available. We won&apos;t claim a certification we
            don&apos;t hold.
          </p>
        </div>
      </section>

      <ConsultationCTA />
    </>
  );
}
