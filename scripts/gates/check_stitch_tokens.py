#!/usr/bin/env python3
import os
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from contract import ROOT, emit

REQUIRED = ("#09090b", "#121215", "#27272a", "Inter", "JetBrains Mono")


def main():
    started = time.perf_counter()
    text = open(os.path.join(ROOT, "src", "types", "stitch.ts"), encoding="utf-8").read()
    cases = [(token, token in text, "present" if token in text else "missing") for token in REQUIRED]
    return emit("perimeter_stitch_token_valid", cases, 1, started)


if __name__ == "__main__":
    sys.exit(main())
