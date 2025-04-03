"use client"

import { useState } from "react"
import { SuppliesTable } from "@/components/supplies-table"
import { AddSupplyForm } from "@/components/add-supply-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SuppliesPage() {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleSupplyAdded = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Supplies</CardTitle>
              <CardDescription>Manage your disaster relief supplies inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <SuppliesTable key={refreshKey} />
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Add New Supply</CardTitle>
              <CardDescription>Enter details for a new supply item</CardDescription>
            </CardHeader>
            <CardContent>
              <AddSupplyForm onSupplyAdded={handleSupplyAdded} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}