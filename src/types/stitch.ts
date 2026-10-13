/**
 * Stitch Design System Tokens (theme: neutral-craft)
 * Surfaces, typography, borders, and status accents.
 */
export const STITCH_DESIGN_TOKENS = {
  theme: "neutral-craft",
  surfaces: {
    bg: "#09090b",
    card: "#121215",
    subtle: "#18181b",
    border: "#27272a",
  },
  typography: {
    fontSans: "Inter",
    fontMono: "JetBrains Mono",
  },
  status: {
    pass: "#10b981", // Emerald
    pending: "#f59e0b", // Amber
    fail: "#f43f5e", // Rose
  },
} as const;

export const stitchTokens = {
  bg: "#09090b",
  card: "#121215",
  border: "#27272a",
  fontSans: "Inter",
  fontMono: "JetBrains Mono",
} as const;

export type StitchDesignTokens = typeof STITCH_DESIGN_TOKENS;
export type StitchTokens = typeof stitchTokens;
