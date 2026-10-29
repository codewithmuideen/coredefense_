import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  alternates: { canonical: "/platform/integrations" },
  title: "Integrations Ecosystem",
  description: "How the CoreDefense platform is being designed to fit into your existing tools and workflows.",
};

const hubTools = [
  { name: "ServiceNow", kind: "ITSM" },
  { name: "Jira", kind: "Ticketing" },
  { name: "Slack", kind: "Chat" },
  { name: "AWS", kind: "Cloud" },
  { name: "Azure", kind: "Cloud" },
  { name: "Teams", kind: "Chat" },
  { name: "Google Cloud", kind: "Cloud" },
  { name: "Entra ID", kind: "Identity" },
];

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
        breadcrumbs={[{ label: "Platform", href: "/platform" }, { label: "Integrations Ecosystem", href: "/platform/integrations" }]}
      />

      <section className="bg-white py-20 sm:py-28">
        <div className="container-page grid gap-14 lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-ink-900 p-6">
            <div className="absolute inset-0 bg-grid-dark opacity-30" aria-hidden />
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
              {hubTools.map((_, i) => {
                const col = i < 3 ? i : i < 5 ? (i === 3 ? 0 : 2) : i - 5;
                const row = i < 3 ? 0 : i < 5 ? 1 : 2;
                return (
                  <line key={i} x1={50} y1={50} x2={16.7 + col * 33.3} y2={16.7 + row * 33.3} stroke="#528BFF" strokeOpacity={0.45} strokeWidth={0.4} strokeDasharray="1.5 1.5">
                    <animate attributeName="stroke-dashoffset" from="6" to="0" dur="1.6s" repeatCount="indefinite" />
                  </line>
                );
              })}
            </svg>
            <div className="relative grid h-full grid-cols-3 grid-rows-3 gap-3">
              {[...hubTools.slice(0, 4), null, ...hubTools.slice(4)].map((tool, i) =>
                tool ? (
                  <div key={tool.name} className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-ink-800/90 p-2 text-center backdrop-blur">
                    <span className="text-xs font-bold text-white sm:text-sm">{tool.name}</span>
                    <span className="mt-0.5 text-[10px] text-white/45">{tool.kind}</span>
                  </div>
                ) : (
                  <div key={i} className="flex items-center justify-center rounded-2xl bg-primary-500 text-center shadow-[0_0_40px_rgba(30,106,255,0.55)]">
                    <span className="text-xs font-bold text-white sm:text-sm">CoreDefense</span>
                  </div>
                )
              )}
            </div>
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
    </>
  );
}
