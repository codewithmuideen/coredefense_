import type { ArticleIconName } from "@/lib/article-icons";

export type ArticleCategory = "Insight" | "Guide" | "Blog";

export interface ArticleSection {
  heading: string;
  paragraphs: string[];
  list?: string[];
  callout?: string;
}

export interface ArticleSource {
  title: string;
  url: string;
  publisher: string;
}

export interface Article {
  slug: string;
  category: ArticleCategory;
  title: string;
  excerpt: string;
  topic: string;
  date: string;
  readTime: string;
  icon: ArticleIconName;
  takeaways: string[];
  sections: ArticleSection[];
  /** News reports a daily post was based on; credited at the end of the article. */
  sources?: ArticleSource[];
}

export const articles: Article[] = [
  // ─── Insights ──────────────────────────────────────────────────────────────
  {
    slug: "it-ot-security-shared-language",
    category: "Insight",
    title: "Why IT and OT security need a shared language",
    excerpt:
      "Manufacturing and critical infrastructure teams often protect the same plant with different priorities, vocabularies and tools. Here's how to close that gap without slowing production.",
    topic: "IT/OT Security",
    date: "2026-10-08",
    readTime: "8 min read",
    icon: "factory",
    takeaways: [
      "IT optimises for confidentiality; OT optimises for safety and availability. Both are right, and both must be stated openly.",
      "A shared asset inventory is the single most useful artefact for joint IT/OT security work.",
      "Translate cyber risk into production terms: downtime hours, safety incidents and batch losses.",
      "Patch windows, not patch counts, should drive OT remediation planning.",
    ],
    sections: [
      {
        heading: "Two teams, one plant, different instincts",
        paragraphs: [
          "Walk into most manufacturing sites and you'll find two groups who both care deeply about keeping the business running, yet rarely sit at the same table. The IT security team thinks in terms of endpoints, identities, vulnerabilities and data. The operations and engineering team thinks in terms of uptime, process safety, cycle times and the physical consequences of a controller behaving unexpectedly.",
          "Neither view is wrong. The trouble starts when one side's instincts are applied to the other side's systems. An IT-style approach of 'patch everything critical within 14 days' can be impossible, or genuinely dangerous, on a line controller that was certified in a specific configuration. Equally, an OT-style approach of 'if it works, don't touch it' leaves flat networks and default credentials in place for years.",
        ],
      },
      {
        heading: "Start with a shared asset inventory",
        paragraphs: [
          "Almost every productive IT/OT conversation begins with the same question: what do we actually have? A joint inventory, covering PLCs, HMIs, historians, engineering workstations, remote access paths and the IT systems they connect to, gives both teams a common reference point.",
          "The inventory doesn't need to be perfect on day one. Passive network monitoring, engineering drawings and a walk of the floor with the people who maintain the kit will get you most of the way. What matters is that both teams agree it is the source of truth.",
        ],
        list: [
          "Record function and criticality in production terms, not just IP addresses.",
          "Capture who can access each asset remotely, and how.",
          "Note vendor support status and the realistic maintenance window for each asset.",
          "Flag safety-instrumented systems separately; they need their own change process.",
        ],
      },
      {
        heading: "Translate risk into production language",
        paragraphs: [
          "Security findings presented as CVE numbers and CVSS scores rarely land with plant managers. The same finding framed as 'an attacker on the office network could stop Line 3 for an unknown period' gets attention, and a budget.",
          "Work with operations to agree a small set of impact categories: lost production hours, safety exposure, quality or batch loss, and regulatory reporting. Score OT findings against those, and suddenly both teams are prioritising the same thing.",
        ],
        callout:
          "A useful test: if a finding can't be explained in terms of what would happen on the shop floor, it probably isn't prioritised correctly yet.",
      },
      {
        heading: "Segment first, patch second",
        paragraphs: [
          "Because many OT assets can't be patched quickly, the most effective early control is usually network segmentation. Separating the plant network from the corporate network, and tightly controlling the conduits between them, reduces exposure for every vulnerable device at once.",
          "Remote access deserves special attention. Vendor support connections, shared jump boxes and always-on VPNs are some of the most common paths into OT environments. Replacing them with brokered, time-limited and logged access is often a quick, high-value win.",
        ],
      },
      {
        heading: "Build a joint operating rhythm",
        paragraphs: [
          "Shared language only sticks if it is used regularly. A short monthly IT/OT security review, covering new assets, open findings, upcoming maintenance windows and any incidents, keeps both teams aligned and avoids surprises.",
          "Over time, that rhythm becomes the foundation for joint incident playbooks, so that when something does go wrong, the people isolating a network segment and the people deciding whether to stop a line are already used to working together.",
        ],
      },
    ],
  },
  {
    slug: "where-ai-helps-threat-triage",
    category: "Insight",
    title: "Where AI actually helps in threat triage",
    excerpt:
      "AI won't replace your analysts, but it can take the grind out of alert triage. A grounded look at where machine learning and language models genuinely earn their place in the SOC.",
    topic: "AI & Security Operations",
    date: "2026-09-29",
    readTime: "7 min read",
    icon: "brain",
    takeaways: [
      "AI is strongest at enrichment, clustering and summarisation, the repetitive work that consumes analyst time.",
      "Keep humans in the loop for containment decisions and anything with business impact.",
      "Measure AI by analyst time saved and missed-detection rate, not by alerts closed.",
      "Good data hygiene matters more than model choice.",
    ],
    sections: [
      {
        heading: "The real problem is volume, not intelligence",
        paragraphs: [
          "Most security teams aren't short of detection rules. They're short of time. Alerts arrive faster than analysts can investigate them, and much of each investigation is the same routine: look up the host, check the user, search for related events, decide whether it's benign.",
          "That routine is exactly where AI can help. Not by making the final call, but by doing the legwork so the analyst starts each alert with context already gathered.",
        ],
      },
      {
        heading: "Where AI earns its place",
        paragraphs: [
          "In practice, we see four areas where AI consistently reduces triage effort without adding unacceptable risk.",
        ],
        list: [
          "Enrichment: automatically pulling asset owner, criticality, recent vulnerabilities and user context into the alert.",
          "Clustering: grouping related alerts into a single incident so analysts investigate the story, not fifty fragments.",
          "Summarisation: turning raw event data into a plain-English timeline an analyst can read in seconds.",
          "Prioritisation: ranking alerts using business context, not just the severity a vendor assigned.",
        ],
      },
      {
        heading: "Where to keep humans firmly in control",
        paragraphs: [
          "Automated containment, such as isolating a laptop or disabling an account, can be valuable, but the cost of a false positive is real. Isolating a finance director's machine during month-end close is an incident in itself.",
          "A sensible pattern is graduated autonomy: let AI act automatically on low-impact, high-confidence cases, require one-click analyst approval for medium-impact actions, and keep high-impact decisions fully manual.",
        ],
        callout: "AI should shorten the time to a good human decision, not remove the human from the decision.",
      },
      {
        heading: "Measure the right outcomes",
        paragraphs: [
          "It's tempting to measure AI triage by how many alerts it auto-closes. That metric rewards over-confident models. Better measures are mean time to triage, analyst hours saved per week, and, crucially, how many genuine incidents were initially down-ranked.",
          "Sampling a proportion of AI-closed alerts for human review each week is a simple way to keep the system honest.",
        ],
      },
      {
        heading: "Data hygiene beats model choice",
        paragraphs: [
          "The quality of AI triage depends heavily on the context it can see. An accurate asset inventory, consistent log formats and clear ownership data will improve results more than switching to a newer model.",
          "If you're planning to introduce AI into security operations, start by fixing the data foundations. The models will thank you for it.",
        ],
      },
    ],
  },
  {
    slug: "ransomware-readiness-board-questions",
    category: "Insight",
    title: "Ransomware readiness: five questions every board should ask",
    excerpt:
      "Boards don't need to understand encryption algorithms, but they do need to know whether the organisation could recover. Five questions that cut straight to resilience.",
    topic: "Incident Readiness",
    date: "2026-09-17",
    readTime: "6 min read",
    icon: "shield-alert",
    takeaways: [
      "Recovery capability, not just prevention, determines how bad a ransomware incident gets.",
      "Backups only count if they are isolated from the main network and regularly test-restored.",
      "Decisions about ransom payment, communications and regulators should be made before an incident.",
      "Tabletop exercises reveal gaps that policies hide.",
    ],
    sections: [
      {
        heading: "Why boards should lead on ransomware",
        paragraphs: [
          "Ransomware is a business continuity event that happens to start in IT. The decisions it forces, such as whether to shut down operations, how to communicate with customers and whether to engage with attackers, are board-level decisions.",
          "These five questions help directors understand whether the organisation is genuinely prepared, without needing deep technical knowledge.",
        ],
      },
      {
        heading: "1. How quickly could we restore our most critical services?",
        paragraphs: [
          "Ask for a specific answer in hours or days for each critical service, and ask when that was last proven. Many organisations have backups but have never timed a full restore of a core system.",
        ],
      },
      {
        heading: "2. Are our backups protected from the attacker?",
        paragraphs: [
          "Modern ransomware groups actively look for and destroy backups before encrypting. Backups should be immutable or offline, protected by separate credentials, and monitored for deletion attempts.",
        ],
      },
      {
        heading: "3. Who decides, and how, when systems go down?",
        paragraphs: [
          "An incident is the wrong time to work out who has authority to isolate networks, invoke continuity plans or engage external specialists. A clear decision matrix, agreed in advance, saves critical hours.",
        ],
        list: [
          "Who can authorise taking systems offline?",
          "Who speaks to customers, staff and the media?",
          "When and how are regulators such as the ICO notified?",
          "What is our position on ransom payment, and who would make that call?",
        ],
      },
      {
        heading: "4. How would we know an attacker was already inside?",
        paragraphs: [
          "Ransomware is usually the final stage of an intrusion that started days or weeks earlier. Detection of early signs, such as unusual admin activity, new remote access tools and mass file access, gives the chance to stop an attack before encryption.",
        ],
      },
      {
        heading: "5. When did we last rehearse?",
        paragraphs: [
          "A tabletop exercise that walks leadership through a realistic scenario is one of the most cost-effective investments in resilience. It exposes unclear responsibilities, missing contact details and untested assumptions.",
        ],
        callout: "If the answer to any of these questions is 'we think so', that's the place to start.",
      },
    ],
  },
  {
    slug: "automation-readiness-before-you-automate",
    category: "Insight",
    title: "Automation readiness: what to fix before you automate",
    excerpt:
      "Automating a broken process just helps you fail faster. The signals that a process is ready for automation, and the clean-up work that pays off first.",
    topic: "Business Transformation",
    date: "2026-09-04",
    readTime: "7 min read",
    icon: "workflow",
    takeaways: [
      "A process is ready to automate when it is stable, well understood and measured.",
      "Exceptions, not the happy path, determine automation effort and value.",
      "Security and access design must be part of automation, not bolted on after.",
      "Start small, measure, then scale.",
    ],
    sections: [
      {
        heading: "The temptation to automate first",
        paragraphs: [
          "With modern workflow and AI tools, it has never been easier to automate a task. That's exactly why so many automation projects disappoint: they encode an inefficient process in software, making it harder to change later.",
          "Before automating, it's worth asking a simple question: if we did this process perfectly by hand, would we be happy with it?",
        ],
      },
      {
        heading: "Signals that a process is ready",
        paragraphs: ["In our experience, processes that automate well share a few characteristics."],
        list: [
          "The steps are consistent and documented, ideally as a BPMN process map.",
          "Inputs arrive in a predictable format, or can be made to.",
          "Exceptions are known, counted and have a clear owner.",
          "There is a baseline: you know how long it takes and how often it goes wrong today.",
          "Someone in the business owns the outcome, not just the tool.",
        ],
      },
      {
        heading: "Exceptions are where the effort lives",
        paragraphs: [
          "The happy path of most processes is easy to automate. The cost and risk sit in the exceptions: the missing field, the duplicate invoice, the customer who doesn't fit the standard flow.",
          "Mapping and quantifying exceptions before you build tells you whether automation will actually save time, and which exceptions should be eliminated rather than automated.",
        ],
      },
      {
        heading: "Design security in from the start",
        paragraphs: [
          "Automations often run with broad service-account permissions and touch sensitive data. Treat each automation as a privileged identity: least-privilege access, secrets stored securely, activity logged and reviewed.",
        ],
        callout: "An unmonitored automation with admin rights is an attacker's favourite kind of user.",
      },
      {
        heading: "Start small, measure, then scale",
        paragraphs: [
          "Pick one well-understood process, automate it end to end, and measure against the baseline. That evidence builds the case for the next automation and surfaces lessons while the stakes are low.",
        ],
      },
    ],
  },
  {
    slug: "cloud-misconfiguration-quiet-risk",
    category: "Insight",
    title: "Cloud misconfiguration: the quiet risk in fast-moving teams",
    excerpt:
      "Most cloud incidents don't start with sophisticated exploits. They start with a storage bucket, a permissive role or a forgotten test environment. How to stay fast and stay safe.",
    topic: "Cloud Security",
    date: "2026-08-21",
    readTime: "6 min read",
    icon: "cloud",
    takeaways: [
      "Misconfiguration, not zero-days, drives most cloud exposure.",
      "Guardrails in infrastructure-as-code catch issues before they reach production.",
      "Identity is the new perimeter: review roles and keys as rigorously as firewall rules.",
      "Tag everything, so every resource has an owner who can be asked about it.",
    ],
    sections: [
      {
        heading: "Speed creates drift",
        paragraphs: [
          "Cloud platforms let engineering teams spin up infrastructure in minutes. That's a huge advantage, but every quick test environment, temporary permission and manual console change adds a little drift from the secure baseline.",
          "Over months, that drift accumulates into publicly accessible storage, over-privileged roles, unencrypted databases and forgotten resources that nobody owns.",
        ],
      },
      {
        heading: "The most common culprits",
        paragraphs: ["Across AWS, Azure and Google Cloud reviews, the same issues appear again and again."],
        list: [
          "Storage buckets or blobs with public access enabled.",
          "IAM roles with wildcard permissions granted 'temporarily'.",
          "Long-lived access keys sitting in code repositories or CI variables.",
          "Security groups open to the internet on management ports.",
          "Logging disabled on accounts or regions that 'aren't really used'.",
        ],
      },
      {
        heading: "Shift guardrails left",
        paragraphs: [
          "The cheapest place to fix a misconfiguration is before it's deployed. Policy-as-code checks in your infrastructure-as-code pipeline can block or warn on risky settings at pull-request time, with clear guidance on the fix.",
          "Pair that with organisation-level preventive controls, such as service control policies or Azure Policy, for the handful of things that should never happen anywhere.",
        ],
      },
      {
        heading: "Treat identity as the perimeter",
        paragraphs: [
          "In cloud environments, an over-privileged identity is often more dangerous than an open port. Regularly review who and what can assume powerful roles, remove unused permissions, and prefer short-lived credentials over static keys.",
        ],
        callout: "If you can't say who owns a resource, you can't say whether it's safe.",
      },
      {
        heading: "Make ownership visible",
        paragraphs: [
          "Mandatory tagging for owner, environment and data classification turns every finding into a conversation with a specific person. It also makes cost and risk reporting meaningful for the business.",
        ],
      },
    ],
  },
  {
    slug: "security-awareness-that-changes-behaviour",
    category: "Insight",
    title: "Security awareness that actually changes behaviour",
    excerpt:
      "Annual click-through training ticks a compliance box but rarely changes what people do. What effective, respectful awareness programmes look like in practice.",
    topic: "Security Awareness",
    date: "2026-08-07",
    readTime: "6 min read",
    icon: "graduation",
    takeaways: [
      "Short, frequent and relevant beats long and annual.",
      "Make reporting easy and celebrate it; never shame people who click.",
      "Tailor content to roles: finance, executives and engineers face different threats.",
      "Measure reporting rates, not just click rates.",
    ],
    sections: [
      {
        heading: "Why traditional training falls flat",
        paragraphs: [
          "A once-a-year module, completed at speed to clear a reminder email, does little to change instinctive behaviour. People remember stories and recent experiences, not slide decks from eleven months ago.",
        ],
      },
      {
        heading: "Principles of programmes that work",
        paragraphs: ["Effective awareness programmes tend to share a handful of traits."],
        list: [
          "Little and often: a few minutes each month rather than an hour each year.",
          "Relevant: examples drawn from real attacks on your sector and your tools.",
          "Role-based: finance teams learn invoice fraud; engineers learn credential and supply-chain risks.",
          "Positive: reporting a suspicious email is praised, even when it turns out to be safe.",
        ],
      },
      {
        heading: "Phishing simulations, done respectfully",
        paragraphs: [
          "Simulations are useful when they teach rather than trap. Immediate, friendly feedback after a click, a clear explanation of the warning signs and no public naming keep trust intact.",
          "Avoid lures that exploit genuinely sensitive topics such as pay rises or redundancies. The short-term click rate isn't worth the long-term damage to trust.",
        ],
        callout: "The goal isn't zero clicks. It's fast reporting, so the security team hears about real attacks early.",
      },
      {
        heading: "Measure what matters",
        paragraphs: [
          "Click rate alone can be gamed by easier or harder simulations. Track reporting rate and time-to-report alongside it. A rising reporting rate is one of the clearest signs of a healthy security culture.",
        ],
      },
    ],
  },

  // ─── Guides ────────────────────────────────────────────────────────────────
  {
    slug: "mapping-vulnerabilities-to-compliance",
    category: "Guide",
    title: "Mapping vulnerabilities to compliance frameworks",
    excerpt:
      "A step-by-step approach to connecting day-to-day remediation work with ISO 27001, NIST CSF and PCI DSS requirements, so audit evidence builds itself.",
    topic: "Compliance & Governance",
    date: "2026-10-01",
    readTime: "10 min read",
    icon: "map",
    takeaways: [
      "Map findings to controls once, then reuse that mapping across every framework.",
      "A single control library prevents duplicate work across ISO, NIST and PCI DSS.",
      "Evidence should be a by-product of remediation, captured automatically where possible.",
      "Report compliance posture as trends, not point-in-time snapshots.",
    ],
    sections: [
      {
        heading: "Step 1: Build a unified control library",
        paragraphs: [
          "Most organisations answer to more than one framework. Rather than managing ISO 27001 Annex A, NIST CSF and PCI DSS separately, create one internal control library and map each control to the framework requirements it satisfies.",
          "For example, a single 'vulnerability scanning and remediation' control can satisfy ISO 27001 control 8.8 (management of technical vulnerabilities), NIST CSF identify and protect outcomes, and PCI DSS requirements 6 and 11.",
        ],
      },
      {
        heading: "Step 2: Tag findings to controls",
        paragraphs: [
          "Every vulnerability, misconfiguration or assessment finding should be tagged with the internal control it relates to. Once that tag exists, the framework mapping follows automatically.",
        ],
        list: [
          "Missing patches → vulnerability management control.",
          "Weak password policy → identity and access control.",
          "Unencrypted data store → data protection control.",
          "Absent logging → monitoring and detection control.",
        ],
      },
      {
        heading: "Step 3: Define what good evidence looks like",
        paragraphs: [
          "For each control, agree what an auditor will need to see: scan reports, change tickets, configuration exports, training records. Then identify where that evidence already lives, and how it can be collected without manual effort.",
        ],
        callout: "If evidence collection is a separate project before each audit, the mapping isn't finished yet.",
      },
      {
        heading: "Step 4: Prioritise remediation by control impact",
        paragraphs: [
          "When a single finding affects a control mapped to several frameworks and a critical business service, it deserves higher priority than a technically similar finding on an isolated test system. Combine technical severity, business criticality and compliance impact into one risk score.",
        ],
      },
      {
        heading: "Step 5: Report posture as a trend",
        paragraphs: [
          "Boards and auditors both value direction of travel. Monthly reporting on control coverage, overdue findings and evidence completeness shows whether the organisation is getting more or less compliant over time.",
        ],
        list: [
          "Percentage of controls with current evidence.",
          "Open findings per control, by age.",
          "Mean time to remediate, by severity.",
          "Frameworks affected by overdue findings.",
        ],
      },
    ],
  },
  {
    slug: "business-process-mapping-framework",
    category: "Guide",
    title: "Business process mapping: a starting framework",
    excerpt:
      "Current state, analysis, optimisation, future state. A practical four-stage framework for process discovery that teams can actually follow.",
    topic: "Business Transformation",
    date: "2026-09-10",
    readTime: "9 min read",
    icon: "network",
    takeaways: [
      "Map how work really happens, not how the policy says it happens.",
      "Use a consistent notation such as BPMN so maps can be compared and reused.",
      "Quantify waste: handoffs, waits, rework and manual data entry.",
      "Design the future state with the people who will run it.",
    ],
    sections: [
      {
        heading: "Stage 1: Capture the current state",
        paragraphs: [
          "Start by mapping the process as it actually runs today. Interview the people who do the work, observe it where possible, and gather real examples such as forms, emails and system screens.",
          "Resist the urge to tidy the map. The workarounds, spreadsheets and side conversations are often where the most valuable insights hide.",
        ],
        list: [
          "Define a clear start trigger and end outcome.",
          "Identify every role and system involved.",
          "Record handoffs, approvals and waiting points.",
          "Note volumes and timings wherever you can.",
        ],
      },
      {
        heading: "Stage 2: Analyse for waste and risk",
        paragraphs: [
          "With a current-state map in hand, look for the classic sources of waste: unnecessary handoffs, duplicate data entry, long waits for approval and rework loops caused by poor inputs.",
          "Look for risk too. Where does sensitive data leave a controlled system? Where could one person make an unchecked change? Process analysis is an excellent, often overlooked, source of security insight.",
        ],
      },
      {
        heading: "Stage 3: Optimise",
        paragraphs: [
          "Generate improvement options and score them on effort, impact and risk. Quick wins, such as removing a redundant approval or standardising a form, build momentum for bigger changes.",
        ],
        callout: "Eliminate before you automate. Every removed step is one you never have to maintain.",
      },
      {
        heading: "Stage 4: Design the future state",
        paragraphs: [
          "Model the improved process in the same notation, with clear roles, controls and metrics. Validate it with the people who will run it; their buy-in matters more than the elegance of the diagram.",
          "Finish with a roadmap: what changes first, what depends on technology, and how success will be measured.",
        ],
      },
    ],
  },
  {
    slug: "pci-dss-v4-practical-checklist",
    category: "Guide",
    title: "PCI DSS v4.0: a practical readiness checklist",
    excerpt:
      "PCI DSS v4.0's future-dated requirements are now in force. A practical checklist for merchants and service providers to confirm they're covered.",
    topic: "Compliance & Governance",
    date: "2026-08-28",
    readTime: "8 min read",
    icon: "credit-card",
    takeaways: [
      "Reducing cardholder data scope is still the most effective compliance strategy.",
      "v4.0 places more emphasis on targeted risk analysis and continuous controls.",
      "MFA is now expected for all access into the cardholder data environment.",
      "Payment page script management is a common gap for e-commerce merchants.",
    ],
    sections: [
      {
        heading: "Start by shrinking scope",
        paragraphs: [
          "The fewer systems that store, process or transmit cardholder data, the fewer controls you need to evidence. Tokenisation, hosted payment pages and network segmentation remain the most powerful ways to reduce PCI DSS effort.",
        ],
      },
      {
        heading: "Checklist: key v4.0 areas",
        paragraphs: ["Use this list to sense-check readiness against areas that commonly need work under v4.0."],
        list: [
          "Multi-factor authentication for all access into the cardholder data environment.",
          "Targeted risk analyses documented for requirements that allow flexible frequencies.",
          "Inventory and authorisation of scripts running on payment pages, with tamper detection.",
          "Automated mechanisms to detect and protect against phishing for relevant personnel.",
          "Stronger password requirements, or equivalent controls, for user and system accounts.",
          "Authenticated internal vulnerability scanning.",
          "Review of all third-party service providers and their responsibilities.",
        ],
      },
      {
        heading: "Make controls continuous",
        paragraphs: [
          "v4.0 encourages organisations to treat security as an ongoing process rather than an annual exercise. Where possible, automate control checks and evidence collection so compliance status is visible all year round.",
        ],
        callout: "If a control only gets checked the month before the assessment, it's a weak control.",
      },
      {
        heading: "Prepare your evidence pack",
        paragraphs: [
          "Organise evidence by requirement, keep it current and assign an owner to each area. A well-structured evidence pack shortens assessments and reduces the risk of last-minute surprises.",
        ],
      },
    ],
  },
  {
    slug: "incident-response-first-72-hours",
    category: "Guide",
    title: "Incident response: the first 72 hours",
    excerpt:
      "What to do, in what order, when a serious cyber incident is confirmed. A practical timeline covering containment, evidence, communication and UK regulatory duties.",
    topic: "Incident Readiness",
    date: "2026-08-14",
    readTime: "10 min read",
    icon: "siren",
    takeaways: [
      "Contain first, but preserve evidence while you do it.",
      "Under UK GDPR, notifiable personal data breaches must be reported to the ICO within 72 hours of awareness.",
      "Use out-of-band communication if corporate email or chat may be compromised.",
      "Keep a single, timestamped incident log from minute one.",
    ],
    sections: [
      {
        heading: "Hour 0–4: Confirm, assemble, contain",
        paragraphs: [
          "Once an incident is confirmed, assemble the response team and appoint an incident lead with clear authority. Start an incident log immediately, recording every decision and action with timestamps.",
          "Contain the spread: isolate affected hosts, disable compromised accounts and block known malicious infrastructure. Where possible, capture memory and disk images of key systems before rebuilding them.",
        ],
        list: [
          "Appoint an incident lead and a scribe.",
          "Switch to out-of-band communication if needed.",
          "Isolate rather than power off affected systems where evidence matters.",
          "Engage external incident response support early if required.",
        ],
      },
      {
        heading: "Hour 4–24: Scope and understand",
        paragraphs: [
          "Determine how the attacker got in, what they accessed and whether they still have access. Review authentication logs, endpoint telemetry and network data. Assume persistence until proven otherwise.",
          "Start assessing whether personal data has been affected, as this drives regulatory obligations.",
        ],
      },
      {
        heading: "Hour 24–72: Notify and stabilise",
        paragraphs: [
          "Under UK GDPR, a personal data breach likely to pose a risk to individuals must be reported to the ICO within 72 hours of becoming aware of it. Other obligations may apply depending on your sector, contracts and insurance policy.",
          "Prepare clear, factual communications for staff, customers and partners. Avoid speculation; it's better to say what you know and when you'll update next.",
        ],
        callout: "You can submit an initial ICO report and follow up with more detail as the investigation progresses.",
      },
      {
        heading: "After 72 hours: Recover and learn",
        paragraphs: [
          "Restore services from known-good backups, reset credentials broadly and monitor closely for signs of re-entry. Once stable, hold a blameless post-incident review and turn lessons into tracked improvements.",
        ],
        list: [
          "Validate backups are clean before restoring.",
          "Rotate credentials, keys and secrets that may have been exposed.",
          "Increase monitoring on affected systems for several weeks.",
          "Update playbooks with what you learned.",
        ],
      },
    ],
  },
];

export function articleHref(article: Pick<Article, "category" | "slug">): string {
  if (article.category === "Blog") return `/blog/${article.slug}`;
  return `/resources/${article.category === "Guide" ? "guides" : "insights"}/${article.slug}`;
}
