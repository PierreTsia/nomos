# Nomos goes public: dedicated repo, public npm, built in public

Nomos has an app-agnostic heart (ADR 0002) designed to be shared, but it lives
inside a **private dashboard repository** and ships through a **private** registry
(ADR 0021). Its intended first external consumer, the **public** GymLogic repo,
has not adopted it yet and could not do so cleanly while the package stayed
private — the contradiction this ADR removes. Nomos gets its own public repo,
publishes to public npm, and is **built in public**; the private dashboard is its
first consumer, GymLogic the second.

This ADR **supersedes** ADR 0021 (private publication and the `@pierretsia/nomos`
scope) and **decision 3** of ADR 0017 (package scope). It **amends** ADR 0024 (the
0.x policy survives, but the "a public repo pins a private package" framing dies)
and **refines** ADR 0025 (the CSS and theme follow the heart, simply re-scoped).

## Decisions

1. **The channel: public npm (`npmjs.com`), scope `@nomosui/*`.** The package
   publishes publicly under an organisation scope `@nomosui` (npm org `@nomosui`). The
   unscoped npm name `nomos` stays unavailable — a third party holds a `0.0.0`
   placeholder there (ADR 0017, collisions). No more GitHub Packages, no more
   `read:packages`.

2. **The repo: `PierreTsia/nomos`, public.** Nomos lives in a repo of its own,
   under the GitHub account `PierreTsia` (no separate organisation — the same
   account as the private dashboard and GymLogic). The **repo root is the package**
   (the dashboard's design-system package is extracted as-is). The repo is
   public and built in public: CI, changesets, ADRs, roadmap and catalog all live
   there.

3. **MIT licence, English language.** The public repo is MIT. Its prose — README,
   ADRs, CONTRIBUTING, skill, commits — switches to **English**. The private
   dashboard's prose stays French; only the **Nomos** artifacts flip.

4. **The package name: `@nomosui/react`.** The name `nomos` (spelling, CSS prefix
   `--nomos-*`, MCP server `nomos`, `nomos://` URIs) does not move (ADR 0017). Only
   the **scope** changes: `@nomosui/react` replaces `@pierretsia/nomos` — this
   supersedes ADR 0017 decision 3 and ADR 0021 decision 2. The migration is
   **breaking** for both consumers (scope rename **and** registry change).

5. **First public version: `0.4.0`.** The contract still moves (the `ui://`/MCP is
   not typed by the SDK, ADR 0013/0019): Nomos stays on **0.x** (ADR 0024 decision
   4) and the first public version is a `0.4.0` carrying a **migration note**. The
   move to `1.0` stays governed by ADR 0024.

6. **Big-bang extraction, the dashboard dogfoods.** The extraction happens in one
   block: the code leaves, the private dashboard **deletes** its design-system
   package and the npm workspace, then consumes the **published** version. Imposed
   order: **publish publicly before** cutting the dashboard, since the dogfood
   consumes a published version. GymLogic then migrates the same way.

7. **Fresh history.** The public repo starts on a **fresh initial commit** — no
   history import (`git filter-repo`). The private history carries internal
   references (issue numbers, paths, the private reference design system) that a
   filter does not make safe: a clean history is the safe choice.

8. **What stays private.** The private dashboard, its internal ADRs and the
   **private reference design system** (ADR 0006) stay private and are never
   published. ADR 0006 and the private reference notes are rewritten, on the
   public side, as a "derived from a private reference, principles restated" ADR
   with no name and no internal link.

## Consequences

- The `AGENTS.md` rule "nothing leaves the private repo" is **amended**: it keeps
  its force for the private dashboard and its PRD, but **exempts the Nomos
  upstream** — Nomos is public, the dashboard and GymLogic are not. An idea about
  a third-party public repo is still described here, never written there.
- ADR 0021 is **superseded** (private publication, scope); ADR 0017 decision 3 is
  **superseded** (scope); ADR 0024 is **amended** (public semver replaces the
  private-package framing); ADR 0025 is **refined** (CSS and theme follow,
  re-scoped).
- The scope rename is **breaking**: it requires a migration note and a lockstep
  switch of the dashboard (first) and GymLogic (second).
- The ADR 0006 / private-reference conflict becomes a **leak risk**: it is a stop
  criterion before any publication (sealing the public repo).
- The private GitHub Packages distribution is **retired** once both consumers have
  migrated; no public surface (API, tokens, MCP, skill) changes, only its
  location.

## References

- ADR 0002 (shareable heart), 0006 (private reference design system), 0007 (the
  skill is a deliverable), 0013 / 0019 (`ui://` contract), 0017 (the name Nomos;
  **dec. 3 superseded**), 0021 (**superseded**), 0024 (public surface, amended),
  0025 (CSS and skin, refined).
