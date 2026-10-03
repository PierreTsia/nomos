# Conversation is a core sub-epic: atoms plus a transport-agnostic thread contract

The design system is app-agnostic (ADR 0002) and its heart *structures* state while
the app *owns* it (ADR 0015, ADR 0018). A chat-based UX is the next surface a host
app needs — an assistant that talks to a model and, at the end, produces an
artifact (a program, an extraction, a plan). Left unplaced, each app hand-rolls the
same transcript, composer, typing indicator and optimistic-append logic, and each
couples its rendering to one transport. This ADR settles where a conversation
surface lives and what the heart owns of it.

## Context

- The DataTable proved the split (ADR 0010): **atoms** are pieces that render on
  their own, a **feature** is a behaviour the kit knows how to render, stateful but
  controllable and fed by injected content and labels. `FacetedDataTable` owns
  sorting, pagination, row detail; the app supplies columns, facets and labels.
- Fetch, transport, errors and i18n are an app affair (ADR 0018, ADR 0015): the
  heart knows neither `react-query` nor a router nor a model SDK.
- The reference implementation shows the cost of not deciding: a hand-rolled
  transcript with `{role, content}` strings, a regex sentinel fished out of prose to
  mean "the artifact is ready", no tool or structured-output rendering, and no
  streaming seam — every consumer would re-derive the same plumbing.
- The public surface is frozen by `surface.generated.json` + `surface:check`
  (ADR 0024): every name this adds is carried for life and ships through a
  changeset.

## Decisions

1. **Conversation is a core sub-epic, split atoms-vs-feature like the DataTable.**
   The catalogue ships stateless bricks — a scroll-anchored transcript, a message
   row, a composer, a typing indicator — and `src/features/` ships the headless
   behaviour that turns them into a working thread.

2. **The heart owns the message contract and the thread state machine.** Messages
   carry a role and an ordered list of **parts**; the thread controller owns
   optimistic append, delta assembly, abort, retry and error state. It is the
   conversation's analogue of `FacetedDataTable`.

3. **The app owns the transport — the heart owns none.** The heart defines a
   `ChatTransport` interface: one `send` call the app provides. The app owns the
   model call, the network, persistence, retries, quota and i18n (ADR 0018). A
   Supabase edge function, a LangGraph pipeline, a local mock — all are the same
   seam to the heart.

4. **Messages are parts, not strings.** `ChatPart` is a discriminated union
   (`text`, `reasoning`, `tool`, `data`). A structured signal — "the draft is ready",
   an extraction artifact, a tool result — is a **first-class part** the surface
   renders, never a sentinel parsed out of assistant prose.

5. **Streaming is a transport capability, not a UI echo.** `ChatTransport.send`
   returns either an async iterable of deltas or a single message; the controller
   normalizes both. A request/response transport yields one message and the surface
   is unchanged; a token-streaming transport yields text deltas and the controller
   assembles them. The first UI ships request/response; the seam is already
   streaming-ready.

6. **Rendering is a slot; the heart ships no renderer dependency.** The surface
   exposes `renderPart`; the app injects its markdown (or none). Markdown, syntax
   colouring and icon sets stay app-side (ADR 0002, ADR 0029). The default is plain,
   whitespace-preserving text.

7. **No product vocabulary, no state of the conversation's meaning.** The heart
   invents no label, no "program", no "draft", no route. Roles, parts and labels
   are supplied by the app; the heart structures the conversation, the app decides
   what it is about (ADR 0015, ADR 0030).

## Consequences

- The conversation is a normal catalogue addition for its atoms (component,
  manifest, registry entry, skill inventory) and a normal feature for its
  behaviour (exported, not catalogued), exactly as the DataTable did (ADR 0010).
- The public surface grows by the new atoms and the controller's names; the
  snapshot and a changeset move in the same change (ADR 0024).
- An app migrates by writing one `ChatTransport` over its existing call and
  mapping its messages to parts; the transcript, composer, typing and optimistic
  append come from the heart. A structured artifact replaces the regex sentinel
  with a `data`/`tool` part the surface can render.
- Two consumers with different backends share the surface: the same seam serves a
  program-building assistant and a document-extraction pipeline, because neither
  the transport nor the meaning is in the heart.

## Alternatives considered

| Option | Why we didn't pick it |
|---|---|
| Visual atoms only, no controller | Every app re-derives optimistic append, abort and delta assembly; the "agnostic interface" is lost, and each app's threaded state drifts. |
| The heart calls the model (Vercel AI SDK, `useChat`) | Couples the heart to a runtime and a transport — exactly the fetch/error coupling ADR 0018 forbids, and a dependency an app-agnostic core must not impose (ADR 0002). |
| Messages stay `{role, content: string}` | Structured output has nowhere to live, so apps fall back to sentinel parsing in prose — the exact fragility this ADR removes. |
| The heart ships a markdown renderer | Adds a runtime dependency for something a single slot solves, and freezes a product choice (ADR 0002, ADR 0029). |

## References

ADR 0002 (app-agnostic heart), 0010 (atoms vs features — the DataTable
precedent), 0015 (the heart structures, the app decides), 0018 (fetch and errors
live app-side), 0024 (the public surface and the snapshot), 0029 (icons and
rendering are app-side), 0030 (the heart structures slots, the app fills them).
