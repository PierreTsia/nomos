/**
 * La dérivation des tokens : une source JSON, deux rendus (ADR 0004).
 *
 * `renderCss` produit les custom properties CSS que l'app consomme ; `buildResource`
 * produit l'inventaire plat que le serveur MCP du design system servira.
 *
 * Ce module est pur : il ne lit ni n'écrit aucun fichier, il prend le document DTCG
 * déjà parsé et rend du texte. Le CLI (`scripts/build-tokens.mjs`) fait l'entrée/sortie,
 * et les tests importent ces fonctions pour vérifier qu'un emplacement oublié les fait
 * échouer plutôt que de produire un blanc silencieux (ADR 0009).
 */

/** Un chemin d'alias DTCG : `{primitive.color.ink.950}`. */
const ALIAS = /^\{([^}]+)\}$/

export function modes(doc) {
  const declared = doc?.$extensions?.['org.nomos']?.modes
  if (!Array.isArray(declared) || declared.length === 0) {
    throw new Error(
      'tokens.json: `$extensions["org.nomos"].modes` must declare at least one mode.',
    )
  }
  return [...declared]
}

export function defaultMode(doc) {
  const declared = doc?.$extensions?.['org.nomos']?.defaultMode
  const all = modes(doc)
  if (!declared || !all.includes(declared)) {
    throw new Error(
      `tokens.json: \`defaultMode\` must be one of the declared modes (${all.join(', ')}).`,
    )
  }
  return declared
}

/** Les densités déclarées (ADR 0008) : un nom et son multiplicateur d'espacement. */
export function densities(doc) {
  const declared = doc?.$extensions?.['org.nomos']?.densities
  if (!declared || typeof declared !== 'object' || Object.keys(declared).length === 0) {
    throw new Error(
      'tokens.json: `$extensions["org.nomos"].densities` must declare at least one density.',
    )
  }
  return declared
}

export function defaultDensity(doc) {
  const declared = doc?.$extensions?.['org.nomos']?.defaultDensity
  const all = Object.keys(densities(doc))
  if (!declared || !all.includes(declared)) {
    throw new Error(
      `tokens.json: \`defaultDensity\` must be one of the declared densities (${all.join(', ')}).`,
    )
  }
  return declared
}

/** Aplatit un nœud DTCG en `chemin -> token`, en s'arrêtant aux feuilles (`$value`). */
function flatten(node, prefix = []) {
  const tokens = new Map()
  for (const [key, value] of Object.entries(node ?? {})) {
    if (key.startsWith('$')) continue
    const path = [...prefix, key]
    if (value && typeof value === 'object' && '$value' in value) {
      tokens.set(path.join('.'), value)
    } else if (value && typeof value === 'object') {
      for (const [p, t] of flatten(value, path)) tokens.set(p, t)
    }
  }
  return tokens
}

export function primitives(doc) {
  return flatten(doc.primitive)
}

export function semanticTokens(doc) {
  return flatten(doc.semantic)
}

/**
 * Tous les tokens du document, aplatis depuis sa racine : c'est là qu'un alias DTCG
 * résout son chemin (`{primitive.color.ink.950}` part de la racine du fichier, pas du
 * groupe `primitive`).
 */
export function allTokens(doc) {
  return flatten(doc)
}

/**
 * Résout un token sémantique pour un mode jusqu'à sa valeur concrète : une chaîne
 * d'alias `{primitive…}` est suivie jusqu'au bout, avec détection de cycle.
 */
export function resolve(doc, path, mode) {
  const known = allTokens(doc)
  const token = semanticTokens(doc).get(path)
  if (!token) throw new Error(`tokens.json: semantic token not found: ${path}`)

  const value = token.$value
  let raw = value
  if (value && typeof value === 'object' && !Array.isArray(value) && !('colorSpace' in value) && !('value' in value)) {
    // valeur portée par mode (`{ dark: …, light: … }`)
    if (!(mode in value)) {
      throw new Error(
        `tokens.json: mode \`${mode}\` does not fill the slot \`${path}\` (modes present: ${Object.keys(value).join(', ')}).`,
      )
    }
    raw = value[mode]
  }

  const seen = new Set()
  while (typeof raw === 'string' && ALIAS.test(raw)) {
    const target = raw.match(ALIAS)[1]
    if (seen.has(target)) {
      throw new Error(`tokens.json: cyclic alias around \`${target}\` (${path}).`)
    }
    seen.add(target)
    const found = known.get(target)
    if (!found) {
      throw new Error(
        `tokens.json: \`${path}\` points to \`${target}\`, which does not exist in \`primitive\`.`,
      )
    }
    raw = found.$value
  }
  return raw
}

/** Rend une valeur DTCG en texte CSS. `type` n'est lu que pour une valeur tableau. */
export function cssValue(value, type) {
  if (typeof value === 'string') return value
  if (typeof value === 'number') return String(value)
  if (Array.isArray(value)) {
    if (type === 'fontFamily') return value.map((f) => (f.includes(' ') ? `"${f}"` : f)).join(', ')
    if (type === 'cubicBezier' && value.length === 4) return `cubic-bezier(${value.join(', ')})`
    throw new Error(
      type
        ? `tokens.json: array value not rendered for type \`${type}\`.`
        : "tokens.json: an array value requires its token's `$type` (none received).",
    )
  }
  if (value && typeof value === 'object') {
    if (value.colorSpace === 'hsl') {
      const [h, s, l, a] = value.components
      const base = `${h} ${s}% ${l}%`
      return a === undefined ? base : `${base} / ${a}`
    }
    if ('value' in value && 'unit' in value) return `${value.value}${value.unit}`
  }
  throw new Error(`tokens.json: value not rendered: ${JSON.stringify(value)}`)
}

/** Le nom de la custom property d'un emplacement sémantique. */
export function cssName(path, namespace) {
  return `${namespace}-${path.replace(/\./g, '-')}`
}

/** L'ensemble des emplacements sémantiques d'un mode, `nom CSS -> valeur`. */
export function slotsFor(doc, mode) {
  const namespace = doc?.$extensions?.['org.nomos']?.cssNamespace ?? '--nomos'
  const slots = {}
  for (const [path, token] of semanticTokens(doc)) {
    slots[cssName(path, namespace)] = cssValue(resolve(doc, path, mode), token.$type)
  }
  return slots
}

/** L'inventaire plat que le serveur MCP du design system servira (ADR 0004). */
export function buildResource(doc) {
  const resource = {
    $description:
      'The `tokens` resource: the single flattened source, one inventory per mode. Derived from `tokens/tokens.json` — do not edit.',
    namespace: doc?.$extensions?.['org.nomos']?.cssNamespace ?? '--nomos',
    defaultMode: defaultMode(doc),
    modes: modes(doc),
    densities: densities(doc),
    defaultDensity: defaultDensity(doc),
    slots: {},
  }
  for (const mode of resource.modes) resource.slots[mode] = slotsFor(doc, mode)
  return resource
}

const HEADER = `/*
 * Generated by scripts/build-tokens.mjs — do not edit by hand.
 * Single source: tokens/tokens.json (DTCG format, ADR 0004).
 * Replay: npm run tokens
 */`

/**
 * Le CSS dérivé. Les couleurs et les dimensions remplissent chaque mode à l'identique :
 * `:root` porte le mode par défaut, `@media (prefers-color-scheme: light)` suit le
 * système tant qu'aucune classe n'a été posée, puis les classes `.dark` / `.light` et
 * `[data-theme=…]` tranchent explicitement (ADR 0009).
 *
 * `color-scheme` accompagne chaque mode : sans lui, les contrôles natifs (barres de
 * défilement, champs) restent au thème du système dans un thème forcé.
 */
export function renderCss(doc) {
  const namespace = doc?.$extensions?.['org.nomos']?.cssNamespace ?? '--nomos'
  const def = defaultMode(doc)
  const other = modes(doc).find((m) => m !== def)

  const block = (mode, indent) => {
    const pad = ' '.repeat(indent)
    const lines = [`${pad}color-scheme: ${mode};`]
    for (const [name, value] of Object.entries(slotsFor(doc, mode))) {
      lines.push(`${pad}${name}: ${value};`)
    }
    return lines.join('\n')
  }
  const selectorBlock = (selector, mode, indent = 2) =>
    `${' '.repeat(indent)}${selector} {\n${block(mode, indent + 2)}\n${' '.repeat(indent)}}`

  const parts = [HEADER, '', '@layer base {', selectorBlock(':root', def), '']

  // Le mode non-défaut suit le système tant qu'aucune classe n'a tranché ; il n'a de
  // sens en média que pour clair/sombre (ADR 0009).
  if (other === 'light' || other === 'dark') {
    parts.push(
      `  /* No mode set on the root: the system decides (ADR 0009). */`,
      `  @media (prefers-color-scheme: ${other}) {`,
      `    :root:not(${modes(doc).map((m) => `.${m}`).join('):not(')}) {`,
      block(other, 6),
      '    }',
      '  }',
      '',
    )
  }

  for (const mode of modes(doc)) {
    parts.push(selectorBlock(`.${mode}, [data-theme='${mode}']`, mode), '')
  }

  // La densité (ADR 0008) est orthogonale au clair/sombre : une custom property sur la
  // racine multiplie l'échelle d'espacement (dans le raccord Tailwind de l'app), les
  // composants ne la lisent jamais.
  parts.push(
    `  :root { ${namespace}-density: ${densities(doc)[defaultDensity(doc)]}; }`,
    '',
  )
  for (const [name, value] of Object.entries(densities(doc))) {
    parts.push(`  [data-density='${name}'], .${name} { ${namespace}-density: ${value}; }`, '')
  }

  parts.push(
    '}',
    '',
    `/* namespace: ${namespace} — an app theme replaces these slots (ADR 0003). */`,
    '',
  )
  return parts.join('\n')
}
