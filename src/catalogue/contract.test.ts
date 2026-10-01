import { componentManifestSchema } from '@nomos/catalogue/contract'
import { badgeManifest } from '@nomos/components/badge/manifest'

/**
 * Le contrat du manifeste (ADR 0005). Ces tests tiennent la forme : un manifeste
 * incomplet doit être refusé à l'import du catalogue, pas découvert dans la page de
 * style. La cohérence avec les props réelles est tenue par `coherence.test.ts`.
 */
describe('le contrat du manifeste', () => {
  it('accepte le manifeste du Badge', () => {
    expect(componentManifestSchema.safeParse(badgeManifest).success).toBe(true)
  })

  it('refuse un manifeste sans usage — un type sans intention ne sert pas un agent', () => {
    const result = componentManifestSchema.safeParse({ ...badgeManifest, usages: [] })

    expect(result.success).toBe(false)
    expect(JSON.stringify(result.error?.issues)).toContain('des usages')
  })

  it('refuse un champ inconnu au lieu de l’ignorer', () => {
    const result = componentManifestSchema.safeParse({ ...badgeManifest, tone: 'neutre' })

    expect(result.success).toBe(false)
  })

  it('accepte une prop de données vérifiée par `accepted`', () => {
    const result = componentManifestSchema.safeParse({
      ...badgeManifest,
      props: [
        {
          name: 'onPick',
          type: '(value: string) => void',
          required: false,
          check: 'accepted',
          description: 'Un rappel : il ne se voit pas dans le DOM, on prouve qu’il est accepté.',
        },
      ],
    })

    expect(result.success).toBe(true)
  })

  it('refuse un check qui n’est pas un mode connu', () => {
    const result = componentManifestSchema.safeParse({
      ...badgeManifest,
      props: [
        {
          name: 'onPick',
          type: '(value: string) => void',
          required: false,
          check: 'sondé',
          description: 'mode inconnu',
        },
      ],
    })

    expect(result.success).toBe(false)
  })

  it('refuse un nom qui n’est pas en kebab-case', () => {
    const result = componentManifestSchema.safeParse({ ...badgeManifest, name: 'Badge' })

    expect(result.success).toBe(false)
  })

  it('refuse une variante sans valeur', () => {
    const result = componentManifestSchema.safeParse({
      ...badgeManifest,
      variants: [{ name: 'variant', values: [], description: 'vide' }],
    })

    expect(result.success).toBe(false)
  })

  it('refuse un niveau qui n’est pas jeton, primitive ou bloc', () => {
    const result = componentManifestSchema.safeParse({ ...badgeManifest, level: 'molécule' })

    expect(result.success).toBe(false)
  })
})