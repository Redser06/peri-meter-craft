export interface LexiconEntry {
  term: string;
  category: 'AI Engineering' | 'Product' | 'Business' | 'Systems';
  definition: string;
  traditionalPmView: string;
  aiPmParadigm: string;
}

export const PERIMETER_LEXICON: LexiconEntry[] = [
  // --- Modern AI Engineering for PMs ---
  {
    term: 'Model Context Protocol (MCP)',
    category: 'AI Engineering',
    definition: 'An open protocol standardizing how AI models and agents securely query tools, databases, and internal APIs.',
    traditionalPmView: 'Asking engineers to build custom REST integrations for every tool.',
    aiPmParadigm: 'Exposing product schemas and data sources as standardized MCP resources that agent teams can query directly.',
  },
  {
    term: 'Fail-Closed Eval Gate',
    category: 'AI Engineering',
    definition: 'A deterministic evaluation script that halts execution (exit code 1) on missing data, schema violations, or timeouts.',
    traditionalPmView: 'Writing subjective acceptance criteria ("must feel intuitive") checked manually before release.',
    aiPmParadigm: 'Scripted property gates run in CI where the build cannot merge unless mathematical invariants pass.',
  },
  {
    term: 'State Graph & OODA Loop',
    category: 'Systems',
    definition: 'A directed execution graph coordinating autonomous agents through Observe-Orient-Decide-Act iterative cycles.',
    traditionalPmView: 'Writing linear step-by-step business workflow documents.',
    aiPmParadigm: 'Designing declarative state transitions with explicit circuit breakers and retry limits.',
  },
  {
    term: 'Property Testing',
    category: 'AI Engineering',
    definition: 'Testing invariant mathematical behaviors (monotonicity, idempotence, round-trips) rather than hardcoded magic numbers.',
    traditionalPmView: 'Writing static user acceptance test (UAT) scripts for happy paths.',
    aiPmParadigm: 'Asserting system guarantees over hundreds of seeded randomized perturbations.',
  },
  {
    term: 'Thinking Budget & Reasoning Tokens',
    category: 'AI Engineering',
    definition: 'Configuring model inference depth to allocate compute to planning before generating output tokens.',
    traditionalPmView: 'Prompt engineering via trial-and-error in a chat window.',
    aiPmParadigm: 'Cost-budgeted inference routing: cheap models for classification, reasoning models for architectural planning.',
  },
  // --- Foundational Product & Metrics (Adapted from Trainer) ---
  {
    term: 'PRD (Product Requirements Document)',
    category: 'Product',
    definition: 'The foundational artifact capturing problem definition, user journey, and success criteria.',
    traditionalPmView: 'A 20-page Confluence document handed off to engineering at sprint planning.',
    aiPmParadigm: 'An executable specification pairing live prototypes, OpenAPI schemas, and property evals.',
  },
  {
    term: 'MVP (Minimum Viable Product)',
    category: 'Product',
    definition: 'The smallest unit of software that delivers measurable customer value and generates empirical learning.',
    traditionalPmView: 'A stripped-down feature taking 6-8 weeks of engineering sprint time.',
    aiPmParadigm: 'A working full-stack prototype deployed in hours via prompt-to-app runtimes to validate customer intent.',
  },
  {
    term: 'PII & Security Boundaries',
    category: 'Systems',
    definition: 'Information permitting user identity inference, subject to GDPR, HIPAA, and strict data leakage controls.',
    traditionalPmView: 'Relying on security teams during quarterly reviews.',
    aiPmParadigm: 'Automated offline CI gates ensuring no live credentials or un-sanitized user prompts reach external model providers.',
  },
  {
    term: 'ARR & ROI Velocity',
    category: 'Business',
    definition: 'Annual Recurring Revenue and the economic return on software development investments.',
    traditionalPmView: 'Measuring PM performance by story points delivered per sprint.',
    aiPmParadigm: 'Measuring PM performance by engineering capacity unblocked, prototype velocity, and verified PRs shipped.',
  },
];
