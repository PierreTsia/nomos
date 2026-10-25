import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@nomosui/react'

export default function Example() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover me</Button>
        </TooltipTrigger>
        <TooltipContent>Saved 2 minutes ago</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
