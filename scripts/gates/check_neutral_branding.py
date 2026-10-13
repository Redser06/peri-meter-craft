#!/usr/bin/env python3
import os
import subprocess
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from contract import ROOT, emit

BANNED = ("lova" + "ble", "aero" + "flow")


def tracked_files():
    out = subprocess.check_output(
        ["git", "-C", ROOT, "ls-files", "--cached", "--others", "--exclude-standard"],
        text=True,
    )
    return [line for line in out.splitlines() if line]


def main():
    started = time.perf_counter()
    cases = []
    for rel in tracked_files():
        if rel.startswith("gate-results/") or rel.startswith(".git/"):
            continue
        path = os.path.join(ROOT, rel)
        if not os.path.isfile(path):
            continue
        blob = open(path, "rb").read()
        if b"\0" in blob:
            continue
        try:
            text = blob.decode("utf-8")
        except UnicodeDecodeError:
            continue
        lowered = text.lower()
        hits = [word for word in BANNED if word in lowered]
        cases.append((rel, not hits, ",".join(hits) or "clean"))
    if not cases:
        cases.append(("files", False, "no tracked text files"))
    return emit("perimeter_neutral_brand_clean", cases, 1, started)


if __name__ == "__main__":
    sys.exit(main())
