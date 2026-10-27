import type { Practice } from "@/types";

export const practices: Practice[] = [
  {
    number: "01",
    title: "Cybersecurity",
    slug: "/cybersecurity",
    summary: "Protect infrastructure, cloud, applications, data and OT environments.",
    description:
      "Testing, monitoring and governance that show where an attacker would get in, which fixes come first and how to prove progress to an auditor.",
    image: "/images/illustrations/cybersecurity-security-threshold.jpg",
    points: ["Vulnerability management", "Cloud & DevOps security", "Compliance & governance", "AI-powered threat triage"],
  },
  {
    number: "02",
    title: "Business Transformation & Process Modelling",
    slug: "/business-transformation",
    summary: "Understand, redesign and optimise how your business operates.",
    description:
      "A clear picture of how work flows today, where it leaks time and risk, and a redesigned model your teams agree to run.",
    image: "/images/illustrations/modelling.jpg",
    points: ["BPMN 2.0 process maps", "Security business analysis", "Target operating models", "Automation readiness"],
  },
  {
    number: "03",
    title: "Digital Engineering & Website Development",
    slug: "/digital-engineering",
    summary: "Design and build modern digital products, platforms and websites.",
    description:
      "From enterprise websites to full digital platforms, engineered with the same rigour as our cybersecurity practice.",
    image: "/images/illustrations/digital-engineering-digital-foundry.jpg",
    points: ["Website development", "Web applications", "Digital platforms", "Cloud-native engineering"],
  },
  {
    number: "04",
    title: "AI & Automation",
    slug: "/ai-automation",
    summary: "Put artificial intelligence and automation to work safely.",
    description:
      "Use cases ranked by value and risk, prototypes proven on your own data, and automations that stay governed once they're live.",
    image: "/images/illustrations/ai.jpg",
    points: ["AI strategy", "Intelligent workflow automation", "AI/ML solutions", "Business intelligence"],
  },
];
