import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter, Routes } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import { JourneyRoutes } from "@/journeyRoutes";

let root: Root | null = null;
let host: HTMLDivElement | null = null;

async function mount(path: string) {
  host = document.createElement("div");
  document.body.appendChild(host);
  root = createRoot(host);
  await act(async () => {
    root?.render(
      <MemoryRouter initialEntries={[path]}>
        <Routes>{JourneyRoutes()}</Routes>
      </MemoryRouter>,
    );
  });
  return host.textContent ?? "";
}

afterEach(() => {
  act(() => root?.unmount());
  host?.remove();
  root = null;
  host = null;
});

describe("journey routes", () => {
  it("mounts the trainee curriculum at /learn", async () => {
    const text = await mount("/learn");
    expect(text).toContain("Curriculum");
    expect(text).toContain("Problem framing");
  });

  it("mounts a track at /learn/track/:id", async () => {
    const text = await mount("/learn/track/01");
    expect(text).toContain("Problem framing");
    expect(text).toContain("Track 01");
  });

  it("mounts manager return at /manager/roi", async () => {
    const text = await mount("/manager/roi");
    expect(text).toContain("Return");
    expect(text).toContain("guesstimates");
  });

  it("mounts manager team at /manager/team", async () => {
    const text = await mount("/manager/team");
    expect(text).toContain("Team");
    expect(text).toContain("No learners");
  });
});
