#!/usr/bin/env python3
import json
import os
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from contract import ROOT, emit

CAP = 5


def evaluate(raw):
    if raw is None or str(raw).strip() == "":
        return False, "missing"
    try:
        parsed = json.loads(raw)
    except Exception:
        return False, "unparseable"
    if not isinstance(parsed, dict):
        return False, "unparseable"
    spend = parsed.get("spend_usd")
    if isinstance(spend, bool) or not isinstance(spend, (int, float)):
        return False, "unparseable"
    if spend >= CAP:
        return False, "at_or_over_cap"
    return True, "under_cap"


def main():
    started = time.perf_counter()
    fixture = json.load(open(os.path.join(ROOT, "tests", "fixtures", "ledger_cases.json"), encoding="utf-8"))
    source = open(os.path.join(ROOT, "src", "services", "ledgerGuard.ts"), encoding="utf-8").read()
    cap_source = open(os.path.join(ROOT, "src", "config", "costCap.ts"), encoding="utf-8").read()
    cases = []
    for item in fixture:
        allowed, reason = evaluate(item["raw"])
        ok = allowed is item["allowed"] and reason == item["reason"]
        cases.append((item["name"], ok, f"{allowed} {reason}"))
    mirrored = "LLM_USD_MONTH_CAP = 5" in cap_source and "spend >= LLM_USD_MONTH_CAP" in source
    cases.append(("typescript_fail_closed", mirrored, "cap comparison missing from the typescript guard"))
    return emit("perimeter_ledger_cap_enforced", cases, 5, started)


if __name__ == "__main__":
    sys.exit(main())
