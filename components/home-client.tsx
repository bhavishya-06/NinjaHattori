"use client"

// Import necessary hooks and components
import Link from "next/link"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DisasterMap } from "@/components/disaster-map"
import { NewsScroller } from "@/components/news-scroller"
import { PriorityList } from "@/components/priority-list"
import { SupplyOverview } from "@/components/supply-overview"
import { AlertStatus } from "@/components/alert-status"
import { SuppliesNeeded } from "@/components/supplies-needed"
import { AlertTriangle, Droplets, Wind, Flame } from "lucide-react"
import type { DisasterInfo } from "../app/page";

// Define props expected from the Server Component
interface HomeClientProps {
  numberOfDisasters: number;
  disasters: DisasterInfo[];
}

export function HomeClient({ numberOfDisasters, disasters }: HomeClientProps) {
  const router = useRouter()

  // Calculate counts for specific disaster types
  const floodCount = disasters.filter(d => d.type.toLowerCase() === 'flood').length;
  const earthquakeCount = disasters.filter(d => d.type.toLowerCase() === 'earthquake').length;
  const wildfireCount = disasters.filter(d => d.type.toLowerCase() === 'wildfire').length;

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
      {/* Header */}
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <div className="flex-1" />
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <AlertTriangle className="h-6 w-6 text-primary" />
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

      {/* Main content */}
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <AlertStatus
            activeAlertsCount={numberOfDisasters}
            floodCount={floodCount}
            earthquakeCount={earthquakeCount}
            wildfireCount={wildfireCount}
          />
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="map">Map</TabsTrigger>
            <TabsTrigger value="supplies">Supplies Needed</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Active Disasters</CardTitle>
                  <CardDescription>Current active disasters with details</CardDescription>
                </CardHeader>
                <CardContent>
                  <PriorityList disasters={disasters} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Supply Status</CardTitle>
                  <CardDescription>Current inventory and distribution status</CardDescription>
                </CardHeader>
                <CardContent>
                  <SupplyOverview />
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link href="/supplies">
                      Manage Supplies
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Latest Updates</CardTitle>
                  <CardDescription>Recent news and social media reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <NewsScroller />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="map" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-1">
                <Card className="md:col-span-1">
                  <CardHeader>
                     <CardTitle>Disaster Map</CardTitle>
                     <CardDescription>Geographic overview of current disaster zones</CardDescription>
                   </CardHeader>
                   <CardContent className="p-0">
                     <div className="aspect-video w-full">
                       <DisasterMap />
                     </div>
                   </CardContent>
                 </Card>
              </div>
          </TabsContent>
          <TabsContent value="supplies" className="space-y-4">
            <SuppliesNeeded disastersWithNeeds={disasters} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
} 