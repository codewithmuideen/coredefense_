import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import ConsultationCTA from "@/components/sections/ConsultationCTA";

export const metadata: Metadata = {
  title: "Use Cases",
  description: "Illustrative use cases for how CoreDefense's cybersecurity and technology practices are typically applied.",
};

const useCases = [
  {
    title: "Prioritising vulnerabilities across a hybrid estate",
    scenario:
      "A mid-sized organisation with on-premise and cloud infrastructure needs to know which of its hundreds of open vulnerabilities to fix first.",
    approach: "CoreDefense combines scanning data with business context to rank remediation by real risk, not raw severity.",
  },
  {
    title: "Mapping controls ahead of an audit",
    scenario: "A finance team needs to demonstrate ISO 27001 and PCI DSS alignment ahead of an upcoming audit cycle.",
    approach: "Our compliance & governance practice maps existing controls and vulnerabilities against the relevant frameworks.",
  },
  {
    title: "Extending visibility into OT environments",
    scenario: "A manufacturer's security team has strong IT visibility but limited insight into production-floor systems.",
    approach: "CoreDefense's IT/OT security capability builds a shared risk view across both environments.",
  },
  {
    title: "Automating a manual approvals process",
    scenario: "A business process relies on manual email approvals that slow down delivery and create audit gaps.",
    approach: "We map the process, then design and implement a workflow automation that preserves control while cutting delay.",
  },
];

export default function UseCasesPage() {
  return (
    <>
      <PageHero
        eyebrow="Platform"
        title="Use cases"
        description="These are illustrative examples of how organisations typically apply CoreDefense's capabilities, not specific client case studies."
        breadcrumbs={[{ label: "Platform", href: "/platform" }, { label: "Use Cases", href: "/platform/use-cases" }]}
      />

      <section className="bg-white py-20 sm:py-28">
        <div className="container-page">
          <SectionHeading eyebrow="Illustrative scenarios" title="Where CoreDefense typically helps" />
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {useCases.map((uc) => (
              <div key={uc.title} className="rounded-2xl border border-ink-900/8 bg-surface-near p-7">
                <h3 className="text-base font-bold text-ink-900">{uc.title}</h3>
                <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-ink-400">Scenario</p>
                <p className="mt-1 text-sm text-ink-600">{uc.scenario}</p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-ink-400">Approach</p>
                <p className="mt-1 text-sm text-ink-600">{uc.approach}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ConsultationCTA />
    </>
  );
}
