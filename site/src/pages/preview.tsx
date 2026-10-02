import { Component, type ReactNode } from 'react'

import type { CatalogueEntry } from '@nomosui/react'

class PreviewBoundary extends Component<{ children: ReactNode }, { message: string | null }> {
  state: { message: string | null } = { message: null }

  static getDerivedStateFromError(error: unknown) {
    return { message: error instanceof Error ? error.message : 'Preview failed' }
  }

  render() {
    if (this.state.message) return <p className="text-sm text-destructive">{this.state.message}</p>
    return this.props.children
  }
}

/**
 * The live brick, rendered with the props its manifest carries. The core proves every
 * example renders (coherence test); here an error boundary keeps one bad brick from
 * taking the page down.
 */
export function Preview({ entry }: { entry: CatalogueEntry }) {
  const { component: Rendered, manifest } = entry
  if (!manifest.example) {
    return <p className="text-sm text-muted-foreground">No example props for this brick.</p>
  }
  return (
    <PreviewBoundary>
      <Rendered {...manifest.example} />
    </PreviewBoundary>
  )
}
