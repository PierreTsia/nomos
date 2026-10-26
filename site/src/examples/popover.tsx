import { Button, Popover, PopoverContent, PopoverTrigger } from '@nomosui/react'

export default function Example() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Preview</Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 text-sm">
        A floating surface, anchored to its trigger, with token elevation.
      </PopoverContent>
    </Popover>
  )
}
