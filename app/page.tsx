"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DisasterMap } from "@/components/disaster-map"
import { NewsScroller } from "@/components/news-scroller"
import { PriorityList } from "@/components/priority-list"
import { SupplyOverview } from "@/components/supply-overview"
import { AlertStatus } from "@/components/alert-status"
import { ScrapeStatus } from "@/components/scrape-status"
import { SourcesOverview } from "@/components/sources-overview"
import { useRouter } from "next/navigation"
import axios from "axios"

function DashboardIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  )
}

export default function Home() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await axios.get('/api/users/logout')
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <div className="flex-1" />
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <AlertIcon className="h-6 w-6" />
          <span className="text-xl">DisasterResponse</span>
        </Link>
        <div className="flex-1 flex justify-end ">
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="hover:cursor-pointer transition-all duration-300 hover:bg-red-300 hover:text-gray-900 rounded-md p-2" onClick={handleLogout}>
              Logout
            </Button>

          </div>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <AlertStatus />
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="news">News Feed</TabsTrigger>
            <TabsTrigger value="map">Map</TabsTrigger>
            <TabsTrigger value="sources">Data Sources</TabsTrigger>
            <TabsTrigger value="scraping">Scraping Status</TabsTrigger>
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
              <CardContent>
                <NewsScroller />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="map" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Disaster Map</CardTitle>
                  <CardDescription>Geographic overview of disaster zones in India</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="aspect-square w-full">
                    <DisasterMap />
                  </div>
                </CardContent>
              </Card>
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Disaster Locations</CardTitle>
                  <CardDescription>List of all active disaster zones in India</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Flood - Assam</p>
                        <p className="text-sm text-muted-foreground">Severity: High | Affected: 2.1M</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-2 w-2 rounded-full bg-red-500" />
                        <span className="text-sm text-muted-foreground">High Priority</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Cyclone - Odisha</p>
                        <p className="text-sm text-muted-foreground">Category: 3 | Affected: 1.8M</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-2 w-2 rounded-full bg-red-500" />
                        <span className="text-sm text-muted-foreground">High Priority</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Drought - Maharashtra</p>
                        <p className="text-sm text-muted-foreground">Severity: Medium | Affected: 1.5M</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-2 w-2 rounded-full bg-orange-500" />
                        <span className="text-sm text-muted-foreground">Medium Priority</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Landslide - Uttarakhand</p>
                        <p className="text-sm text-muted-foreground">Area: 50km² | Affected: 0.5M</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-2 w-2 rounded-full bg-yellow-500" />
                        <span className="text-sm text-muted-foreground">Low Priority</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    View All Locations
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="sources" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Data Sources</CardTitle>
                <CardDescription>Active sources and data quality metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <SourcesOverview />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="scraping" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Web Scraping Status</CardTitle>
                <CardDescription>Current scraping jobs and schedules</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrapeStatus />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

function AlertIcon(props: React.SVGProps<SVGSVGElement>) {
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

