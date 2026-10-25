import {
  Alert,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Meter,
  ProgressBar,
} from '@nomosui/react'

export const title = 'A status panel'
export const summary = 'A card that states a state: a badge, a meter, a progress bar and a banner.'

export default function Example() {
  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle>Indexer</CardTitle>
          <Badge variant="secondary">running</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Meter label="coverage" value={82} max={100} threshold={80} />
        <ProgressBar value={60} max={100} label="backfill" showValue />
        <Alert tone="warning" title="Token missing">
          A value is not configured — a gap, not a zero.
        </Alert>
        <div className="flex justify-end">
          <Button variant="outline" size="sm">
            Reindex
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
