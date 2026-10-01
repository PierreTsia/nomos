import { semanticTokens } from '@nomos/tokens/build.mjs'

/**
 * Le contrat de skin (ADR 0022) : un skin est un **overlay sémantique** posé par-dessus le
 * défaut du cœur. La fusion est pure et bruyante — un emplacement **absent** hérite du
 * défaut, un emplacement **inconnu** lève (l'interface de thème est celle du défaut), et un
 * skin qui porterait une `primitive` lève aussi : le cœur garde les valeurs brutes.
 */
type Doc = Record<string, unknown>

export function resolveSkin(defaultDoc: Doc, overlay?: Doc): Doc {
  if (overlay == null) return defaultDoc

  if (overlay.primitive) {
    throw new Error(
      'skin : un skin ne porte pas de `primitive` — il ne remplace que des emplacements sémantiques (ADR 0022).',
    )
  }

  const known = semanticTokens(defaultDoc)
  const overlaid = semanticTokens(overlay)
  if (overlaid.size === 0) return defaultDoc

  const merged = structuredClone(defaultDoc) as Doc & { semantic?: Record<string, unknown> }
  merged.semantic ??= {}
  for (const [path, token] of overlaid) {
    const base = known.get(path)
    if (!base) {
      throw new Error(
        `skin : emplacement inconnu \`${path}\` — l'interface de thème est celle du défaut du cœur (ADR 0022).`,
      )
    }
    // Le type du défaut est repris si l'overlay ne le redonne pas (il n'est lu que pour
    // les valeurs tableau, mais l'interface doit rester complète).
    setSemantic(merged.semantic, path, { ...(base.$type ? { $type: base.$type } : {}), ...token })
  }
  return merged
}

/** Pose un token à son chemin (`color.background`) en créant les groupes manquants. */
function setSemantic(root: Record<string, unknown>, path: string, token: unknown): void {
  const keys = path.split('.')
  let node = root
  for (const key of keys.slice(0, -1)) {
    node[key] ??= {}
    node = node[key] as Record<string, unknown>
  }
  node[keys[keys.length - 1] as string] = token
}
