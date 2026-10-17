import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import ResourceListPage from "@/components/templates/ResourceListPage";
import { getArticles, todayInUK } from "@/lib/daily-content";

export const metadata: Metadata = {
  title: "Guides",
  description: "Practical guides from CoreDefense on cybersecurity, compliance, transformation and automation.",
};

export default function GuidesPage() {
  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Practical guides you can put to work"
        description="Step-by-step guides on compliance mapping, process discovery, PCI DSS v4.0 readiness and incident response, with checklists you can use straight away."
        breadcrumbs={[{ label: "Resources", href: "/resources" }, { label: "Guides", href: "/resources/guides" }]}
      />
      <ResourceListPage items={getArticles("Guide")} today={todayInUK()} noun="Guide" />
    </>
  );
}
