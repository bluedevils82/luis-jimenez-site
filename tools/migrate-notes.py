#!/usr/bin/env python3
"""Migrate a notes dump into the second-brain vault.

Usage:
    python3 tools/migrate-notes.py <source-dir> [--apply] [--move]
                                                [--kids "Name1,Name2,..."]

Defaults to a dry-run: prints the plan, touches nothing on disk. Add
--apply to actually copy the files and write inbox/_migration-log.md.
Add --move to also delete each source file after a successful copy.

Routing rules (enforced in this order):
    1. Non-.md/.txt files -> inbox/attachments/<basename>
    2. Project keywords hit >= 2 -> inbox/merge-candidate--<project>--<slug>.md
       (never overwrites the seeded projects/<project>.md)
    3. Career keywords hit >= 2 -> inbox/merge-candidate--career--<slug>.md
    4. Output keywords hit >= 1 -> output/<slug>.md
    5. Otherwise               -> inbox/<slug>.md

    wiki/ is NEVER a destination. Wiki is harvest-only.

Flags surfaced in the log (never auto-rewritten -- human review closes the loop):
    - References to the retired worker lape-hq.bluedevils82.workers.dev
    - Occurrences of the old name "The Agent Factory"
    - Kids' names appearing in full (only if you pass --kids)

Run from the vault root (the directory containing CLAUDE.md and projects/).
"""

from __future__ import annotations

import argparse
import datetime as _dt
import re
import shutil
import sys
from pathlib import Path

PROJECT_KEYWORDS = {
    "agent-factoria": [
        "agent factoria",
        "agent factory",
        "freemium ai agent",
        "agent builder saas",
    ],
    "lape-ventures": [
        "lape ventures",
        "family venture finder",
        " fvf ",
        "fvf.",
        "lape signal",
        "lape distributor",
        "renderpaywall",
        "decision-support tool",
    ],
    "wfn-content-studio": [
        "wfn content studio",
        "workforce now",
        "synthesia",
        "adp client training",
    ],
    "backyard-teachers-book": [
        "backyard teachers",
        "kdp",
        "picture book",
        "bilingual",
        "yaya",
    ],
    "home-addition": [
        "home addition",
        "sunroom",
        "cedar cladding",
        "office build",
        "black-framed glass",
    ],
}

CAREER_KEYWORDS = [
    "resume",
    "cv ",
    "interview prep",
    "recruiter",
    "hiring manager",
    "brett johnson",
    "product planning",
    "analytics & insights director",
    "analytics and insights director",
    "tpm director",
    "positioning",
    "role tracking",
    "adp director",
    "job description",
]

OUTPUT_KEYWORDS = [
    "shipped v",
    "published",
    "released",
    "final version",
    "in production",
    "went live",
    "deployed to production",
]

FLAG_PATTERNS = {
    "retired-worker": re.compile(r"lape-hq\.bluedevils82\.workers\.dev", re.I),
    "old-name-agent-factory": re.compile(r"\bthe\s+agent\s+factory\b", re.I),
}

SKIP_DIRS = {".obsidian", ".git", ".trash", "__pycache__", ".venv", "node_modules"}
TEXT_EXTS = {".md", ".txt", ".markdown"}


def slugify(name: str) -> str:
    stem = Path(name).stem.lower()
    stem = re.sub(r"[^a-z0-9]+", "-", stem)
    stem = re.sub(r"-+", "-", stem).strip("-")
    return stem or "untitled"


def read_head(path: Path, n_bytes: int = 4096) -> str:
    try:
        with path.open("rb") as f:
            data = f.read(n_bytes)
        return data.decode("utf-8", errors="replace")
    except OSError as exc:
        print(f"warn: could not read {path}: {exc}", file=sys.stderr)
        return ""


def classify(text: str, filename: str, kids: list[str]):
    hay = (filename + "\n" + text).lower()
    project_hits = {
        proj: sum(1 for kw in kws if kw in hay)
        for proj, kws in PROJECT_KEYWORDS.items()
    }
    project_hits = {p: s for p, s in project_hits.items() if s > 0}
    career_score = sum(1 for kw in CAREER_KEYWORDS if kw in hay)
    output_score = sum(1 for kw in OUTPUT_KEYWORDS if kw in hay)

    flags: list[str] = []
    for flag_name, pat in FLAG_PATTERNS.items():
        if pat.search(text):
            flags.append(flag_name)
    for kid in kids:
        if re.search(rf"\b{re.escape(kid)}\b", text, re.I):
            flags.append(f"kid-name:{kid}")

    if project_hits:
        best = max(project_hits, key=project_hits.get)
        if project_hits[best] >= 2:
            return ("project-merge", best, flags,
                    f"project '{best}' matched {project_hits[best]}x")

    if career_score >= 2:
        return ("career-merge", None, flags,
                f"career signals {career_score}x")

    if output_score >= 1:
        return ("output", None, flags,
                f"output signal {output_score}x")

    reason = "no clear signal"
    if project_hits:
        weak = ", ".join(f"{p}={s}" for p, s in project_hits.items())
        reason = f"weak project signal ({weak}) -- routed to inbox"
    elif career_score:
        reason = f"weak career signal ({career_score}) -- routed to inbox"
    return ("inbox", None, flags, reason)


def target_for(bucket: str, project: str | None, source: Path):
    slug = slugify(source.name)
    if bucket == "project-merge":
        return Path("inbox") / f"merge-candidate--{project}--{slug}.md"
    if bucket == "career-merge":
        return Path("inbox") / f"merge-candidate--career--{slug}.md"
    if bucket == "output":
        return Path("output") / f"{slug}.md"
    return Path("inbox") / f"{slug}.md"


def collide_safe(target: Path, taken: set[Path]) -> Path:
    if target not in taken and not target.exists():
        return target
    stem, suffix = target.stem, target.suffix
    i = 2
    while True:
        candidate = target.with_name(f"{stem}-{i}{suffix}")
        if candidate not in taken and not candidate.exists():
            return candidate
        i += 1


def plan_attachment(source: Path, taken: set[Path]):
    target = Path("inbox/attachments") / source.name
    target = collide_safe(target, taken)
    return {
        "source": source,
        "target": target,
        "bucket": "attachment",
        "project": None,
        "flags": [],
        "reason": "non-text file",
    }


def walk_source(source_dir: Path):
    for path in sorted(source_dir.rglob("*")):
        if path.is_dir():
            continue
        if any(part in SKIP_DIRS or part.startswith(".") for part in path.relative_to(source_dir).parts[:-1]):
            continue
        if path.name.startswith("."):
            continue
        yield path


def build_plan(source_dir: Path, kids: list[str]):
    plan = []
    taken: set[Path] = set()
    for source in walk_source(source_dir):
        ext = source.suffix.lower()
        if ext not in TEXT_EXTS:
            entry = plan_attachment(source, taken)
        else:
            text = read_head(source)
            bucket, project, flags, reason = classify(text, source.name, kids)
            target = target_for(bucket, project, source)
            target = collide_safe(target, taken)
            entry = {
                "source": source,
                "target": target,
                "bucket": bucket,
                "project": project,
                "flags": flags,
                "reason": reason,
            }
        taken.add(entry["target"])
        plan.append(entry)
    return plan


def render_plan_line(entry) -> str:
    lines = [
        f"- {entry['source']}",
        f"    -> {entry['target']}",
        f"    bucket: {entry['bucket']}",
        f"    reason: {entry['reason']}",
    ]
    if entry["flags"]:
        lines.append(f"    flags: {', '.join(entry['flags'])}")
    return "\n".join(lines)


def apply_plan(plan, move: bool):
    for entry in plan:
        entry["target"].parent.mkdir(parents=True, exist_ok=True)
        if entry["target"].exists():
            print(f"skip (already exists): {entry['target']}", file=sys.stderr)
            entry["applied"] = False
            continue
        shutil.copy2(entry["source"], entry["target"])
        entry["applied"] = True
        if move:
            try:
                entry["source"].unlink()
                entry["moved"] = True
            except OSError as exc:
                print(f"warn: could not delete {entry['source']}: {exc}", file=sys.stderr)


def write_log(plan, source_dir: Path, move: bool):
    log_path = Path("inbox/_migration-log.md")
    log_path.parent.mkdir(parents=True, exist_ok=True)
    header_needed = not log_path.exists()

    now = _dt.datetime.now().isoformat(timespec="seconds")
    lines: list[str] = []
    if header_needed:
        lines.append("# Migration Log\n")
        lines.append(
            "Append-only record of notes-migration runs. Every source file, "
            "every destination, every flag. Nothing silently disappears.\n"
        )

    lines.append(f"\n## Run at {now}\n")
    lines.append(f"- source: `{source_dir}`")
    lines.append(f"- mode: {'move' if move else 'copy'}")
    lines.append(f"- files planned: {len(plan)}")
    applied = sum(1 for e in plan if e.get("applied"))
    lines.append(f"- files applied: {applied}\n")

    bucket_summary: dict[str, int] = {}
    for e in plan:
        bucket_summary[e["bucket"]] = bucket_summary.get(e["bucket"], 0) + 1
    lines.append("### Bucket summary")
    for bucket, count in sorted(bucket_summary.items()):
        lines.append(f"- {bucket}: {count}")
    lines.append("")

    flagged = [e for e in plan if e["flags"]]
    if flagged:
        lines.append("### Flagged files (review before publishing)")
        for e in flagged:
            lines.append(
                f"- `{e['source']}` -> `{e['target']}` -- flags: "
                + ", ".join(e["flags"])
            )
        lines.append("")

    lines.append("### Moves")
    for e in plan:
        status = "OK" if e.get("applied") else "skipped"
        note = f" [{e['project']}]" if e["project"] else ""
        lines.append(
            f"- [{status}] `{e['source']}` -> `{e['target']}` "
            f"({e['bucket']}{note}) -- {e['reason']}"
        )

    with log_path.open("a", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")


def verify_vault_root():
    required = [Path("CLAUDE.md"), Path("projects/_index.md"), Path("inbox/_index.md")]
    missing = [str(p) for p in required if not p.exists()]
    if missing:
        print(
            "error: run from the vault root -- missing: " + ", ".join(missing),
            file=sys.stderr,
        )
        sys.exit(2)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Migrate a notes dump into the vault.")
    parser.add_argument("source", type=Path, help="path to your notes dump")
    parser.add_argument("--apply", action="store_true",
                        help="actually copy files and write the migration log (default: dry-run)")
    parser.add_argument("--move", action="store_true",
                        help="with --apply, delete each source after a successful copy")
    parser.add_argument("--kids", type=str, default="",
                        help='comma-separated names to flag if they appear in full (e.g. "Palmer,Everett")')
    args = parser.parse_args(argv)

    if not args.source.is_dir():
        print(f"error: {args.source} is not a directory", file=sys.stderr)
        return 2

    verify_vault_root()

    kids = [k.strip() for k in args.kids.split(",") if k.strip()]
    plan = build_plan(args.source.resolve(), kids)

    if not plan:
        print("nothing to migrate -- no files under source (after skip rules)")
        return 0

    print(f"planned {len(plan)} file(s) from {args.source}:\n")
    for entry in plan:
        print(render_plan_line(entry))
        print()

    if not args.apply:
        print("dry-run only. re-run with --apply to copy and log.")
        return 0

    apply_plan(plan, args.move)
    write_log(plan, args.source.resolve(), args.move)
    print(f"\ndone. log appended at inbox/_migration-log.md")
    return 0


if __name__ == "__main__":
    sys.exit(main())
