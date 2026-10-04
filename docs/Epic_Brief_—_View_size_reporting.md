# Epic Brief — View size reporting

> Source: issue #105. Extends ADR 0033 (the view speaks MCP Apps). Tech Plan:
> `Tech_Plan_—_View_size_reporting.md`.

## Summary

A Nomos `ui://` view renders but is **clipped** in a real host: the MCP Apps
dialect (SEP-1865) gives a view a channel to report its own size
(`ui/notifications/size-changed`) so the host fits the frame, and the bridge
never sends it. The reference host cannot size the iframe either. The view is
self-contained and correct in its own page; it is the **host integration** that
breaks.

## Context & Problem

**Who is affected:** any real host (Claude, Claude Desktop, VS Code Copilot,
Goose, Postman) rendering a Nomos view; the reference host.

**Current state:**
- `src/mcp/view-contract.ts` declares the handshake, tool input/result, host
  context and intent — but no size method.
- `src/mcp/view/bridge.ts` installs the handshake and re-renders on data; it
  never measures the view.
- `src/mcp/reference-host.ts` answers the handshake and collects intents; it
  never grows the iframe.

**Pain points:**

| Pain | Impact |
|---|---|
| No size report | A host shows a default/clipped frame; content is cut off. |
| Reference host static | The e2e cannot prove the fix; no example for a host. |

## User Stories

1. As a **view**, I want to report my rendered size, so that a host fits me.
2. As a **view**, I want to report again when I resize, so that a re-render or a
   font load is not clipped.
3. As a **host implementer**, I want a reference that resizes on the
   notification, so that I can copy the pattern.
4. As an **agent**, I want the message contract documented, so that I know the
   host must handle it.

### Success measures

| Story # | Measure |
|---|---|
| 1 | the bridge posts `ui/notifications/size-changed` with the root's size after the handshake |
| 2 | a `ResizeObserver` (injected) re-reports on change; absent, the bridge still initial-reports |
| 3 | `reference-host.ts` handles the method and sets the iframe height; asserted in `app-view.test.ts` |
| 4 | `surface.generated.json` lists the literal |

## Scope

**In scope:**
1. `UI_SIZE_CHANGED` in `view-contract.ts`.
2. `reportSize` / `observeSize` in `bridge.ts`; report once after `initialized`,
   then on resize (injectable observer).
3. The reference host resizes the iframe on the notification.
4. Tests, `surface.generated.json`, `SKILL.md`, a changeset.

**Out of scope:**
- Choosing to measure the document vs the mount root: the **mount root** is the
  content the host must fit (ADR 0033's "own root").
- Width negotiation, scroll policy, `displayMode` changes — later.

## Success Criteria

- **Numeric:** `surface:check` green (the literal moves); `npm test` green.
- **Qualitative:** a view reports its size once ready and on resize; a host that
  speaks the dialect is no longer clipping by default; no new dependency.
