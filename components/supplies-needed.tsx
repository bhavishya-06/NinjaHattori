"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertTriangle, PackageCheck } from "lucide-react"
import type { DisasterInfo } from "../app/page"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"

interface SuppliesNeededProps {
  disastersWithNeeds: DisasterInfo[];
}

interface SupplyItem {
  _id: string;
  category: string;
  quantity: number;
  expirationDate?: string;
}

interface AllocationResult {
  category: string;
  required: number;
  allocated: number;
  available: number;
  status: 'success' | 'partial' | 'failed';
}

export function SuppliesNeeded({ disastersWithNeeds }: SuppliesNeededProps) {
  const { toast } = useToast()
  const [disasters, setDisasters] = useState<DisasterInfo[]>(disastersWithNeeds)

  const handleAllocateSupplies = async (disaster: DisasterInfo) => {
    try {
      console.log('Starting allocation for disaster:', disaster)

      // First, check current inventory
      const inventoryResponse = await fetch('/api/supplies')
      if (!inventoryResponse.ok) {
        const errorData = await inventoryResponse.json()
        throw new Error(`Failed to fetch inventory: ${errorData.error || inventoryResponse.statusText}`)
      }
      const { supplies: currentInventory } = await inventoryResponse.json()
      console.log('Current inventory:', currentInventory)

      // Calculate available supplies
      const availableSupplies = {
        food: currentInventory.filter((item: SupplyItem) => item.category === 'food')
          .reduce((sum: number, item: SupplyItem) => sum + item.quantity, 0),
        water: currentInventory.filter((item: SupplyItem) => item.category === 'water')
          .reduce((sum: number, item: SupplyItem) => sum + item.quantity, 0),
        medicine: currentInventory.filter((item: SupplyItem) => item.category === 'medical')
          .reduce((sum: number, item: SupplyItem) => sum + item.quantity, 0),
        shelter: currentInventory.filter((item: SupplyItem) => item.category === 'shelter')
          .reduce((sum: number, item: SupplyItem) => sum + item.quantity, 0)
      }
      console.log('Available supplies:', availableSupplies)
      console.log('Required supplies:', disaster.supplies)

      // Calculate how much we can allocate
      const allocation = {
        food: Math.min(disaster.supplies.food, availableSupplies.food),
        water: Math.min(disaster.supplies.water, availableSupplies.water),
        medicine: Math.min(disaster.supplies.medicine, availableSupplies.medicine),
        shelter: Math.min(disaster.supplies.shelter, availableSupplies.shelter)
      }
      console.log('Proposed allocation:', allocation)

      // Check if we can allocate anything
      if (Object.values(allocation).every(value => value === 0)) {
        toast({
          title: "Insufficient Supplies",
          description: "No supplies available to allocate",
          variant: "destructive",
        })
        return
      }

      // Send allocation request
      const allocationResponse = await fetch('/api/supplies/allocate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          disasterId: disaster._id,
          supplies: allocation
        }),
      })

      if (!allocationResponse.ok) {
        const errorData = await allocationResponse.json()
        console.error('Allocation failed:', errorData)
        throw new Error(`Failed to allocate supplies: ${errorData.error || allocationResponse.statusText}`)
      }

      const result = await allocationResponse.json()
      console.log('Allocation result:', result)

      // Update local state
      if (result.fullyAllocated) {
        setDisasters(prev => prev.filter(d => d._id !== disaster._id))
      } else {
        // Update the disaster's remaining supplies
        setDisasters(prev => prev.map(d => {
          if (d._id === disaster._id) {
            return {
              ...d,
              supplies: {
                food: Math.max(0, d.supplies.food - allocation.food),
                water: Math.max(0, d.supplies.water - allocation.water),
                medicine: Math.max(0, d.supplies.medicine - allocation.medicine),
                shelter: Math.max(0, d.supplies.shelter - allocation.shelter)
              }
            }
          }
          return d
        }))
      }

      // Show success message
      toast({
        title: "Success",
        description: result.message,
      })

    } catch (error) {
      console.error('Allocation error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to allocate supplies",
        variant: "destructive",
      })
    }
  }

  if (!disasters || disasters.length === 0) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed p-4 text-center">
        <p className="text-sm text-muted-foreground">No active supply needs reported.</p>
      </div>
    )
  }

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-4 pr-4">
        {disasters.map((disaster, index) => (
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
                onClick={() => handleAllocateSupplies(disaster)}
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