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

const DEFAULT_TERMS = `1. Goods must strictly comply with agreed specifications and quality standards.
2. Batch-wise Certificate of Analysis (COA) and phytosanitary certificates required prior to dispatch.
3. Payment terms as stated above: balance payable against presentation of original shipping documents.
4. Delivery and shipment schedules must be adhered to as per the agreed Incoterms.
5. Export-grade packaging as per international standards with proper markings.
6. Any deviation requires prior written approval from AIVA Enterprises.
7. All disputes subject to Navi Mumbai / Mumbai jurisdiction.`

export default function PurchaseOrderFormModal({ 
  isOpen, 
  onClose,
  initialData
}: { 
  isOpen: boolean, 
  onClose: () => void,
  initialData?: any
}) {
  const isEditMode = !!initialData

  const [formData, setFormData] = useState({
    currency: "USD",
    buyerCompany: "",
    buyerName: "",
    buyerEmail: "",
    buyerPhone: "",
    buyerCountry: "India",
    buyerAddress: "",
    supplierGstin: "",
    supplierFssai: "",
    shipToName: "AIVA Enterprises – Export Warehouse",
    shipToAddress: "Navi Mumbai, Maharashtra, India",
    portOfLoading: "Nhava Sheva, India",
    destinationPort: "",
    incoterms: "FOB Nhava Sheva",
    deliveryDate: "",
    paymentTerms: "30% Advance / 70% Against Documents",
    validity: "30 Days",
    termsAndConditions: DEFAULT_TERMS
  })

  const [items, setItems] = useState([
    { productName: "", hsnCode: "", specification: "", packaging: "", quantity: 1, unit: "MT", unitPrice: 0 }
  ])
  const [financials, setFinancials] = useState({ freightCharges: 0, insurance: 0, gstPercent: 0 })
  
  const queryClient = useQueryClient()
  const { toast } = useToast()

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          currency: initialData.currency || "USD",
          buyerCompany: initialData.buyerCompany || "", 
          buyerName: initialData.buyerName || "", 
          buyerEmail: initialData.buyerEmail || "", 
          buyerPhone: initialData.buyerPhone || "", 
          buyerCountry: initialData.buyerCountry || "India", 
          buyerAddress: initialData.buyerAddress || "", 
          supplierGstin: initialData.supplierGstin || "",
          supplierFssai: initialData.supplierFssai || "",
          shipToName: initialData.shipToName || "AIVA Enterprises – Export Warehouse",
          shipToAddress: initialData.shipToAddress || "Navi Mumbai, Maharashtra, India",
          portOfLoading: initialData.portOfLoading || "Nhava Sheva, India", 
          destinationPort: initialData.destinationPort || "", 
          incoterms: initialData.incoterms || "FOB Nhava Sheva", 
          deliveryDate: initialData.deliveryDate ? new Date(initialData.deliveryDate).toISOString().split('T')[0] : "",
          paymentTerms: initialData.paymentTerms || "30% Advance / 70% Against Documents",
          validity: initialData.validity || "30 Days",
          termsAndConditions: initialData.termsAndConditions || DEFAULT_TERMS
        })
        setItems(initialData.items && initialData.items.length > 0 
          ? initialData.items.map((it: any) => ({
              productName: it.productName || "",
              hsnCode: it.hsnCode || "",
              specification: it.specification || "",
              packaging: it.packaging || "",
              quantity: it.quantity || 1,
              unit: it.unit || "MT",
              unitPrice: it.unitPrice || 0
            }))
          : [{ productName: "", hsnCode: "", specification: "", packaging: "", quantity: 1, unit: "MT", unitPrice: 0 }]
        )
        setFinancials({ 
          freightCharges: initialData.freightCharges || 0, 
          insurance: initialData.insurance || 0, 
          gstPercent: initialData.gstPercent || 0 
        })
      } else {
        setFormData({
          currency: "USD",
          buyerCompany: "", buyerName: "", buyerEmail: "", buyerPhone: "", buyerCountry: "India", buyerAddress: "",
          supplierGstin: "", supplierFssai: "",
          shipToName: "AIVA Enterprises – Export Warehouse",
          shipToAddress: "Navi Mumbai, Maharashtra, India",
          portOfLoading: "Nhava Sheva, India", destinationPort: "", incoterms: "FOB Nhava Sheva",
          deliveryDate: "",
          paymentTerms: "30% Advance / 70% Against Documents",
          validity: "30 Days",
          termsAndConditions: DEFAULT_TERMS
        })
        setItems([{ productName: "", hsnCode: "", specification: "", packaging: "", quantity: 1, unit: "MT", unitPrice: 0 }])
        setFinancials({ freightCharges: 0, insurance: 0, gstPercent: 0 })
      }
    }
  }, [isOpen, initialData])

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (isEditMode) {
        return api.patch(`/purchase-orders/${initialData._id}`, data)
      } else {
        return api.post(`/purchase-orders`, data)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] })
      queryClient.invalidateQueries({ queryKey: ['poStats'] })
      toast({ title: `Purchase Order ${isEditMode ? 'updated' : 'created'} successfully` })
      onClose()
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || error?.message || `There was an error ${isEditMode ? 'updating' : 'creating'} the PO.`
      toast({
        title: "Error",
        description: msg,
        variant: "destructive",
      })
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const validItems = items.filter(i => i.productName && Number(i.quantity) > 0)
    if (validItems.length === 0) return toast({ title: "Please add at least one valid product", variant: "destructive" })
    if (!formData.buyerCompany || !formData.buyerEmail) return toast({ title: "Supplier/Buyer Company and Email are required", variant: "destructive" })

    const payload: any = {
      ...formData,
      items: validItems.map(item => ({
        productName: item.productName.trim(),
        hsnCode: item.hsnCode?.trim() || "",
        specification: item.specification?.trim() || "",
        packaging: item.packaging?.trim() || "",
        quantity: Number(item.quantity) || 1,
        unit: item.unit || "MT",
        unitPrice: Number(item.unitPrice) || 0,
        unitPriceUSD: Number(item.unitPrice) || 0,
        currency: formData.currency
      })),
      freightCharges: Number(financials.freightCharges) || 0,
      insurance: Number(financials.insurance) || 0,
      gstPercent: Number(financials.gstPercent) || 0
    }
    
    if (formData.deliveryDate) {
      payload.deliveryDate = new Date(formData.deliveryDate)
    }

    if (!isEditMode) payload.status = "Draft";

    mutation.mutate(payload)
  }

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)
  }

  const addItem = () => setItems([...items, { productName: "", hsnCode: "", specification: "", packaging: "", quantity: 1, unit: "MT", unitPrice: 0 }])
  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index)
    if (newItems.length === 0) newItems.push({ productName: "", hsnCode: "", specification: "", packaging: "", quantity: 1, unit: "MT", unitPrice: 0 })
    setItems(newItems)
  }

  const currSymbol = formData.currency === "INR" ? "₹" : "$"

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[900px] max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {isEditMode ? 'Edit Purchase Order' : 'Create New Purchase Order'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-2">
          
          {/* Header Metadata & Currency */}
          <div className="bg-slate-50 p-4 rounded-xl border space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <span className="font-semibold text-sm text-slate-700">Order Configurations</span>
              <div className="flex items-center gap-2">
                <Label className="text-xs font-bold text-slate-700">Currency:</Label>
                <div className="flex rounded-lg border overflow-hidden bg-white shadow-sm">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, currency: "USD"})}
                    className={`px-3 py-1 text-xs font-bold transition-colors ${formData.currency === "USD" ? "bg-black text-[#D4AF37]" : "text-slate-600 hover:bg-slate-100"}`}
                  >
                    USD ($)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, currency: "INR"})}
                    className={`px-3 py-1 text-xs font-bold transition-colors ${formData.currency === "INR" ? "bg-black text-[#D4AF37]" : "text-slate-600 hover:bg-slate-100"}`}
                  >
                    INR (₹)
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Incoterms</Label>
                <Input value={formData.incoterms} onChange={e => setFormData({...formData, incoterms: e.target.value})} placeholder="FOB Nhava Sheva" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Expected Delivery</Label>
                <Input type="date" value={formData.deliveryDate} onChange={e => setFormData({...formData, deliveryDate: e.target.value})} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Payment Terms</Label>
                <Input value={formData.paymentTerms} onChange={e => setFormData({...formData, paymentTerms: e.target.value})} placeholder="30% Adv / 70% Doc" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Validity</Label>
                <Input value={formData.validity} onChange={e => setFormData({...formData, validity: e.target.value})} placeholder="30 Days" />
              </div>
            </div>
          </div>

          {/* Parties: Supplier / Seller & Ship To */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Supplier / Seller */}
            <div className="p-4 border rounded-xl space-y-3 bg-white shadow-sm">
              <div className="font-semibold text-sm text-slate-800 flex items-center gap-2 border-b pb-2">
                <span>Supplier / Seller</span>
              </div>
              <div className="space-y-2">
                <div>
                  <Label className="text-xs">Company Name *</Label>
                  <Input required value={formData.buyerCompany} onChange={e => setFormData({...formData, buyerCompany: e.target.value})} placeholder="ABC Agro Foods Pvt. Ltd." />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">Contact Person</Label>
                    <Input value={formData.buyerName} onChange={e => setFormData({...formData, buyerName: e.target.value})} placeholder="Contact Name" />
                  </div>
                  <div>
                    <Label className="text-xs">Phone</Label>
                    <Input value={formData.buyerPhone} onChange={e => setFormData({...formData, buyerPhone: e.target.value})} placeholder="+91 98765 43210" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">Email *</Label>
                    <Input type="email" required value={formData.buyerEmail} onChange={e => setFormData({...formData, buyerEmail: e.target.value})} placeholder="sales@abcagro.com" />
                  </div>
                  <div>
                    <Label className="text-xs">Country</Label>
                    <Input value={formData.buyerCountry} onChange={e => setFormData({...formData, buyerCountry: e.target.value})} placeholder="India" />
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Address</Label>
                  <Input value={formData.buyerAddress} onChange={e => setFormData({...formData, buyerAddress: e.target.value})} placeholder="Plot No. 24, MIDC, Nashik, India" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">GSTIN</Label>
                    <Input value={formData.supplierGstin} onChange={e => setFormData({...formData, supplierGstin: e.target.value})} placeholder="27XXXXXXXXXXXXX" />
                  </div>
                  <div>
                    <Label className="text-xs">FSSAI</Label>
                    <Input value={formData.supplierFssai} onChange={e => setFormData({...formData, supplierFssai: e.target.value})} placeholder="XXXXXXXXXXXXXX" />
                  </div>
                </div>
              </div>
            </div>

            {/* Ship To / Warehouse */}
            <div className="p-4 border rounded-xl space-y-3 bg-white shadow-sm">
              <div className="font-semibold text-sm text-slate-800 flex items-center gap-2 border-b pb-2">
                <span>Ship To / Destination</span>
              </div>
              <div className="space-y-2">
                <div>
                  <Label className="text-xs">Destination Facility</Label>
                  <Input value={formData.shipToName} onChange={e => setFormData({...formData, shipToName: e.target.value})} placeholder="AIVA Enterprises – Export Warehouse" />
                </div>
                <div>
                  <Label className="text-xs">Facility Address</Label>
                  <Input value={formData.shipToAddress} onChange={e => setFormData({...formData, shipToAddress: e.target.value})} placeholder="Navi Mumbai, Maharashtra, India" />
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div>
                    <Label className="text-xs">Port of Loading</Label>
                    <Input value={formData.portOfLoading} onChange={e => setFormData({...formData, portOfLoading: e.target.value})} placeholder="Nhava Sheva, India" />
                  </div>
                  <div>
                    <Label className="text-xs">Final Destination</Label>
                    <Input value={formData.destinationPort} onChange={e => setFormData({...formData, destinationPort: e.target.value})} placeholder="Jebel Ali, UAE" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b pb-2">
              <Label className="text-base font-semibold">Product Line Items</Label>
              <Button type="button" variant="outline" size="sm" onClick={addItem} className="h-8">
                <Plus className="h-4 w-4 mr-1" /> Add Product
              </Button>
            </div>
            
            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="p-3 bg-slate-50 rounded-xl border space-y-2 relative">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500">Item #{index + 1}</span>
                    <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => removeItem(index)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="space-y-1 sm:col-span-1">
                      <Label className="text-xs text-muted-foreground">Product Name *</Label>
                      <Input value={item.productName} onChange={(e) => handleItemChange(index, 'productName', e.target.value)} placeholder="Alphonso Mango Pulp" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">HSN / SAC</Label>
                      <Input value={item.hsnCode} onChange={(e) => handleItemChange(index, 'hsnCode', e.target.value)} placeholder="08119090" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Specification</Label>
                      <Input value={item.specification} onChange={(e) => handleItemChange(index, 'specification', e.target.value)} placeholder="Aseptic, 20–22° Brix" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Packaging</Label>
                      <Input value={item.packaging} onChange={(e) => handleItemChange(index, 'packaging', e.target.value)} placeholder="215 Kg Drum" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Qty</Label>
                      <Input type="number" min="0.01" step="any" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Unit</Label>
                      <Input value={item.unit} onChange={(e) => handleItemChange(index, 'unit', e.target.value)} placeholder="MT" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Unit Price ({currSymbol})</Label>
                      <Input type="number" step="0.01" value={item.unitPrice} onChange={(e) => handleItemChange(index, 'unitPrice', Number(e.target.value))} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Financials / Additional Charges */}
          <div className="grid grid-cols-3 gap-4 border-t pt-4">
            <div className="space-y-1">
              <Label className="text-xs">Freight Charges ({currSymbol})</Label>
              <Input type="number" value={financials.freightCharges} onChange={e => setFinancials({...financials, freightCharges: Number(e.target.value)})} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Insurance ({currSymbol})</Label>
              <Input type="number" value={financials.insurance} onChange={e => setFinancials({...financials, insurance: Number(e.target.value)})} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">GST / Tax (%)</Label>
              <Input type="number" value={financials.gstPercent} onChange={e => setFinancials({...financials, gstPercent: Number(e.target.value)})} />
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="space-y-1 border-t pt-4">
            <Label className="text-xs font-semibold">Terms & Conditions</Label>
            <textarea 
              rows={4}
              value={formData.termsAndConditions}
              onChange={e => setFormData({...formData, termsAndConditions: e.target.value})}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-400 font-mono"
            />
          </div>

          <div className="flex justify-end items-center pt-4 border-t space-x-2">
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={mutation.isPending} className="bg-black hover:bg-zinc-800 text-[#D4AF37]">
              {mutation.isPending ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update PO" : "Create PO")}
            </Button>
          </div>

        </form>
      </DialogContent>
    </Dialog>
  )
}

