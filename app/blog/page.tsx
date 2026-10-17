import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import BlogFeed from "@/components/templates/BlogFeed";
import { getLatestSecurityNews } from "@/lib/rss";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog",
  description: "Live cybersecurity, hacking and business technology news, curated automatically from trusted sources.",
};

export default async function BlogPage() {
  const posts = await getLatestSecurityNews(30);

  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="CoreDefense Blog"
        description="The latest cybersecurity, hacking and business technology stories, with images, pulled automatically from trusted sources and refreshed every hour."
        breadcrumbs={[{ label: "Blog", href: "/blog" }]}
      />
      <BlogFeed posts={posts} />
    </>
  );
}
