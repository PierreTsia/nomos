/**
 * L'hôte de référence (ADR 0033, aligné sur MCP Apps) : la forme minimale du contrat. Il
 * rend la vue dans un iframe **sandboxé** (`allow-scripts`, jamais `allow-same-origin`),
 * répond à sa poignée de main (`ui/initialize`) avec son contexte, lui pousse le résultat
 * de l'outil (`ui/notifications/tool-result`) et recueille ses intentions (`ui/message`).
 * C'est un exemple pour un hôte, pas une dépendance.
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
  // Le listener est posé tout de suite : une vue peut ouvrir sa poignée de main avant que
  // le parent n'ait fini de se construire, et on ne veut pas la rater.
  window.addEventListener('message', function (event) {
    var message = event.data
    if (!message || message.jsonrpc !== '2.0') return
    var source = event.source

    // La poignée de main (SEP-1865) : l'hôte répond avec son contexte (thème, densité).
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

    // La vue est prête : l'hôte lui porte les données de l'outil, puis son résultat (ADR 0023).
    if (message.method === 'ui/notifications/initialized') {
      send(source, {
        jsonrpc: '2.0',
        method: 'ui/notifications/tool-input',
        params: { arguments: { props: DATA || {} } },
      })
      send(source, {
        jsonrpc: '2.0',
        method: 'ui/notifications/tool-result',
        params: {
          content: [{ type: 'text', text: JSON.stringify({ props: DATA || {} }) }],
          structuredContent: { props: DATA || {} },
        },
      })
      return
    }

    // La vue rapporte sa taille : l'hôte ajuste la hauteur de la frame (SEP-1865).
    if (message.method === 'ui/notifications/size-changed') {
      var frame = document.getElementById(${JSON.stringify(HOST_FRAME_ID)})
      if (frame && message.params && message.params.height) {
        frame.style.height = message.params.height + 'px'
      }
      return
    }

    // Une intention est un message de la vue : on la recueille et on répond (SEP-1865).
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

/** La page hôte : un iframe sandboxé portant la vue, et le pont qui relaie ses intentions. */
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
  /** Les données que l'hôte pousse à la vue après montage (ADR 0023). */
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
