import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import ResourceListPage from "@/components/templates/ResourceListPage";
import { getArticles, todayInUK } from "@/lib/daily-content";

export const metadata: Metadata = {
  alternates: { canonical: "/resources/insights" },
  title: "Insights",
  description: "CoreDefense insights on cybersecurity, transformation, engineering and AI & automation.",
};

export default function InsightsPage() {
  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Insights from the front line of security and transformation"
        description="In-depth articles on IT/OT security, AI in the SOC, ransomware resilience, cloud risk, automation and security culture, written by the CoreDefense team."
        breadcrumbs={[{ label: "Resources", href: "/resources" }, { label: "Insights", href: "/resources/insights" }]}
      />
      <ResourceListPage items={getArticles("Insight")} today={todayInUK()} noun="Insight" />
    </>
  );
}
