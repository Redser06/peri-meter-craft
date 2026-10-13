#!/usr/bin/env python3
import os
import subprocess
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from contract import ROOT, emit

BASE = "e98530a7fca251060890458559b68ac59a8a548f"


def diff(path):
    proc = subprocess.run(
        ["git", "-C", ROOT, "diff", "--exit-code", BASE, "--", path],
        capture_output=True,
        text=True,
    )
    return proc.returncode, proc.stdout


def main():
    started = time.perf_counter()
    config_code, _config = diff("supabase/config.toml")
    ignore_code, _ignore = diff(".gitignore")
    cases = [
        ("config_toml", config_code == 0, "unchanged" if config_code == 0 else "changed"),
        ("gitignore", ignore_code == 0, "unchanged" if ignore_code == 0 else "changed"),
    ]
    return emit("perimeter_protected_files", cases, 1, started)


if __name__ == "__main__":
    sys.exit(main())
