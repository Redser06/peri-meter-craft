import { describe, expect, it } from "vitest";
import { ROI_DEFAULTS } from "@/config/roiDefaults";
import { computeROI, type RoiCounts, type RoiRates } from "@/services/roiCalculator";

function makeRng(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function sample(rng: () => number): { counts: RoiCounts; rates: RoiRates } {
  const count = () => Math.floor(rng() * 10);
  const rate = () => Math.floor(rng() * 20) / 2;
  return {
    counts: { prs: count(), prototypes: count() },
    rates: {
      hoursPerPr: rate(),
      hoursPerPrototype: rate(),
      usdPerHour: rate(),
    },
  };
}

const rng = makeRng(20261013);
const samples = Array.from({ length: 200 }, (_, index) => ({ index, ...sample(rng) }));

function expectMonotone(baseUsd: number, nextUsd: number, strict: boolean) {
  if (strict) expect(nextUsd).toBeGreaterThan(baseUsd);
  else expect(nextUsd).toBeGreaterThanOrEqual(baseUsd);
}

describe("ROI Monotonicity & Mathematical Invariant Property Suite", () => {
  it("keeps default rates documented as overridable guesstimates", () => {
    expect(ROI_DEFAULTS.status).toBe("guesstimate_overridable");
    expect(ROI_DEFAULTS.hoursPerPr).toBeGreaterThan(0);
    expect(ROI_DEFAULTS.hoursPerPrototype).toBeGreaterThan(0);
    expect(ROI_DEFAULTS.usdPerHour).toBeGreaterThan(0);
  });

  it("calculates hours saved and dollar return accurately from dynamic rates", () => {
    const counts = { prs: 3, prototypes: 2 };
    const rates = { hoursPerPr: 5, hoursPerPrototype: 10, usdPerHour: 50 };
    const result = computeROI(counts, rates);
    expect(result.hoursSaved).toBe(3 * 5 + 2 * 10);
    expect(result.usd).toBe(result.hoursSaved * 50);
  });

  for (const sampleCase of samples) {
    it(`verifies dROI/dSkills >= 0 for random state ${sampleCase.index}`, () => {
      const { counts, rates } = sampleCase;
      const base = computeROI(counts, rates);

      // Increasing shipped PRs must never decrease ROI
      const morePrs = computeROI({ ...counts, prs: counts.prs + 1 }, rates);
      expect(morePrs.hoursSaved).toBeGreaterThanOrEqual(base.hoursSaved);
      expectMonotone(base.usd, morePrs.usd, rates.hoursPerPr > 0 && rates.usdPerHour > 0);
      if (rates.hoursPerPr > 0) expect(morePrs.hoursSaved).toBeGreaterThan(base.hoursSaved);

      // Increasing deployed prototypes must never decrease ROI
      const morePrototypes = computeROI({ ...counts, prototypes: counts.prototypes + 1 }, rates);
      expect(morePrototypes.hoursSaved).toBeGreaterThanOrEqual(base.hoursSaved);
      expectMonotone(base.usd, morePrototypes.usd, rates.hoursPerPrototype > 0 && rates.usdPerHour > 0);
      if (rates.hoursPerPrototype > 0) expect(morePrototypes.hoursSaved).toBeGreaterThan(base.hoursSaved);

      // Increasing hoursPerPr rate must never decrease ROI
      const higherPrRate = computeROI(counts, { ...rates, hoursPerPr: rates.hoursPerPr + 1 });
      expect(higherPrRate.hoursSaved).toBeGreaterThanOrEqual(base.hoursSaved);
      expectMonotone(base.usd, higherPrRate.usd, counts.prs > 0 && rates.usdPerHour > 0);

      // Increasing hoursPerPrototype rate must never decrease ROI
      const higherPrototypeRate = computeROI(counts, {
        ...rates,
        hoursPerPrototype: rates.hoursPerPrototype + 1,
      });
      expect(higherPrototypeRate.hoursSaved).toBeGreaterThanOrEqual(base.hoursSaved);
      expectMonotone(base.usd, higherPrototypeRate.usd, counts.prototypes > 0 && rates.usdPerHour > 0);

      // Increasing hourly USD rate must never decrease ROI
      const higherUsd = computeROI(counts, { ...rates, usdPerHour: rates.usdPerHour + 1 });
      expect(higherUsd.hoursSaved).toBe(base.hoursSaved);
      expectMonotone(base.usd, higherUsd.usd, base.hoursSaved > 0);
    });
  }
});

describe("ROI Input Validation (Fail-Closed Rejection)", () => {
  const validCounts = { prs: 1, prototypes: 1 };
  const validRates = { hoursPerPr: 2, hoursPerPrototype: 4, usdPerHour: 25 };

  it("rejects negative counts and rates", () => {
    expect(() => computeROI({ prs: -1, prototypes: 0 }, validRates)).toThrow();
    expect(() => computeROI({ prs: 0, prototypes: -1 }, validRates)).toThrow();
    expect(() => computeROI(validCounts, { ...validRates, hoursPerPr: -1 })).toThrow();
    expect(() => computeROI(validCounts, { ...validRates, hoursPerPrototype: -1 })).toThrow();
    expect(() => computeROI(validCounts, { ...validRates, usdPerHour: -1 })).toThrow();
  });

  it("rejects NaN and non-finite inputs", () => {
    expect(() => computeROI({ prs: Number.NaN, prototypes: 0 }, validRates)).toThrow();
    expect(() => computeROI(validCounts, { ...validRates, hoursPerPr: Number.NaN })).toThrow();
    expect(() => computeROI(validCounts, { ...validRates, usdPerHour: Number.POSITIVE_INFINITY })).toThrow();
  });
});
