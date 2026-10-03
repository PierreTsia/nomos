# The view speaks MCP Apps

ADR 0013 chose an in-house `ui://` contract because the MCP SDK (1.31) typed
nothing for MCP Apps: no `ui://`, no `text/html;profile=mcp-app`, no
`_meta.ui.resourceUri`. It wrote its own exit — *"the day the SDK decides, we
align — the component layer does not move."* MCP Apps is now a published
extension of MCP (SEP-1865, `ext-apps` 2.x), spoken by Claude, Claude Desktop,
VS Code Copilot, Goose, Postman and others. A real host does not speak
`source: 'nomos'`: a Nomos view rendered its fallback markup but never received
data and never sent an intention. We align.

## Decisions

1. **The view speaks JSON-RPC 2.0 over `postMessage`**, the dialect SEP-1865
   defines. `src/mcp/view/bridge.ts` opens the handshake (`ui/initialize`),
   announces readiness (`ui/notifications/initialized`), and adopts the host
   context (`hostContext.theme`, and Nomos' `density` as an extra field) on its
   **own** root.

2. **Data arrives as the tool result.** The host pushes
   `ui/notifications/tool-input` and `ui/notifications/tool-result`; the view
   reads `structuredContent.props` (else the JSON text block) and **re-renders**.
   ADR 0023 is unchanged: the view takes data, it mutates nothing.

3. **An intention reaches the host as a message.** The in-house
   `{ source, type: 'intent' }` has no standard equivalent; the standard channel
   for a view interaction is `ui/message`. `emitIntent` sends `{action, detail}`
   as the message text. The host decides what follows — the view still never
   mutates state.

4. **No `ext-apps` dependency.** The SDK is a convenience wrapper, not a
   requirement, and `ext-apps` 2.x pulls the `@modelcontextprotocol/*` 2.x tree
   while the server stays on SDK 1.31. The dialect is small; the bridge
   implements it directly and stays self-sufficient.

5. **The reference host migrates.** `reference-host.ts` answers the handshake,
   pushes the tool result and collects the messages — so the e2e proves the real
   dialect, not a private one.

## Consequences

- ADR 0013 is **superseded on the transport** (decisions 4 and 6): the component
  layer is untouched, but the literals `set-view` / `set-data` / the intent
  become JSON-RPC methods. The public message literals (ADR 0024) change:
  `surface.generated.json` moves in the same PR, with a changeset and a
  migration note.
- The MCP Apps extension capability (`io.modelcontextprotocol/ui`) is
  host-negotiated; the server already points each rendering tool at its view via
  `_meta.ui.resourceUri` (ADR 0013 dec. 2), so a conforming host finds it.
  Declaring the extension in the server's `initialize` capabilities waits for the
  SDK to type it.
- The pre-rendered markup stays the **no-JS fallback**: a host that does not speak
  the dialect still shows the example.

## References

ADR 0002 (app-agnostic), 0008 (density), 0013 (`ui://` contract, superseded on
the transport), 0019 (agentic contract v2), 0022 (skin), 0023 (views take data),
0024 (the public surface), 0026 (built in public), 0031 (composite scenes).
MCP Apps / SEP-1865: https://modelcontextprotocol.io/extensions/apps/overview
