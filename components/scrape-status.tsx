"use client"

import { useState, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Play, Pause, RefreshCw, Clock } from "lucide-react"

export function ScrapeStatus() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching scraping jobs data
    const fetchJobs = async () => {
      // In a real app, this would be an API call
      setTimeout(() => {
        setJobs([
          {
            id: 1,
            name: "Reddit Disaster Threads",
            status: "Running",
            progress: 65,
            lastRun: "10 minutes ago",
            nextRun: "50 minutes",
            frequency: "Hourly",
          },
          {
            id: 2,
            name: "Twitter #EmergencyResponse",
            status: "Running",
            progress: 82,
            lastRun: "5 minutes ago",
            nextRun: "25 minutes",
            frequency: "30 minutes",
          },
          {
            id: 3,
            name: "Local News Websites",
            status: "Paused",
            progress: 0,
            lastRun: "2 hours ago",
            nextRun: "Manual",
            frequency: "2 hours",
          },
          {
            id: 4,
            name: "Weather Service Alerts",
            status: "Running",
            progress: 45,
            lastRun: "15 minutes ago",
            nextRun: "15 minutes",
            frequency: "30 minutes",
          },
          {
            id: 5,
            name: "Government Emergency Portals",
            status: "Running",
            progress: 30,
            lastRun: "25 minutes ago",
            nextRun: "35 minutes",
            frequency: "Hourly",
          },
        ])
        setLoading(false)
      }, 1000)
    }

    fetchJobs()
  }, [])

  const getStatusBadge = (status) => {
    const colors = {
      Running: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
      Paused: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100",
      Failed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
    }
    return colors[status] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
  }

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-6">
        {jobs.map((job) => (
          <div key={job.id} className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{job.name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="outline" className={getStatusBadge(job.status)}>
                    {job.status}
                  </Badge>
                  <span>Frequency: {job.frequency}</span>
                </div>
              </div>
              <div className="flex gap-2">
                {job.status === "Running" ? (
                  <Button size="sm" variant="outline">
                    <Pause className="mr-2 h-4 w-4" />
                    Pause
                  </Button>
                ) : (
                  <Button size="sm" variant="outline">
                    <Play className="mr-2 h-4 w-4" />
                    Start
                  </Button>
                )}
                <Button size="sm" variant="outline">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Run Now
                </Button>
              </div>
            </div>
            {job.status === "Running" && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Progress</span>
                  <span>{job.progress}%</span>
                </div>
                <Progress value={job.progress} className="h-2" />
              </div>
            )}
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Last run: {job.lastRun}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Next run: {job.nextRun}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

