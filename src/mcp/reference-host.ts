/**
 * L'hôte de référence (ADR 0013) : la forme minimale du contrat `ui://`. Il rend la vue
 * dans un iframe **sandboxé** (`allow-scripts`, jamais `allow-same-origin`), lui pousse
 * son apparence (`set-view`) et recueille ses intentions. C'est un exemple pour un hôte,
 * pas une dépendance.
 */

export const HOST_FRAME_ID = 'agent-os-view-frame'

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
  var SOURCE = 'nomos'
  var DATA = ${dataLiteral}
  var intents = []
  window.__agentOsIntents = intents
  // Le listener est posé tout de suite : une vue peut émettre son \`ready\` avant que le
  // parent n'ait fini de se construire, et on ne veut pas le rater.
  window.addEventListener('message', function (event) {
    var data = event.data
    if (!data || data.source !== SOURCE || data.type !== 'intent') return
    intents.push(data)
  })
  function wireFrame() {
    var frame = document.getElementById('${HOST_FRAME_ID}')
    if (!frame) return
    frame.addEventListener('load', function () {
      if (frame.contentWindow) {
        frame.contentWindow.postMessage(
          { source: SOURCE, type: 'set-view', theme: '${theme}', density: '${density}' },
          '*',
        )
        // L'hôte porte les données de l'outil à la vue (ADR 0023).
        if (DATA) frame.contentWindow.postMessage({ source: SOURCE, type: 'set-data', data: DATA }, '*')
      }
    })
  }
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', wireFrame)
  } else {
    wireFrame()
  }
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
<html lang="fr">
<head><meta charset="utf-8" /><title>Hôte de référence — ${viewUri}</title></head>
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
