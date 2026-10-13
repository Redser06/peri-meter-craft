#!/usr/bin/env python3
import os
import subprocess
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from contract import ROOT, emit

NEEDLES = ("/" + "Users" + "/", "/" + "home" + "/", "C:" + "\\")
EXEMPT = {
    "gates/perimeter-phase1.registry.json",
    "tools/gates/perimeter-phase1.registry.json",
}


def main():
    started = time.perf_counter()
    listed = subprocess.check_output(
        ["git", "-C", ROOT, "ls-files", "--cached", "--others", "--exclude-standard"],
        text=True,
    ).splitlines()
    cases = []
    for rel in listed:
        if rel in EXEMPT or rel == "gate-results" or rel.startswith("gate-results/"):
            continue
        if not os.path.isfile(os.path.join(ROOT, rel)):
            continue
        blob = open(os.path.join(ROOT, rel), "rb").read()
        if b"\0" in blob:
            continue
        try:
            text = blob.decode("utf-8")
        except UnicodeDecodeError:
            continue
        hits = [needle for needle in NEEDLES if needle in text]
        cases.append((rel, not hits, "clean" if not hits else "local path"))
    if not cases:
        cases.append(("files", False, "nothing scanned"))
    return emit("perimeter_no_local_paths", cases, 1, started)


if __name__ == "__main__":
    sys.exit(main())
