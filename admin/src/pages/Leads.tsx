import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const API_URL = "http://localhost:5001/api"

export default function Leads() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['inquiries'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/inquiries`)
      return response.data.data
    }
  })

  const getStatusBadgeVariant = (status: string) => {
    switch(status) {
      case 'New': return 'default'
      case 'Contacted': return 'secondary'
      case 'Quoted': return 'outline'
      case 'Closed': return 'destructive' // can use success if configured
      case 'Lost': return 'destructive'
      default: return 'default'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Leads (Inquiries)</h2>
          <p className="text-muted-foreground">
            Manage your incoming website inquiries and leads.
          </p>
        </div>
      </div>

      <div className="rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Inquiry ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">Loading leads...</TableCell>
              </TableRow>
            )}
            {isError && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-red-500">Error loading leads.</TableCell>
              </TableRow>
            )}
            {!isLoading && !isError && data?.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">No leads found.</TableCell>
              </TableRow>
            )}
            {data?.map((lead: any) => (
              <TableRow key={lead._id}>
                <TableCell className="font-medium">{lead.inquiryId}</TableCell>
                <TableCell>{new Date(lead.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>{lead.name}</TableCell>
                <TableCell>{lead.company}</TableCell>
                <TableCell>{lead.country}</TableCell>
                <TableCell>{lead.product || '-'}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(lead.status)}>{lead.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
