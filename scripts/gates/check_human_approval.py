#!/usr/bin/env python3
import argparse
import hashlib
import json
import os
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from contract import ROOT, emit

GRAPH = os.path.join(ROOT, "gates", "perimeter-phase1.graph.yaml")


def main():
    started = time.perf_counter()
    parser = argparse.ArgumentParser()
    parser.add_argument("--ref", default="PERI-PHASE1-GRAPH")
    parser.add_argument("--bind", default=None)
    args = parser.parse_args()
    path = os.path.join(ROOT, "approvals", f"{args.ref}.json")
    if not os.path.isfile(path):
        detail = f"approval file {path} is absent"
        return emit("perimeter_approval_recorded", [("recorded", False, detail)], 1, started)
    data = json.load(open(path, encoding="utf-8"))
    cases = [
        ("ref", data.get("ref") == args.ref, str(data.get("ref"))),
        ("status", data.get("status") == "approved", str(data.get("status"))),
    ]
    if args.bind == "graph_sha" and os.path.isfile(GRAPH):
        digest = hashlib.sha256(open(GRAPH, "rb").read()).hexdigest()
        cases.append(("graph_sha", data.get("graph_sha") == digest, str(data.get("graph_sha"))))
    return emit("perimeter_approval_recorded", cases, 1, started)


if __name__ == "__main__":
    sys.exit(main())
