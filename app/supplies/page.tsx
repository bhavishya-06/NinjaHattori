import { Suspense } from "react"
import Link from "next/link"
import { SuppliesTable } from "@/components/supplies-table"
import { SuppliesTableSkeleton } from "@/components/supplies-table-skeleton"
import { AddSupplyForm } from "@/components/add-supply-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShieldAlert } from "lucide-react"

export default function SuppliesPage() {
  return (
    <div className="container mx-auto py-6 space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Supplies Management</h1>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ShieldAlert className="h-4 w-4" />
          <Link href="/"><span>Disaster Management System</span></Link>
        </div>
      </div>

      <Tabs defaultValue="inventory" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="add">Add Supplies</TabsTrigger>
        </TabsList>
        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Supplies</CardTitle>
              <CardDescription>
                Manage your disaster relief supplies inventory. Filter by category or search for specific items.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<SuppliesTableSkeleton />}>
                <SuppliesTable />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>Add New Supplies</CardTitle>
              <CardDescription>Add new supplies to your inventory. All fields are required.</CardDescription>
            </CardHeader>
            <CardContent>
              <AddSupplyForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}