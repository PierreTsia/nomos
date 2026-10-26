export type ItemStatus = 'active' | 'draft' | 'archived'

export type Item = {
  id: string
  name: string
  status: ItemStatus
  updated: string
}

/** A small in-memory dataset — the app owns its data (ADR 0002). Replace with a fetch. */
export const items: Item[] = [
  { id: 'itm-1', name: 'Design review', status: 'active', updated: '2026-05-02' },
  { id: 'itm-2', name: 'Token audit', status: 'active', updated: '2026-04-28' },
  { id: 'itm-3', name: 'Release notes', status: 'draft', updated: '2026-05-01' },
  { id: 'itm-4', name: 'Onboarding flow', status: 'archived', updated: '2026-03-15' },
  { id: 'itm-5', name: 'Accessibility pass', status: 'active', updated: '2026-04-22' },
  { id: 'itm-6', name: 'Billing migration', status: 'draft', updated: '2026-05-03' },
]
