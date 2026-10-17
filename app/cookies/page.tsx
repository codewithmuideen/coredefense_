import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import LegalContent from "@/components/templates/LegalContent";
import CookieSettingsButton from "@/components/layout/CookieSettingsButton";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "How CoreDefense uses cookies and similar technologies, and how to manage your preferences.",
};

export default function CookiesPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Cookie Policy"
        description="What we store in your browser when you visit www.coredefense.co.uk, why, and how you stay in control."
        breadcrumbs={[{ label: "Cookie Policy", href: "/cookies" }]}
        showActions={false}
      />
      <LegalContent
        updated="October 2026"
        sections={[
          {
            heading: "What cookies are",
            body: [
              "Cookies are small text files a website places on your device. Similar technologies, such as your browser's local storage, work in much the same way. In this policy we refer to all of them as \"cookies\".",
              "They let a site remember things between pages and visits, for example that you've already answered the cookie banner.",
            ],
          },
          {
            heading: "Cookies we use today",
            body: "This website currently stores only the items below. Both are kept in your browser's local storage, never leave your device, and aren't used to track you across other sites.",
            table: {
              headers: ["Name", "Category", "Purpose", "Duration"],
              rows: [
                ["coredefense_cookie_consent", "Necessary", "Remembers your cookie choices so we don't ask on every page.", "Until you clear it"],
                ["coredefense_recent_searches", "Preference", "Remembers your recent site searches for quick access.", "Until you clear it"],
              ],
            },
          },
          {
            heading: "Cookie categories",
            body: "Our consent settings are grouped into four categories. Anything outside \"Necessary\" only runs if you switch it on.",
            list: [
              "Necessary: required for the site to work, such as storing your consent choice. Always on.",
              "Analytics: would help us understand how visitors use the site. No analytics tools are currently installed.",
              "Marketing: would measure the relevance of our communications. No marketing cookies are currently set.",
              "Preference: remember choices you make, such as recent searches.",
            ],
          },
          {
            heading: "Third-party content",
            body: "Our blog shows headlines and images from external news publishers. When you click a story you leave our site and that publisher's own cookie policy applies. Thumbnail images are requested without sending our page address to the publisher.",
          },
          {
            heading: "Managing your preferences",
            body: [
              "You can change your choices at any time using the button below or the \"Cookie Settings\" link in the footer of every page.",
              "You can also clear or block cookies and local storage in your browser settings. If you block necessary storage, we'll ask for your cookie preferences again on each visit.",
            ],
          },
          {
            heading: "Changes to this policy",
            body: "If we add new tools that set cookies, we'll update the table above and ask for your consent again before they run.",
          },
        ]}
      >
        <div className="mt-12 rounded-2xl border border-ink-900/8 bg-surface p-6 text-center">
          <p className="text-sm text-ink-600">Review or change what you&apos;ve agreed to at any time.</p>
          <div className="mt-4 flex justify-center">
            <CookieSettingsButton />
          </div>
        </div>
      </LegalContent>
    </>
  );
}
