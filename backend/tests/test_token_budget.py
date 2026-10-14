from app.rag.token_budget import deduplicate_passages, estimate_tokens, fit_passages_to_budget


def test_deduplicate_normalizes_whitespace_and_case():
    rows = [
        {"text": "This is a scheme passage", "source_url": "https://a"},
        {"text": " this   IS a scheme passage ", "source_url": "https://b"},
        {"text": "A different passage", "source_url": "https://c"},
    ]
    result = deduplicate_passages(rows)
    assert len(result) == 2
    assert result[0]["source_url"] == "https://a"


def test_budget_keeps_metadata_and_limits_passages():
    rows = [
        {"text": "short evidence one", "source_url": "https://a"},
        {"text": "short evidence one", "source_url": "https://duplicate"},
        {"text": "second evidence " * 80, "page_number": 4},
        {"text": "third evidence", "source_url": "https://c"},
    ]
    result = fit_passages_to_budget(rows, max_tokens=25, max_passages=2)
    assert len(result) <= 2
    assert result[0]["source_url"] == "https://a"
    assert estimate_tokens(" ".join(item["text"] for item in result)) <= 26
    assert "page_number" in result[-1] or result[-1].get("source_url")


def test_invalid_budget_raises():
    try:
        fit_passages_to_budget([], max_tokens=0)
    except ValueError:
        pass
    else:
        raise AssertionError("Expected a ValueError")
