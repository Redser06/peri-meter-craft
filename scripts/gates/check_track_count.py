#!/usr/bin/env python3
import argparse
import os
import re
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from contract import ROOT, emit


def count_readme(text):
    match = re.search(r"---\n(.*?)\n---\n", text, re.S)
    if not match:
        return 0
    return len(re.findall(r'id:\s*"\d{2}"', match.group(1)))


def count_blueprint(text):
    return len(re.findall(r"^## Track \d{2} —", text, re.M))


def count_curriculum(text):
    return len(re.findall(r'id:\s*"\d{2}"', text))


def main():
    started = time.perf_counter()
    parser = argparse.ArgumentParser()
    parser.add_argument("--expected", type=int, default=11)
    args = parser.parse_args()

    readme_c = count_readme(open(os.path.join(ROOT, "README.md"), encoding="utf-8").read())
    blueprint_c = count_blueprint(open(os.path.join(ROOT, "docs", "TRANSFORMATION_BLUEPRINT.md"), encoding="utf-8").read())
    curriculum_c = count_curriculum(open(os.path.join(ROOT, "src", "services", "curriculumGraph.ts"), encoding="utf-8").read())

    cases = [
        ("readme_frontmatter", readme_c == args.expected, f"count={readme_c} expected={args.expected}"),
        ("blueprint", blueprint_c == args.expected, f"count={blueprint_c} expected={args.expected}"),
        ("curriculum_service", curriculum_c == args.expected, f"count={curriculum_c} expected={args.expected}"),
    ]
    return emit("perimeter_track_count_consistent", cases, 3, started)


if __name__ == "__main__":
    sys.exit(main())
