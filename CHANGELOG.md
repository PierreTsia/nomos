# @nomosui/react

## 0.12.0

### Minor Changes

- 4640a75: New brick: **`Calendar`** — a neutral, dependency-free single-month grid (ADR 0036,
  superseding ADR 0015 decision 3 for the date grid).
  
  - controlled `month`/`onMonthChange`, `selected`/`onSelect` (single);
  - `weekStartsOn`, `isDateDisabled`, `modifiers` + `modifierClassNames`, `showOutsideDays`,
    `autoFocus`;
  - full keyboard and ARIA built in (roving tabindex, arrows, Home/End, PageUp/Down,
    `grid`/`gridcell`, `aria-selected`/`aria-disabled`);
  - **labels are injected already formatted** (`CalendarLabels`): the core carries no locale,
    no `Intl`, no date library, and uses local dates only.
  
  A **composed date picker** (input + popover + validation) stays app-side: compose `Calendar`
  with `Popover`. Range/multiple selection, multiple months, dropdowns and week numbers are
  out of scope for v1 (non-breaking to add later).

## 0.11.2

### Patch Changes

- b71382b: Republish of 0.11.0. The first two automated publishes were held by npm's staged-publishing
  validation (the trusted publisher only allowed `npm stage publish`); with direct publish
  enabled the same contents ship as `0.11.2`. No API change.

## 0.11.1

### Patch Changes

- ce743e2: Republish of 0.11.0. The first automated publish was held by npm's staged-publishing
  validation and never became installable; `0.11.0` cannot be re-submitted, so the same
  contents ship as `0.11.1`. No API change.

## 0.11.0

### Minor Changes

- 93e0378: Six bricks gain the variants an adopter had to fake with Tailwind utilities — the
  E32 recensement (mijote adoption) turned the recurring `className` patterns into core
  variants:
  
  - **Button** — `shape="pill"`, sizes `touch` (mobile CTA) and `icon-lg`.
  - **Text / Heading** — `tone` (`default|muted|primary|danger`), from the semantic palette.
  - **Badge** — `size` (`default|sm|xs`), `shape` (`default|square`) and the `subtle` tone
    (primary ink on a primary-tinted surface).
  - **Input / SelectTrigger** — `size` (`sm|md|lg`, from the density scale, no fixed height),
    `variant="flush"` for inline fields, and `icon="leading"` to reserve the icon padding
    without a caller `pl-*` (`SearchField` now uses it).
  - **Card** — `padding` (`default|compact|flush`), `gap` (`default|comfy`) and `variant`
    (`default|muted`, a more discreet border). Padding and gap go through `--card-pad` /
    `--card-gap`, so no caller `p-*`/`gap-*`.
  - **Sheet** — `side="bottom"` is now a **bottom-sheet**: rounded top, safe-area bottom
    padding and a capped height.
  
  Also fixes `cn`: it declared no theme, so tailwind-merge classed the semantic sizes
  (`text-lead`, `text-body`…) as *text colours* and dropped them whenever a colour followed.
  The Nomos scale is now declared, matching `tokens/theme.css`.
  
  **Migration note** — the public exports are unchanged and the new variant groups extend
  existing props (`shape`/`tone`/`size`/`padding`/`gap`). Two behavioural changes:
  
  - `side="bottom"` becomes a bottom-sheet (rounded top, safe-area bottom padding, capped
    height, full width). An adopter that styled its own drawer can drop those utilities.
  - `Card` is now `flex flex-col` with a `--nomos-card-pad`/`--nomos-card-gap` pair (defaulted
    on `:root`): its children become flex items. A plain `<Card>` keeps its spacing, and a
    `Card*` part rendered outside a `Card` still gets the default padding.
- 9b38ba3: The heart opens two generic semantic slots — **`outline`** and **`elevation`** — so a skin
  can restyle borders and floating-layer shadows without the app reaching for classes:
  
  - `--nomos-color-outline`: a discrete border tone (a border variant can read `border-outline`);
  - `--nomos-elevation-sm|md|lg`: the shadows the overlay bricks already use.
  
  `tokens/theme.css` now bridges both: `--color-outline` and `--shadow-sm|md|lg` read the
  tokens, so `dialog`, `sheet`, `popover`, `toast`, `tooltip`, `select`, `dropdown-menu` and
  `alert-dialog` keep their `shadow-*` class and become skinnable with no component change.
  
  **Migration note** — additive: the public exports are unchanged and the new names
  (`--nomos-color-outline`, `--nomos-elevation-sm|md|lg`) extend the token surface. The
  default `elevation` values mirror Tailwind's default `shadow-sm|md|lg`, so a consumer that
  did not customize shadows sees no visual change.
  
  **Caveat — colored shadows**: a shadow is now a token value, so the Tailwind
  `--tw-shadow-color` hook is no longer substituted. A consumer that wrote e.g.
  `shadow-md shadow-red-500` (a colored or arbitrary shadow) loses the color; the token
  carries its own `rgb(0 0 0 / …)`. A consumer whose skin changed Tailwind's shadows directly
  should move those values onto the `elevation` slot.
- 9b38ba3: `Text.size` now covers the full semantic scale: `micro`, `caption`, `body`, `lead`, `title`,
  `display`. It previously stopped at `lead`, so a `Text` that needed `text-2xl`/`text-lg` had
  no role to read and the adopter fell back to a Tailwind utility. `Text` and `Heading` now
  read the same six steps; hierarchy still goes through `Heading`, the size prop is for text.
  
  **Migration note** — additive: `title` and `display` are new values on an existing prop; the
  default stays `body` and the existing four values are unchanged.

## 0.10.1

### Patch Changes

- e8deb09: The `Badge` no longer recolours on hover and shows the default cursor.
  
  A badge is a **non-interactive label** (its own manifest says so), yet the
  `default`, `secondary` and `destructive` variants carried a `hover:bg-*/80`
  recolour. When a caller overrode the resting tone — e.g.
  `<Badge className="bg-primary/10 text-primary">` — the inherited hover flipped the
  background to primary/80 while the text stayed primary, leaving same hue on same
  hue (measured ≈1.5:1, below AA). The label also showed the text caret, as a `<div>`
  with `cursor: auto` resolves to the I-beam over its text.
  
  - the `hover:bg-*/80` backgrounds are dropped from all variants;
  - the base carries `cursor-default`.
  
  The shadcn badge this was ported from scoped its hover with `[a&]:hover:…`, so a
  non-interactive label never recoloured — this restores that behaviour.

## 0.10.0

### Minor Changes

- 0102d66: The published package is now a **tree-shakeable module graph** and the MCP SDK leaves the
  consumer's install (ADR 0035):
  
  - the core builds with `preserveModules` (one file per module) and declares
    `"sideEffects": ["**/*.css"]` — `import { Badge }` no longer pulls the ~60 components,
    Radix, `@tanstack/react-table` and zod (measured: ~848 kB → ~1.3 kB of package code);
  - `@modelcontextprotocol/sdk` is a **devDependency**: the `nomos-mcp` binary inlines it,
    and a consumer that wants it as a client installs it itself;
  - `tokens/theme.css` scans `dist/components` (+ `features`, `composites`, `lib`) instead of
    the former one-file bundle.
  
  **Migration note** — the public exports are unchanged; only the internal layout of `dist`
  moves from a single `index.js` to a per-module tree. A consumer that reached into
  `dist/index.js` by path (it should not) is unaffected at the `exports` level. A consumer
  that used the transitive `@modelcontextprotocol/sdk` must add it to its own dependencies.
- 0102d66: Views report their own size to the host (MCP Apps / SEP-1865, extending ADR 0033):
  
  - `ui/notifications/size-changed` is now part of the view message contract
    (`UI_SIZE_CHANGED`);
  - the bridge measures its **mount root** once the handshake completes and re-reports on
    resize (a guarded `ResizeObserver`, injectable for tests), so a conforming host is no
    longer clipping the view;
  - `reference-host.ts` resizes its iframe on the notification — the pattern a host copies.
  
  **Migration note** — additive: a host that ignores the method keeps working; the previous
  message literals are unchanged.

## 0.9.0

### Minor Changes

- 172beb7: Views now speak the standard **MCP Apps** dialect (JSON-RPC 2.0 over `postMessage`,
  ADR 0033): the `ui/initialize` handshake, the tool result pushed as
  `ui/notifications/tool-result`, and interactions sent as a `ui/message`.
  
  **Migration note** — the in-house `ui://` message literals are gone:
  
  - `set-view` becomes the `ui/initialize` host context (`hostContext.theme`,
    `hostContext.density`);
  - `set-data` becomes `ui/notifications/tool-input` / `ui/notifications/tool-result`;
  - `{ source: 'nomos', type: 'intent', action, detail }` becomes a `ui/message` request
    whose text is `{"action","detail"}`.
  
  A host that does not speak MCP Apps still renders the pre-rendered fallback.
  `reference-host.ts` migrated to the standard dialect.
- 172beb7: The package exposes a **view entry point** and the **compiled utilities** (ADR 0034):
  
  - `@nomosui/react/view` — `renderView({ name | composite, skin?, tokens? })` returns the
    self-sufficient `text/html;profile=mcp-app` document, plus `appViewUri`,
    `compositeViewUri` and `APP_VIEW_MIME`;
  - `@nomosui/react/view.css` — the compiled utility CSS, so no runtime Tailwind is needed.
  
  The builder is pure (no filesystem) and inlines the core default tokens: it runs on a
  server and on edge. `buildAppView` / `appViewFor` / `compositeViewFor` keep their internal
  path; the public entry is the stable one.
  
  **Migration note** — `TokensDocument` is now a closed document (no catch-all index
  signature) and `resolveSkin` takes and returns it. A caller that passed a bare
  `Record<string, unknown>` as a token document must type it as `TokensDocument`.

## 0.8.2

### Patch Changes

- bdf454a: Translate the exposed strings to English (ADR 0026): the MCP tool and resource metadata, the view documents' `lang`, the runtime error messages, the declared `$description`s and the generator output. No API change.

## 0.8.1

### Patch Changes

- 5c98ef5: Translate the shipped skill (`SKILL.md`) to English, so the agent-facing contract follows the
  public repo's English policy (ADR 0026). No API change.

## 0.8.0

### Minor Changes

- 861e670: Add a conversation surface. The headless controller `useChatThread` and its
  transport-agnostic contract (`ChatMessage`, `ChatPart`, `ChatTransport`, `ChatDelta`,
  labels and statuses); and four catalogued bricks — `Conversation` (scroll-anchored
  `log` region), `Message` (role, parts, injected avatar/actions/timestamp,
  `renderPart`), `Composer` (controlled textarea, Enter/Shift+Enter, IME guard,
  send/stop) and `TypingIndicator`.
  
  The heart owns the thread state machine and the message-parts model; the app owns
  the model call, the network, persistence, errors and i18n (ADR 0018, 0032). The
  contract is streaming-ready: a transport returns either an async iterable of deltas
  or a single message. Purely additive; no existing API changes.

### Patch Changes

- 281e0bb: Translate the component manifests to English (summary, prop/variant descriptions, usages, examples), so the catalogue site and the MCP server serve English copy (ADR 0026). No API change.
- 96b7504: Associate a `Field`'s message with its control. The error now carries an `id` and
  `role="alert"`, the hint carries an `id`, and the core controls (`Input`, `Textarea`,
  `NumberField`, `SearchField`, `SelectTrigger`) inherit `aria-invalid` and
  `aria-describedby` — so a screen reader announces the error and marks the field
  invalid. A caller's own `aria-describedby` is kept alongside the field's message, and
  `aria-invalid` is `true` whenever the field shows an error. The label↔control
  association (`htmlFor`) is unchanged. Fixes #91.

## 0.7.0

### Minor Changes

- 2c53863: Expose the composite scenes on the public JS surface: `composites`,
  `compositeNames`, `findComposite` and the `Composite` type are now exported from
  `@nomosui/react`, so the MCP views and the site render the same source. Scene
  defaults are neutral English copy, injectable by props (ADR 0031).
- 16a2514: Timeline: add per-item dot states (`done` / `past`) and a continuous rail that joins the dots.

## 0.6.0

### Minor Changes

- 1af692a: Add `Code` and `CodeBlock`, monospace snippet primitives. `Code` renders an inline
  `<code>` on the inset/muted surface; `CodeBlock` renders a scrollable `<pre><code>`
  and composes `CopyButton` to copy the snippet. Syntax highlighting stays app-side.
- 0318101: Add `CopyButton`, a clipboard primitive that copies a value and shows a transient copied label.
- f0573d1: Add `Footer`, a site-chrome block: a brand slot, a row of links and a legal line, all injected by the app.
- a7f5eac: Add `Heading` and `Text`, mapped to the semantic type scale. `Heading` renders `h1`..`h6`
  from its `level` and reads the matching size token; `Text` renders a paragraph or a `span`
  at a semantic `size`. `tokens/theme.css` now maps the type scale to Tailwind utilities
  (`text-body`, `font-strong`, `font-sans`).
- 384027a: Expose the `LucideIcon` type and document icons as app-side.
  
  Nomos now re-exports the `LucideIcon` type from `lucide-react`, so an app can
  type the icon slots the heart offers (`icon?: LucideIcon`) without depending on
  a curated set of the heart. The heart still exposes **no icon set**: the app
  provides its own icons (ADR 0029).
  
  Migration note: this is additive. No existing export changes; the only new
  public name is the `LucideIcon` type. An app that already passes icons into the
  heart's slots can now type them against `LucideIcon` instead of importing the
  type from `lucide-react` directly.
  
  Closes #70
- b386c4d: Add `Kicker`, an eyebrow label: a short uppercase label with an optional tone dot.
- cbd56b9: Add a `Link` text link primitive that renders an `<a>` with the core focus ring and `hover:underline`, plus an optional `asChild`.
- 63db94a: Add `Navbar`, a site header block: a sticky top bar with injected `brand`, `nav` and
  `actions` slots. The heart owns the structure only — no routing, no product word
  (ADR 0030).

## 0.5.3

### Patch Changes

- 8d1b4db: Make the toned components opaque. `toneClasses` painted the status background as a
  translucent tint (`bg-status-<tone>/15`), so a floating `Toast` let the page show through
  it — visible in dark mode in particular. Each status ramp now carries an opaque surface
  stop (`100` in light, `900` in dark: the tone `500` composited over the mode background,
  the exact colour the tint produced on a page), exposed to the theme as
  `status-<tone>-surface`, and `toneClasses` reads it. `Toast`, `Alert` and `Chip` keep
  their tone wash but no longer reveal what sits behind them.
  
  Closes #64

## 0.5.2

### Patch Changes

- d9377eb: Fix `FacetedDataTable` snapping back to page 1 when its state is controlled (for
  example an app syncing it to the URL). TanStack's automatic page-index reset is now
  disabled: the table only returns to page 1 on the intentional changes — search, sort,
  facet and page size — via `resetPerPage`. A controlled table keeps the page the caller
  gave it.
- b3b55d2: Open the catalogued overlay examples (Dialog, Popover, Sheet, DropdownMenu,
  AlertDialog) with `defaultOpen` instead of a controlled `open` without an
  `onOpenChange` handler. A rendered example can now be closed; previously it was
  controlled-open and stuck.

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

- d2e2e6a: The distribution exposes the CSS and the skin (ADR 0025). The package publishes its
  `./tokens/theme.css`, `./tokens/tokens.generated.css` and `./tokens/tokens.json` sub-exports,
  and `resolveSkin` / `renderCss` (with `TokensDocument`) join the public surface: an external
  app can load the Tailwind adapter and derive its CSS from the same skin as the served views.
  `build:package` emits the type of the derivation module and checks that every sub-export points
  to a shipped file.

## 0.3.2

### Patch Changes

- f12ecbf: Coordination release: **0.3.1** is taken by another thread. No change to the public
  surface — the version alignment and the switch to changesets via `npx changeset publish`
  directly.

## 0.3.1

### Patch Changes

- ebf6f94: Release safeguards: snapshot of the public surface (`surface.generated.json`, held by
  `surface:check`), smoke of the consumed package, and changesets. No change to the public
  surface (JS API, token locations, MCP contract, skill) — tooling only.
