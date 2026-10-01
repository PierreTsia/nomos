# The toast stays an app layer, not a heart primitive

> ⚠️ **Replaced by ADR 0020.** The premise "the heart owns no state" was false
> (the table owns some). Decision reversed: Nomos now owns the toast (`Toast` +
> `ToastProvider`/`useToast`), with no third-party dependency. This document is
> kept as a record of the reasoning.

The app displays toasts to say what an action produced — "sync in progress",
"reindexed", "failed" (`src/components/data-table/SyncButton.tsx`). They go
through **sonner** (`src/components/ui/sonner.tsx`), styled with our tokens.
`sonner` is today a dependency of the **app** (repo root), not of the DS package.

Should a toast be welcomed into the heart? No.

## Decisions

1. **The heart exposes no toast.** A toast is **behavioural**, not presentational:
   it is a queue (stacking), **durations** and timers, a **close** (auto, on
   click, on keyboard) and an **a11y** announcement (`role="status"` /
   `aria-live`). That is exactly what ADR 0015 assigns to the app — state, time,
   i18n — and what ADR 0002 reserves for the heart layer: structure and
   presentation without state. Welcoming sonner into the heart **would impose the
   dependency** on every consumer, which ADR 0002 forbids, and a home-grown
   wrapper would only move the queue and the timers into the package.

2. **`sonner` stays app-side.** It lives in the root `package.json` and does not
   enter `package.json` of the DS package. The heart knows neither `toast` nor
   `Toaster`. The skin stays what it is: `src/components/ui/sonner.tsx` maps the
   heart's classes (`bg-background`, `text-foreground`, `border-border`,
   `bg-primary`…) — the app seam over a third-party lib, as the table is for
   TanStack (ADR 0010).

3. **A *presentation* primitive would remain possible, but is not taken.** If one
   day a consumer of the heart (GymLogic) needs an *inert* notification **card** —
   without queue, without timer, rendered with our tokens — it would be a separate
   presentation component (colours/tones, structure, injected icon), driven by the
   app. It would not replace `sonner`: it would handle neither stacking nor
   duration. As long as a real need does not require it, we **do not derive it**
   (same rule of restraint as ADR 0015 "we do not derive"): YAGNI.

## Consequences

- Nothing to do in the heart: the decision is to **not** put a toast there.
- A consumer that wants toasts wires `sonner` (or another) **above** the heart,
  as the app already does, and only has to style with the tokens.
- The re-examination criterion is explicit: a consumer of the heart needs a
  shared **inert notification card**. Only then will we write the presentation
  primitive, and `sonner` will stay, itself, app-side.

## References

- ADR 0002 — the heart is app-agnostic and imposes no unnecessary dependency.
- ADR 0015 — the heart owns the presentation, the app owns state, validation and
  i18n; a contract reused here to settle the toast's fate.
