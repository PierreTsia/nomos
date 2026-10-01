---
'@pierretsia/nomos': minor
---

Drop the host-app references from the public contracts: the DTCG `$extensions` vendor key
moves from `org.agent-os` to `org.nomos`, and the MCP view DOM ids move from `agent-os-view`
/ `agent-os-view-data` to `nomos-view` / `nomos-view-data` (the reference host frame id
follows). A consumer reading `$extensions` in `tokens.json`, or targeting those ids, must
update. The file names and the token/API/MCP shapes are otherwise unchanged.
