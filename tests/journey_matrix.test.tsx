import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Learn from "@/pages/Learn";
import LearnTrack from "@/pages/LearnTrack";
import ManagerRoi from "@/pages/ManagerRoi";
import ManagerTeam from "@/pages/ManagerTeam";

describe("Journey Matrix: Route Mounting & Persona Navigation Suite", () => {
  it("mounts Persona A Trainee dashboard on /learn", () => {
    render(
      <MemoryRouter initialEntries={["/learn"]}>
        <Routes>
          <Route path="/learn" element={<Learn />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText(/PERI-METER \/\/ Trainee Curriculum/i)).toBeDefined();
    expect(screen.getByText(/Prompt-to-App Prototyping Runtime/i)).toBeDefined();
    expect(screen.getByText(/TRACK 01/i)).toBeDefined();
    expect(screen.getByText(/TRACK 11/i)).toBeDefined();
  });

  it("mounts Persona A Trainee track detail on /learn/track/:id", () => {
    render(
      <MemoryRouter initialEntries={["/learn/track/01"]}>
        <Routes>
          <Route path="/learn/track/:id" element={<LearnTrack />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText(/Track 01 \/\//i)).toBeDefined();
    expect(screen.getByText(/Lumina AI Coach Diagnostic Evaluation/i)).toBeDefined();
  });

  it("mounts Persona B Leadership ROI telemetry on /manager/roi", () => {
    render(
      <MemoryRouter initialEntries={["/manager/roi"]}>
        <Routes>
          <Route path="/manager/roi" element={<ManagerRoi />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText(/PERI-METER \/\/ Managerial ROI Telemetry/i)).toBeDefined();
    expect(screen.getAllByText(/Engineering Hours Offset/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Estimated Dollar ROI/i)).toBeDefined();
    expect(screen.getByText(/d\(ROI\)\/d\(Skills\) ≥ 0/i)).toBeDefined();
  });

  it("mounts Persona B Leadership team roster on /manager/team", () => {
    render(
      <MemoryRouter initialEntries={["/manager/team"]}>
        <Routes>
          <Route path="/manager/team" element={<ManagerTeam />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText(/PERI-METER \/\/ Team Capability Roster/i)).toBeDefined();
    expect(screen.getByText(/Enrolled Product Managers/i)).toBeDefined();
    expect(screen.getByText(/Alex Rivera/i)).toBeDefined();
  });
});
