import {
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@nomosui/react'

export default function Example() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open panel</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>Narrow the list down.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}
