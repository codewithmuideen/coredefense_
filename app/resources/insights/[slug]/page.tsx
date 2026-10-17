import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticlePage from "@/components/templates/ArticlePage";
import { articles, getArticle } from "@/lib/articles-data";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return articles.filter((a) => a.category === "Insight").map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const article = getArticle("Insight", (await params).slug);
  if (!article) return {};
  return { title: article.title, description: article.excerpt };
}

export default async function Page({ params }: Params) {
  const article = getArticle("Insight", (await params).slug);
  if (!article) notFound();
  return <ArticlePage article={article} />;
}
