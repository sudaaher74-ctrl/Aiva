import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Printer } from "lucide-react"
import { downloadPurchaseOrderPDF } from "@/utils/generatePDF"
import { numberToWords } from "@/utils/numberToWords"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Props {
  isOpen: boolean
  onClose: () => void
  order: any
}

export default function PurchaseOrderPreviewModal({ isOpen, onClose, order }: Props) {
  if (!order) return null;

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Draft': return 'bg-slate-500 hover:bg-slate-600'
      case 'Pending': return 'bg-orange-500 hover:bg-orange-600'
      case 'Approved': return 'bg-blue-600 hover:bg-blue-700'
      case 'Completed': return 'bg-green-500 hover:bg-green-600'
      case 'Delivered': return 'bg-green-500 hover:bg-green-600'
      case 'Rejected': return 'bg-red-500 hover:bg-red-600'
      case 'Cancelled': return 'bg-red-800 hover:bg-red-900'
      default: return 'bg-blue-600'
    }
  }

  const items = order.items?.length > 0 ? order.items : [{
    productName: "Sample Item", quantity: 1, unit: "PCS", unitPrice: 0, amount: 0
  }]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[90vh] p-0 flex flex-col bg-slate-50 border-none rounded-xl overflow-hidden">
        
        {/* Top App Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 shrink-0 shadow-sm z-10">
          <div>
            <DialogTitle className="text-xl font-bold text-slate-800">
              PO Preview: {order.poNumber || "N/A"}
            </DialogTitle>
            <p className="text-sm text-slate-500 mt-1">Review the purchase order before downloading.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => window.print()} className="hidden md:flex">
              <Printer className="mr-2 h-4 w-4" /> Print
            </Button>
            <Button onClick={() => downloadPurchaseOrderPDF(order)} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Download className="mr-2 h-4 w-4" /> Download PDF
            </Button>
          </div>
        </div>

        {/* PO Document Container */}
        <ScrollArea className="flex-1 p-4 md:p-8">
          <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-lg shadow-sm print:shadow-none print:border-none print:max-w-full">
            <div className="p-8 md:p-12">
              
              {/* Header */}
              <div className="flex justify-between items-start mb-10">
                <div className="flex items-center gap-3">
                  <img src="/logo.png" alt="AIVA Enterprises Logo" className="h-16 w-auto object-contain" onError={(e) => {
                    // Fallback if logo is missing
                    (e.target as HTMLImageElement).style.display = 'none';
                    const fallback = document.getElementById('logo-fallback');
                    if (fallback) fallback.style.display = 'flex';
                  }} />
                  <div id="logo-fallback" className="hidden items-center gap-3">
                    <div className="w-12 h-12 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-2xl shadow-sm">
                      A
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-800">AIVA</h1>
                  </div>
                </div>
                <div className="text-right">
                  <h2 className="text-4xl font-bold text-blue-600 tracking-tight uppercase">Purchase Order</h2>
                  <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-slate-600">
                    <div className="font-semibold text-slate-800">PO Number:</div>
                    <div className="font-medium text-slate-900">{order.poNumber || "N/A"}</div>
                    <div className="font-semibold text-slate-800">Issue Date:</div>
                    <div className="font-medium text-slate-900">{new Date(order.createdAt || order.poDate).toLocaleDateString()}</div>
                    <div className="font-semibold text-slate-800">Status:</div>
                    <div>
                      <Badge className={`${getStatusColor(order.status)} text-white border-none px-2 py-0.5 rounded-sm shadow-sm`}>
                        {order.status || "UNKNOWN"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Info */}
              <div className="mb-8 border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="bg-slate-50 px-5 py-3 border-b border-slate-200">
                  <h3 className="font-bold text-slate-800">Aiva Enterprises</h3>
                </div>
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-600">
                  <div className="space-y-1">
                    <p>123 Business Avenue, Tech Park</p>
                    <p>Mumbai, Maharashtra 400001, India</p>
                    <div className="pt-2 flex flex-col gap-1">
                      <p><span className="font-medium text-slate-700">GST:</span> 27AAAAA0000A1Z5</p>
                      <p><span className="font-medium text-slate-700">PAN:</span> AAAAA0000A</p>
                      <p><span className="font-medium text-slate-700">IEC:</span> 0123456789</p>
                    </div>
                  </div>
                  <div className="space-y-1 md:text-right">
                    <p><span className="font-medium text-slate-700">Support:</span> support@aiva.com</p>
                    <p><span className="font-medium text-slate-700">Sales:</span> sales@aiva.com</p>
                    <p><span className="font-medium text-slate-700">Phone:</span> +91 98765 43210</p>
                    <p><span className="font-medium text-slate-700">Website:</span> www.aiva.com</p>
                  </div>
                </div>
              </div>

              {/* Buyer & Shipment Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {/* Bill To */}
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-slate-50 px-5 py-3 border-b border-slate-200">
                    <h3 className="font-bold text-slate-800">Bill To</h3>
                  </div>
                  <div className="p-5 text-sm space-y-1.5 text-slate-600">
                    <p className="font-bold text-base text-slate-800 mb-2">{order.buyerCompany || "N/A"}</p>
                    <p><span className="font-medium text-slate-700">Contact:</span> {order.buyerName || "N/A"}</p>
                    <p><span className="font-medium text-slate-700">Email:</span> {order.buyerEmail || "N/A"}</p>
                    <p><span className="font-medium text-slate-700">Phone:</span> {order.buyerPhone || "N/A"}</p>
                    <p className="pt-2">{order.buyerCountry || ""} - {order.buyerAddress || ""}</p>
                  </div>
                </div>

                {/* Shipment Info */}
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-slate-50 px-5 py-3 border-b border-slate-200">
                    <h3 className="font-bold text-slate-800">Shipment Information</h3>
                  </div>
                  <div className="p-5 text-sm grid grid-cols-[120px_1fr] gap-y-3 gap-x-2 text-slate-600">
                    <div className="font-medium text-slate-700">Incoterms:</div>
                    <div className="text-slate-900 font-medium">{order.incoterms || 'FOB'}</div>
                    
                    <div className="font-medium text-slate-700">Loading Port:</div>
                    <div className="text-slate-900">{order.portOfLoading || 'Nhava Sheva'}</div>
                    
                    <div className="font-medium text-slate-700">Destination:</div>
                    <div className="text-slate-900">{order.destinationPort || 'N/A'}</div>
                    
                    <div className="font-medium text-slate-700">Method:</div>
                    <div className="text-slate-900">{order.shipmentMethod || 'Sea'}</div>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="mb-8 border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-800 uppercase text-xs border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 font-bold w-12">Sr</th>
                      <th className="px-4 py-3 font-bold">Product Description</th>
                      <th className="px-4 py-3 font-bold">HS Code</th>
                      <th className="px-4 py-3 font-bold">Qty</th>
                      <th className="px-4 py-3 font-bold">Unit Price</th>
                      <th className="px-4 py-3 font-bold">Tax %</th>
                      <th className="px-4 py-3 font-bold text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {items.map((item: any, idx: number) => (
                      <tr key={idx} className="bg-white hover:bg-blue-50/50 transition-colors duration-150">
                        <td className="px-4 py-3 font-medium text-slate-500">{idx + 1}</td>
                        <td className="px-4 py-3 font-semibold text-slate-800">{item.productName}</td>
                        <td className="px-4 py-3 text-slate-600">{item.hsCode || "N/A"}</td>
                        <td className="px-4 py-3 text-slate-700">{item.quantity} {item.unit || ''}</td>
                        <td className="px-4 py-3 text-slate-700">{order.currency || 'USD'} {item.unitPrice?.toLocaleString()}</td>
                        <td className="px-4 py-3 text-slate-600">{order.gstPercent || 0}%</td>
                        <td className="px-4 py-3 font-bold text-slate-900 text-right">{order.currency || 'USD'} {item.amount?.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals & In Words */}
              <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-10">
                <div className="flex-1 order-2 md:order-1">
                  <div className="text-sm font-bold text-slate-800 mb-1">Total in Words:</div>
                  <div className="text-sm text-slate-600 italic bg-slate-50 px-4 py-3 rounded-lg border border-slate-100">
                    {numberToWords(order.totalAmount || 0)} {order.currency || 'USD'}
                  </div>
                </div>

                <div className="w-full md:w-80 order-1 md:order-2 border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
                  <div className="p-5 space-y-3 text-sm">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal:</span>
                      <span className="font-medium text-slate-900">{order.currency || 'USD'} {(order.subtotal || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>GST:</span>
                      <span className="font-medium text-slate-900">{order.currency || 'USD'} {(order.gstAmount || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Shipping:</span>
                      <span className="font-medium text-slate-900">{order.currency || 'USD'} {(order.freightCharges || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Other:</span>
                      <span className="font-medium text-slate-900">{order.currency || 'USD'} {(order.insurance || 0).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-5 border-t border-slate-200">
                    <div className="flex justify-between items-center text-lg">
                      <span className="font-bold text-slate-800">Grand Total:</span>
                      <span className="font-black text-blue-600">{order.currency || 'USD'} {(order.totalAmount || 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment & Terms */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                {/* Payment Details */}
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white text-sm">
                  <div className="bg-slate-50 px-5 py-3 border-b border-slate-200">
                    <h3 className="font-bold text-slate-800">Payment Details</h3>
                  </div>
                  <div className="p-5 grid grid-cols-[110px_1fr] gap-y-2 gap-x-2 text-slate-600">
                    <div className="font-medium text-slate-700">Bank Name:</div>
                    <div className="text-slate-900">Global Corporate Bank</div>
                    <div className="font-medium text-slate-700">Account Name:</div>
                    <div className="text-slate-900">Aiva Enterprises Pvt Ltd</div>
                    <div className="font-medium text-slate-700">Account No:</div>
                    <div className="text-slate-900 font-medium tracking-wide">0000111122223333</div>
                    <div className="font-medium text-slate-700">SWIFT/IFSC:</div>
                    <div className="text-slate-900">GCBXX123 / HDFC0001234</div>
                  </div>
                </div>

                {/* Terms */}
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white text-sm">
                  <div className="bg-slate-50 px-5 py-3 border-b border-slate-200">
                    <h3 className="font-bold text-slate-800">Terms & Conditions</h3>
                  </div>
                  <div className="p-5 text-slate-600 space-y-2">
                    <p>1. Goods once sold cannot be returned.</p>
                    <p>2. Delivery subject to stock availability.</p>
                    <p>3. Payment due within agreed terms.</p>
                    <p>4. Taxes applicable as per prevailing law.</p>
                  </div>
                </div>
              </div>

              {/* Footer Signatures */}
              <div className="pt-8 border-t border-slate-200">
                <div className="flex justify-between items-end mb-8">
                  <div className="w-48 text-center">
                    <div className="border-b border-slate-300 h-16 mb-2"></div>
                    <p className="font-bold text-sm text-slate-800">Prepared By</p>
                  </div>
                  <div className="w-48 text-center hidden md:block">
                    <div className="border-b border-slate-300 h-16 mb-2"></div>
                    <p className="font-bold text-sm text-slate-800">Checked By</p>
                  </div>
                  <div className="w-48 text-center">
                    <div className="border-b border-slate-300 h-16 mb-2"></div>
                    <p className="font-bold text-sm text-slate-800">Authorized Signature</p>
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <p>Thank you for your business.</p>
                  <p>Generated by Aiva ERP Management System.</p>
                </div>
              </div>

            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
