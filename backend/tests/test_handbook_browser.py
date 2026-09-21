import pytest


@pytest.fixture()
def handbook_root(tmp_path, monkeypatch):
    (tmp_path / "guides").mkdir()
    (tmp_path / "guides" / "onboarding.md").write_text("# Onboarding\nWelcome.")
    (tmp_path / "guides" / "notes.txt").write_text("plain notes")
    (tmp_path / "policy.pdf").write_bytes(b"%PDF-1.4 fake pdf bytes")
    (tmp_path / "ignored.exe").write_bytes(b"binary")
    (tmp_path / ".git").mkdir()
    (tmp_path / ".git" / "config").write_text("hidden")

    monkeypatch.setenv("HANDBOOK_ROOT", str(tmp_path))
    return tmp_path


def test_tree_lists_folders_and_allowed_files_only(client, handbook_root):
    response = client.get("/api/handbook/tree")

    assert response.status_code == 200
    tree = response.json()
    names = {node["name"] for node in tree}
    assert names == {"guides", "policy.pdf"}

    guides = next(node for node in tree if node["name"] == "guides")
    assert guides["type"] == "dir"
    child_names = {child["name"] for child in guides["children"]}
    assert child_names == {"onboarding.md", "notes.txt"}


def test_tree_errors_when_root_missing(client, monkeypatch):
    monkeypatch.setenv("HANDBOOK_ROOT", "/no/such/directory")

    response = client.get("/api/handbook/tree")

    assert response.status_code == 500
    assert response.json()["error"] == "HANDBOOK_ROOT is not available in container"


def test_file_returns_markdown_content(client, handbook_root):
    response = client.get("/api/handbook/file", params={"path": "guides/onboarding.md"})

    assert response.status_code == 200
    assert response.text == "# Onboarding\nWelcome."
    assert response.headers["content-type"].startswith("text/markdown")


def test_file_returns_pdf_bytes(client, handbook_root):
    response = client.get("/api/handbook/file", params={"path": "policy.pdf"})

    assert response.status_code == 200
    assert response.content == b"%PDF-1.4 fake pdf bytes"
    assert response.headers["content-type"] == "application/pdf"


def test_file_rejects_unsupported_extension(client, handbook_root):
    response = client.get("/api/handbook/file", params={"path": "ignored.exe"})

    assert response.status_code == 400


def test_file_rejects_path_traversal(client, handbook_root):
    response = client.get("/api/handbook/file", params={"path": "../outside.md"})

    assert response.status_code == 400


def test_file_404_for_missing_file(client, handbook_root):
    response = client.get("/api/handbook/file", params={"path": "guides/missing.md"})

    assert response.status_code == 404
