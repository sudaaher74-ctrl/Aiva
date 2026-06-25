import { useState, useEffect } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
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
import { Trash2, Plus } from "lucide-react"

export default function PurchaseOrderFormModal({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean, 
  onClose: () => void 
}) {
  const [formData, setFormData] = useState({
    buyerName: "",
    buyerCompany: "",
    buyerCountry: "",
    buyerEmail: "",
    portOfLoading: "Nhava Sheva, India",
    destinationPort: "",
    incoterms: "FOB",
    shipmentMethod: "Sea"
  })

  const [items, setItems] = useState([{ productName: "", quantity: 1, unit: "MT", unitPrice: 0 }])
  const [financials, setFinancials] = useState({ freightCharges: 0, insurance: 0, gstPercent: 0 })
  
  const queryClient = useQueryClient()
  const { toast } = useToast()

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        buyerName: "", buyerCompany: "", buyerCountry: "", buyerEmail: "", 
        portOfLoading: "Nhava Sheva, India", destinationPort: "", incoterms: "FOB", shipmentMethod: "Sea"
      })
      setItems([{ productName: "", quantity: 1, unit: "MT", unitPrice: 0 }])
      setFinancials({ freightCharges: 0, insurance: 0, gstPercent: 0 })
    }
  }, [isOpen])

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      return api.post(`/purchase-orders`, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] })
      queryClient.invalidateQueries({ queryKey: ['poStats'] })
      toast({ title: "Purchase Order created successfully" })
      onClose()
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "There was an error creating the PO.",
        variant: "destructive",
      })
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const validItems = items.filter(i => i.productName && i.quantity > 0)
    if (validItems.length === 0) return toast({ title: "Please add at least one valid product", variant: "destructive" })
    if (!formData.buyerCompany || !formData.buyerEmail) return toast({ title: "Buyer Company and Email are required", variant: "destructive" })

    mutation.mutate({
      ...formData,
      items: validItems,
      ...financials,
      status: "Draft"
    })
  }

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)
  }

  const addItem = () => setItems([...items, { productName: "", quantity: 1, unit: "MT", unitPrice: 0 }])
  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index)
    if (newItems.length === 0) newItems.push({ productName: "", quantity: 1, unit: "MT", unitPrice: 0 })
    setItems(newItems)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Purchase Order</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Buyer Company *</Label>
              <Input required value={formData.buyerCompany} onChange={e => setFormData({...formData, buyerCompany: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Buyer Name *</Label>
              <Input required value={formData.buyerName} onChange={e => setFormData({...formData, buyerName: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Buyer Email *</Label>
              <Input type="email" required value={formData.buyerEmail} onChange={e => setFormData({...formData, buyerEmail: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Buyer Country *</Label>
              <Input required value={formData.buyerCountry} onChange={e => setFormData({...formData, buyerCountry: e.target.value})} />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <Label className="text-base">Line Items</Label>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="h-4 w-4 mr-1" /> Add Item
              </Button>
            </div>
            
            {items.map((item, index) => (
              <div key={index} className="flex gap-3 items-end p-3 bg-slate-50 rounded-lg border">
                <div className="flex-1 space-y-2">
                  <Label className="text-xs text-muted-foreground">Product Name</Label>
                  <Input value={item.productName} onChange={(e) => handleItemChange(index, 'productName', e.target.value)} />
                </div>
                <div className="w-20 space-y-2">
                  <Label className="text-xs text-muted-foreground">Qty</Label>
                  <Input type="number" min="1" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))} />
                </div>
                <div className="w-20 space-y-2">
                  <Label className="text-xs text-muted-foreground">Unit</Label>
                  <Input value={item.unit} onChange={(e) => handleItemChange(index, 'unit', e.target.value)} />
                </div>
                <div className="w-24 space-y-2">
                  <Label className="text-xs text-muted-foreground">Price</Label>
                  <Input type="number" step="0.01" value={item.unitPrice} onChange={(e) => handleItemChange(index, 'unitPrice', Number(e.target.value))} />
                </div>
                <Button type="button" variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => removeItem(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 border-t pt-4">
             <div className="space-y-2">
              <Label>Freight Charges ($)</Label>
              <Input type="number" value={financials.freightCharges} onChange={e => setFinancials({...financials, freightCharges: Number(e.target.value)})} />
            </div>
            <div className="space-y-2">
              <Label>Insurance ($)</Label>
              <Input type="number" value={financials.insurance} onChange={e => setFinancials({...financials, insurance: Number(e.target.value)})} />
            </div>
            <div className="space-y-2">
              <Label>GST (%)</Label>
              <Input type="number" value={financials.gstPercent} onChange={e => setFinancials({...financials, gstPercent: Number(e.target.value)})} />
            </div>
          </div>

          <div className="flex justify-end items-center pt-4 border-t space-x-2">
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Creating..." : "Create PO"}
            </Button>
          </div>

        </form>
      </DialogContent>
    </Dialog>
  )
}
