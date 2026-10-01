# Nomos distribution: private npm publication, scope `@pierretsia/nomos`

> **Superseded by ADR 0026.** Nomos now publishes to **public** npm, scope
> `@nomos/*`, from a dedicated public repo (`PierreTsia/nomos`). The private
> GitHub Packages registry and the `@pierretsia/nomos` scope are retired. Kept for
> the record.

The DS is designed to be **shared** (ADR 0002) and an adoption is underway on the
GymLogic side. But nothing distributes it: the package has neither `files` nor
publication, nothing installs its skill or wires its MCP server. We therefore open
distribution.

ADR 0002 and 0003 left publication **aside** ("nothing is published yet"), not
forbidden. ADR 0017 (decision 3) fixed the package **scope** to a host-product
scope. It is that decision that this ADR **supersedes**.

## Decisions

1. **The channel: GitHub Packages, a private npm registry.** The package publishes
   to GitHub Packages' npm registry, **privately**: nothing goes to public npm,
   nothing is written to a public repo. Publication runs in CI with
   `GITHUB_TOKEN`; a consumer authenticates with a `read:packages` token.

2. **The scope: `@pierretsia/nomos`.** GitHub Packages requires the npm scope to
   match the **owner of the publishing repo**. The repo belongs to `PierreTsia`,
   so the scope becomes `@pierretsia/nomos` — it **supersedes** the host-scoped
   package name of ADR 0017 (decision 3). The **name** stays `nomos`: spelling,
   internal aliases `@nomos` / `@nomos/derived`, CSS prefix `--nomos-*`, MCP
   server `nomos`, `nomos://` URIs — none of that moves (ADR 0017, decisions 1, 3,
   4, 5).

3. **What the package ships.** The heart, its tests, **its skill** (`SKILL.md`,
   ADR 0007) and its **MCP server** (stdio bin). A consumer installs the package
   and gets what it needs to render, to tell an agent which brick to take, and to
   wire the server.

4. **Boundary unchanged.** The distributed package remains the **app-agnostic
   heart**: no product vocabulary, no skin. An app's branding (ADR 0002's "skin")
   stays with the app, never in the published package.

## Consequences

- Imports move from the host-scoped name to `@pierretsia/nomos` (code,
  `package.json`, `package-lock.json`, `CONTEXT.md`, README, skill). The host
  product keeps its own name, not the package's.
- A future move to a neutral scope (`@nomos` as an org, or a dedicated registry)
  would be a **breaking** rename for consumers — that is the price accepted here.
- The "nothing is published" threshold falls: ADR 0002 / 0003 are **refined** (a
  private publication now exists), not contradicted.

## References

- ADR 0002 (shareable), 0003 (package), 0007 (the skill is a deliverable), 0017
  (the name Nomos; decision 3 on the scope, **superseded**).
- ADR 0026 (**supersedes** this ADR: public npm, scope `@nomos/*`, dedicated
  repo).
