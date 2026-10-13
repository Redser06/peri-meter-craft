import { LLM_USD_MONTH_CAP, LLM_USD_PER_CALL_CAP } from "@/config/costCap";

export type LedgerReason = "under_cap" | "at_or_over_cap" | "missing" | "unparseable" | "per_call_cap";

export interface LedgerDecision {
  allowed: boolean;
  reason: LedgerReason;
}

export function evaluateLedger(raw: string | null | undefined, estimateUsd = 0): LedgerDecision {
  if (raw == null || String(raw).trim() === "") {
    return { allowed: false, reason: "missing" };
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { allowed: false, reason: "unparseable" };
  }
  if (parsed == null || typeof parsed !== "object" || Array.isArray(parsed)) {
    return { allowed: false, reason: "unparseable" };
  }
  const spend = (parsed as { spend_usd?: unknown }).spend_usd;
  if (typeof spend !== "number" || Number.isNaN(spend) || !Number.isFinite(spend)) {
    return { allowed: false, reason: "unparseable" };
  }
  if (typeof LLM_USD_MONTH_CAP !== "number" || !Number.isFinite(LLM_USD_MONTH_CAP)) {
    return { allowed: false, reason: "unparseable" };
  }
  if (typeof LLM_USD_PER_CALL_CAP !== "number" || !Number.isFinite(LLM_USD_PER_CALL_CAP)) {
    return { allowed: false, reason: "unparseable" };
  }
  if (typeof estimateUsd !== "number" || Number.isNaN(estimateUsd) || !Number.isFinite(estimateUsd) || estimateUsd < 0) {
    return { allowed: false, reason: "unparseable" };
  }
  if (estimateUsd > LLM_USD_PER_CALL_CAP) {
    return { allowed: false, reason: "per_call_cap" };
  }
  if (spend >= LLM_USD_MONTH_CAP || spend + estimateUsd > LLM_USD_MONTH_CAP) {
    return { allowed: false, reason: "at_or_over_cap" };
  }
  return { allowed: true, reason: "under_cap" };
}
