#!/usr/bin/env python3
import json
import os
import re
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from contract import ROOT, emit


def main():
    started = time.perf_counter()
    package = json.load(open(os.path.join(ROOT, "package.json"), encoding="utf-8"))
    test_script = package.get("scripts", {}).get("test", "")
    version = package.get("devDependencies", {}).get("vitest", "")
    pinned = re.fullmatch(r"\d+\.\d+\.\d+", version) is not None
    gate_dir = os.path.join(ROOT, "scripts", "gates")
    present = os.path.isdir(gate_dir) and os.path.isfile(os.path.join(gate_dir, "check_test_harness.py"))
    cases = [
        ("vitest_pinned", "vitest" in test_script and pinned, f"script={test_script} vitest={version}"),
        ("gate_dir", present, "scripts/gates"),
    ]
    return emit("perimeter_test_harness_present", cases, 2, started)


if __name__ == "__main__":
    sys.exit(main())
