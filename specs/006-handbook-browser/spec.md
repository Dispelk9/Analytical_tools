# 006 — Handbook browser & search

- **Status:** Done (baseline — documents existing behavior)
- **Author:** Viet Hoang
- **Created:** 2026-10-15
- **Related:** `backend/api/tools/handbook_browser.py`, `backend/services/chatbot/handbook_search.py`, `frontend/src/data/handbook.ts`, `frontend/src/pages/HandbookViewer.tsx`, `frontend/src/pages/HandbookSearch.tsx`, `frontend/src/components/Sidebar.tsx`, `frontend/src/components/Navbar.tsx`

## 1. Context / Problem

The team handbook is a folder of Markdown, text and PDF files mounted into the backend container. Users need to browse and search it from the web UI.

## 2. Goals

- Expose the handbook folder as a tree in the sidebar.
- Show a selected file (text or PDF).
- Full-text search over `.md` / `.txt` files from the navbar.

## 3. Non-goals

- Editing handbook files.
- Searching inside PDFs.
- Markdown rendering (shown as plain text).

## 4. User stories

- As a **user**, I want to browse the handbook in the sidebar, so that I find documents without leaving the app.
- As a **user**, I want to search the handbook, so that I jump to the file that mentions my term.

## 5. Acceptance criteria

| ID | Given / When / Then | Test |
|---|---|---|
| AC-1 | **When** `GET /api/handbook/tree`, **then** folders and `.md`/`.txt`/`.pdf` files are listed; hidden files and empty folders are omitted | `backend/tests/test_handbook_browser.py::test_tree_lists_folders_and_allowed_files_only` |
| AC-2 | **Given** `HANDBOOK_ROOT` does not exist, **then** tree/search return `500` | `test_tree_errors_when_root_missing`, `test_search_errors_when_root_missing` |
| AC-3 | **When** `GET /api/handbook/file?path=x.md`, **then** content with `text/markdown`; `.pdf` returns `application/pdf` bytes | `test_file_returns_markdown_content`, `test_file_returns_pdf_bytes` |
| AC-4 | **Given** a path outside the root (`../`), **then** `400 {"error": "Invalid path"}` | `test_file_rejects_path_traversal` |
| AC-5 | **Given** an unsupported extension, **then** `400`; missing file → `404` | `test_file_rejects_unsupported_extension`, `test_file_404_for_missing_file` |
| AC-6 | **When** `GET /api/handbook/search?q=term`, **then** first matching line per file, case-insensitive, `.md`/`.txt` only, max 20 results | `test_search_finds_matching_file_and_line`, `test_search_is_case_insensitive`, `test_search_ignores_pdf_and_unsupported_files` |
| AC-7 | **Given** an empty query, **then** `400`; no matches → `200 []` | `test_search_rejects_empty_query`, `test_search_returns_empty_list_for_no_matches` |
| AC-8 | Sidebar renders the tree, navigates to the viewer on file click, shows a message on load failure | `frontend/src/test/components/Sidebar.test.tsx` |
| AC-9 | Viewer renders text as plain text and PDFs in an `<embed>`; shows errors and an empty state | `frontend/src/test/pages/HandbookViewer.test.tsx` |
| AC-10 | Navbar search navigates to `/handbook/search?q=...`; results link to the viewer | `components/Navbar.test.tsx`, `pages/HandbookSearch.test.tsx` |

## 6. API contract

### `GET /api/handbook/tree` → `200`

```json
[
  { "name": "ops", "path": "ops", "type": "dir", "children": [
    { "name": "backup.md", "path": "ops/backup.md", "type": "file", "children": null }
  ]}
]
```

Sorted: folders first, then files, case-insensitive by name.

### `GET /api/handbook/search?q=<term>` → `200`

```json
[ { "path": "ops/backup.md", "name": "backup.md", "line": 12, "snippet": "...run the backup job nightly..." } ]
```

Snippet: whitespace-normalized line, max 200 chars, centered on the match with `...`.

### `GET /api/handbook/file?path=<relative path>` → `200`

Raw bytes; `text/markdown; charset=utf-8`, `text/plain; charset=utf-8` or `application/pdf`.

Errors:

| Status | When | Body |
|---|---|---|
| 400 | Empty query | `{ "error": "Query must not be empty" }` |
| 400 | Path escapes root | `{ "error": "Invalid path" }` |
| 400 | Extension not `.md`/`.txt`/`.pdf` | `{ "error": "Unsupported file type" }` |
| 404 | File not found | `{ "error": "File not found" }` |
| 500 | Root folder missing | `{ "error": "HANDBOOK_ROOT is not available in container", "handbook_root": "..." }` |
| 500 | Read error | `{ "error": "read_failed", "details": "..." }` |

Auth: protected (Keycloak).

## 7. UI / UX

- Routes `/handbook?path=...` (viewer) and `/handbook/search?q=...` (results).
- Tree loads in the sidebar via `fetchHandbookTree()` in `frontend/src/data/handbook.ts`.

## 8. Non-functional requirements

| Env var | Purpose | Default |
|---|---|---|
| `HANDBOOK_ROOT` | Handbook folder inside the container | `/data/vho-handbook` |

- **Security:** paths resolved and checked against the root (no traversal); only allow-listed extensions served.
- **Performance:** search scans files on every request (no index) — fine for a small handbook.

## 9. Open questions

- [ ] Render Markdown instead of plain text?

## 10. Known gaps

- Search reads every file per query; will slow down with a large handbook.
