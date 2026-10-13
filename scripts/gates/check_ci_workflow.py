#!/usr/bin/env python3
import os
import re
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from contract import ROOT, emit

IF_LINE = "if: ${{ !cancelled() }}"


def main():
    started = time.perf_counter()
    path = os.path.join(ROOT, ".github", "workflows", "ci.yml")
    text = open(path, encoding="utf-8").read()
    steps = re.split(r"\n\s*- name:", text)[1:]
    interesting = []
    for step in steps:
        name = step.splitlines()[0].strip().lower()
        if re.search(r"report|eval|gate|test|lint|validate|build|cost", name):
            interesting.append((name, IF_LINE in step))
    guarded = bool(interesting) and all(ok for _, ok in interesting)
    missing = [name for name, ok in interesting if not ok]
    cases = [
        ("cancel_guard", guarded, "ok" if guarded else f"missing on {missing}"),
        ("no_secret_expressions", "secrets." not in text, "workflow references secret expressions"),
        ("no_fetch_tools", re.search(r"\b(curl|wget)\b", text) is None, "curl or wget present"),
        (
            "fake_provider",
            "LLM_PROVIDER: fake" in text and "PERIMETER_CI_PAID_KEYS: none" in text,
            "provider must be fake and paid keys must be none",
        ),
        (
            "full_history",
            "fetch-depth: 0" in text,
            "checkout must fetch full history so the protected-files base commit is present",
        ),
        (
            "network_enforced",
            "assert_closed_network.py" in text and "PERIMETER_CI_NETWORK: none" in text,
            "closed network must be an executed check, not only an env label",
        ),
    ]
    return emit("perimeter_ci_workflow_contract", cases, 4, started)


if __name__ == "__main__":
    sys.exit(main())
