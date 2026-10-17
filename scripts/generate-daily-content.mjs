#!/usr/bin/env node
// Daily content job: reads the last day's security headlines from public RSS feeds and asks Claude to
// write ORIGINAL CoreDefense posts about them (3 blog briefs + 1 insight). Source reports are credited
// and linked, never copied. Output: one JSON file per article in content/blog and content/insights,
// which the site loads at build time. Run by .github/workflows/daily-content.yml every morning.
//
//   node scripts/generate-daily-content.mjs            generate today's posts (skips if they exist)
//   node scripts/generate-daily-content.mjs --force    regenerate even if today's posts exist
//   node scripts/generate-daily-content.mjs --dry-run  only list the headlines that would be used
//
// Requires ANTHROPIC_API_KEY (except for --dry-run).

import fs from "node:fs";
import path from "node:path";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod/v4";
import { XMLParser } from "fast-xml-parser";

const MODEL = "claude-opus-5-5";
const ROOT = process.cwd();
const BLOG_DIR = path.join(ROOT, "content", "blog");
const INSIGHT_DIR = path.join(ROOT, "content", "insights");
const LOOKBACK_HOURS = 36;
const MAX_STORIES = 24;

const FEEDS = [
  { name: "The Hacker News", url: "https://feeds.feedburner.com/TheHackersNews" },
  { name: "BleepingComputer", url: "https://www.bleepingcomputer.com/feed/" },
  { name: "Krebs on Security", url: "https://krebsonsecurity.com/feed/" },
  { name: "Dark Reading", url: "https://www.darkreading.com/rss.xml" },
  { name: "SecurityWeek", url: "https://www.securityweek.com/feed/" },
  { name: "The Record", url: "https://therecord.media/feed" },
  { name: "Infosecurity Magazine", url: "https://www.infosecurity-magazine.com/rss/news/" },
];

// Must match the keys of ARTICLE_ICONS in lib/article-icons.ts.
const ICONS = [
  "factory", "brain", "shield-alert", "workflow", "cloud", "graduation", "map", "network", "credit-card",
  "siren", "bug", "lock", "globe", "key", "server", "mail", "newspaper", "radar", "eye", "landmark",
];

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36",
  Accept: "application/rss+xml, application/xml, text/xml, */*;q=0.8",
};

// ─── Headlines ─────────────────────────────────────────────────────────────────

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });

function stripHtml(input) {
  return String(input ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#8217;|&rsquo;/g, "'")
    .replace(/&#8220;|&#8221;|&ldquo;|&rdquo;/g, '"')
    .replace(/&#8211;|&ndash;/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchFeed(feed) {
  try {
    const res = await fetch(feed.url, { headers: HEADERS, signal: AbortSignal.timeout(15000) });
    if (!res.ok) return [];
    const data = parser.parse(await res.text());
    const raw = data?.rss?.channel?.item ?? data?.feed?.entry ?? [];
    return (Array.isArray(raw) ? raw : [raw]).flatMap((item) => {
      const title = stripHtml(typeof item.title === "string" ? item.title : item.title?.["#text"]);
      const link = typeof item.link === "string" ? item.link : (Array.isArray(item.link) ? item.link[0] : item.link)?.["@_href"];
      const published = new Date(item.pubDate ?? item.published ?? item.updated ?? 0);
      if (!title || !link || Number.isNaN(published.getTime())) return [];
      const summary = stripHtml(item.description ?? item.summary ?? item["content:encoded"]).slice(0, 700);
      return [{ publisher: feed.name, title, url: link, published: published.toISOString(), summary }];
    });
  } catch {
    return [];
  }
}

async function collectStories() {
  const cutoff = Date.now() - LOOKBACK_HOURS * 3600 * 1000;
  const all = (await Promise.all(FEEDS.map(fetchFeed))).flat().filter((s) => new Date(s.published).getTime() >= cutoff);
  all.sort((a, b) => b.published.localeCompare(a.published));
  // Balance publishers so no single feed dominates, and drop near-duplicate headlines.
  const perPublisher = new Map();
  const seen = new Set();
  const picked = [];
  for (const story of all) {
    const key = story.title.toLowerCase().replace(/[^a-z0-9]+/g, " ").slice(0, 60);
    const n = perPublisher.get(story.publisher) ?? 0;
    if (seen.has(key) || n >= 5) continue;
    seen.add(key);
    perPublisher.set(story.publisher, n + 1);
    picked.push(story);
    if (picked.length >= MAX_STORIES) break;
  }
  return picked;
}

// ─── Output schema ─────────────────────────────────────────────────────────────

const Source = z.object({
  title: z.string().describe("Headline of the source report, as given"),
  url: z.string().describe("URL of the source report, copied exactly from the provided list"),
  publisher: z.string(),
});

const Section = z.object({
  heading: z.string(),
  paragraphs: z.array(z.string()).describe("1-4 paragraphs of original prose"),
  list: z.array(z.string()).describe("Optional bullet points; empty array if none"),
  callout: z.string().describe("Optional one-sentence pull quote; empty string if none"),
});

const Post = z.object({
  title: z.string(),
  excerpt: z.string().describe("Two-sentence summary for the listing card"),
  topic: z.string().describe("Short topic label, e.g. 'Ransomware', 'Cloud Security', 'Vulnerabilities'"),
  icon: z.enum(ICONS),
  takeaways: z.array(z.string()).describe("3-5 key takeaways"),
  sections: z.array(Section).describe("3-6 sections"),
  sources: z.array(Source).describe("1-4 source reports this piece draws on, from the provided list only"),
});

const DailyContent = z.object({
  blog: z.array(Post).describe("Exactly 3 daily brief posts, each about a different story"),
  insight: Post.describe("One deeper insight article connecting a theme across the day's news"),
});

// ─── Generation ────────────────────────────────────────────────────────────────

const SYSTEM = `You are the editorial team at CoreDefense, a UK cybersecurity, business transformation, digital engineering and AI & automation consultancy. You write original, expert analysis for UK business and IT leaders.

Rules:
- Write entirely in your own words. Never copy or closely paraphrase sentences from the source reports.
- Only state facts that appear in the provided headlines and summaries. Do not invent figures, quotes, victim names, dates or technical details. Where details are unclear, say so plainly.
- Add value through analysis: why it matters, who is affected, and concrete defensive steps UK organisations can take.
- Credit every report you draw on in "sources", using the exact URL from the list provided.
- UK English. Professional, clear and calm; no hype, no em dashes.
- Blog briefs: 450-700 words each, three different stories, practical "what to do now" guidance.
- Insight: 800-1100 words, a broader theme that links several of the day's stories, with strategic advice.`;

function wordCount(post) {
  const text = [post.excerpt, ...post.takeaways, ...post.sections.flatMap((s) => [s.heading, ...s.paragraphs, ...s.list, s.callout])].join(" ");
  return text.split(/\s+/).filter(Boolean).length;
}

function slugify(text) {
  const full = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  if (full.length <= 70) return full;
  // Cut at a word boundary so slugs never end mid-word.
  return full.slice(0, 70).replace(/-[^-]*$/, "");
}

function toArticle(post, category, date, allowedUrls) {
  const sources = post.sources.filter((s) => allowedUrls.has(s.url));
  return {
    slug: `${date}-${slugify(post.title)}`,
    category,
    title: post.title,
    excerpt: post.excerpt,
    topic: post.topic,
    date,
    readTime: `${Math.max(3, Math.round(wordCount(post) / 220))} min read`,
    icon: post.icon,
    takeaways: post.takeaways,
    sections: post.sections.map((s) => ({
      heading: s.heading,
      paragraphs: s.paragraphs,
      ...(s.list.length ? { list: s.list } : {}),
      ...(s.callout.trim() ? { callout: s.callout } : {}),
    })),
    sources,
  };
}

async function generate(stories, date) {
  const client = new Anthropic();
  const list = stories
    .map((s, i) => `${i + 1}. [${s.publisher}] ${s.title}\n   URL: ${s.url}\n   Published: ${s.published}\n   Summary: ${s.summary}`)
    .join("\n\n");

  const stream = client.beta.messages.stream({
    model: MODEL,
    max_tokens: 64000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    thinking: { type: "adaptive" },
    output_config: { effort: "high", format: zodOutputFormat(DailyContent) },
    system: SYSTEM,
    messages: [
      {
        role: "user",
        content: `Today is ${date}. Here are the latest cybersecurity headlines from the past ${LOOKBACK_HOURS} hours:\n\n${list}\n\nWrite today's 3 blog briefs and 1 insight article.`,
      },
    ],
  });
  const message = await stream.finalMessage();

  if (message.stop_reason === "refusal") {
    throw new Error(`Claude declined the request (${message.stop_details?.category ?? "no category"}).`);
  }
  if (message.stop_reason === "max_tokens") {
    throw new Error("Response hit max_tokens before finishing.");
  }
  const text = message.content.filter((b) => b.type === "text").map((b) => b.text).join("");
  return DailyContent.parse(JSON.parse(text));
}

// ─── Main ──────────────────────────────────────────────────────────────────────

function todayInUK() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London" }).format(new Date());
}

function hasPostsFor(date) {
  return [BLOG_DIR, INSIGHT_DIR].some((dir) => fs.existsSync(dir) && fs.readdirSync(dir).some((f) => f.startsWith(date)));
}

async function main() {
  const args = new Set(process.argv.slice(2));
  const date = todayInUK();

  const stories = await collectStories();
  console.log(`Collected ${stories.length} recent stories.`);
  if (args.has("--dry-run")) {
    for (const s of stories) console.log(`- [${s.publisher}] ${s.title}`);
    return;
  }
  if (hasPostsFor(date) && !args.has("--force")) {
    console.log(`Posts for ${date} already exist. Use --force to regenerate.`);
    return;
  }
  if (stories.length < 3) {
    throw new Error("Not enough recent stories to write today's posts.");
  }

  const result = await generate(stories, date);
  const allowedUrls = new Set(stories.map((s) => s.url));

  fs.mkdirSync(BLOG_DIR, { recursive: true });
  fs.mkdirSync(INSIGHT_DIR, { recursive: true });
  const written = [];
  for (const post of result.blog) {
    const article = toArticle(post, "Blog", date, allowedUrls);
    const file = path.join(BLOG_DIR, `${article.slug}.json`);
    fs.writeFileSync(file, JSON.stringify(article, null, 2) + "\n");
    written.push(file);
  }
  const insight = toArticle(result.insight, "Insight", date, allowedUrls);
  const insightFile = path.join(INSIGHT_DIR, `${insight.slug}.json`);
  fs.writeFileSync(insightFile, JSON.stringify(insight, null, 2) + "\n");
  written.push(insightFile);

  console.log(`Wrote ${written.length} files:\n${written.map((f) => `  ${path.relative(ROOT, f)}`).join("\n")}`);
}

main().catch((err) => {
  if (err instanceof Anthropic.AuthenticationError) {
    console.error("Authentication failed: set a valid ANTHROPIC_API_KEY.");
  } else if (err instanceof Anthropic.RateLimitError) {
    console.error("Rate limited by the Claude API. The next scheduled run will try again.");
  } else if (err instanceof Anthropic.APIError) {
    console.error(`Claude API error ${err.status}: ${err.message}`);
  } else {
    console.error(err);
  }
  process.exit(1);
});
