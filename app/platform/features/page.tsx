import type { Metadata } from "next";
import { ShieldCheck, Radar, BrainCircuit, FileCheck2, Activity, Server } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import PlatformPreview from "@/components/sections/PlatformPreview";
import ConsultationCTA from "@/components/sections/ConsultationCTA";

export const metadata: Metadata = {
  title: "Platform Features",
  description: "A preview of the features planned for the CoreDefense cybersecurity platform, currently in development.",
};

const features = [
  { icon: Radar, title: "Unified Asset & Vulnerability View", description: "A single view of assets and vulnerabilities across IT, cloud and OT." },
  { icon: BrainCircuit, title: "AI-Assisted Triage", description: "AI models to help prioritise and investigate security events faster." },
  { icon: FileCheck2, title: "Compliance Mapping", description: "Controls and findings mapped against ISO, NIST, PCI DSS and GDPR." },
  { icon: ShieldCheck, title: "Risk Scoring", description: "Business-contextualised risk scoring, not just raw severity ratings." },
  { icon: Activity, title: "Remediation Tracking", description: "Workflow automation to move findings from discovery to resolution." },
  { icon: Server, title: "IT/OT Visibility", description: "Extending visibility into operational technology environments." },
];

export default function PlatformFeaturesPage() {
  return (
    <>
      <PageHero
        eyebrow="Platform"
        title="Platform features — in development"
        description="These are the capabilities we're building into the CoreDefense platform. It isn't live yet — this page describes our product direction, not a shipped feature list."
        breadcrumbs={[{ label: "Platform", href: "/platform/features" }, { label: "Features", href: "/platform/features" }]}
      />

      <section className="bg-white py-20 sm:py-28">
        <div className="container-page">
          <SectionHeading eyebrow="Roadmap" title="What we're building" />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="rounded-2xl border border-ink-900/8 bg-surface-near p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-sm font-bold text-ink-900">{f.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-ink-600">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PlatformPreview />
      <ConsultationCTA />
    </>
  );
}
