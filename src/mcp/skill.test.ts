import { readFileSync } from 'node:fs'
import path from 'node:path'

import { componentNames } from '@nomos/mcp/catalogue'

/**
 * The package's skill (#11) is the prose that says which brick to reach for. This test holds
 * it against the catalogue: it must inventory exactly the bricks that exist — not one fewer
 * (an uncovered brick turns red), not one more (a cited brick that no longer exists does too).
 */

const SKILL = path.resolve(import.meta.dirname, '..', '..', 'SKILL.md')

const INVENTORY =
  /<!--\s*inventory\s*:\s*start[^>]*-->([\s\S]*?)<!--\s*inventory\s*:\s*end\s*-->/

const BOOTSTRAPPER =
  /<!--\s*bootstrapper\s*:\s*start[^>]*-->([\s\S]*?)<!--\s*bootstrapper\s*:\s*end\s*-->/

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

describe('the design-system skill', () => {
  it('inventories exactly the catalogue bricks', () => {
    expect(inventory(skillText()).sort()).toEqual([...componentNames].sort())
  })

  it('describes the v2 agentic surface: `ui://` views and composite scenes', () => {
    const text = skillText()

    expect(text).toContain('ui://nomos/')
    expect(text).toContain('list_scenes')
    expect(text).toContain('render_scene_')
  })

  it('carries the bootstrapper recipe: prompt → scaffold → bricks → skin → run', () => {
    const block = skillText().match(BOOTSTRAPPER)?.[1] ?? ''

    expect(block).toContain('templates/starter')
    expect(block).toContain('skin.json')
    expect(block).toContain('resolveSkin')
    expect(block).toContain('npm run dev')
  })
})
