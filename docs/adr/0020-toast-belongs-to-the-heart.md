# The toast belongs to the heart (Nomos) — replaces ADR 0016

ADR 0016 concluded that the toast stayed an app layer, on the grounds that "a
toast is behavioural, and the heart owns no state". **We reverse that decision.**
The grounds were false: `FacetedDataTable` already owns its internal state (sort,
filters, page) as long as the app does not control it. The heart *can* carry a
queue.

## Decisions

1. **Nomos owns the toast.** `Toast` (the presentation, catalogued) +
   `ToastProvider` and `useToast` (the **queue**, auto-close, pause on hover, the
   `aria-live` region). A consumer of the heart no longer has to pick a toast lib:
   it is there.

2. **Zero third-party dependency.** We do **not** welcome `sonner` into the
   package: we write our toast, with our tokens, injected labels and icons. This
   is the one hard rule (ADR 0002: do not impose an unnecessary dependency) — and
   it holds: the queue is our own code, not an external lib.

3. **We diverge from the reference design system on coupling, not on function.**
   It has a `Snackbar` + a `SnackbarProvider`/`useSnackbar`: the DS does own the
   queue. We make the **same decision** (the heart owns the toast) but
   **decoupled**: neither `react-intl` (the labels are injected, `closeLabel`),
   nor its `Icon` component (lucide icon, replaceable).

4. **What the app keeps.** The **content**: messages, descriptions, actions, and
   the close label (i18n). `SyncButton` moves from `sonner` to
   `useToast().show/update`.

## Consequences

- `sonner` is **removed** from the dependencies; `src/components/ui/sonner.tsx`
  is deleted.
- A notification can be updated in place by its identifier (`show` → `update`),
  which covers the "loading → success/failure" pattern in a single toast.
- This is an assumed precedent: the heart can carry a **stateful**,
  self-contained primitive (like the table). What remains forbidden is the
  imposed dependency.

## References

- ADR 0002 (the heart imposes no dependency), ADR 0015 (the heart owns the
  presentation), ADR 0016 (replaced by this one), ADR 0006 (divergences from the
  reference design system).
