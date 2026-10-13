#!/usr/bin/env python3
"""Fail the job when CI is not actually closed to paid providers and live credentials.

The workflow env labels are not the control. This step checks those labels and
refuses a present environment file or a set credential variable. It prints names
only, never values.
"""

import os
import sys

BLOCKED_WHEN_SET = (
    "VITE_SUPABASE_URL",
    "VITE_SUPABASE_PUBLISHABLE_KEY",
    "VITE_SUPABASE_PROJECT_ID",
    "SUPABASE_SERVICE_ROLE_KEY",
    "OPENAI_API_KEY",
    "ANTHROPIC_API_KEY",
)


def main():
    problems = []
    if os.environ.get("LLM_PROVIDER") != "fake":
        problems.append("LLM_PROVIDER")
    if os.environ.get("PERIMETER_CI_NETWORK") != "none":
        problems.append("PERIMETER_CI_NETWORK")
    if os.environ.get("PERIMETER_CI_PAID_KEYS") != "none":
        problems.append("PERIMETER_CI_PAID_KEYS")
    for key in BLOCKED_WHEN_SET:
        if os.environ.get(key):
            problems.append(key)
    if os.path.exists(".env"):
        problems.append(".env present")
    if problems:
        print("closed-network check failed: " + ", ".join(problems))
        return 1
    print("closed-network check passed")
    return 0


if __name__ == "__main__":
    sys.exit(main())
