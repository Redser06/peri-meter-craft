---
project: perimeter
audiences: [trainee, manager]
track_count: 11
tracks:
  - { id: "01", title: "Problem framing" }
  - { id: "02", title: "Outcome specification" }
  - { id: "03", title: "Discovery interviews" }
  - { id: "04", title: "Opportunity sizing" }
  - { id: "05", title: "Solution shaping" }
  - { id: "06", title: "Experiment design" }
  - { id: "07", title: "Delivery planning" }
  - { id: "08", title: "Instrumentation" }
  - { id: "09", title: "Stakeholder narrative" }
  - { id: "10", title: "Launch and adoption" }
  - { id: "11", title: "Return review" }
---

# Perimeter

Perimeter is a brand-neutral workspace for product managers learning to ship with AI. It is written for two audiences: trainees moving through the curriculum, and managers reading time saved.

ROI rates are guesstimates and overridable. The only copy of the default rates lives in `src/config/roiDefaults.ts`.

## Trainee

Open `/learn` for the eleven tracks, then `/learn/track/:id` for one track. Tracks are a directed graph: finish the prerequisite before the next track.

## Manager

Open `/manager/roi` for the return estimate. Counts and rates are inputs, so a manager can override the guesstimate defaults. Open `/manager/team` for assigned learners.

## Local development

```sh
npm ci
npm run dev
```

Copy `.env.example` to `.env` and fill in the placeholder names with your own project values. Do not commit `.env`.

## Checks

```sh
npm run lint
npm test
npm run build
python3 tools/eval_runner.py validate-graph --graph projects/perimeter/perimeter-phase1.graph-v2.yaml --registry tools/gates/registry.json --registry gates/perimeter-phase1.registry.json
python3 scripts/gates/run_all.py
```

Continuous integration runs those checks with a fake model provider, no paid keys, and no outbound eval calls. The monthly model-spend cap fails closed when the ledger is missing, unparseable, or exhausted.
