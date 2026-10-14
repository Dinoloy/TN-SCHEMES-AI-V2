"""Small utilities for keeping RAG evidence concise and non-duplicative.

These are dependency-free. The character-to-token conversion is a conservative
heuristic, not a tokenizer; use the model tokenizer for exact accounting when
available. Keep citations and source metadata alongside every retained passage.
"""

from __future__ import annotations

import re
from collections.abc import Iterable, Mapping
from typing import Any


def normalize_for_dedup(text: str) -> str:
    """Normalize whitespace/case to remove exact duplicate chunks safely."""
    return re.sub(r"\s+", " ", text or "").strip().casefold()


def estimate_tokens(text: str) -> int:
    """Cheap rough estimate, deliberately biased upward for a safe budget."""
    if not text:
        return 0
    # English commonly averages > 3 chars/token; Tamil/tokenizers vary more.
    # 3 chars/token is a rough budget guard, not an accounting guarantee.
    return max(1, (len(text) + 2) // 3)


def deduplicate_passages(
    passages: Iterable[Mapping[str, Any]],
    *,
    text_key: str = "text",
) -> list[dict[str, Any]]:
    """Keep first occurrence of each normalized passage and preserve metadata."""
    seen: set[str] = set()
    output: list[dict[str, Any]] = []
    for item in passages:
        text = str(item.get(text_key) or "").strip()
        key = normalize_for_dedup(text)
        if not key or key in seen:
            continue
        seen.add(key)
        copied = dict(item)
        copied[text_key] = text
        output.append(copied)
    return output


def fit_passages_to_budget(
    passages: Iterable[Mapping[str, Any]],
    *,
    max_tokens: int = 1_000,
    max_passages: int = 3,
    text_key: str = "text",
) -> list[dict[str, Any]]:
    """Select passages in retrieval order within an estimated context budget.

    A final passage may be clipped when it alone exceeds the remaining budget.
    Metadata (URL, page, title, etc.) is preserved. Use the same index order for
    citations and retained evidence so citation numbers never silently drift.
    """
    if max_tokens < 1 or max_passages < 1:
        raise ValueError("max_tokens and max_passages must be positive integers")

    selected: list[dict[str, Any]] = []
    remaining = max_tokens
    for item in deduplicate_passages(passages, text_key=text_key):
        if len(selected) >= max_passages or remaining <= 0:
            break
        text = str(item.get(text_key) or "")
        allowed_chars = remaining * 3
        if estimate_tokens(text) > remaining:
            text = text[:allowed_chars].rsplit(" ", 1)[0].strip()
        if not text:
            continue
        copied = dict(item)
        copied[text_key] = text
        selected.append(copied)
        remaining -= estimate_tokens(text)
    return selected
