import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import AIAutomationSection from "@/components/sections/AIAutomationSection";
import AISecuritySection from "@/components/sections/AISecuritySection";
import ServiceGrid from "@/components/sections/ServiceGrid";
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
      <AIAutomationSection />
      <ServiceGrid category="AI & Automation" />
      <AISecuritySection />
      <ConsultationCTA />
    </>
  );
}
