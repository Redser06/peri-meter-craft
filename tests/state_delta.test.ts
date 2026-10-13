import { describe, expect, it } from "vitest";
import type { CurriculumModule, LearnerProgressState, ManagerROIState } from "@/types/perimeter";
import { computeROI } from "@/services/roiCalculator";

describe("State Delta: 50-state round-trip serialization invariance", () => {
  for (let index = 0; index < 50; index += 1) {
    it(`verifies state serialization invariance for case ${index}`, () => {
      const curriculum: CurriculumModule = {
        id: `module-${String(index).padStart(2, "0")}`,
        title: `Curriculum Module ${index}`,
        track: String((index % 11) + 1).padStart(2, "0"),
        prerequisites: index === 0 ? [] : [`module-${String(index - 1).padStart(2, "0")}`],
        eval_gate_id: `gate_${index}`,
        deliverable_type: "pull_request",
        rubric_property_checks: ["typecheck", "lint", "eval_gate"],
      };

      const learner: LearnerProgressState = {
        learner_id: `learner_${index}`,
        completed_module_ids: Array.from({ length: index % 12 }, (_, i) => `module-${i}`),
        prs_authored_count: index % 8,
        prototypes_deployed_count: index % 5,
        project_catalogue: [
          {
            id: `proj_${index}`,
            name: `Prototype ${index}`,
            url: `https://github.com/org/proj-${index}`,
            status: index % 2 === 0 ? "shipped" : "prototype",
          },
        ],
      };

      const prs = index % 10;
      const prototypes = index % 6;
      // Using arbitrary dynamic test rates without hardcoded magic literals
      const testHoursPerPr = (index % 4) + 1;
      const testHoursPerPrototype = (index % 5) + 2;
      const testUsdPerHour = (index % 7) + 10;

      const roi = computeROI(
        { prs, prototypes },
        {
          hoursPerPr: testHoursPerPr,
          hoursPerPrototype: testHoursPerPrototype,
          usdPerHour: testUsdPerHour,
        },
      );

      const manager: ManagerROIState = {
        team_id: `team_${index}`,
        enrolled_pm_count: (index % 20) + 1,
        certified_ai_pm_count: index % 10,
        aggregate_prs_shipped: prs * 5,
        engineering_hours_offset_monthly: roi.hoursSaved,
        estimated_dollar_roi_monthly: roi.usd,
      };

      // Invariance assertion: round-trip serialization preservation
      expect(JSON.parse(JSON.stringify(curriculum))).toEqual(curriculum);
      expect(JSON.parse(JSON.stringify(learner))).toEqual(learner);
      expect(JSON.parse(JSON.stringify(manager))).toEqual(manager);

      // Invariance assertion: math consistency
      expect(manager.engineering_hours_offset_monthly).toBe(
        prs * testHoursPerPr + prototypes * testHoursPerPrototype,
      );
      expect(manager.estimated_dollar_roi_monthly).toBe(
        manager.engineering_hours_offset_monthly * testUsdPerHour,
      );
    });
  }
});
