# @nomosui/react

## 0.5.1

### Patch Changes

- 9450a83: Bump the internal `lucide-react` icon dependency to `^1.49.0`, and replay the generated MCP view. Lucide is an internal detail — it is not re-exported — so no public API, token or MCP contract changes.

## 0.5.0

### Minor Changes

- c7f4ff9: Add and catalog `AlertDialog` (issue #17, ADR 0005 / 0019).
  
  - New dependency `@radix-ui/react-alert-dialog`; `package-lock.json` is replayed
    so `npm ci` is reproducible.
  - `src/components/alert-dialog/`: the component (parts `AlertDialog`,
    `AlertDialogTrigger`, `AlertDialogContent`, `AlertDialogOverlay`,
    `AlertDialogPortal`, `AlertDialogHeader`, `AlertDialogFooter`,
    `AlertDialogTitle`, `AlertDialogDescription`, `AlertDialogAction`,
    `AlertDialogCancel`), its hand-written manifest and a colocated test; the
    registry and `src/index.ts` expose them, so `render_alert-dialog`,
    `nomos://component/alert-dialog` and `ui://nomos/alert-dialog` follow with no
    MCP file written.
  - The scrim and the layer read the ADR 0027 tokens (`z-overlay`, `bg-scrim`,
    `animate-overlay-in/out`, `animate-content-in/out`): no hard-coded value.
  - `surface.generated.json` and the view CSS/bundle are replayed; the SKILL
    inventory + prose follow.
- e01360a: Add and catalog `Avatar`, `Tabs` and `ScrollArea` (issue #18, ADR 0005 / 0019).
  
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
- 70b0559: Add and catalog `Collapsible`, then `Accordion` (issue #16, ADR 0005 / 0019).
  
  - New dependencies `@radix-ui/react-collapsible` and
    `@radix-ui/react-accordion` (the second depends on the first);
    `package-lock.json` is replayed so `npm ci` is reproducible.
  - `src/components/collapsible/` (`Collapsible`, `CollapsibleTrigger`,
    `CollapsibleContent`) and `src/components/accordion/` (`Accordion`,
    `AccordionItem`, `AccordionHeader`, `AccordionTrigger`, `AccordionContent`),
    each with its hand-written manifest and a colocated test; the registry and
    `src/index.ts` expose both, so `render_collapsible` / `render_accordion`,
    their resources and views follow with no MCP file written.
  - The height reveal reads the ADR 0027 motion decision: `tokens/theme.css` gains
    `animate-collapse-down/up`, driven by the motion tokens and the height Radix
    measures (`--nomos-collapse-height`), with the reduced-motion reset extended.
  - `Accordion`'s `type` (`single` / `multiple`) is a documented variant.
  - `surface.generated.json` and the view CSS/bundle are replayed; the SKILL
    inventory + prose follow.
- e4e51ba: Catalog `Dialog` end to end (issue #10, ADR 0005 / 0019): a centred modal on a
  scrim.
  
  - `src/components/dialog/` ships the component (`DialogProps`), its hand-written
    manifest, and a colocated test; it joins the registry, `src/index.ts` and the
    MCP catalogue, so `list_components`, `get_component { name: "dialog" }`,
    `preview_component`, the resource `nomos://component/dialog` and the view
    `ui://nomos/dialog` follow with **no MCP file written**.
  - The floating layer reads the ADR 0027 tokens (`z-overlay`, `bg-scrim`,
    `animate-overlay-in/out`, `animate-content-in/out`) — no hard-coded layer,
    veil or animation.
  - `coherence.test.ts` now unmounts with `cleanup()` instead of clearing
    `document.body`, so a component that renders into a portal is verified
    correctly (the first such component is `Dialog`).
  - `surface.generated.json` and the view CSS/bundle are replayed.
  
  `Dialog` is a convenience surface (trigger, title, description, body, footer,
  `closeLabel`, `open`/`defaultOpen`/`onOpenChange`); the sub-parts stay an
  internal detail for now. No existing export, tool or prop changes.
- e9d594a: Catalog `DropdownMenu` (issue #12, ADR 0005 / 0019) — no new dependency.
  
  - `src/internal/dropdown-menu.tsx` becomes `src/components/dropdown-menu/`,
    catalogued: the registry entry and `src/index.ts` expose every part
    (`DropdownMenu`, `Trigger`, `Content`, `Item`, `CheckboxItem`, `RadioItem`,
    `RadioGroup`, `Label`, `Separator`, `Shortcut`, `Group`, `Portal`, `Sub`,
    `SubTrigger`, `SubContent`) plus the manifest, so `render_dropdown-menu`,
    `nomos://component/dropdown-menu` and `ui://nomos/dropdown-menu` follow with no
    MCP file written.
  - The floating menu reads the ADR 0027 tokens (`z-popover`,
    `animate-content-in/out`): no `z-50` in hard copy.
  - `facet-filter` and `data-table-toolbar` now import the parts from their new
    home.
  - `surface.generated.json` and the view CSS/bundle are replayed; the SKILL
    inventory + prose follow.
  
  **Migration.** `@nomos/internal/dropdown-menu` is gone; import the parts from
  `@nomos/components/dropdown-menu/dropdown-menu` (or from the package root). No
  prop, token name or MCP tool is renamed.
- 8d372e4: Overlay foundation (ADR 0027): the floating layer reads its layering, its veil
  and its motion from tokens.
  
  - New semantic slots: `z.{overlay,popover,tooltip,toast}`,
    `color.scrim`, and `motion.duration.{fast,base,slow}` /
    `motion.ease.{standard,in,out}`. They appear in `tokens.generated.css`, in the
    `nomos://tokens` resource, and therefore in `surface.generated.json`.
  - `tokens/theme.css` gains `--color-scrim`, the `z-*` utilities and hand-written
    overlay animations (`animate-overlay-in/out`, `animate-content-in/out`,
    `animate-slide-in/out-{right,left,top,bottom}`) driven by the motion tokens,
    plus a `prefers-reduced-motion` reset. No new dependency.
  
  **Migration.** A consumer that imported the internal `Sheet`, `Select`,
  `DropdownMenu` or `Tooltip`, or the toast feature, must **re-import the updated
  `@nomosui/react/tokens/theme.css`** (or regenerate its CSS from the skin): the
  `z-50` / `bg-black/80` / `animate-in…` classes those components carried are
  replaced by `z-*` / `bg-scrim` / the new animations. The previous animation
  classes came from no installed plugin and were already inert in views. No JS
  export, MCP tool or component prop changes.
- 15fed2c: Add and catalog `Popover` (issue #15, ADR 0005 / 0019).
  
  - New dependency `@radix-ui/react-popover` (light, the same family as the other
    atoms); `package-lock.json` is replayed so `npm ci` is reproducible.
  - `src/components/popover/`: the component (parts `Popover`, `PopoverTrigger`,
    `PopoverContent`, `PopoverAnchor`), its hand-written manifest and a colocated
    test; the registry and `src/index.ts` expose them, so `render_popover`,
    `nomos://component/popover` and `ui://nomos/popover` follow with no MCP file
    written.
  - The surface reads the ADR 0027 tokens (`z-popover`,
    `animate-content-in/out`): no hard-coded `z-50`.
  - `surface.generated.json` and the view CSS/bundle are replayed; the SKILL
    inventory + prose follow.
- 470065e: Catalog `Select` (issue #13, ADR 0005 / 0019) — no new dependency.
  
  - `src/internal/select.tsx` becomes `src/components/select/`, catalogued: the
    registry entry and `src/index.ts` expose the parts (`Select`, `SelectTrigger`,
    `SelectValue`, `SelectContent`, `SelectItem`, `SelectGroup`, `SelectLabel`,
    `SelectSeparator`, `SelectScrollUpButton`, `SelectScrollDownButton`) plus the
    manifest, so `render_select`, `nomos://component/select` and
    `ui://nomos/select` follow with no MCP file written.
  - The floating list reads the ADR 0027 tokens (`z-popover`,
    `animate-content-in/out`): no hard-coded `z-50`.
  - `data-table-pagination` now imports the parts from their new home.
  - `surface.generated.json` and the view CSS/bundle are replayed; the SKILL
    inventory + prose follow.
  
  The per-part exports were already on the public surface (from the raw internal
  path); `SelectScrollUpButton` / `SelectScrollDownButton` and `selectManifest` are
  new. **Migration.** `@nomos/internal/select` is gone; import the parts from
  `@nomos/components/select/select` (or from the package root). No prop, token name
  or MCP tool is renamed.
- 11446f7: Catalog `Sheet` — side panel and `drawer` (issue #11, ADR 0005 / 0019).
  
  - `src/internal/sheet.tsx` becomes `src/components/sheet/`, catalogued: the
    registry entry and `src/index.ts` expose the parts (`Sheet`, `SheetTrigger`,
    `SheetContent`, `SheetOverlay`, `SheetPortal`, `SheetClose`, `SheetHeader`,
    `SheetFooter`, `SheetTitle`, `SheetDescription`) plus the manifest, so the MCP
    tool `render_sheet`, the resource `nomos://component/sheet` and the view
    `ui://nomos/sheet` follow with no MCP file written.
  - The four sides are the documented `side` variant; `side="bottom"` is the
    **drawer** — the same panel, not a separate atom.
  - The floating layer reads the ADR 0027 tokens (`z-overlay`, `bg-scrim`,
    `animate-overlay-in/out`, `animate-slide-in/out-{side}`): no hard-coded layer,
    veil or animation.
  - `surface.generated.json` and the view CSS/bundle are replayed; the SKILL
    inventory + prose follow.
  
  **Migration.** `@nomos/internal/sheet` is gone; import the parts from
  `@nomos/components/sheet/sheet` (or from the package root). `src/index.ts`
  previously exported only `SheetDescription` / `SheetHeader` / `SheetTitle` from
  the internal path; it now exports every part from the catalogued brick. No prop,
  token name or MCP tool is renamed.
- b479cb3: Catalog `Tooltip` — the family `TooltipProvider` / `Tooltip` / `TooltipTrigger` /
  `TooltipContent` (issue #14, ADR 0005 / 0019) — no new dependency.
  
  - `src/internal/tooltip.tsx` becomes `src/components/tooltip/`, catalogued: the
    registry entry and `src/index.ts` expose the family plus the manifest, so
    `render_tooltip`, `nomos://component/tooltip` and `ui://nomos/tooltip` follow
    with no MCP file written. The catalogue registers the family on its mandatory
    root, `TooltipProvider`.
  - The bubble reads the ADR 0027 tokens (`z-tooltip`, `animate-content-in/out`):
    no hard-coded `z-50`.
  - `src/internal/` is now empty and removed; `src/mcp/view.css` drops its
    `@source '../internal'` (the overlay parts all live under `src/components`).
  - `surface.generated.json` and the view CSS/bundle are replayed; the SKILL
    inventory + prose follow.
  
  **Migration.** `@nomos/internal/tooltip` is gone; import the family from
  `@nomos/components/tooltip/tooltip` (or from the package root), which now exports
  `Tooltip`, `TooltipTrigger` and `TooltipContent` in addition to
  `TooltipProvider`. No prop, token name or MCP tool is renamed.

### Patch Changes

- cdf858c: Cleanup after the overlay epic: drop a dead `.z-50`, fix manifest types and the
  ADR 0027 wording.
  
  - The `z-50` left in three manifest comments is gone, so Tailwind no longer emits
    an unused `.z-50` utility into `view-css.generated.ts` — the whole overlay layer
    reads the ADR 0027 tokens now.
  - `onOpenChange` is typed `(open: boolean) => void` (not `() => void`) in the
    `dialog`, `sheet`, `dropdown-menu` and `popover` manifests.
  - The accordion's chevron transition reads `--nomos-motion-duration-fast` instead
    of a raw `duration-200`.
  - ADR 0027 and the view-scan test comment say `src/components` (the overlay parts
    live there) instead of the removed `@source '../internal'`.
  - `vitest`'s `testTimeout` is raised to 10 s: the growing catalogue was bringing
    the resource-listing test close to the 5 s default.
  
  No export, token name, MCP tool or component prop changes.
- 3d4ca02: Fix the floating layer rendering transparent in consumer apps.
  
  Nomos ships its component classes as strings inside `dist`, and a consumer's
  Tailwind (v4) does not scan `node_modules`: without a declared source, utilities
  like `bg-popover`, `z-popover` and `shadow-md` were never compiled, so the
  facet popover and other overlays computed to `z-index: auto` and
  `background: transparent` — the table showed *through* them. `tokens/theme.css`
  now declares the compiled bundle (`@source '../dist/index.js'`), so the core's
  utilities compile for consumers. The MCP views keep their curated source list
  (`@source not`). No JS export, token name, MCP tool or component prop changes.

## 0.4.1

### Patch Changes

- b004755: Publish through OIDC trusted publishing on npm (no tokens). No API change.

## 0.4.0

### Minor Changes

- 478e83b: The package publishes publicly as **`@nomosui/react`** (it was `@pierretsia/nomos`, on the
  private GitHub Packages registry). Import specifiers and the install source change; the
  JavaScript API, the token interface, the MCP contract and the skill are unchanged.
- f8c30ed: Drop the host-app references from the public contracts: the DTCG `$extensions` vendor key
  moves from `org.agent-os` to `org.nomos`, and the MCP view DOM ids move from `agent-os-view`
  / `agent-os-view-data` to `nomos-view` / `nomos-view-data` (the reference host frame id
  follows). A consumer reading `$extensions` in `tokens.json`, or targeting those ids, must
  update. The file names and the token/API/MCP shapes are otherwise unchanged.

## 0.3.3

### Patch Changes

- d2e2e6a: La distribution expose le CSS et le skin (ADR 0025). Le paquet publie ses sous-exports
  `./tokens/theme.css`, `./tokens/tokens.generated.css` et `./tokens/tokens.json`, et
  `resolveSkin` / `renderCss` (avec `TokensDocument`) rejoignent la surface publique : une app
  externe peut charger le raccord Tailwind et dériver son CSS du même skin que les vues
  servies. `build:package` émet le type du module de dérivation et vérifie que chaque
  sous-export pointe un fichier livré.

## 0.3.2

### Patch Changes

- f12ecbf: Release de coordination : la **0.3.1** est prise par un autre fil. Aucun changement de la
  surface publique — l'alignement de version et le passage à changesets par `npx changeset publish`
  en direct.

## 0.3.1

### Patch Changes

- ebf6f94: Garde-fous de release : snapshot de la surface publique (`surface.generated.json`, tenu par
  `surface:check`), smoke du paquet consommé, et passages à changesets. Aucun changement de la
  surface publique (API JS, emplacements de tokens, contrat MCP, skill) — outillage seul.
