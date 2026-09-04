import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import FAQSection from "@/components/sections/FAQSection";
import ConsultationCTA from "@/components/sections/ConsultationCTA";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about CoreDefense's cybersecurity, transformation, engineering and AI & automation services.",
};

export default function FAQPage() {
  return (
    <>
      <PageHero
        eyebrow="Support"
        title="Frequently asked questions"
        description="Everything you need to know about what CoreDefense does today, and what's still in development."
        breadcrumbs={[{ label: "FAQ", href: "/faq" }]}
      />
      <FAQSection />
      <ConsultationCTA />
    </>
  );
}
