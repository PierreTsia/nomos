import { TONES, toneClasses } from '@nomos/lib/tone'

/** Le vocabulaire de tons : une intention pour chaque ton, aucune couleur nommée à l'extérieur. */
describe('le vocabulaire de tons', () => {
  it('rend une classe pour chaque ton', () => {
    for (const tone of TONES) {
      expect(toneClasses[tone], tone).toBeTruthy()
    }
  })

  it('le ton neutre reste discret', () => {
    expect(toneClasses.neutral).toContain('text-muted-foreground')
  })

  it('le ton danger lit son emplacement de statut', () => {
    expect(toneClasses.danger).toContain('status-danger')
  })

  it('peint un fond plein, jamais une opacité de classe (ADR 0027)', () => {
    for (const tone of TONES.filter((value) => value !== 'neutral')) {
      expect(toneClasses[tone], tone).toContain(`bg-status-${tone}-surface`)
      expect(toneClasses[tone], tone).not.toMatch(/\bbg-[\w-]+\/\d/)
    }
  })
})
