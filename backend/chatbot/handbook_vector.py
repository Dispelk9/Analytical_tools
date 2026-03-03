import os
import glob
import hashlib
from dataclasses import dataclass
from typing import Any, Dict, List, Optional, Tuple

import chromadb
from chromadb.config import Settings
from sentence_transformers import SentenceTransformer


SUPPORTED_EXT = (".md", ".txt", ".rst")


def _sha1(s: str) -> str:
    return hashlib.sha1(s.encode("utf-8", errors="ignore")).hexdigest()


def chunk_text(text: str, max_chars: int = 2000, overlap: int = 250) -> List[str]:
    text = (text or "").strip()
    if not text:
        return []
    chunks: List[str] = []
    i = 0
    step = max_chars - overlap
    if step <= 0:
        step = max_chars
    while i < len(text):
        chunks.append(text[i : i + max_chars])
        i += step
    return chunks


@dataclass
class Snippet:
    path: str
    section: str
    score: float
    text: str


class HandbookVectorIndex:
    """
    Persistent vector index of your handbook folder using ChromaDB.
    Stores chunks with metadata: path, section, content_hash.
    """

    def __init__(self, handbook_root: str, persist_dir: str, collection: str = "vho_handbook"):
        self.handbook_root = handbook_root
        self.persist_dir = persist_dir
        self.collection_name = collection

        # Embedding model (small + good baseline)
        model_name = os.getenv("HANDBOOK_EMBED_MODEL", "sentence-transformers/all-MiniLM-L6-v2")
        self.embedder = SentenceTransformer(model_name)

        self.client = chromadb.PersistentClient(
            path=self.persist_dir,
            settings=Settings(anonymized_telemetry=False),
        )
        self.col = self.client.get_or_create_collection(self.collection_name)

    def _iter_files(self) -> List[str]:
        files: List[str] = []
        for ext in SUPPORTED_EXT:
            files.extend(glob.glob(os.path.join(self.handbook_root, "**", f"*{ext}"), recursive=True))
        # skip .git and junk
        files = [f for f in files if "/.git/" not in f and "/__pycache__/" not in f]
        return sorted(set(files))

    def _meta_for_file(self, abs_path: str) -> Tuple[str, str]:
        rel = os.path.relpath(abs_path, self.handbook_root)
        section = rel.split(os.sep, 1)[0] if os.sep in rel else rel
        return rel, section

    def _read_file(self, abs_path: str) -> str:
        with open(abs_path, "r", encoding="utf-8", errors="ignore") as f:
            return f.read()

    def reindex_all(self) -> Dict[str, int]:
        """
        Simple + reliable: rebuild the whole index.
        Your repo is small, so this is fine.
        """
        files = self._iter_files()

        # Drop + recreate collection
        try:
            self.client.delete_collection(self.collection_name)
        except Exception:
            pass
        self.col = self.client.get_or_create_collection(self.collection_name)

        ids: List[str] = []
        docs: List[str] = []
        metas: List[Dict[str, Any]] = []

        for abs_path in files:
            rel, section = self._meta_for_file(abs_path)
            text = self._read_file(abs_path)
            content_hash = _sha1(text)

            chunks = chunk_text(text)
            for i, ch in enumerate(chunks):
                doc_id = f"{rel}::chunk::{i}"
                ids.append(doc_id)
                docs.append(ch)
                metas.append({"path": rel, "section": section, "content_hash": content_hash})

        if docs:
            embs = self.embedder.encode(docs, normalize_embeddings=True).tolist()
            self.col.add(ids=ids, documents=docs, metadatas=metas, embeddings=embs)

        return {"files": len(files), "chunks": len(docs)}

    def is_index_empty(self) -> bool:
        try:
            # chroma doesn't have a direct "count" in all versions; query small
            res = self.col.get(limit=1)
            return len(res.get("ids", [])) == 0
        except Exception:
            return True

    def search(self, query: str, top_k: int = 5, section: Optional[str] = None) -> List[Snippet]:
        query = (query or "").strip()
        if not query:
            return []

        q_emb = self.embedder.encode([query], normalize_embeddings=True).tolist()

        where = {"section": section} if section else None
        res = self.col.query(
            query_embeddings=q_emb,
            n_results=max(1, min(int(top_k), 20)),
            where=where,
            include=["documents", "metadatas", "distances"],
        )

        out: List[Snippet] = []
        docs = res["documents"][0] if res.get("documents") else []
        metas = res["metadatas"][0] if res.get("metadatas") else []
        dists = res["distances"][0] if res.get("distances") else []

        for doc, meta, dist in zip(docs, metas, dists):
            # Chroma returns distance; smaller is closer. Convert to similarity-ish score.
            score = float(1.0 / (1.0 + float(dist))) if dist is not None else 0.0
            out.append(
                Snippet(
                    path=str(meta.get("path", "")),
                    section=str(meta.get("section", "")),
                    score=score,
                    text=str(doc or ""),
                )
            )
        return out


def build_context_block(snips: List[Snippet], max_items: int = 4, max_chars_each: int = 1200) -> Tuple[str, List[Dict[str, Any]]]:
    if not snips:
        return "", []
    use = snips[:max_items]
    lines = ["### HANDBOOK CONTEXT (authoritative)\n"]
    sources: List[Dict[str, Any]] = []
    for i, s in enumerate(use, 1):
        t = s.text.strip()
        if len(t) > max_chars_each:
            t = t[:max_chars_each] + "..."
        lines.append(f"[{i}] source: {s.path} (score={s.score:.3f})\n{t}\n")
        sources.append({"n": i, "path": s.path, "section": s.section, "score": s.score})
    return "\n".join(lines).strip(), sources