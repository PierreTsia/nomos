/**
 * The reference host (ADR 0033, aligned with MCP Apps): the minimal shape of the contract.
 * It renders the view in a **sandboxed** iframe (`allow-scripts`, never `allow-same-origin`),
 * answers its handshake (`ui/initialize`) with its context, pushes it the tool result
 * (`ui/notifications/tool-result`) and collects its intents (`ui/message`). It is an
 * example for a host, not a dependency.
 */

export const HOST_FRAME_ID = 'nomos-view-frame'

export function escapeAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function hostScript(theme: string, density: string, data?: Record<string, unknown>): string {
  const dataLiteral = data === undefined ? 'null' : JSON.stringify(data)
  return `
(function () {
  var THEME = ${JSON.stringify(theme)}
  var DENSITY = ${JSON.stringify(density)}
  var DATA = ${dataLiteral}
  var intents = []
  window.__nomosIntents = intents
  function send(target, message) {
    if (target) target.postMessage(message, '*')
  }
  // The listener is installed right away: a view may open its handshake before the parent
  // has finished building, and we do not want to miss it.
  window.addEventListener('message', function (event) {
    var message = event.data
    if (!message || message.jsonrpc !== '2.0') return
    var source = event.source

    // The handshake (SEP-1865): the host answers with its context (theme, density).
    if (message.method === 'ui/initialize') {
      send(source, {
        jsonrpc: '2.0',
        id: message.id,
        result: {
          protocolVersion: '2026-01-26',
          hostCapabilities: {},
          hostInfo: { name: 'nomos-reference-host', version: '0.0.0' },
          hostContext: { theme: THEME, density: DENSITY, displayMode: 'inline' },
        },
      })
      return
    }

    // The view is ready: the host carries it the tool data, then its result (ADR 0023).
    // With no data, it does not fabricate empty props: such a result would wipe the
    // pre-rendered markup of a view that has nothing to mount client-side.
    if (message.method === 'ui/notifications/initialized') {
      var payload = DATA ? { props: DATA } : {}
      send(source, {
        jsonrpc: '2.0',
        method: 'ui/notifications/tool-input',
        params: { arguments: payload },
      })
      send(source, {
        jsonrpc: '2.0',
        method: 'ui/notifications/tool-result',
        params: {
          content: [{ type: 'text', text: JSON.stringify(payload) }],
          structuredContent: payload,
        },
      })
      return
    }

    // The view reports its size: the host fits the frame height (SEP-1865).
    if (message.method === 'ui/notifications/size-changed') {
      var frame = document.getElementById(${JSON.stringify(HOST_FRAME_ID)})
      if (frame && message.params && message.params.height) {
        frame.style.height = message.params.height + 'px'
      }
      return
    }

    // An intent is a message from the view: we collect it and answer (SEP-1865).
    if (message.method === 'ui/message') {
      try {
        intents.push(JSON.parse(message.params.content[0].text))
      } catch (error) {
        intents.push(message.params)
      }
      if (message.id !== undefined) send(source, { jsonrpc: '2.0', id: message.id, result: {} })
    }
  })
})()
`
}

/** The host page: a sandboxed iframe carrying the view, and the bridge relaying its intents. */
export function buildReferenceHost({
  viewUri,
  viewHtml,
  theme = 'dark',
  density = 'comfortable',
  data,
}: {
  viewUri: string
  viewHtml: string
  theme?: string
  density?: string
  /** The data the host pushes to the view after mount (ADR 0023). */
  data?: Record<string, unknown>
}): string {
  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8" /><title>Reference host — ${viewUri}</title></head>
<body>
<script>${hostScript(theme, density, data)}</script>
<iframe
  id="${HOST_FRAME_ID}"
  title="${viewUri}"
  sandbox="allow-scripts"
  srcdoc="${escapeAttr(viewHtml)}"
></iframe>
</body>
</html>
`
}
