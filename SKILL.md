---
name: nomos
description: Pick the right Nomos design-system brick for a given use — atoms (Badge, Chip, Meter, Freshness, Table, Button, Input, field, form blocks), table shell, tone vocabulary, tokens and density — and query the catalogue through the local MCP server, including `ui://` views rendered in conversation.
---

# The Nomos design system

An **app-agnostic core** (the root of this repo): it knows neither an app's state, nor its
i18n, nor its router, nor its query params. As soon as a product word is needed to explain a
brick, it belongs to the app, not the core.

## Which brick to pick

### Qualify, situate

- **Qualify with a short word** (a status, a domain) → `Badge` (`variant` = the tone, with
  `subtle` for a tinted one; `size`/`shape` for a compact or square label). The tone comes
  from the core, never from a product word.
- **Qualify removably** (an active filter) → `Chip`, with `onRemove`; with no action, a bare
  `Chip`. A status you can't remove stays a `Badge`.
- **Place a value on a scale**, with a threshold → `Meter` (wide bar) or `CompactMeter`
  (dense cell). The threshold text is injected by the caller.
- **State the age of a datum** → `Freshness`; the age is already formatted, `stale` is
  decided by the caller.
- **Show a task's progress** (a total, no threshold) → `ProgressBar`, `progressbar`
  semantics.
- **Highlight a number** → `Counter` (suffix and label provided by the app).
- **Collect or show a rating** → `Rating`: interactive only if the app provides
  `onValueChange`, otherwise a display.
- **List dated events** → `Timeline` (a rail, presentation only; the date format comes from
  the app). A point carries a state — `done` (default) or `past` (greyed) — and a `past`
  requires a `stateLabel` provided by the app: colour alone is not enough.
- **Name an icon control, tuck away a short hint** → `Tooltip` as a family (a
  `TooltipProvider` around several, `Tooltip`, `TooltipTrigger`, `TooltipContent`). Never for
  essential information: it is neither keyboard-only nor touch accessible.
- **Represent a person by their image** → `Avatar` (alt text and fallback come from the app;
  native `<img>` + `onError`, no dependency).
- **Cap a title with a short hook** → `Kicker` (an uppercase label, an optional tone dot via
  `dot`; the text is injected by the caller).

### Act, input

- **Act** → `Button` (`variant` = the tone, `size` = the density — `touch` for a mobile CTA,
  `shape="pill"` for a rounded action; `asChild` to put the style on a link).
- **Navigate to a URL** → `Link` (an `<a>`; `href` and label injected, the core carries no
  routing; `asChild` to put the style on an app routing component).
- **Copy a text** → `CopyButton` (`value` to copy, `label`/`copiedLabel` and `icon`
  injected; the transient label returns on its own after ~2 s).
- **Input one line** → `Input` (`size`, `variant="flush"` for an inline field,
  `icon="leading"` to reserve the icon padding); **a bounded number** → `NumberField`
  (`step`, `min`, `max` from the native element); **search with an icon and a clear button**
  → `SearchField`; **several lines** → `Textarea`.
- **Check** → `Checkbox` (independent option); **toggle right away** → `Switch`; **choose a
  single option among a few** → `RadioGroup`; **a one-off toggle** (mode, filter) → `Toggle`,
  **a segment** → `ToggleGroup`. All are controlled by props: the state stays in the app.
- **Choose a single value from a list of options** → `Select` as parts (`SelectTrigger` with
  `size`/`variant="flush"`, `SelectValue`, `SelectContent`, `SelectItem`; labels and values
  come from the app). For actions, it's a `DropdownMenu`.

### Structure

- **A surface** (title, body, footer) → the parts of `Card` (`padding`, `gap` and `variant`
  control its breathing room and border tone, no caller `p-*`/`gap-*`).
- **A site header** (brand, navigation, actions) → `Navbar`: a sticky bar at the top, a
  bottom border, the core's background. The `brand`, `nav` and `actions` slots are injected
  by the app — no `href` and no product word in the core (ADR 0030).
- **An empty state, or a failure to name** → `EmptyState` (the centred card; the raw `detail`
  names the real failure, rather than a silent zero).
- **A footer** (brand, link row, legal line) → `Footer`: injected slots (`brand`, `links`,
  `legal`), with no routing or core-specific label.
- **Inline information** that asks for attention without blocking → `Alert` (the tone comes
  from the core; `onClose` goes with `closeLabel`).
- **Separate two contents** → `Separator`; **hold the place of loading content** →
  `Skeleton`.
- **Rich or interactive content in a floating surface on click** → `Popover`
  (`PopoverTrigger`, `PopoverContent`, `PopoverAnchor` to anchor elsewhere). For a short text
  on hover, it's a `Tooltip`.
- **Reveal a detail on demand** → `Collapsible` (`CollapsibleTrigger`, `CollapsibleContent`);
  **collapsible sections, one at a time** → `Accordion` (`AccordionItem`, `AccordionTrigger`,
  `AccordionContent`, `type` single/multiple).
- **Switch between sibling views** → `Tabs` (`TabsList`, `TabsTrigger`, `TabsContent`);
  **bound a dense sub-view to a fixed height** → `ScrollArea` (purely cosmetic, scrolling
  stays native).
- **Warn without blocking** → `Toast` via `useToast().show({ message })` (the queue and
  auto-dismiss live in `ToastProvider`).
- **Group actions behind a compact trigger** → `DropdownMenu` as parts
  (`DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, checkable, radio,
  submenu; labels and actions come from the app). To choose a form value, it's a `Select`.
- **Ask for a decision in a centred modal** → `Dialog` (trigger, title, description, body,
  footer; the close label comes from the app). Stacking, overlay and motion come from the
  tokens, never from a hard-coded value.
- **Confirm a destructive action** → `AlertDialog` (`AlertDialogTrigger`,
  `AlertDialogContent`, `AlertDialogAction`, `AlertDialogCancel`; two explicit outcomes). It
  does not close on an outside click.
- **Show content anchored to an edge** → `Sheet` as parts (`SheetTrigger`, `SheetContent`
  with `side`, `SheetHeader`, `SheetFooter`); `side="bottom"` is the **bottom-sheet**
  (rounded top, safe-area padding, capped height) — the same panel, a different side, not a
  separate atom.
- **Browse a hierarchy** → `Tree` (navigation, one active node) or `SelectionTree`
  (multi-selection); opening and selection are controlled by props, keyboard focus (`tree`
  role, arrows) is internal.

### Write

- **Title a section** → `Heading`: `level` chooses the `h1`..`h6` tag **and** the semantic
  size (display, title, lead, body, caption, micro); `tone` sets its ink
  (default/muted/primary/danger). Document hierarchy is decided by the level, never by the
  size.
- **Write body text** → `Text`: `size` reads the semantic scale (`micro`, `caption`, `body`,
  `lead`, `title`, `display` — the same six `Heading` reads) and `tone` its ink
  (default/muted/primary/danger), `as` chooses `p` (default) or `span` for inline text.
  Sizes and ink come from the tokens, never from an ad-hoc utility. The scale maps onto the
  Tailwind steps an adopter migrates from: `micro`→`text-[11px]`, `caption`→`text-xs`,
  `body`→`text-sm`, `lead`→`text-base`, `title`→`text-lg`, `display`→`text-2xl`.
- **Show a code excerpt** → `Code` (inline, in a sentence) or `CodeBlock` (scrollable block
  with a copy button; `code` is the copied text, `children` the rendering, labels are
  injected). Syntax highlighting stays with the app.

### Form

- **Lay out** → `Form` (grid of fields + action area, `columns` for two columns). No
  validation, no state, no text.
- **A field slot** (label, control, hint or error) → `Field`; **name a control alone** →
  `Label` (`htmlFor`); **group related fields** → `Fieldset` (`legend` provided by the app).
  The error message is injected, never computed by the core. `Field` itself associates the
  control with its message (`aria-invalid`, `aria-describedby`) for the core controls:
  `Input`, `Textarea`, `NumberField`, `SearchField` and the `Select` trigger.

### Tables

- **A dense grid of rows** → the parts of `Table` (`Table`, `TableHeader`, `TableBody`,
  `TableRow`, `TableHead`, `TableCell`), importable separately.
- **Filter by a dimension** → `FacetFilter` (options, selection and the "clear" label
  injected); **search, count, manage columns** → `DataTableToolbar`; **navigate a page** →
  `DataTablePagination` (independent of the table).
- **A driven table** (columns, facets, sorting, pagination, row detail) → the
  `FacetedDataTable` feature: it owns the behaviour and the **placement** of the detail
  (`overlay` layer or `inline` expansion), the app provides the content and the `labels`.

### Conversation

- **Wire up a conversation** → the `useChatThread({ transport, initialMessages })` feature:
  it owns the **state machine** — optimistic turn append, delta assembly, `send`, `stop`,
  `retry`/`regenerate`, `replace`, error — and **nothing of the transport** (ADR 0032). The
  app injects a `ChatTransport` (a `send` function): the core calls no model, knows no
  endpoint, shows no network error (ADR 0018). A message carries a role and **parts**
  (`text`, `reasoning`, `tool`, `data`): a structured signal is a first-class part, never a
  sentinel fished out of the prose.
- **The thread window** → `Conversation`: a live `log` region anchored at the bottom, the
  scrolling held by the core, the height by the app. **A message** → `Message`: the placement
  and tone of the role, the content in `parts`, and `renderPart` so the app keeps markdown,
  highlighting and business artefacts. **The input** → `Composer`: controlled by props
  (`value` + `onChange`), `Enter` sends, `Shift+Enter` breaks the line, IME guard; `busy` +
  `onStop` to interrupt. **Wait for the reply** → `TypingIndicator` (label injected, `status`
  region).

### Tones and tokens

- **A status tone** → `toneClasses` (`neutral`, `info`, `progress`, `attention`, `warning`,
  `danger`, `success`). It is an **intention**, not a colour.
- **Colours, spacing, typography** → the tokens (`tokens.json`, single source). The theme and
  density are set on the **render root** (`data-theme`, `data-density`), never on `:root`.

The default sort is carried by the column (`meta.defaultSort`), never by the core.

## The inventory

The exact list of catalogue bricks, held by test (`src/mcp/skill.test.ts`): a brick added to
the catalogue without being here turns red, and a line that no longer exists does too.

<!-- inventory: start — kept by src/mcp/skill.test.ts -->
accordion
alert
alert-dialog
avatar
badge
button
card
checkbox
chip
code
code-block
collapsible
composer
conversation
copy-button
counter
data-table-pagination
data-table-toolbar
dialog
dropdown-menu
empty-state
facet-filter
field
fieldset
footer
form
freshness
heading
input
kicker
label
link
meter
message
navbar
number-field
popover
progress-bar
radio
rating
scroll-area
search-field
select
separator
sheet
skeleton
switch
table
tabs
text
textarea
timeline
toast
toggle
toggle-group
tooltip
tree
typing-indicator
<!-- inventory: end -->

## Querying the catalogue

The local MCP server serves the same inventory as the style page, read-only:

```sh
npm run mcp   # stdio, no token
```

- `list_components { query? }` — which bricks exist, and which one matches a word.
- `get_component { name }` — the full contract of a brick (props, variants, usages).
- `preview_component { name }` — its rendering recipe (example props, variants, usages).
- `list_scenes` — the available **composite scenes**.
- `render_<name>` / `render_scene_<name>` — return the recipe, **carry the data** (`props`,
  optional) and **reference the view** via `_meta.ui.resourceUri`.

Resources carry the same data as the tools: `nomos://tokens` (the inventory flattened by
mode) and `nomos://component/<name>` (the manifest).

## Rendering in conversation

Beyond the manifest, each brick has a **view** served at `ui://nomos/<name>` — a
self-contained document (`text/html;profile=mcp-app`) the host renders in a sandboxed iframe.
A **composite scene** (`ui://nomos/composite/<name>`) assembles several bricks into a screen
that makes sense (a form, a status card). Scenes are also exported on the public JS surface
(`composites`, `compositeNames`, `findComposite`, ADR 0031): the MCP server and the site
render the **same** source, and their default copy is neutral — it is injected via props.

The view speaks the **MCP Apps** dialect (ADR 0033): it opens the `ui/initialize` handshake,
the host answers with its context (theme, density) and pushes the tool result
(`ui/notifications/tool-result`) — the `props` the render tool carried (ADR 0023). It reports
its own size (`ui/notifications/size-changed`) so the host fits the frame. It never
mutates state: an interaction becomes a `ui/message` intention the host arbitrates.

## If you change the design system

A change that changes a brick's **usage** updates this skill in the same change: the inventory
list and the prose. A component added to the catalogue without its manifest (props, variants,
usages) turns the coherence test red (`src/catalogue/coherence.test.ts`); a brick missing from
the inventory turns `src/mcp/skill.test.ts` red.
