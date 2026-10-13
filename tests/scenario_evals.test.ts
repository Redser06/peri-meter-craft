import { describe, expect, it } from "vitest";
import scn1 from "./scenarios/SCN-0001.json";
import scn2 from "./scenarios/SCN-0002.json";
import { classifyLearnerError } from "@/lib/coach/state";
import { initialLearnerState, type ErrorClass } from "@/types/coach";

describe("Track 08: Offline Scenario Replay Harness (Lumina Port)", () => {
  it("replays SCN-0001 and verifies misconception routing", () => {
    const state = initialLearnerState({
      learner_id: scn1.learner_id,
      session_id: "test-session-1",
      goal: scn1.goal,
    });
    expect(state.learner_id).toBe("trainee-nia");

    const firstAssessment = scn1.script.Assess[0].last_assessment;
    const result = classifyLearnerError({
      score: firstAssessment.score,
      errorClass: firstAssessment.error_class as ErrorClass,
      confidence: firstAssessment.confidence,
      conceptId: "prompting",
    });

    expect(result.remediationPath).toBe("deep_concept_remediation");
    expect(result.feedback).toContain("Fundamental misconception");

    const secondAssessment = scn1.script.Assess[1].last_assessment;
    const finalResult = classifyLearnerError({
      score: secondAssessment.score,
      errorClass: null,
      confidence: secondAssessment.confidence,
      conceptId: "prompting",
    });
    expect(finalResult.remediationPath).toBe("advance");
  });

  it("replays SCN-0002 and verifies slip routing", () => {
    const firstAssessment = scn2.script.Assess[0].last_assessment;
    const result = classifyLearnerError({
      score: firstAssessment.score,
      errorClass: firstAssessment.error_class as ErrorClass,
      confidence: firstAssessment.confidence,
      conceptId: "git_pr",
    });

    expect(result.remediationPath).toBe("quick_hint_retry");
    expect(result.feedback).toContain("Slip detected");
  });
});
