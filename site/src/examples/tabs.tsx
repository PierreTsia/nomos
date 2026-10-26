import { Tabs, TabsContent, TabsList, TabsTrigger } from '@nomosui/react'

export default function Example() {
  return (
    <Tabs defaultValue="overview" className="w-full max-w-md">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="text-sm text-muted-foreground">
        A short summary of the item.
      </TabsContent>
      <TabsContent value="activity" className="text-sm text-muted-foreground">
        The recent events on the item.
      </TabsContent>
    </Tabs>
  )
}
