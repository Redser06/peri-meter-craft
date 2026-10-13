"""Shared verdict contract for gate scripts."""

import datetime
import json
import os
import subprocess
import time

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
RESULTS = os.path.join(ROOT, "gate-results")


def git_sha():
    try:
        return subprocess.check_output(["git", "-C", ROOT, "rev-parse", "HEAD"], text=True).strip()
    except Exception:
        return "0000000000000000000000000000000000000000"


def emit(gate_id, cases, min_cases, started, pending_human=False):
    failures = [f"{name}: {detail}" for name, ok, detail in cases if not ok]
    cases_run = len(cases)
    cases_failed = len(failures)
    passed = cases_failed == 0 and cases_run >= min_cases
    duration_ms = int((time.perf_counter() - started) * 1000)
    result = {
        "gate_id": gate_id,
        "exit_code": 0 if passed else 1,
        "sha": git_sha(),
        "verdict": "pass" if passed else "fail",
        "cases_run": cases_run,
        "cases_failed": cases_failed,
        "cases_skipped": 0,
        "skipped": [],
        "duration_ms": duration_ms,
        "min_cases": min_cases,
        "failures": failures,
        "pending_human": pending_human,
        "finished_at": datetime.datetime.now(datetime.timezone.utc).replace(microsecond=0).isoformat(),
    }
    os.makedirs(RESULTS, exist_ok=True)
    with open(os.path.join(RESULTS, f"{gate_id}.json"), "w", encoding="utf-8") as handle:
        json.dump(result, handle, indent=2)
        handle.write("\n")
    label = "PASS" if passed else "FAIL"
    print(
        f"{label} {gate_id} exit_code={result['exit_code']} sha={result['sha']} "
        f"verdict={result['verdict']} cases_run={cases_run} cases_failed={cases_failed} "
        f"duration_ms={duration_ms}"
    )
    for item in failures:
        print(f"  - {item}")
    return 0 if passed else 1
