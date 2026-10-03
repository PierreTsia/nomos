---
"@nomosui/react": minor
---

Views now speak the standard **MCP Apps** dialect (JSON-RPC 2.0 over `postMessage`,
ADR 0033): the `ui/initialize` handshake, the tool result pushed as
`ui/notifications/tool-result`, and interactions sent as a `ui/message`.

**Migration note** — the in-house `ui://` message literals are gone:

- `set-view` becomes the `ui/initialize` host context (`hostContext.theme`,
  `hostContext.density`);
- `set-data` becomes `ui/notifications/tool-input` / `ui/notifications/tool-result`;
- `{ source: 'nomos', type: 'intent', action, detail }` becomes a `ui/message` request
  whose text is `{"action","detail"}`.

A host that does not speak MCP Apps still renders the pre-rendered fallback.
`reference-host.ts` migrated to the standard dialect.
