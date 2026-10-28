// Deeper content for each service page, keyed like lib/service-detail-data.ts. None of these sentences are
// used anywhere else on the site; the "What we do / What you get" lists stay in service-detail-data.ts.
export interface ServiceDepth {
  /** Problems a buyer recognises, shown under "Sound familiar?". */
  challenges: string[];
  steps: { title: string; detail: string }[];
  faqs: { q: string; a: string }[];
}

export const serviceDepth: Record<string, ServiceDepth> = {
  "cloud-devops-security": {
    challenges: [
      "Nobody can say with confidence how many cloud accounts the business owns.",
      "Engineers have admin rights everywhere because tightening them once broke a release.",
      "Security reviews happen after deployment, when fixes are expensive.",
    ],
    steps: [
      { title: "Inventory", detail: "Enumerate accounts, subscriptions and projects, and who can reach each one." },
      { title: "Check", detail: "Score configuration against CIS controls and rank misconfigurations by blast radius." },
      { title: "Shift left", detail: "Add policy-as-code and secret scanning to pipelines so the same mistakes stop recurring." },
      { title: "Hand over", detail: "Guardrails, dashboards and runbooks your platform team owns from then on." },
    ],
    faqs: [
      { q: "Will this slow our deployments?", a: "Checks are tuned to fail builds only for high-severity issues; everything else becomes a ticket, so delivery speed stays the same." },
      { q: "Do you need production access?", a: "Read-only roles are enough for the review. Any change is made through your own pipeline with your approval." },
    ],
  },
  "vulnerability-management": {
    challenges: [
      "The scanner reports thousands of findings and the backlog only ever grows.",
      "Fix requests bounce between teams because nobody knows who owns the asset.",
      "Leadership asks whether risk is improving and there's no clear answer.",
    ],
    steps: [
      { title: "Baseline", detail: "Agree scope, connect or deploy scanning and build an owner for every asset." },
      { title: "Triage", detail: "Combine exploit data with asset value to produce a short, defensible fix list." },
      { title: "Route", detail: "Push remediation work into the tools each team already uses, with clear SLAs." },
      { title: "Verify", detail: "Rescan to confirm fixes and report the trend every month." },
    ],
    faqs: [
      { q: "Can you use our existing scanner?", a: "Yes. We work with Tenable, Qualys, Rapid7, Defender and open-source tools, and only recommend changing if coverage is genuinely missing." },
      { q: "Is this a one-off or ongoing?", a: "Most clients run it as a monthly cycle, but we can deliver a single cleanup sprint to clear an inherited backlog." },
    ],
  },
  "compliance-governance": {
    challenges: [
      "A big customer wants ISO 27001 or Cyber Essentials Plus before signing.",
      "Policies were copied from a template and nobody follows them.",
      "Last year's audit raised findings that are still open.",
    ],
    steps: [
      { title: "Gap analysis", detail: "Measure today's controls against the standard and size the work honestly." },
      { title: "Author", detail: "Write policies, the risk register and the Statement of Applicability with your owners." },
      { title: "Evidence", detail: "Run the controls for long enough to produce real evidence, with internal audit checks." },
      { title: "Certify", detail: "Prepare the team, attend the audit and close any findings quickly." },
    ],
    faqs: [
      { q: "How long does ISO 27001 take?", a: "For a well-run organisation of under 200 people, six to nine months is typical from gap analysis to certification." },
      { q: "Do you act as the certification body?", a: "No. Independence matters, so we prepare you and a UKAS-accredited body carries out the audit." },
    ],
  },
  "it-ot-security": {
    challenges: [
      "The plant network was never designed with security in mind, and it shows.",
      "IT wants to patch; engineering won't risk touching a working controller.",
      "Integrators still have remote access from a project finished years ago.",
    ],
    steps: [
      { title: "Listen", detail: "Passive network monitoring to see every device and conversation on the plant floor." },
      { title: "Grade", detail: "Rate each zone against IEC 62443 security levels and the hazards it controls." },
      { title: "Segment", detail: "Design zones and conduits, then introduce them in planned shutdown windows." },
      { title: "Rehearse", detail: "Run a joint IT and engineering exercise on losing a production line." },
    ],
    faqs: [
      { q: "Will discovery affect production?", a: "No. Discovery is passive, using a mirror port, so no packets are sent to controllers." },
      { q: "Do you work with our OEMs?", a: "Yes. Vendor engineers are involved in segmentation design so warranties and support agreements are respected." },
    ],
  },
  "ai-threat-triage": {
    challenges: [
      "Analysts close most alerts as false positives and still miss the real ones.",
      "The night shift is one person, and response quality varies with fatigue.",
      "Alert rules were written years ago and nobody dares retire them.",
    ],
    steps: [
      { title: "Measure", detail: "Profile alert volume, sources and outcomes over a recent period." },
      { title: "Enrich", detail: "Add identity, asset and threat-intelligence context automatically to every alert." },
      { title: "Rank", detail: "Train scoring on your past dispositions and validate it against analyst decisions." },
      { title: "Set limits", detail: "Define which actions AI may suggest and which always need a human." },
    ],
    faqs: [
      { q: "Will AI close alerts on its own?", a: "Only categories you approve, such as known-benign noise. Anything that could involve containment stays with an analyst." },
      { q: "Which SIEMs does this work with?", a: "Sentinel, Splunk, Elastic and most platforms with an API. We integrate rather than replace." },
    ],
  },
  "security-assessment": {
    challenges: [
      "You've never had an independent look at how an attacker would see you.",
      "A board member or insurer has asked how secure the business really is.",
      "A merger, new system or office move has changed your environment.",
    ],
    steps: [
      { title: "Scope", detail: "Agree targets, rules of engagement and testing windows in writing." },
      { title: "Test", detail: "Manual testing supported by tooling, focused on chained, realistic attack paths." },
      { title: "Write up", detail: "Evidence for every finding, with reproduction steps and fix guidance." },
      { title: "Retest", detail: "Confirm critical and high findings are fixed, included in the price." },
    ],
    faqs: [
      { q: "Is this the same as a penetration test?", a: "It includes one, plus configuration reviews and interviews, so you also learn why weaknesses exist." },
      { q: "Can testing cause outages?", a: "Risky techniques are agreed in advance and run in agreed windows; we stop and call you if anything looks unstable." },
    ],
  },
  "incident-readiness": {
    challenges: [
      "The incident plan is a document nobody has opened since it was written.",
      "It's unclear who can decide to take systems offline or contact the ICO.",
      "Your cyber insurer is asking for evidence of tested response plans.",
    ],
    steps: [
      { title: "Review", detail: "Read existing plans, contracts and insurance terms to find the gaps." },
      { title: "Write", detail: "Short, scenario-specific playbooks with named roles and decision points." },
      { title: "Exercise", detail: "Run a realistic tabletop with executives and technical leads, with injects that build pressure." },
      { title: "Improve", detail: "Turn lessons into a tracked action list and re-test within a year." },
    ],
    faqs: [
      { q: "Do you provide incident response if we're attacked?", a: "We'll help you coordinate and make decisions. For forensic investigation we work alongside NCSC-assured responders or your insurer's panel firm." },
      { q: "How long is a tabletop exercise?", a: "Two to three hours for an executive session; a technical exercise can run a full day." },
    ],
  },
  "security-awareness": {
    challenges: [
      "Annual e-learning gets clicked through with the sound off.",
      "Finance has nearly paid a fake invoice more than once.",
      "Staff are unsure how to report something suspicious, so they don't.",
    ],
    steps: [
      { title: "Gauge", detail: "An unannounced phishing baseline and a short culture survey." },
      { title: "Target", detail: "Tailor content to the roles attackers aim at most." },
      { title: "Practise", detail: "Monthly simulations and two-minute lessons triggered by real mistakes." },
      { title: "Share results", detail: "Quarterly results by department, shared with leadership." },
    ],
    faqs: [
      { q: "Is phishing simulation fair on staff?", a: "Yes, when it's framed as practice. We never name individuals to management, and every click leads to a short lesson rather than a reprimand." },
      { q: "Can content be branded for us?", a: "Yes. Lessons use your logo, systems and real policy wording so they feel internal." },
    ],
  },
  "process-modelling": {
    challenges: [
      "Everyone describes the same process differently.",
      "Work gets stuck in inboxes and spreadsheets between departments.",
      "You want to automate, but nobody's sure what the process actually is.",
    ],
    steps: [
      { title: "Observe", detail: "Workshops and job shadowing with the people who do the work." },
      { title: "Map", detail: "Validated as-is BPMN models with timings at every step." },
      { title: "Reimagine", detail: "To-be options compared on effort, savings and risk." },
      { title: "Transition", detail: "A sequenced change plan and ready-to-build requirements." },
    ],
    faqs: [
      { q: "Which modelling tools do you use?", a: "Signavio, Camunda Modeler, Bizagi or Visio, whichever your teams already have. Models are standard BPMN 2.0, so you're never locked in." },
      { q: "How many processes can you map at once?", a: "A typical engagement covers three to six end-to-end processes in six to eight weeks." },
    ],
  },
  "business-analysis": {
    challenges: [
      "Security asks for budget in technical terms the board can't weigh.",
      "Projects stall because requirements were never written down.",
      "There's no shared view of which services the business can't live without.",
    ],
    steps: [
      { title: "Understand", detail: "Interview stakeholders across security, operations and finance." },
      { title: "Quantify", detail: "Model likely loss scenarios in money and downtime." },
      { title: "Specify", detail: "Turn priorities into user stories with acceptance criteria." },
      { title: "Accept", detail: "Stay through delivery to answer questions and accept work." },
    ],
    faqs: [
      { q: "What quantification method do you use?", a: "A practical FAIR-style approach with ranges rather than false precision, so decisions are based on realistic bounds." },
      { q: "Can you work inside our agile teams?", a: "Yes. Our analysts often act as product owner or BA within existing scrum teams." },
    ],
  },
  "web-development": {
    challenges: [
      "The current site is slow, hard to edit and fails accessibility checks.",
      "Every content change needs a developer.",
      "Organic traffic is falling and nobody knows why.",
    ],
    steps: [
      { title: "Research", detail: "Analytics review and interviews to understand who visits and why." },
      { title: "Sketch", detail: "Wireframes, prototypes and a design system tested with real users." },
      { title: "Develop", detail: "Performance budgets, WCAG 2.2 AA and SEO baked into every component." },
      { title: "Launch", detail: "Redirect mapping, monitoring and training for your editors." },
    ],
    faqs: [
      { q: "Which CMS do you recommend?", a: "It depends on your team; we often use Sanity, Contentful or WordPress as a headless CMS behind a Next.js front end." },
      { q: "Will we lose search rankings when we relaunch?", a: "Not if migration is handled properly. Every old URL is mapped and redirected, and rankings are monitored for 90 days." },
    ],
  },
  "software-engineering": {
    challenges: [
      "A critical internal tool lives in one person's head.",
      "Releases are risky, so they happen rarely.",
      "Integrations between systems keep breaking.",
    ],
    steps: [
      { title: "Clarify", detail: "Clarify users, workflows and the integrations the app depends on." },
      { title: "Structure", detail: "Choose a stack and data model that fit your team's skills." },
      { title: "Iterate", detail: "Fortnightly demos of working software you can test yourselves." },
      { title: "Maintain", detail: "Monitoring, bug fixing and a roadmap after launch." },
    ],
    faqs: [
      { q: "Who owns the code?", a: "You do, from the first commit. Repositories live in your organisation." },
      { q: "Can you take over an existing codebase?", a: "Yes. We start with a short audit covering quality, security and test coverage before agreeing a plan." },
    ],
  },
  "digital-platforms": {
    challenges: [
      "Several products each have their own login, data and infrastructure.",
      "Cloud costs keep rising with no clear reason.",
      "An outage last year took everything down at once.",
    ],
    steps: [
      { title: "Survey", detail: "Review current architecture, costs and failure points." },
      { title: "Blueprint", detail: "Target platform architecture with shared services and clear boundaries." },
      { title: "Codify", detail: "Everything defined in Terraform, reviewed and versioned." },
      { title: "Migrate", detail: "Move services in stages with rollback plans at every step." },
    ],
    faqs: [
      { q: "AWS, Azure or Google Cloud?", a: "We're cloud-agnostic and usually recommend staying where your skills and contracts already are." },
      { q: "Do you offer managed hosting?", a: "We can run the platform for an agreed period, but we design it so your team can take over." },
    ],
  },
  "ai-strategy": {
    challenges: [
      "Staff are already using public AI tools with company data.",
      "Several AI pilots exist, but none have reached production.",
      "The board wants an AI plan and a clear view of the risks.",
    ],
    steps: [
      { title: "Explore", detail: "Workshops with each function to collect candidate use cases." },
      { title: "Score", detail: "Rate each one on value, data readiness, feasibility and risk." },
      { title: "Safeguard", detail: "Draft an acceptable-use policy and model-risk process." },
      { title: "Plan", detail: "A 12-month roadmap with owners, budgets and success measures." },
    ],
    faqs: [
      { q: "Are you tied to an AI vendor?", a: "No. We compare OpenAI, Anthropic, Google, Microsoft and open-source models on your use case and data constraints." },
      { q: "How long does a strategy take?", a: "Usually four to six weeks, ending with a board-ready roadmap." },
    ],
  },
  "intelligent-automation": {
    challenges: [
      "Skilled people spend hours copying data between systems.",
      "Approvals sit in inboxes for days.",
      "Previous automation attempts became brittle and were abandoned.",
    ],
    steps: [
      { title: "Select", detail: "Pick processes with high volume, clear rules and measurable delay." },
      { title: "Assemble", detail: "Develop workflows and AI steps with exception handling from the start." },
      { title: "Pilot", detail: "Run alongside the manual process until accuracy is proven." },
      { title: "Scale", detail: "Roll out with monitoring, alerting and a named business owner." },
    ],
    faqs: [
      { q: "What happens when the AI is unsure?", a: "Low-confidence cases are routed to a person with the AI's suggestion attached, so nothing slips through." },
      { q: "Do we need new licences?", a: "Often not. Many clients already own Power Automate through Microsoft 365, and we'll use it where it fits." },
    ],
  },
  "ai-ml": {
    challenges: [
      "Reports disagree because every team calculates numbers differently.",
      "Forecasts are built in spreadsheets and refreshed by hand.",
      "There's plenty of data but little insight from it.",
    ],
    steps: [
      { title: "Audit", detail: "Assess data sources, quality and how data is accessed today." },
      { title: "Train", detail: "Build and evaluate models against a simple baseline first." },
      { title: "Visualise", detail: "Dashboards designed around the decisions people need to make." },
      { title: "Sustain", detail: "Monitoring for drift, with scheduled retraining and ownership." },
    ],
    faqs: [
      { q: "How much data do we need?", a: "Less than most people think for many problems; we'll tell you honestly if your data can't support a reliable model yet." },
      { q: "Where does our data go?", a: "It stays in your cloud tenancy. Models are trained and hosted inside your environment." },
    ],
  },
};
