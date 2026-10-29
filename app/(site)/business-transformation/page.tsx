import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import ServiceGrid from "@/components/sections/ServiceGrid";
import PracticeApproach from "@/components/sections/PracticeApproach";

export const metadata: Metadata = {
  alternates: { canonical: "/business-transformation" },
  title: "Business Transformation & Process Modelling",
  description:
    "BPMN process mapping, security business analysis and operating-model design that turn messy, manual work into processes ready to improve.",
};

export default function BusinessTransformationPage() {
  return (
    <>
      <PageHero
        eyebrow="Business Transformation & Process Modelling"
        title="Understand how your business really operates"
        description="Before you buy new software or automate anything, get an accurate picture of how work moves through your organisation, and where it gets stuck."
        image="/images/illustrations/transformation.jpg"
        breadcrumbs={[{ label: "Business Transformation", href: "/business-transformation" }]}
      />
      <PracticeApproach practice="business-transformation" />
      <ServiceGrid category="Business Transformation" />
    </>
  );
}
