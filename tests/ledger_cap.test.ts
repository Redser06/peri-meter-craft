import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { LLM_USD_MONTH_CAP, LLM_USD_PER_CALL_CAP } from "@/config/costCap";
import { evaluateLedger } from "@/services/ledgerGuard";
import { prepareModelCall } from "@/services/llmProvider";

interface LedgerCase {
  name: string;
  raw: string | null;
  allowed: boolean;
  reason: string;
}

const cases = JSON.parse(readFileSync("tests/fixtures/ledger_cases.json", "utf8")) as LedgerCase[];

describe("ledger cap", () => {
  it("uses a finite monthly cap and a one-cent per-call cap", () => {
    expect(Number.isFinite(LLM_USD_MONTH_CAP)).toBe(true);
    expect(LLM_USD_PER_CALL_CAP).toBeLessThanOrEqual(0.01);
    expect(LLM_USD_PER_CALL_CAP).toBeGreaterThan(0);
  });

  for (const entry of cases) {
    it(`${entry.name} ${entry.allowed ? "allows" : "blocks"} the call`, () => {
      expect(evaluateLedger(entry.raw)).toEqual({ allowed: entry.allowed, reason: entry.reason });
    });
  }

  it("fails closed when the provider is not fake", () => {
    expect(() => prepareModelCall('{"spend_usd": 1}', "paid")).toThrow(/paid model providers/);
  });

  it("fails closed when the ledger is missing", () => {
    expect(() => prepareModelCall(null, "fake")).toThrow(/cost_cap_blocked:missing/);
  });

  it("allows a fake call under the cap", () => {
    expect(prepareModelCall('{"spend_usd": 1}', "fake")).toBe("fake");
  });

  it("blocks when spend plus the estimate would pass the monthly cap", () => {
    expect(evaluateLedger('{"spend_usd": 4.995}', 0.01)).toEqual({
      allowed: false,
      reason: "at_or_over_cap",
    });
  });

  it("allows an estimate at the per-call cap while monthly spend stays under the cap", () => {
    expect(evaluateLedger('{"spend_usd": 1}', LLM_USD_PER_CALL_CAP)).toEqual({
      allowed: true,
      reason: "under_cap",
    });
  });

  it("blocks an estimate above the per-call cap", () => {
    expect(evaluateLedger('{"spend_usd": 1}', 0.02)).toEqual({
      allowed: false,
      reason: "per_call_cap",
    });
  });

  it("fails closed when the estimate is not a finite non-negative number", () => {
    expect(evaluateLedger('{"spend_usd": 1}', Number.NaN).allowed).toBe(false);
    expect(evaluateLedger('{"spend_usd": 1}', -1).allowed).toBe(false);
  });

  it("blocks a prepare call whose estimate exceeds the per-call cap", () => {
    expect(() => prepareModelCall('{"spend_usd": 1}', "fake", 0.02)).toThrow(/per_call_cap/);
  });
});
