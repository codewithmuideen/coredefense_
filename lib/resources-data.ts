import { articles, articleHref } from "@/lib/articles-data";

export interface ResourceItem {
  title: string;
  category: "Insight" | "Guide" | "Case Study";
  excerpt: string;
  href: string;
  readTime?: string;
}

// Every insight and guide, in listing order. Full article bodies live in articles-data.
export const resourceItems: ResourceItem[] = articles.map((a) => ({
  // The static library only holds insights and guides; daily blog posts are loaded separately.
  title: a.title,
  category: a.category as ResourceItem["category"],
  excerpt: a.excerpt,
  href: articleHref(a),
  readTime: a.readTime,
}));

export const caseStudyPlaceholders = [
  { title: "Financial Services", status: "Case Study Coming Soon" },
  { title: "Manufacturing", status: "Case Study Coming Soon" },
  { title: "Technology", status: "Case Study Coming Soon" },
];
