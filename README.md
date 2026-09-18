# BA Fast-Discovery Agent (skeleton)

A Claude Code toolkit for the "fast discovery" BA workflow: analyze a client workshop in Confluence, produce a validated dev-ready JIRA backlog, and hand the client a clickable prototype — with a human validating every write and every merge.

This is the **skeleton only** — folder structure and conventions. Skills are being ported in one at a time; see `skills/` for what's live so far.

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
- A GitHub token with push access to this repo (for creating engagement branches and opening PRs).
- A Vercel token (for deploying the prototype once a PR merges).

None of these credentials are stored in this repo. See `CLAUDE.md` → Secrets.

## Starting a new engagement

1. Create `engagements/<engagement-slug>/`.
2. Add `connections.json` there with the Confluence space key, JIRA project key, and Vercel project name for this client (identifiers only, no tokens).
3. Run the pipeline skills in order — see `CLAUDE.md` → Pipeline.

## Status

Skeleton created: 2026-09-18. Skills are ported one at a time and validated before the next is added — see the design spec doc for the full plan and open decisions.
