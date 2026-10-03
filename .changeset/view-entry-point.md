---
"@nomosui/react": minor
---

The package exposes a **view entry point** and the **compiled utilities** (ADR 0034):

- `@nomosui/react/view` — `renderView({ name | composite, skin?, tokens? })` returns the
  self-sufficient `text/html;profile=mcp-app` document, plus `appViewUri`,
  `compositeViewUri`, `APP_VIEW_MIME` and `viewCss`;
- `@nomosui/react/view.css` — the compiled utility CSS, so no runtime Tailwind is needed.

The builder is pure (no filesystem) and inlines the core default tokens: it runs on a
server and on edge. `buildAppView` / `appViewFor` / `compositeViewFor` keep their internal
path; the public entry is the stable one.
