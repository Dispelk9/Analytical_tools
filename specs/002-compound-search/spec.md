# 002 — Compound search (PubChem)

- **Status:** Done (baseline — documents existing behavior)
- **Author:** Viet Hoang
- **Created:** 2026-10-15
- **Related:** `backend/api/tools/compound.py`, `frontend/src/pages/Compound.tsx`

## 1. Context / Problem

After a mass-spec measurement, lab users need candidate compounds whose exact mass matches the observed mass minus a known adduct, within a mass error (ppm). Searching PubChem by hand is slow.

## 2. Goals

- Given adduct mass, observed mass and mass error, return up to 10 matching PubChem compounds with formula, exact mass, IUPAC name, link and structure image.
- Highlight molecular formulas that occur more than once.

## 3. Non-goals

- Local compound database or caching of PubChem results.
- More than 10 results / pagination.

## 4. User stories

- As a **lab user**, I want to enter adduct, observed mass and ppm error, so that I get candidate compounds from PubChem.

## 5. Acceptance criteria

| ID | Given / When / Then | Test |
|---|---|---|
| AC-1 | **Given** `AD`, `OB` or `ME` missing/empty, **when** `POST /api/compound`, **then** `400 {"error": "Missing one or more numbers"}` | `backend/tests/test_compound.py::test_compound_requires_payload_keys` |
| AC-2 | **Given** valid numbers, **when** PubChem returns CIDs, **then** `200` with `compounds` (max 10) and `duplicates` (formula → count > 1) | `test_compound.py::test_compound_returns_compounds_and_duplicates` |
| AC-3 | **Given** PubChem returns `PUGREST.NotFound`, **then** `404 {"error": <pubchem fault>}` | — (no test yet) |
| AC-4 | **Given** PubChem is unreachable or returns invalid JSON, **then** `500 {"error": "...", "response": "<raw text>"}` | — (no test yet) |
| AC-5 | **Given** the form is filled, **when** submitted, **then** returned compounds are rendered | `frontend/src/test/pages/Compound.test.tsx` |

## 6. API contract

```http
POST /api/compound
Content-Type: application/json

{ "AD": "1.007276", "OB": "181.0707", "ME": "5" }
```

Values may be strings with comma decimals (`"181,0707"`), converted by `convert_float`.

Calculation:

```
base_mass = OB - AD
delta     = ME * 1e-6 * base_mass        # ME in ppm
range     = [base_mass - delta, base_mass + delta]
GET https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/exact_mass/range/{min}/{max}/cids/JSON
```

Response `200`:

```json
{
  "compounds": [
    {
      "molecular_formula": "C6H12O6",
      "cid": 5793,
      "exact_mass": "180.06338810",
      "iupac_name": "...",
      "link": "https://pubchem.ncbi.nlm.nih.gov/compound/5793",
      "foto": "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/5793/PNG"
    }
  ],
  "duplicates": { "C6H12O6": 3 }
}
```

Errors:

| Status | When | Body |
|---|---|---|
| 400 | Missing `AD` / `OB` / `ME` | `{ "error": "Missing one or more numbers" }` |
| 404 | PubChem finds nothing | `{ "error": { "Fault": { "Code": "PUGREST.NotFound", ... } } }` |
| 500 | PubChem connection / JSON error, any other exception | `{ "error": "...", "response": "..." }` or `{ "error": "..." }` |

Auth: protected (Keycloak). Backward compatibility: field names `AD`/`OB`/`ME` are part of the contract.

## 7. UI / UX

- Route `/compound`, page `Compound.tsx`, calls `authFetch('/api/compound')`.

## 8. Non-functional requirements

- **Rate limit:** PubChem detail lookups are throttled to 3 requests/s (`time.sleep(1/3)` per CID) → a full response takes ≥ 3.3 s.
- **External dependency:** PubChem REST + `pubchempy`; timeout 10 s for the range query.

## 9. Open questions

- [ ] Should the 10-result limit be configurable?

## 10. Known gaps

- The result list is also stored in `request.session["list_of_compounds"]` — it is never read again and can exceed the ~4 KB session cookie limit.
- `convert_float` fails with `TypeError` (→ 500) if a JSON number instead of a string is sent.
- `pcp.Compound.from_cid` calls have no explicit timeout.
