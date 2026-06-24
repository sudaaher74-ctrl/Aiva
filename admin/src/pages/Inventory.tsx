import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react"
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
import StockMovementModal from "@/components/inventory/StockMovementModal"

const API_URL = "http://localhost:5000/api"

export default function Inventory() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [movementType, setMovementType] = useState<'IN' | 'OUT'>('IN')

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
          <Button onClick={handleStockIn} className="bg-green-600 hover:bg-green-700 text-white">
            <ArrowDownToLine className="mr-2 h-4 w-4" /> Stock In
          </Button>
          <Button onClick={handleStockOut} variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
            <ArrowUpFromLine className="mr-2 h-4 w-4" /> Stock Out
          </Button>
        </div>
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
            {!isLoading && !isError && data?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">No inventory records found.</TableCell>
              </TableRow>
            )}
            {data?.map((item: any) => (
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
