import { Link } from "react-router-dom";
import { CURRICULUM_TRACKS } from "@/services/curriculumGraph";
import { stitchTokens } from "@/types/stitch";

const shell = {
  background: stitchTokens.bg,
  color: "#fafafa",
  minHeight: "100vh",
  fontFamily: `${stitchTokens.fontSans}, sans-serif`,
} as const;

const card = {
  background: stitchTokens.card,
  border: `1px solid ${stitchTokens.border}`,
  borderRadius: "0.75rem",
  padding: "1rem",
} as const;

export default function Learn() {
  return (
    <main style={shell}>
      <div style={{ maxWidth: "48rem", margin: "0 auto", padding: "2rem 1.25rem" }}>
        <p style={{ fontFamily: stitchTokens.fontMono, letterSpacing: "0.08em", fontSize: "0.75rem" }}>
          TRAINEE
        </p>
        <h1 style={{ fontSize: "2.25rem", margin: "0.5rem 0 0.25rem" }}>Curriculum</h1>
        <p style={{ opacity: 0.75, marginTop: 0 }}>Eleven tracks, taken in dependency order.</p>
        <div style={{ display: "grid", gap: "0.75rem" }}>
          {CURRICULUM_TRACKS.map((track) => (
            <Link key={track.id} to={`/learn/track/${track.id}`} style={{ ...card, color: "inherit", textDecoration: "none" }}>
              <strong style={{ fontFamily: stitchTokens.fontMono }}>{track.id}</strong>
              <div>{track.title}</div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
