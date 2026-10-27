# NNN — <Feature title> — Plan

Spec: [spec.md](./spec.md)

## 1. Approach

<Smallest viable solution in a few sentences. Mention alternatives considered and why they were rejected.>

## 2. Affected files

Remove rows that don't apply.

| Layer | File | Change |
|---|---|---|
| Backend | `backend/api/tools/<tool>.py` | `router = APIRouter(tags=["<tool>"])`, Pydantic request model, `@router.post("/api/<tool>")` |
| Backend | `backend/services/utils/<tool>_utils.py` | Pure helper functions (calculation / parsing) |
| Backend | `backend/main.py` | `app.include_router(<tool>_router, dependencies=protected_dependencies)` in `create_app()` |
| Backend | `backend/requirements.txt` | <new dependency, pinned> |
| Frontend | `frontend/src/pages/<Tool>.tsx` | Page component, calls backend via `authFetch` |
| Frontend | `frontend/src/components/<Component>.tsx` + `.css` | Reusable UI piece |
| Frontend | `frontend/src/App.tsx` | `<Route path="/<tool>" element={<Tool />} />` |
| Frontend | `frontend/src/data/toolThemes.ts` | Sidebar / dashboard tile |
| Frontend | `frontend/src/index.css` | New color tokens in `:root` **and** the light-mode block |
| Tests | `backend/tests/test_<tool>.py` | Uses `client` fixture from `conftest.py`; covers AC-… |
| Tests | `frontend/src/test/pages/<Tool>.test.tsx` | Vitest + Testing Library, `fetch` stubbed; covers AC-… |
| Docs | `docs/<topic>.md` | <setup / troubleshooting if needed> |
| Deploy | `deploy/...` | <env vars / services — ask before changing deployment design> |

## 3. Data model

```python
class <Tool>Request(BaseModel):
    field: str
    Email: str = ""   # optional, only if results are mailed like adduct
```

```ts
interface <Tool>Response {
  result: <...>;
  error?: string;
}
```

<DB tables / queries touched, if any. Table names are allow-listed and passed via `sql.Identifier`.>

## 4. Request flow

```
<Tool>.tsx --authFetch POST /api/<tool>--> api/tools/<tool>.py --> services/utils/<tool>_utils.py --> <PostgreSQL / external system>
                                                 |
                                   HTTPException --> {"error": "..."}
```

## 5. Configuration

| Env var | Purpose | Default |
|---|---|---|
| `<NAME>` | <purpose> | <safe default — never a real secret> |

Read with `os.getenv(...)` after `load_dotenv()`. Add to `deploy/` env files without real values.

## 6. Risks & mitigations

| Risk | Mitigation |
|---|---|
| <Breaking existing API consumers> | <Additive fields only> |
| <External system unavailable> | <Return 500 with clear `error`, log the exception> |

## 7. AGENTS.md checklist

- [ ] Smallest viable change; no unrelated refactors or directory moves
- [ ] No function names start with `_`
- [ ] Small functions, explicit error handling (`HTTPException`), no hidden side effects
- [ ] Frontend strongly typed (interfaces for request/response)
- [ ] No hardcoded colors; reviewed in **light** and **dark** mode; WCAG AA contrast
- [ ] No secrets / credentials; no unsafe command execution; parameterized SQL
- [ ] No silent API changes; backward compatibility stated in spec
- [ ] New infrastructure has tests
