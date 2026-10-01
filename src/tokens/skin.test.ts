import { resolveSkin } from '@nomos/tokens/skin'

/**
 * Le contrat de skin (ADR 0022) : un overlay sémantique posé sur le défaut du cœur.
 * Absent → hérite ; inconnu → lève ; `primitive` interdite. La fusion est pure.
 */
const defaultDoc = {
  primitive: { color: { ink: { $type: 'color', $value: 'raw' } } },
  semantic: {
    color: {
      background: {
        $type: 'color',
        $value: {
          dark: { colorSpace: 'hsl', components: [240, 7, 8] },
          light: { colorSpace: 'hsl', components: [0, 0, 100] },
        },
      },
      primary: { $type: 'color', $value: { colorSpace: 'hsl', components: [174, 100, 39] } },
    },
  },
}

describe('le skin', () => {
  it('sans overlay, rend le défaut tel quel', () => {
    expect(resolveSkin(defaultDoc)).toBe(defaultDoc)
    expect(resolveSkin(defaultDoc, {})).toBe(defaultDoc)
  })

  it('remplace un emplacement sémantique et laisse les autres hériter', () => {
    const merged = resolveSkin(defaultDoc, {
      semantic: { color: { primary: { $value: { colorSpace: 'hsl', components: [1, 2, 3] } } } },
    })

    expect((merged.semantic as never as typeof defaultDoc.semantic).color.primary.$value).toEqual({
      colorSpace: 'hsl',
      components: [1, 2, 3],
    })
    expect((merged.semantic as never as typeof defaultDoc.semantic).color.background.$value).toEqual(
      defaultDoc.semantic.color.background.$value,
    )
    // Le défaut n'est pas muté.
    expect(defaultDoc.semantic.color.primary.$value).toEqual({ colorSpace: 'hsl', components: [174, 100, 39] })
  })

  it('hérite du `$type` du défaut quand l’overlay ne le redonne pas', () => {
    const merged = resolveSkin(defaultDoc, {
      semantic: { color: { primary: { $value: { colorSpace: 'hsl', components: [1, 2, 3] } } } },
    })

    expect((merged.semantic as never as typeof defaultDoc.semantic).color.primary.$type).toBe('color')
  })

  it('lève sur un emplacement inconnu — l’interface de thème est celle du défaut', () => {
    expect(() =>
      resolveSkin(defaultDoc, {
        semantic: { color: { backgrounds: { $value: 'x' } } },
      }),
    ).toThrow(/emplacement inconnu/)
  })

  it('refuse une `primitive` dans un skin — le cœur garde les valeurs brutes', () => {
    expect(() =>
      resolveSkin(defaultDoc, { primitive: { color: { ink: { $value: 'x' } } } }),
    ).toThrow(/primitive/)
  })
})
