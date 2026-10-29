import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import LegalContent from "@/components/templates/LegalContent";

export const metadata: Metadata = {
  alternates: { canonical: "/terms" },
  title: "Terms of Use",
  description: "Terms of use for the CoreDefense website.",
};

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms of Use"
        description="The rules for using www.coredefense.co.uk. Please read them before using the site."
        breadcrumbs={[{ label: "Terms", href: "/terms" }]}
      />
      <LegalContent
        updated="October 2026"
        sections={[
          {
            heading: "Acceptance of terms",
            body: "By using www.coredefense.co.uk you agree to these terms. If you don't agree, please don't use the site.",
          },
          {
            heading: "The CoreDefense platform",
            body: "References to a CoreDefense cybersecurity platform describe capabilities in development. No live platform access, SIEM functionality or security telemetry is provided through this website unless explicitly stated. Dashboards and figures shown in platform previews are illustrative.",
          },
          {
            heading: "Blog and insight content",
            body: "Our daily blog briefs and insights are CoreDefense's own analysis of current security news, prepared with the help of AI and published for general information. Where a post draws on reporting by other publishers, those sources are credited and linked; their content remains theirs. The blog also shows headlines, short summaries and thumbnail images taken automatically from publishers' public RSS feeds; each item links to and remains the property of its publisher. Posts are not professional advice for your specific situation.",
          },
          {
            heading: "Use of content",
            body: "Content on this site, including text, graphics and logos, is owned by CoreDefense Limited unless otherwise stated. You may view it and share links to it, but not reproduce or redistribute it commercially without written permission.",
          },
          {
            heading: "Acceptable use",
            body: "When using this site you agree not to:",
            list: [
              "Attempt to gain unauthorised access to the site or its infrastructure.",
              "Scan, probe or test the site for vulnerabilities without our written permission. Responsible disclosures are welcome via our Trust Center.",
              "Submit false information or malicious content through our forms.",
              "Use automated tools to scrape the site in a way that degrades its performance.",
            ],
          },
          {
            heading: "No warranty",
            body: "This website is provided \"as is\". We take care to keep information accurate, but make no warranty as to its completeness or fitness for a particular purpose. Nothing on this site is professional security advice for your specific situation.",
          },
          {
            heading: "Limitation of liability",
            body: "To the extent permitted by law, CoreDefense Limited is not liable for any indirect or consequential loss arising from use of this website. Nothing in these terms limits liability that can't be limited by law.",
          },
          {
            heading: "Governing law",
            body: "These terms are governed by the laws of England and Wales, and the courts of England and Wales have exclusive jurisdiction.",
          },
        ]}
      />
    </>
  );
}
