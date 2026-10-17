import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import ServiceGrid from "@/components/sections/ServiceGrid";
import PracticeApproach from "@/components/sections/PracticeApproach";
import ConsultationCTA from "@/components/sections/ConsultationCTA";

export const metadata: Metadata = {
  title: "Digital Engineering & Website Development",
  description:
    "CoreDefense designs and builds modern digital products, websites, platforms and engineering solutions, with security built in from the start.",
};

export default function DigitalEngineeringPage() {
  return (
    <>
      <PageHero
        eyebrow="Digital Engineering & Website Development"
        title="Engineered digital products, not just websites"
        description="We design and build modern digital products, websites, platforms and engineering solutions, with the same rigour we bring to cybersecurity work."
        breadcrumbs={[{ label: "Digital Engineering", href: "/digital-engineering" }]}
      />
      <PracticeApproach practice="digital-engineering" />
      <ServiceGrid category="Digital Engineering" />
      <ConsultationCTA />
    </>
  );
}
