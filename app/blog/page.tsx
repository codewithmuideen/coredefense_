import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import BlogFeed from "@/components/templates/BlogFeed";
import { getBlogPosts, todayInUK } from "@/lib/daily-content";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Daily CoreDefense briefs: our own analysis of the latest cybersecurity and technology news, with practical advice for UK organisations.",
};

export default function BlogPage() {
  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="The CoreDefense Daily Brief"
        description="Every morning our team reviews the day's cybersecurity and technology news and publishes original analysis: what happened, why it matters and what to do about it."
        breadcrumbs={[{ label: "Blog", href: "/blog" }]}
      />
      <BlogFeed posts={getBlogPosts()} today={todayInUK()} />
    </>
  );
}
