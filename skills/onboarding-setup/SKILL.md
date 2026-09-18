---
name: onboarding-setup
description: Run once per machine and at the start of every new engagement — confirms Confluence/JIRA/GitHub/Vercel access already exists (never asks for secrets directly) and collects the per-engagement identifiers into connections.json before any pipeline skill runs.
---

# Onboarding & Access Setup

Read `CLAUDE.md` at the repo root first — it defines the `connections.json` fields this skill writes and the Secrets rule this skill exists to protect.

This is the entry point before running any pipeline skill: once per machine to confirm the underlying tools are authenticated, and once per new engagement to collect that engagement's identifiers. Its job is narrow on purpose — it never asks the BA to paste a token, key, or password into the conversation. Every credential is handled by that tool's own standard login flow, run by the BA on their own machine, outside this conversation entirely.

## Step 0 — Check environment-level access (one-time per machine, not per engagement)

Run each check and report status plainly. If a check fails, stop and hand the BA the exact command to fix it themselves — never substitute a pasted secret for a missing login:

- **Confluence + JIRA** — confirm the Atlassian connector/MCP is available in this environment. If not, tell the BA it needs to be connected first (however this environment's connector is normally set up) — this toolkit doesn't manage that connection itself.
- **GitHub** — run `gh auth status`. If not logged in, tell the BA to run `gh auth login` themselves (standard browser OAuth, one time per machine).
- **Vercel** — run `vercel whoami` (or `npx vercel whoami` if the CLI isn't installed globally). If not logged in, tell the BA to run `vercel login` themselves.
- **git** — confirm `git` is installed and this toolkit repo has a remote configured (`git remote -v`).

None of these four checks should ever involve the BA typing a secret into the chat with the agent. If an integration genuinely can't be reached this way in a given environment, say so plainly and stop — don't work around it by asking for a raw credential instead.

## Step 1 — Confirm repo write access

`git push --dry-run origin HEAD` is enough to confirm push access without actually pushing anything.

## Step 2 — Collect engagement identifiers

Once environment access is confirmed, ask for identifiers only — never secrets:

- Engagement slug (short, kebab-case — used as the folder name, e.g. `acme-onboarding-redesign`).
- Confluence space key (or a space name to look up via the Atlassian connector).
- JIRA project key — or ask whether to pick one from the BA's visible projects. Note: this toolkit has no way to create a new JIRA project, only use an existing one (see the design spec's open decisions).
- `jiraDraftLabel` — offer the default (`ai-draft`) and let the BA override it.
- Vercel project name, if it already exists — otherwise leave blank; `prototype-builder` usually sets this up after the prototype itself exists.
- The Confluence page(s) holding the raw discovery material (`discoverySources`) — a single page ID/URL, or a note that `requirements-brief-builder` will need to synthesize from multiple scattered pages first.

## Step 3 — Write connections.json

Create `engagements/<slug>/` if it doesn't exist yet, and write `connections.json` with exactly the fields above. Don't create `requirements-registry.json`, `stories-registry.json`, or `.ba-agent-state.json` here — each of those is owned by the skill that first needs it (see `CLAUDE.md` → Requirements registry / Stories registry / Change detection) and gets created on first use, not up front.

If `connections.json` already exists (re-running this on an existing engagement), update only the fields the BA asked to change — don't overwrite the rest.

## Step 4 — Point to the next step

Tell the BA what to run next: `requirements-brief-builder` if the discovery material is scattered across multiple Confluence pages, otherwise straight into `confluence-workshop-req-review` (Gate A).

## Guardrails

- Never ask the BA to paste a token, password, or API key into the conversation, for any of the four integrations. A failed check gets the BA the exact CLI command to run themselves — that's the only fix.
- Never store a credential value anywhere in this repo or in an engagement folder — `connections.json` holds identifiers only (see `CLAUDE.md` → Secrets).
- Don't invent a JIRA project or Confluence space if the BA doesn't have one ready.
- If an integration's access can't be verified in a given runtime (no shell, no CLI available, etc.), say so plainly rather than skipping the check silently.
