import { Component, type ReactNode } from 'react'

import type { CatalogueEntry } from '@nomosui/react'

import { useI18n } from '../i18n'

class PreviewBoundary extends Component<
  { children: ReactNode; fallback: string },
  { error: unknown | null }
> {
  state: { error: unknown | null } = { error: null }

  static getDerivedStateFromError(error: unknown) {
    return { error }
  }

  render() {
    if (this.state.error) {
      const message =
        this.state.error instanceof Error ? this.state.error.message : this.props.fallback
      return <p className="text-sm text-destructive">{message}</p>
    }
    return this.props.children
  }
}

/**
 * The live brick, rendered with the props its manifest carries. The core proves every
 * example renders (coherence test); here an error boundary keeps one bad brick from
 * taking the page down.
 */
export function Preview({ entry }: { entry: CatalogueEntry }) {
  const { t } = useI18n()
  const { component: Rendered, manifest } = entry
  if (!manifest.example) {
    return <p className="text-sm text-muted-foreground">{t.preview.noExample}</p>
  }
  return (
    <PreviewBoundary fallback={t.preview.failed}>
      <Rendered {...manifest.example} />
    </PreviewBoundary>
  )
}
