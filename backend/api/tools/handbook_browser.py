from pathlib import Path

from fastapi import APIRouter, HTTPException, Response
from pydantic import BaseModel

from services.chatbot.handbook_search import get_handbook_root


router = APIRouter(tags=["handbook"])

ALLOWED_SUFFIXES = {".md", ".txt", ".pdf"}
IGNORED_NAMES = {".git", ".DS_Store"}
MEDIA_TYPES = {
    ".md": "text/markdown; charset=utf-8",
    ".txt": "text/plain; charset=utf-8",
    ".pdf": "application/pdf",
}


class HandbookNode(BaseModel):
    name: str
    path: str
    type: str
    children: list["HandbookNode"] | None = None


HandbookNode.model_rebuild()


def _handbook_root() -> Path:
    root = Path(get_handbook_root())
    if not root.is_dir():
        raise HTTPException(
            status_code=500,
            detail={"error": "HANDBOOK_ROOT is not available in container", "handbook_root": str(root)},
        )
    return root.resolve()


def _resolve_within_root(root: Path, rel_path: str) -> Path:
    candidate = (root / rel_path).resolve()
    if candidate != root and root not in candidate.parents:
        raise HTTPException(status_code=400, detail="Invalid path")
    return candidate


def _build_tree(dir_path: Path, root: Path) -> list[HandbookNode]:
    try:
        entries = sorted(dir_path.iterdir(), key=lambda p: (p.is_file(), p.name.lower()))
    except OSError:
        return []

    nodes: list[HandbookNode] = []
    for entry in entries:
        if entry.name in IGNORED_NAMES or entry.name.startswith("."):
            continue

        rel = str(entry.relative_to(root))
        if entry.is_dir():
            children = _build_tree(entry, root)
            if children:
                nodes.append(HandbookNode(name=entry.name, path=rel, type="dir", children=children))
        elif entry.suffix.lower() in ALLOWED_SUFFIXES:
            nodes.append(HandbookNode(name=entry.name, path=rel, type="file"))

    return nodes


@router.get("/api/handbook/tree", response_model=list[HandbookNode])
def handbook_tree():
    root = _handbook_root()
    return _build_tree(root, root)


@router.get("/api/handbook/file")
def handbook_file(path: str):
    root = _handbook_root()
    target = _resolve_within_root(root, path)

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
