#!/usr/bin/env python3
import json
import os
import re
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from contract import ROOT, emit


def registry_ids():
    ids = set()
    for rel in ("tools/gates/registry.json", "gates/perimeter-phase1.registry.json"):
        data = json.load(open(os.path.join(ROOT, rel), encoding="utf-8"))
        ids.update(data.get("gates", {}))
    return ids


def main():
    started = time.perf_counter()
    text = open(os.path.join(ROOT, "docs", "TRANSFORMATION_BLUEPRINT.md"), encoding="utf-8").read()
    headings = re.findall(r"^## Track (\d{2}) — (.+)$", text, re.M)
    gates = re.findall(r"^Eval gate: `([A-Za-z0-9_.-]+)`", text, re.M)
    known = registry_ids()
    cases = []
    count = max(len(headings), len(gates), 11)
    for index in range(count):
        if index >= len(headings) or index >= len(gates):
            cases.append((f"track_{index}", False, "heading or gate missing"))
            continue
        track_id, _title = headings[index]
        gate = gates[index]
        ok = gate in known
        cases.append((f"track_{track_id}", ok, gate if ok else f"unregistered {gate}"))
    return emit("perimeter_blueprint_track_gates", cases, 11, started)


if __name__ == "__main__":
    sys.exit(main())
