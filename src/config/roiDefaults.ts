/**
 * ROI rate defaults.
 * These figures are guesstimates, not measured benchmarks.
 * Callers override them by passing a RoiRates object; do not copy the literals.
 */
export const ROI_DEFAULTS = {
  hoursPerPr: 8.5,
  hoursPerPrototype: 16,
  usdPerHour: 85,
  status: "guesstimate_overridable",
} as const;

export type RoiDefaults = typeof ROI_DEFAULTS;
