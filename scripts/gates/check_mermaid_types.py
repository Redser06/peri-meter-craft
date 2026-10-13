#!/usr/bin/env python3
import glob
import os
import re
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from contract import ROOT, emit

ALLOWED_STARTS = ("flowchart", "graph", "sequencediagram", "statediagram", "classdiagram", "erdiagram")


def main():
    started = time.perf_counter()
    files = [
        os.path.join(ROOT, "README.md"),
        *glob.glob(os.path.join(ROOT, "docs", "*.md")),
    ]
    cases = []
    for path in files:
        if not os.path.isfile(path):
            continue
        rel = os.path.relpath(path, ROOT)
        text = open(path, encoding="utf-8").read()
        blocks = re.findall(r"```mermaid\s*\n(.*?)\n```", text, re.S)
        bad = []
        for block in blocks:
            first_line = block.strip().splitlines()[0].strip().lower()
            if not any(first_line.startswith(prefix) for prefix in ALLOWED_STARTS):
                bad.append(first_line)
        cases.append((rel, not bad, ",".join(bad) or "clean"))
    return emit("perimeter_docs_diagrams_render", cases, 1, started)


if __name__ == "__main__":
    sys.exit(main())
