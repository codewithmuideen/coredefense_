import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import NewsFeed from "@/components/templates/NewsFeed";
import BlogFeed from "@/components/templates/BlogFeed";
import { getBlogPosts, todayInUK } from "@/lib/daily-content";
import { getLatestSecurityNews } from "@/lib/rss";

// Headlines are re-fetched from the publishers' RSS feeds at most once an hour.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog: Security News & Daily Briefs",
  description:
    "Today's cybersecurity headlines from The Hacker News, BleepingComputer, Krebs on Security, Dark Reading and more, alongside CoreDefense's own briefs.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const news = await getLatestSecurityNews(30);

  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Security news, as it breaks"
        description="Headlines and thumbnails from the world's leading security newsrooms, refreshed every hour, with every story credited and linked to its publisher. Scroll down for our own briefs."
        breadcrumbs={[{ label: "Blog", href: "/blog" }]}
      />
      <NewsFeed posts={news} />
      <BlogFeed posts={getBlogPosts()} today={todayInUK()} />
    </>
  );
}
