import { Link, useParams } from "react-router-dom";
import { CURRICULUM_TRACKS } from "@/services/curriculumGraph";
import { PRD_CASE_STUDIES } from "@/data/caseStudies";
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
  padding: "1.25rem",
  marginTop: "1rem",
} as const;

export default function LearnTrack() {
  const { id } = useParams();
  const track = CURRICULUM_TRACKS.find((item) => item.id === id);
  const trackCaseStudies = PRD_CASE_STUDIES.filter((cs) => cs.trackId === id);

  return (
    <main style={shell}>
      <div style={{ maxWidth: "48rem", margin: "0 auto", padding: "2rem 1.25rem" }}>
        <Link to="/learn" style={{ color: "#e4e4e7" }}>
          Back to curriculum
        </Link>
        {track ? (
          <>
            <p style={{ fontFamily: stitchTokens.fontMono, marginBottom: 0 }}>Track {track.id}</p>
            <h1>{track.title}</h1>
            <p>Eval gate: {track.gateId}</p>
            <p>
              Prerequisites: {track.prerequisites.length === 0 ? "none" : track.prerequisites.join(", ")}
            </p>
            {trackCaseStudies.length > 0 && (
              <section style={{ marginTop: "2rem" }}>
                <h2 style={{ fontSize: "1.25rem", margin: "1.5rem 0 0.5rem" }}>
                  PRD-to-Executable-Contract Case Studies
                </h2>
                <p style={{ opacity: 0.75, fontSize: "0.9rem", marginTop: 0 }}>
                  Exercises adapted from legacy user story specs into deterministic executable contracts.
                </p>
                {trackCaseStudies.map((cs) => (
                  <div key={cs.id} style={card}>
                    <div style={{ fontFamily: stitchTokens.fontMono, fontSize: "0.8rem", color: "#a1a1aa", marginBottom: "0.25rem" }}>
                      {cs.id}
                    </div>
                    <h3 style={{ fontSize: "1.1rem", margin: "0 0 0.75rem" }}>{cs.title}</h3>
                    <div style={{ marginBottom: "0.75rem" }}>
                      <strong style={{ fontSize: "0.85rem", color: "#a1a1aa" }}>Legacy Story:</strong>
                      <p style={{ margin: "0.25rem 0", fontSize: "0.9rem" }}>"{cs.legacyStory}"</p>
                    </div>
                    <div style={{ marginBottom: "0.75rem" }}>
                      <strong style={{ fontSize: "0.85rem", color: "#f87171" }}>Legacy Flaw:</strong>
                      <p style={{ margin: "0.25rem 0", fontSize: "0.9rem", opacity: 0.9 }}>{cs.legacyFlaw}</p>
                    </div>
                    <div style={{ background: "#18181b", border: `1px solid ${stitchTokens.border}`, borderRadius: "0.5rem", padding: "0.75rem" }}>
                      <div style={{ fontFamily: stitchTokens.fontMono, fontSize: "0.85rem", color: "#38bdf8", marginBottom: "0.5rem" }}>
                        {cs.aiPmContract.endpoint}
                      </div>
                      <div style={{ fontSize: "0.85rem", marginBottom: "0.5rem" }}>
                        <span style={{ color: "#a1a1aa" }}>Property Invariant: </span>
                        <span>{cs.aiPmContract.propertyInvariant}</span>
                      </div>
                      <pre style={{ fontFamily: stitchTokens.fontMono, fontSize: "0.75rem", background: "#09090b", padding: "0.5rem", borderRadius: "0.25rem", overflowX: "auto", margin: 0 }}>
                        {JSON.stringify(cs.aiPmContract.schemaExample, null, 2)}
                      </pre>
                    </div>
                  </div>
                ))}
              </section>
            )}
          </>
        ) : (
          <h1>Unknown track</h1>
        )}
      </div>
    </main>
  );
}

