import { Link, useParams } from "react-router-dom";
import { CURRICULUM_TRACKS } from "@/services/curriculumGraph";
import { stitchTokens } from "@/types/stitch";

const shell = {
  background: stitchTokens.bg,
  color: "#fafafa",
  minHeight: "100vh",
  fontFamily: `${stitchTokens.fontSans}, sans-serif`,
} as const;

export default function LearnTrack() {
  const { id } = useParams();
  const track = CURRICULUM_TRACKS.find((item) => item.id === id);

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
          </>
        ) : (
          <h1>Unknown track</h1>
        )}
      </div>
    </main>
  );
}
