# Tech Plan — View size reporting

> Issue #105. Extends ADR 0033 (no new ADR: the dialect already owns the
> channel). Epic Brief: `Epic_Brief_—_View_size_reporting.md`.

## Diagnosis

SEP-1865 gives a view `ui/notifications/size-changed` to tell the host its size;
without it a host keeps its default frame and clips. `installViewBridge`
(`src/mcp/view/bridge.ts`) speaks the rest of the dialect but never measures.
The reference host (`reference-host.ts`) never resizes. `view-contract.ts` has
no constant for the method.

## Slices

### Slice 1 — the literal

`view-contract.ts`: `export const UI_SIZE_CHANGED = 'ui/notifications/size-changed'`.
`build-surface.ts` captures it automatically (regex `ui/…`), so regenerate
`surface.generated.json` (`build:surface`) — the act of documenting (ADR 0024).

### Slice 2 — measure and report (injectable)

`bridge.ts`:
- `reportSize(win, root)`: `root.getBoundingClientRect()` → `{ width, height }`
  (rounded up), posted as `ui/notifications/size-changed`. **The mount root is
  the content**, not the document.
- `observeSize(win, root, Observer?)`: `ResizeObserver` if present, injected for
  the test; returns a stop function; no-op when absent (jsdom).
- `installViewBridge`: after `ui/notifications/initialized`, `reportSize` once
  then `observeSize`. Order keeps the handshake messages first.

### Slice 3 — the reference host resizes

`reference-host.ts` `hostScript`: on `ui/notifications/size-changed`, set the
iframe's `height` from `message.params.height`. One example for a host, still no
dependency.

### Slice 4 — the net

`src/mcp/app-view.test.ts`: `reportSize` posts the rounded root size;
`observeSize` observes the root, re-reports on the observer callback, disconnects
on stop; `installViewBridge` reports after the handshake; the reference host
handles the method. `SKILL.md`: the view-dialect paragraph gains the size report.
Changeset (minor: the message surface grows).

## Verification

- `npm test` · `npm run lint` · `npm run typecheck`
- `npm run surface:check` (after `build:surface`)
- `npm run build:package` · `smoke:consumer` (the view still renders)

## Risks

| Risk | Mitigation |
|---|---|
| `ResizeObserver` absent (jsdom, old host) | Guarded; the initial report still lands. |
| Measurement loop (report → resize → report) | Report is a `postMessage`, not a reflow write; the host sets the frame, the view's root does not change size because of it. |
| Exact size semantics (border-box, ceil) | Documented in `reportSize`; a host clamps. |
