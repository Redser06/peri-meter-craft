import { describe, expect, it } from "vitest";
import { PERIMETER_LEXICON } from "@/data/lexicon";
import { PRD_CASE_STUDIES } from "@/data/caseStudies";
import { CURRICULUM_TRACKS } from "@/services/curriculumGraph";

describe("trainer assets: lexicon", () => {
  it("contains 9 curated transformation terms", () => {
    expect(PERIMETER_LEXICON.length).toBe(9);
  });

  it("ensures all term names are unique", () => {
    const terms = PERIMETER_LEXICON.map((entry) => entry.term);
    expect(new Set(terms).size).toBe(terms.length);
  });

  it("assigns valid categories to every entry", () => {
    const validCategories = new Set(["AI Engineering", "Product", "Business", "Systems"]);
    for (const entry of PERIMETER_LEXICON) {
      expect(validCategories.has(entry.category)).toBe(true);
      expect(entry.definition.trim().length).toBeGreaterThan(0);
      expect(entry.traditionalPmView.trim().length).toBeGreaterThan(0);
      expect(entry.aiPmParadigm.trim().length).toBeGreaterThan(0);
    }
  });

  it("includes modern AI engineering terms (MCP, Fail-Closed Eval Gate, State Graph)", () => {
    const terms = PERIMETER_LEXICON.map((entry) => entry.term);
    expect(terms).toContain("Model Context Protocol (MCP)");
    expect(terms).toContain("Fail-Closed Eval Gate");
    expect(terms).toContain("State Graph & OODA Loop");
  });
});

describe("trainer assets: case studies", () => {
  it("contains 2 PRD-to-executable-contract exercises", () => {
    expect(PRD_CASE_STUDIES.length).toBe(2);
  });

  it("ensures exercise IDs are unique", () => {
    const ids = PRD_CASE_STUDIES.map((cs) => cs.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("maps exercises to existing curriculum tracks", () => {
    const validTrackIds = new Set(CURRICULUM_TRACKS.map((t) => t.id));
    for (const cs of PRD_CASE_STUDIES) {
      expect(validTrackIds.has(cs.trackId)).toBe(true);
      expect(cs.title.trim().length).toBeGreaterThan(0);
      expect(cs.legacyStory.trim().length).toBeGreaterThan(0);
      expect(cs.legacyFlaw.trim().length).toBeGreaterThan(0);
      expect(cs.aiPmContract.endpoint.startsWith("POST ")).toBe(true);
      expect(cs.aiPmContract.propertyInvariant.trim().length).toBeGreaterThan(0);
      expect(Object.keys(cs.aiPmContract.schemaExample).length).toBeGreaterThan(0);
    }
  });

  it("maps cs-01 to Track 02 and cs-02 to Track 01", () => {
    const cs1 = PRD_CASE_STUDIES.find((cs) => cs.id === "cs-01-audit-export");
    const cs2 = PRD_CASE_STUDIES.find((cs) => cs.id === "cs-02-synthetic-validation");
    expect(cs1?.trackId).toBe("02");
    expect(cs2?.trackId).toBe("01");
  });
});
