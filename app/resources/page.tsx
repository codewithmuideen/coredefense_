import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import ResourcesSection from "@/components/sections/ResourcesSection";
import CaseStudiesSection from "@/components/sections/CaseStudiesSection";
import ConsultationCTA from "@/components/sections/ConsultationCTA";

export const metadata: Metadata = {
  title: "Resources",
  description: "Insights, guides and case studies from CoreDefense on cybersecurity, transformation, engineering and AI & automation.",
};

export default function ResourcesPage() {
  return (
    <>
      <PageHero
        eyebrow="Resource Center"
        title="Insights, guides and case studies"
        description="Practical thinking from CoreDefense on cybersecurity, business transformation, digital engineering and AI & automation."
        breadcrumbs={[{ label: "Resources", href: "/resources" }]}
      />
      <ResourcesSection />
      <CaseStudiesSection />
      <ConsultationCTA />
    </>
  );
}
