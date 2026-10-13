export interface RoiCounts {
  prs: number;
  prototypes: number;
}

export interface RoiRates {
  hoursPerPr: number;
  hoursPerPrototype: number;
  usdPerHour: number;
}

export interface RoiResult {
  hoursSaved: number;
  usd: number;
}

function assertValid(value: number, label: string): void {
  if (typeof value !== "number" || Number.isNaN(value) || !Number.isFinite(value) || value < 0) {
    throw new Error(`ROI inputs must be finite and non-negative: ${label}`);
  }
}

/**
 * Computes engineering hours offset and estimated dollar return on investment.
 *
 * Mathematical Invariant:
 * hoursSaved = (prs * hoursPerPr) + (prototypes * hoursPerPrototype)
 * dollarROI = hoursSaved * usdPerHour
 *
 * Partial derivatives:
 * d(ROI)/d(prs) = hoursPerPr * usdPerHour >= 0
 * d(ROI)/d(prototypes) = hoursPerPrototype * usdPerHour >= 0
 * The formulation is strictly monotonic increasing whenever rates are positive.
 */
export function computeROI(counts: RoiCounts, rates: RoiRates): RoiResult {
  assertValid(counts.prs, "prs");
  assertValid(counts.prototypes, "prototypes");
  assertValid(rates.hoursPerPr, "hoursPerPr");
  assertValid(rates.hoursPerPrototype, "hoursPerPrototype");
  assertValid(rates.usdPerHour, "usdPerHour");

  const hoursSaved = counts.prs * rates.hoursPerPr + counts.prototypes * rates.hoursPerPrototype;
  const usd = hoursSaved * rates.usdPerHour;
  return { hoursSaved, usd };
}
