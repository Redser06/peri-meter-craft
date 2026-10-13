#!/usr/bin/env python3
import os
import re
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from contract import ROOT, emit

NAMES = ("CurriculumModule", "LearnerProgressState", "ManagerROIState")


def ts_fields(text, name):
    match = re.search(rf"export interface {name} \{{(.*?)\n\}}", text, re.S)
    if not match:
        return None
    return re.findall(r"^\s*([A-Za-z_][A-Za-z0-9_]*)\??:", match.group(1), re.M)


def py_fields(text, name):
    match = re.search(rf"class {name}:\n((?:    .+\n)+)", text)
    if not match:
        return None
    return re.findall(r"^    ([A-Za-z_][A-Za-z0-9_]*)\s*:", match.group(1), re.M)


def main():
    started = time.perf_counter()
    ts = open(os.path.join(ROOT, "src", "types", "perimeter.ts"), encoding="utf-8").read()
    py = open(os.path.join(ROOT, "schemas", "perimeter_state.py"), encoding="utf-8").read()
    sys.path.insert(0, os.path.join(ROOT, "schemas"))
    import perimeter_state

    cases = []
    for name in NAMES:
        left, right = ts_fields(ts, name), py_fields(py, name)
        cases.append((name, left == right and bool(left), f"ts={left} py={right}"))

    module = perimeter_state.CurriculumModule(
        id="01",
        title="Prompt-to-App Prototyping Runtime",
        track="01",
        prerequisites=[],
        eval_gate_id="perimeter_neutral_brand_clean",
        deliverable_type="prototype",
        rubric_property_checks=["typecheck", "lint"],
    )
    again, _data = perimeter_state.round_trip(module)
    cases.append(("round_trip", again == module, "python dataclass round trip"))
    return emit("perimeter_pydantic_schema_sync", cases, 1, started)


if __name__ == "__main__":
    sys.exit(main())
