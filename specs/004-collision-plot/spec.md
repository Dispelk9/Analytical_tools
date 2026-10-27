# 004 — Collision plot (ACT Math)

- **Status:** Done (baseline — documents existing behavior)
- **Author:** Viet Hoang
- **Created:** 2026-10-15
- **Related:** `backend/api/tools/act_math.py`, `frontend/src/pages/ACT_Math.tsx`

## 1. Context / Problem

Lab users want a quick concentration-vs-response scatter plot from measured values without opening a spreadsheet tool.

## 2. Goals

- Turn two equal-length number lists into a PNG scatter plot.

## 3. Non-goals

- Regression / calibration curve fitting.
- Interactive charts.

## 4. User stories

- As a **lab user**, I want to paste concentrations and responses, so that I see them plotted immediately.

## 5. Acceptance criteria

| ID | Given / When / Then | Test |
|---|---|---|
| AC-1 | **Given** valid `x` and `y` lists of equal length, **when** `POST /api/collision`, **then** `200` with `image/png` | `backend/tests/test_act_math.py::test_collision_returns_png` |
| AC-2 | **Given** lists of different length, **then** `400 {"error": "'x' and 'y' lists must have the same length"}` | `test_act_math.py::test_collision_rejects_mismatched_lengths` |
| AC-3 | **Given** `x` or `y` missing, **then** `400 {"error": "Both 'x' and 'y' must be lists"}` | — (no test yet) |
| AC-4 | **Given** inputs in the form, **when** submitted, **then** the page parses them and renders the returned image | `frontend/src/test/pages/ACT_Math.test.tsx` |

## 6. API contract

```http
POST /api/collision
Content-Type: application/json

{ "x": [0.5, 1, 2, 4], "y": [120, 250, 480, 990] }
```

Response `200`: PNG bytes, `Content-Type: image/png`, headers `Cache-Control: no-cache, no-store, must-revalidate`, `Pragma: no-cache`, `Expires: 0`.
Plot: blue scatter, x label "Concentration (µg/mL)", y label "Response", title "Concentration vs Response".

Errors:

| Status | When | Body |
|---|---|---|
| 400 | `x` / `y` missing | `{ "error": "Both 'x' and 'y' must be lists" }` |
| 400 | Length mismatch | `{ "error": "'x' and 'y' lists must have the same length" }` |
| 422 | Non-numeric list items (Pydantic) | `{ "detail": [ ... ] }` (FastAPI default) |

Auth: protected (Keycloak).

## 7. UI / UX

- Route `/math`, page `ACT_Math.tsx` (component `CollisionPlot`), shows the PNG via an object URL.
- Light & dark mode: the PNG has a white matplotlib background in both themes.

## 8. Non-functional requirements

- matplotlib figure is closed after each request (no memory leak).

## 9. Open questions

- [ ] Should the plot follow the dark theme (transparent background)?

## 10. Known gaps

- No upper limit on list length.
