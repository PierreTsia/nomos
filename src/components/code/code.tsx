import type { ComponentProps } from 'react'

import { cn } from '@nomos/lib/cn'

/**
 * Le code inline : une surface monospace discrète, posée dans une phrase. Le fond
 * inset, la bordure et le rayon viennent des tokens du cœur ; la coloration
 * syntaxique reste à l'app (ADR 0002).
 */
export type CodeProps = ComponentProps<'code'>

export function Code({ className, ...props }: CodeProps) {
  return (
    <code
      className={cn(
        'rounded border bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground',
        className,
      )}
      {...props}
    />
  )
}
