"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertTriangle } from "lucide-react" // Icon for headlines
import type { DisasterInfo } from "../app/page"; // Import the interface

// Define props to accept disasters data
interface NewsScrollerProps {
  disasters: DisasterInfo[];
}

export function NewsScroller({ disasters }: NewsScrollerProps) {

  if (!disasters || disasters.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
        No disaster news available.
      </div>
    )
  }

  // Generate news items from disaster data
  const newsItems = disasters.map((disaster, index) => ({
    id: index, // Use index as a simple key
    location: disaster.location,
    title: disaster.title,
  }));

  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-3 pr-4">
        {newsItems.map((item) => (
          <div key={item.id} className="flex items-start gap-3 rounded-lg border border-gray-100 p-3 bg-white hover:bg-gray-50/80 transition-colors duration-150">
            <div className="mt-0.5">
               <AlertTriangle className="h-4 w-4 text-gray-500" /> {/* Icon for each headline */} 
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{item.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Location: {item.location}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

