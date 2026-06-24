import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { ArrowDownToLine, ArrowUpFromLine, Download, Search } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import StockMovementModal from "@/components/inventory/StockMovementModal"

const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5001/api' : '/api'

export default function Inventory() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [movementType, setMovementType] = useState<'IN' | 'OUT'>('IN')
  const [search, setSearch] = useState("")

  const { data, isLoading, isError } = useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/inventory`)
      return response.data.data
    }
  })

  const handleStockIn = () => {
    setMovementType('IN')
    setIsModalOpen(true)
  }

  const handleStockOut = () => {
    setMovementType('OUT')
    setIsModalOpen(true)
  }

  const getStatusBadgeVariant = (status: string) => {
    switch(status) {
      case 'In Stock': return 'default'
      case 'Low Stock': return 'secondary'
      case 'Out of Stock': return 'destructive'
      default: return 'default'
    }
  }

  const filteredData = data?.filter((item: any) => 
    item.product?.name?.toLowerCase().includes(search.toLowerCase()) || 
    item.batchNumber?.toLowerCase().includes(search.toLowerCase()) ||
    item.warehouseLocation?.toLowerCase().includes(search.toLowerCase())
  )

  const handleExportCSV = () => {
    if (!filteredData || filteredData.length === 0) return

    const headers = ["Product", "Category", "Warehouse", "Batch Number", "Quantity", "Unit", "Status"]
    const csvContent = [
      headers.join(","),
      ...filteredData.map((item: any) => [
        `"${item.product?.name || ''}"`,
        `"${item.product?.category || ''}"`,
        `"${item.warehouseLocation || ''}"`,
        `"${item.batchNumber || ''}"`,
        item.quantity,
        item.unit,
        item.status
      ].join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "inventory_export.csv")
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Inventory Management</h2>
          <p className="text-muted-foreground">
            Track stock levels across all warehouses.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExportCSV} variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Export CSV
          </Button>
          <Button onClick={handleStockIn} className="bg-green-600 hover:bg-green-700 text-white">
            <ArrowDownToLine className="mr-2 h-4 w-4" /> Stock In
          </Button>
          <Button onClick={handleStockOut} variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
            <ArrowUpFromLine className="mr-2 h-4 w-4" /> Stock Out
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search by product, batch, or warehouse..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9"
        />
      </div>

      <div className="rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Warehouse</TableHead>
              <TableHead>Batch Number</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">Loading inventory...</TableCell>
              </TableRow>
            )}
            {isError && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-red-500">Error loading inventory.</TableCell>
              </TableRow>
            )}
            {!isLoading && !isError && (!filteredData || filteredData.length === 0) && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">No inventory records found.</TableCell>
              </TableRow>
            )}
            {filteredData?.map((item: any) => (
              <TableRow key={item._id}>
                <TableCell className="font-medium flex items-center gap-3">
                  {item.product?.image_url && (
                    <img src={item.product.image_url} alt="" className="h-8 w-8 rounded object-cover" />
                  )}
                  {item.product?.name || 'Unknown Product'}
                </TableCell>
                <TableCell>{item.product?.category}</TableCell>
                <TableCell>{item.warehouseLocation}</TableCell>
                <TableCell>{item.batchNumber}</TableCell>
                <TableCell className="text-right font-semibold">
                  {item.quantity} <span className="text-xs text-muted-foreground font-normal">{item.unit}</span>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(item.status)}>
                    {item.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <StockMovementModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        movementType={movementType} 
      />
    </div>
  )
}
