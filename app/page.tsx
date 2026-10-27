import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import TrustStats from "@/components/sections/TrustStats";
import Difference from "@/components/sections/Difference";
import IndustriesSection from "@/components/sections/IndustriesSection";
import ResourcesSection from "@/components/sections/ResourcesSection";
import FinalCTA from "@/components/sections/FinalCTA";

export const metadata: Metadata = {
  title: { absolute: "CoreDefense | Cybersecurity, Process Transformation & AI Services, UK" },
  description:
    "Risk-ranked security testing, BPMN process redesign, secure software engineering and governed AI for UK organisations, delivered by one senior team.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStats />
      <Difference />
      <IndustriesSection />
      <ResourcesSection />
      <FinalCTA />
    </>
  );
}
