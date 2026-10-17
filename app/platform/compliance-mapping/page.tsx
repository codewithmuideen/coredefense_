import type { Metadata } from "next";
import Image from "next/image";
import { Check } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import ConsultationCTA from "@/components/sections/ConsultationCTA";

export const metadata: Metadata = {
  title: "Compliance Mapping",
  description: "How CoreDefense maps vulnerabilities and controls against ISO, NIST, PCI DSS and GDPR.",
};

const frameworks = [
  { name: "ISO 27001", focus: "Information security management" },
  { name: "NIST", focus: "Cybersecurity risk framework" },
  { name: "PCI DSS", focus: "Payment card data security" },
  { name: "GDPR", focus: "Data protection & privacy" },
];

export default function ComplianceMappingPage() {
  return (
    <>
      <PageHero
        eyebrow="Platform"
        title="Compliance mapping"
        description="A practical approach to mapping your vulnerabilities and controls against the frameworks that matter to your business."
        breadcrumbs={[{ label: "Platform", href: "/platform" }, { label: "Compliance Mapping", href: "/platform/compliance-mapping" }]}
      />

      <section className="bg-white py-20 sm:py-28">
        <div className="container-page grid gap-14 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              title="Compliance as a by-product of good security, not a separate project"
              description="CoreDefense's compliance mapping connects findings from vulnerability management and security assessments directly to the frameworks you need to demonstrate against."
            />
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {frameworks.map((f) => (
                <div key={f.name} className="flex items-start gap-2.5 rounded-xl border border-ink-900/8 bg-surface-near p-4">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" />
                  <div>
                    <p className="text-sm font-bold text-ink-900">{f.name}</p>
                    <p className="text-xs text-ink-500">{f.focus}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-surface">
            <Image src="/images/illustrations/compliance-mapping.jpg" alt="Compliance mapping" fill className="object-cover" />
          </div>
        </div>
      </section>

      <ConsultationCTA />
    </>
  );
}
