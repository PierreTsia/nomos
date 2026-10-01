# The public surface of Nomos

Nomos is aimed at an external consumer (GymLogic, a **public** repo): it would
pin a version of a **private** package. A surface change could therefore break it
without warning. Yet "breaking" was undefined — several surfaces coexist, and
nothing said which were protected.

## Decisions

1. **What is public** (a consumer may depend on it):
   - **the JS API** — everything `src/index.ts` exports (components, props,
     types);
   - **the token interface** — the **names** of semantic slots (`--nomos-*`), the
     modes, the densities (ADR 0003, 0022);
   - **the MCP contract** — the tool names, the URIs (`ui://nomos/…`,
     `nomos://component/…`, `nomos://tokens`), the message literals (`set-view`,
     `set-data`, the intentions) (ADR 0013, 0019, 0023);
   - **the skill** shipped with the package (ADR 0007).

2. **What is internal**: the `@nomos/*` and `@nomos/derived/*` aliases, the source
   sub-paths (`src/**`), the generated artefacts (`*.generated.*`). A consumer does
   not touch them; we may change them freely.

3. **The surface is frozen by a snapshot.** `surface.generated.json` +
   `surface:check` (CI) fail on any drift: a public surface **cannot** be changed
   without editing the snapshot **in the same PR** (the act of documenting).

4. **0.x policy.** As long as the contract moves (the `ui://`/MCP is not typed by
   the SDK, ADR 0013), Nomos stays on **0.x**: a breaking change is a **minor**
   accompanied by a **migration note**. We freeze **1.0** when a real consumer
   depends on the contract in production; from then on, a breaking change is a
   **major**.

5. **Every release goes through a changeset** (a mandatory note), and a
   **published version is immutable** — a tag is neither moved nor reused.

## Consequences

- The snapshot and the changesets protect the listed surfaces; this ADR says
  **what they protect**. The consumer smoke test proves a consumer actually gets
  them.
- A change to the export list, a tool/URI name, a message literal or a token slot
  is a **breaking** change: it fails the snapshot and requires a written
  changeset.

## References

ADR 0002 (app-agnostic), 0003 (theme interface), 0007 (skills), 0013 / 0019
(`ui://` contract), 0022 (skin), 0023 (data).
