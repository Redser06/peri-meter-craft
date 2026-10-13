import {
  ERROR_CLASSES,
  type ErrorClass,
  type LearnerState,
  type LearnerPatch,
  LearnerStateSchema,
  fingerprintState,
  initialLearnerState,
} from "@/types/coach";

export {
  ERROR_CLASSES,
  type ErrorClass,
  type LearnerState,
  type LearnerPatch,
  LearnerStateSchema,
  fingerprintState,
  initialLearnerState,
};

export interface DiagnosticAssessment {
  score: number;
  errorClass: ErrorClass | null;
  confidence: number;
  conceptId: string;
}

/**
 * Evaluates learner attempt and categorizes error into misconception or slip.
 * Misconception: systematic flawed mental model requiring structural remediation.
 * Slip: momentary cognitive lapse or syntactic error easily self-corrected with a hint.
 */
export function classifyLearnerError(assessment: DiagnosticAssessment): {
  remediationPath: "deep_concept_remediation" | "quick_hint_retry" | "advance";
  feedback: string;
} {
  if (assessment.score >= 0.8) {
    return {
      remediationPath: "advance",
      feedback: "Competency demonstrated. Proceeding to next curriculum milestone.",
    };
  }

  if (assessment.errorClass === "misconception") {
    return {
      remediationPath: "deep_concept_remediation",
      feedback: `Fundamental misconception identified in ${assessment.conceptId}. Routing to conceptual foundation module.`,
    };
  }

  return {
    remediationPath: "quick_hint_retry",
    feedback: `Slip detected in execution. Review property checks and retry deliverable.`,
  };
}

/**
 * Supervisor-Worker dispatch function that updates state and detects loops.
 */
export function stepSupervisor(state: LearnerState, patch: LearnerPatch): LearnerState {
  const next: LearnerState = {
    ...state,
    ...patch,
    step: state.step + 1,
  };

  const fp = fingerprintState(next);
  const repeated = state.fingerprints.filter((f) => f === fp).length;

  if (repeated >= 2) {
    next.loop_detected = true;
    next.hitl_pending = {
      node: "supervisor",
      reason: `Stagnation loop detected for learner ${state.learner_id}; escalating for human coach review.`,
    };
  } else {
    next.fingerprints = [...state.fingerprints, fp];
  }

  return LearnerStateSchema.parse(next);
}
