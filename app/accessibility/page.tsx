import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import LegalContent from "@/components/templates/LegalContent";

export const metadata: Metadata = {
  title: "Accessibility",
  description: "CoreDefense's commitment to web accessibility.",
};

export default function AccessibilityPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Accessibility"
        description="Our commitment to making this website usable by everyone."
        breadcrumbs={[{ label: "Accessibility", href: "/accessibility" }]}
      />
      <LegalContent
        sections={[
          {
            heading: "Our commitment",
            body: "We aim to meet WCAG 2.2 AA standards across this website, including keyboard navigation, semantic HTML, accessible forms and focus states, and support for reduced motion preferences.",
          },
          {
            heading: "Ongoing work",
            body: "Accessibility is an ongoing effort. We test key journeys — navigation, search, forms and modals — for keyboard and screen reader support, and continue to improve as the site evolves.",
          },
          {
            heading: "Reduced motion",
            body: "If your device is set to reduce motion, animations across this site are automatically minimised.",
          },
          {
            heading: "Get in touch",
            body: "If you encounter an accessibility barrier on this site, please let us know at hello@coredefense.co.uk so we can address it.",
          },
        ]}
      />
    </>
  );
}
