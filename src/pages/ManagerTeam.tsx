import { Link } from "react-router-dom";
import { STITCH_DESIGN_TOKENS } from "@/types/stitch";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  completedTracks: number;
  prsShipped: number;
  prototypesBuilt: number;
  certified: boolean;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "tm-1",
    name: "Alex Rivera",
    role: "Senior PM (Core Experience)",
    completedTracks: 11,
    prsShipped: 14,
    prototypesBuilt: 5,
    certified: true,
  },
  {
    id: "tm-2",
    name: "Priya Sharma",
    role: "Staff PM (Platform)",
    completedTracks: 9,
    prsShipped: 8,
    prototypesBuilt: 4,
    certified: false,
  },
  {
    id: "tm-3",
    name: "Marcus Vance",
    role: "Growth PM",
    completedTracks: 6,
    prsShipped: 5,
    prototypesBuilt: 2,
    certified: false,
  },
];

export default function ManagerTeam() {
  return (
    <div
      className="min-h-screen p-8 text-[#fafafa]"
      style={{ backgroundColor: STITCH_DESIGN_TOKENS.surfaces.bg }}
    >
      <header className="mb-8 border-b pb-6" style={{ borderColor: STITCH_DESIGN_TOKENS.surfaces.border }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-mono tracking-tight">PERI-METER // Team Capability Roster</h1>
            <p className="text-sm text-zinc-400 mt-1">Autonomous Builder Certification & Shipped Project Catalogue</p>
          </div>
          <Link
            to="/manager/roi"
            className="text-xs font-mono bg-[#121215] border border-[#27272a] hover:border-zinc-500 text-zinc-300 px-4 py-2 rounded"
          >
            ← View ROI Telemetry
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto space-y-8">
        <section
          className="p-6 rounded-lg border"
          style={{
            backgroundColor: STITCH_DESIGN_TOKENS.surfaces.card,
            borderColor: STITCH_DESIGN_TOKENS.surfaces.border,
          }}
        >
          <h2 className="text-base font-semibold font-mono mb-4">Enrolled Product Managers</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#27272a] text-zinc-400">
                  <th className="pb-3">NAME</th>
                  <th className="pb-3">ROLE</th>
                  <th className="pb-3">TRACK PROGRESS</th>
                  <th className="pb-3">PRS SHIPPED</th>
                  <th className="pb-3">PROTOTYPES</th>
                  <th className="pb-3">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272a]">
                {TEAM_MEMBERS.map((member) => (
                  <tr key={member.id} className="hover:bg-zinc-900/50">
                    <td className="py-3 font-medium text-white">{member.name}</td>
                    <td className="py-3 text-zinc-400">{member.role}</td>
                    <td className="py-3">
                      <span className="text-emerald-400">{member.completedTracks}</span>
                      <span className="text-zinc-600">/11</span>
                    </td>
                    <td className="py-3">{member.prsShipped}</td>
                    <td className="py-3">{member.prototypesBuilt}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] ${
                          member.certified
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                            : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                        }`}
                      >
                        {member.certified ? "CERTIFIED AI BUILDER" : "IN PROGRESS"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
