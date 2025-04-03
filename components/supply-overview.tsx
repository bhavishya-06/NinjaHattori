"use client"

import { useState, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Droplet, Package, Utensils, Pill, Home } from "lucide-react"

export function SupplyOverview() {
  const [supplies, setSupplies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching supply data
    const fetchSupplies = async () => {
      // In a real app, this would be an API call
      setTimeout(() => {
        setSupplies([
          {
            id: 1,
            name: "Water",
            stock: 65,
            distributed: 35,
            unit: "gallons",
            icon: <Droplet className="h-4 w-4 text-blue-500" />,
          },
          {
            id: 2,
            name: "Food",
            stock: 40,
            distributed: 60,
            unit: "meals",
            icon: <Utensils className="h-4 w-4 text-green-500" />,
          },
          {
            id: 3,
            name: "Medical",
            stock: 80,
            distributed: 20,
            unit: "kits",
            icon: <Pill className="h-4 w-4 text-red-500" />,
          },
          {
            id: 4,
            name: "Shelter",
            stock: 55,
            distributed: 45,
            unit: "tents",
            icon: <Home className="h-4 w-4 text-amber-500" />,
          },
          {
            id: 5,
            name: "Supplies",
            stock: 30,
            distributed: 70,
            unit: "packages",
            icon: <Package className="h-4 w-4 text-purple-500" />,
          },
        ])
        setLoading(false)
      }, 1000)
    }

    fetchSupplies()
  }, [])

  const getStockColor = (stock) => {
    if (stock < 30) return "text-red-500"
    if (stock < 60) return "text-amber-500"
    return "text-green-500"
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
        {supplies.map((supply) => (
          <div key={supply.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {supply.icon}
                <span className="font-medium">{supply.name}</span>
              </div>
              <span className={`text-xs font-medium ${getStockColor(supply.stock)}`}>{supply.stock}% in stock</span>
            </div>
            <Progress value={supply.stock} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{supply.distributed}% distributed</span>
              <span>Target: {supply.unit}</span>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

