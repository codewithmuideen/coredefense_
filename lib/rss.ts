import { XMLParser } from "fast-xml-parser";

export interface BlogPost {
  title: string;
  link: string;
  source: string;
  publishedAt: string;
  summary: string;
}

interface FeedSource {
  name: string;
  url: string;
}

const FEEDS: FeedSource[] = [
  { name: "The Hacker News", url: "https://feeds.feedburner.com/TheHackersNews" },
  { name: "BleepingComputer", url: "https://www.bleepingcomputer.com/feed/" },
  { name: "Krebs on Security", url: "https://krebsonsecurity.com/feed/" },
  { name: "Dark Reading", url: "https://www.darkreading.com/rss.xml" },
  { name: "SecurityWeek", url: "https://www.securityweek.com/feed/" },
];

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });

function stripHtml(input: string): string {
  return input
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#8217;|&rsquo;/g, "'")
    .replace(/&#8220;|&#8221;|&ldquo;|&rdquo;/g, '"')
    .replace(/&#8211;|&ndash;/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(input: string, max = 180): string {
  if (input.length <= max) return input;
  return input.slice(0, max).replace(/\s+\S*$/, "") + "…";
}

async function fetchFeed(source: FeedSource): Promise<BlogPost[]> {
  try {
    const res = await fetch(source.url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; CoreDefenseBot/1.0)" },
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];

    const xml = await res.text();
    const data = parser.parse(xml);
    const rawItems: unknown[] = data?.rss?.channel?.item ?? data?.feed?.entry ?? [];
    const items = Array.isArray(rawItems) ? rawItems : [rawItems];

    return items
      .filter(Boolean)
      .map((item): BlogPost | null => {
        const record = item as Record<string, unknown>;
        const title = typeof record.title === "string" ? record.title : (record.title as { "#text"?: string })?.["#text"];
        const linkRaw = record.link;
        const link =
          typeof linkRaw === "string"
            ? linkRaw
            : Array.isArray(linkRaw)
              ? (linkRaw[0] as { "@_href"?: string })?.["@_href"]
              : (linkRaw as { "@_href"?: string })?.["@_href"];
        const pubDate = (record.pubDate as string) ?? (record.published as string) ?? (record.updated as string);
        const descriptionRaw =
          (record.description as string) ?? (record["content:encoded"] as string) ?? (record.summary as string) ?? "";

        if (!title || !link) return null;

        return {
          title: stripHtml(title),
          link,
          source: source.name,
          publishedAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
          summary: truncate(stripHtml(typeof descriptionRaw === "string" ? descriptionRaw : "")),
        };
      })
      .filter((post): post is BlogPost => post !== null);
  } catch {
    return [];
  }
}

export async function getLatestSecurityNews(limit = 24): Promise<BlogPost[]> {
  const results = await Promise.all(FEEDS.map(fetchFeed));
  const merged = results.flat();
  merged.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  return merged.slice(0, limit);
}
