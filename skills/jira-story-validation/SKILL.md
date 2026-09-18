---
name: jira-story-validation
description: Standalone audit of JIRA stories that already exist — traceability to the requirements registry, story template, INVEST, frontend+backend+UI completeness, and acceptance criteria — with BA/dev validation before any JIRA write.
---

# JIRA Story Validation

Read `CLAUDE.md` at the repo root first — it defines the working-ID scheme, the requirements registry, and the Definition of Ready this skill checks against.

This is a standalone audit, not part of the main pipeline gates (A/B/C in `CLAUDE.md`). It's for checking stories that **already exist** in JIRA — a legacy backlog, stories written by someone else, or a spot-check before a sprint. To build a backlog from scratch out of an approved requirements brief or workshop page, use `requirements-to-backlog` instead; both skills check stories against the same quality bar, so a story that passes one would pass the other.

## Inputs

- The engagement slug (`engagements/<slug>/`) — ask if not given.
- `engagements/<slug>/connections.json` for the JIRA project key.
- `engagements/<slug>/requirements-registry.json` for the working IDs to trace stories against. Missing or empty registry → say so; traceability checks degrade to "no registry to check against" rather than silently passing every story.
- Scope from the user: specific story keys, an epic, a sprint, or a JQL filter.
- If the team has its own story template or Definition of Ready that differs from `CLAUDE.md`'s default, ask once up front and use theirs instead.

## Step 1 — Pull the stories and the registry

Fetch full story content (description, acceptance criteria field if separate, linked issues, labels) for everything in scope. Load the requirements registry to trace against.

## Step 2 — Run the checks, per story

**a. Traceability.** Does the story reference a working ID from the registry (in its description or a linked issue)? Flag stories with no clear traceability, and registry entries with `status: "active"` that no story covers.

**b. Story template.** Does the description follow "As a `<role>`, I want `<goal>`, so that `<benefit>`" (or the team's own template), with required fields (priority, component) not empty?

**c. INVEST.** Score against all six — Independent, Negotiable, Valuable, Estimable, Small, Testable — with a specific reason for any failure (e.g. "not Small — bundles both the search UI and the export feature").

**d. Technical completeness (FE + BE + data).** Does the story address frontend, backend, and data requirements separately where the underlying requirement needs all three — either in the story itself or via linked subtasks? Flag stories covering only some of what's needed.

**e. UI details.** Where a UI is involved, does the story reference concrete detail — mockup/prototype link, screen states, field-level behavior — rather than "build the screen"?

**f. Acceptance criteria.** Do AC exist, in Given/When/Then or an equivalent testable form, covering the happy path plus meaningful edge cases?

## Step 3 — Present findings, then validate

Compile a per-story (or table, if many) report: traceability, template/INVEST verdicts, FE/BE/data coverage, UI detail gaps, AC gaps — each with the specific fix suggested, not just a pass/fail label. Get the BA's (or developer's) confirmation before touching JIRA. Batch straightforward fixes (e.g. a missing AC bullet you drafted); ask explicitly before touching scope, estimates, or anything that changes what the story commits to.

## Step 4 — Update JIRA only after validation

Update the fields approved (description, acceptance criteria) or leave a review comment, per what the user wants written where. Never transition a story's status as part of this skill unless explicitly asked. Confirm each update and share the issue link(s).

## Guardrails

- Never write to JIRA before validation in that session (per `CLAUDE.md` → Human gates).
- A story missing entirely for an active registry entry is a gap to report, not something to create yourself unless asked.
- Never invent estimates, priorities, or story points (per `CLAUDE.md`).
- If asked to also review Confluence requirements or build new stories from scratch, mention `confluence-workshop-req-review` / `requirements-to-backlog` rather than expanding scope here.
