import { LLM_USD_MONTH_CAP, MAX_CALL_ESTIMATE_USD } from "@/config/costCap";

export interface LedgerEvaluation {
  allowed: boolean;
  reason: "under_cap" | "at_or_over_cap" | "missing" | "unparseable";
  spend?: number;
}

/**
 * Evaluates raw ledger string or JSON and enforces the hard $5.00/month cap.
 * Fails closed on missing or unparseable input.
 */
export function evaluateLedger(raw: string | null | undefined): LedgerEvaluation {
  if (raw === null || raw === undefined || raw.trim() === "") {
    return { allowed: false, reason: "missing" };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { allowed: false, reason: "unparseable" };
  }

  if (typeof parsed !== "object" || parsed === null) {
    return { allowed: false, reason: "unparseable" };
  }

  const record = parsed as Record<string, unknown>;
  const spend = record.spend_usd;

  if (typeof spend !== "number" || Number.isNaN(spend) || !Number.isFinite(spend)) {
    return { allowed: false, reason: "unparseable" };
  }

  if (spend >= LLM_USD_MONTH_CAP) {
    return { allowed: false, reason: "at_or_over_cap", spend };
  }

  return { allowed: true, reason: "under_cap", spend };
}

/**
 * Preflight guard before dispatching an LLM call.
 * Rejects if spend + call estimate exceeds the monthly cap,
 * or if call estimate exceeds the per-call cap.
 */
export function guardSpend(currentSpendUsd: number, estimatedCallCostUsd: number = 0): boolean {
  if (estimatedCallCostUsd > MAX_CALL_ESTIMATE_USD) {
    throw new Error(`Estimated call cost $${estimatedCallCostUsd} exceeds max per-call cap $${MAX_CALL_ESTIMATE_USD}`);
  }
  if (currentSpendUsd + estimatedCallCostUsd > LLM_USD_MONTH_CAP) {
    return false;
  }
  return currentSpendUsd < LLM_USD_MONTH_CAP;
}
