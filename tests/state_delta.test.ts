import { describe, expect, it } from "vitest";
import type { CurriculumModule, LearnerProgressState, ManagerROIState, ModuleStatus } from "@/types/perimeter";
import { computeROI } from "@/services/roiCalculator";

const statuses: ModuleStatus[] = ["not_started", "in_progress", "complete"];

describe("state contract round trip", () => {
  for (let index = 0; index < 50; index += 1) {
    it(`round-trips curriculum, learner, and manager state ${index}`, () => {
      const status = statuses[index % statuses.length];
      const curriculum: CurriculumModule = {
        id: `module-${index}`,
        trackId: String(index % 11).padStart(2, "0"),
        title: `Module ${index}`,
        order: index,
        prerequisites: index === 0 ? [] : [`module-${index - 1}`],
      };
      const learner: LearnerProgressState = {
        learnerId: `learner-${index}`,
        moduleId: curriculum.id,
        status,
        mastery: index / 50,
        updatedAt: `2026-10-13T00:00:${String(index).padStart(2, "0")}Z`,
      };
      const prs = index % 7;
      const prototypes = index % 5;
      const rates = {
        hoursPerPr: (index % 4) + 1,
        hoursPerPrototype: (index % 3) + 2,
        usdPerHour: (index % 6) + 3,
      };
      const roi = computeROI({ prs, prototypes }, rates);
      const manager: ManagerROIState = {
        managerId: `manager-${index}`,
        period: `2026-10`,
        prs,
        prototypes,
        hoursPerPr: rates.hoursPerPr,
        hoursPerPrototype: rates.hoursPerPrototype,
        usdPerHour: rates.usdPerHour,
        hoursSaved: roi.hoursSaved,
        usdSaved: roi.usd,
      };

      expect(JSON.parse(JSON.stringify(curriculum))).toEqual(curriculum);
      expect(JSON.parse(JSON.stringify(learner))).toEqual(learner);
      expect(JSON.parse(JSON.stringify(manager))).toEqual(manager);
      expect(statuses).toContain(learner.status);
      expect(manager.hoursSaved).toBe(manager.prs * manager.hoursPerPr + manager.prototypes * manager.hoursPerPrototype);
      expect(manager.usdSaved).toBe(manager.hoursSaved * manager.usdPerHour);
    });
  }
});
