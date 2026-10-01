import type { ComponentManifest } from '@nomos/catalogue/contract'

/** Le manifeste du séparateur (ADR 0005). */
export const separatorManifest: ComponentManifest = {
  name: 'separator',
  title: 'Separator',
  summary:
    'Un trait de bordure qui sépare deux contenus, horizontal ou vertical. Décoratif par ' +
    'défaut : il ne porte aucun sens pour un lecteur d’écran sauf demande explicite.',
  level: 'primitive',
  example: { orientation: 'horizontal' },
  variants: [],
  props: [
    {
      name: 'orientation',
      type: "'horizontal' | 'vertical'",
      required: false,
      check: 'rendered',
      description: 'Le sens du trait ; horizontal par défaut.',
    },
    {
      name: 'decorative',
      type: 'boolean',
      required: false,
      check: 'accepted',
      description: 'Décoratif (vrai par défaut) : masqué aux technologies d’assistance.',
    },
    {
      name: 'className',
      type: 'string',
      required: false,
      check: 'class',
      description: "Les classes de l'appelant, fusionnées après celles du cœur.",
    },
  ],
  usages: [
    {
      when: 'séparer deux blocs dans une carte ou une barre',
      use: '<Separator />',
      avoid: 'une bordure manuelle : le séparateur porte la couleur de bordure des tokens',
    },
    {
      when: 'un trait vertical entre deux contrôles alignés',
      use: '<Separator orientation="vertical" className="h-5" />',
      avoid: 'oublier la hauteur : un séparateur vertical n’a pas de taille propre',
    },
  ],
}
