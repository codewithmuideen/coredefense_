import type { Metadata } from "next";
import { Puzzle, Plug, ListChecks, LockKeyhole, MapPinned, KeyRound } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import OverviewGroups, { type OverviewGroup } from "@/components/templates/OverviewGroups";

export const metadata: Metadata = {
  alternates: { canonical: "/platform" },
  title: "Platform",
  description:
    "An overview of the CoreDefense cybersecurity platform: features, integrations, use cases, trust and compliance mapping.",
};

const groups: OverviewGroup[] = [
  {
    heading: "The CoreDefense Platform",
    href: "/platform/features",
    description:
      "One console for your security posture, from discovery to remediation. The platform is in active development; these pages describe where it's heading.",
    image: "/images/photos/hexagonal_firewall_shield_icon_FINAL.png",
    ctaLabel: "See the feature roadmap",
    items: [
      {
        label: "Features",
        href: "/platform/features",
        description: "Unified asset view, AI-assisted triage, risk scoring and remediation tracking on the roadmap.",
        icon: Puzzle,
      },
      {
        label: "Integrations Ecosystem",
        href: "/platform/integrations",
        description: "Designed to plug into the scanners, cloud providers and ticketing tools you already run.",
        icon: Plug,
      },
      {
        label: "Use Cases",
        href: "/platform/use-cases",
        description: "Illustrative scenarios showing how teams typically apply CoreDefense capabilities.",
        icon: ListChecks,
      },
      {
        label: "Request Early Access",
        href: "/request-access",
        description: "Register interest and we'll talk to you about onboarding as the platform matures.",
        icon: KeyRound,
      },
    ],
  },
  {
    heading: "Trust & Compliance",
    href: "/platform/trust-center",
    description:
      "How we handle your data, how we engineer securely and how findings line up against the frameworks auditors ask about.",
    image: "/images/photos/shield_protecting_credit_card_FINAL.png",
    ctaLabel: "Visit the Trust Center",
    items: [
      {
        label: "Security Trust Center",
        href: "/platform/trust-center",
        description: "What we promise about your data, and how to report a vulnerability to us.",
        icon: LockKeyhole,
      },
      {
        label: "Compliance Mapping",
        href: "/platform/compliance-mapping",
        description: "One evidence trail that serves several auditors at once.",
        icon: MapPinned,
      },
    ],
  },
];

export default function PlatformPage() {
  return (
    <>
      <PageHero
        eyebrow="Platform"
        title="The CoreDefense platform, at a glance"
        description="Everything about the platform we're building in one place: what it will do, how it connects to your stack, and how we keep it trustworthy."
        breadcrumbs={[{ label: "Platform", href: "/platform" }]}
        primaryCta="request-access"
      />
      <OverviewGroups groups={groups} />
    </>
  );
}
