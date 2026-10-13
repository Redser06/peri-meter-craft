import { describe, expect, it } from "vitest";
import {
  CURRICULUM_TRACKS,
  topologicalSort,
  isTrackUnlocked,
  type CurriculumTrackNode,
} from "@/services/curriculumGraph";

describe("Curriculum DAG & Topological Order Verification", () => {
  it("defines exactly 11 capability tracks", () => {
    expect(CURRICULUM_TRACKS).toHaveLength(11);
  });

  it("produces a deterministic topological ordering", () => {
    const order1 = topologicalSort();
    const order2 = topologicalSort();
    expect(order1).toEqual(order2);
    expect(order1).toHaveLength(11);
  });

  it("ensures all prerequisites precede dependent tracks in topological order", () => {
    const order = topologicalSort();
    for (const track of CURRICULUM_TRACKS) {
      const trackIndex = order.indexOf(track.id);
      expect(trackIndex).toBeGreaterThanOrEqual(0);
      for (const prereq of track.prerequisites) {
        const prereqIndex = order.indexOf(prereq);
        expect(prereqIndex).toBeGreaterThanOrEqual(0);
        expect(prereqIndex).toBeLessThan(trackIndex);
      }
    }
  });

  it("detects cyclic graphs and throws fail-closed error", () => {
    const cyclicGraph: CurriculumTrackNode[] = [
      { id: "A", title: "A", gateId: "gate_a", prerequisites: ["B"] },
      { id: "B", title: "B", gateId: "gate_b", prerequisites: ["A"] },
    ];
    expect(() => topologicalSort(cyclicGraph)).toThrow("Cycle detected in curriculum DAG");
  });

  it("correctly evaluates track unlock state", () => {
    // Track 01 has no prerequisites: always unlocked
    expect(isTrackUnlocked("01", [])).toBe(true);

    // Track 02 requires Track 01
    expect(isTrackUnlocked("02", [])).toBe(false);
    expect(isTrackUnlocked("02", ["01"])).toBe(true);

    // Track 06 requires 04 and 05
    expect(isTrackUnlocked("06", ["04"])).toBe(false);
    expect(isTrackUnlocked("06", ["04", "05"])).toBe(true);
  });

  for (let i = 0; i < 20; i += 1) {
    it(`evaluates deterministic DAG invariant across test cycle ${i}`, () => {
      const order = topologicalSort(CURRICULUM_TRACKS);
      expect(order[0]).toBe("01");
      expect(order).toContain("11");
    });
  }
});
