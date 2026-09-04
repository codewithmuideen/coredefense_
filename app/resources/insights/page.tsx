import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import ResourceListPage from "@/components/templates/ResourceListPage";

export const metadata: Metadata = {
  title: "Insights",
  description: "CoreDefense insights on cybersecurity, transformation, engineering and AI & automation.",
};

export default function InsightsPage() {
  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Insights"
        description="Practical thinking on cybersecurity, transformation, engineering and AI & automation."
        breadcrumbs={[{ label: "Resources", href: "/resources" }, { label: "Insights", href: "/resources/insights" }]}
      />
      <ResourceListPage defaultCategory="Insight" />
    </>
  );
}
