# The layout gallery is site-owned

ADR 0031 made the **composite scenes** public so that "the MCP server and the site
read the **same** source: one inventory, two renderings" (ADR 0005). The first slice
of the public site that would use them is the **layout gallery** (#41) — whole screens
a human browses and **copies**. The same source cannot serve that purpose: the site is
a faithful consumer of the **published** package (ADR 0028), which ships compiled
**JS**, not the composite **TSX**. So a composite can be **rendered** by the site, but
its **source cannot be shown**. The gallery's promise is copy-paste (#41: "browsable,
copy-paste examples of whole screens"); rendering the composites would leave the
gallery without the one thing it exists for.

## Decisions

1. **The layout gallery's scenes are site-owned.** They live in
   `site/src/examples/scenes/*.tsx`, are rendered by the site, and are shown in full,
   highlighted at build time by a Vite plugin that reads the file and runs Shiki
   (`site/plugins/nomos-snippets.ts`) — the snippet is the file that compiled, never
   dead. This **supersedes decision 1 of ADR 0031** for the gallery: the site does not
   read the composite source to build its gallery.

2. **The composites stay public and are unchanged.** `src/composites/` and its
   exports (ADR 0031 decisions 2-4) remain: an **app** may import and render a
   composite, and the MCP serves `ui://nomos/composite/*`. Only the **site's** use of
   the source changes; the JS surface and the agentic contract are untouched.

3. **The two are not expected to match, and that is the point.** A composite is a
   **view** that takes host props (ADR 0023) and is not copyable; a gallery scene is a
   **compilable example** that is. "One source, N renderings" (ADR 0005) holds **per
   artefact**: a composite is one source for the agent rendering, a scene one source
   for the human rendering and its snippet.

## Consequences

- A gallery snippet compiles in the site build (`site` CI): a scene that drifts from
  the bricks fails the build, not a snapshot.
- A composite and a gallery scene may look alike and are maintained separately; they
  may diverge. Accepted: they serve different consumers (an agent view that takes
  data vs a copy-paste example).
- ADR 0031 **decision 1 is superseded** (the site does not render the composite
  source for its gallery); its decisions 2-4 stand. The composites remain public
  precisely so that **consumers** (apps) can read them, not only the MCP.

## References

ADR 0002 (app-agnostic), 0005 (catalogue), 0019 (agentic contract v2), 0023 (views
take data), 0026 (built in public), 0028 (the site is an ancillary consumer), 0031
(composite scenes are public; **dec. 1 superseded**).
