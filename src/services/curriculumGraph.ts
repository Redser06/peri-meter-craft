export interface CurriculumTrack {
  id: string;
  title: string;
  gateId: string;
  prerequisites: string[];
}

export const CURRICULUM_TRACKS: CurriculumTrack[] = [
  {
    id: "01",
    title: "Problem framing",
    gateId: "perimeter_track_count_consistent",
    prerequisites: [],
  },
  {
    id: "02",
    title: "Outcome specification",
    gateId: "perimeter_state_delta_valid",
    prerequisites: ["01"],
  },
  {
    id: "03",
    title: "Discovery interviews",
    gateId: "perimeter_readme_rich_contract",
    prerequisites: ["02"],
  },
  {
    id: "04",
    title: "Opportunity sizing",
    gateId: "perimeter_roi_inputs_parametrised",
    prerequisites: ["03"],
  },
  {
    id: "05",
    title: "Solution shaping",
    gateId: "perimeter_stitch_token_valid",
    prerequisites: ["04"],
  },
  {
    id: "06",
    title: "Experiment design",
    gateId: "perimeter_eval_suite_deterministic",
    prerequisites: ["05"],
  },
  {
    id: "07",
    title: "Delivery planning",
    gateId: "perimeter_curriculum_dag_acyclic",
    prerequisites: ["06"],
  },
  {
    id: "08",
    title: "Instrumentation",
    gateId: "perimeter_ledger_cap_enforced",
    prerequisites: ["07"],
  },
  {
    id: "09",
    title: "Stakeholder narrative",
    gateId: "perimeter_docs_diagrams_render",
    prerequisites: ["08"],
  },
  {
    id: "10",
    title: "Launch and adoption",
    gateId: "perimeter_journey_matrix_verified",
    prerequisites: ["09"],
  },
  {
    id: "11",
    title: "Return review",
    gateId: "perimeter_roi_monotonic_increasing",
    prerequisites: ["10"],
  },
];

export function assertCurriculum(tracks: CurriculumTrack[]): void {
  const ids = tracks.map((track) => track.id);
  const unique = new Set(ids);
  if (unique.size !== ids.length) {
    throw new Error("duplicate curriculum track id");
  }
  for (const track of tracks) {
    for (const prerequisite of track.prerequisites) {
      if (!unique.has(prerequisite)) {
        throw new Error(`unknown prerequisite ${prerequisite} on ${track.id}`);
      }
    }
  }
}

export function detectCycle(tracks: CurriculumTrack[]): string[] | null {
  assertCurriculum(tracks);
  const byId = new Map(tracks.map((track) => [track.id, track]));
  const state = new Map<string, "open" | "done">();
  const stack: string[] = [];

  const visit = (id: string): string[] | null => {
    const mark = state.get(id);
    if (mark === "done") return null;
    if (mark === "open") {
      const start = stack.indexOf(id);
      return stack.slice(start).concat(id);
    }
    state.set(id, "open");
    stack.push(id);
    for (const prerequisite of byId.get(id)?.prerequisites ?? []) {
      const cycle = visit(prerequisite);
      if (cycle) return cycle;
    }
    stack.pop();
    state.set(id, "done");
    return null;
  };

  const ordered = [...tracks].sort((a, b) => a.id.localeCompare(b.id));
  for (const track of ordered) {
    const cycle = visit(track.id);
    if (cycle) return cycle;
  }
  return null;
}

export function topoSort(tracks: CurriculumTrack[]): string[] {
  assertCurriculum(tracks);
  if (detectCycle(tracks)) {
    throw new Error("curriculum graph has a cycle");
  }
  const indegree = new Map<string, number>();
  const dependents = new Map<string, string[]>();
  for (const track of tracks) {
    indegree.set(track.id, track.prerequisites.length);
    dependents.set(track.id, []);
  }
  for (const track of tracks) {
    for (const prerequisite of track.prerequisites) {
      dependents.get(prerequisite)?.push(track.id);
    }
  }
  const ready = [...indegree.entries()]
    .filter(([, degree]) => degree === 0)
    .map(([id]) => id)
    .sort((a, b) => a.localeCompare(b));
  const ordered: string[] = [];
  while (ready.length > 0) {
    const id = ready.shift() as string;
    ordered.push(id);
    const next = (dependents.get(id) ?? []).slice().sort((a, b) => a.localeCompare(b));
    for (const dependent of next) {
      const degree = (indegree.get(dependent) ?? 0) - 1;
      indegree.set(dependent, degree);
      if (degree === 0) {
        ready.push(dependent);
        ready.sort((a, b) => a.localeCompare(b));
      }
    }
  }
  if (ordered.length !== tracks.length) {
    throw new Error("curriculum graph has a cycle");
  }
  return ordered;
}
