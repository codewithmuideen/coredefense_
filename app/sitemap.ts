import type { MetadataRoute } from "next";
import { articleHref } from "@/lib/articles-data";
import { getAllArticles } from "@/lib/daily-content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.coredefense.co.uk";

const routes = [
  "",
  "/about",
  "/team",
  "/solutions",
  "/platform",
  "/contact",
  "/careers",
  "/careers/talent-hub",
  "/request-access",
  "/book-consultation",
  "/blog",
  "/faq",
  "/cybersecurity",
  "/cybersecurity/cloud-devops-security",
  "/cybersecurity/vulnerability-management",
  "/cybersecurity/compliance-governance",
  "/cybersecurity/it-ot-security",
  "/cybersecurity/security-assessment",
  "/cybersecurity/ai-threat-triage",
  "/cybersecurity/incident-readiness",
  "/cybersecurity/security-awareness",
  "/business-transformation",
  "/business-transformation/process-modelling",
  "/business-transformation/business-analysis",
  "/business-transformation/workflow-automation",
  "/digital-engineering",
  "/digital-engineering/web-development",
  "/digital-engineering/software-engineering",
  "/digital-engineering/digital-platforms",
  "/ai-automation",
  "/ai-automation/ai-strategy",
  "/ai-automation/intelligent-automation",
  "/ai-automation/ai-ml",
  "/platform/features",
  "/platform/integrations",
  "/platform/trust-center",
  "/platform/use-cases",
  "/platform/compliance-mapping",
  "/industries",
  "/industries/financial-services",
  "/industries/healthcare",
  "/industries/manufacturing",
  "/industries/technology",
  "/resources",
  "/resources/insights",
  "/resources/guides",
  "/resources/case-studies",
  "/privacy",
  "/cookies",
  "/terms",
  "/accessibility",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [...routes, ...getAllArticles().map(articleHref)].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route.split("/").length <= 2 ? 0.8 : 0.6,
  }));
}
