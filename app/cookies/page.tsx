import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import LegalContent from "@/components/templates/LegalContent";
import CookieSettingsButton from "@/components/layout/CookieSettingsButton";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "How CoreDefense uses cookies, and how to manage your preferences.",
};

export default function CookiesPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Cookie Policy"
        description="How we use cookies on this website, and how you can control them."
        breadcrumbs={[{ label: "Cookie Policy", href: "/cookies" }]}
      />
      <LegalContent
        sections={[
          {
            heading: "Necessary cookies",
            body: "Required for the site to function correctly, such as remembering your cookie preferences. These cannot be disabled.",
          },
          {
            heading: "Analytics cookies",
            body: "Help us understand how visitors use the site, so we can improve navigation, content and performance.",
          },
          {
            heading: "Marketing cookies",
            body: "Used to measure and improve the relevance of our communications and campaigns.",
          },
          {
            heading: "Preference cookies",
            body: "Remember choices you make on the site, such as previously viewed content.",
          },
        ]}
      />
      <div className="border-t border-ink-900/8 bg-surface py-14 text-center">
        <p className="text-sm text-ink-600">You can update your cookie preferences at any time.</p>
        <div className="mt-4 flex justify-center">
          <CookieSettingsButton />
        </div>
      </div>
    </>
  );
}
