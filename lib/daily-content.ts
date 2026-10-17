import fs from "node:fs";
import path from "node:path";
import { articles, type Article, type ArticleCategory } from "@/lib/articles-data";
import { ARTICLE_ICON_NAMES } from "@/lib/article-icons";

// Server-only: reads the daily posts that scripts/generate-daily-content.mjs writes into /content.
// Each file is one Article as JSON. Pages are rebuilt whenever the daily job commits new files.

const CONTENT_DIRS: Record<"Blog" | "Insight", string> = {
  Blog: path.join(process.cwd(), "content", "blog"),
  Insight: path.join(process.cwd(), "content", "insights"),
};

function isArticle(value: unknown): value is Article {
  const a = value as Partial<Article>;
  return (
    typeof a?.slug === "string" &&
    typeof a.title === "string" &&
    typeof a.date === "string" &&
    Array.isArray(a.sections) &&
    Array.isArray(a.takeaways)
  );
}

function readDir(category: "Blog" | "Insight"): Article[] {
  const dir = CONTENT_DIRS[category];
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .flatMap((file) => {
      try {
        const parsed: unknown = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
        if (!isArticle(parsed)) return [];
        const icon = ARTICLE_ICON_NAMES.includes(parsed.icon) ? parsed.icon : "newspaper";
        return [{ ...parsed, category, icon }];
      } catch {
        return [];
      }
    });
}

const byNewest = (a: Article, b: Article) => b.date.localeCompare(a.date);

/** Daily blog posts, newest first. */
export function getBlogPosts(): Article[] {
  return readDir("Blog").sort(byNewest);
}

/** Every article in a category (daily insights merged with the hand-written library), newest first. */
export function getArticles(category: Exclude<ArticleCategory, "Blog">): Article[] {
  const daily = category === "Insight" ? readDir("Insight") : [];
  return [...daily, ...articles.filter((a) => a.category === category)].sort(byNewest);
}

export function getAllArticles(): Article[] {
  return [...getBlogPosts(), ...getArticles("Insight"), ...getArticles("Guide")];
}

export function findArticle(category: ArticleCategory, slug: string): Article | undefined {
  const pool = category === "Blog" ? getBlogPosts() : getArticles(category);
  return pool.find((a) => a.slug === slug);
}

/** Today's date in the UK as YYYY-MM-DD, used to label the day's featured post. */
export function todayInUK(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London" }).format(new Date());
}
