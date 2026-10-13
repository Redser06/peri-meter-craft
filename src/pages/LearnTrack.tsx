import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CURRICULUM_TRACKS } from "@/services/curriculumGraph";
import { STITCH_DESIGN_TOKENS } from "@/types/stitch";
import { classifyLearnerError } from "@/lib/coach/state";

export default function LearnTrack() {
  const { id } = useParams<{ id: string }>();
  const track = CURRICULUM_TRACKS.find((t) => t.id === id) || CURRICULUM_TRACKS[0];

  const [diagnosticScore, setDiagnosticScore] = useState<number>(0.75);
  const [errorType, setErrorType] = useState<"misconception" | "slip">("slip");
  const [feedback, setFeedback] = useState<string | null>(null);

  const runDiagnostic = () => {
    const result = classifyLearnerError({
      score: diagnosticScore,
      errorClass: diagnosticScore < 0.8 ? errorType : null,
      confidence: 0.9,
      conceptId: track.title,
    });
    setFeedback(`[${result.remediationPath.toUpperCase()}] ${result.feedback}`);
  };

  return (
    <div
      className="min-h-screen p-8 text-[#fafafa]"
      style={{ backgroundColor: STITCH_DESIGN_TOKENS.surfaces.bg }}
    >
      <header className="mb-6 pb-4 border-b border-[#27272a] flex items-center justify-between">
        <div>
          <Link to="/learn" className="text-xs font-mono text-zinc-400 hover:text-white mb-2 inline-block">
            ← Back to All Tracks
          </Link>
          <h1 className="text-xl font-bold font-mono">
            Track {track.id} // {track.title}
          </h1>
        </div>
        <div className="text-xs font-mono text-zinc-400 bg-[#121215] border border-[#27272a] px-3 py-1.5 rounded">
          Gate ID: <span className="text-emerald-400">{track.gateId}</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto space-y-6">
        <section
          className="p-6 rounded-lg border"
          style={{
            backgroundColor: STITCH_DESIGN_TOKENS.surfaces.card,
            borderColor: STITCH_DESIGN_TOKENS.surfaces.border,
          }}
        >
          <h2 className="text-base font-semibold mb-3">Track Brief & Deliverable Requirements</h2>
          <p className="text-sm text-zinc-400 leading-relaxed mb-4">
            Transform from drafting natural language tickets into executing verified deliverables.
            This module requires automated code output verified against registered property tests.
          </p>
          <div className="grid grid-cols-2 gap-4 text-xs font-mono">
            <div className="bg-[#18181b] p-3 rounded border border-[#27272a]">
              <span className="text-zinc-500 block">PREREQUISITES:</span>
              <span className="text-zinc-200">
                {track.prerequisites.length > 0 ? track.prerequisites.join(", ") : "None (Root Module)"}
              </span>
            </div>
            <div className="bg-[#18181b] p-3 rounded border border-[#27272a]">
              <span className="text-zinc-500 block">EVAL GATE:</span>
              <span className="text-emerald-400">{track.gateId}</span>
            </div>
          </div>
        </section>

        <section
          className="p-6 rounded-lg border"
          style={{
            backgroundColor: STITCH_DESIGN_TOKENS.surfaces.card,
            borderColor: STITCH_DESIGN_TOKENS.surfaces.border,
          }}
        >
          <h2 className="text-base font-semibold mb-4">Lumina AI Coach Diagnostic Evaluation</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-mono text-zinc-400 block mb-1">
                Diagnostic Score: {diagnosticScore.toFixed(2)}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={diagnosticScore}
                onChange={(e) => setDiagnosticScore(parseFloat(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>

            <div className="flex gap-4 text-xs font-mono">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="errorType"
                  checked={errorType === "slip"}
                  onChange={() => setErrorType("slip")}
                />
                Slip (Syntactic / Minor)
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="errorType"
                  checked={errorType === "misconception"}
                  onChange={() => setErrorType("misconception")}
                />
                Misconception (Mental Model Flaw)
              </label>
            </div>

            <button
              onClick={runDiagnostic}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs rounded font-medium"
            >
              Run Diagnostic Assessment
            </button>

            {feedback && (
              <div className="mt-4 p-3 bg-[#18181b] border border-emerald-900/50 rounded text-xs font-mono text-emerald-300">
                {feedback}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
