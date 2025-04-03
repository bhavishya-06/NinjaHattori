"use client"

import { useState, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Droplet, Package, Utensils, Pill, Home } from "lucide-react"
import axios from "axios"

interface Supply {
  _id: string
  name: string
  category: string
  quantity: number
  unit: string
  location: string
  expirationDate?: string
  lastUpdated: string
}

interface CategoryTotal {
  total: number
  count: number
}

interface DisplaySupply {
  id: string
  name: string
  stock: number
  distributed: number
  unit: string
  icon: React.ReactNode
}

const categoryIcons: Record<string, React.ReactNode> = {
  water: <Droplet className="h-4 w-4 text-blue-500" />,
  food: <Utensils className="h-4 w-4 text-green-500" />,
  medical: <Pill className="h-4 w-4 text-red-500" />,
  shelter: <Home className="h-4 w-4 text-amber-500" />,
  other: <Package className="h-4 w-4 text-purple-500" />,
}

export function SupplyOverview() {
  const [supplies, setSupplies] = useState<DisplaySupply[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSupplies = async () => {
      try {
        const response = await axios.get('/api/supplies')
        const suppliesData: Supply[] = response.data.supplies

        // Group supplies by category and calculate totals
        const categoryTotals = suppliesData.reduce((acc: Record<string, CategoryTotal>, supply: Supply) => {
          const category = supply.category.toLowerCase()
          if (!acc[category]) {
            acc[category] = {
              total: 0,
              count: 0
            }
          }
          acc[category].total += supply.quantity
          acc[category].count += 1
          return acc
        }, {})

        // Convert to array format for display
        const formattedSupplies: DisplaySupply[] = Object.entries(categoryTotals).map(([category, data]) => ({
          id: category,
          name: category.charAt(0).toUpperCase() + category.slice(1),
          stock: Math.min(100, Math.round((data.total / (data.count * 100)) * 100)), // Assuming 100 is max per category
          distributed: 0, // This would come from a separate API in a real app
          unit: "units",
          icon: categoryIcons[category] || categoryIcons.other
        }))

        setSupplies(formattedSupplies)
      } catch (error) {
        console.error('Error fetching supplies:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSupplies()
  }, [])

  const getStockColor = (stock: number) => {
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

