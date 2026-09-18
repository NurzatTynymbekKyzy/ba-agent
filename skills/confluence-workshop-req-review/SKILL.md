---
name: confluence-workshop-req-review
description: Gate A of the pipeline — analyze a Confluence workshop page's requirement quality (contradictions, completeness, missing items), validate findings with the BA, and update Confluence and the requirements registry only after approval.
---

# Confluence Workshop Requirements Review (Gate A)

Read `CLAUDE.md` at the repo root first — it defines the working-ID scheme, the requirements registry, the change-detection manifest, and the engagement folder layout this skill depends on.

This skill takes a workshop page (or a small set of related pages) and turns it into a quality-checked, ID-tagged set of requirements — the input every later pipeline stage builds on. It never writes to Confluence without the BA's explicit approval in that session.

## Inputs

- The engagement slug (`engagements/<slug>/`). If the user hasn't said which engagement, ask — don't guess.
- `engagements/<slug>/connections.json` for the Confluence space key and the workshop page ID/URL.
- Whatever Confluence-capable tools are configured in this environment (an Atlassian MCP server, `gh`-style CLI, or direct API calls) — check what's available before starting; don't assume a specific tool name.

## Step 0 — Change detection

Read `engagements/<slug>/.ba-agent-state.json` if it exists. Fetch the current version number of the workshop page and compare. No manifest yet → this is the first run, proceed to Step 1. Version matches → tell the user nothing changed since the last review and ask if they want to re-run anyway. Version differs → show the old vs. new version number and a summary of what changed before proceeding, so the BA isn't blindsided by re-analysis of a page they thought was already reviewed.

## Step 1 — Extract requirements

Read `engagements/<slug>/requirements-registry.json` if it exists, to see which working IDs are already assigned. Fetch the workshop page (and child pages if the discussion clearly continues there). For each requirement statement:

- If it matches something already in the registry (same content, same source location), reuse its existing ID.
- If it's new, assign the next `WS-n` ID.
- Note which section/heading it came from — that context matters for the analysis below.

Don't write the registry yet — that happens in Step 4, after validation.

## Step 2 — Run the four analyses

**a. Contradictions.** Compare requirements against each other for direct conflicts: different values/timings/rules for the same behavior, mutually exclusive statements, or a later statement that silently overrides an earlier one without saying so. Quote both statements and explain the conflict in one sentence.

**b. Conflict resolution.** For each contradiction, propose 1–2 resolution options grounded in the page's own stated business goals. Mark each as a likely typo/duplication (safe with BA sign-off) or a genuine business decision needing stakeholder input.

**c. Completeness (полнота требований).** Check coverage by category: actors/roles, functional flows (happy path + edge cases), business rules & validation, data requirements, non-functional requirements (performance, security, compliance, availability), error/exception handling, integration points, reporting/audit needs. For each category, say whether it's well covered, thin, or absent — with one concrete example, not just a label.

**d. Missing requirements.** List requirements implied by the discussion or stated goal but never written down. Explain why you inferred each one is needed.

## Step 3 — Present findings, then validate (Gate A)

Show the BA: the requirement list with working IDs, the contradictions table, the completeness scorecard, and the missing-requirements list. Ask them to confirm, edit, or reject each finding — batch the obvious ones, ask explicitly on anything marked as a genuine business decision. Nothing in Steps 4–5 happens until this is done.

## Step 4 — Update Confluence and the registry

Once validated:

1. Add a clearly labeled new section to the workshop page (e.g. "Requirements Review — `<date>`") via the Confluence update tool — don't silently rewrite existing requirement text unless the BA explicitly asked for an inline fix.
2. Write (create or update) `engagements/<slug>/requirements-registry.json` with the final, BA-approved set of `{id, text, sourcePage, sourceVersion, status: "active"}` entries. A requirement the BA rejected doesn't get an entry; one they edited gets the edited text under its ID.
3. Update `engagements/<slug>/.ba-agent-state.json` with the page's new version number.
4. Commit the registry and manifest changes to git with a message referencing the engagement and date (e.g. `git commit -m "<slug>: workshop review, WS-1..WS-12"`).
5. Confirm the Confluence update succeeded and share the page link.

Keep a short list of anything still flagged as a stakeholder decision — that's the BA's follow-up list for the next workshop.

## Guardrails

- Never call a Confluence write before the BA has validated findings in that session (per `CLAUDE.md` → Human gates).
- Never assign a new working ID to a requirement that already has one in the registry, and never delete a registry entry — supersede it instead.
- If the page has no real requirements content, say so rather than forcing an analysis.
- If asked to also build user stories or JIRA tickets, that's `requirements-to-backlog` — mention it rather than expanding scope here.
