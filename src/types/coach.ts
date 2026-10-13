import { z } from "zod";

export const ERROR_CLASSES = ["misconception", "slip"] as const;
export type ErrorClass = (typeof ERROR_CLASSES)[number];

export const GOAL_MAX_CHARS = 2000;
export const MAX_COST_BUDGET_USD = 5.0; // Hard $5.00/month cap per Conor directive

export const BASELINE_MODEL = "gemini-3.8-flash"; // Strict rule: Gemini 3.8 Flash baseline, never Gemini 2.x

export const LastAssessmentSchema = z.object({
  score: z.number().finite().min(0).max(1),
  error_class: z.enum(ERROR_CLASSES).nullable(),
  confidence: z.number().finite().min(0).max(1),
});

export type LastAssessment = z.infer<typeof LastAssessmentSchema>;

export const DiagnosisSchema = z.object({
  placed: z.boolean(),
  tier: z.string(),
});

export type Diagnosis = z.infer<typeof DiagnosisSchema>;

export const PlanSchema = z.object({
  skill: z.string(),
  rationale: z.string(),
});

export type Plan = z.infer<typeof PlanSchema>;

export const HitlPendingSchema = z.object({
  node: z.string(),
  reason: z.string(),
});

export type HitlPending = z.infer<typeof HitlPendingSchema>;

export const HitlRecordSchema = z.object({
  node: z.string(),
  decision: z.string(),
  actor: z.string(),
});

export type HitlRecord = z.infer<typeof HitlRecordSchema>;

export const LearnerStateSchema = z.object({
  learner_id: z.string().min(1),
  session_id: z.string().min(1),
  scenario_id: z.string().nullable(),
  goal: z.string().max(GOAL_MAX_CHARS),
  mastery: z.record(z.string().min(1).max(64), z.number().finite().min(0).max(1)),
  last_assessment: LastAssessmentSchema.nullable(),
  time_on_task_s: z.number().finite().nonnegative(),
  fatigue: z.number().finite().nonnegative(),
  step: z.number().int().nonnegative(),
  cost_usd_session: z.number().finite().nonnegative(),
  cost_budget_usd: z.number().finite().positive().max(MAX_COST_BUDGET_USD),
  path: z.array(z.string()),
  edges_taken: z.array(z.string()),
  trace_nodes: z.array(z.string()),
  fingerprints: z.array(z.string()),
  hitl_pending: HitlPendingSchema.nullable(),
  hitl_log: z.array(HitlRecordSchema),
  loop_detected: z.boolean(),
  loop_cleared: z.boolean(),
  disputed: z.boolean(),
  skill_map_edit: z.boolean(),
  session_complete: z.boolean(),
  diagnosis: DiagnosisSchema.nullable(),
  plan: PlanSchema.nullable(),
  last_edge: z.string().nullable(),
  last_condition: z.string().nullable(),
});

export type LearnerState = z.infer<typeof LearnerStateSchema>;
export type LearnerPatch = Partial<LearnerState>;

export function initialLearnerState(
  partial: Partial<LearnerState> & Pick<LearnerState, "learner_id" | "session_id" | "goal">,
): LearnerState {
  const base: LearnerState = {
    learner_id: partial.learner_id,
    session_id: partial.session_id,
    scenario_id: partial.scenario_id ?? null,
    goal: partial.goal,
    mastery: partial.mastery ?? {},
    last_assessment: partial.last_assessment ?? null,
    time_on_task_s: partial.time_on_task_s ?? 0,
    fatigue: partial.fatigue ?? 0,
    step: partial.step ?? 0,
    cost_usd_session: partial.cost_usd_session ?? 0,
    cost_budget_usd: MAX_COST_BUDGET_USD,
    path: partial.path ?? [],
    edges_taken: partial.edges_taken ?? [],
    trace_nodes: partial.trace_nodes ?? [],
    fingerprints: partial.fingerprints ?? [],
    hitl_pending: partial.hitl_pending ?? null,
    hitl_log: partial.hitl_log ?? [],
    loop_detected: partial.loop_detected ?? false,
    loop_cleared: partial.loop_cleared ?? false,
    disputed: partial.disputed ?? false,
    skill_map_edit: partial.skill_map_edit ?? false,
    session_complete: partial.session_complete ?? false,
    diagnosis: partial.diagnosis ?? null,
    plan: partial.plan ?? null,
    last_edge: partial.last_edge ?? null,
    last_condition: partial.last_condition ?? null,
  };
  return LearnerStateSchema.parse(base);
}

export function fingerprintState(state: LearnerState): string {
  return JSON.stringify({
    mastery: state.mastery,
    last_assessment: state.last_assessment,
    diagnosis: state.diagnosis,
    plan: state.plan,
  });
}
