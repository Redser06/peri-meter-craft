#!/usr/bin/env python3
import argparse
import os
import re
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from contract import ROOT, emit

PAIR = re.compile(r'id:\s*"(\d{2})"\s*,\s*title:\s*"([^"]+)"')
SOURCES = (
    ("spec", "docs/SPEC.md"),
    ("readme", "README.md"),
    ("blueprint", "docs/TRANSFORMATION_BLUEPRINT.md"),
)


def pairs(path):
    return PAIR.findall(open(os.path.join(ROOT, path), encoding="utf-8").read())


def main():
    started = time.perf_counter()
    parser = argparse.ArgumentParser()
    parser.add_argument("--expected", type=int, required=True)
    args = parser.parse_args()
    parsed = {name: pairs(path) for name, path in SOURCES}
    spec = parsed["spec"]
    cases = []
    for name, _path in SOURCES:
        found = parsed[name]
        ok = len(found) == args.expected and found == spec
        cases.append((name, ok, f"{len(found)} tracks"))
    return emit("perimeter_track_count_consistent", cases, 3, started)


if __name__ == "__main__":
    sys.exit(main())
