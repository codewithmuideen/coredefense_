import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import LegalContent from "@/components/templates/LegalContent";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms of use for the CoreDefense website.",
};

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms of Use"
        description="Last updated: September 2026. Please read these terms before using this website."
        breadcrumbs={[{ label: "Terms", href: "/terms" }]}
      />
      <LegalContent
        sections={[
          {
            heading: "Acceptance of terms",
            body: "By using www.coredefense.co.uk, you agree to these terms. If you don't agree, please don't use the site.",
          },
          {
            heading: "The CoreDefense platform",
            body: "References to a CoreDefense cybersecurity platform on this website describe capabilities currently in development. No live platform access, SIEM functionality or security telemetry is provided through this website unless explicitly stated.",
          },
          {
            heading: "Use of content",
            body: "Content on this site is the property of CoreDefense Limited unless otherwise stated. You may not reproduce or redistribute it without permission.",
          },
          {
            heading: "No warranty",
            body: "This website is provided \"as is\". While we take care to keep information accurate, we make no warranty as to completeness or fitness for a particular purpose.",
          },
          {
            heading: "Limitation of liability",
            body: "CoreDefense Limited is not liable for any indirect or consequential loss arising from use of this website, to the extent permitted by law.",
          },
          {
            heading: "Governing law",
            body: "These terms are governed by the laws of England and Wales.",
          },
          {
            heading: "Contact",
            body: "Questions about these terms can be sent to hello@coredefense.co.uk.",
          },
        ]}
      />
    </>
  );
}
