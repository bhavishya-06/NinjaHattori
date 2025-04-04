"use client"

import { useState, useEffect } from "react"
import { SuppliesTable } from "@/components/supplies-table"
import { AddSupplyForm } from "@/components/add-supply-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Supply } from "@/components/supplies-table"
import { Package } from "lucide-react"

export default function SuppliesPage() {
  const [supplies, setSupplies] = useState<Supply[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSupplies = async () => {
      try {
        const response = await fetch('/api/supplies')
        if (!response.ok) {
          throw new Error('Failed to fetch supplies')
        }
        const data = await response.json()
        setSupplies(data.supplies)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchSupplies()
  }, [])

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading supplies...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center h-64">
          <p className="text-destructive">Error: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex items-center gap-2 mb-8">
        <Package className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-bold">Supplies Management</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Supplies</CardTitle>
            <CardDescription>Manage your disaster relief supplies inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <SuppliesTable supplies={supplies} />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Add New Supply</CardTitle>
            <CardDescription>Enter details for a new supply item</CardDescription>
          </CardHeader>
          <CardContent>
            <AddSupplyForm onSupplyAdded={() => window.location.reload()} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}