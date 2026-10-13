# PERI-METER Acceptance Criteria & Proof Locations

| Criterion | Proof Location |
| :--- | :--- |
| AC-1: Brand Neutrality | `scripts/gates/check_neutral_branding.py` |
| AC-2: Dual Audience README | `README.md` |
| AC-3: Stitch Design System Tokens | `src/types/stitch.ts` |
| AC-4: Curriculum DAG Topology | `src/services/curriculumGraph.ts` |
| AC-5: Monotonic ROI Calculator | `src/services/roiCalculator.ts` |
| AC-6: Cost Ledger $5 Cap | `src/services/ledgerGuard.ts` |
| AC-7: Offline Scenario Replay | `tests/scenario_evals.test.ts` |
| AC-8: State Delta Invariance | `tests/state_delta.test.ts` |
| AC-9: Journey Matrix Mounts | `tests/journey_matrix.test.tsx` |
| AC-10: Protected Files Preserved | `scripts/gates/check_protected_files.py` |
