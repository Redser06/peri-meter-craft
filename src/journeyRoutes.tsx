import { Route } from "react-router-dom";
import Learn from "@/pages/Learn";
import LearnTrack from "@/pages/LearnTrack";
import ManagerRoi from "@/pages/ManagerRoi";
import ManagerTeam from "@/pages/ManagerTeam";

export function JourneyRoutes() {
  return (
    <>
      <Route path="/learn" element={<Learn />} />
      <Route path="/learn/track/:id" element={<LearnTrack />} />
      <Route path="/manager/roi" element={<ManagerRoi />} />
      <Route path="/manager/team" element={<ManagerTeam />} />
    </>
  );
}
