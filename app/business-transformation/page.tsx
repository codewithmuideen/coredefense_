import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import BusinessTransformationSection from "@/components/sections/BusinessTransformationSection";
import ServiceGrid from "@/components/sections/ServiceGrid";
import IndustriesSection from "@/components/sections/IndustriesSection";
import ConsultationCTA from "@/components/sections/ConsultationCTA";

export const metadata: Metadata = {
  title: "Business Transformation & Process Modelling",
  description:
    "CoreDefense helps organisations understand, redesign, optimise and automate business processes, from process mapping through to workflow automation.",
};

export default function BusinessTransformationPage() {
  return (
    <>
      <PageHero
        eyebrow="Business Transformation & Process Modelling"
        title="Understand how your business really operates"
        description="We help organisations understand, redesign, optimise and automate business processes, grounded in real process mapping and business analysis."
        breadcrumbs={[{ label: "Business Transformation", href: "/business-transformation" }]}
      />
      <BusinessTransformationSection />
      <ServiceGrid category="Business Transformation" />
      <IndustriesSection />
      <ConsultationCTA />
    </>
  );
}
