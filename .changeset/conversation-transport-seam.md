---
"@nomosui/react": minor
---

Add a conversation surface. The headless controller `useChatThread` and its
transport-agnostic contract (`ChatMessage`, `ChatPart`, `ChatTransport`, `ChatDelta`,
labels and statuses); and four catalogued bricks — `Conversation` (scroll-anchored
`log` region), `Message` (role, parts, injected avatar/actions/timestamp,
`renderPart`), `Composer` (controlled textarea, Enter/Shift+Enter, IME guard,
send/stop) and `TypingIndicator`.

The heart owns the thread state machine and the message-parts model; the app owns
the model call, the network, persistence, errors and i18n (ADR 0018, 0032). The
contract is streaming-ready: a transport returns either an async iterable of deltas
or a single message. Purely additive; no existing API changes.
