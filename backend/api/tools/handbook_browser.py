from pathlib import Path
from typing import Iterator

from fastapi import APIRouter, HTTPException, Response
from pydantic import BaseModel

from services.chatbot.handbook_search import get_handbook_root


router = APIRouter(tags=["handbook"])

ALLOWED_SUFFIXES = {".md", ".txt", ".pdf"}
SEARCHABLE_SUFFIXES = {".md", ".txt"}
IGNORED_NAMES = {".git", ".DS_Store"}
MEDIA_TYPES = {
    ".md": "text/markdown; charset=utf-8",
    ".txt": "text/plain; charset=utf-8",
    ".pdf": "application/pdf",
}
MAX_SEARCH_RESULTS = 20
MAX_SNIPPET_CHARS = 200


class HandbookNode(BaseModel):
    name: str
    path: str
    type: str
    children: list["HandbookNode"] | None = None


HandbookNode.model_rebuild()


class HandbookSearchResult(BaseModel):
    path: str
    name: str
    line: int
    snippet: str


def handbook_root() -> Path:
    root = Path(get_handbook_root())
    if not root.is_dir():
        raise HTTPException(
            status_code=500,
            detail={"error": "HANDBOOK_ROOT is not available in container", "handbook_root": str(root)},
        )
    return root.resolve()


def resolve_within_root(root: Path, rel_path: str) -> Path:
    candidate = (root / rel_path).resolve()
    if candidate != root and root not in candidate.parents:
        raise HTTPException(status_code=400, detail="Invalid path")
    return candidate


def is_ignored(name: str) -> bool:
    return name in IGNORED_NAMES or name.startswith(".")


def build_tree(dir_path: Path, root: Path) -> list[HandbookNode]:
    try:
        entries = sorted(dir_path.iterdir(), key=lambda p: (p.is_file(), p.name.lower()))
    except OSError:
        return []

    nodes: list[HandbookNode] = []
    for entry in entries:
        if is_ignored(entry.name):
            continue

        rel = str(entry.relative_to(root))
        if entry.is_dir():
            children = build_tree(entry, root)
            if children:
                nodes.append(HandbookNode(name=entry.name, path=rel, type="dir", children=children))
        elif entry.suffix.lower() in ALLOWED_SUFFIXES:
            nodes.append(HandbookNode(name=entry.name, path=rel, type="file"))

    return nodes


def iter_searchable_files(dir_path: Path, root: Path) -> Iterator[Path]:
    try:
        entries = sorted(dir_path.iterdir(), key=lambda p: (p.is_file(), p.name.lower()))
    except OSError:
        return

    for entry in entries:
        if is_ignored(entry.name):
            continue
        if entry.is_dir():
            yield from iter_searchable_files(entry, root)
        elif entry.suffix.lower() in SEARCHABLE_SUFFIXES:
            yield entry


def build_snippet(line: str, query: str) -> str:
    normalized = " ".join(line.split())
    if len(normalized) <= MAX_SNIPPET_CHARS:
        return normalized

    lowered = normalized.lower()
    match_index = lowered.find(query.lower())
    if match_index == -1:
        return normalized[: MAX_SNIPPET_CHARS - 3].rstrip() + "..."

    start = max(0, match_index - MAX_SNIPPET_CHARS // 2)
    end = min(len(normalized), start + MAX_SNIPPET_CHARS)
    prefix = "..." if start > 0 else ""
    suffix = "..." if end < len(normalized) else ""
    return f"{prefix}{normalized[start:end].strip()}{suffix}"


def search_handbook_files(root: Path, query: str, max_results: int = MAX_SEARCH_RESULTS) -> list[HandbookSearchResult]:
    needle = query.lower()
    results: list[HandbookSearchResult] = []

    for file_path in iter_searchable_files(root, root):
        try:
            lines = file_path.read_text(encoding="utf-8", errors="replace").splitlines()
        except OSError:
            continue

        for line_number, line in enumerate(lines, start=1):
            if needle in line.lower():
                results.append(
                    HandbookSearchResult(
                        path=str(file_path.relative_to(root)),
                        name=file_path.name,
                        line=line_number,
                        snippet=build_snippet(line, query),
                    )
                )
                break

        if len(results) >= max_results:
            break

    return results


@router.get("/api/handbook/tree", response_model=list[HandbookNode])
def handbook_tree():
    root = handbook_root()
    return build_tree(root, root)


@router.get("/api/handbook/search", response_model=list[HandbookSearchResult])
def handbook_search(q: str):
    query = q.strip()
    if not query:
        raise HTTPException(status_code=400, detail="Query must not be empty")

    root = handbook_root()
    return search_handbook_files(root, query)


@router.get("/api/handbook/file")
def handbook_file(path: str):
    root = handbook_root()
    target = resolve_within_root(root, path)

    if not target.is_file():
        raise HTTPException(status_code=404, detail="File not found")

    suffix = target.suffix.lower()
    if suffix not in ALLOWED_SUFFIXES:
        raise HTTPException(status_code=400, detail="Unsupported file type")

    try:
        content = target.read_bytes()
    except OSError as exc:
        raise HTTPException(status_code=500, detail={"error": "read_failed", "details": str(exc)}) from exc

    return Response(content=content, media_type=MEDIA_TYPES[suffix])
