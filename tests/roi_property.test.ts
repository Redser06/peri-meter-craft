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
  const count = () => Math.floor(rng() * 9);
  const rate = () => Math.floor(rng() * 21) / 2;
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

describe("seeded ROI monotonicity", () => {
  it("keeps the default rates labelled as overridable guesstimates", () => {
    expect(ROI_DEFAULTS.status).toBe("guesstimate_overridable");
  });

  it("computes hours and usd from counts and rates", () => {
    const result = computeROI(
      { prs: 2, prototypes: 3 },
      { hoursPerPr: 4, hoursPerPrototype: 5, usdPerHour: 2 },
    );
    expect(result.hoursSaved).toBe(2 * 4 + 3 * 5);
    expect(result.usd).toBe(result.hoursSaved * 2);
  });

  for (const sampleCase of samples) {
    it(`case ${sampleCase.index} is non-decreasing and strict when the paired factor is positive`, () => {
      const { counts, rates } = sampleCase;
      const base = computeROI(counts, rates);

      const morePrs = computeROI({ ...counts, prs: counts.prs + 1 }, rates);
      expect(morePrs.hoursSaved).toBeGreaterThanOrEqual(base.hoursSaved);
      expectMonotone(base.usd, morePrs.usd, rates.hoursPerPr > 0 && rates.usdPerHour > 0);
      if (rates.hoursPerPr > 0) expect(morePrs.hoursSaved).toBeGreaterThan(base.hoursSaved);

      const morePrototypes = computeROI({ ...counts, prototypes: counts.prototypes + 1 }, rates);
      expect(morePrototypes.hoursSaved).toBeGreaterThanOrEqual(base.hoursSaved);
      expectMonotone(base.usd, morePrototypes.usd, rates.hoursPerPrototype > 0 && rates.usdPerHour > 0);
      if (rates.hoursPerPrototype > 0) expect(morePrototypes.hoursSaved).toBeGreaterThan(base.hoursSaved);

      const higherPrRate = computeROI(counts, { ...rates, hoursPerPr: rates.hoursPerPr + 1 });
      expect(higherPrRate.hoursSaved).toBeGreaterThanOrEqual(base.hoursSaved);
      expectMonotone(base.usd, higherPrRate.usd, counts.prs > 0 && rates.usdPerHour > 0);
      if (counts.prs > 0) expect(higherPrRate.hoursSaved).toBeGreaterThan(base.hoursSaved);

      const higherPrototypeRate = computeROI(counts, {
        ...rates,
        hoursPerPrototype: rates.hoursPerPrototype + 1,
      });
      expect(higherPrototypeRate.hoursSaved).toBeGreaterThanOrEqual(base.hoursSaved);
      expectMonotone(base.usd, higherPrototypeRate.usd, counts.prototypes > 0 && rates.usdPerHour > 0);
      if (counts.prototypes > 0) expect(higherPrototypeRate.hoursSaved).toBeGreaterThan(base.hoursSaved);

      const higherUsd = computeROI(counts, { ...rates, usdPerHour: rates.usdPerHour + 1 });
      expect(higherUsd.hoursSaved).toBe(base.hoursSaved);
      expectMonotone(base.usd, higherUsd.usd, base.hoursSaved > 0);
    });
  }
});

describe("ROI rejects negative and NaN inputs", () => {
  const okCounts = { prs: 1, prototypes: 1 };
  const okRates = { hoursPerPr: 1, hoursPerPrototype: 2, usdPerHour: 3 };

  it("rejects a negative pull-request count", () => {
    expect(() => computeROI({ prs: -1, prototypes: 0 }, okRates)).toThrow();
  });

  it("rejects a negative prototype count", () => {
    expect(() => computeROI({ prs: 0, prototypes: -1 }, okRates)).toThrow();
  });

  it("rejects a negative hours-per-pull-request rate", () => {
    expect(() => computeROI(okCounts, { ...okRates, hoursPerPr: -1 })).toThrow();
  });

  it("rejects a negative hours-per-prototype rate", () => {
    expect(() => computeROI(okCounts, { ...okRates, hoursPerPrototype: -1 })).toThrow();
  });

  it("rejects a negative hourly rate", () => {
    expect(() => computeROI(okCounts, { ...okRates, usdPerHour: -1 })).toThrow();
  });

  it("rejects NaN counts", () => {
    expect(() => computeROI({ prs: Number.NaN, prototypes: 0 }, okRates)).toThrow();
  });

  it("rejects NaN rates", () => {
    expect(() => computeROI(okCounts, { ...okRates, hoursPerPr: Number.NaN })).toThrow();
    expect(() => computeROI(okCounts, { ...okRates, usdPerHour: Number.NaN })).toThrow();
  });
});
