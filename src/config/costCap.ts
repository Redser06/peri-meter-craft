/**
 * Monthly model-spend ceiling in USD.
 * A missing, unparseable, or exhausted ledger fails closed.
 * Each call also has to stay within the per-call ceiling.
 */
export const LLM_USD_MONTH_CAP = 5;
export const LLM_USD_PER_CALL_CAP = 0.01;
