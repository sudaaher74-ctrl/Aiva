import { useState, useEffect } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
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
import { Trash2, Plus } from "lucide-react"

export default function QuotationFormModal({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean, 
  onClose: () => void 
}) {
  const [customerId, setCustomerId] = useState("")
  const [items, setItems] = useState([{ product_id: "", quantity: 1, unit_price: 0 }])
  const [totalAmount, setTotalAmount] = useState(0)
  
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { data: customers } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const res = await api.get('/customers')
      return res.data.data
    },
    enabled: isOpen
  })

  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await api.get('/products')
      return res.data.data
    },
    enabled: isOpen
  })

  useEffect(() => {
    // Calculate total amount whenever items change
    const total = items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.unit_price)), 0)
    setTotalAmount(total)
  }, [items])

  useEffect(() => {
    if (!isOpen) {
      setCustomerId("")
      setItems([{ product_id: "", quantity: 1, unit_price: 0 }])
      setTotalAmount(0)
    }
  }, [isOpen])

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      return api.post(`/quotations`, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] })
      toast({ title: "Quotation created successfully" })
      onClose()
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "There was an error creating the quotation.",
        variant: "destructive",
      })
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerId) return toast({ title: "Please select a customer", variant: "destructive" })
    
    // Filter out empty items
    const validItems = items.filter(i => i.product_id && i.quantity > 0)
    if (validItems.length === 0) return toast({ title: "Please add at least one valid product", variant: "destructive" })

    mutation.mutate({
      customer_id: customerId,
      items: validItems,
      total_amount: totalAmount,
      status: "Draft"
    })
  }

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...items]
    if (field === 'product_id') {
      const product = products?.find((p: any) => p._id === value)
      newItems[index] = { ...newItems[index], product_id: value as string, unit_price: product ? product.price || 0 : 0 }
    } else {
      newItems[index] = { ...newItems[index], [field]: Number(value) }
    }
    setItems(newItems)
  }

  const addItem = () => {
    setItems([...items, { product_id: "", quantity: 1, unit_price: 0 }])
  }

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index)
    if (newItems.length === 0) newItems.push({ product_id: "", quantity: 1, unit_price: 0 })
    setItems(newItems)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Quotation</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          
          <div className="space-y-2">
            <Label>Customer</Label>
            <Select value={customerId} onValueChange={setCustomerId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a customer" />
              </SelectTrigger>
              <SelectContent>
                {customers?.map((c: any) => (
                  <SelectItem key={c._id} value={c._id}>{c.company_name} ({c.contact_person})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <Label className="text-base">Products</Label>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="h-4 w-4 mr-1" /> Add Product
              </Button>
            </div>
            
            {items.map((item, index) => (
              <div key={index} className="flex gap-3 items-end p-3 bg-slate-50 rounded-lg border">
                <div className="flex-1 space-y-2">
                  <Label className="text-xs text-muted-foreground">Product</Label>
                  <Select value={item.product_id} onValueChange={(val) => handleItemChange(index, 'product_id', val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products?.map((p: any) => (
                        <SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-24 space-y-2">
                  <Label className="text-xs text-muted-foreground">Quantity</Label>
                  <Input type="number" min="1" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} />
                </div>
                <div className="w-32 space-y-2">
                  <Label className="text-xs text-muted-foreground">Unit Price ($)</Label>
                  <Input type="number" step="0.01" value={item.unit_price} onChange={(e) => handleItemChange(index, 'unit_price', e.target.value)} />
                </div>
                <Button type="button" variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => removeItem(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-lg font-bold">
              Total Amount: ${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="space-x-2">
              <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Creating..." : "Create Quotation"}
              </Button>
            </div>
          </div>

        </form>
      </DialogContent>
    </Dialog>
  )
}
