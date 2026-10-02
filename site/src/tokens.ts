import tokens from '@nomosui/react/tokens/tokens.json'

export type TokenSlot = {
  path: string
  modes: Record<string, string>
}

type Node = Record<string, unknown>

const isToken = (value: unknown): value is { $value: Record<string, string> } =>
  typeof value === 'object' && value !== null && '$value' in value

function walk(node: Node, prefix: string, out: TokenSlot[]): void {
  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith('$')) continue
    const path = prefix ? `${prefix}.${key}` : key
    if (isToken(value)) out.push({ path, modes: value.$value })
    else if (typeof value === 'object' && value !== null) walk(value as Node, path, out)
  }
}

/**
 * The semantic slots, read from the single source (`tokens.json`, ADR 0004): names, never
 * values. A skin fills the values; the site only ever shows the interface.
 */
const semantic = (tokens as { semantic: Node }).semantic

export const tokenSlots: TokenSlot[] = (() => {
  const out: TokenSlot[] = []
  for (const [group, node] of Object.entries(semantic)) {
    if (group.startsWith('$')) continue
    walk(node as Node, group, out)
  }
  return out
})()

export const tokenGroups: string[] = [...new Set(tokenSlots.map((slot) => slot.path.split('.')[0]))]
