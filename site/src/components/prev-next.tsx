import { Link } from '@nomosui/react'

import { bricks } from '../catalogue'
import { useI18n } from '../i18n'

const linkClass = 'text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline'

/**
 * The catalogue's reading order, walked by index: prev/next vanish at the ends.
 */
export function PrevNext({ name }: { name: string }) {
  const { t } = useI18n()
  const index = bricks.findIndex((brick) => brick.name === name)
  if (index === -1) return null

  const prev = bricks[index - 1]
  const next = bricks[index + 1]
  if (!prev && !next) return null

  return (
    <nav
      className="flex items-center justify-between gap-4 border-t border-border pt-6"
      aria-label={t.prevNext.navLabel}
    >
      {prev ? (
        <Link href={`#/brick/${prev.name}`} aria-label={t.prevNext.previous} className={linkClass}>
          ← {prev.title}
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link href={`#/brick/${next.name}`} aria-label={t.prevNext.next} className={linkClass}>
          {next.title} →
        </Link>
      ) : (
        <span />
      )}
    </nav>
  )
}
