# Fetch and errors live app-side, not in Nomos

The reference design system handles loading **inside** its design system: its
components import `@tanstack/react-query`, call `useSuspenseQuery` and rely on
three levels of `ErrorBoundary`. This is the same coupling as for the table (ADR
0014): we take the UX and the conventions, not the dependency in the heart. This
decision says **where** the host app's fetch and error handling live, and what
Nomos carries of them.

## Decisions

1. **Fetch is an app affair.** Reading batches goes through
   `@tanstack/react-query`, wired by `QueryClientProvider` (root): a dependency of
   the app, never of the Nomos package. The heart knows neither `useQuery`, nor
   `queryOptions`, nor a cache key.

2. **The pattern is `queryOptions` per feature.** Each desk exposes its reads in
   `src/features/<desk>/queries.ts`: an object of keys (`triageKeys`, `prsKeys`…)
   and `useQuery(queryOptions({ queryKey, queryFn, staleTime }))` hooks. The
   source (live in dev, committed batch in prod) is a detail of the app, not of
   the heart.

3. **Errors are an app policy, not a component.** Three pieces app-side:
   - `queryClient` sets the global policy (`retry`, `retryDelay`,
     `refetchOnWindowFocus`);
   - `queryRetry` distinguishes the **transient failure** (network, dev server
     restarting — we retry) from the **definitive failure** (contract violated,
     `ZodError` — we do not insist);
   - the states are **rendered** with Nomos primitives: `EmptyState`
     (empty/error), `Alert`, `Skeleton`. The heart provides the presentation; the
     app decides the why.

4. **No home-grown `ErrorBoundary` nor Suspense for now.** The pages explicitly
   read `isPending` / `isError` and render `Skeleton` / `LoadErrorCard`. The
   reference design system relies on `useSuspenseQuery` + `ErrorBoundary`: that is
   an option kept in reserve, not today's convention (read console, low traffic,
   per-page states readable).

5. **Nomos stays neutral.** None of these pieces enters the DS package: neither
   react-query, nor a retry policy, nor i18n of messages. Otherwise ADR 0002
   collapses ("the heart is not written as app code"). The heart *structures*
   state; the app *owns* it.

## Consequences

- A new desk follows the pattern without deciding anything new: a `queries.ts`, a
  `queryOptions`, and Nomos primitives for the states.
- The console's **invariant** holds here: an unreadable signal becomes
  `unavailable` and a **gap** (never a zero); a definitive failure shows itself,
  it does not hide (`EmptyState`'s raw `detail`).
- The reference design system keeps its `ErrorBoundary`: we diverge as for the
  router, and for the same reason.

## References

- ADR 0002 (app-agnostic heart), ADR 0006 (assumed divergences from the reference
  design system), ADR 0014 (same arbitration for the table), ADR 0015 (the heart
  owns the presentation).
