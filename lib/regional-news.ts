import { GLOBAL_FEEDS, fetchFeed, fetchOgImage, type BlogPost, type FeedSource } from "@/lib/rss";

// Live security insight for the Insights page, grouped by region. Two inputs:
//   1. Regional publishers and national cyber agencies, always tagged with their region.
//   2. The global security newsrooms the blog uses, tagged when a story names one of the regions.
// Only publishers' own RSS feeds are used, and every story links back to its source.

export const REGIONS = ["Canada", "United Kingdom", "United States", "UAE / Dubai", "India"] as const;
export type Region = (typeof REGIONS)[number];

interface RegionalSource extends FeedSource {
  region: Region;
  /** General tech feeds: keep only the security stories. */
  securityOnly?: boolean;
}

const REGIONAL_FEEDS: RegionalSource[] = [
  // Canada
  { region: "Canada", name: "Canadian Centre for Cyber Security", url: "https://www.cyber.gc.ca/api/cccs/rss/v1/get?feed=alerts_advisories&lang=en" },
  // United Kingdom
  { region: "United Kingdom", name: "NCSC", url: "https://www.ncsc.gov.uk/api/1/services/v1/all-rss-feed.xml" },
  { region: "United Kingdom", name: "Computer Weekly", url: "https://www.computerweekly.com/rss/IT-security.xml" },
  { region: "United Kingdom", name: "The Register", url: "https://www.theregister.com/security/headlines.atom" },
  // United States
  { region: "United States", name: "CISA", url: "https://www.cisa.gov/cybersecurity-advisories/all.xml" },
  { region: "United States", name: "CISA", url: "https://www.cisa.gov/news.xml" },
  { region: "United States", name: "CyberScoop", url: "https://cyberscoop.com/feed/" },
  // UAE / Dubai
  { region: "UAE / Dubai", name: "Security Middle East", url: "https://www.securitymiddleeastmag.com/feed/" },
  { region: "UAE / Dubai", name: "securityMEA", url: "https://www.securitymea.com/feed/" },
  { region: "UAE / Dubai", name: "Tahawul Tech", url: "https://www.tahawultech.com/feed/", securityOnly: true },
  // India
  { region: "India", name: "ET CISO", url: "https://ciso.economictimes.indiatimes.com/rss/topstories" },
  { region: "India", name: "MediaNama", url: "https://www.medianama.com/feed/", securityOnly: true },
];

// Checked in this order, so "British Columbia" lands in Canada before "British" can match the UK.
// Acronyms are case-sensitive so "US" does not match the word "us".
const REGION_PATTERNS: [Region, RegExp][] = [
  ["Canada", /\b(Canada|Canadian|Ontario|Qu[eé]bec|Alberta|British Columbia|Toronto|Vancouver|Montr[eé]al|Ottawa|Calgary)\b/i],
  ["UAE / Dubai", /\b(UAE|U\.A\.E\.|Emirates|Emirati|Dubai|Abu Dhabi|Sharjah)\b/],
  ["India", /\b(India|Indian|Delhi|Mumbai|Bengaluru|Bangalore|Hyderabad|Chennai|CERT-In)\b/],
  ["United Kingdom", /\b(UK|U\.K\.|United Kingdom|Britain|British|England|Scotland|Wales|NHS|NCSC|London)\b/],
  ["United States", /\b(US|U\.S\.|USA|United States|American|CISA|FBI|Pentagon|Washington)\b/],
];

const SECURITY_TERMS =
  /cyber|secur|hack|breach|ransom|malware|phish|fraud|vulnerab|threat|attack|scam|exploit|data protection|privacy|CERT/i;

const MAX_AGE_DAYS = 30;
const PER_REGION = 9;

function detectRegion(post: BlogPost): Region | undefined {
  const text = `${post.title} ${post.summary}`;
  return REGION_PATTERNS.find(([, pattern]) => pattern.test(text))?.[0];
}

/** Up to `PER_REGION` recent stories for each region, newest first, with no source dominating a region. */
export async function getRegionalSecurityNews(): Promise<BlogPost[]> {
  const [regional, global] = await Promise.all([
    Promise.all(
      REGIONAL_FEEDS.map(async (feed) => {
        const posts = await fetchFeed(feed);
        return posts
          .filter((p) => !feed.securityOnly || SECURITY_TERMS.test(`${p.title} ${p.summary}`))
          .map((p) => ({ ...p, region: feed.region }));
      })
    ),
    Promise.all(GLOBAL_FEEDS.map(fetchFeed)),
  ]);

  const tagged = global.flat().flatMap((p) => {
    const region = detectRegion(p);
    return region ? [{ ...p, region }] : [];
  });

  const cutoff = Date.now() - MAX_AGE_DAYS * 86_400_000;
  const seen = new Set<string>();
  const all = [...regional.flat(), ...tagged]
    .filter((p) => new Date(p.publishedAt).getTime() >= cutoff)
    .filter((p) => {
      const key = p.link.replace(/[?#].*$/, "");
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  const picked = REGIONS.flatMap((region) => {
    const inRegion = all.filter((p) => p.region === region);
    // Share the slots between a region's sources; a region with one source can fill them all.
    const cap = Math.ceil(PER_REGION / new Set(inRegion.map((p) => p.source)).size) + 1;
    const perSource = new Map<string, number>();
    return inRegion
      .filter((p) => {
        const n = perSource.get(p.source) ?? 0;
        perSource.set(p.source, n + 1);
        return n < cap;
      })
      .slice(0, PER_REGION);
  });

  picked.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  await Promise.all(
    picked.map(async (post) => {
      if (!post.image) post.image = await fetchOgImage(post.link);
    })
  );
  return picked;
}
