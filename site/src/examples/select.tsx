import {
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@nomosui/react'

export default function Example() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <Label htmlFor="scene-select">Status</Label>
      <Select defaultValue="open">
        <SelectTrigger id="scene-select">
          <SelectValue placeholder="Pick a status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="open">Open</SelectItem>
          <SelectItem value="closed">Closed</SelectItem>
          <SelectItem value="archived">Archived</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
