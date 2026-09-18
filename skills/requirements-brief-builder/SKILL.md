---
name: requirements-brief-builder
description: Optional intake stage before Gate A — synthesizes raw discovery material (kickoff notes, interviews, SOW, as-is docs, glossary) scattered across Confluence into one requirements brief, then has the BA resolve open questions before it's published as the workshop page.
---

# Requirements Brief Builder (pre-Gate-A intake)

Read `CLAUDE.md` at the repo root first.

Use this only when discovery material is **not** already one clean page — it's scattered across kickoff notes, stakeholder interview write-ups, scope/SOW/objectives, as-is process docs, a glossary, known constraints. If the engagement already has a single workshop page ready for review, skip this skill entirely and go straight to `confluence-workshop-req-review`.

This skill does **not** assign working IDs or touch `requirements-registry.json` — that's `confluence-workshop-req-review`'s job, run against whatever page this skill produces. Keeping that separation means Gate A always has exactly one place where IDs get minted, regardless of how many raw pages fed into the brief.

## Inputs

- The engagement slug (`engagements/<slug>/`) — ask if not given.
- `engagements/<slug>/connections.json` → `discoverySources` (a Confluence label or an explicit list of page URLs/IDs marking the raw material). If this field is missing, ask the user for the scope rule and write it into `connections.json` before continuing — don't guess which pages belong to the engagement.
- Whatever Confluence-capable tools are configured in this environment.

Treat every source page as read-only. The only Confluence write this skill makes is the new brief page itself, at the end.

## Step 1 — Ingest

Pull every page matching `discoverySources`. If a page links to children worth including (e.g. an as-is process doc with sub-pages), check descendants rather than assuming the top-level page is everything.

## Step 2 — Synthesize

Build the brief with these sections, drawing from across all source pages rather than one at a time:

- **Goals / business objectives** — what the engagement is trying to achieve.
- **Actors / roles** — who is involved and what each one does or needs.
- **Business rules** — constraints and policies the solution must respect.
- **Functional requirements** — what the system/process must do.
- **Non-functional requirements** — performance, security, compliance, availability, anything stated or clearly implied.
- **Assumptions** — anything inferred rather than found stated outright. Mark these explicitly; never blend them in as if the source material said them.
- **Open questions** — things the material simply doesn't answer.

For every item, note which source page it came from — this is what makes the brief traceable, even before formal working IDs exist.

## Step 3 — Validate with the BA

Present the draft brief in chat, open questions front and center. This is where the BA resolves what they can (possibly after checking with stakeholders) and tells you what to change. Iterate until they're satisfied — don't publish a brief that still has open questions the BA hasn't consciously decided to leave open.

## Step 4 — Publish and hand off

Once validated:

1. Publish the brief as a new Confluence page (ask where it should live if not obvious), titled clearly (e.g. "`<Engagement>` — Requirements Brief"), linking back to every source page it drew from.
2. Write the new page's ID/URL into `engagements/<slug>/connections.json` as `workshopPage`.
3. Commit the `connections.json` change to git.
4. Tell the BA the brief is ready and that the next step is running `confluence-workshop-req-review` against it (Gate A) — don't run that yourself as part of this skill; let the BA decide when.

## Guardrails

- Never present an inferred/assumed requirement as if it were explicitly stated in the source material.
- Don't skip the open-questions step to move faster — an unresolved open question is exactly the kind of gap this skill exists to surface.
- Don't edit the original source pages; only the new brief page is written, and only after validation.
- Don't assign working IDs or write `requirements-registry.json` here — leave that to Gate A.
