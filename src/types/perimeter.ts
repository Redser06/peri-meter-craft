export interface CurriculumModule {
  id: string;
  trackId: string;
  title: string;
  order: number;
  prerequisites: string[];
}

export type ModuleStatus = "not_started" | "in_progress" | "complete";

export interface LearnerProgressState {
  learnerId: string;
  moduleId: string;
  status: ModuleStatus;
  mastery: number;
  updatedAt: string;
}

export interface ManagerROIState {
  managerId: string;
  period: string;
  prs: number;
  prototypes: number;
  hoursPerPr: number;
  hoursPerPrototype: number;
  usdPerHour: number;
  hoursSaved: number;
  usdSaved: number;
}
