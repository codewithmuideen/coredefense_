import type { Practice } from "@/types";

export const practices: Practice[] = [
  {
    number: "01",
    title: "Cybersecurity",
    slug: "/cybersecurity",
    summary: "Protect infrastructure, cloud, applications, data and OT environments.",
    description:
      "AI-powered, compliance-ready cybersecurity that detects, prioritises and remediates threats faster — across IT, cloud and operational technology.",
    image: "/images/illustrations/cybersecurity-security-threshold.jpg",
    points: ["Vulnerability management", "Cloud & DevOps security", "Compliance & governance", "AI-powered threat triage"],
  },
  {
    number: "02",
    title: "Business Transformation & Process Modelling",
    slug: "/business-transformation",
    summary: "Understand, redesign and optimise how your business operates.",
    description:
      "We map current-state processes, identify inefficiency and risk, and design future-state operating models that are ready for automation.",
    image: "/images/illustrations/business-transformation-operating-model.jpg",
    points: [
      "Current-state process discovery",
      "BPMN process modelling",
      "Gap analysis",
      "Requirements engineering",
      "Target operating models",
      "RACI and governance",
      "Automation readiness",
      "Process optimisation",
      "Implementation roadmaps",
    ],
  },
  {
    number: "03",
    title: "Digital Engineering & Website Development",
    slug: "/digital-engineering",
    summary: "Design and build modern digital products, platforms and websites.",
    description:
      "From enterprise websites to full digital platforms — engineered with the same rigour as our cybersecurity practice.",
    image: "/images/illustrations/digital-engineering-digital-foundry.jpg",
    points: ["Website development", "Web applications", "Digital platforms", "Cloud-native engineering"],
  },
  {
    number: "04",
    title: "AI & Automation",
    slug: "/ai-automation",
    summary: "Put artificial intelligence and automation to work safely.",
    description:
      "We help organisations use AI, machine learning and automation to improve operations, intelligence, productivity and decision-making.",
    image: "/images/illustrations/ai-automation-intelligence-loom.jpg",
    points: ["AI strategy", "Intelligent workflow automation", "AI/ML solutions", "Business intelligence"],
  },
];
