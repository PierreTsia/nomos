import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@nomosui/react'

export default function Example() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle>Nightly build</CardTitle>
          <Badge variant="secondary">passed</Badge>
        </div>
        <CardDescription>Run 412 · 3 minutes ago</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">128 tests, 0 failures.</CardContent>
      <CardFooter>
        <Button variant="outline" size="sm">
          Details
        </Button>
      </CardFooter>
    </Card>
  )
}
