#!/usr/bin/env python3
import os
import subprocess
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from contract import ROOT, emit

BASE = "e98530a7fca251060890458559b68ac59a8a548f"
ALLOWED_ADDS = {
    "# local environment",
    ".env",
    ".env.*",
    "!.env.example",
    "",
}


def diff(path):
    proc = subprocess.run(
        ["git", "-C", ROOT, "diff", "--exit-code", BASE, "--", path],
        capture_output=True,
        text=True,
    )
    return proc.returncode, proc.stdout


def gitignore_ok():
    code, text = diff(".gitignore")
    if code == 0:
        return True, "unchanged"
    added, removed = [], []
    for line in text.splitlines():
        if line.startswith("+++") or line.startswith("---") or line.startswith("@@") or line.startswith("diff") or line.startswith("index"):
            continue
        if line.startswith("+"):
            added.append(line[1:])
        elif line.startswith("-"):
            removed.append(line[1:])
    if removed:
        return False, "removed lines " + ",".join(removed)
    extra = [line for line in added if line not in ALLOWED_ADDS]
    if extra:
        return False, "unexpected additions " + ",".join(extra)
    if not added:
        return False, "diff could not be classified"
    return True, "pre-approved environment ignore entries"


def main():
    started = time.perf_counter()
    config_code, _config = diff("supabase/config.toml")
    migrations_code, _migrations = diff("supabase/migrations")
    ignore_ok, ignore_detail = gitignore_ok()
    cases = [
        ("config_toml", config_code == 0, "unchanged" if config_code == 0 else "changed"),
        ("migrations", migrations_code == 0, "unchanged" if migrations_code == 0 else "changed"),
        ("gitignore_exception", ignore_ok, ignore_detail),
    ]
    return emit("perimeter_protected_files", cases, 1, started)


if __name__ == "__main__":
    sys.exit(main())
