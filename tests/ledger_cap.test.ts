import { describe, expect, it } from "vitest";
import ledgerCases from "./fixtures/ledger_cases.json";
import { evaluateLedger, guardSpend } from "@/services/ledgerGuard";
import { LLM_USD_MONTH_CAP } from "@/config/costCap";

describe("Ledger Cap Guard Suite (Hard $5.00/month LLM cap)", () => {
  it("enforces fail-closed behavior across all fixture cases", () => {
    for (const testCase of ledgerCases) {
      const result = evaluateLedger(testCase.raw);
      expect(result.allowed).toBe(testCase.allowed);
      expect(result.reason).toBe(testCase.reason);
    }
  });

  it("verifies the monthly limit is strictly $5.00", () => {
    expect(LLM_USD_MONTH_CAP).toBe(5);
  });

  it("guards spend before invocations", () => {
    expect(guardSpend(0, 0.001)).toBe(true);
    expect(guardSpend(4.99, 0.005)).toBe(true);
    expect(guardSpend(5.0, 0)).toBe(false);
    expect(guardSpend(5.1, 0)).toBe(false);
    // Over cap with estimate
    expect(guardSpend(4.999, 0.005)).toBe(false);
  });

  it("rejects call estimates exceeding per-call cap", () => {
    expect(() => guardSpend(1.0, 0.05)).toThrow("exceeds max per-call cap");
  });
});
