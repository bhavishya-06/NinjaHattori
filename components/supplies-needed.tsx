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
  const [disasterList, setDisasterList] = useState<DisasterInfo[]>(
    disastersWithNeeds.filter(disaster => !disaster.suppliesAllocated)
  );
  const { toast } = useToast();

  const handleAllocateSupplies = async (location: string, disasterType: string) => {
    try {
      // 1. Find the disaster in the current state
      const disasterToAllocate = disasterList.find(
        (d) => d.location === location && d.type === disasterType
      );

      if (!disasterToAllocate) {
        toast({
          title: "Error",
          description: "Disaster not found in the list.",
          variant: "destructive",
        });
        return;
      }

      // 2. Check current inventory
      const inventoryResponse = await axios.get('/api/supplies');
      const currentInventory: SupplyItem[] = inventoryResponse.data.supplies;

      // 3. Check supplies and prepare allocation plan
      const requiredSupplies = disasterToAllocate.supplies;
      const allocationResults: AllocationResult[] = [];

      // Group supplies by category and check availability
      const categoryMapping = {
        food: 'food',
        water: 'water',
        medicine: 'medical',
        shelter: 'shelter'
      };

      // First pass: Calculate available amounts and prepare allocation plan
      for (const [category, requiredAmount] of Object.entries(requiredSupplies)) {
        const inventoryCategory = categoryMapping[category as keyof typeof categoryMapping];
        const availableAmount = currentInventory
          .filter((item: SupplyItem) => item.category === inventoryCategory)
          .reduce((sum: number, item: SupplyItem) => sum + item.quantity, 0);

        const allocatedAmount = Math.min(availableAmount, requiredAmount);
        const status = allocatedAmount === requiredAmount ? 'success' : 
                      allocatedAmount > 0 ? 'partial' : 'failed';

        allocationResults.push({
          category,
          required: requiredAmount,
          allocated: allocatedAmount,
          available: availableAmount,
          status
        });
      }

      // 4. Update inventory for available supplies
      const updatedInventory: SupplyItem[] = [...currentInventory];
      for (const [category, requiredAmount] of Object.entries(requiredSupplies)) {
        const inventoryCategory = categoryMapping[category as keyof typeof categoryMapping];
        let remainingAmount = Math.min(
          requiredAmount,
          allocationResults.find(r => r.category === category)?.allocated || 0
        );

        if (remainingAmount <= 0) continue;

        // Sort inventory by expiration date (if available) to use oldest first
        const categoryItems = updatedInventory
          .filter((item: SupplyItem) => item.category === inventoryCategory)
          .sort((a: SupplyItem, b: SupplyItem) => {
            if (!a.expirationDate) return 1;
            if (!b.expirationDate) return -1;
            return new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime();
          });

        for (const item of categoryItems) {
          if (remainingAmount <= 0) break;

          const deduction = Math.min(remainingAmount, item.quantity);
          const updatedQuantity = item.quantity - deduction;
          
          try {
            // Update the item in the database
            await axios.put(`/api/supplies/${item._id}`, {
              ...item,
              quantity: updatedQuantity
            });

            // Update the local inventory state
            const itemIndex = updatedInventory.findIndex(i => i._id === item._id);
            if (itemIndex !== -1) {
              updatedInventory[itemIndex] = {
                ...item,
                quantity: updatedQuantity
              };
            }

            remainingAmount -= deduction;
          } catch (error) {
            console.error(`Error updating supply ${item._id}:`, error);
            continue;
          }
        }
      }

      // 5. Update disaster status in the database
      const successItems = allocationResults.filter(r => r.status === 'success');
      const partialItems = allocationResults.filter(r => r.status === 'partial');
      const failedItems = allocationResults.filter(r => r.status === 'failed');

      // If all supplies were allocated successfully, mark the disaster as handled
      if (failedItems.length === 0) {
        try {
          await axios.put(`/api/disasters/${disasterToAllocate._id}`, {
            ...disasterToAllocate,
            suppliesAllocated: true
          });
        } catch (error) {
          console.error('Error updating disaster status:', error);
        }
      }

      // 6. Update local state
      setDisasterList(prevList => 
        prevList.filter(d => !(d.location === location && d.type === disasterType))
      );

      // 7. Prepare result message
      let resultMessage = '';
      if (successItems.length > 0) {
        resultMessage += `Successfully allocated:\n${successItems.map(item => 
          `${item.category}: ${item.allocated}/${item.required} units`
        ).join('\n')}\n\n`;
      }
      if (partialItems.length > 0) {
        resultMessage += `Partially allocated:\n${partialItems.map(item => 
          `${item.category}: ${item.allocated}/${item.required} units (${item.available} available)`
        ).join('\n')}\n\n`;
      }
      if (failedItems.length > 0) {
        resultMessage += `Failed to allocate:\n${failedItems.map(item => 
          `${item.category}: ${item.required} units needed (${item.available} available)`
        ).join('\n')}`;
      }

      // 8. Show result message
      toast({
        title: "Supply Allocation Results",
        description: resultMessage,
        variant: failedItems.length > 0 ? "destructive" : "default",
      });

    } catch (error) {
      console.error('Error allocating supplies:', error);
      toast({
        title: "Error",
        description: "Failed to allocate supplies. Please try again.",
        variant: "destructive",
      });
    }
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