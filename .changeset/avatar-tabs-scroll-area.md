---
"@nomosui/react": minor
---

Add and catalog `Avatar`, `Tabs` and `ScrollArea` (issue #18, ADR 0005 / 0019).

- **`Avatar` has no new dependency**: the native `<img>` + `onError` cover image
  and fallback, so `@radix-ui/react-avatar` is not needed (ADR 0002: impose no
  dependency). `src/components/avatar/` ships a `useState` fallback; the `alt`,
  the fallback node and the classes come from the app.
- **`Tabs`** uses the new `@radix-ui/react-tabs`
  (`Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`).
- **`ScrollArea`** uses the new `@radix-ui/react-scroll-area` (`ScrollArea`,
  `ScrollBar`); purely cosmetic, the native scroll stays.
- `package-lock.json` is replayed so `npm ci` is reproducible.
- Each brick gets its hand-written manifest and a colocated test; the registry
  and `src/index.ts` expose them, so `render_avatar` / `render_tabs` /
  `render_scroll-area`, their resources and views follow with no MCP file
  written.
- `surface.generated.json` and the view CSS/bundle are replayed; the SKILL
  inventory + prose follow.
