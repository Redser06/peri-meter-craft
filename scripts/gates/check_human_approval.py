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
HUMAN_REFS = {"PERI-SUPABASE-KEY-ROTATION", "PERI-PHASE1-GRAPH-V2"}


def gate_id(ref):
    if ref == "PERI-SUPABASE-KEY-ROTATION":
        return "perimeter_key_rotation_recorded"
    return "perimeter_approval_recorded"


def main():
    started = time.perf_counter()
    parser = argparse.ArgumentParser()
    parser.add_argument("--ref", required=True)
    parser.add_argument("--bind", default=None)
    args = parser.parse_args()
    path = os.path.join(ROOT, "approvals", f"{args.ref}.json")
    if not os.path.isfile(path):
        detail = "approval file is absent; pending Conor"
        return emit(gate_id(args.ref), [("recorded", False, detail)], 1, started, pending_human=args.ref in HUMAN_REFS)
    data = json.load(open(path, encoding="utf-8"))
    cases = [
        ("ref", data.get("ref") == args.ref, str(data.get("ref"))),
        ("status", data.get("status") == "approved", str(data.get("status"))),
        ("approver", data.get("approver") == "conor", str(data.get("approver"))),
    ]
    if args.ref == "PERI-PHASE1-GRAPH-V2":
        cases.append(
            (
                "signed_by_conor",
                data.get("signed_by_conor") is True,
                "countersignature required; an agent signature does not count",
            )
        )
    if args.bind == "graph_sha":
        digest = hashlib.sha256(open(GRAPH, "rb").read()).hexdigest()
        cases.append(("graph_sha", data.get("graph_sha") == digest, str(data.get("graph_sha"))))
    return emit(gate_id(args.ref), cases, 1, started, pending_human=False)


if __name__ == "__main__":
    sys.exit(main())
