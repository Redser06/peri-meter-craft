import { LLM_USD_MONTH_CAP } from "@/config/costCap";

export type LedgerReason = "under_cap" | "at_or_over_cap" | "missing" | "unparseable";

export interface LedgerDecision {
  allowed: boolean;
  reason: LedgerReason;
}

export function evaluateLedger(raw: string | null | undefined): LedgerDecision {
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
  if (spend >= LLM_USD_MONTH_CAP) {
    return { allowed: false, reason: "at_or_over_cap" };
  }
  return { allowed: true, reason: "under_cap" };
}
