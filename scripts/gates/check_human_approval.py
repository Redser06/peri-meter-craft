#!/usr/bin/env python3
import argparse
import hashlib
import json
import os
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from contract import ROOT, emit

GRAPH = os.path.join(ROOT, "projects", "perimeter", "perimeter-phase1.graph-v2.yaml")
PENDING = {"PERI-SUPABASE-KEY-ROTATION"}


def main():
    started = time.perf_counter()
    parser = argparse.ArgumentParser()
    parser.add_argument("--ref", required=True)
    parser.add_argument("--bind", default=None)
    args = parser.parse_args()
    path = os.path.join(ROOT, "approvals", f"{args.ref}.json")
    pending = args.ref in PENDING
    if not os.path.isfile(path):
        detail = "approval file is absent; a human still has to record it"
        return emit(gate_id(args.ref), [("recorded", False, detail)], 1, started, pending_human=pending)
    data = json.load(open(path, encoding="utf-8"))
    cases = [
        ("ref", data.get("ref") == args.ref, str(data.get("ref"))),
        ("status", data.get("status") == "approved", str(data.get("status"))),
    ]
    if args.bind == "graph_sha":
        digest = hashlib.sha256(open(GRAPH, "rb").read()).hexdigest()
        cases.append(("graph_sha", data.get("graph_sha") == digest, str(data.get("graph_sha"))))
    return emit(gate_id(args.ref), cases, 1, started, pending_human=pending)


def gate_id(ref):
    if ref == "PERI-SUPABASE-KEY-ROTATION":
        return "perimeter_key_rotation_recorded"
    if ref == "PERI-PHASE1-GRAPH-V2":
        return "perimeter_approval_recorded"
    return "perimeter_approval_recorded"


if __name__ == "__main__":
    sys.exit(main())
