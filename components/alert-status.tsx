"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Droplets, Wind, Thermometer } from "lucide-react"

export function AlertStatus() {
  const alerts = [
    {
      title: "Active Disasters",
      value: "4",
      description: "Currently active",
      icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
      color: "bg-red-50 dark:bg-red-950",
      textColor: "text-red-500",
    },
    {
      title: "Flood Warnings",
      value: "2",
      description: "Regions affected",
      icon: <Droplets className="h-4 w-4 text-blue-500" />,
      color: "bg-blue-50 dark:bg-blue-950",
      textColor: "text-blue-500",
    },
    {
      title: "Storm Alerts",
      value: "1",
      description: "Approaching",
      icon: <Wind className="h-4 w-4 text-amber-500" />,
      color: "bg-amber-50 dark:bg-amber-950",
      textColor: "text-amber-500",
    },
    {
      title: "Heat Warnings",
      value: "1",
      description: "Extreme conditions",
      icon: <Thermometer className="h-4 w-4 text-orange-500" />,
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
            <div className="text-2xl font-bold">{alert.value}</div>
            <p className="text-xs text-muted-foreground">{alert.description}</p>
            <Badge variant="outline" className={`mt-2 ${alert.textColor}`}>
              Active
            </Badge>
          </CardContent>
        </Card>
      ))}
    </>
  )
}

