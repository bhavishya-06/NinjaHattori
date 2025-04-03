"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
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
import { MoreVertical, Pencil, Trash2, Search, Droplet, Utensils, Pill, Home, Truck, Battery } from "lucide-react"
import { EditSupplyDialog } from "./edit-supply-dialog"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"

// Define the supply categories and their corresponding icons
const categoryIcons = {
  water: <Droplet className="h-4 w-4 text-blue-500" />,
  food: <Utensils className="h-4 w-4 text-orange-500" />,
  medical: <Pill className="h-4 w-4 text-red-500" />,
  shelter: <Home className="h-4 w-4 text-green-500" />,
  transport: <Truck className="h-4 w-4 text-purple-500" />,
  power: <Battery className="h-4 w-4 text-yellow-500" />,
}

export type Supply = {
  _id: string
  name: string
  category: string
  quantity: number
  unit: string
  location: string
  expirationDate?: string
  lastUpdated: string
}

export function SuppliesTable() {
  const [supplies, setSupplies] = useState<Supply[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedSupply, setSelectedSupply] = useState<Supply | null>(null)
  const { toast } = useToast()

  // Fetch supplies from API
  useEffect(() => {
    const fetchSupplies = async () => {
      try {
        const response = await axios.get('/api/supplies')
        setSupplies(response.data.supplies)
      } catch (error) {
        console.error('Error fetching supplies:', error)
        toast({
          title: "Error",
          description: "Failed to fetch supplies. Please try again.",
          variant: "destructive",
        })
      }
    }
    fetchSupplies()
  }, [])

  // Filter supplies based on search term and category
  const filteredSupplies = supplies.filter((supply) => {
    const matchesSearch =
      supply.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supply.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || supply.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/supplies/${id}`)
      setSupplies(supplies.filter((supply) => supply._id !== id))
      setIsDeleteDialogOpen(false)

      toast({
        title: "Supply deleted",
        description: "The supply has been removed from inventory.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete supply. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEdit = async (updatedSupply: Supply) => {
    try {
      const response = await axios.put(`/api/supplies/${updatedSupply._id}`, updatedSupply)
      setSupplies(supplies.map((supply) => 
        supply._id === updatedSupply._id ? response.data.data : supply
      ))
      setIsEditDialogOpen(false)

      toast({
        title: "Supply updated",
        description: "The supply information has been updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update supply. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getCategoryIcon = (category: string) => {
    return categoryIcons[category as keyof typeof categoryIcons] || null
  }

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case "water":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "food":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100"
      case "medical":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      case "shelter":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "transport":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100"
      case "power":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      default:
        return ""
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search supplies..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="water">Water</SelectItem>
            <SelectItem value="food">Food</SelectItem>
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
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="hidden md:table-cell">Location</TableHead>
              <TableHead className="hidden md:table-cell">Expiration</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSupplies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  No supplies found. Try adjusting your search or filter.
                </TableCell>
              </TableRow>
            ) : (
              filteredSupplies.map((supply) => (
                <TableRow key={supply._id}>
                  <TableCell className="font-medium">{supply.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`flex items-center gap-1 ${getCategoryBadgeColor(supply.category)}`}
                    >
                      {getCategoryIcon(supply.category)}
                      <span className="capitalize">{supply.category}</span>
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {supply.quantity} {supply.unit}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{supply.location}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {supply.expirationDate ? new Date(supply.expirationDate).toLocaleDateString() : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedSupply(supply)
                            setIsEditDialogOpen(true)
                          }}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => {
                            setSelectedSupply(supply)
                            setIsDeleteDialogOpen(true)
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {selectedSupply?.name} from your inventory. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => selectedSupply && handleDelete(selectedSupply._id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Supply Dialog */}
      {selectedSupply && (
        <EditSupplyDialog
          supply={selectedSupply}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSave={handleEdit}
        />
      )}
    </div>
  )
}

