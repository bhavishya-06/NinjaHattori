"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import type { Supply } from "./supplies-table"

interface EditSupplyDialogProps {
  supply: Supply;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSupplyUpdated?: () => void;
}

export function EditSupplyDialog({
  supply,
  open,
  onOpenChange,
  onSupplyUpdated,
}: EditSupplyDialogProps) {
  const [editedSupply, setEditedSupply] = useState<Supply>({ ...supply })
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/supplies/${supply._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedSupply),
      })

      if (!response.ok) {
        throw new Error('Failed to update supply')
      }

      toast({
        title: "Success",
        description: "Supply updated successfully",
      })

      if (onSupplyUpdated) {
        onSupplyUpdated()
      }

      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update supply",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Supply</DialogTitle>
            <DialogDescription>
              Make changes to the supply item here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={editedSupply.name}
                onChange={(e) =>
                  setEditedSupply({ ...editedSupply, name: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select
                value={editedSupply.category}
                onValueChange={(value) =>
                  setEditedSupply({ ...editedSupply, category: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="water">Water</SelectItem>
                  <SelectItem value="medical">Medical</SelectItem>
                  <SelectItem value="shelter">Shelter</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantity
              </Label>
              <Input
                id="quantity"
                type="number"
                value={editedSupply.quantity}
                onChange={(e) =>
                  setEditedSupply({
                    ...editedSupply,
                    quantity: parseInt(e.target.value),
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="unit" className="text-right">
                Unit
              </Label>
              <Input
                id="unit"
                value={editedSupply.unit}
                onChange={(e) =>
                  setEditedSupply({ ...editedSupply, unit: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Location
              </Label>
              <Input
                id="location"
                value={editedSupply.location}
                onChange={(e) =>
                  setEditedSupply({ ...editedSupply, location: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="expirationDate" className="text-right">
                Expiration
              </Label>
              <Input
                id="expirationDate"
                type="date"
                value={editedSupply.expirationDate || ''}
                onChange={(e) =>
                  setEditedSupply({
                    ...editedSupply,
                    expirationDate: e.target.value || null,
                  })
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

