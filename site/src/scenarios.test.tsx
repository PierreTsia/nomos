import { render } from '@testing-library/react'
import { catalogue } from '@nomosui/react'
import { describe, expect, it } from 'vitest'
import { brickSnippets, sceneSnippets } from 'virtual:nomos-snippets'

import { scenarioFor, scenarioNames, scenes } from './scenarios'

/**
 * The snippet guard (#59): every brick example renders (so it compiles in the site build) and
 * carries a non-empty highlighted snippet — the snippet is the file that was rendered, it
 * cannot be dead. The gallery scenes (#41) get the same guarantee.
 */
describe('scénarios de brique', () => {
  it('déclare au moins un scénario', () => {
    expect(scenarioNames.length).toBeGreaterThan(0)
  })

  it('rend chaque scénario et expose son snippet coloré', () => {
    for (const name of scenarioNames) {
      const Scenario = scenarioFor(name)!
      expect(Scenario, name).toBeDefined()
      const { container } = render(<Scenario />)
      expect(container.innerHTML, name).not.toBe('')
      const code = brickSnippets[name]?.scenario
      expect(code, name).toBeDefined()
      expect(code!.raw, name).toContain('export default')
      expect(code!.html, name).toContain('var(--color')
    }
  })

  it('rend un scénario absent sans planter (opt-in)', () => {
    expect(scenarioFor('does-not-exist')).toBeUndefined()
  })

  it("chaque exemple du catalogue a un snippet d'interface coloré", () => {
    for (const { manifest } of catalogue) {
      if (!manifest.example) continue
      const code = brickSnippets[manifest.name]?.interface
      expect(code, manifest.name).toBeDefined()
      expect(code!.html, manifest.name).toContain('var(--color')
    }
  })
})

describe('scènes de la galerie', () => {
  it('déclare au moins une scène', () => {
    expect(scenes.length).toBeGreaterThan(0)
  })

  it('chaque scène a un titre, un résumé, un snippet et se rend', () => {
    for (const scene of scenes) {
      expect(scene.title, scene.name).toBeTruthy()
      expect(scene.summary, scene.name).toBeTruthy()
      const code = sceneSnippets[scene.name]
      expect(code, scene.name).toBeDefined()
      expect(code.raw, scene.name).toContain('export default')
      const Example = scene.Example
      const { container } = render(<Example />)
      expect(container.innerHTML, scene.name).not.toBe('')
    }
  })
})
