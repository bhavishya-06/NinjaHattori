"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertTriangle, PackageCheck } from "lucide-react"
import type { DisasterInfo } from "../app/page"; // Import the shared interface

interface SuppliesNeededProps {
  disastersWithNeeds: DisasterInfo[];
}

export function SuppliesNeeded({ disastersWithNeeds }: SuppliesNeededProps) {
  const [disasterList, setDisasterList] = useState(disastersWithNeeds);

  const handleAllocateSupplies = (location: string, disasterType: string) => {
    // --- Simulation Logic --- 
    // 1. Find the disaster in the current state
    const disasterToAllocate = disasterList.find(
      (d) => d.location === location && d.type === disasterType
    );

    if (!disasterToAllocate) return; // Should not happen

    console.log(`Simulating allocation for ${disasterType} in ${location}:`, disasterToAllocate.supplies);
    
    // TODO: Implement actual supply deduction logic here
    // This would involve:
    // - Reading current inventory (from SupplyOverview state or a shared store/context)
    // - Checking if enough supplies are available
    // - Making an API call to update the backend inventory
    // - Displaying success/error messages (e.g., using toasts)

    // 2. Remove the disaster from the list (simulate clearing the queue)
    setDisasterList((prevList) => 
      prevList.filter((d) => !(d.location === location && d.type === disasterType))
    );

    alert(`Supplies allocation simulated for ${disasterType} in ${location}. The request has been removed from this list.`);
    // --- End Simulation Logic ---
  };

  if (!disasterList || disasterList.length === 0) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed p-4 text-center">
        <p className="text-sm text-muted-foreground">No active supply needs reported.</p>
      </div>
    )
  }

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-4 pr-4">
        {disasterList.map((disaster, index) => (
          <Card key={`${disaster.location}-${disaster.type}-${index}`} className="overflow-hidden">
            <CardHeader className="bg-gray-50/50 p-4 border-b">
              <div className="flex items-center justify-between">
                 <div>
                   <CardTitle className="text-base capitalize">{disaster.type} - {disaster.location}</CardTitle>
                   <CardDescription className="text-xs mt-1">Supply requirements for this event</CardDescription>
                 </div>
                 {/* Optionally add severity badge here if needed */}
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm mb-4">
                <div><strong>Food:</strong> {disaster.supplies.food.toFixed(2)} units</div>
                <div><strong>Water:</strong> {disaster.supplies.water.toFixed(2)} units</div>
                <div><strong>Medicine:</strong> {disaster.supplies.medicine.toFixed(2)} units</div>
                <div><strong>Shelter:</strong> {disaster.supplies.shelter.toFixed(2)} units</div>
              </div>
              <Button 
                size="sm" 
                onClick={() => handleAllocateSupplies(disaster.location, disaster.type)}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
              >
                 <PackageCheck className="mr-2 h-4 w-4" />
                 Allocate Supplies
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  )
} 