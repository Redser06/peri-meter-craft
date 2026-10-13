#!/usr/bin/env python3
import glob
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from contract import RESULTS


def main():
    paths = sorted(glob.glob(os.path.join(RESULTS, "*.json")))
    paths = [path for path in paths if not path.endswith(".spec.json")]
    print("| Gate | Verdict | Cases run | Cases failed | Duration ms | SHA | Exit |")
    print("| --- | --- | --- | --- | --- | --- | --- |")
    for path in paths:
        data = json.load(open(path, encoding="utf-8"))
        verdict = data.get("verdict", "")
        if data.get("pending_human") and verdict != "pass":
            verdict = "pending"
        sha = str(data.get("sha", ""))[:12]
        print(
            f"| {data.get('gate_id')} | {verdict} | {data.get('cases_run')} | "
            f"{data.get('cases_failed')} | {data.get('duration_ms')} | {sha} | {data.get('exit_code')} |"
        )
    return 0


if __name__ == "__main__":
    sys.exit(main())
