import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import AISecuritySection from "@/components/sections/AISecuritySection";
import ServiceGrid from "@/components/sections/ServiceGrid";
import PracticeApproach from "@/components/sections/PracticeApproach";
import ConsultationCTA from "@/components/sections/ConsultationCTA";

export const metadata: Metadata = {
  title: "AI & Automation",
  description:
    "CoreDefense helps businesses use artificial intelligence, machine learning and automation to improve operations, intelligence, productivity and decision-making.",
};

export default function AIAutomationPage() {
  return (
    <>
      <PageHero
        eyebrow="AI & Automation"
        title="Turn intelligence into action"
        description="We help businesses use artificial intelligence, machine learning and automation to improve operations, intelligence, productivity and decision-making."
        breadcrumbs={[{ label: "AI & Automation", href: "/ai-automation" }]}
      />
      <PracticeApproach practice="ai-automation" />
      <ServiceGrid category="AI & Automation" />
      <AISecuritySection />
      <ConsultationCTA />
    </>
  );
}
