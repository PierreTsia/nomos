# Views take data: the tool carries it, the bridge pushes it

ADR 0013 / 0019 left a `ui://` view **without input**: `render_<name>` served the
manifest's `example`, never data. The POC showed the limit — impossible to show *a*
user's data (their next workout session). We open the **data → view** path.

## Decisions

1. **The tool carries the data.** `render_<name>` and `render_scene_<name>` gain
   an optional **`props`** input (a free JSON object). The tool returns these props
   in its result, with `_meta.ui.resourceUri`. The agent — which knows *what* to
   show — provides them; the server does not know the data and stays **stateless**.

2. **The bridge pushes the data: `set-data`.** After mounting, the host posts
   `{ source:'nomos', type:'set-data', data }`, symmetrical to `set-view`. The view
   **re-renders** with it; the pre-rendered markup (the `example`, the default
   scene rendering) remains the **fallback** without JS. The bridge remains the
   **only** one that knows `postMessage` (ADR 0013, point 6); the view **never
   mutates** the host's state.

3. **Scope: JSON-serialisable props.** A brick whose props are
   **elements/functions** (`Table` has `columns`, `Card` children, `Radio`,
   `ToggleGroup`) keeps its `example` — driving it by data will require a
   serialisable format (a column = a descriptor), decided **when a real consumer
   requires it**. **Scenes** accept props: their `render` takes a data shape
   specific to the scene (by default, their current rendering).

4. **This supersedes the scenes' `client:false`** (ADR 0019): a scene mounts
   client-side to receive data; its pre-rendered markup remains the fallback.

## Consequences

- The rendering tools take an `inputSchema` (`props`), and their result carries the
  props the host will re-post via `set-data`.
- `view/entry.tsx` (re)renders from the current props; it knows how to mount a
  **component** (`findComponent`) as well as a **scene**
  (`findComposite(...).render(props)`).
- `reference-host.ts` can push data (the e2e uses it).
- The heart stays app-agnostic: it knows no data, only a `props` object.

## References

ADR 0013 (`ui://` contract, intentions), 0019 (v2 contract, superseded on the
scenes' `client:false`), 0022 (skin).
