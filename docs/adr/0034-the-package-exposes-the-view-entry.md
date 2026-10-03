# The package exposes the view entry point and the compiled utilities

ADR 0025 opened distribution: the heart, the skill, the MCP server, the CSS
sub-exports and the theme functions (`resolveSkin`, `renderCss`,
`TokensDocument`). A consumer can derive the skin **values**, but it cannot
assemble a self-sufficient view document: `buildAppView` / `appViewFor` /
`compositeViewFor` and the compiled utilities (`VIEW_CSS`, ~52 KB) are
repo-internal, and `tokens/theme.css` is a `@source` Tailwind bridge the
**consumer's** build compiles — impossible at a server/edge runtime. An app that
wants to render a Nomos view in its own skin must reimplement the view pipeline,
duplicating Nomos and drifting (ADR 0022 dec. 4).

## Decisions

1. **A public view entry: `@nomosui/react/view`.** It exports
   `renderView({ name | composite, skin?, tokens? })`, which returns the
   self-sufficient `text/html;profile=mcp-app` document — markup, the skin's
   values, the heart's compiled utilities and the bundle — plus the view URIs and
   the MIME. The heart stays app-agnostic (ADR 0002): a brick or scene name and a
   token document.

2. **The builder is pure.** `src/mcp/app-view.ts` no longer reads a file; the
   core default is loaded by `@nomos/mcp/default-tokens` (server-only). The
   published entry **inlines** `tokens.json` at build, so `renderView` runs on a
   server **and on edge**, with no runtime Tailwind and no filesystem.

3. **The compiled utilities ship as a sub-export.** `@nomosui/react/view.css` →
   `view.generated.css`, rendered by `build:view-css` next to the TS constant. An
   app that only wants the CSS gets it without importing the builder.

4. **The snapshot and the smoke hold it.** `surface.generated.json` gains the
   `./view` entry's exports; `smoke:consumer` renders a view in a **distinct**
   skin and checks the skin's value, the utilities and the CSS resolve.
   `build:package` builds `dist/view.js` and its types, and its self-sufficiency
   check covers them.

## Consequences

- ADR 0025 is **extended**: the CSS and theme functions gain a view entry point
  and the compiled utilities. ADR 0024's surface now includes the `./view`
  exports and the `./view.css` sub-export.
- One pipeline, two renderings: the MCP server and an external consumer assemble
  the same document from the same source (ADR 0022 dec. 4). The heart gains no
  product vocabulary and no app state.
- No runtime dependency is added: the builder bundles its own React server
  renderer and the committed artefacts, like the MCP bin.

## References

ADR 0002 (app-agnostic), 0022 (skin, single source), 0024 (the public surface),
0025 (distribution exposes CSS and skin, extended here), 0026 (built in public),
0033 (the view speaks MCP Apps).
