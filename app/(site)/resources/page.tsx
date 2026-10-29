import type { Metadata } from "next";
import { Rss, Newspaper, BookOpenText, HelpCircle } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import OverviewGroups, { type OverviewGroup } from "@/components/templates/OverviewGroups";
import { resourceItems } from "@/lib/resources-data";

export const metadata: Metadata = {
  alternates: { canonical: "/resources" },
  title: "Resources",
  description: "Daily security headlines, CoreDefense analysis, practical guides and straight answers on cyber risk, process change, engineering and AI.",
};

const count = (category: string) => resourceItems.filter((r) => r.category === category).length;

const groups: OverviewGroup[] = [
  {
    heading: "Read & Learn",
    href: "/blog",
    description:
      "Headlines from the security press, our own take on what they mean, and longer reads to share with your team.",
    image: "/images/photos/secure_cloud_lock_icon_FINAL.png",
    ctaLabel: "Open the blog",
    items: [
      {
        label: "Blog",
        href: "/blog",
        description: "Live headlines with thumbnails from the major security newsrooms, alongside our own briefs.",
        icon: Rss,
      },
      {
        label: "Insights",
        href: "/resources/insights",
        description: `${count("Insight")} long-form pieces written by our practitioners.`,
        icon: Newspaper,
      },
      {
        label: "Guides",
        href: "/resources/guides",
        description: `${count("Guide")} checklists and walkthroughs you can apply this week.`,
        icon: BookOpenText,
      },
    ],
  },
  {
    heading: "Answers",
    href: "/faq",
    description: "What we do today, what's still on the roadmap and how to reach us.",
    image: "/images/photos/futuristic_neon_padlock_FINAL.png",
    ctaLabel: "Read the FAQ",
    items: [
      {
        label: "FAQ",
        href: "/faq",
        description: "Quick answers on scope, standards, timelines and the platform.",
        icon: HelpCircle,
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
    </>
  );
}
