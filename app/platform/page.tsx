import type { Metadata } from "next";
import { Puzzle, Plug, ListChecks, LockKeyhole, MapPinned, KeyRound } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import OverviewGroups, { type OverviewGroup } from "@/components/templates/OverviewGroups";
import FreeTrialSection from "@/components/sections/FreeTrialSection";

export const metadata: Metadata = {
  title: "Platform",
  description:
    "An overview of the CoreDefense cybersecurity platform: features, integrations, use cases, trust and compliance mapping.",
};

const groups: OverviewGroup[] = [
  {
    heading: "The CoreDefense Platform",
    href: "/platform/features",
    description:
      "A single place to see assets, vulnerabilities and risk across IT, cloud and OT. The platform is in active development; these pages describe where it's heading.",
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
    image: "/images/photos/double_shield_icon_FINAL.png",
    ctaLabel: "Visit the Trust Center",
    items: [
      {
        label: "Security Trust Center",
        href: "/platform/trust-center",
        description: "Our approach to data handling, secure engineering and responsible disclosure.",
        icon: LockKeyhole,
      },
      {
        label: "Compliance Mapping",
        href: "/platform/compliance-mapping",
        description: "Mapping vulnerabilities and controls against ISO 27001, NIST, PCI DSS and GDPR.",
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
      <FreeTrialSection />
    </>
  );
}
