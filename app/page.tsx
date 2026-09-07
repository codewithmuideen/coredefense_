import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import TrustStats from "@/components/sections/TrustStats";
import Difference from "@/components/sections/Difference";
import CoreSentinelSection from "@/components/sections/CoreSentinelSection";
import CyberIntro from "@/components/sections/CyberIntro";
import CyberCapabilities from "@/components/sections/CyberCapabilities";
import PlatformPreview from "@/components/sections/PlatformPreview";
import SIEMVision from "@/components/sections/SIEMVision";
import SecurityProcess from "@/components/sections/SecurityProcess";
import BusinessTransformationSection from "@/components/sections/BusinessTransformationSection";
import DigitalEngineeringSection from "@/components/sections/DigitalEngineeringSection";
import AIAutomationSection from "@/components/sections/AIAutomationSection";
import AISecuritySection from "@/components/sections/AISecuritySection";
import IndustriesSection from "@/components/sections/IndustriesSection";
import ResourcesSection from "@/components/sections/ResourcesSection";
import CaseStudiesSection from "@/components/sections/CaseStudiesSection";
import FreeTrialSection from "@/components/sections/FreeTrialSection";
import ConsultationCTA from "@/components/sections/ConsultationCTA";
import FAQSection from "@/components/sections/FAQSection";
import FinalCTA from "@/components/sections/FinalCTA";

export const metadata: Metadata = {
  title: "CoreDefense | Cybersecurity, Transformation & AI for UK Enterprise",
  description:
    "CoreDefense combines AI-powered cybersecurity, business transformation, digital engineering and AI & automation into one connected technology partnership for UK enterprise.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStats />
      <Difference />
      <CoreSentinelSection />
      <CyberIntro />
      <CyberCapabilities />
      <PlatformPreview />
      <SIEMVision />
      <SecurityProcess />
      <BusinessTransformationSection />
      <DigitalEngineeringSection />
      <AIAutomationSection />
      <AISecuritySection />
      <IndustriesSection />
      <ResourcesSection />
      <CaseStudiesSection />
      <FreeTrialSection />
      <ConsultationCTA />
      <FAQSection compact />
      <FinalCTA />
    </>
  );
}
