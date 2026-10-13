#!/usr/bin/env python3
import json
import os
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from contract import ROOT, emit


def main():
    started = time.perf_counter()
    pkg = json.load(open(os.path.join(ROOT, "package.json"), encoding="utf-8"))
    scripts = pkg.get("scripts", {})
    dev_deps = pkg.get("devDependencies", {})
    test_ok = "test" in scripts and "vitest" in scripts["test"]
    vitest_ok = "vitest" in dev_deps
    gates_dir = os.path.isdir(os.path.join(ROOT, "scripts", "gates"))

    cases = [
        ("test_script_and_vitest", test_ok and vitest_ok, "test script and vitest dependency present"),
        ("gates_dir_present", gates_dir, "scripts/gates exists"),
    ]
    return emit("perimeter_test_harness_present", cases, 2, started)


if __name__ == "__main__":
    sys.exit(main())
