---
name: prototype-builder
description: Gate C of the pipeline — builds/updates a clickable React+Next.js prototype from selected JIRA stories, opens a pull request for developer review, and once merged records the Vercel deployment link back on each story.
---

# Prototype Builder (Gate C)

Read `CLAUDE.md` at the repo root first — it defines the stack decision (React + Next.js), the prototype code location convention, the stories registry, and why every code change lands via pull request rather than a direct commit.

This is the only skill in the toolkit that touches git, GitHub, and Vercel rather than Confluence/JIRA content. Check before starting that `git`, a GitHub CLI or token, and a Vercel CLI or token are actually available in this environment — if any is missing, say so plainly rather than failing partway through.

## Inputs

- The engagement slug (`engagements/<slug>/`) — ask if not given.
- `engagements/<slug>/stories-registry.json` — the candidate stories. Missing or empty → tell the user to run `requirements-to-backlog` first.
- `engagements/<slug>/connections.json` for `vercelProject` and `prototypeBranch` (create the branch name — `prototype/<slug>` — and save it here if this is the first run).
- Full story detail from JIRA for whichever stories are selected (Step 1) — the registry only holds IDs and links, not the acceptance criteria / FE / BE / data fields needed to actually build screens.

## Step 0 — Change detection

If `engagements/<slug>/.ba-agent-state.json` records a `prototypeBranch` commit SHA from a previous run, diff the current `stories-registry.json` and JIRA story content against what was last built. Flag: stories changed since their last build (`builtAtCommit` is stale), and stories newly marked active that aren't `inPrototype` yet. Let the BA decide which of these to include, rather than silently rebuilding everything.

## Step 1 — Select scope

List the candidate stories (active, not yet `inPrototype`, or flagged as changed above) and ask the BA which ones go into this round. Not every backlog story needs a screen — the PoC is a deliberately chosen subset for the demo, per `CLAUDE.md`. Record the selection before building anything.

## Step 2 — Scaffold or update the Next.js app

- If `engagements/<slug>/prototype/` doesn't exist yet, scaffold a minimal Next.js app there (App Router, a basic shared layout, no backend framework beyond Next's own API routes).
- For each selected story, fetch its full JIRA content and build or update the screen(s) it implies:
  - Frontend requirements → the actual page/component and its layout.
  - Backend requirements → a Next.js API route returning realistic mock data — never a real database, real client data, or invented business rules beyond what the story specifies.
  - Data requirements → the shape of the mock data the API route and the page agree on.
- Wire navigation so the acceptance criteria's main flow is actually clickable end to end (the button that should lead to the next screen, leads there).
- Reference the story's working ID(s) in a code comment at the top of each new file, so the code stays traceable back to `requirements-registry.json` the same way the JIRA ticket and Confluence section already are.

## Step 3 — Present the plan, then validate

Before pushing anything, show the BA (or developer, if one is reviewing alongside) what changed: which stories got screens, which routes were added/modified, and anything you couldn't fully implement from the story detail as written. Get confirmation before Step 4 — this covers the push, the PR, and the JIRA links together, since they're one unit of work.

## Step 4 — Push, open PR, and link JIRA (Gate C review, not yet merge)

1. Commit with a message referencing the story IDs/JIRA keys covered.
2. Push `prototypeBranch` to the toolkit repo.
3. Open a pull request into `main` (or the engagement's existing prototype PR, if one is already open — update it rather than opening a duplicate) with a description listing the JIRA keys and working IDs covered.
4. Add a comment or link field on each covered JIRA ticket pointing at the branch/PR.
5. Update `stories-registry.json`: set `inPrototype: true`, `prototypeRoute`, and `builtAtCommit` for each story just built.
6. Update `.ba-agent-state.json` with the new commit SHA.
7. Commit the registry/manifest changes to git.

The PR is the developer review gate — **do not merge it yourself**, regardless of how confident the diff looks. Merging is a human decision.

## Step 5 — After merge: record the public link

Once a human has merged the PR (check on request, or the next time this skill runs), Vercel's own GitHub integration deploys automatically from `vercelProject`'s configured root directory. This skill's job after that is only to fetch the resulting deployment URL and add it to each covered story's JIRA ticket (and, if the BA wants, the Confluence summary from `requirements-to-backlog`) — not to trigger the deploy itself.

## Guardrails

- Never merge the pull request — that's Gate C, and it's a human decision every time.
- Never write real client data, secrets, or invented business rules into the prototype; mock data only.
- Never claim the prototype is production-ready — it's for demonstrating flow and layout to the client.
- Never push directly to `main`.
- If git/GitHub/Vercel access isn't configured, say exactly what's missing rather than attempting a partial build.
