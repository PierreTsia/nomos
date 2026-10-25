import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { scenarioFor, scenarioNames, scenes } from './scenarios'

/**
 * La garde des scénarios (#59) : chaque exemple de brique se rend (donc compile dans le
 * build du site) et son fichier `?raw` est non vide — le snippet n'est jamais mort, c'est
 * le fichier qui a été rendu. Les scènes de la galerie (#41) ont la même garantie.
 */
describe('scénarios de brique', () => {
  it('déclare au moins un scénario', () => {
    expect(scenarioNames.length).toBeGreaterThan(0)
  })

  it('rend chaque scénario et expose son fichier source', () => {
    for (const name of scenarioNames) {
      const scenario = scenarioFor(name)
      expect(scenario, name).toBeDefined()
      const Example = scenario!.Example
      const { container } = render(<Example />)
      expect(container.innerHTML, name).not.toBe('')
      expect(scenario!.source, name).toContain('export default')
    }
  })

  it('rend un scénario absent sans planter (opt-in)', () => {
    expect(scenarioFor('does-not-exist')).toBeUndefined()
  })
})

describe('scènes de la galerie', () => {
  it('déclare au moins une scène', () => {
    expect(scenes.length).toBeGreaterThan(0)
  })

  it('chaque scène a un titre, un résumé, une source et se rend', () => {
    for (const scene of scenes) {
      expect(scene.title, scene.name).toBeTruthy()
      expect(scene.summary, scene.name).toBeTruthy()
      expect(scene.source, scene.name).toContain('export default')
      const Example = scene.Example
      const { container } = render(<Example />)
      expect(container.innerHTML, scene.name).not.toBe('')
    }
  })
})
