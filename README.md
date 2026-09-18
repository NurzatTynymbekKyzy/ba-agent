# BA Fast-Discovery Agent (skeleton)

A Claude Code toolkit for the "fast discovery" BA workflow: analyze a client workshop in Confluence, produce a validated dev-ready JIRA backlog, and hand the client a clickable prototype — with a human validating every write and every merge.

Skills are being ported in one at a time; see `skills/` for what's live so far.

## Layout

```
ba-fast-discovery-agent/
├── CLAUDE.md              # conventions, glossary, pipeline order, guardrails — read this first
├── skills/                # one folder per skill, each with its own SKILL.md
├── agents/                # subagent definitions (added as needed)
├── examples/              # golden examples used to calibrate skill output
└── engagements/           # one subfolder per client engagement (see below)
```

## Prerequisites

- Claude Code, run locally or wherever this repo is checked out.
- Access to the client's Confluence space and JIRA project (through the Atlassian connector already configured for the account running this).
- A GitHub token with push + PR access to this repo (for creating engagement branches and opening PRs) — see gotcha below on scoping it correctly.
- A Vercel account connected to this GitHub repo (for deploying the prototype once a PR merges) — see gotcha below on project settings.

None of these credentials are stored in this repo. See `CLAUDE.md` → Secrets.

## Starting a new engagement

1. Create `engagements/<engagement-slug>/`.
2. Add `connections.json` there with the Confluence space key, JIRA project key, and Vercel project name for this client (identifiers only, no tokens).
3. Run the pipeline skills in order — see `CLAUDE.md` → Pipeline.

## Known setup gotchas (learned from the first live run)

**GitHub fine-grained PAT.** Creating the token isn't enough by itself — two things have to both be set, and it's easy to miss the second:
1. Under "Repository access," the target repo has to actually be selected (if the repo didn't exist yet when the token was made, it won't be there — edit the token afterward to add it).
2. Under "Repository permissions," **Contents** and **Pull requests** both need to be set to **Read and write** explicitly. Leaving them at the default (no access / read-only) gives a confusing `403`/`Resource not accessible by personal access token` error on push or PR creation, even though the repo is correctly listed.

**Vercel project settings, in a monorepo.** Since each engagement's prototype lives in a subfolder (`engagements/<slug>/prototype/`, not the repo root — see `CLAUDE.md` → Prototype code location), two settings matter and Vercel doesn't always infer them correctly on first import:
1. **Root Directory** (Settings → General) must be set to `engagements/<slug>/prototype`.
2. **Framework Preset** must be explicitly **Next.js** — if it's left on "Other" (which can happen after changing Root Directory post-import), Vercel expects a static `public/` output directory instead of using Next's build output, and the deploy fails with `No Output Directory named "public" found` even though the Next.js build itself succeeded.

## Status

First full pipeline run completed end-to-end 2026-09-18 (`expense-app-test` engagement): Gate A (requirement review) → Gate B (backlog to Confluence + JIRA) → Gate C (prototype PR) → merged → deployed to Vercel, all against real Confluence/JIRA data. This validates the skill logic and gates, but not yet the "any BA, self-service" experience — see the design spec doc's open decisions for what's still ahead (onboarding flow, testing via an actual Claude Code session rather than manual execution, exercising change-detection on a second run, and running `jira-story-validation` against real tickets).
