import { useState } from 'react'
import { Button, Collapsible, CollapsibleContent, CollapsibleTrigger } from '@nomosui/react'

export default function Example() {
  const [open, setOpen] = useState(false)
  return (
    <Collapsible open={open} onOpenChange={setOpen} className="w-full max-w-md">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">3 hidden items</span>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            {open ? 'Hide' : 'Show'}
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="pt-2 text-sm text-muted-foreground">
        The details fold away here.
      </CollapsibleContent>
    </Collapsible>
  )
}
