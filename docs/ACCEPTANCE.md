# Acceptance map

| Criterion | Proof |
| --- | --- |
| Environment file is untracked, ignored, and the example has placeholders only | scripts/gates/check_no_secrets.py |
| Eleven tracks are listed in the spec, the readme, and the blueprint | scripts/gates/check_track_count.py |
| Rate defaults are guesstimates and live in one module | src/config/roiDefaults.ts |
| Return is monotonic across a seeded property test | tests/roi_property.test.ts |
| Hours and USD follow the published formula | src/services/roiCalculator.ts |
| Vitest is pinned and the test script exists | scripts/gates/check_test_harness.py |
| Report and eval steps keep running when the job is cancelled | .github/workflows/ci.yml |
| Model calls use a fake provider and reject paid providers | src/services/llmProvider.ts |
| The monthly cap fails closed | src/services/ledgerGuard.ts |
| Ledger cases cover under, at, over, missing, and unparseable | tests/fixtures/ledger_cases.json |
| Each gate reports the verdict contract | scripts/gates/contract.py |
| A gate fails when it runs fewer cases than its minimum | scripts/gates/contract.py |
| Protected project files stay unchanged aside from the pre-approved ignore entries | scripts/gates/check_protected_files.py |
| Product copy does not carry the previous host brand | scripts/gates/check_neutral_branding.py |
| The workflow graph resolves every gate | tools/eval_runner.py |
| Curriculum, learner, and manager state types exist | src/types/perimeter.ts |
| Python state schemas match those types | schemas/perimeter_state.py |
| State values round-trip | tests/state_delta.test.ts |
| Neutral craft tokens are declared | src/types/stitch.ts |
| Trainee and manager routes mount | tests/journey_matrix.test.tsx |
| The trainee and manager route table is shared | src/journeyRoutes.tsx |
| The curriculum is an eleven-node acyclic graph | src/services/curriculumGraph.ts |
| Curriculum checks are deterministic | tests/curriculum_evals.test.ts |
| Every blueprint track names a registered gate | docs/TRANSFORMATION_BLUEPRINT.md |
| Journey maps name the trainee and manager routes | docs/JOURNEY_MAPS.md |
| Diagrams are flowchart, sequence, or state | scripts/gates/check_mermaid_types.py |
| Tracked files do not contain local machine paths | scripts/gates/check_no_local_paths.py |
| The readme serves trainees and managers | README.md |
| Key rotation stays a human step | approvals/KEY_ROTATION_PENDING.md |
| Graph approval is bound to the graph file hash and is pending Conor's countersignature | approvals/GRAPH_APPROVAL_PENDING.md |
| Lessons from the pack and the review were read | docs/lessons-read.json |
