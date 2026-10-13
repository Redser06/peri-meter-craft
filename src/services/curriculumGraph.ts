export interface CurriculumTrackNode {
  id: string;
  title: string;
  gateId: string;
  prerequisites: string[];
}

export const CURRICULUM_TRACKS: CurriculumTrackNode[] = [
  {
    id: "01",
    title: "Prompt-to-App Prototyping Runtime",
    gateId: "perimeter_neutral_brand_clean",
    prerequisites: [],
  },
  {
    id: "02",
    title: "Synthetic Customer Persona Cohort Validation",
    gateId: "perimeter_eval_suite_deterministic",
    prerequisites: ["01"],
  },
  {
    id: "03",
    title: "Direct-to-GitHub PR Authoring & CI Verification",
    gateId: "perimeter_protected_files",
    prerequisites: ["01"],
  },
  {
    id: "04",
    title: "Contract-Driven Engineer Agent Pairing",
    gateId: "perimeter_pydantic_schema_sync",
    prerequisites: ["03"],
  },
  {
    id: "05",
    title: "Frontier Tool & Provider Orchestration",
    gateId: "perimeter_ledger_cap_enforced",
    prerequisites: ["01"],
  },
  {
    id: "06",
    title: "Autonomous Loops & MCP Server Integration",
    gateId: "perimeter_state_delta_valid",
    prerequisites: ["04", "05"],
  },
  {
    id: "07",
    title: "Workflow Graph Systems & Evaluation Gates",
    gateId: "perimeter_curriculum_dag_acyclic",
    prerequisites: ["03", "06"],
  },
  {
    id: "08",
    title: "Fail-Closed Property Testing & Scenario Replay",
    gateId: "perimeter_roi_monotonic_increasing",
    prerequisites: ["04", "07"],
  },
  {
    id: "09",
    title: "Supervisor-Worker Agent Hierarchies",
    gateId: "perimeter_approval_recorded",
    prerequisites: ["07", "08"],
  },
  {
    id: "10",
    title: "Market Horizon Radar & Frontier Intelligence",
    gateId: "perimeter_stitch_token_valid",
    prerequisites: ["02", "05"],
  },
  {
    id: "11",
    title: "Autonomous GitHub Project Catalogue",
    gateId: "perimeter_journey_matrix_verified",
    prerequisites: ["03", "07", "10"],
  },
];

/**
 * Deterministically computes topological sort for the curriculum DAG.
 * Returns track IDs in dependency execution order.
 * Throws an Error if a cycle is detected.
 */
export function topologicalSort(tracks: CurriculumTrackNode[] = CURRICULUM_TRACKS): string[] {
  const indegree = new Map<string, number>();
  const adjacency = new Map<string, string[]>();

  for (const track of tracks) {
    indegree.set(track.id, track.prerequisites.length);
    adjacency.set(track.id, []);
  }

  for (const track of tracks) {
    for (const prereq of track.prerequisites) {
      if (!adjacency.has(prereq)) {
        throw new Error(`Unknown prerequisite track: ${prereq}`);
      }
      adjacency.get(prereq)!.push(track.id);
    }
  }

  const queue: string[] = [];
  for (const [id, degree] of indegree.entries()) {
    if (degree === 0) queue.push(id);
  }
  queue.sort();

  const sorted: string[] = [];
  while (queue.length > 0) {
    const current = queue.shift()!;
    sorted.push(current);

    const dependents = adjacency.get(current) ?? [];
    for (const dep of dependents) {
      const remaining = (indegree.get(dep) ?? 0) - 1;
      indegree.set(dep, remaining);
      if (remaining === 0) {
        queue.push(dep);
        queue.sort();
      }
    }
  }

  if (sorted.length !== tracks.length) {
    throw new Error("Cycle detected in curriculum DAG");
  }

  return sorted;
}

export function isTrackUnlocked(trackId: string, completedTrackIds: string[]): boolean {
  const track = CURRICULUM_TRACKS.find((t) => t.id === trackId);
  if (!track) return false;
  return track.prerequisites.every((prereq) => completedTrackIds.includes(prereq));
}
