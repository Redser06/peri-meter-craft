import { Link } from "react-router-dom";
import { stitchTokens } from "@/types/stitch";

const shell = {
  background: stitchTokens.bg,
  color: "#fafafa",
  minHeight: "100vh",
  fontFamily: `${stitchTokens.fontSans}, sans-serif`,
} as const;

export default function ManagerTeam() {
  return (
    <main style={shell}>
      <div style={{ maxWidth: "40rem", margin: "0 auto", padding: "2rem 1.25rem" }}>
        <p style={{ fontFamily: stitchTokens.fontMono, letterSpacing: "0.08em", fontSize: "0.75rem" }}>MANAGER</p>
        <h1>Team</h1>
        <p role="status">Model calls are off. This page does not contact a provider.</p>
        <p>No learners are assigned yet.</p>
        <p>
          <Link to="/manager/roi" style={{ color: "#e4e4e7" }}>
            Return
          </Link>
        </p>
      </div>
    </main>
  );
}
