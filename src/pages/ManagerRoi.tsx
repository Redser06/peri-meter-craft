import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ROI_DEFAULTS } from "@/config/roiDefaults";
import { computeROI } from "@/services/roiCalculator";
import { stitchTokens } from "@/types/stitch";

const shell = {
  background: stitchTokens.bg,
  color: "#fafafa",
  minHeight: "100vh",
  fontFamily: `${stitchTokens.fontSans}, sans-serif`,
} as const;

const field = {
  display: "grid",
  gap: "0.25rem",
  fontFamily: stitchTokens.fontMono,
  fontSize: "0.875rem",
} as const;

export default function ManagerRoi() {
  const [prs, setPrs] = useState(0);
  const [prototypes, setPrototypes] = useState(0);
  const [hoursPerPr, setHoursPerPr] = useState<number>(ROI_DEFAULTS.hoursPerPr);
  const [hoursPerPrototype, setHoursPerPrototype] = useState<number>(ROI_DEFAULTS.hoursPerPrototype);
  const [usdPerHour, setUsdPerHour] = useState<number>(ROI_DEFAULTS.usdPerHour);

  const result = useMemo(() => {
    try {
      return computeROI(
        { prs, prototypes },
        { hoursPerPr, hoursPerPrototype, usdPerHour },
      );
    } catch {
      return null;
    }
  }, [prs, prototypes, hoursPerPr, hoursPerPrototype, usdPerHour]);

  return (
    <main style={shell}>
      <div style={{ maxWidth: "40rem", margin: "0 auto", padding: "2rem 1.25rem" }}>
        <p style={{ fontFamily: stitchTokens.fontMono, letterSpacing: "0.08em", fontSize: "0.75rem" }}>MANAGER</p>
        <h1>Return</h1>
        <p>
          Rates are guesstimates and overridable. Defaults come from the rate configuration
          ({ROI_DEFAULTS.status}).
        </p>
        <div style={{ display: "grid", gap: "0.75rem", background: stitchTokens.card, border: `1px solid ${stitchTokens.border}`, borderRadius: "0.75rem", padding: "1rem" }}>
          <label style={field}>
            Pull requests
            <input aria-label="Pull requests" type="number" min={0} value={prs} onChange={(event) => setPrs(Number(event.target.value))} />
          </label>
          <label style={field}>
            Prototypes
            <input aria-label="Prototypes" type="number" min={0} value={prototypes} onChange={(event) => setPrototypes(Number(event.target.value))} />
          </label>
          <label style={field}>
            Hours per pull request
            <input aria-label="Hours per pull request" type="number" min={0} step="0.1" value={hoursPerPr} onChange={(event) => setHoursPerPr(Number(event.target.value))} />
          </label>
          <label style={field}>
            Hours per prototype
            <input aria-label="Hours per prototype" type="number" min={0} step="0.1" value={hoursPerPrototype} onChange={(event) => setHoursPerPrototype(Number(event.target.value))} />
          </label>
          <label style={field}>
            USD per hour
            <input aria-label="USD per hour" type="number" min={0} step="0.1" value={usdPerHour} onChange={(event) => setUsdPerHour(Number(event.target.value))} />
          </label>
        </div>
        <h2>Estimate</h2>
        {result ? (
          <p style={{ fontFamily: stitchTokens.fontMono }}>
            Hours saved {result.hoursSaved} · USD {result.usd}
          </p>
        ) : (
          <p>Enter finite, non-negative counts and rates.</p>
        )}
        <p>
          <Link to="/manager/team" style={{ color: "#e4e4e7" }}>
            Team
          </Link>
        </p>
      </div>
    </main>
  );
}
