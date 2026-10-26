---
"@nomosui/react": patch
---

`Conversation`'s manifest **example** now carries real content: two `Message`
children and a height (`className="h-64"`). The viewport is `h-full`, so the previous
example (`{ label: 'Conversation' }`) rendered nothing — the `ui://nomos/conversation`
view and the catalogue preview were both empty.

The view entry no longer re-renders a **`client:false`** view on incoming host props:
such a view is a pre-rendered artefact (its example does not serialize), and a host
pushing `{}` used to wipe it — the empty view an MCP host showed for `Conversation` and
every other element-bearing example (`Table`, …). The reference host no longer fabricates
empty props either. No API change; the shipped view is regenerated.
