"use client"

import * as React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, Droplets, Flame, Waves } from "lucide-react"

interface Disaster {
  id: number
  name: string
  location: string
  type: string
  severity: number
  icon: React.ReactNode
  color: string
}

export function PriorityList() {
  // Simulate fetching disaster data
  // In a real app, this would be an API call
  const disasters: Disaster[] = [
    {
      id: 1,
      name: "Brahmaputra Flood",
      location: "Assam",
      type: "Flood",
      severity: 85,
      icon: <Droplets className="h-4 w-4" />,
      color: "text-blue-500",
    },
    {
      id: 2,
      name: "Cyclone Yaas",
      location: "Odisha",
      type: "Cyclone",
      severity: 75,
      icon: <Waves className="h-4 w-4" />,
      color: "text-purple-500",
    },
    {
      id: 3,
      name: "Western Ghats Landslide",
      location: "Kerala",
      type: "Landslide",
      severity: 90,
      icon: <AlertTriangle className="h-4 w-4" />,
      color: "text-amber-500",
    },
    {
      id: 4,
      name: "Marathwada Drought",
      location: "Maharashtra",
      type: "Drought",
      severity: 65,
      icon: <Flame className="h-4 w-4" />,
      color: "text-red-500",
    },
  ]

  const getSeverityColor = (severity: number) => {
    if (severity >= 80) return "bg-red-500"
    if (severity >= 60) return "bg-amber-500"
    if (severity >= 40) return "bg-yellow-500"
    return "bg-green-500"
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

