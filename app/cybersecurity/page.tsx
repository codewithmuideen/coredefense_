import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import CyberStatsBar from "@/components/sections/CyberStatsBar";
import CyberCapabilities from "@/components/sections/CyberCapabilities";
import SIEMVision from "@/components/sections/SIEMVision";
import SecurityProcess from "@/components/sections/SecurityProcess";

export const metadata: Metadata = {
  alternates: { canonical: "/cybersecurity" },
  title: "Cybersecurity",
  description:
    "UK cybersecurity services for IT, cloud and OT: risk-ranked vulnerability management, assessments, ISO 27001 readiness, incident planning and staff training.",
};

export default function CybersecurityPage() {
  return (
    <>
      <PageHero
        eyebrow="Cybersecurity"
        title="Intelligent cybersecurity for IT, cloud and OT"
        description="Find your weaknesses, fix the ones that matter first, prove it to auditors and be ready for the day something goes wrong."
        image="/images/illustrations/cybersecurity-monolith-sculpture.jpg"
        breadcrumbs={[{ label: "Cybersecurity", href: "/cybersecurity" }]}
      />
      <CyberStatsBar />
      <CyberCapabilities />
      <SecurityProcess />
      <SIEMVision />
    </>
  );
}
