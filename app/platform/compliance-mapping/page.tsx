import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import ComplianceMatrix from "@/components/visuals/ComplianceMatrix";

export const metadata: Metadata = {
  alternates: { canonical: "/platform/compliance-mapping" },
  title: "Compliance Mapping",
  description:
    "How the CoreDefense platform links every finding to the ISO 27001, NIST CSF 2.0, PCI DSS, UK GDPR and Cyber Essentials controls it affects.",
};

const frameworks = [
  { name: "ISO/IEC 27001:2022", detail: "93 Annex A controls across organisational, people, physical and technological themes." },
  { name: "NIST CSF 2.0", detail: "Six functions, now including Govern, mapped down to category and subcategory." },
  { name: "PCI DSS v4.0.1", detail: "12 requirements, including the future-dated controls mandatory since March 2025." },
  { name: "UK GDPR", detail: "Article 32 security of processing and the Article 5 integrity and confidentiality principle." },
  { name: "Cyber Essentials", detail: "The five NCSC technical controls, from firewalls to security update management." },
];

const steps = [
  { title: "Ingest", description: "Scanner output, assessment findings and cloud posture checks land in one queue." },
  { title: "Map", description: "Each finding is tagged with every clause it touches, across all the frameworks you track." },
  { title: "Evidence", description: "Remediation tickets, screenshots and scan re-runs attach to the control as proof." },
  { title: "Report", description: "Export a per-framework view with coverage, gaps and owners, ready for the auditor." },
];

export default function ComplianceMappingPage() {
  return (
    <>
      <PageHero
        eyebrow="Platform"
        title="Compliance mapping"
        description="One finding, every framework. The platform traces each vulnerability to the exact clauses it affects, so fixing it once closes the gap everywhere."
        breadcrumbs={[{ label: "Platform", href: "/platform" }, { label: "Compliance Mapping", href: "/platform/compliance-mapping" }]}
      />

      <section className="bg-white py-20 sm:py-28">
        <div className="container-page grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <SectionHeading
              title="Stop maintaining five spreadsheets for one problem"
              description="Most teams track ISO, NIST, PCI and GDPR separately, so the same missing patch is logged, chased and evidenced several times over. Mapping at the finding level removes that duplication."
            />
            <div className="mt-8 space-y-3">
              {frameworks.map((f) => (
                <div key={f.name} className="rounded-xl border border-ink-900/8 bg-surface-near px-4 py-3">
                  <p className="text-sm font-bold text-ink-900">{f.name}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-ink-500">{f.detail}</p>
                </div>
              ))}
            </div>
          </div>
          <ComplianceMatrix />
        </div>
      </section>

      <section className="bg-surface py-20 sm:py-24">
        <div className="container-page">
          <SectionHeading eyebrow="How it works" title="From raw finding to audit evidence" align="center" />
          <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.title} className="relative rounded-2xl border border-ink-900/8 bg-white p-6">
                <span className="text-3xl font-bold text-primary-500/30">0{i + 1}</span>
                <h3 className="mt-2 font-bold text-ink-900">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{s.description}</p>
              </li>
            ))}
          </ol>
          <p className="mx-auto mt-10 max-w-2xl text-center text-xs text-ink-500">
            The platform is in development. If you need framework work done today, our{" "}
            <Link href="/cybersecurity/compliance-governance" className="font-semibold text-primary-600 hover:underline">
              Compliance &amp; Governance service
            </Link>{" "}
            delivers it as a consulting engagement.
          </p>
        </div>
      </section>
    </>
  );
}
