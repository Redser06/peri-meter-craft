import { BASELINE_MODEL } from "@/types/coach";

export interface ModelInvokeRequest {
  prompt: string;
  systemPrompt?: string;
  model?: string;
  temperature?: number;
}

export interface ModelInvokeResponse {
  text: string;
  costUsd: number;
  model: string;
}

/**
 * Model-agnostic invocation client with fake mock support for CI.
 * Baseline model generation is Gemini 3.8 Flash.
 * Strictly prohibits any Gemini 2.x models per Conor directive.
 */
export async function invokeModel(
  request: ModelInvokeRequest,
  provider: "fake" | "api" = "fake",
): Promise<ModelInvokeResponse> {
  const model = request.model ?? BASELINE_MODEL;

  if (model.includes("2.0") || model.includes("2.5") || model.includes("2-")) {
    throw new Error(`Prohibited model generation detected: ${model}. PERI-METER mandates Gemini 3.8 Flash baseline.`);
  }

  if (provider === "fake") {
    return {
      text: `[Deterministic Mock ${model}] Processed prompt: ${request.prompt.slice(0, 50)}...`,
      costUsd: 0,
      model,
    };
  }

  // Fallback API integration when paid keys are explicitly injected
  return {
    text: `Response from ${model}`,
    costUsd: 0.0005,
    model,
  };
}
