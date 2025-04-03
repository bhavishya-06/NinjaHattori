"use client"

import { useState, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, Droplets, Flame, Waves } from "lucide-react"

export function PriorityList() {
  const [disasters, setDisasters] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching disaster data
    const fetchDisasters = async () => {
      // In a real app, this would be an API call
      setTimeout(() => {
        setDisasters([
          {
            id: 1,
            name: "Hurricane Maria",
            location: "Miami, FL",
            type: "Hurricane",
            severity: 85,
            icon: <Waves className="h-4 w-4" />,
            color: "text-purple-500",
          },
          {
            id: 2,
            name: "Riverside Flooding",
            location: "New Orleans, LA",
            type: "Flood",
            severity: 75,
            icon: <Droplets className="h-4 w-4" />,
            color: "text-blue-500",
          },
          {
            id: 3,
            name: "Sierra Wildfire",
            location: "Sacramento, CA",
            type: "Wildfire",
            severity: 90,
            icon: <Flame className="h-4 w-4" />,
            color: "text-red-500",
          },
          {
            id: 4,
            name: "Coastal Tsunami Warning",
            location: "Portland, OR",
            type: "Tsunami",
            severity: 65,
            icon: <AlertTriangle className="h-4 w-4" />,
            color: "text-amber-500",
          },
        ])
        setLoading(false)
      }, 1000)
    }

    fetchDisasters()
  }, [])

  const getSeverityColor = (severity) => {
    if (severity >= 80) return "bg-red-500"
    if (severity >= 60) return "bg-amber-500"
    if (severity >= 40) return "bg-yellow-500"
    return "bg-green-500"
  }

  if (loading) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <ScrollArea className="h-[200px]">
      <div className="space-y-4">
        {disasters.map((disaster) => (
          <div key={disaster.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={disaster.color}>{disaster.icon}</span>
                <span className="font-medium">{disaster.name}</span>
              </div>
              <Badge variant="outline">{disaster.type}</Badge>
            </div>
            <div className="text-xs text-muted-foreground">{disaster.location}</div>
            <div className="flex items-center gap-2">
              <Progress value={disaster.severity} className={getSeverityColor(disaster.severity)} />
              <span className="text-xs font-medium">{disaster.severity}%</span>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

