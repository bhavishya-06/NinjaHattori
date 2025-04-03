"use client"

import { useEffect, useRef, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Layers, ZoomIn, ZoomOut } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function DisasterMap() {
  const mapRef = useRef(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Mock disaster data
  const disasters = [
    { id: 1, type: "Flood", lat: 34.0522, lng: -118.2437, severity: "High", location: "Los Angeles, CA" },
    { id: 2, type: "Wildfire", lat: 37.7749, lng: -122.4194, severity: "Critical", location: "San Francisco, CA" },
    { id: 3, type: "Hurricane", lat: 25.7617, lng: -80.1918, severity: "Severe", location: "Miami, FL" },
    { id: 4, type: "Earthquake", lat: 47.6062, lng: -122.3321, severity: "Moderate", location: "Seattle, WA" },
  ]

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative h-full w-full">
      {!isLoaded ? (
        <div className="flex h-full w-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <>
          <div className="absolute left-4 top-4 z-10 flex flex-col gap-2">
            <Button size="icon" variant="outline" className="h-8 w-8 bg-background">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="outline" className="h-8 w-8 bg-background">
              <ZoomOut className="h-4 w-4" />
            </Button>
          </div>
          <div className="absolute right-4 top-4 z-10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="outline" className="h-8 w-8 bg-background">
                  <Layers className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Satellite</DropdownMenuItem>
                <DropdownMenuItem>Terrain</DropdownMenuItem>
                <DropdownMenuItem>Street</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="absolute bottom-4 left-4 z-10 flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
              Critical
            </Badge>
            <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">
              Severe
            </Badge>
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
              Moderate
            </Badge>
            <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
              Minor
            </Badge>
          </div>
          <div
            ref={mapRef}
            className="h-full w-full bg-[url('/placeholder.svg?height=600&width=800')] bg-cover bg-center"
          >
            {/* Map markers would be rendered here */}
            {disasters.map((disaster) => (
              <div
                key={disaster.id}
                className="absolute h-4 w-4 rounded-full bg-red-500 shadow-lg"
                style={{
                  left: `${Math.random() * 80 + 10}%`,
                  top: `${Math.random() * 80 + 10}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div className="absolute -bottom-16 left-1/2 w-32 -translate-x-1/2 rounded bg-background p-2 text-xs shadow-lg opacity-0 hover:opacity-100 transition-opacity">
                  <p className="font-bold">{disaster.type}</p>
                  <p>{disaster.location}</p>
                  <p className="text-red-500">{disaster.severity}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

