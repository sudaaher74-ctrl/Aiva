import { useState } from "react"
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function StockMovementModal({ 
  isOpen, 
  onClose,
  movementType // 'IN' or 'OUT'
}: { 
  isOpen: boolean, 
  onClose: () => void,
  movementType: 'IN' | 'OUT'
}) {
  const [productId, setProductId] = useState("")
  const [warehouseLocation, setWarehouseLocation] = useState("")
  const [batchNumber, setBatchNumber] = useState("")
  const [quantity, setQuantity] = useState("")
  const [unit, setUnit] = useState("MT")
  const [expiryDate, setExpiryDate] = useState("")
  
  const queryClient = useQueryClient()
  const { toast } = useToast()

  // Fetch products for the dropdown
  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await api.get(`/products`)
      return response.data.data
    }
  })

  const mutation = useMutation({
    mutationFn: async (movementData: any) => {
      return api.post(`/inventory/movement`, movementData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] })
      toast({
        title: "Stock movement recorded",
        description: `Successfully recorded stock ${movementType === 'IN' ? 'in' : 'out'}.`,
      })
      onClose()
      // Reset form
      setProductId("")
      setWarehouseLocation("")
      setBatchNumber("")
      setQuantity("")
      setUnit("MT")
      setExpiryDate("")
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "There was an error recording the stock movement.",
        variant: "destructive",
      })
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate({
      productId,
      warehouseLocation,
      batchNumber,
      quantity,
      unit,
      expiryDate: expiryDate ? new Date(expiryDate).toISOString() : undefined,
      type: movementType
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{movementType === 'IN' ? 'Stock In (Add Inventory)' : 'Stock Out (Deduct Inventory)'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="product">Product</Label>
            <Select value={productId} onValueChange={setProductId}>
              <SelectTrigger>
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent>
                {products?.map((p: any) => (
                  <SelectItem key={p._id} value={p._id}>{p.name} - {p.category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="warehouse">Warehouse Location</Label>
              <Select value={warehouseLocation} onValueChange={setWarehouseLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Factory Warehouse">Factory Warehouse</SelectItem>
                  <SelectItem value="Cold Storage">Cold Storage</SelectItem>
                  <SelectItem value="Export Warehouse">Export Warehouse</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="batchNumber">Batch Number</Label>
              <Input id="batchNumber" value={batchNumber} onChange={e => setBatchNumber(e.target.value)} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input id="quantity" type="number" min="0.01" step="0.01" value={quantity} onChange={e => setQuantity(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MT">MT (Metric Tons)</SelectItem>
                  <SelectItem value="KG">KG (Kilograms)</SelectItem>
                  <SelectItem value="Liters">Liters</SelectItem>
                  <SelectItem value="Cartons">Cartons</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {movementType === 'IN' && (
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
              <Input id="expiryDate" type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} />
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={mutation.isPending || !productId || !warehouseLocation || !batchNumber || !quantity}>
              {mutation.isPending ? "Saving..." : "Record Movement"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
