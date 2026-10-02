/**
 * Le vocabulaire de tons du cœur : sept **intentions**, pas sept couleurs. Un badge de
 * statut choisit l'intention (« danger », « succès »), et c'est le cœur qui sait la
 * rendre — l'app ne manipule plus un nom de couleur.
 *
 * Chaque ton lit trois emplacements sémantiques (`status-<ton>` pour l'accent, la
 * bordure ; `status-<ton>-surface` pour le fond, **plein** — une carte qui flotte
 * au-dessus du contenu ne doit pas laisser voir ce qui passe dessous ; et `status-<ton>-ink`
 * pour l'encre) : c'est le token qui porte le mode, pas la classe, donc le cœur ne connaît
 * jamais le mode (ADR 0004, ADR 0027).
 */
export const TONES = [
  'neutral',
  'info',
  'progress',
  'attention',
  'warning',
  'danger',
  'success',
] as const

export type Tone = (typeof TONES)[number]

export const toneClasses: Record<Tone, string> = {
  neutral: 'border-transparent bg-muted text-muted-foreground',
  info: 'border-status-info/30 bg-status-info-surface text-status-info-ink',
  progress: 'border-status-progress/30 bg-status-progress-surface text-status-progress-ink',
  attention: 'border-status-attention/30 bg-status-attention-surface text-status-attention-ink',
  warning: 'border-status-warning/30 bg-status-warning-surface text-status-warning-ink',
  danger: 'border-status-danger/30 bg-status-danger-surface text-status-danger-ink',
  success: 'border-status-success/30 bg-status-success-surface text-status-success-ink',
}
