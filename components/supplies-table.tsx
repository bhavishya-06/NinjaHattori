"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { EditSupplyDialog } from "./edit-supply-dialog"
import { useToast } from "@/hooks/use-toast"
import { 
  Utensils, 
  Droplets, 
  HeartPulse, 
  Home, 
  Search, 
  Pencil, 
  Trash 
} from "lucide-react"

export interface Supply {
  _id: string
  name: string
  category: string
  quantity: number
  unit: string
  location: string
  expirationDate?: string | null
  lastUpdated: string
}

interface SuppliesTableProps {
  supplies: Supply[]
  onSupplyUpdated?: () => void
}

export function SuppliesTable({ supplies, onSupplyUpdated }: SuppliesTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [selectedSupply, setSelectedSupply] = useState<Supply | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const { toast } = useToast()

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "food":
        return <Utensils className="h-4 w-4" />
      case "water":
        return <Droplets className="h-4 w-4" />
      case "medical":
        return <HeartPulse className="h-4 w-4" />
      case "shelter":
        return <Home className="h-4 w-4" />
      default:
        return null
    }
  }

  const handleDelete = async () => {
    if (!selectedSupply) return

    try {
      const response = await fetch(`/api/supplies/${selectedSupply._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete supply')
      }

      toast({
        title: "Success",
        description: "Supply deleted successfully",
      })

      if (onSupplyUpdated) {
        onSupplyUpdated()
      }

      setIsDeleteDialogOpen(false)
      setSelectedSupply(null)
    } catch (error) {
      console.error('Delete error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete supply",
        variant: "destructive",
      })
    }
  }

  const filteredSupplies = supplies.filter((supply) => {
    const matchesSearch = supply.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || supply.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search supplies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="food">Food</SelectItem>
            <SelectItem value="water">Water</SelectItem>
            <SelectItem value="medical">Medical</SelectItem>
            <SelectItem value="shelter">Shelter</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Expiration</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSupplies.map((supply) => (
              <TableRow key={supply._id}>
                <TableCell>{supply.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(supply.category)}
                    <span className="capitalize">{supply.category}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {supply.quantity} {supply.unit}
                </TableCell>
                <TableCell>{supply.location}</TableCell>
                <TableCell>{supply.expirationDate || "N/A"}</TableCell>
                <TableCell>{supply.lastUpdated}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedSupply(supply)
                        setIsEditDialogOpen(true)
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedSupply(supply)
                        setIsDeleteDialogOpen(true)
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the supply
              item from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {selectedSupply && (
        <EditSupplyDialog
          supply={selectedSupply}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSupplyUpdated={onSupplyUpdated}
        />
      )}
    </div>
  )
}

