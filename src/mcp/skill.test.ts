import { readFileSync } from 'node:fs'
import path from 'node:path'

import { componentNames } from '@nomos/mcp/catalogue'

/**
 * La skill du paquet (#11) est la prose qui dit quelle brique prendre pour quel usage.
 * Ce test la tient au contact du catalogue : elle doit inventorier exactement les
 * briques qui existent — pas une de moins (une brique non couverte rougit), pas une
 * de plus (une brique citée qui n'existe plus rougit).
 */

const SKILL = path.resolve(import.meta.dirname, '..', '..', 'SKILL.md')

const INVENTORY =
  /<!--\s*inventaire\s*:\s*début[^>]*-->([\s\S]*?)<!--\s*inventaire\s*:\s*fin\s*-->/

function skillText(): string {
  return readFileSync(SKILL, 'utf8')
}

function inventory(text: string): string[] {
  const block = text.match(INVENTORY)?.[1] ?? ''
  return block
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
}

describe('la skill du design system', () => {
  it('inventorie exactement les briques du catalogue', () => {
    expect(inventory(skillText()).sort()).toEqual([...componentNames].sort())
  })

  it('décrit la surface agentique v2 : vues `ui://` et scènes composites', () => {
    const text = skillText()

    expect(text).toContain('ui://nomos/')
    expect(text).toContain('list_scenes')
    expect(text).toContain('render_scene_')
  })
})
