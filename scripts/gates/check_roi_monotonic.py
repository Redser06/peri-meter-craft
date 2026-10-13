#!/usr/bin/env python3
import os
import random
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from contract import emit


def compute_roi(prs, prototypes, hours_per_pr, hours_per_prototype, usd_per_hour):
    if any(v < 0 for v in (prs, prototypes, hours_per_pr, hours_per_prototype, usd_per_hour)):
        raise ValueError("inputs must be non-negative")
    hours_saved = prs * hours_per_pr + prototypes * hours_per_prototype
    usd = hours_saved * usd_per_hour
    return hours_saved, usd


def main():
    started = time.perf_counter()
    rng = random.Random(20261013)
    cases = []

    for index in range(50):
        prs = rng.randint(0, 15)
        prototypes = rng.randint(0, 10)
        h_pr = rng.uniform(1.0, 15.0)
        h_proto = rng.uniform(2.0, 25.0)
        rate = rng.uniform(20.0, 150.0)

        base_h, base_usd = compute_roi(prs, prototypes, h_pr, h_proto, rate)

        # Invariant 1: d(ROI)/d(prs) >= 0
        more_prs_h, more_prs_usd = compute_roi(prs + 1, prototypes, h_pr, h_proto, rate)
        prs_monotone = more_prs_h >= base_h and more_prs_usd >= base_usd

        # Invariant 2: d(ROI)/d(prototypes) >= 0
        more_proto_h, more_proto_usd = compute_roi(prs, prototypes + 1, h_pr, h_proto, rate)
        proto_monotone = more_proto_h >= base_h and more_proto_usd >= base_usd

        # Invariant 3: d(ROI)/d(rate) >= 0
        higher_rate_h, higher_rate_usd = compute_roi(prs, prototypes, h_pr, h_proto, rate + 5.0)
        rate_monotone = higher_rate_h == base_h and higher_rate_usd >= base_usd

        ok = prs_monotone and proto_monotone and rate_monotone
        cases.append((
            f"state_{index:02d}",
            ok,
            f"prs={prs} proto={prototypes} base_usd={base_usd:.2f} delta_prs={more_prs_usd - base_usd:.2f}",
        ))

    return emit("perimeter_roi_monotonic_increasing", cases, 50, started)


if __name__ == "__main__":
    sys.exit(main())
