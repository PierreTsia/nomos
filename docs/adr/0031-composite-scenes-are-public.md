# Composite scenes are public

The **composite scenes** (ADR 0019) — several bricks assembled into a screen that
makes sense (a form, a status card, an overlay) — lived in `src/mcp/composites.tsx`
and were served **only** as MCP views (`ui://nomos/composite/<name>`). The public
site wants to render the **same** source (a layout gallery, a "in situation"
section): one inventory, N renderings (ADR 0005). Keeping the scenes private to the
MCP server would force the site to re-implement them, and the two copies would
drift.

## Decisions

1. **The composite scenes join the public JS surface.** They move to
   `src/composites/` and `src/index.ts` exports `composites`, `compositeNames`,
   `findComposite` and the `Composite` type. The MCP server and the site read the
   **same** source: one inventory, two renderings.

2. **They stay app-agnostic** (ADR 0002). Their default copy is neutral, in
   English, and names no product; the copy is **injectable by props**, so an app
   passes its own localised strings. A scene that needs a product word to explain
   itself belongs to the app, not to the core.

3. **The surface snapshot is edited in the same PR** (ADR 0024). Adding exports
   changes `surface.generated.json`; `surface:check` fails until the snapshot is
   regenerated and committed alongside.

4. **The MCP contract is unchanged.** The `ui://nomos/composite/*` URIs, the
   `list_scenes` tool and the `render_scene_<name>` tools keep their names and
   literals (ADR 0019). This ADR only widens the JS surface; it does not touch the
   agentic contract.

## Consequences

- A consumer may import a scene and render it directly; the site no longer needs a
  private copy.
- A change to a scene's name, title, summary or default copy is a **surface**
  change: it fails the snapshot and needs a written changeset (ADR 0024).
- The scenes remain **renders**, not catalogued components: they carry no manifest
  and no registry entry (ADR 0005).

## References

ADR 0002 (app-agnostic), 0005 (catalogue), 0019 (agentic contract v2), 0024 (the
public surface), 0026 (built in public).
