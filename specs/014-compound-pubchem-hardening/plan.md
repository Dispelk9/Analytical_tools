# 014 — Compound search: faster, bounded PubChem calls — Plan

Spec: [spec.md](./spec.md)

## 1. Approach

Replace the per-CID `pcp.Compound.from_cid` loop with one PUG REST call:

```
GET https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/{cid1,cid2,...}/property/MolecularFormula,ExactMass,IUPACName/JSON
```

Map `PropertyTable.Properties[]` to the existing `compound_each` dict (`link` and `foto` built from CID as today). Move the PubChem calls into `backend/services/utils/pubchem_client.py` (`fetch_cids_in_mass_range`, `fetch_compound_properties`) with explicit timeouts and typed exceptions (`PubChemTimeout`, `PubChemUnavailable`, `PubChemNotFound`). Remove `time.sleep` and the session write.

## 2. Affected files

| Layer | File | Change |
|---|---|---|
| Backend | `backend/services/utils/pubchem_client.py` | New PubChem client functions |
| Backend | `backend/api/tools/compound.py` | Use client; map errors; remove session write and sleep |
| Tests | `backend/tests/test_compound.py` | AC-1 … AC-5 (monkeypatch `requests.get`) |
| Tests | `backend/tests/test_pubchem_client.py` | Unit tests for mapping/parsing |

## 3. Data model

```python
COMPOUND_PROPERTIES = "MolecularFormula,ExactMass,IUPACName"
PUBCHEM_TIMEOUT_SECONDS = 10
MAX_COMPOUNDS = 10
```

## 4. Request flow

```
Compound.tsx → POST /api/compound → fetch_cids_in_mass_range (1 call) → fetch_compound_properties (1 call) → response
```

## 5. Configuration

None.

## 6. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Property names differ from `pubchempy` values (e.g. IUPAC name missing) | Default to `None`, same as pubchempy; test with real CID in debug stack |
| Order of properties differs from CID order | Re-order by CID list |

## 7. AGENTS.md checklist

- [ ] No function names start with `_`
- [ ] Error body changes documented (404/502/504)
- [ ] Tests for new client module
