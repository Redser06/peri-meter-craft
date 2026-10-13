import { useState } from "react";
import { Link } from "react-router-dom";
import { CURRICULUM_TRACKS, isTrackUnlocked } from "@/services/curriculumGraph";
import { STITCH_DESIGN_TOKENS } from "@/types/stitch";

export default function Learn() {
  const [completedTracks, setCompletedTracks] = useState<string[]>(["01"]);

  const toggleTrackCompletion = (id: string) => {
    setCompletedTracks((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  };

  return (
    <div
      className="min-h-screen p-8 text-[#fafafa]"
      style={{ backgroundColor: STITCH_DESIGN_TOKENS.surfaces.bg }}
    >
      <header className="mb-8 border-b pb-6" style={{ borderColor: STITCH_DESIGN_TOKENS.surfaces.border }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-mono tracking-tight">PERI-METER // Trainee Curriculum</h1>
            <p className="text-sm text-zinc-400 mt-1">Autonomous Builder & Empirical Evaluator Transformation Track</p>
          </div>
          <div className="flex gap-4 text-xs font-mono">
            <div className="bg-[#121215] border border-[#27272a] px-3 py-2 rounded">
              <span className="text-zinc-500">Learner ID: </span>
              <span className="text-emerald-400">trainee_pm_42</span>
            </div>
            <div className="bg-[#121215] border border-[#27272a] px-3 py-2 rounded">
              <span className="text-zinc-500">Progress: </span>
              <span className="text-emerald-400">{completedTracks.length}/11 Completed</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CURRICULUM_TRACKS.map((track) => {
            const unlocked = isTrackUnlocked(track.id, completedTracks);
            const completed = completedTracks.includes(track.id);

            return (
              <div
                key={track.id}
                className="p-5 rounded-lg border transition-all"
                style={{
                  backgroundColor: STITCH_DESIGN_TOKENS.surfaces.card,
                  borderColor: completed
                    ? STITCH_DESIGN_TOKENS.status.pass
                    : STITCH_DESIGN_TOKENS.surfaces.border,
                }}
              >
                <div className="flex items-start justify-between">
                  <span className="font-mono text-xs text-zinc-500">TRACK {track.id}</span>
                  <span
                    className="text-xs px-2 py-0.5 rounded font-mono"
                    style={{
                      backgroundColor: completed
                        ? "#064e3b"
                        : unlocked
                        ? "#1e293b"
                        : "#27272a",
                      color: completed
                        ? STITCH_DESIGN_TOKENS.status.pass
                        : unlocked
                        ? "#93c5fd"
                        : "#71717a",
                    }}
                  >
                    {completed ? "COMPLETED" : unlocked ? "UNLOCKED" : "LOCKED"}
                  </span>
                </div>

                <h2 className="mt-2 text-base font-semibold leading-snug">{track.title}</h2>

                <div className="mt-4 pt-3 border-t border-[#27272a] flex items-center justify-between">
                  <button
                    onClick={() => toggleTrackCompletion(track.id)}
                    className="text-xs font-mono text-zinc-400 hover:text-white"
                  >
                    {completed ? "Mark Incomplete" : "Simulate Complete"}
                  </button>

                  <Link
                    to={`/learn/track/${track.id}`}
                    className={`text-xs font-mono font-medium px-3 py-1.5 rounded ${
                      unlocked
                        ? "bg-zinc-100 text-black hover:bg-white"
                        : "bg-zinc-800 text-zinc-500 pointer-events-none"
                    }`}
                  >
                    Enter Track →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
