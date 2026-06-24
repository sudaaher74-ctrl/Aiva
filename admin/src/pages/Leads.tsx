import { useState } from "react"
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
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Download, Search } from "lucide-react"

const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5001/api' : '/api'

export default function Leads() {
  const [search, setSearch] = useState("")

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
      case 'Closed': return 'destructive'
      case 'Lost': return 'destructive'
      default: return 'default'
    }
  }

  const filteredData = data?.filter((lead: any) => 
    lead.name?.toLowerCase().includes(search.toLowerCase()) || 
    lead.company?.toLowerCase().includes(search.toLowerCase()) ||
    lead.inquiryId?.toLowerCase().includes(search.toLowerCase())
  )

  const handleExportCSV = () => {
    if (!filteredData || filteredData.length === 0) return

    const headers = ["Inquiry ID", "Date", "Name", "Company", "Country", "Product", "Status"]
    const csvContent = [
      headers.join(","),
      ...filteredData.map((lead: any) => [
        lead.inquiryId,
        new Date(lead.createdAt).toLocaleDateString(),
        `"${lead.name || ''}"`,
        `"${lead.company || ''}"`,
        `"${lead.country || ''}"`,
        `"${lead.product || ''}"`,
        lead.status
      ].join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "leads_export.csv")
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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
        <Button onClick={handleExportCSV} variant="outline" className="gap-2">
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search by name, company, or ID..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9"
        />
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
            {!isLoading && !isError && (!filteredData || filteredData.length === 0) && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">No leads found.</TableCell>
              </TableRow>
            )}
            {filteredData?.map((lead: any) => (
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
