import { createContext, useContext, type ComponentProps } from 'react'
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group'
import type { VariantProps } from 'class-variance-authority'

import { toggleVariants } from '@nomos/components/toggle/toggle'
import { cn } from '@nomos/lib/cn'

type ToggleGroupVariants = VariantProps<typeof toggleVariants>

/**
 * Le groupe de bascules : un choix segmenté (`type="single"`) ou multiple. Le variant et
 * la taille se posent sur le groupe et se propagent aux items ; l'état appartient à
 * l'app (ADR 0015). Les items sont des parts importables séparément.
 */
const ToggleGroupContext = createContext<ToggleGroupVariants>({ variant: 'default', size: 'default' })

export function ToggleGroup({
  className,
  variant,
  size,
  children,
  ...props
}: ComponentProps<typeof ToggleGroupPrimitive.Root> & ToggleGroupVariants) {
  return (
    <ToggleGroupPrimitive.Root className={cn('flex items-center gap-1', className)} {...props}>
      <ToggleGroupContext.Provider value={{ variant, size }}>{children}</ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  )
}

export function ToggleGroupItem({
  className,
  variant,
  size,
  ...props
}: ComponentProps<typeof ToggleGroupPrimitive.Item> & ToggleGroupVariants) {
  const context = useContext(ToggleGroupContext)
  return (
    <ToggleGroupPrimitive.Item
      className={cn(
        toggleVariants({ variant: context.variant ?? variant, size: context.size ?? size }),
        className,
      )}
      {...props}
    />
  )
}
