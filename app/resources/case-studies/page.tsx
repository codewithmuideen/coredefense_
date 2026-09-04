import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import CaseStudiesSection from "@/components/sections/CaseStudiesSection";
import ConsultationCTA from "@/components/sections/ConsultationCTA";

export const metadata: Metadata = {
  title: "Case Studies",
  description: "CoreDefense case studies — coming soon.",
};

export default function CaseStudiesPage() {
  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Case studies"
        description="We're preparing detailed case studies from CoreDefense engagements."
        breadcrumbs={[{ label: "Resources", href: "/resources" }, { label: "Case Studies", href: "/resources/case-studies" }]}
      />
      <CaseStudiesSection />
      <ConsultationCTA />
    </>
  );
}
