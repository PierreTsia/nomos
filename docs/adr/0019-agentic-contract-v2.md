# The agentic contract, v2: scenes and resources

ADR 0013 set the `ui://` contract of a view: a self-sufficient document
(`text/html;profile=mcp-app`), a bridge that emits only **intentions**, a host
that sandboxes and arbitrates. v2 **extends** this surface without contradicting
it: it says what an agent now finds, and what the host keeps.

## What the agent finds

**Resources** (read-only):
- `nomos://tokens` — the flattened single source, one inventory per mode;
- `nomos://component/<name>` — a brick's **manifest** (props, variants, usages);
- `ui://nomos/<name>` — a brick's **view**;
- `ui://nomos/composite/<name>` — the **composite scene**: several bricks
  assembled.

**Tools**:
- `list_components` / `get_component` / `preview_component` — search, describe,
  obtain a brick's rendering recipe;
- `list_scenes` — list the scenes;
- `render_<name>` and `render_scene_<name>` — return the recipe and reference the
  view via `_meta.ui.resourceUri`, which the host renders.

Every tool follows the **template** (USAGE / INPUTS / OUTPUT / EXAMPLES): an agent
understands when to call it and what it receives without guessing.

## What the host arbitrates

- The view **never mutates** state: it emits `intent`s (`ready`, `select`,
  `change`, `error`); the host decides what follows. A heart component knows
  neither `postMessage` nor `ui://` (held by test).
- The host pushes **appearance** alone (`set-view`: theme, density), which the
  view sets as attributes on its **own** root.
- A **composite scene** is **pre-rendered** (static markup, `client:false`): it
  displays even without JS, and emits nothing until it is interactive.

## Consequences

- An agent can compose a screen: search a brick (`list_components`), describe it
  (`get_component`), assemble a view that makes sense (`list_scenes` →
  `render_scene_<name>`), or take a single brick's recipe (`render_<name>`).
- Adding a scene = one object in `mcp/composites.tsx`; the server, the tests and
  the e2e follow (one resource, two tools, one host rendering).

## References

- ADR 0003 (MCP server, read-only), ADR 0005 (catalogue), ADR 0013 (`ui://`
  contract v1).
