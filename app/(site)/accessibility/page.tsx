import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import LegalContent from "@/components/templates/LegalContent";

export const metadata: Metadata = {
  alternates: { canonical: "/accessibility" },
  title: "Accessibility",
  description: "CoreDefense's commitment to making this website accessible to everyone.",
};

export default function AccessibilityPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Accessibility Statement"
        description="We want everyone to be able to use this website, whatever device, browser or assistive technology they rely on."
        breadcrumbs={[{ label: "Accessibility", href: "/accessibility" }]}
      />
      <LegalContent
        updated="October 2026"
        sections={[
          {
            heading: "Our commitment",
            body: "We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.2 at level AA across this website.",
          },
          {
            heading: "What we've built in",
            body: "Accessibility features you can expect across the site:",
            list: [
              "Keyboard navigation for menus, search, modals and forms.",
              "A \"Skip to main content\" link at the top of every page.",
              "Visible focus states on interactive elements.",
              "Semantic headings and landmarks for screen reader navigation.",
              "Labels on form fields and icon-only buttons.",
              "Responsive layouts that adapt to small screens and browser zoom.",
            ],
          },
          {
            heading: "Reduced motion",
            body: "If your device is set to reduce motion, we aim to keep animation across the site to a minimum.",
          },
          {
            heading: "Known limitations",
            body: "Some third-party content, such as images in our live news feed, comes from external publishers and may not include descriptive alternative text. Video on the site is decorative and has no audio.",
          },
          {
            heading: "Reporting a problem",
            body: "If you find an accessibility barrier, email info@coredefense.co.uk with the page address and a short description. We'll aim to fix it or provide the information in another format.",
          },
        ]}
      />
    </>
  );
}
