import type { Metadata } from "next";
import { Plug } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import ConsultationCTA from "@/components/sections/ConsultationCTA";

export const metadata: Metadata = {
  title: "Integrations Ecosystem",
  description: "How the CoreDefense platform is being designed to fit into your existing tools and workflows.",
};

const ecosystem = [
  { name: "ITSM & Ticketing", examples: "ServiceNow, Jira" },
  { name: "Collaboration", examples: "Slack, Microsoft Teams" },
  { name: "Cloud Providers", examples: "AWS, Azure, Google Cloud" },
  { name: "Identity", examples: "SSO / SAML providers" },
];

export default function IntegrationsPage() {
  return (
    <>
      <PageHero
        eyebrow="Platform"
        title="Integrations ecosystem"
        description="CoreDefense is being designed to fit into the tools you already use, not replace them. Here's the integration ecosystem we're building toward."
        breadcrumbs={[{ label: "Platform", href: "/platform/features" }, { label: "Integrations Ecosystem", href: "/platform/integrations" }]}
      />

      <section className="bg-white py-20 sm:py-28">
        <div className="container-page grid gap-14 lg:grid-cols-2 lg:items-center">
          <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary-500 to-ink-900">
            <div className="absolute inset-0 bg-grid-dark opacity-20" aria-hidden />
            <Plug className="relative h-20 w-20 text-white/90" strokeWidth={1.25} />
          </div>
          <div>
            <SectionHeading
              title="Built to connect, not to silo"
              description="Security only works when it's part of how your teams already operate. Our roadmap prioritises integration with the systems your IT, security and operations teams rely on every day."
            />
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {ecosystem.map((e) => (
                <div key={e.name} className="rounded-xl border border-ink-900/8 bg-surface-near p-4">
                  <p className="text-sm font-bold text-ink-900">{e.name}</p>
                  <p className="mt-1 text-xs text-ink-500">{e.examples}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-xs text-ink-400">
              Integration availability will be confirmed as the platform nears release. Tell us which systems matter
              most to you via the contact form.
            </p>
          </div>
        </div>
      </section>

      <ConsultationCTA />
    </>
  );
}
