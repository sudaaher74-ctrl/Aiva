import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Download } from "lucide-react"
import { downloadPurchaseOrderPDF } from "@/utils/generatePDF"

export default function PurchaseOrders() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['purchaseOrders'],
    queryFn: async () => {
      const response = await api.get(`/purchase-orders`)
      return response.data.data
    }
  })

  const mutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      return api.patch(`/purchase-orders/${id}/status`, { status })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] })
      toast({ title: "Order status updated" })
    }
  })

  const getStatusBadgeVariant = (status: string) => {
    switch(status) {
      case 'Draft': return 'secondary'
      case 'Pending': return 'secondary'
      case 'Approved': return 'default'
      case 'Processing': return 'outline'
      case 'Shipped': return 'default'
      case 'Delivered': return 'default'
      default: return 'default'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Purchase Orders</h2>
          <p className="text-muted-foreground">
            Manage bulk orders and fulfillments.
          </p>
        </div>
      </div>

      <div className="rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>PO Number</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Buyer</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Total Amt</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">Loading orders...</TableCell>
              </TableRow>
            )}
            {isError && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-red-500">Error loading orders.</TableCell>
              </TableRow>
            )}
            {!isLoading && !isError && data?.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">No purchase orders found.</TableCell>
              </TableRow>
            )}
            {data?.map((order: any) => (
              <TableRow key={order._id}>
                <TableCell className="font-medium">{order.poNumber}</TableCell>
                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="font-medium">{order.buyerCompany}</div>
                  <div className="text-xs text-muted-foreground">{order.buyerName}</div>
                </TableCell>
                <TableCell>{order.buyerCountry}</TableCell>
                <TableCell>${order.totalAmount?.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(order.status)}>{order.status}</Badge>
                </TableCell>
                <TableCell>
                  <Select 
                    value={order.status} 
                    onValueChange={(val) => mutation.mutate({ id: order._id, status: val })}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Processing">Processing</SelectItem>
                      <SelectItem value="Shipped">Shipped</SelectItem>
                      <SelectItem value="Delivered">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="ml-2" 
                    onClick={() => downloadPurchaseOrderPDF(order)}
                    title="Download PDF"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
