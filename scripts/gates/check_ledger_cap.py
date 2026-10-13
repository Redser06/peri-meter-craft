#!/usr/bin/env python3
"""Ledger evidence is the TypeScript suite. This script does not reimplement the guard."""

import json
import os
import subprocess
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from contract import ROOT, emit


def main():
    started = time.perf_counter()
    vitest = os.path.join(ROOT, "node_modules", ".bin", "vitest")
    proc = subprocess.run(
        [vitest, "run", "tests/ledger_cap.test.ts", "--reporter=json"],
        cwd=ROOT,
        capture_output=True,
        text=True,
        timeout=50,
    )
    payload = None
    raw = proc.stdout.strip()
    start = raw.find("{")
    if start >= 0:
        try:
            payload = json.loads(raw[start:])
        except Exception:
            payload = None
    cases_run = int(payload.get("numTotalTests", 0)) if isinstance(payload, dict) else 0
    cases_failed = int(payload.get("numFailedTests", 0)) if isinstance(payload, dict) else 1
    if proc.returncode != 0 and cases_failed == 0:
        cases_failed = 1
    if cases_run <= 0:
        detail = (proc.stderr or proc.stdout or "vitest produced no cases")[-400:]
        cases = [("vitest", False, detail)]
    else:
        passed = cases_run - cases_failed
        cases = [("vitest", True, "pass")] * passed + [("vitest", False, "failed")] * cases_failed
    return emit("perimeter_ledger_cap_enforced", cases, 5, started)


if __name__ == "__main__":
    sys.exit(main())
