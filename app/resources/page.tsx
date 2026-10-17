import type { Metadata } from "next";
import { Rss, Newspaper, BookOpenText, FileBarChart2, HelpCircle, LockKeyhole } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import OverviewGroups, { type OverviewGroup } from "@/components/templates/OverviewGroups";
import ConsultationCTA from "@/components/sections/ConsultationCTA";
import { resourceItems } from "@/lib/resources-data";

export const metadata: Metadata = {
  title: "Resources",
  description: "News, insights, guides, case studies and answers from CoreDefense on cybersecurity, transformation, engineering and AI & automation.",
};

const count = (category: string) => resourceItems.filter((r) => r.category === category).length;

const groups: OverviewGroup[] = [
  {
    heading: "Read & Learn",
    href: "/blog",
    description:
      "Fresh analysis of the day's security news every morning, plus in-depth thinking on cybersecurity, transformation and AI.",
    image: "/images/photos/secure_cloud_lock_icon_FINAL.png",
    ctaLabel: "Open the live blog",
    items: [
      {
        label: "Blog",
        href: "/blog",
        description: "Daily CoreDefense briefs: our own analysis of the latest security news, with practical steps and credited sources.",
        icon: Rss,
      },
      {
        label: "Insights",
        href: "/resources/insights",
        description: `${count("Insight")} in-depth articles on IT/OT security, AI triage, ransomware, cloud risk, automation and security culture.`,
        icon: Newspaper,
      },
      {
        label: "Guides",
        href: "/resources/guides",
        description: `${count("Guide")} step-by-step guides on compliance mapping, PCI DSS v4.0, process discovery and incident response.`,
        icon: BookOpenText,
      },
      {
        label: "Case Studies",
        href: "/resources/case-studies",
        description: "Engagement write-ups across financial services, manufacturing and technology, in preparation.",
        icon: FileBarChart2,
      },
    ],
  },
  {
    heading: "Answers & Assurance",
    href: "/faq",
    description: "Straight answers about what CoreDefense does today, what's in development, and how we protect your data.",
    image: "/images/photos/futuristic_neon_padlock_FINAL.png",
    ctaLabel: "Read the FAQ",
    items: [
      {
        label: "FAQ",
        href: "/faq",
        description: "Common questions on services, the platform roadmap, pricing conversations and onboarding.",
        icon: HelpCircle,
      },
      {
        label: "Security Trust Center",
        href: "/platform/trust-center",
        description: "How we handle data, engineer securely and manage responsible disclosure.",
        icon: LockKeyhole,
      },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <>
      <PageHero
        eyebrow="Resource Center"
        title="Everything you need to stay informed"
        description="Live news, practical guides, our own insights and straight answers, all in one place."
        breadcrumbs={[{ label: "Resources", href: "/resources" }]}
      />
      <OverviewGroups groups={groups} />
      <ConsultationCTA />
    </>
  );
}
