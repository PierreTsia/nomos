---
"@nomosui/react": patch
---

Dependency refresh. The published dependency ranges are unchanged — the existing `^`
ranges already allowed the newer patches, so `package.json` (and the core `dist`) is
untouched. What moves is the locked build: the MCP server bundles its dependencies, so the
shipped `nomos-mcp` binary now carries `@modelcontextprotocol/sdk` 1.32.x (plus newer
`@tanstack/react-table`, `lucide-react`, react-dom). No change to the public API.
