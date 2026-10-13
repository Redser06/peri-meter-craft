import { Link } from "react-router-dom";
import { CURRICULUM_TRACKS } from "@/services/curriculumGraph";
import { PERIMETER_LEXICON } from "@/data/lexicon";
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

        <section style={{ marginTop: "3rem" }}>
          <p style={{ fontFamily: stitchTokens.fontMono, letterSpacing: "0.08em", fontSize: "0.75rem" }}>
            REFERENCE
          </p>
          <h2 style={{ fontSize: "1.75rem", margin: "0.5rem 0 0.25rem" }}>
            Product &amp; AI Engineering Lexicon
          </h2>
          <p style={{ opacity: 0.75, marginTop: 0, marginBottom: "1rem" }}>
            Modern transformation vocabulary contrasting traditional PM views with the AI PM paradigm.
          </p>
          <div style={{ display: "grid", gap: "0.75rem" }}>
            {PERIMETER_LEXICON.map((entry) => (
              <div key={entry.term} style={card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.25rem" }}>
                  <strong style={{ fontFamily: stitchTokens.fontMono, fontSize: "0.95rem" }}>{entry.term}</strong>
                  <span style={{ fontSize: "0.75rem", opacity: 0.6, fontFamily: stitchTokens.fontMono }}>{entry.category}</span>
                </div>
                <p style={{ fontSize: "0.875rem", margin: "0.25rem 0 0.75rem", opacity: 0.9 }}>{entry.definition}</p>
                <div style={{ fontSize: "0.8rem", display: "grid", gap: "0.35rem", padding: "0.5rem 0.75rem", background: "#18181b", borderRadius: "0.375rem" }}>
                  <div>
                    <span style={{ color: "#a1a1aa" }}>Traditional: </span>
                    <span>{entry.traditionalPmView}</span>
                  </div>
                  <div>
                    <span style={{ color: "#38bdf8" }}>AI PM: </span>
                    <span>{entry.aiPmParadigm}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

