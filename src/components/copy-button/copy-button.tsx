import { useEffect, useState, type ReactNode } from 'react'

import { Button, buttonVariantsConfig, type ButtonProps } from '@nomos/components/button/button'

/**
 * La config de variantes du CopyButton : celle du Button, réutilisée telle quelle. Le
 * catalogue la lit pour vérifier que le manifeste ne dérive pas des props réelles
 * (ADR 0005).
 */
export const copyButtonVariantsConfig = buttonVariantsConfig

/** Le temps pendant lequel le libellé « copié » reste affiché avant de revenir. */
const COPIED_MS = 2000

export type CopyButtonProps = {
  /** Le texte à copier dans le presse-papiers (`navigator.clipboard.writeText`). */
  value: string
  /** Le libellé au repos. Défaut neutre, l'app peut le traduire. */
  label?: string
  /** Le libellé transitoire après copie. Défaut neutre, l'app peut le traduire. */
  copiedLabel?: string
  /** Une icône fournie par l'appelant : le cœur n'expose pas d'icônes. */
  icon?: ReactNode
  /** Le ton, repris du Button. */
  variant?: ButtonProps['variant']
  /** La densité, reprise du Button. */
  size?: ButtonProps['size']
  /** Les classes de l'appelant, fusionnées après celles du cœur. */
  className?: string
}

/**
 * Le bouton de copie : il écrit `value` dans le presse-papiers et affiche un libellé
 * transitoire. Copier du texte arbitraire n'est pas un souci d'app (ADR 0002) ; les
 * libellés et l'icône sont injectés, le cœur n'a pas d'i18n.
 */
export function CopyButton({
  value,
  label = 'Copy',
  copiedLabel = 'Copied',
  icon,
  variant,
  size,
  className,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  // Le retour au libellé normal est un effet : le timer se nettoie au démontage.
  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), COPIED_MS)
    return () => clearTimeout(timer)
  }, [copied])

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      onClick={() => {
        void navigator.clipboard.writeText(value).then(() => setCopied(true))
      }}
    >
      {icon ? <span aria-hidden>{icon}</span> : null}
      {copied ? copiedLabel : label}
    </Button>
  )
}
