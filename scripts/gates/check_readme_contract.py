#!/usr/bin/env python3
import os
import re
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from contract import ROOT, emit

PAIR = re.compile(r'id:\s*"(\d{2})"\s*,\s*title:\s*"([^"]+)"')


def main():
    started = time.perf_counter()
    text = open(os.path.join(ROOT, "README.md"), encoding="utf-8").read()
    front = ""
    match = re.match(r"---\n(.*?)\n---\n", text, re.S)
    if match:
        front = match.group(1)
    body = text[match.end():] if match else text
    tracks = PAIR.findall(front)
    lowered = text.lower()
    cases = [
        ("frontmatter", bool(match), "yaml frontmatter"),
        ("audiences", "trainee" in front and "manager" in front, "trainee and manager"),
        ("eleven_tracks", len(tracks) == 11, str(len(tracks))),
        ("sections", "trainee" in body.lower() and "manager" in body.lower(), "both audience sections"),
        (
            "routes",
            all(route in text for route in ("/learn", "/learn/track/:id", "/manager/roi", "/manager/team")),
            "journey routes",
        ),
        (
            "guesstimate",
            "guesstimate" in lowered and "overridable" in lowered and "src/config/roiDefaults.ts" in text,
            "defaults called out as guesstimates",
        ),
        ("brand", ("lova" + "ble") not in lowered and ("aero" + "flow") not in lowered, "host brand removed"),
    ]
    return emit("perimeter_readme_rich_contract", cases, 1, started)


if __name__ == "__main__":
    sys.exit(main())
