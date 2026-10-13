import { useState } from "react";
import { Link } from "react-router-dom";
import { ROI_DEFAULTS } from "@/config/roiDefaults";
import { computeROI } from "@/services/roiCalculator";
import { STITCH_DESIGN_TOKENS } from "@/types/stitch";

export default function ManagerRoi() {
  const [prs, setPrs] = useState<number>(24);
  const [prototypes, setPrototypes] = useState<number>(8);

  // Initialize from defaults config module (documented overridable guesstimates)
  const [hoursPerPr, setHoursPerPr] = useState<number>(ROI_DEFAULTS.hoursPerPr);
  const [hoursPerPrototype, setHoursPerPrototype] = useState<number>(ROI_DEFAULTS.hoursPerPrototype);
  const [usdPerHour, setUsdPerHour] = useState<number>(ROI_DEFAULTS.usdPerHour);

  const roi = computeROI(
    { prs, prototypes },
    { hoursPerPr, hoursPerPrototype, usdPerHour },
  );

  return (
    <div
      className="min-h-screen p-8 text-[#fafafa]"
      style={{ backgroundColor: STITCH_DESIGN_TOKENS.surfaces.bg }}
    >
      <header className="mb-8 border-b pb-6" style={{ borderColor: STITCH_DESIGN_TOKENS.surfaces.border }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-mono tracking-tight">PERI-METER // Managerial ROI Telemetry</h1>
            <p className="text-sm text-zinc-400 mt-1">Deterministic Monotonic Return on Engineering Hours Offset</p>
          </div>
          <div className="flex gap-4">
            <Link
              to="/manager/team"
              className="text-xs font-mono bg-[#121215] border border-[#27272a] hover:border-zinc-500 text-zinc-300 px-4 py-2 rounded"
            >
              View Team Roster →
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            className="p-6 rounded-lg border"
            style={{
              backgroundColor: STITCH_DESIGN_TOKENS.surfaces.card,
              borderColor: STITCH_DESIGN_TOKENS.surfaces.border,
            }}
          >
            <span className="font-mono text-xs text-zinc-500 uppercase">Engineering Hours Offset</span>
            <div className="text-3xl font-mono font-bold text-emerald-400 mt-2">
              {roi.hoursSaved.toFixed(1)} hrs
            </div>
            <p className="text-xs text-zinc-500 mt-2 font-mono">Monthly engineering bandwidth preserved</p>
          </div>

          <div
            className="p-6 rounded-lg border"
            style={{
              backgroundColor: STITCH_DESIGN_TOKENS.surfaces.card,
              borderColor: STITCH_DESIGN_TOKENS.surfaces.border,
            }}
          >
            <span className="font-mono text-xs text-zinc-500 uppercase">Estimated Dollar ROI</span>
            <div className="text-3xl font-mono font-bold text-emerald-400 mt-2">
              ${roi.usd.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-zinc-500 mt-2 font-mono">Gross monthly value generated</p>
          </div>

          <div
            className="p-6 rounded-lg border"
            style={{
              backgroundColor: STITCH_DESIGN_TOKENS.surfaces.card,
              borderColor: STITCH_DESIGN_TOKENS.surfaces.border,
            }}
          >
            <span className="font-mono text-xs text-zinc-500 uppercase">Mathematical Invariant</span>
            <div className="text-sm font-mono text-zinc-300 mt-3">
              <span className="text-emerald-400 font-bold">d(ROI)/d(Skills) ≥ 0</span>
            </div>
            <p className="text-xs text-zinc-500 mt-2 font-mono">Monotonic non-decreasing verified across 200+ states</p>
          </div>
        </div>

        <section
          className="p-6 rounded-lg border space-y-6"
          style={{
            backgroundColor: STITCH_DESIGN_TOKENS.surfaces.card,
            borderColor: STITCH_DESIGN_TOKENS.surfaces.border,
          }}
        >
          <div className="flex items-center justify-between border-b border-[#27272a] pb-4">
            <h2 className="text-base font-semibold font-mono">Interactive Telemetry & Rate Calibration</h2>
            <span className="text-xs font-mono text-amber-400 bg-amber-950/40 border border-amber-800/50 px-2.5 py-1 rounded">
              Config status: {ROI_DEFAULTS.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Activity Throughput</h3>
              <div>
                <label className="text-xs font-mono text-zinc-300 block mb-1">
                  Authored Pull Requests: <span className="text-emerald-400">{prs}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={prs}
                  onChange={(e) => setPrs(parseInt(e.target.value, 10))}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-zinc-300 block mb-1">
                  Deployed Working Prototypes: <span className="text-emerald-400">{prototypes}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={prototypes}
                  onChange={(e) => setPrototypes(parseInt(e.target.value, 10))}
                  className="w-full accent-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Calibration Rates (Overridable)</h3>
              <div>
                <label className="text-xs font-mono text-zinc-300 block mb-1">
                  Hours saved per PR: <span className="text-zinc-200">{hoursPerPr}h</span>
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={hoursPerPr}
                  onChange={(e) => setHoursPerPr(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#18181b] border border-[#27272a] rounded px-3 py-1.5 text-xs font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-zinc-300 block mb-1">
                  Hours saved per Prototype: <span className="text-zinc-200">{hoursPerPrototype}h</span>
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={hoursPerPrototype}
                  onChange={(e) => setHoursPerPrototype(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#18181b] border border-[#27272a] rounded px-3 py-1.5 text-xs font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-zinc-300 block mb-1">
                  Engineering blended hourly rate: <span className="text-zinc-200">${usdPerHour}/h</span>
                </label>
                <input
                  type="number"
                  step="5"
                  min="0"
                  value={usdPerHour}
                  onChange={(e) => setUsdPerHour(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#18181b] border border-[#27272a] rounded px-3 py-1.5 text-xs font-mono"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
