# PERI-METER Transformation Blueprint

This document specifies the competencies, engineering techniques, verified deliverables, and fail-closed evaluation gates for the 11 capability tracks in PERI-METER.

---

## Track 01 — Prompt-to-App Prototyping Runtime
- **Competencies**: Headless code generation runtime orchestration, isolated workspace sandboxing, interactive web preview deployment.
- **Techniques**: Prompt decomposition, Vite/React scaffolding, Tailwind component synthesis, preview channel generation.
- **Deliverables**: Working multi-screen web application deployed to preview environment within 2 hours of conception.
- Eval gate: `perimeter_neutral_brand_clean`

---

## Track 02 — Synthetic Customer Persona Cohort Validation
- **Competencies**: Persona simulation design, structured survey prompting, quantitative sentiment & friction extraction.
- **Techniques**: Batch persona prompting (500+ diverse demographic profiles), response parsing with Pydantic validation, Monte Carlo sensitivity analysis.
- **Deliverables**: Synthetic validation report assessing product-market fit, pricing tolerance, and onboarding churn vectors.
- Eval gate: `perimeter_eval_suite_deterministic`

---

## Track 03 — Direct-to-GitHub PR Authoring & CI Verification
- **Competencies**: Git branch management, atomic commit conventions, pull request description contracts, CI verification.
- **Techniques**: Local branch management, GitHub CLI (`gh pr create`), automated linting and typecheck verification.
- **Deliverables**: Merged GitHub Pull Request containing clean application code, comprehensive diff justification, and green CI checks.
- Eval gate: `perimeter_protected_files`

---

## Track 04 — Contract-Driven Engineer Agent Pairing
- **Competencies**: Machine-readable specification authoring, interface boundary design, schema synchronization across runtimes.
- **Techniques**: Pydantic schema generation, TypeScript type synthesis, OpenAPI 3.1 contract formulation, round-trip serialization tests.
- **Deliverables**: Synchronized TypeScript and Python schema definitions with automated round-trip serialization verification.
- Eval gate: `perimeter_pydantic_schema_sync`

---

## Track 05 — Frontier Tool & Provider Orchestration
- **Competencies**: LLM provider abstraction, cost ceiling enforcement, model capability matching (Gemini 3.8 Flash baseline).
- **Techniques**: Provider-agnostic client facades, deterministic mocking in CI, hard monthly budget enforcement guards ($5.00/month cap).
- **Deliverables**: Provider client supporting streaming and tool calls with automated zero-cost CI mocks and fail-closed budget checks.
- Eval gate: `perimeter_ledger_cap_enforced`

---

## Track 06 — Autonomous Loops & MCP Server Integration
- **Competencies**: Model Context Protocol (MCP) server development, agentic tool execution loops, resource exposure.
- **Techniques**: JSON-RPC transport over STDIO, tool schema definitions, stateful conversation step execution.
- **Deliverables**: Working MCP server exposing local domain tools and resources to autonomous agent clients.
- Eval gate: `perimeter_state_delta_valid`

---

## Track 07 — Workflow Graph Systems & Evaluation Gates
- **Competencies**: Directed Acyclic Graph (DAG) workflow design, multi-stage state transitions, dependency ordering.
- **Techniques**: Topological sorting, cycle detection, fail-closed gate evaluation (`eval_runner.py`), retry and escalation policies.
- **Deliverables**: Formal YAML workflow graph connecting preflight checks, human approval gates, implementation nodes, and proofs.
- Eval gate: `perimeter_curriculum_dag_acyclic`

---

## Track 08 — Fail-Closed Property Testing & Scenario Replay
- **Competencies**: Property-based testing, invariant verification, offline deterministic scenario replay harnesses.
- **Techniques**: Seeded pseudo-random state generation, monotonic derivative assertions ($d(\text{ROI})/d(\text{Skills}) \ge 0$), offline fixture replay.
- **Deliverables**: Vitest property test suite with 200+ cases verifying mathematical invariants and Lumina scenario replays.
- Eval gate: `perimeter_roi_monotonic_increasing`

---

## Track 09 — Supervisor-Worker Agent Hierarchies
- **Competencies**: Hierarchical agent routing, error taxonomy classification (misconception vs. slip), human-in-the-loop intervention.
- **Techniques**: Supervisor-worker LangGraph state machines, structured diagnostic assessment, explicit human sign-off logging.
- **Deliverables**: State machine graph routing learner interactions with misconception recovery and immutable human approval checks.
- Eval gate: `perimeter_approval_recorded`

---

## Track 10 — Market Horizon Radar & Frontier Intelligence
- **Competencies**: Systematic tracking of frontier AI capabilities, model release benchmarking, competitive telemetry.
- **Techniques**: Automated changelog scraping, capability delta indexing, radar dashboard visual synthesis.
- **Deliverables**: Interactive market horizon radar visualization categorizing frontier agent models and frameworks.
- Eval gate: `perimeter_stitch_token_valid`

---

## Track 11 — Autonomous GitHub Project Catalogue
- **Competencies**: Repository portfolio management, automated artifact indexing, leadership ROI transparency.
- **Techniques**: GitHub API indexing, dynamic status badge generation, cross-persona route matrix mounting.
- **Deliverables**: Interactive catalogue of deployed prototypes, authored PRs, and team ROI metrics mounted on `/manager/team`.
- Eval gate: `perimeter_journey_matrix_verified`
