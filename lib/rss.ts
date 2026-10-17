import { XMLParser } from "fast-xml-parser";

export interface BlogPost {
  title: string;
  link: string;
  source: string;
  publishedAt: string;
  summary: string;
  image?: string;
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
  { name: "The Record", url: "https://therecord.media/feed" },
  { name: "Infosecurity Magazine", url: "https://www.infosecurity-magazine.com/rss/news/" },
];

// Several publishers reject non-browser user agents with a 403, so identify as a regular browser.
const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36",
  Accept: "application/rss+xml, application/xml, text/xml, text/html;q=0.9, */*;q=0.8",
};

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

function urlAttr(node: unknown): string | undefined {
  const first = Array.isArray(node) ? node[0] : node;
  if (!first || typeof first !== "object") return undefined;
  const url = (first as { "@_url"?: string; "@_href"?: string })["@_url"] ?? (first as { "@_href"?: string })["@_href"];
  return typeof url === "string" ? url : undefined;
}

function decodeEntities(url: string): string {
  return url.replace(/&amp;/g, "&").replace(/&#038;/g, "&");
}

function toHttps(url: string): string {
  return url.startsWith("http://") ? `https://${url.slice(7)}` : url;
}

// Feeds expose images in different places: media:content, media:thumbnail, enclosure, or an <img> in the body.
function extractImage(record: Record<string, unknown>, html: string): string | undefined {
  const enclosure = record.enclosure as { "@_type"?: string } | undefined;
  const enclosureUrl = enclosure && (!enclosure["@_type"] || enclosure["@_type"].startsWith("image")) ? urlAttr(enclosure) : undefined;
  const fromHtml = html.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1];
  const candidate = urlAttr(record["media:content"]) ?? urlAttr(record["media:thumbnail"]) ?? enclosureUrl ?? fromHtml;
  return candidate ? toHttps(decodeEntities(candidate)) : undefined;
}

// Fallback for feeds without images: read the article's Open Graph image.
async function fetchOgImage(link: string): Promise<string | undefined> {
  try {
    const res = await fetch(link, { headers: HEADERS, next: { revalidate: 3600 }, signal: AbortSignal.timeout(6000) });
    if (!res.ok) return undefined;
    const head = (await res.text()).slice(0, 200_000);
    const match =
      head.match(/<meta[^>]+property=["']og:image(?::url)?["'][^>]*content=["']([^"']+)["']/i) ??
      head.match(/<meta[^>]+content=["']([^"']+)["'][^>]*property=["']og:image(?::url)?["']/i) ??
      head.match(/<meta[^>]+name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i);
    return match ? toHttps(decodeEntities(match[1])) : undefined;
  } catch {
    return undefined;
  }
}

function truncate(input: string, max = 180): string {
  if (input.length <= max) return input;
  return input.slice(0, max).replace(/\s+\S*$/, "") + "…";
}

async function fetchFeed(source: FeedSource): Promise<BlogPost[]> {
  try {
    const res = await fetch(source.url, {
      headers: HEADERS,
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
        const bodyHtml = [record["content:encoded"], record.description]
          .filter((v): v is string => typeof v === "string")
          .join(" ");

        if (!title || !link) return null;

        return {
          title: stripHtml(title),
          link,
          source: source.name,
          publishedAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
          summary: truncate(stripHtml(typeof descriptionRaw === "string" ? descriptionRaw : "")),
          image: extractImage(record, bodyHtml),
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

  // Some feeds dominate by volume; cap each source so the page stays varied.
  const perSource = new Map<string, number>();
  const balanced = merged.filter((post) => {
    const n = perSource.get(post.source) ?? 0;
    perSource.set(post.source, n + 1);
    return n < Math.ceil(limit / 4);
  });

  const posts = balanced.slice(0, limit);
  await Promise.all(
    posts.map(async (post) => {
      if (!post.image) post.image = await fetchOgImage(post.link);
    })
  );
  return posts;
}
