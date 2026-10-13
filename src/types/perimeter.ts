export type CapabilityTrack =
  | "01"
  | "02"
  | "03"
  | "04"
  | "05"
  | "06"
  | "07"
  | "08"
  | "09"
  | "10"
  | "11";

export interface ProjectCatalogueItem {
  id: string;
  name: string;
  url: string;
  status: "prototype" | "review" | "shipped";
}

export interface CurriculumModule {
  id: string;
  title: string;
  track: string;
  prerequisites: string[];
  eval_gate_id: string;
  deliverable_type: string;
  rubric_property_checks: string[];
}

export interface LearnerProgressState {
  learner_id: string;
  completed_module_ids: string[];
  prs_authored_count: number;
  prototypes_deployed_count: number;
  project_catalogue: ProjectCatalogueItem[];
}

export interface ManagerROIState {
  team_id: string;
  enrolled_pm_count: number;
  certified_ai_pm_count: number;
  aggregate_prs_shipped: number;
  engineering_hours_offset_monthly: number;
  estimated_dollar_roi_monthly: number;
}
