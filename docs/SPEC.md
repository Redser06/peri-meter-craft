# Perimeter specification

The curriculum has 11 tracks (01-11). Any list of ten capabilities is out of date.

- id: "01", title: "Problem framing"
- id: "02", title: "Outcome specification"
- id: "03", title: "Discovery interviews"
- id: "04", title: "Opportunity sizing"
- id: "05", title: "Solution shaping"
- id: "06", title: "Experiment design"
- id: "07", title: "Delivery planning"
- id: "08", title: "Instrumentation"
- id: "09", title: "Stakeholder narrative"
- id: "10", title: "Launch and adoption"
- id: "11", title: "Return review"

ROI rates are guesstimates. They are overridable inputs. Defaults are defined only in `src/config/roiDefaults.ts`.

Hours saved = pull requests × hours per pull request + prototypes × hours per prototype. USD saved = hours saved × USD per hour.

The model-spend ledger has a monthly cap and fails closed when the ledger is missing, unparseable, or at the cap.

Protected paths are `supabase/config.toml`, `.gitignore`, and `supabase/migrations`. The environment-file entries added to `.gitignore` during cleanup are the pre-approved exception.
