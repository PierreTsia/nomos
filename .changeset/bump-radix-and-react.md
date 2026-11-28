---
"@nomosui/react": patch
---

Bump the Radix primitives (`@radix-ui/react-accordion`, `@radix-ui/react-radio-group`) and
`react` / `react-dom` to 19.3.1 — the two React packages must move together, React refuses a
mismatched pair. The pre-rendered `ui://` view is replayed in the same change; no API change.
