import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { LLM_USD_MONTH_CAP } from "@/config/costCap";
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
  it("uses a finite monthly cap", () => {
    expect(Number.isFinite(LLM_USD_MONTH_CAP)).toBe(true);
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
});
