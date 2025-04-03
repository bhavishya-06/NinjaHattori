"use client"

import * as React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle } from "lucide-react"
import type { DisasterInfo } from "../app/page"; // Import the interface

interface PriorityListProps {
  disasters: DisasterInfo[]; // Expect array of detailed objects
}

// Helper to map severity number to category and color
const getSeverityInfo = (severity: number): { category: string; color: string } => {
  if (severity >= 80) return { category: "High", color: "bg-red-500 text-red-50" }; 
  if (severity >= 50) return { category: "Medium", color: "bg-yellow-500 text-yellow-50" };
  return { category: "Low", color: "bg-green-500 text-green-50" }; // Changed to green for low severity
};

// Mapping of disaster types to icons (optional)
const disasterIconMap: { [key: string]: React.ReactNode } = {
  flood: <AlertTriangle className="h-4 w-4 text-blue-500" />, 
  cyclone: <AlertTriangle className="h-4 w-4 text-purple-500" />, 
  landslide: <AlertTriangle className="h-4 w-4 text-amber-500" />, 
  drought: <AlertTriangle className="h-4 w-4 text-red-500" />, 
  earthquake: <AlertTriangle className="h-4 w-4 text-orange-600" />, 
  hurricane: <AlertTriangle className="h-4 w-4 text-indigo-500" />, 
  default: <AlertTriangle className="h-4 w-4 text-gray-500" />,
}

export function PriorityList({ disasters }: PriorityListProps) {
  if (!disasters || disasters.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground bg-gray-50/50 rounded-lg border border-gray-100">
        No active disasters reported.
      </div>
    )
  }

  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-1.5 pr-4">
        {disasters.map((disaster, index) => {
          const normalizedType = disaster.type.toLowerCase();
          const icon = disasterIconMap[normalizedType] || disasterIconMap.default;
          const severityInfo = getSeverityInfo(disaster.severity);

          return (
            <div 
              key={index} 
              className="group relative p-2 rounded-lg border border-gray-100 bg-white hover:bg-gray-50/80 transition-colors duration-200 hover:shadow-sm"
            >
              {/* Top row: Icon, Name (Type), Severity Badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-md bg-gray-50 group-hover:bg-gray-100 transition-colors duration-200">
                    <span className="text-gray-600">{icon}</span>
                  </div>
                  <span className="font-medium capitalize text-gray-900 text-sm">
                    {disaster.type} 
                  </span>
                </div>
                <Badge 
                  className={`px-2 py-0.5 text-xs font-semibold ${severityInfo.color} shadow-sm`}
                >
                  {severityInfo.category}
                </Badge>
              </div>
              {/* Bottom row: Location */}
              <div className="flex items-center gap-1 mt-1 pl-4 text-xs text-gray-500">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {disaster.location}
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  )
}

