# Roadmap

Nomos is on the **0.x** line: the contract still moves (the `ui://`/MCP is not typed by
the SDK, ADR 0013/0019), a breaking change is a **minor** with a migration note, and
**1.0 is frozen only when a real consumer depends on the contract in production**
(ADR 0024, dec. 4). This roadmap names the two milestones that take Nomos from where it
is to a frozen public face — and past it, the north star.

## v1.0 — The public face: a static site and the docs

A human can discover, understand and copy Nomos **without running the MCP**.

- **A static site**, built and published from this repo (built in public, ADR 0026).
- **Docs**: getting started (install, tokens, theme/skin), the boundary rule, the
  contributing flow — the README and the ADRs made navigable.
- **A component showcase**: every catalogued brick, rendering its own **manifest**
  (props, variants, usages) — the same inventory as the MCP, a third rendering beside
  the style page and the server (ADR 0005).
- **Layout examples**: whole screens assembled from the primitives — the **composite
  scenes** of ADR 0019 promoted to a gallery a human browses.

**Exit criteria**: the site is **generated from the catalogue**, never hand-maintained —
one inventory, several renderings, held by the existing coherence tests so no page can
rot. The `1.0` **version stamp** stays governed by ADR 0024, dec. 4.

## v2.0 — The north star: a starter template and a skill

An agent scaffolds a **whole application built on Nomos** from a prompt — by
**copying a starter and following a recipe**, not by running a generator.

- **A starter template** (`templates/starter`): a runnable, three-page Nomos app —
  a shell, a router, a list with `FacetedDataTable`, a form, and a **skin** (the
  token overlay the app owns, ADR 0022) it derives its CSS from. An ancillary of
  the repo (ADR 0028), shipped in the tarball so an adopter and the host agent
  receive it.
- **A bootstrapper recipe in the skill**: prompt → scaffold → bricks → skin → run.
  The host agent orchestrates; Nomos ships the material, not a runtime.
- **The existing read-only MCP** is the authoritative catalogue the agent consults
  to pick bricks — unchanged, no new tool or URI (ADR 0013, 0024).

**No generator enters the package.** There is no LLM client, no API call, no brief
parser, no app emitter in the heart; the orchestrator is the host agent, not Nomos
(ADR 0038). The north star hands an agent the **house** — and it stays
app-agnostic while doing it.

**Non-goal**: Nomos stays **app-agnostic**. The starter imports Nomos; app state,
i18n, router, layout and data never enter the heart (ADR 0002, 0038).

## References

ADR 0002 (app-agnostic core), 0005 (catalogue), 0006 (unnamed reference), 0013 / 0019
(the MCP contract), 0022 (skin), 0024 (public surface and the 1.0 policy), 0026 (built
in public), 0028 (repo ancillaries), 0038 (the bootstrapper is a template and a skill).
