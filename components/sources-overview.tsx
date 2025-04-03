"use client"

import { useState, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { ExternalLink, Settings } from "lucide-react"

export function SourcesOverview() {
  const [sources, setSources] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching sources data
    const fetchSources = async () => {
      // In a real app, this would be an API call
      setTimeout(() => {
        setSources([
          {
            id: 1,
            name: "Reddit",
            type: "Social Media",
            status: "Active",
            reliability: 75,
            coverage: 85,
            subreddits: ["r/weather", "r/hurricane", "r/emergencyresponse"],
          },
          {
            id: 2,
            name: "Twitter",
            type: "Social Media",
            status: "Active",
            reliability: 65,
            coverage: 90,
            hashtags: ["#disaster", "#emergency", "#relief", "#hurricane"],
          },
          {
            id: 3,
            name: "NOAA",
            type: "Government",
            status: "Active",
            reliability: 95,
            coverage: 70,
            apis: ["Weather API", "Hurricane Tracker API"],
          },
          {
            id: 4,
            name: "Local News Network",
            type: "News",
            status: "Active",
            reliability: 80,
            coverage: 60,
            websites: ["cnn.com", "foxnews.com", "localnews.com"],
          },
          {
            id: 5,
            name: "FEMA",
            type: "Government",
            status: "Active",
            reliability: 90,
            coverage: 75,
            apis: ["Disaster Declaration API", "Relief Centers API"],
          },
        ])
        setLoading(false)
      }, 1000)
    }

    fetchSources()
  }, [])

  const getReliabilityColor = (reliability) => {
    if (reliability >= 80) return "bg-green-500"
    if (reliability >= 60) return "bg-amber-500"
    return "bg-red-500"
  }

  const getTypeBadgeColor = (type) => {
    const colors = {
      "Social Media": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
      Government: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
      News: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
    }
    return colors[type] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
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
        {sources.map((source) => (
          <div key={source.id} className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{source.name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="outline" className={getTypeBadgeColor(source.type)}>
                    {source.type}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                  >
                    {source.status}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Visit
                </Button>
                <Button size="sm" variant="outline">
                  <Settings className="mr-2 h-4 w-4" />
                  Configure
                </Button>
              </div>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Reliability</span>
                  <span>{source.reliability}%</span>
                </div>
                <Progress value={source.reliability} className={getReliabilityColor(source.reliability)} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Coverage</span>
                  <span>{source.coverage}%</span>
                </div>
                <Progress value={source.coverage} className="bg-blue-500" />
              </div>
            </div>
            <div className="mt-4">
              {source.subreddits && (
                <div className="mt-2">
                  <span className="text-sm font-medium">Subreddits:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {source.subreddits.map((subreddit, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {subreddit}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {source.hashtags && (
                <div className="mt-2">
                  <span className="text-sm font-medium">Hashtags:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {source.hashtags.map((hashtag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {hashtag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {source.apis && (
                <div className="mt-2">
                  <span className="text-sm font-medium">APIs:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {source.apis.map((api, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {api}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {source.websites && (
                <div className="mt-2">
                  <span className="text-sm font-medium">Websites:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {source.websites.map((website, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {website}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

