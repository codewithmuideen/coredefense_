import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import IndustriesSection from "@/components/sections/IndustriesSection";
import ConsultationCTA from "@/components/sections/ConsultationCTA";

export const metadata: Metadata = {
  title: "Industries",
  description:
    "CoreDefense supports financial services, healthcare, manufacturing, technology and more with cybersecurity and technology built for sector-specific risk.",
};

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Industries"
        title="Sector-specific risk, mapped to your business"
        description="Every industry carries a different risk profile. We tailor cybersecurity, transformation and engineering work to yours."
        breadcrumbs={[{ label: "Industries", href: "/industries" }]}
      />
      <IndustriesSection />
      <ConsultationCTA />
    </>
  );
}
