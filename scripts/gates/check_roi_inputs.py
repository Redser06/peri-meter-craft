#!/usr/bin/env python3
import os
import re
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from contract import ROOT, emit

FORBIDDEN = re.compile(r"(?<![\w.])(?:8\.5|16|85)(?![\w.])")
DEFAULTS = os.path.join(ROOT, "src", "config", "roiDefaults.ts")


def strip_ts(src):
    out = []
    index = 0
    length = len(src)
    while index < length:
        if src.startswith("//", index):
            newline = src.find("\n", index)
            index = length if newline < 0 else newline
            continue
        if src.startswith("/*", index):
            end = src.find("*/", index + 2)
            index = length if end < 0 else end + 2
            continue
        if src[index] in "'\"`":
            quote = src[index]
            index += 1
            while index < length:
                if src[index] == "\\":
                    index += 2
                    continue
                if src[index] == quote:
                    index += 1
                    break
                index += 1
            out.append(" ")
            continue
        out.append(src[index])
        index += 1
    return "".join(out)


def tracked_sources():
    found = []
    for folder in ("src", "tests"):
        for root, _dirs, files in os.walk(os.path.join(ROOT, folder)):
            for name in files:
                if name.endswith((".ts", ".tsx")):
                    found.append(os.path.join(root, name))
    return found


def main():
    started = time.perf_counter()
    defaults = open(DEFAULTS, encoding="utf-8").read()
    has_defaults = all(token in defaults for token in ("8.5", "16", "85", "guesstimate_overridable"))
    cases = [("defaults_module", has_defaults, "defaults module must hold the guesstimate rates")]
    for path in tracked_sources():
        if os.path.abspath(path) == os.path.abspath(DEFAULTS):
            continue
        text = strip_ts(open(path, encoding="utf-8").read())
        match = FORBIDDEN.search(text)
        rel = os.path.relpath(path, ROOT)
        cases.append((rel, match is None, "clean" if match is None else match.group(0)))
    return emit("perimeter_roi_inputs_parametrised", cases, 1, started)


if __name__ == "__main__":
    sys.exit(main())
