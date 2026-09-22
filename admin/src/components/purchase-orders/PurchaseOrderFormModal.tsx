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
import { calculateGSTFromGstin } from "@/utils/gstHelper"
import { numberToWords } from "@/utils/numberToWords"

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

  // Live bill calculation according to supplier GST number (GSTIN)
  const subtotal = items.reduce((acc, it) => acc + (Number(it.quantity) || 0) * (Number(it.unitPrice) || 0), 0)
  const gstCalc = calculateGSTFromGstin(
    subtotal,
    financials.gstPercent,
    formData.supplierGstin,
    financials.freightCharges,
    financials.insurance
  )

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
      subtotal: gstCalc.subtotal,
      freightCharges: gstCalc.freight,
      insurance: gstCalc.insurance,
      gstPercent: gstCalc.gstRate,
      gstAmount: gstCalc.totalGstAmount,
      gstType: gstCalc.gstType,
      cgstPercent: gstCalc.cgstPercent,
      cgstAmount: gstCalc.cgstAmount,
      sgstPercent: gstCalc.sgstPercent,
      sgstAmount: gstCalc.sgstAmount,
      igstPercent: gstCalc.igstPercent,
      igstAmount: gstCalc.igstAmount,
      stateName: gstCalc.stateName,
      totalAmount: gstCalc.grandTotal,
      totalAmountUSD: gstCalc.grandTotal
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
                    <Input 
                      value={formData.supplierGstin} 
                      onChange={e => setFormData({...formData, supplierGstin: e.target.value.toUpperCase()})} 
                      placeholder="27XXXXXXXXXXXXX" 
                    />
                    {formData.supplierGstin.trim().length >= 2 && (
                      <div className="text-[10px] font-semibold mt-1">
                        {gstCalc.isIntraState ? (
                          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block">
                            📍 Maharashtra (Intra-State: CGST {gstCalc.cgstPercent}% + SGST {gstCalc.sgstPercent}%)
                          </span>
                        ) : gstCalc.stateName ? (
                          <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 inline-block">
                            📍 {gstCalc.stateName} (Inter-State: IGST {gstCalc.igstPercent}%)
                          </span>
                        ) : (
                          <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 inline-block">
                            GSTIN: {formData.supplierGstin.toUpperCase()}
                          </span>
                        )}
                      </div>
                    )}
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
              <div className="flex items-center justify-between">
                <Label className="text-xs">GST / Tax (%)</Label>
                {gstCalc.gstRate > 0 && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                    gstCalc.isIntraState ? 'text-emerald-700 bg-emerald-50' : 'text-blue-700 bg-blue-50'
                  }`}>
                    {gstCalc.isIntraState ? 'CGST+SGST' : 'IGST'}
                  </span>
                )}
              </div>
              <Input 
                type="number" 
                value={financials.gstPercent} 
                onChange={e => setFinancials({...financials, gstPercent: Number(e.target.value)})} 
              />
              <div className="flex gap-1 pt-1 flex-wrap">
                {[0, 5, 12, 18, 28].map(slab => (
                  <button
                    key={slab}
                    type="button"
                    onClick={() => setFinancials({...financials, gstPercent: slab})}
                    className={`px-1.5 py-0.5 text-[10px] font-bold rounded border transition-colors ${
                      Number(financials.gstPercent) === slab 
                        ? 'bg-black text-[#E5B25D] border-black' 
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {slab}%
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Live Bill Calculation Summary Card */}
          <div className="bg-[#FAF6F0] border border-[#E8DFC8] rounded-xl p-3.5 space-y-2 text-xs">
            <div className="flex items-center justify-between pb-1.5 border-b border-[#E8DFC8]">
              <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <span>🧾</span> Bill Calculation Summary ({formData.currency})
              </span>
              {gstCalc.gstRate > 0 && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  gstCalc.isIntraState ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {gstCalc.isIntraState 
                    ? `Intra-State: CGST (${gstCalc.cgstPercent}%) + SGST (${gstCalc.sgstPercent}%)` 
                    : `Inter-State: IGST (${gstCalc.igstPercent}%)`}
                </span>
              )}
            </div>

            <div className="space-y-1 text-slate-700">
              <div className="flex justify-between py-0.5">
                <span>Items Subtotal:</span>
                <span className="font-semibold text-slate-900">{currSymbol}{gstCalc.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>

              {gstCalc.gstType === 'CGST_SGST' ? (
                <>
                  <div className="flex justify-between py-0.5 text-emerald-800 font-medium">
                    <span>Central GST (CGST {gstCalc.cgstPercent}%):</span>
                    <span>+{currSymbol}{gstCalc.cgstAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between py-0.5 text-emerald-800 font-medium">
                    <span>State GST (SGST {gstCalc.sgstPercent}%):</span>
                    <span>+{currSymbol}{gstCalc.sgstAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                </>
              ) : gstCalc.gstType === 'IGST' ? (
                <div className="flex justify-between py-0.5 text-blue-800 font-medium">
                  <span>Integrated GST (IGST {gstCalc.igstPercent}% - {gstCalc.stateName || 'Inter-State'}):</span>
                  <span>+{currSymbol}{gstCalc.igstAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              ) : gstCalc.totalGstAmount > 0 ? (
                <div className="flex justify-between py-0.5 text-slate-800 font-medium">
                  <span>GST / Tax ({gstCalc.gstRate}%):</span>
                  <span>+{currSymbol}{gstCalc.totalGstAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              ) : (
                <div className="flex justify-between py-0.5 text-slate-500 italic">
                  <span>GST (0%):</span>
                  <span>Nil / Export</span>
                </div>
              )}

              {gstCalc.freight > 0 && (
                <div className="flex justify-between py-0.5">
                  <span>Freight Charges:</span>
                  <span>+{currSymbol}{gstCalc.freight.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              )}

              {gstCalc.insurance > 0 && (
                <div className="flex justify-between py-0.5">
                  <span>Insurance:</span>
                  <span>+{currSymbol}{gstCalc.insurance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              )}

              <div className="flex justify-between pt-2 border-t border-[#E8DFC8] text-sm font-black text-slate-950 bg-white p-2 rounded-lg border border-slate-200">
                <span>Total Bill Amount:</span>
                <span className="text-[#C5A059]">{currSymbol}{gstCalc.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>

              <div className="text-[10px] text-slate-600 font-medium italic pt-1">
                <span className="font-bold">In words: </span>{numberToWords(gstCalc.grandTotal, formData.currency)}
              </div>
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

