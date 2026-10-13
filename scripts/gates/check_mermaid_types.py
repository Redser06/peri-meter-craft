#!/usr/bin/env python3
import os
import re
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from contract import ROOT, emit

ALLOWED = ("flowchart", "sequenceDiagram", "stateDiagram")


def blocks(text):
    return re.findall(r"```mermaid\n(.*?)```", text, re.S)


def main():
    started = time.perf_counter()
    paths = []
    for root, _dirs, files in os.walk(os.path.join(ROOT, "docs")):
        for name in files:
            if name.endswith(".md"):
                paths.append(os.path.join(root, name))
    readme = os.path.join(ROOT, "README.md")
    if os.path.isfile(readme):
        paths.append(readme)
    cases = []
    for path in sorted(paths):
        text = open(path, encoding="utf-8").read()
        for index, body in enumerate(blocks(text), start=1):
            first = next((line.strip() for line in body.splitlines() if line.strip()), "")
            kind = first.split()[0] if first else ""
            ok = kind.startswith(ALLOWED) and not kind.startswith("journey")
            rel = os.path.relpath(path, ROOT)
            cases.append((f"{rel}#{index}", ok, first or "empty diagram"))
    if not cases:
        cases.append(("diagrams", False, "no mermaid blocks"))
    return emit("perimeter_docs_diagrams_render", cases, 1, started)


if __name__ == "__main__":
    sys.exit(main())
