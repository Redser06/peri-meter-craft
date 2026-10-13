#!/usr/bin/env python3
"""Run Phase 1 gates in graph order and check the verdict contract."""

import json
import os
import re
import shlex
import subprocess
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from contract import RESULTS, ROOT, emit

HUMAN_PENDING = {"perimeter_key_rotation_recorded"}
GRAPH = os.path.join(ROOT, "projects", "perimeter", "perimeter-phase1.graph-v2.yaml")
REGISTRIES = [
    os.path.join(ROOT, "tools", "gates", "registry.json"),
    os.path.join(ROOT, "gates", "perimeter-phase1.registry.json"),
]


def load_registry():
    merged = {}
    for path in REGISTRIES:
        data = json.load(open(path, encoding="utf-8"))
        for gate_id, entry in data["gates"].items():
            merged[gate_id] = entry
    return merged


def graph_gates(text):
    ordered = []
    for line in text.splitlines():
        code = line.split("#", 1)[0]
        match = re.match(r"\s*gate:\s*\[(.*)\]\s*$", code)
        if not match:
            continue
        ordered.extend(part.strip().strip("'\"") for part in match.group(1).split(",") if part.strip())
    return ordered


def command_for(gate_id, script):
    script = script.split("#", 1)[0].strip()
    if gate_id == "perimeter_protected_files":
        return [sys.executable, "scripts/gates/check_protected_files.py"]
    if script.startswith("npx "):
        return None
    parts = shlex.split(script)
    if parts and parts[0].startswith("scripts/"):
        return [sys.executable, *parts]
    if parts and parts[0] == "python3":
        parts[0] = sys.executable
    return parts


def write_vitest_result(gate_id, min_cases, timeout_s, script):
    started = time.perf_counter()
    proc = subprocess.run(
        shlex.split(script.split("#", 1)[0].strip()),
        cwd=ROOT,
        capture_output=True,
        text=True,
        timeout=timeout_s,
    )
    payload = None
    raw = proc.stdout.strip()
    if raw:
        try:
            payload = json.loads(raw[raw.find("{") :])
        except Exception:
            payload = None
    cases_run = int(payload.get("numTotalTests", 0)) if isinstance(payload, dict) else 0
    cases_failed = int(payload.get("numFailedTests", 0)) if isinstance(payload, dict) else 1
    if proc.returncode != 0 and cases_failed == 0:
        cases_failed = 1
    if cases_run < min_cases:
        cases_failed = max(cases_failed, 1)
    cases = [("vitest", cases_failed == 0 and cases_run >= min_cases, f"cases_run={cases_run}")]
    # Expand to the reported vitest count so the contract sees every case.
    if cases_run > 1:
        cases = [("vitest", True, "pass")] * (cases_run - cases_failed) + [("vitest", False, "failed")] * cases_failed
        if not cases:
            cases = [("vitest", False, "no cases")]
    return emit(gate_id, cases, min_cases, started)


def verify_contract(gate_id, min_cases, timeout_s):
    os.makedirs(RESULTS, exist_ok=True)
    spec_path = os.path.join(RESULTS, f"{gate_id}.spec.json")
    result_path = os.path.join(RESULTS, f"{gate_id}.json")
    spec = {"gate_id": gate_id, "min_cases": min_cases, "timeout_s": timeout_s, "repo": ROOT}
    json.dump(spec, open(spec_path, "w", encoding="utf-8"))
    proc = subprocess.run(
        [
            sys.executable,
            "tools/eval_runner.py",
            "run",
            "--spec",
            spec_path,
            "--result",
            result_path,
            "--repo",
            ROOT,
            "--no-lesson",
            "--registry",
            "tools/gates/registry.json",
            "--registry",
            "gates/perimeter-phase1.registry.json",
        ],
        cwd=ROOT,
        capture_output=True,
        text=True,
    )
    if proc.returncode != 0:
        print(proc.stdout)
        print(proc.stderr)
    return proc.returncode == 0


def main():
    validate = subprocess.run(
        [
            sys.executable,
            "tools/eval_runner.py",
            "validate-graph",
            "--graph",
            GRAPH,
            "--registry",
            "tools/gates/registry.json",
            "--registry",
            "gates/perimeter-phase1.registry.json",
        ],
        cwd=ROOT,
        text=True,
    )
    if validate.returncode != 0:
        return validate.returncode
    registry = load_registry()
    order = graph_gates(open(GRAPH, encoding="utf-8").read())
    failed = []
    for gate_id in order:
        entry = registry[gate_id]
        script = entry["script"]
        min_cases = int(entry["min_cases"])
        timeout_s = int(entry.get("timeout_s", 900))
        print(f"\n== {gate_id}")
        if script.strip().startswith("npx "):
            code = write_vitest_result(gate_id, min_cases, timeout_s, script)
        else:
            proc = subprocess.run(
                command_for(gate_id, script),
                cwd=ROOT,
                text=True,
                timeout=timeout_s,
            )
            code = proc.returncode
        if gate_id in HUMAN_PENDING:
            print(f"PENDING HUMAN {gate_id}")
            continue
        if code != 0:
            failed.append(gate_id)
            continue
        if not verify_contract(gate_id, min_cases, timeout_s):
            failed.append(f"{gate_id} contract")
    print("\n== report")
    subprocess.run([sys.executable, "scripts/gates/print_report.py"], cwd=ROOT)
    if failed:
        print("FAILED " + ", ".join(failed))
        return 1
    print("AUTOMATED_GATES_PASS")
    return 0


if __name__ == "__main__":
    sys.exit(main())
