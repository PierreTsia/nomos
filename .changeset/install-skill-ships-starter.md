---
"@nomosui/react": patch
---

`nomos-skill` now installs `templates/starter` beside `SKILL.md`, so the bootstrapper recipe
(ADR 0038) finds the app skeleton on disk. The whole starter is copied without its
dependencies; the host installs them.
