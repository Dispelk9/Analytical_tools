import json

from services.chatbot.handbook_search import compact_match_lines


def test_compact_match_lines_returns_small_context():
    root = "/tmp/handbook"
    payload = "\n".join([
        json.dumps({
            "type": "match",
            "data": {
                "path": {"text": f"{root}/common/ddi.txt"},
                "lines": {"text": "BlueCat DDI runbook with operational notes and migration checklist.\n"},
                "submatches": [{"match": {"text": "BlueCat"}}],
            },
        }),
        json.dumps({
            "type": "match",
            "data": {
                "path": {"text": f"{root}/common/ddi.txt"},
                "lines": {"text": "BlueCat DDI runbook with operational notes and migration checklist.\n"},
                "submatches": [{"match": {"text": "BlueCat"}}],
            },
        }),
        json.dumps({
            "type": "match",
            "data": {
                "path": {"text": f"{root}/README.md"},
                "lines": {"text": "BlueCat migration and DNS support background.\n"},
                "submatches": [{"match": {"text": "BlueCat"}}],
            },
        }),
    ])

    output = compact_match_lines(payload, root, max_matches=6, max_chars=90)

    assert output.startswith("Handbook matches:")
    assert "Primary match:" in output
    assert "- common/ddi.txt: BlueCat DDI runbook" in output
    assert "Additional matches:" in output
    assert "- README.md: BlueCat migration and DNS support background." in output
    assert output.count("common/ddi.txt") == 1


def test_compact_match_lines_handles_empty_result():
    assert compact_match_lines("", "/tmp/handbook") == "No matches found in handbook."
