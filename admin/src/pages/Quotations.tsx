import { useState } from "react"
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
import { Plus, Download } from "lucide-react"
import QuotationFormModal from "@/components/quotations/QuotationFormModal"
import { downloadCSV } from "@/utils/csvExport"

export default function Quotations() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['quotations'],
    queryFn: async () => {
      const response = await api.get(`/quotations`)
      return response.data.data
    }
  })

  const mutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      return api.patch(`/quotations/${id}/status`, { status })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] })
      toast({ title: "Status updated" })
    }
  })

  const getStatusBadgeVariant = (status: string) => {
    switch(status) {
      case 'Draft': return 'secondary'
      case 'Sent': return 'default'
      case 'Accepted': return 'outline'
      case 'Rejected': return 'destructive'
      default: return 'default'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Quotations (RFQs)</h2>
          <p className="text-muted-foreground">
            Manage quote requests from B2B buyers.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => data && downloadCSV(data, 'Quotations')}>
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Create Quotation
          </Button>
        </div>
      </div>

      <div className="rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Total Amt</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">Loading quotations...</TableCell>
              </TableRow>
            )}
            {isError && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-red-500">Error loading quotations.</TableCell>
              </TableRow>
            )}
            {!isLoading && !isError && data?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">No quotations found.</TableCell>
              </TableRow>
            )}
            {data?.map((quote: any) => (
              <TableRow key={quote._id}>
                <TableCell>{new Date(quote.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="font-medium">{quote.customer_id?.company_name || 'Unknown'}</div>
                  <div className="text-xs text-muted-foreground">{quote.customer_id?.email || ''}</div>
                </TableCell>
                <TableCell>
                  {quote.items?.map((item: any) => (
                    <div key={item._id} className="text-sm">
                      {item.product_id?.name || 'Product'} x {item.quantity} {item.unit}
                    </div>
                  ))}
                </TableCell>
                <TableCell>${quote.total_amount?.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(quote.status)}>{quote.status}</Badge>
                </TableCell>
                <TableCell>
                  <Select 
                    value={quote.status} 
                    onValueChange={(val) => mutation.mutate({ id: quote._id, status: val })}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Update Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Sent">Sent</SelectItem>
                      <SelectItem value="Accepted">Accepted</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <QuotationFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  )
}
