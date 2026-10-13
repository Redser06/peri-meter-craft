import { evaluateLedger } from "@/services/ledgerGuard";

const FAKE_PROVIDER = "fake";

export function resolveProvider(value: string | undefined | null): "fake" {
  const chosen = value == null || value.trim() === "" ? FAKE_PROVIDER : value.trim();
  if (chosen !== FAKE_PROVIDER) {
    throw new Error("paid model providers are disabled");
  }
  return FAKE_PROVIDER;
}

export function prepareModelCall(
  ledgerRaw: string | null | undefined,
  providerEnv: string | undefined | null,
): "fake" {
  const provider = resolveProvider(providerEnv);
  const decision = evaluateLedger(ledgerRaw);
  if (!decision.allowed) {
    throw new Error(`cost_cap_blocked:${decision.reason}`);
  }
  return provider;
}
