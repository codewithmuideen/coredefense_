import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import OverviewGroups, { type OverviewGroup } from "@/components/templates/OverviewGroups";
import { serviceDetails } from "@/lib/service-detail-data";
import { cyberCapabilities } from "@/lib/capabilities-data";
import { practices } from "@/lib/practices-data";

export const metadata: Metadata = {
  alternates: { canonical: "/solutions" },
  title: "Solutions",
  description:
    "Browse every CoreDefense service by practice and go straight to the one that matches your problem.",
};

const groupImages: Record<string, string> = {
  "/cybersecurity": "/images/photos/cybersecurity_shield_icon_FINAL.png",
  "/business-transformation": "/images/photos/network_security_globe_FINAL.png",
  "/digital-engineering": "/images/photos/ethical_hacking_laptop_icon_FINAL.png",
  "/ai-automation": "/images/photos/threat_radar_icon_FINAL.png",
};

const ctaLabels: Record<string, string> = {
  "/cybersecurity": "Explore cybersecurity",
  "/business-transformation": "Explore business transformation",
  "/digital-engineering": "Explore digital engineering",
  "/ai-automation": "Explore AI & automation",
};

const cyberIcons = Object.fromEntries(cyberCapabilities.map((c) => [c.slug, c.icon]));

const groups: OverviewGroup[] = practices.map((practice) => ({
  number: practice.number,
  heading: practice.title,
  href: practice.slug,
  description: practice.summary,
  image: groupImages[practice.slug],
  ctaLabel: ctaLabels[practice.slug],
  items: Object.values(serviceDetails)
    .filter((s) => s.categoryHref === practice.slug)
    .map((s) => ({
      label: s.title,
      href: s.slug,
      icon: s.icon ?? cyberIcons[s.slug],
    })),
}));

export default function SolutionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Solutions"
        title="Every CoreDefense solution, in one place"
        description="Sixteen services across security, process, engineering and AI, grouped so you can find the right starting point fast."
        breadcrumbs={[{ label: "Solutions", href: "/solutions" }]}
      />
      <OverviewGroups groups={groups} />
    </>
  );
}
