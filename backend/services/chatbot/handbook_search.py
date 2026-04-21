import json
import logging
import os
import subprocess
from pathlib import Path

NO_HANDBOOK_MATCHES = "No matches found in handbook."


def get_handbook_root() -> str:
    return os.getenv("HANDBOOK_ROOT", "/data/vho-handbook")


def build_handbook_search_command(query: str, root: str) -> list[str]:
    return [
        "rg",
        "--json",
        "--ignore-case",
        "--hidden",
        "--glob", "!.git/*",
        "--glob", "!*.log",
        "--glob", "!*.sqlite*",
        "--glob", "!*.db*",
        query,
        root,
    ]


def compact_match_lines(stdout: str, root: str, max_matches: int = 6, max_chars: int = 280) -> str:
    matches: list[tuple[str, str]] = []
    seen: set[tuple[str, str]] = set()
    root_path = Path(root).resolve()

    for raw_line in stdout.splitlines():
        if not raw_line.strip():
            continue

        try:
            entry = json.loads(raw_line)
        except json.JSONDecodeError:
            continue

        if entry.get("type") != "match":
            continue

        data = entry.get("data", {})
        path_info = data.get("path", {})
        line_info = data.get("lines", {})
        text = str(line_info.get("text", "")).strip()
        if not text:
            continue

        try:
            rel_path = str(Path(path_info.get("text", "")).resolve().relative_to(root_path))
        except ValueError:
            continue

        lowered = rel_path.lower()
        if "/.git/" in lowered or lowered.startswith(".git/"):
            continue

        normalized = " ".join(text.split())
        if len(normalized) > max_chars:
            normalized = normalized[: max_chars - 3].rstrip() + "..."

        key = (rel_path, normalized)
        if key in seen:
            continue

        seen.add(key)
        matches.append((rel_path, normalized))
        if len(matches) >= max_matches:
            break

    if not matches:
        return NO_HANDBOOK_MATCHES

    rendered = ["Handbook matches:"]
    first_path, first_line = matches[0]
    rendered.append("Primary match:")
    rendered.append(f"- {first_path}: {first_line}")

    if len(matches) > 1:
        rendered.append("Additional matches:")
        for rel_path, line in matches[1:]:
            rendered.append(f"- {rel_path}: {line}")
    return "\n".join(rendered)


def search_handbook_text(query: str) -> str:
    root = get_handbook_root()
    if not os.path.isdir(root):
        raise FileNotFoundError(root)

    proc = subprocess.run(
        build_handbook_search_command(query, root),
        capture_output=True,
        text=True,
        timeout=20,
    )

    if proc.returncode == 2:
        logging.error("grep error: %s", proc.stderr)
        raise RuntimeError(proc.stderr.strip() or "grep_failed")

    return compact_match_lines(proc.stdout or "", root)


def has_handbook_matches(output: str) -> bool:
    return output.strip().startswith("Handbook matches:")
