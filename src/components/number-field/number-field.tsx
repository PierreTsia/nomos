import type { ComponentProps } from 'react'

import { Input } from '@nomos/components/input/input'

/**
 * Le champ numérique du cœur : un `<input>` en `type="number"`, donc le pas (`step`) et
 * les bornes (`min`/`max`) viennent du natif. Aucune validation ni i18n : la valeur et le
 * rappel restent chez l'appelant, comme `Input` (ADR 0015).
 */
export function NumberField({ type = 'number', ...props }: ComponentProps<'input'>) {
  return <Input type={type} {...props} />
}
