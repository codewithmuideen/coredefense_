import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import ServiceGrid from "@/components/sections/ServiceGrid";
import PracticeApproach from "@/components/sections/PracticeApproach";

export const metadata: Metadata = {
  alternates: { canonical: "/digital-engineering" },
  title: "Digital Engineering & Website Development",
  description:
    "Websites, custom web applications and cloud platforms from a UK engineering team: accessible, fast and fully documented for your own developers.",
};

export default function DigitalEngineeringPage() {
  return (
    <>
      <PageHero
        eyebrow="Digital Engineering & Website Development"
        title="Engineered digital products, not just websites"
        description="Websites, web applications and cloud platforms built by engineers who think like attackers, so security is part of the design rather than bolted on at the end."
        image="/images/illustrations/automation.jpg"
        breadcrumbs={[{ label: "Digital Engineering", href: "/digital-engineering" }]}
      />
      <PracticeApproach practice="digital-engineering" />
      <ServiceGrid category="Digital Engineering" />
    </>
  );
}
