import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import TrustStats from "@/components/sections/TrustStats";
import Difference from "@/components/sections/Difference";
import IndustriesSection from "@/components/sections/IndustriesSection";
import ResourcesSection from "@/components/sections/ResourcesSection";
import FinalCTA from "@/components/sections/FinalCTA";
import WhyItMatters from "@/components/sections/WhyItMatters";
import ExposureBento from "@/components/sections/ExposureBento";
import TestingTypes from "@/components/sections/TestingTypes";
import BreachPanel from "@/components/sections/BreachPanel";

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
      <WhyItMatters />
      <Difference />
      <ExposureBento />
      <TestingTypes />
      <IndustriesSection />
      <ResourcesSection />
      <BreachPanel />
      <FinalCTA />
    </>
  );
}
