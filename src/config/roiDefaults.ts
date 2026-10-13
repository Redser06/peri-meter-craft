/**
 * Baseline ROI rates for engineering hours offset and managerial returns.
 *
 * NOTE: These baseline values are empirical guesstimates based on typical
 * junior-to-mid engineering task velocity and PR authoring overhead.
 * They are documented as overridable guesstimates and can be customized
 * per team in the Leadership / Manager ROI dashboard (/manager/roi).
 */
export const ROI_DEFAULTS = {
  hoursPerPr: 8.5,
  hoursPerPrototype: 16,
  usdPerHour: 85,
  status: "guesstimate_overridable",
} as const;

export type RoiDefaults = typeof ROI_DEFAULTS;
