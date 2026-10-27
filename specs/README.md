# Specs — Spec-Driven Development

Every non-trivial feature or change starts here, **before** any code is written.

```
spec.md   →  plan.md   →  tasks.md   →  code + tests
 (what/why)   (how)        (steps)       (implementation)
```

## Workflow

1. **Create the folder** from the template (next free number, short kebab-case name):

   ```bash
   cp -r specs/template specs/004-export-results-csv
   ```

2. **Write `spec.md`** — the *what* and *why*. No implementation details.
   Every acceptance criterion gets an ID (`AC-1`, `AC-2`, …) and must be testable.
   Set `Status: Draft`, review it, then set `Status: Approved`.

3. **Write `plan.md`** — the *how*: files to touch, API contract, data model,
   light/dark mode impact, risks. Must respect [`AGENTS.md`](../AGENTS.md).

4. **Write `tasks.md`** — a small, ordered checklist. Tests come before
   (or together with) the code they cover.

5. **Implement** task by task, ticking boxes as you go. Each `AC-n` maps to at
   least one pytest (`backend/tests/`) or vitest (`frontend/src/`) test.

6. **Close it** — set `Status: Done`. If the implementation diverged from the
   spec, update the spec; the spec must describe what actually shipped.

## When is a spec required?

| Change | Spec? |
|---|---|
| New tool, endpoint, page, or integration | Yes |
| Changing an existing API contract or behavior | Yes |
| Deployment / auth / database changes | Yes |
| Bug fix with obvious cause, typo, styling tweak, dependency bump | No (a clear commit message is enough) |

## Status values

`Draft` → `Approved` → `In Progress` → `Done` (or `Superseded by NNN`)

## Using it with an AI agent

```
Read specs/README.md, then create specs/004-export-results-csv/spec.md for:
"users can download the result table of any tool as CSV".
Stop after the spec so I can review it.
```

Then, once approved: *"Write plan.md and tasks.md for spec 004"*, and finally
*"Implement spec 004 task by task"*.

## Spec index

| ID | Spec | Status |
|---|---|---|
| 001 | [Authentication (Keycloak)](001-auth-keycloak/spec.md) | Done (baseline) |
| 002 | [Compound search (PubChem)](002-compound-search/spec.md) | Done (baseline) |
| 003 | [Adduct calculation](003-adduct-calculation/spec.md) | Done (baseline) |
| 004 | [Collision plot (ACT Math)](004-collision-plot/spec.md) | Done (baseline) |
| 005 | [SMTP check](005-smtp-check/spec.md) | Done (baseline) |
| 006 | [Handbook browser & search](006-handbook-browser/spec.md) | Done (baseline) |
| 007 | [D9bot chat (Gemini)](007-d9bot-chat/spec.md) | Done (baseline) |
| 008 | [Health checks & metrics](008-health-and-metrics/spec.md) | Done (baseline) |
| 009 | [Adduct: per-request logs and visible DB errors](009-adduct-log-isolation/spec.md) | Draft — P1 privacy |
| 010 | [Secure startup configuration](010-secure-startup-config/spec.md) | Draft — P1 security |
| 011 | [Consistent errors and input limits](011-consistent-errors-and-input-limits/spec.md) | Draft — P2 |
| 012 | [D9bot chat hardening](012-d9bot-chat-hardening/spec.md) | Draft — P2 |
| 013 | [SMTP check hardening](013-smtp-check-hardening/spec.md) | Draft — P3 |
| 014 | [Compound search: faster, bounded PubChem calls](014-compound-pubchem-hardening/spec.md) | Draft — P3 |
| 015 | [Liveness, readiness and dependency health](015-health-and-readiness/spec.md) | Draft — P2 |
| 016 | [Production deployment hardening](016-production-deployment-hardening/spec.md) | Draft — P1, needs approval |

Add a row here for every new spec.

### Baseline specs

Specs 001–008 document APIs that existed before SDD was introduced. They only
contain `spec.md` (no plan/tasks), describe the **current** behavior, and list
**Known gaps** found while writing them. Fixing a gap is a new change: either a
small bug fix, or a new spec that references the baseline spec.

## Folder layout

```
specs/
  README.md            # this file
  template/            # copy this for every new spec
    spec.md
    plan.md
    tasks.md
  001-<feature-name>/
    spec.md
    plan.md
    tasks.md
```
