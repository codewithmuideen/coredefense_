import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import LegalContent from "@/components/templates/LegalContent";

export const metadata: Metadata = {
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
        showActions={false}
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
            heading: "Third-party news content",
            body: "Our blog displays headlines, summaries and images from external publishers via their public RSS feeds. That content belongs to the respective publishers, links to their original articles, and doesn't necessarily reflect the views of CoreDefense.",
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
