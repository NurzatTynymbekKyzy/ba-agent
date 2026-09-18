---
name: requirements-to-backlog
description: Gate B of the pipeline — decomposes validated requirements into user stories written to Confluence, then mirrors them as epics/stories in JIRA under the engagement's landing rules, after BA approval.
---

# Requirements to Backlog (Gate B)

Read `CLAUDE.md` at the repo root first — it defines the working-ID scheme, the requirements/stories registries, the Definition of Ready, and the landing rules this skill applies.

Takes the requirements a BA has already validated (`requirements-registry.json`, entries with `status: "active"`, produced by `confluence-workshop-req-review`) and turns them into: (1) user story pages in Confluence, and (2) mirrored epics/stories in JIRA. This is for building a backlog from scratch. To audit stories that already exist in JIRA, use `jira-story-validation` instead — both check against the same quality bar.

## Inputs

- The engagement slug (`engagements/<slug>/`) — ask if not given.
- `engagements/<slug>/requirements-registry.json` — only `status: "active"` entries are in scope. Empty or missing → tell the user to run `confluence-workshop-req-review` first; don't decompose ungated requirements.
- `engagements/<slug>/connections.json` for the JIRA project key, `jiraDraftLabel`, and (once set) `userStoriesPage`.
- `engagements/<slug>/stories-registry.json` if it exists, to avoid re-creating stories that already exist and to know which registry entries are already covered.

## Step 1 — Decompose

Group active requirements into epics by business capability. Break each epic into user stories. Add sub-tasks only where a genuine spike or analysis task is needed — don't manufacture them. Every story must list the working ID(s) (`WS-n`) it traces to; anything you can't trace to an active requirement is flagged "no source — assumption" rather than included silently, per `CLAUDE.md`.

For each story, draft:

- **Statement** — "As a `<role>`, I want `<goal>`, so that `<benefit>`."
- **Pre-conditions** — what must be true before this story's flow starts.
- **Acceptance criteria** — Given/When/Then, covering the happy path and the meaningful edge cases.
- **Traceability** — the `WS-n` ID(s) it implements.
- **Frontend / backend / data requirements** — named separately, only where the underlying requirement actually implies each; don't pad a story with an empty "Data requirements: none" for the sake of a template.

## Step 2 — Quality-check

Score each story against all six INVEST criteria (Independent, Negotiable, Valuable, Estimable, Small, Testable), with a specific reason for any failure. Check for duplicate stories across the draft, and note dependencies between stories/epics the team will need to sequence around.

## Step 3 — Present the full draft for approval (Gate B)

Show the BA the complete draft: epics, stories with all fields from Step 1, INVEST verdicts, flagged duplicates/dependencies, and anything marked "no source." This single approval covers both writes that follow — Confluence and JIRA — since they carry the same content in two formats. Nothing in Steps 4–5 happens before this approval.

## Step 4 — Publish to Confluence

Write (create or update) the user stories page — `userStoriesPage` in `connections.json` if it's already set, otherwise create it and save its ID there. One section per story, in the format from Step 1. Commit the `connections.json` change if it was just created.

## Step 5 — Publish to JIRA

Create the epics/stories/sub-tasks in the target project, applying the landing rules:

- `jiraDraftLabel` on every issue (default `ai-draft`).
- A link back to the specific section/anchor of the Confluence user-stories page on every issue.
- Whatever draft/initial status the project's workflow actually offers — if there's no clear "draft" state, say so and ask rather than guessing one or forcing a transition.
- No estimates, story points, or priorities (per `CLAUDE.md`) — leave those fields for grooming.

## Step 6 — Update registries and trace back

1. Write/update `engagements/<slug>/stories-registry.json` with one entry per story: `{storyId, title, requirementIds, confluencePageId, confluenceAnchor, jiraKey, status: "active"}`.
2. Update the corresponding `requirements-registry.json` entries to note which story now covers them (so a future run doesn't re-decompose an already-covered requirement).
3. Commit both registries to git.
4. Compile a short summary (JIRA issue keys, titles, links) and, with the BA's confirmation, append it to the workshop/brief page in Confluence — closing the loop back to where the requirements came from.

## Guardrails

- Never write to Confluence or JIRA before the BA has approved the draft in that session (per `CLAUDE.md` → Human gates).
- Never set estimates, story points, or priorities.
- If the JIRA project has no established draft-label or status convention, ask rather than inventing one.
- If asked to also audit stories that already exist, mention `jira-story-validation` instead of redoing that work here.
