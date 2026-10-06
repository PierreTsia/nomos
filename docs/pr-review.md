# Merge gate — a traced review and QA before every merge

Nomos is built in public and a published npm version is immutable, so a merge is a release
decision. The rule:

> **No PR is merged without a traced review and a traced QA pass, both bound to the head
> commit.**

Two agents produce the trace, independently — run either alone, or both in parallel:

- **`@reviewer`** — reads the diff, the linked issue, the ADRs and the standards, runs the
  ponytail pass, and posts exactly one `## Reviewer report` comment whose first line is the
  marker, then applies the verdict label:
  `<!-- review sha=<headRefOid> verdict=approved|changes-requested|trivial -->` with
  `review:approved` / `review:changes-requested` / `review:trivial`.
- **`@qa`** — renders what the package actually ships (the `ui://nomos/<brick>` and composite
  views, an optional skin, the catalogue site) in a real Chromium, checks the no-JS fallback
  and the console, screenshots each step, and posts exactly one `## QA report` comment whose
  first line is the marker, then applies `qa:passed` / `qa:failed` / `qa:blocked`:
  `<!-- qa sha=<headRefOid> verdict=passed|failed|blocked -->`.

**The marker is bound to the SHA.** A push after a review invalidates it — the review and the
QA both have to be replayed on the new head. A marker on a stale commit is worth nothing.

## How it is enforced

- **`.github/workflows/pr-review-gate.yml`** fails a PR until both markers name the current
  head and both verdicts are green (`review:changes-requested`, `qa:failed`, `qa:blocked` all
  fail the job). It re-runs on push, on a label change, and on a new comment, so a replayed
  pass turns it back to green. Dependabot PRs are exempt (their own flow).
- **The `main` ruleset** requires a PR (squash only, linear history) and makes `verify`, `site`
  and `pr-review-gate` required checks that must be up to date: no direct push, no merge while
  a check is red, review threads resolved.
- The release path is unchanged: changesets open a *Version Packages* PR. Because that PR is
  opened by the bot's `GITHUB_TOKEN`, no CI runs on it and the required checks are never
  reported — it is merged through the ruleset's bypass. Treat it like any other: run `@reviewer`
  and `@qa`, check both markers, then use the bypass. `npm run release` still needs Pierre's
  explicit go-ahead.

## Merge-time check (root session)

Before any `gh pr merge`, confirm the gate is green — the two markers must carry the head SHA:

```sh
N=<pr>
SHA=$(gh pr view "$N" -R PierreTsia/nomos --json headRefOid --jq .headRefOid)
gh pr view "$N" -R PierreTsia/nomos --json comments --jq '.comments[].body' \
  | grep -F "<!-- review sha=$SHA verdict="
gh pr view "$N" -R PierreTsia/nomos --json comments --jq '.comments[].body' \
  | grep -F "<!-- qa sha=$SHA verdict="
gh pr view "$N" -R PierreTsia/nomos --json labels --jq '.labels[].name' \
  | grep -qE '^review:(approved|trivial)$'
gh pr view "$N" -R PierreTsia/nomos --json labels --jq '.labels[].name' \
  | grep -qxF 'qa:passed'
```

All must hold. The CI gate holds the same line, so a red `pr-review-gate` is the signal.

## Audit

The gate only constrains automations. The ruleset carries a bypass actor (RepositoryRole,
`bypass_mode: pull_request`): a holder of that role can still merge past a red check in the UI.
Re-list PRs merged without a marker on their head periodically — that is the only way to know
the rule was skirted. To close the escape, drop the `bypass_actors` entry from the ruleset
(`gh api repos/PierreTsia/nomos/rulesets/24503192`).
