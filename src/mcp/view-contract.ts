/**
 * Le contrat de message entre une vue MCP App et son hôte (ADR 0013). Il vit hors de
 * `app-view.ts` — qui lit des fichiers côté serveur — parce que le pont est aussi
 * bundlé dans la vue, côté navigateur.
 */

export const VIEW_SOURCE = 'nomos'
export const VIEW_ROOT_ID = 'nomos-view'
export const VIEW_DATA_ID = 'nomos-view-data'

/** La vue **émet des intentions** : elle ne mute jamais l'état de l'hôte. */
export type ViewIntent = {
  source: typeof VIEW_SOURCE
  type: 'intent'
  action: string
  detail: unknown
}

/** L'hôte pousse l'apparence, et les données de la vue (ADR 0023). */
export type HostMessage =
  | { source: typeof VIEW_SOURCE; type: 'set-view'; theme?: string; density?: string }
  | { source: typeof VIEW_SOURCE; type: 'set-data'; data: Record<string, unknown> }
