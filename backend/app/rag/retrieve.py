"""Lightweight local document retriever for the TN Schemes AI prototype.

Place official .txt, .md, .json, or .pdf files under backend/data/schemes.
For traceable web citations, JSON records should include source_url and source_title.
This simple lexical retriever does not require an embedding service.
"""
from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any

PROJECT_ROOT = Path(__file__).resolve().parents[3]
DEFAULT_DATA_DIR = PROJECT_ROOT / "backend" / "data" / "schemes"
_WORD_RE = re.compile(r"[\w\u0B80-\u0BFF]+", re.UNICODE)


def _words(text: str) -> set[str]:
    return {w.casefold() for w in _WORD_RE.findall(text) if len(w) > 1}


def _record(text: str, *, file_name: str, page: int | None = None,
            metadata: dict[str, Any] | None = None) -> dict[str, Any]:
    metadata = metadata or {}
    return {
        "text": text.strip(),
        "source_file": file_name,
        "page_number": page,
        "source_url": str(metadata.get("source_url") or metadata.get("url") or "").strip(),
        "source_title": str(metadata.get("source_title") or metadata.get("title") or Path(file_name).stem),
        "scheme_title": str(metadata.get("scheme_title") or metadata.get("title") or Path(file_name).stem),
        "publisher": str(metadata.get("publisher") or ""),
        "publication_date": str(metadata.get("publication_date") or ""),
        "department": str(metadata.get("department") or "Unknown"),
        "validity_status": str(metadata.get("validity_status") or "unverified"),
        "source_type": str(metadata.get("source_type") or ("web" if metadata.get("source_url") or metadata.get("url") else "local_document")),
    }


def _load_records(data_dir: Path) -> list[dict[str, Any]]:
    records: list[dict[str, Any]] = []
    if not data_dir.exists():
        return records

    for path in sorted(data_dir.rglob("*")):
        if not path.is_file():
            continue
        suffix = path.suffix.casefold()
        try:
            if suffix in {".txt", ".md"}:
                text = path.read_text(encoding="utf-8-sig", errors="replace").strip()
                if text:
                    # Small files are treated as one evidence passage.
                    records.append(_record(text, file_name=path.name))
            elif suffix == ".json":
                raw = json.loads(path.read_text(encoding="utf-8-sig"))
                rows = raw if isinstance(raw, list) else raw.get("documents", raw.get("schemes", [raw])) if isinstance(raw, dict) else []
                for row in rows:
                    if not isinstance(row, dict):
                        continue
                    text = str(row.get("text") or row.get("content") or row.get("description") or "").strip()
                    if text:
                        records.append(_record(text, file_name=path.name, page=row.get("page_number"), metadata=row))
            elif suffix == ".pdf":
                try:
                    from pypdf import PdfReader
                except ImportError:
                    continue
                reader = PdfReader(str(path))
                for page_number, page in enumerate(reader.pages, start=1):
                    text = (page.extract_text() or "").strip()
                    if text:
                        records.append(_record(text, file_name=path.name, page=page_number))
        except (OSError, ValueError, json.JSONDecodeError):
            # Ignore an unreadable document; never invent its contents.
            continue
    return records


def retrieve_schemes(question: str, k: int = 3) -> list[dict[str, Any]]:
    """Return up to k lexically relevant evidence passages in rank order."""
    question_words = _words(question)
    if not question_words or k < 1:
        return []
    records = _load_records(DEFAULT_DATA_DIR)
    ranked: list[tuple[float, int, dict[str, Any]]] = []
    for index, item in enumerate(records):
        body_words = _words(item["text"])
        overlap = len(question_words & body_words)
        if overlap == 0:
            continue
        # Simple overlap score with a small preference for concentrated matches.
        score = overlap / max(1, len(question_words)) + overlap / max(1, len(body_words)) * 0.1
        ranked.append((score, index, item))
    ranked.sort(key=lambda row: (-row[0], row[1]))
    return [item for _, _, item in ranked[:k]]
