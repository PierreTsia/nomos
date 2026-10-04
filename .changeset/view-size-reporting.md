---
"@nomosui/react": minor
---

Views report their own size to the host (MCP Apps / SEP-1865, extending ADR 0033):

- `ui/notifications/size-changed` is now part of the view message contract
  (`UI_SIZE_CHANGED`);
- the bridge measures its **mount root** once the handshake completes and re-reports on
  resize (a guarded `ResizeObserver`, injectable for tests), so a conforming host is no
  longer clipping the view;
- `reference-host.ts` resizes its iframe on the notification — the pattern a host copies.

**Migration note** — additive: a host that ignores the method keeps working; the previous
message literals are unchanged.
