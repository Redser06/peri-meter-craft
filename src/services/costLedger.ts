import { LLM_USD_MONTH_CAP } from "@/config/costCap";
import { guardSpend } from "./ledgerGuard";

export interface SessionCostLedger {
  sessionId: string;
  learnerId: string;
  spendUsd: number;
  monthlyBudgetUsd: number;
  callCount: number;
  deterministicCalls: number;
  recordedCalls: Array<{
    node: string;
    model: string;
    costUsd: number;
    timestamp: string;
    deterministic: boolean;
  }>;
}

export function createSessionCostLedger(sessionId: string, learnerId: string): SessionCostLedger {
  return {
    sessionId,
    learnerId,
    spendUsd: 0,
    monthlyBudgetUsd: LLM_USD_MONTH_CAP,
    callCount: 0,
    deterministicCalls: 0,
    recordedCalls: [],
  };
}

export function recordCall(
  ledger: SessionCostLedger,
  node: string,
  model: string,
  costUsd: number,
  deterministic: boolean = false,
): SessionCostLedger {
  // Deterministic operations must strictly incur $0 spend
  const actualCost = deterministic ? 0 : costUsd;

  if (!guardSpend(ledger.spendUsd, actualCost)) {
    throw new Error(
      `Spend limit exceeded: current spend $${ledger.spendUsd.toFixed(2)} + call $${actualCost.toFixed(2)} exceeds cap $${ledger.monthlyBudgetUsd.toFixed(2)}`,
    );
  }

  const nextSpend = Number((ledger.spendUsd + actualCost).toFixed(6));

  return {
    ...ledger,
    spendUsd: nextSpend,
    callCount: ledger.callCount + 1,
    deterministicCalls: deterministic ? ledger.deterministicCalls + 1 : ledger.deterministicCalls,
    recordedCalls: [
      ...ledger.recordedCalls,
      {
        node,
        model,
        costUsd: actualCost,
        timestamp: new Date().toISOString(),
        deterministic,
      },
    ],
  };
}
