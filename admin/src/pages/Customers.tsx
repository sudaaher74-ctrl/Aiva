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
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Plus, Trash2, Edit, Download } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import CustomerFormModal from "@/components/customers/CustomerFormModal"
import { useToast } from "@/hooks/use-toast"
import { downloadCSV } from "@/utils/csvExport"

export default function Customers() {
  const [search, setSearch] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [customerToEdit, setCustomerToEdit] = useState<any>(null)
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const response = await api.get(`/customers`)
      return response.data.data
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.delete(`/customers/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      toast({ title: "Customer deleted" })
    }
  })

  const filteredData = data?.filter((c: any) => 
    c.company_name?.toLowerCase().includes(search.toLowerCase()) || 
    c.email?.toLowerCase().includes(search.toLowerCase())
  )

  const handleEdit = (customer: any) => {
    setCustomerToEdit(customer)
    setIsModalOpen(true)
  }

  const handleAddNew = () => {
    setCustomerToEdit(null)
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
          <p className="text-muted-foreground">Manage registered B2B buyers.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => data && downloadCSV(data, 'Customers')}>
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
          <Button onClick={handleAddNew} className="bg-[#c5a059] hover:bg-[#b38b45] text-zinc-950">
            <Plus className="mr-2 h-4 w-4" /> Add Customer
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search by company or email..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9"
        />
      </div>

      <div className="rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company Name</TableHead>
              <TableHead>Contact Person</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Country</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[180px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  <TableCell className="text-right flex justify-end gap-2">
                    <Skeleton className="h-8 w-8 rounded" />
                    <Skeleton className="h-8 w-8 rounded" />
                  </TableCell>
                </TableRow>
              ))
            )}
            {isError && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-red-500">Error loading customers.</TableCell>
              </TableRow>
            )}
            {!isLoading && !isError && (!filteredData || filteredData.length === 0) && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">No customers found.</TableCell>
              </TableRow>
            )}
            {filteredData?.map((c: any) => (
              <TableRow key={c._id}>
                <TableCell className="font-medium">{c.company_name}</TableCell>
                <TableCell>{c.contact_person || '-'}</TableCell>
                <TableCell>{c.email}</TableCell>
                <TableCell>{c.phone || '-'}</TableCell>
                <TableCell>{c.country || '-'}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(c)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-red-500" onClick={() => {
                    if(window.confirm('Are you sure you want to delete this customer?')) {
                      deleteMutation.mutate(c._id)
                    }
                  }}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <CustomerFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        customerToEdit={customerToEdit} 
      />
    </div>
  )
}
