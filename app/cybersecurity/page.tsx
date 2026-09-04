import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import CyberCapabilities from "@/components/sections/CyberCapabilities";
import PlatformPreview from "@/components/sections/PlatformPreview";
import SIEMVision from "@/components/sections/SIEMVision";
import SecurityProcess from "@/components/sections/SecurityProcess";
import FAQSection from "@/components/sections/FAQSection";
import ConsultationCTA from "@/components/sections/ConsultationCTA";

export const metadata: Metadata = {
  title: "Cybersecurity",
  description:
    "AI-powered, compliance-ready cybersecurity services from CoreDefense — vulnerability management, cloud & DevOps security, IT/OT security, compliance and more.",
};

export default function CybersecurityPage() {
  return (
    <>
      <PageHero
        eyebrow="Cybersecurity"
        title="Intelligent cybersecurity for IT, cloud and OT"
        description="CoreDefense delivers AI-powered, compliance-ready cybersecurity that identifies, prioritises and remediates threats faster — across your entire environment."
        breadcrumbs={[{ label: "Cybersecurity", href: "/cybersecurity" }]}
      />
      <CyberCapabilities />
      <SecurityProcess />
      <PlatformPreview />
      <SIEMVision />
      <FAQSection compact />
      <ConsultationCTA />
    </>
  );
}
