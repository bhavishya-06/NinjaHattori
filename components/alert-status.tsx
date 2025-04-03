"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Droplets, Activity, Flame } from "lucide-react"

// Define props to accept the dynamic counts
interface AlertStatusProps {
  activeAlertsCount: number;
  floodCount: number;
  earthquakeCount: number;
  wildfireCount: number;
}

export function AlertStatus({ activeAlertsCount, floodCount, earthquakeCount, wildfireCount }: AlertStatusProps) {
  // Define the structure for the alerts, using the dynamic counts
  const alerts = [
    {
      title: "Active Disasters",
      value: activeAlertsCount.toString(),
      description: "Currently tracked",
      icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
      color: "bg-red-50 dark:bg-red-950",
      textColor: "text-red-500",
    },
    {
      title: "Flood Warnings",
      value: floodCount.toString(), // Dynamic flood count
      description: "Regions affected",
      icon: <Droplets className="h-4 w-4 text-blue-500" />,
      color: "bg-blue-50 dark:bg-blue-950",
      textColor: "text-blue-500",
    },
    {
      title: "Earthquake Alerts", // Updated title
      value: earthquakeCount.toString(), // Dynamic earthquake count
      description: "Detected activity", // Updated description
      icon: <Activity className="h-4 w-4 text-amber-500" />, // Changed icon to Activity
      color: "bg-amber-50 dark:bg-amber-950",
      textColor: "text-amber-500",
    },
    {
      title: "Wildfire Alerts", // Updated title
      value: wildfireCount.toString(), // Dynamic wildfire count
      description: "Active fires", // Updated description
      icon: <Flame className="h-4 w-4 text-orange-500" />, // Use Flame icon
      color: "bg-orange-50 dark:bg-orange-950",
      textColor: "text-orange-500",
    },
  ]

  return (
    <>
      {alerts.map((alert, index) => (
        <Card key={index} className={alert.color}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{alert.title}</CardTitle>
            {alert.icon}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${alert.textColor}`}>{alert.value}</div>
            <p className="text-xs text-muted-foreground">{alert.description}</p>
            {/* Optional: Conditionally show badge based on value? */}
             {/* <Badge variant="outline" className={`mt-2 ${alert.textColor}`}> 
               Active 
             </Badge> */}
          </CardContent>
        </Card>
      ))}
    </>
  )
}

