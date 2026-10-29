import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticlePage from "@/components/templates/ArticlePage";
import { articleHref } from "@/lib/articles-data";
import { findArticle, getBlogPosts } from "@/lib/daily-content";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getBlogPosts().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const article = findArticle("Blog", (await params).slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: articleHref(article) },
    openGraph: { type: "article", title: article.title, description: article.excerpt, publishedTime: article.date },
  };
}

export default async function Page({ params }: Params) {
  const article = findArticle("Blog", (await params).slug);
  if (!article) notFound();
  return <ArticlePage article={article} />;
}
