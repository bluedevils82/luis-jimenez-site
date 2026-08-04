#!/usr/bin/env python3
"""Check the vault for pipeline-rule violations.

Usage:
    python3 tools/check-invariants.py [--brief]

Exits 0 if the vault is clean, 1 if any violation is found.

Checks:
    1. Every wiki/*.md (except _index.md) has a `source:` line that
       points to a file that exists (typically under output/).
    2. No file mentions the retired worker `lape-hq.bluedevils82.workers.dev`.
    3. No file uses "The Agent Factory" (old name), except CLAUDE.md
       where the naming-continuity rule itself explains the retirement.
    4. Every projects/*.md and career/*.md (except _index.md) has a
       `status:` line in its first ~10 lines.
    5. No file starts with YAML frontmatter (`---`).
    6. All filenames are kebab-case a-z0-9-, with `_index.md` and
       `_migration-log.md` as the only underscore-prefixed exceptions.

Run from the vault root.
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

RETIRED_WORKER = re.compile(r"lape-hq\.bluedevils82\.workers\.dev", re.I)
OLD_NAME = re.compile(r"\bthe\s+agent\s+factory\b", re.I)
KEBAB_NAME = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*\.md$")
SOURCE_LINE = re.compile(r"^source:\s*(\S+)", re.M)
STATUS_LINE = re.compile(r"^status:\s*\S+", re.M)
YAML_FRONT = re.compile(r"^---\s*$", re.M)

EXEMPT_UNDERSCORE = {"_index.md", "_migration-log.md"}

# CLAUDE.md is allowed to reference the retired worker + old name because
# it documents the rules that forbid them everywhere else.
NAMING_RULE_EXEMPT = {Path("CLAUDE.md")}


def collect_files(root: Path) -> list[Path]:
    files: list[Path] = []
    for stage in ("inbox", "projects", "career", "output", "wiki"):
        stage_dir = root / stage
        if not stage_dir.exists():
            continue
        for path in stage_dir.rglob("*.md"):
            files.append(path.relative_to(root))
    return sorted(files)


def check_filename(path: Path) -> str | None:
    name = path.name
    if name in EXEMPT_UNDERSCORE:
        return None
    if not KEBAB_NAME.match(name):
        return f"filename not kebab-case: {name}"
    return None


def check_yaml_front(path: Path, text: str) -> str | None:
    head = text.splitlines()[:1]
    if head and head[0].strip() == "---":
        return "starts with YAML frontmatter (`---`) — forbidden"
    return None


def check_naming_rules(path: Path, text: str) -> list[str]:
    violations: list[str] = []
    if path in NAMING_RULE_EXEMPT:
        return violations
    if RETIRED_WORKER.search(text):
        violations.append("mentions retired worker lape-hq.bluedevils82.workers.dev")
    if OLD_NAME.search(text):
        violations.append('uses old name "The Agent Factory"')
    return violations


def check_status(path: Path, text: str) -> str | None:
    # CLAUDE.md requires status: on every projects/ file. career/ files
    # are living documents and may set one, but it isn't required.
    if path.parts[0] != "projects":
        return None
    if path.name in EXEMPT_UNDERSCORE:
        return None
    head = "\n".join(text.splitlines()[:12])
    if not STATUS_LINE.search(head):
        return "missing `status:` line in first 12 lines"
    return None


def check_wiki_source(path: Path, text: str, root: Path) -> str | None:
    if path.parts[0] != "wiki":
        return None
    if path.name in EXEMPT_UNDERSCORE:
        return None
    match = SOURCE_LINE.search(text)
    if not match:
        return "wiki note missing `source:` line"
    src_rel = match.group(1)
    src_path = root / src_rel
    if not src_path.exists():
        return f"wiki `source:` points to missing file: {src_rel}"
    return None


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__.strip().splitlines()[0])
    parser.add_argument("--brief", action="store_true",
                        help="print only a one-line summary")
    args = parser.parse_args(argv)

    root = Path.cwd()
    if not (root / "CLAUDE.md").exists():
        print("error: run from the vault root (no CLAUDE.md here)", file=sys.stderr)
        return 2

    violations: list[tuple[Path, str]] = []

    for rel in collect_files(root):
        abs_path = root / rel
        try:
            text = abs_path.read_text(encoding="utf-8", errors="replace")
        except OSError as exc:
            violations.append((rel, f"unreadable: {exc}"))
            continue

        for check in (check_filename(rel),
                      check_yaml_front(rel, text),
                      check_status(rel, text),
                      check_wiki_source(rel, text, root)):
            if check:
                violations.append((rel, check))
        for msg in check_naming_rules(rel, text):
            violations.append((rel, msg))

    if args.brief:
        if violations:
            print(f"invariants: {len(violations)} violation(s) across "
                  f"{len({v[0] for v in violations})} file(s). "
                  f"run `python tools/check-invariants.py` for details.")
        else:
            print("invariants: clean.")
        return 1 if violations else 0

    if not violations:
        print("clean — no invariant violations.")
        return 0

    print(f"{len(violations)} violation(s):\n")
    for rel, msg in violations:
        print(f"  {rel}: {msg}")
    return 1


if __name__ == "__main__":
    sys.exit(main())
