import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import TrustStats from "@/components/sections/TrustStats";
import Difference from "@/components/sections/Difference";
import CyberIntro from "@/components/sections/CyberIntro";
import BusinessTransformationSection from "@/components/sections/BusinessTransformationSection";
import DigitalEngineeringSection from "@/components/sections/DigitalEngineeringSection";
import AIAutomationSection from "@/components/sections/AIAutomationSection";
import IndustriesSection from "@/components/sections/IndustriesSection";
import ResourcesSection from "@/components/sections/ResourcesSection";
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
      <CyberIntro />
      <BusinessTransformationSection />
      <DigitalEngineeringSection />
      <AIAutomationSection />
      <IndustriesSection />
      <ResourcesSection />
      <FinalCTA />
    </>
  );
}
