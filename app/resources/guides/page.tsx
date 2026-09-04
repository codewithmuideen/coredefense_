import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import ResourceListPage from "@/components/templates/ResourceListPage";

export const metadata: Metadata = {
  title: "Guides",
  description: "Practical guides from CoreDefense on cybersecurity, compliance, transformation and automation.",
};

export default function GuidesPage() {
  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Guides"
        description="Step-by-step thinking on how to approach cybersecurity, compliance and transformation work."
        breadcrumbs={[{ label: "Resources", href: "/resources" }, { label: "Guides", href: "/resources/guides" }]}
      />
      <ResourceListPage defaultCategory="Guide" />
    </>
  );
}
