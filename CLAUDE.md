# BA Fast-Discovery Agent — Conventions

This file is the orchestrator's memory for every engagement run from this toolkit. Read it before running any skill.

## Purpose

Turn a short client discovery workshop into three things, in order: validated requirements, a dev-ready JIRA backlog, and a clickable frontend prototype the BA can show the client — with a human BA validating every write to Confluence/JIRA and a developer reviewing every code change before it merges.

## Pipeline (see skills/ for each stage)

1. `requirements-brief-builder` — synthesize raw discovery material into one requirements brief (only needed if the workshop material is scattered across multiple pages rather than one clean page).
2. `confluence-workshop-req-review` — analyze requirement quality (completeness, conflicts, gaps), get BA validation, update Confluence. **Gate A.**
3. `requirements-to-backlog` — turn validated requirements into user stories (Confluence) and epics/stories (JIRA), INVEST-checked. **Gate B** before anything is written to JIRA.
4. `jira-story-validation` — audit of *existing* JIRA stories against the same quality bar (used standalone, not part of the main pipeline).
5. `prototype-builder` — clickable frontend prototype from the approved stories, pushed to a branch, opened as a PR. **Gate C** (developer/BA review) before merge.
6. On merge, the prototype deploys to Vercel and the JIRA ticket gets the public link.

## Conventions

- **Working IDs.** Every requirement gets a working ID (`WS-1`, `WS-2`, …) the first time it's extracted from a Confluence page. Every user story and JIRA ticket must reference the working ID(s) it traces back to. Anything with no traceable source is labeled "no source — assumption" rather than silently included. IDs are not re-derived from scratch each run — they're persisted (see Requirements registry) so they stay stable across sessions and across skills.
- **Requirements registry.** `engagements/<engagement-slug>/requirements-registry.json` is the single source of truth for working IDs: an array of `{id, text, sourcePage, sourceVersion, status}`. Any skill that extracts or touches requirements reads this file first to reuse existing IDs, appends new ones instead of renumbering, and never deletes an ID — a superseded requirement gets `status: "superseded"`, not removal, so anything already referencing it (a story, a ticket, code) still resolves. Commit this file alongside the manifest whenever it changes.
- **Stories registry.** `engagements/<engagement-slug>/stories-registry.json` is the single source of truth for user stories built from the requirements registry: an array of `{storyId, title, requirementIds: [...], confluencePageId, confluenceAnchor, jiraKey, status, inPrototype, prototypeRoute, builtAtCommit}`. `requirements-to-backlog` creates entries and sets the first five fields; `prototype-builder` sets the last three (`inPrototype`, `prototypeRoute`, `builtAtCommit`) once a story gets a screen. `jira-story-validation` and `prototype-builder` read it to know which JIRA ticket, Confluence section, and (once built) prototype route a story lives at. Same append-and-supersede rule as the requirements registry — never delete an entry.
- **Engagement folder.** Each client engagement gets its own subfolder under `engagements/<engagement-slug>/`, holding: `connections.json` (which Confluence space, JIRA project, GitHub branch prefix, Vercel project — no secrets in this file, see Secrets below), `requirements-registry.json` (see above), `stories-registry.json` (see below), and `.ba-agent-state.json` (the version/timestamp manifest — see "Change detection"). `connections.json` also carries: `discoverySources` (a label or explicit list of page URLs identifying raw intake material, used by `requirements-brief-builder`); `workshopPage` (the single page `confluence-workshop-req-review` treats as the source of truth); `jiraDraftLabel` (the label applied to every issue this toolkit creates — default `ai-draft` if the engagement hasn't set one); `vercelProject` (the Vercel project name this engagement's prototype deploys to); and, once they exist, `userStoriesPage` (the Confluence page `requirements-to-backlog` writes user stories to) and `prototypeBranch` (the git branch `prototype-builder` works on, conventionally `prototype/<engagement-slug>`).
- **Secrets.** Confluence/JIRA/GitHub/Vercel credentials are never written into `engagements/*/connections.json` or committed anywhere. They're supplied as environment variables or through the MCP connectors already configured in the runtime. `connections.json` holds only identifiers (space key, project key, repo name, Vercel project name), never tokens.
- **Change detection.** Before doing anything, re-fetch the current Confluence page version(s) and JIRA `updated` timestamp(s) for this engagement and diff against `.ba-agent-state.json`. Mismatch → show the BA the specific delta and ask whether to resync before continuing. After any successful sync, update and commit the manifest. A BA can also name a specific changed item directly ("story ABC-12 changed") to skip the full diff.
- **Definition of Ready (default — override per engagement if the team has their own).** A story is Ready when it: traces to a working ID, follows the `As a / I want / so that` template, has Given/When/Then acceptance criteria covering the happy path and key edge cases, passes all six INVEST checks, and (when it implies a UI) names the frontend, backend, and data requirements separately.
- **Human gates are not optional.** No skill in this toolkit writes to Confluence or JIRA, or merges a pull request, without the BA (or, for code, a developer) explicitly approving that specific change in that session.
- **No invented estimates or priorities.** Story points, priority, and sprint assignment are left blank for the human team to fill in during grooming.
- **Prototype code location.** Each engagement's prototype is a Next.js app rooted at `engagements/<engagement-slug>/prototype/`, on its own branch (`prototypeBranch`). The corresponding Vercel project's "root directory" setting points at that path, so one toolkit repo can host every engagement's prototype without them colliding.
- **Not every story gets prototyped.** The PoC is a subset of the backlog picked for the demo, not the whole thing — `prototype-builder` asks which stories are in scope for a given round rather than building all active stories automatically.

## Glossary

- **Engagement** — one client discovery effort, with its own Confluence space, JIRA project, GitHub branch(es), and Vercel deployment.
- **PoC / prototype** — the clickable frontend built from the approved stories, shown to the client; not production code.
- **Gate** — a point where a human must explicitly approve before the agent proceeds.
- **INVEST** — Independent, Negotiable, Valuable, Estimable, Small, Testable — the quality bar for a story.
- **Working ID** — the `WS-n` reference tying a requirement, story, and ticket back to its source discussion.

## Stack decisions (fixed — see design spec for rationale)

- Frontend prototypes: React + Next.js, deployed to Vercel.
- Repository layout: one toolkit repo; engagements live as subfolders/branches within it (not separate repos, for now).
- Code changes land via pull request, never a direct commit to `main`.
