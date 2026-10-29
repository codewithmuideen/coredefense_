import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import AISecuritySection from "@/components/sections/AISecuritySection";
import ServiceGrid from "@/components/sections/ServiceGrid";
import PracticeApproach from "@/components/sections/PracticeApproach";

export const metadata: Metadata = {
  alternates: { canonical: "/ai-automation" },
  title: "AI & Automation",
  description:
    "AI roadmaps, workflow automation, machine learning and BI dashboards, delivered with the controls your risk and data-protection teams will ask for.",
};

export default function AIAutomationPage() {
  return (
    <>
      <PageHero
        eyebrow="AI & Automation"
        title="Turn intelligence into action"
        description="From a first AI roadmap to production models and automated workflows, built to deliver results you can measure and risks you can explain."
        image="/images/illustrations/ai0.jpg"
        breadcrumbs={[{ label: "AI & Automation", href: "/ai-automation" }]}
      />
      <PracticeApproach practice="ai-automation" />
      <ServiceGrid category="AI & Automation" />
      <AISecuritySection />
    </>
  );
}
