import { Card, CardContent, CardHeader, CardTitle, Heading, Text } from '@nomosui/react'

import { Page } from '../components/page'
import { items } from '../data'

const stats = [
  { label: 'Items', value: items.length },
  { label: 'Active', value: items.filter((item) => item.status === 'active').length },
  { label: 'Drafts', value: items.filter((item) => item.status === 'draft').length },
]

export function DashboardPage() {
  return (
    <Page title="Dashboard" description="A three-page Nomos app — dashboard, list and form.">
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader>
              <CardTitle>{stat.value}</CardTitle>
              <Text tone="muted" size="caption">
                {stat.label}
              </Text>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <Heading level={2}>Get started</Heading>
        </CardHeader>
        <CardContent>
          <Text tone="muted">
            Open <span className="text-foreground">Items</span> to see a faceted table, or add one
            from the form.
          </Text>
        </CardContent>
      </Card>
    </Page>
  )
}
