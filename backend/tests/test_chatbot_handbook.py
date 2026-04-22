import json

from services.chatbot.handbook_search import compact_match_lines, extract_handbook_paragraphs


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


def test_extract_handbook_paragraphs_returns_snippet_blocks():
    root = "/tmp/handbook"
    payload = "\n".join([
        f"{root}/common/ddi.txt-10-Header line",
        f"{root}/common/ddi.txt:11:BlueCat DDI handles DNS and IPAM for core services.",
        f"{root}/common/ddi.txt-12-Follow the migration checklist before changing records.",
        "--",
        f"{root}/README.md-20-Overview",
        f"{root}/README.md:21:BlueCat support notes for operational troubleshooting.",
    ])

    output = extract_handbook_paragraphs(payload, root, max_blocks=2, max_chars=220)

    assert output.startswith("Handbook fallback:")
    assert "Primary snippet:" in output
    assert "- common/ddi.txt: Header line BlueCat DDI handles DNS and IPAM for core services." in output
    assert "Additional snippet 1:" in output
    assert "- README.md: Overview BlueCat support notes for operational troubleshooting." in output
