import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DisasterMap } from "@/components/disaster-map"
import { NewsScroller } from "@/components/news-scroller"
import { PriorityList } from "@/components/priority-list"
import { SupplyOverview } from "@/components/supply-overview"
import { AlertStatus } from "@/components/alert-status"

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <AlertIcon className="h-6 w-6" />
          <span>DisasterResponse</span>
        </Link>
        <nav className="ml-auto flex gap-2">
          <Button variant="ghost" className="bg-blue-100 rounded-md transition delay-100 hover:bg-blue-200 shadow-sm" size="sm" asChild>
            <Link href="/dashboard">Dashboard</Link>
          </Button>

        </nav>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <AlertStatus />
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="news">News Feed</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Active Disasters</CardTitle>
                  <CardDescription>Current active disaster zones requiring attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <PriorityList />
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    View All
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Supply Status</CardTitle>
                  <CardDescription>Current inventory and distribution status</CardDescription>
                </CardHeader>
                <CardContent>
                  <SupplyOverview />
                </CardContent>
                <Link href="/supplies">
                  <CardFooter>
                    {/* manage supplies button functionality */}
                      <Button variant="outline" size="sm" className="w-full">
                        Manage Supplies
                      </Button>
                  </CardFooter>
                </Link>
              </Card>
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Latest Updates</CardTitle>
                  <CardDescription>Recent news and social media reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <NewsScroller />
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    View All News
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="news" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>News Feed</CardTitle>
                <CardDescription>Latest disaster-related news and social media updates</CardDescription>
              </CardHeader>
              <CardContent>{/* Expanded news feed will go here */}</CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

function AlertIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 8.56a2 2 0 0 0-3.5-1.3L2.69 19.75a2 2 0 0 0 1.74 3h15.14a2 2 0 0 0 1.74-3L15.5 7.26a2 2 0 0 0-3.5 1.3" />
      <path d="M12 16v.01" />
    </svg>
  )
}

