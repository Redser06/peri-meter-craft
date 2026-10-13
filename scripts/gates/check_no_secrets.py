#!/usr/bin/env python3
import os
import subprocess
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from contract import ROOT, emit

PATTERNS = (
    "eyJ" + "hbGci",
    "BEGIN " + "PRIVATE KEY",
    "sk_" + "live",
    "service_" + "role",
)
PLACEHOLDER_NAMES = (
    "VITE_SUPABASE_PROJECT_ID",
    "VITE_SUPABASE_URL",
    "VITE_SUPABASE_PUBLISHABLE_KEY",
)


def main():
    started = time.perf_counter()
    tracked_env = subprocess.run(["git", "-C", ROOT, "ls-files", "--error-unmatch", ".env"], capture_output=True, text=True)
    ignore = open(os.path.join(ROOT, ".gitignore"), encoding="utf-8").read().splitlines()
    example_path = os.path.join(ROOT, ".env.example")
    example = open(example_path, encoding="utf-8").read() if os.path.isfile(example_path) else ""
    names_ok = all(name in example for name in PLACEHOLDER_NAMES)
    values_ok = all("replace-with-" in line.split("=", 1)[-1] for line in example.splitlines() if "=" in line)
    pattern_ok = not any(pattern in example for pattern in PATTERNS)
    env_rules = [".env", ".env.*", "!.env.example"]
    positions = [ignore.index(rule) if rule in ignore else -1 for rule in env_rules]
    ignore_ok = positions[0] >= 0 and positions[1] > positions[0] and positions[2] > positions[1]

    leaks = []
    listed = subprocess.check_output(
        ["git", "-C", ROOT, "ls-files", "--cached", "--others", "--exclude-standard"],
        text=True,
    ).splitlines()
    for rel in listed:
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
        if any(pattern in text for pattern in PATTERNS):
            leaks.append(rel)

    client_path = os.path.join(ROOT, "src", "integrations", "supabase", "client.ts")
    client = open(client_path, encoding="utf-8").read() if os.path.isfile(client_path) else ""
    invented_host = "https://" + "example.invalid"
    host_ok = invented_host not in client and "console.warn" in client

    cases = [
        ("env_untracked", tracked_env.returncode != 0, "environment file is still tracked"),
        ("gitignore", ignore_ok, "gitignore must ignore .env and .env.* while keeping .env.example"),
        ("example_placeholders", names_ok and values_ok and pattern_ok and bool(example), "example must use placeholders only"),
        ("no_key_patterns", not leaks, ",".join(leaks) or "clean"),
        ("no_invented_supabase_host", host_ok, "client must warn and must not invent a host"),
    ]
    return emit("perimeter_no_secrets_committed", cases, 4, started)


if __name__ == "__main__":
    sys.exit(main())
