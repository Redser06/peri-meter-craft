#!/usr/bin/env python3
"""Fail-closed eval gate runner (stdlib only).

Usage:
  eval_runner.py run --spec gate.json --result result.json [--brain DIR] [--no-lesson]
  eval_runner.py lessons --query "words" [--brain DIR] [-n 3]

Spec (JSON, or simple YAML subset):
  {"name": "...", "required_fields": ["a", "b.c"],
   "checks": [{"type": "equals"|"min"|"max"|"regex"|"nonempty"|"in", "field": "x", "value": ...}],
   "min_cases": 1, "timeout_s": 900, "max_age_s": 3600, "repo": ".", "allowed_skips": [{"test": "t", "reason": "why"}]}
  Policy checks (drafts-only, never send as Conor) always run and cannot be disabled.
Also enforces the §1 verdict contract (workflow-graph-template-v2): result must carry
verdict=="pass" (literal), cases_run>=min_cases(>=1), cases_failed==0, no unallowed skips,
sha/commit == git HEAD of spec 'repo' or --repo, duration_ms <= timeout_s*1000 (default 900),
and finished_at within max_age_s if set. Reason codes: missing_result unparsed schema_invalid
missing_field verdict_not_pass unverified zero_cases cases_failed skipped stale_commit timeout
crashed check_failed policy_violation unregistered_gate.
  eval_runner.py validate-graph --graph graph.yaml [--registry base.json --registry project.json ...]
Exit codes: 0 PASS, 1 FAIL, 2 usage error. Anything unexpected = FAIL.
"""
import argparse, datetime, json, os, re, subprocess, sys

BRAIN = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DEFAULT_REGISTRY = os.path.join(BRAIN, "tools", "gates", "registry.json")
OUTBOUND = {"send", "post", "publish", "reply", "forward", "message", "email", "tweet"}
PROTECTED_IDENTITIES = {"conor", "conor redmond", "user", "owner"}
STOP = set("the a an and or of to in on for with is are be it this that by at from as".split())


class GateError(Exception):
    def __init__(self, msg, code="schema_invalid"):
        super().__init__(msg); self.code = code


def parse_yaml_min(text):
    """Tiny YAML subset: scalars, nested maps, lists of scalars/maps. JSON-compatible values."""
    lines = [l.rstrip() for l in text.splitlines() if l.strip() and not l.lstrip().startswith("#")]
    def scalar(s):
        s = s.strip()
        if s == "": return None
        try: return json.loads(s)
        except Exception: pass
        low = s.lower()
        if low in ("true", "yes"): return True
        if low in ("false", "no"): return False
        if low in ("null", "~"): return None
        return s.strip("'\"")
    def block(i, ind):
        if i >= len(lines): return None, i
        if lines[i].lstrip().startswith("- "):
            out = []
            while i < len(lines) and len(lines[i]) - len(lines[i].lstrip()) == ind and lines[i].lstrip().startswith("- "):
                item = lines[i].lstrip()[2:]
                if ":" in item and not item.startswith(("{", "[", '"')):
                    sub = " " * (ind + 2) + item
                    lines[i] = sub
                    v, i = block(i, ind + 2)
                    out.append(v)
                else:
                    out.append(scalar(item)); i += 1
            return out, i
        out = {}
        while i < len(lines) and len(lines[i]) - len(lines[i].lstrip()) == ind:
            k, _, v = lines[i].strip().partition(":")
            if not _: raise GateError(f"bad YAML line: {lines[i]!r}")
            i += 1
            if v.strip() == "":
                if i < len(lines) and len(lines[i]) - len(lines[i].lstrip()) > ind:
                    v2, i = block(i, len(lines[i]) - len(lines[i].lstrip()))
                else:
                    v2 = None
                out[k.strip()] = v2
            else:
                out[k.strip()] = scalar(v)
        return out, i
    if not lines: raise GateError("empty YAML")
    v, i = block(0, len(lines[0]) - len(lines[0].lstrip()))
    if i != len(lines): raise GateError(f"unparsed YAML from line: {lines[i]!r}")
    return v


def load(path, what):
    if not path or not os.path.isfile(path):
        raise GateError(f"{what} file missing: {path}")
    with open(path, encoding="utf-8") as f:
        text = f.read()
    if not text.strip():
        raise GateError(f"{what} file empty: {path}")
    try:
        if path.endswith((".yaml", ".yml")):
            data = parse_yaml_min(text)
        else:
            data = json.loads(text)
    except GateError: raise
    except Exception as e:
        raise GateError(f"{what} file unparseable ({path}): {e}")
    if not isinstance(data, dict):
        raise GateError(f"{what} must be an object/mapping")
    return data


_MISSING = object()

def get(d, dotted):
    cur = d
    for part in dotted.split("."):
        if isinstance(cur, dict) and part in cur: cur = cur[part]
        else: return _MISSING
    return cur


def run_check(result, c):
    t, field = c.get("type"), c.get("field")
    if not t or not field:
        raise GateError(f"check malformed: {c}")
    v = get(result, field)
    if v is _MISSING:
        return False, f"{field}: missing"
    exp = c.get("value")
    if t == "equals": return v == exp, f"{field}={v!r} expected {exp!r}"
    if t == "min": return float(v) >= float(exp), f"{field}={v} min {exp}"
    if t == "max": return float(v) <= float(exp), f"{field}={v} max {exp}"
    if t == "regex": return re.search(str(exp), str(v)) is not None, f"{field} !~ {exp}"
    if t == "nonempty": return v not in (None, "", [], {}), f"{field} empty"
    if t == "in": return v in exp, f"{field}={v!r} not in {exp!r}"
    raise GateError(f"unknown check type: {t}")


def policy_violations(result):
    """Hard-coded policy: outbound actions must be drafts unless explicitly approved; never send as Conor."""
    out = []
    actions = result.get("actions", [])
    if "action" in result: actions = [result["action"]] + list(actions or [])
    if not isinstance(actions, list):
        return ["policy: 'actions' must be a list"]
    for i, a in enumerate(actions):
        if not isinstance(a, dict):
            out.append(f"policy: action[{i}] is not an object"); continue
        typ = str(a.get("type", "")).lower().strip()
        if not typ:
            out.append(f"policy: action[{i}] has no type"); continue
        if typ == "draft": continue
        if typ in OUTBOUND or a.get("outbound"):
            who = str(a.get("as", a.get("sender", "conor"))).lower().strip()
            approved = a.get("approved") is True and bool(a.get("approval_ref"))
            if who in PROTECTED_IDENTITIES or "conor" in who:
                if not approved:
                    out.append(f"policy: action[{i}] '{typ}' as {who!r} without explicit approval (approved:true + approval_ref); must be 'draft'")
            elif not approved:
                out.append(f"policy: action[{i}] outbound '{typ}' without approval; outbound must be 'draft'")
    return out


def slugify(s):
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")[:50] or "gate"


def _frontmatter(text):
    m = re.match(r"---\n(.*?)\n---\n", text, re.S)
    fm = {}
    if m:
        for ln in m.group(1).splitlines():
            k, sep, v = ln.partition(":")
            if sep: fm[k.strip()] = v.strip()
    return fm


def _codes_list(v):
    return sorted(x.strip() for x in v.strip("[]").split(",") if x.strip())


def find_recent_lesson(d, gate, codes, window_h, now):
    """Existing lesson for the same gate + same reason codes whose last occurrence is within window_h."""
    if not os.path.isdir(d): return None
    best = None
    for fn in sorted(os.listdir(d)):
        if "-eval-failure-" not in fn or not fn.endswith(".md"): continue
        p = os.path.join(d, fn)
        try:
            with open(p, encoding="utf-8") as f: fm = _frontmatter(f.read())
            if fm.get("gate", "").strip('"') != gate or _codes_list(fm.get("reason_codes", "")) != codes:
                continue
            last = parse_ts(fm.get("last_seen", "").strip('"'))
        except Exception:
            continue
        if (now - last).total_seconds() <= float(window_h) * 3600 and (best is None or last > best[0]):
            best = (last, p)
    return best[1] if best else None


def write_lesson(brain, gate, reasons, spec_path, result_path, project=None, window_h=24):
    now = datetime.datetime.now(datetime.timezone.utc).replace(microsecond=0)
    stamp = now.astimezone().isoformat()
    date = now.astimezone().date().isoformat()
    d = os.path.join(brain, "library", "lessons"); os.makedirs(d, exist_ok=True)
    codes = sorted({c for c, _ in reasons})
    body = "\n".join(f"- [{c}] {m}" for c, m in reasons)
    try:
        window_h = float(window_h)
        if window_h < 0: raise ValueError
    except Exception:
        window_h = 24.0
    existing = find_recent_lesson(d, gate, codes, window_h, now) if window_h > 0 else None
    if existing:
        with open(existing, encoding="utf-8") as f: text = f.read()
        n = int(_frontmatter(text).get("occurrences", "1") or 1) + 1
        head, sep, rest = text.partition("\n---\n")
        head = re.sub(r"\noccurrences: .*", "", head); head = re.sub(r"\nlast_seen: .*", "", head)
        head += f"\noccurrences: {n}\nlast_seen: {stamp}"
        text = head + sep + rest.rstrip("\n") + f"\n\n## Occurrence {n} ({stamp})\n{body}\n"
        with open(existing, "w", encoding="utf-8") as f: f.write(text)
        return existing
    base = os.path.join(d, f"{date}-eval-failure-{slugify(gate)}")
    path, n = base + ".md", 2
    while os.path.exists(path): path, n = f"{base}-{n}.md", n + 1
    projects = f"[{project}]" if project else "[]"
    with open(path, "w", encoding="utf-8") as f:
        f.write(f"""---
kind: lesson
status: observed
date: {date}
outcome: failed
domain: coding
projects: {projects}
tags: [eval-gate, eval-failure, {slugify(gate)}]
gate: {gate}
reason_codes: [{", ".join(codes)}]
source: "tools/eval_runner.py spec={spec_path} result={result_path}"
related: []
occurrences: 1
last_seen: {stamp}
---
# Eval gate '{gate}' failed closed ({", ".join(codes)})

## What happened
{body}

## Why it worked or did not
unknown

## Next time
Fix the producer or the gate; do not relax the gate to pass.
""")
    return path


def git_head(repo):
    try:
        out = subprocess.run(["git", "-C", repo, "rev-parse", "HEAD"], capture_output=True, text=True, timeout=20)
    except Exception as e:
        return None, str(e)
    if out.returncode != 0:
        return None, out.stderr.strip() or "git rev-parse failed"
    return out.stdout.strip(), ""


def is_int(v):
    return isinstance(v, int) and not isinstance(v, bool)


def parse_ts(v):
    s = str(v).strip().replace("Z", "+00:00")
    t = datetime.datetime.fromisoformat(s)
    if t.tzinfo is None:
        raise ValueError("timestamp needs a timezone")
    return t


def contract_reasons(spec, result, repo):
    """§1 verdict contract (workflow-graph-template-v2). Returns [(code, msg)]."""
    R = []
    # exit code (optional field; if present must be 0)
    ec = result.get("exit_code", _MISSING)
    if ec is _MISSING:
        R.append(("missing_field", "exit_code missing"))
    elif not is_int(ec):
        R.append(("schema_invalid", f"exit_code={ec!r} must be an int"))
    elif ec != 0:
        R.append(("crashed", f"gate script exit_code={ec}"))
    # verdict: literal "pass" only
    v = result.get("verdict", _MISSING)
    if v is _MISSING:
        R.append(("missing_field", "verdict missing"))
    elif v == "unverified":
        R.append(("unverified", "verdict 'unverified' (judge could not decide) counts as fail"))
    elif v != "pass":
        R.append(("verdict_not_pass", f"verdict={v!r}; only the literal string 'pass' passes"))
    # cases
    min_cases = spec.get("min_cases", 1)
    if not is_int(min_cases) or min_cases < 1:
        R.append(("schema_invalid", f"spec min_cases must be an int >= 1, got {min_cases!r}"))
        min_cases = 1
    cr, cf = result.get("cases_run", _MISSING), result.get("cases_failed", _MISSING)
    if cr is _MISSING: R.append(("missing_field", "cases_run missing"))
    elif not is_int(cr) or cr < 0: R.append(("schema_invalid", f"cases_run={cr!r}"))
    elif cr == 0: R.append(("zero_cases", "cases_run=0"))
    elif cr < min_cases: R.append(("zero_cases", f"cases_run={cr} < min_cases={min_cases}"))
    if cf is _MISSING: R.append(("missing_field", "cases_failed missing"))
    elif not is_int(cf) or cf < 0: R.append(("schema_invalid", f"cases_failed={cf!r}"))
    elif cf != 0: R.append(("cases_failed", f"cases_failed={cf}"))
    # skips: fail unless every skipped test is in allowed_skips with a reason
    allowed = {}
    for a in spec.get("allowed_skips") or []:
        if isinstance(a, dict) and a.get("test") and str(a.get("reason", "")).strip():
            allowed[a["test"]] = a["reason"]
        else:
            R.append(("schema_invalid", f"allowed_skips entry needs test+reason: {a!r}"))
    sk = result.get("cases_skipped", 0)
    names = result.get("skipped", [])
    if not is_int(sk) or sk < 0 or not isinstance(names, list):
        R.append(("schema_invalid", "cases_skipped must be int >= 0 and skipped a list"))
    else:
        if sk > len(names):
            R.append(("skipped", f"{sk - len(names)} skipped test(s) not named; unnamed skips can't be allowed"))
        bad = [n for n in names if n not in allowed]
        if bad:
            R.append(("skipped", f"skipped tests not in allowed_skips: {bad}"))
    # commit == HEAD
    sha = result.get("sha", result.get("commit", _MISSING))
    if not repo:
        R.append(("unverified", "no repo given (spec 'repo' or --repo); cannot verify commit"))
    elif sha is _MISSING or not str(sha).strip():
        R.append(("missing_field", "sha/commit missing"))
    else:
        head, err = git_head(repo)
        if not head:
            R.append(("unverified", f"cannot read HEAD of {repo}: {err}"))
        else:
            s = str(sha).strip().lower()
            if len(s) < 7 or not head.startswith(s):
                R.append(("stale_commit", f"result sha {sha} != HEAD {head[:12]}"))
    # timeout: runtime limit and staleness
    tos = spec.get("timeout_s", 900)
    if not isinstance(tos, (int, float)) or isinstance(tos, bool) or tos <= 0:
        R.append(("schema_invalid", f"timeout_s={tos!r}"))
    else:
        dm = result.get("duration_ms", _MISSING)
        if dm is _MISSING: R.append(("missing_field", "duration_ms missing"))
        elif not isinstance(dm, (int, float)) or isinstance(dm, bool) or dm < 0:
            R.append(("schema_invalid", f"duration_ms={dm!r}"))
        elif dm > tos * 1000: R.append(("timeout", f"duration_ms={dm} > timeout_s={tos}"))
    if "max_age_s" in spec:
        age_lim = spec["max_age_s"]
        fa = result.get("finished_at", _MISSING)
        if fa is _MISSING:
            R.append(("missing_field", "finished_at missing (spec sets max_age_s)"))
        else:
            try:
                age = (datetime.datetime.now(datetime.timezone.utc) - parse_ts(fa)).total_seconds()
                if age > float(age_lim): R.append(("timeout", f"result is {int(age)}s old > max_age_s={age_lim}"))
                elif age < -300: R.append(("schema_invalid", f"finished_at {fa} is in the future"))
            except Exception as e:
                R.append(("schema_invalid", f"finished_at unparseable: {e}"))
    return R


def cmd_run(a):
    reasons, gate = [], os.path.basename(a.spec or "unknown")
    project, window_h = None, (a.retry_window_h if a.retry_window_h is not None else 24)
    try:
        try:
            spec = load(a.spec, "spec")
        except GateError as e:
            raise GateError(str(e), "schema_invalid")
        gate = str(spec.get("gate_id") or spec.get("name") or gate)
        project = spec.get("project")
        window_h = a.retry_window_h if a.retry_window_h is not None else spec.get("retry_window_h", 24)
        if a.registry:
            reg = load_registries(a.registry)
            if gate not in reg:
                reasons.append(("unregistered_gate", f"gate {gate!r} not in registries {a.registry}"))
            elif not project:
                project = reg[gate].get("project")
        try:
            result = load(a.result, "result")
        except GateError as e:
            msg = str(e)
            raise GateError(msg, "missing_result" if ("missing" in msg or "empty" in msg) else "unparsed")
        if "gate_id" in result and result["gate_id"] != gate:
            reasons.append(("schema_invalid", f"result gate_id {result['gate_id']!r} != spec {gate!r}"))
        req = spec.get("required_fields") or []
        checks = spec.get("checks") or []
        if not isinstance(req, list) or not isinstance(checks, list):
            raise GateError("spec required_fields/checks must be lists", "schema_invalid")
        for f in req:
            if get(result, f) is _MISSING: reasons.append(("missing_field", f"required field missing: {f}"))
        for c in checks:
            try:
                ok, msg = run_check(result, c)
                if not ok: reasons.append(("check_failed", f"check {c.get('type')}: {msg}"))
            except Exception as e:
                reasons.append(("crashed", f"check errored: {c}: {e}"))
        repo = a.repo or spec.get("repo")
        if repo and not os.path.isabs(repo) and a.spec:
            repo = os.path.join(os.path.dirname(os.path.abspath(a.spec)), repo)
        reasons += contract_reasons(spec, result, repo)
        reasons += [("policy_violation", m) for m in policy_violations(result)]
    except GateError as e:
        reasons.append((e.code, str(e)))
    except Exception as e:
        reasons.append(("crashed", f"unexpected error: {type(e).__name__}: {e}"))
    if reasons:
        codes = sorted({c for c, _ in reasons})
        print(f"FAIL {gate} reasons={','.join(codes)}")
        for c, m in reasons: print(f"  - [{c}] {m}")
        if not a.no_lesson:
            try: print(f"lesson: {write_lesson(a.brain, gate, reasons, a.spec, a.result, project, window_h)}")
            except Exception as e: print(f"  (lesson write failed: {e})")
        return 1
    print(f"PASS {gate}")
    return 0


COST_TIERS = {"cheap": 0, "medium": 1, "moderate": 1, "expensive": 2}


def load_registry(path):
    reg = load(path, "registry")
    gates = reg.get("gates")
    if not isinstance(gates, dict) or not gates:
        raise GateError(f"registry {path} has no 'gates' mapping", "schema_invalid")
    proj = reg.get("project")
    out = {}
    for gid, entry in gates.items():
        if not isinstance(entry, dict):
            raise GateError(f"registry {path}: gate {gid!r} entry is not an object", "schema_invalid")
        e = dict(entry)
        if proj and "project" not in e: e["project"] = proj
        e["_source"] = path
        out[gid] = e
    return out


def load_registries(paths):
    """Merge registries in order; later ones extend earlier ones. A conflicting redefinition fails."""
    if isinstance(paths, str): paths = [paths]
    merged = {}
    for p in paths or []:
        for gid, e in load_registry(p).items():
            if gid in merged:
                strip = lambda d: {k: v for k, v in d.items() if k not in ("_source", "project")}
                if strip(merged[gid]) != strip(e):
                    raise GateError(f"gate {gid!r} defined differently in {merged[gid]['_source']} and {p}", "schema_invalid")
                continue
            merged[gid] = e
    return merged


def cost_tier(entry):
    t = entry.get("cost_tier", entry.get("cost"))
    if isinstance(t, (int, float)) and not isinstance(t, bool): return float(t)
    if isinstance(t, str) and t.lower() in COST_TIERS: return float(COST_TIERS[t.lower()])
    return None


def graph_gate_refs(path):
    """Return {node_id: [gate ids]} from a workflow graph (JSON or §1b-style YAML)."""
    if not path or not os.path.isfile(path):
        raise GateError(f"graph file missing: {path}", "missing_result")
    with open(path, encoding="utf-8") as f: text = f.read()
    if not text.strip(): raise GateError(f"graph file empty: {path}", "missing_result")
    refs = {}
    if path.endswith(".json"):
        try: g = json.loads(text)
        except Exception as e: raise GateError(f"graph unparseable: {e}", "unparsed")
        nodes = g.get("nodes") if isinstance(g, dict) else None
        if not isinstance(nodes, list): raise GateError("graph has no nodes list", "schema_invalid")
        for i, n in enumerate(nodes):
            if not isinstance(n, dict): raise GateError(f"node {i} not an object", "schema_invalid")
            gs = n.get("gate", [])
            if isinstance(gs, str): gs = [gs]
            if not isinstance(gs, list): raise GateError(f"node {n.get('id')} gate not a list", "schema_invalid")
            refs[str(n.get("id", i))] = gs
        return refs
    node = None
    for ln in text.splitlines():
        code = ln.split("#", 1)[0]
        m = re.match(r"\s*-\s*id:\s*(\S+)", code)
        if m: node = m.group(1); refs.setdefault(node, []); continue
        m = re.match(r"\s*gate:\s*(.*)$", code)
        if m:
            v = m.group(1).strip()
            if v.startswith("["):
                if not v.endswith("]"): raise GateError(f"unparsed gate line: {ln!r}", "unparsed")
                ids = [x.strip().strip("'\"") for x in v[1:-1].split(",") if x.strip()]
            elif v:
                ids = [v.strip("'\"")]
            else:
                raise GateError(f"block-style gate lists not supported; use [a, b]: {ln!r}", "unparsed")
            refs.setdefault(node or "?", []).extend(ids)
    return refs


def cmd_validate_graph(a):
    problems, warnings, refs = [], [], {}
    try:
        reg = load_registries(a.registry or [DEFAULT_REGISTRY])
        refs = graph_gate_refs(a.graph)
        total = sum(len(v) for v in refs.values())
        if total == 0:
            problems.append(("schema_invalid", "graph references no gates; refusing to pass vacuously"))
        for node, ids in refs.items():
            for g in ids:
                if not re.fullmatch(r"[A-Za-z0-9_.-]+", g):
                    problems.append(("schema_invalid", f"node {node}: gate {g!r} is not a registry id (no prose/globs)"))
                elif g not in reg:
                    problems.append(("unregistered_gate", f"node {node}: gate {g!r} not in registry"))
            tiers = [(g, cost_tier(reg[g])) for g in ids if g in reg]
            known = [(g, t) for g, t in tiers if t is not None]
            for (g1, t1), (g2, t2) in zip(known, known[1:]):
                if t2 < t1:
                    warnings.append(f"node {node}: {g2!r} (tier {t2:g}) is cheaper than {g1!r} (tier {t1:g}); order cheapest first")
    except GateError as e:
        problems.append((e.code, str(e)))
    except Exception as e:
        problems.append(("crashed", f"{type(e).__name__}: {e}"))
    for w in warnings: print(f"WARN [cost_order] {w}")
    if problems:
        print(f"FAIL validate-graph {a.graph}")
        for c, m in problems: print(f"  - [{c}] {m}")
        return 1
    print(f"PASS validate-graph {a.graph} ({sum(len(v) for v in refs.values())} gate refs)")
    return 0


def tokens(s):
    return {w for w in re.findall(r"[a-z0-9]+", s.lower()) if len(w) > 2 and w not in STOP}


def top_lessons(brain, query, n=3):
    q = tokens(query); d = os.path.join(brain, "library", "lessons"); scored = []
    if not q or not os.path.isdir(d): return []
    for fn in sorted(os.listdir(d)):
        if not fn.endswith(".md"): continue
        try:
            with open(os.path.join(d, fn), encoding="utf-8") as f: text = f.read()
        except Exception: continue
        head = text[:1500]
        score = 3 * len(q & tokens(fn + " " + head)) + len(q & tokens(text))
        if score: scored.append((score, fn))
    scored.sort(key=lambda x: (-x[0], x[1]))
    return [(s, os.path.join("library", "lessons", fn)) for s, fn in scored[:n]]


def cmd_lessons(a):
    hits = top_lessons(a.brain, a.query, a.n)
    for s, p in hits: print(f"{s}\t{p}")
    return 0


def main(argv=None):
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--brain", default=BRAIN)
    sub = p.add_subparsers(dest="cmd", required=True)
    r = sub.add_parser("run"); r.add_argument("--spec", required=True); r.add_argument("--result", required=True)
    r.add_argument("--no-lesson", action="store_true"); r.add_argument("--brain", default=argparse.SUPPRESS)
    r.add_argument("--repo", help="git repo whose HEAD the result sha must equal (overrides spec 'repo')")
    r.add_argument("--registry", action="append", help="gate registry; repeat to merge (project extends base)")
    r.add_argument("--retry-window-h", type=float, default=None, help="lesson dedupe window in hours (default: spec retry_window_h or 24; 0 disables)")
    v = sub.add_parser("validate-graph"); v.add_argument("--graph", required=True)
    v.add_argument("--registry", action="append", help=f"repeatable; default {DEFAULT_REGISTRY}")
    l = sub.add_parser("lessons"); l.add_argument("--query", required=True); l.add_argument("-n", type=int, default=3)
    l.add_argument("--brain", default=argparse.SUPPRESS)
    a = p.parse_args(argv)
    try:
        return {"run": cmd_run, "lessons": cmd_lessons, "validate-graph": cmd_validate_graph}[a.cmd](a)
    except Exception as e:
        print(f"FAIL unexpected: {e}"); return 1


if __name__ == "__main__":
    sys.exit(main())
