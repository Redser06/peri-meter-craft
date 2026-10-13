#!/usr/bin/env python3
import argparse
import os
import re
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from contract import ROOT, emit

TRACK_RE = re.compile(
    r'\{\s*id:\s*"(?P<id>\d{2})",\s*title:\s*"(?P<title>[^"]+)",\s*'
    r'gateId:\s*"(?P<gate>[^"]+)",\s*prerequisites:\s*\[(?P<prereq>[^\]]*)\]',
    re.S,
)


def parse_ts(text):
    tracks = []
    for match in TRACK_RE.finditer(text):
        prereq = re.findall(r'"(\d{2})"', match.group("prereq"))
        tracks.append({
            "id": match.group("id"),
            "title": match.group("title"),
            "gate": match.group("gate"),
            "prerequisites": prereq,
        })
    return tracks


def parse_blueprint(text):
    headings = re.findall(r"^## Track (\d{2}) — (.+)$", text, re.M)
    return [{"id": track_id, "title": title} for track_id, title in headings]


def topo(tracks):
    indegree = {track["id"]: len(track["prerequisites"]) for track in tracks}
    dependents = {track["id"]: [] for track in tracks}
    for track in tracks:
        for prerequisite in track["prerequisites"]:
            dependents[prerequisite].append(track["id"])
    ready = sorted(track_id for track_id, degree in indegree.items() if degree == 0)
    ordered = []
    while ready:
        track_id = ready.pop(0)
        ordered.append(track_id)
        for dependent in sorted(dependents[track_id]):
            indegree[dependent] -= 1
            if indegree[dependent] == 0:
                ready.append(dependent)
                ready.sort()
    if len(ordered) != len(tracks):
        raise ValueError("cycle")
    return ordered


def main():
    started = time.perf_counter()
    parser = argparse.ArgumentParser()
    parser.add_argument("--tracks-from", default="docs/TRANSFORMATION_BLUEPRINT.md")
    args = parser.parse_args()
    blueprint_path = os.path.join(ROOT, args.tracks_from)
    blueprint = parse_blueprint(open(blueprint_path, encoding="utf-8").read())
    source = parse_ts(open(os.path.join(ROOT, "src", "services", "curriculumGraph.ts"), encoding="utf-8").read())
    by_id = {track["id"]: track for track in source}
    try:
        order = topo(source)
        cycle = None
    except Exception as exc:
        order = []
        cycle = str(exc)
    cases = []
    for item in blueprint:
        track = by_id.get(item["id"])
        if cycle:
            cases.append((item["id"], False, cycle))
            continue
        if not track:
            cases.append((item["id"], False, "missing from curriculum graph"))
            continue
        title_ok = track["title"] == item["title"]
        position_ok = item["id"] in order and all(
            order.index(prerequisite) < order.index(item["id"]) for prerequisite in track["prerequisites"]
        )
        cases.append((item["id"], title_ok and position_ok, track["title"] if title_ok else "title or order mismatch"))
    if len(cases) < 11:
        cases.append(("count", False, f"parsed {len(cases)} blueprint tracks"))
    return emit("perimeter_curriculum_dag_acyclic", cases, 11, started)


if __name__ == "__main__":
    sys.exit(main())
