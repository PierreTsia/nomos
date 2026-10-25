---
"@nomosui/react": patch
---

`Conversation`'s manifest **example** now carries real content: two `Message`
children and a height (`className="h-64"`). The viewport is `h-full`, so the previous
example (`{ label: 'Conversation' }`) rendered nothing — the `ui://nomos/conversation`
view and the catalogue preview were both empty. No API change; the shipped view is
regenerated.
