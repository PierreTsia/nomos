# Components of the DS rendered in conversation follow an in-house `ui://` contract

The design system must be able to be rendered **in an agent's conversation**, not
only described. MCP Apps is an emerging contract: at the date of this decision,
the MCP SDK (1.31) exposes **nothing** for it — no `ui://`, `mcp-app` or
`_meta.ui.resourceUri` is typed. We therefore have no model to follow: we define
our own contract, as small as possible, and document it so that a host can
implement it.

## Decisions

1. **A view is an MCP resource.** A rendered component is served by a resource
   `ui://nomos/<name>`, of type `text/html;profile=mcp-app`, one per catalogue
   component. The document is **self-sufficient**: the markup (rendered
   server-side by `react-dom/server`), the inline token CSS, and the bridge.

2. **The tool points to its view via `_meta.ui.resourceUri`.** Each rendered
   component has its tool `render_<name>`, whose `_meta` carries
   `ui.resourceUri: 'ui://nomos/<name>'`. A host that understands `_meta.ui`
   knows it must render this resource in an iframe.

3. **The host sandboxes.** The view renders in a `sandbox="allow-scripts"` iframe
   (never `allow-same-origin`): the markup and the bridge can neither read the
   host document nor write into it. The reference host (`reference-host.ts`) is
   the minimal form of this contract.

4. **The view emits intentions, it never mutates state.** The bridge only posts
   messages `{ source, type: 'intent', action, detail }` to the parent. It
   receives messages `{ source, type: 'set-view', theme?, density? }` and only
   sets attributes — **no ordinal is a mutation order**, the host decides.

5. **Theme and density are set on the view root**, not on `:root`: the markup
   lives in `#nomos-view[data-theme][data-density]`, as a scopable embedded
   rendering (ADR 0008, ADR 0009).

6. **No heart component touches an extension API.** Neither `postMessage`, nor
   `window.parent`, nor `ui://` in `src/components/`: the bridge is thin,
   replaceable, and lives in `src/mcp/app-view.ts`. A test holds it.

## Consequences

- The **client** rendering of a component in the iframe (real React interaction)
  requires shipping a bundle: that is a later slice, not this one. Here the view
  is pre-rendered; the bridge is enough to prove the mechanism and the
  three-context constraint.
- The `ui://` contract is ours as long as MCP Apps is not typed. The day the SDK
  decides, we align — the component layer does not move.
