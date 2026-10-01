# Epic Brief — Overlay & disclosure bricks

> Source: issue #8 (epic). This brief records the epic as refined; the tickets
> #9–#18 are its slices. The overlay foundation (#9) has its own Tech Plan.

## Summary

Nomos has **no floating brick**. The host pilot leans on many overlays and
imports `@nomosui/react` nowhere: `dialog` (20 usages), `popover` (11), `sheet`
(9), `collapsible` (9), `alert-dialog` (8), `dropdown-menu` (7), `drawer` (7),
`avatar` (4), `tabs` (3), `tooltip` (3), `select` (3), `scroll-area` (2),
`accordion` (1). The Radix plumbing already sits in `src/internal/` but is
neither catalogued nor manifested, so an agent cannot discover it. This epic
promotes the floating/disclosure layer to **atoms**, in tracer-bullet slices
each shippable and verifiable alone (ADR 0005, 0010, 0019).

---

## Context & Problem

**Who is affected:** an adopter app (its admin surfaces are dense with generic
floating bricks) and an agent reading the catalogue / MCP server.

**Current state:**
- `src/internal/{sheet,select,dropdown-menu,tooltip}.tsx` exist and compose
  Radix, but ship no manifest and no registry entry — invisible to the catalogue.
- The layer hard-codes `z-50` and `bg-black/80`, and carries animation classes
  (`animate-in`, `fade-in-0`, `zoom-in-95`, `slide-in-from-*`) that come from no
  installed plugin and are dropped in views.

**Pain points:**

| Pain | Impact |
|---|---|
| No floating brick in the catalogue | An agent cannot render or discover a dialog/sheet/menu; the app re-implements them. |
| Layering and scrim hard-coded | A skin cannot re-layer or tint; ADR 0004 is violated. |
| Animation classes without a plugin | Promoted overlays render unanimated in `ui://` views. |

---

## User Stories

1. As an **adopter app**, I want a catalogued `Dialog`/`Sheet`/`Popover`/menu,
   so that I stop re-implementing floating UI.
2. As an **agent**, I want the overlays in the MCP catalogue with manifests, so
   that I can discover and render them.
3. As a **theme author**, I want layering, scrim and motion to be semantic slots,
   so that my skin changes them without a fork.
4. As a **user**, I want a floating layer that is styled **and animated**, so
   that it does not pop in unstyled or inert.
5. As a **user with reduced-motion**, I want overlays to respect
   `prefers-reduced-motion`, so that the interface does not move against my will.
6. As a **contributor**, I want each brick to be one manifest + one registry
   entry + tests, so that the catalogue stays coherent (coherence test).
7. As an **agent**, I want a previewable overlay scene, so that I can see the
   foundation before the bricks exist.

### Success measures

| Story # | Measure |
|---|---|
| 4 | the compiled view CSS contains `.bg-scrim`, `--nomos-z-overlay` and the overlay keyframes; the `overlay` scene renders through the view |
| 3 | `surface.generated.json` lists the new token slots; `surface:check` is green |

---

## Scope

**In scope:**
1. The foundation slice (#9): `z` + `scrim` + motion tokens, their ADR, and the
   removal of every hard-coded layer/scrim/animation value.
2. The pilot slice (#10): `Dialog` end to end, establishing the catalogue chain.
3. The plumbing slices (#11–#14): catalogue `Sheet`/drawer, `DropdownMenu`,
   `Select`, `Tooltip` — no new dependency.
4. The cheap additions (#15–#18): `Popover`, `Collapsible`→`Accordion`,
   `AlertDialog`, `Avatar`/`Tabs`/`ScrollArea`.

**Out of scope:**
- `chart` (recharts, data-viz coupled to data — app), `command` (cmdk, coupled
  to app actions), `calendar` (react-day-picker, contradicts ADR 0015),
  `carousel` (embla, one usage), `multi-select` (a composition, not an atom).

---

## Success Criteria

- **Numeric:** the four drift checks (`tokens:check`, `view:check`,
  `view-css:check`, `surface:check`) are green at every slice.
- **Qualitative:** no `z-50` / scrim / animation literal remains in `src/`; a
  promoted overlay renders styled and animated in a view; the catalogue
  coherence test stays green as bricks are added.
