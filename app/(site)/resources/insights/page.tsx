import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import NewsFeed from "@/components/templates/NewsFeed";
import ResourceListPage from "@/components/templates/ResourceListPage";
import { getArticles, todayInUK } from "@/lib/daily-content";
import { REGIONS, getRegionalSecurityNews } from "@/lib/regional-news";

// Regional insight is re-fetched from the publishers' and agencies' RSS feeds at most once an hour.
export const revalidate = 3600;

export const metadata: Metadata = {
  alternates: { canonical: "/resources/insights" },
  title: "Insights: Latest Security Intelligence by Region",
  description:
    "The latest cybersecurity insight from Canada, the UK, the USA, the UAE and India, from national cyber agencies and regional newsrooms, alongside CoreDefense's own analysis.",
};

export default async function InsightsPage() {
  const regional = await getRegionalSecurityNews();

  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="The latest security insight, region by region"
        description="Advisories and analysis from national cyber agencies and regional newsrooms in Canada, the UK, the USA, the UAE and India, refreshed every hour, with every story credited and linked to its source. Scroll down for in-depth insights from the CoreDefense team."
        breadcrumbs={[{ label: "Resources", href: "/resources" }, { label: "Insights", href: "/resources/insights" }]}
      />
      <NewsFeed
        posts={regional}
        filterBy="region"
        filterOrder={REGIONS}
        liveLabel="Live from Canada, the UK, the USA, the UAE and India, refreshed hourly"
      />
      <ResourceListPage items={getArticles("Insight")} today={todayInUK()} noun="Insight" />
    </>
  );
}
