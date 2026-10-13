import { describe, expect, it } from "vitest";
import {
  CURRICULUM_TRACKS,
  type CurriculumTrack,
  detectCycle,
  topoSort,
} from "@/services/curriculumGraph";

function track(id: string, prerequisites: string[], title = id): CurriculumTrack {
  return { id, title, gateId: "perimeter_curriculum_dag_acyclic", prerequisites };
}

describe("curriculum dag", () => {
  it("lists eleven tracks", () => {
    expect(CURRICULUM_TRACKS).toHaveLength(11);
  });

  it("uses ids 01 through 11", () => {
    expect(CURRICULUM_TRACKS.map((item) => item.id)).toEqual([
      "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11",
    ]);
  });

  it("gives every track a title and a gate id", () => {
    for (const item of CURRICULUM_TRACKS) {
      expect(item.title.length).toBeGreaterThan(0);
      expect(item.gateId.startsWith("perimeter_")).toBe(true);
    }
  });

  it("keeps titles unique", () => {
    const titles = CURRICULUM_TRACKS.map((item) => item.title);
    expect(new Set(titles).size).toBe(titles.length);
  });

  it("starts with no prerequisites", () => {
    expect(CURRICULUM_TRACKS[0].prerequisites).toEqual([]);
  });

  it("points each later track at the previous id", () => {
    for (let index = 1; index < CURRICULUM_TRACKS.length; index += 1) {
      expect(CURRICULUM_TRACKS[index].prerequisites).toEqual([CURRICULUM_TRACKS[index - 1].id]);
    }
  });

  it("sorts the published curriculum in id order", () => {
    expect(topoSort(CURRICULUM_TRACKS)).toEqual(CURRICULUM_TRACKS.map((item) => item.id));
  });

  it("returns the same order on a second sort", () => {
    expect(topoSort(CURRICULUM_TRACKS)).toEqual(topoSort(CURRICULUM_TRACKS));
  });

  it("sorts a reversed copy the same way", () => {
    const reversed = [...CURRICULUM_TRACKS].reverse();
    expect(topoSort(reversed)).toEqual(topoSort(CURRICULUM_TRACKS));
  });

  it("places every prerequisite before its track", () => {
    const order = topoSort(CURRICULUM_TRACKS);
    for (const item of CURRICULUM_TRACKS) {
      for (const prerequisite of item.prerequisites) {
        expect(order.indexOf(prerequisite)).toBeLessThan(order.indexOf(item.id));
      }
    }
  });

  it("reports no cycle on the published curriculum", () => {
    expect(detectCycle(CURRICULUM_TRACKS)).toBeNull();
  });

  it("detects a self cycle", () => {
    expect(detectCycle([track("01", ["01"])])).not.toBeNull();
  });

  it("detects a two-node cycle", () => {
    expect(detectCycle([track("01", ["02"]), track("02", ["01"])])).not.toBeNull();
  });

  it("detects a three-node cycle", () => {
    const graph = [track("01", ["03"]), track("02", ["01"]), track("03", ["02"])];
    expect(detectCycle(graph)).not.toBeNull();
  });

  it("sorts an empty graph to an empty list", () => {
    expect(topoSort([])).toEqual([]);
    expect(detectCycle([])).toBeNull();
  });

  it("sorts a single node to itself", () => {
    expect(topoSort([track("04", [])])).toEqual(["04"]);
  });

  it("orders disconnected nodes by id", () => {
    const graph = [track("09", []), track("02", []), track("07", [])];
    expect(topoSort(graph)).toEqual(["02", "07", "09"]);
  });

  it("respects both parents in a diamond", () => {
    const graph = [
      track("01", []),
      track("03", ["01"]),
      track("02", ["01"]),
      track("04", ["02", "03"]),
    ];
    const order = topoSort(graph);
    expect(order[0]).toBe("01");
    expect(order.indexOf("02")).toBeLessThan(order.indexOf("04"));
    expect(order.indexOf("03")).toBeLessThan(order.indexOf("04"));
    expect(detectCycle(graph)).toBeNull();
  });

  it("breaks ties by id when two nodes are ready", () => {
    const graph = [track("08", []), track("03", []), track("05", [])];
    expect(topoSort(graph)).toEqual(["03", "05", "08"]);
  });

  it("rejects duplicate ids", () => {
    expect(() => topoSort([track("01", []), track("01", [])])).toThrow(/duplicate/);
  });

  it("rejects an unknown prerequisite", () => {
    expect(() => topoSort([track("01", ["09"])])).toThrow(/unknown prerequisite/);
  });

  it("throws when a cycle is sorted", () => {
    expect(() => topoSort([track("01", ["02"]), track("02", ["01"])])).toThrow(/cycle/);
  });

  it("keeps a shuffled diamond deterministic", () => {
    const graph = [
      track("04", ["02", "03"]),
      track("02", ["01"]),
      track("03", ["01"]),
      track("01", []),
    ];
    expect(topoSort(graph)).toEqual(topoSort([...graph].reverse()));
  });

  it("detects a cycle added onto an otherwise valid chain", () => {
    const graph = [track("01", []), track("02", ["01"]), track("01b", ["02"])];
    const closed = graph.map((item) =>
      item.id === "01" ? { ...item, prerequisites: ["01b"] } : item,
    );
    expect(detectCycle(graph)).toBeNull();
    expect(detectCycle(closed)).not.toBeNull();
  });

  it("uses two-digit ids", () => {
    for (const item of CURRICULUM_TRACKS) {
      expect(item.id).toMatch(/^\d{2}$/);
    }
  });

  it("does not repeat a gate id", () => {
    const gates = CURRICULUM_TRACKS.map((item) => item.gateId);
    expect(new Set(gates).size).toBe(gates.length);
  });
});
