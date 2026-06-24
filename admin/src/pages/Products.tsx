import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { Plus, Edit, Trash2 } from "lucide-react"
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
import { useToast } from "@/hooks/use-toast"
import ProductFormModal from "@/components/products/ProductFormModal"

const API_URL = "http://localhost:5000/api"

export default function Products() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [productToEdit, setProductToEdit] = useState<any>(null)
  
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/products`)
      return response.data.data
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return axios.delete(`${API_URL}/products/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast({
        title: "Product deleted",
        description: "The product was successfully deleted.",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete product.",
        variant: "destructive",
      })
    }
  })

  const handleEdit = (product: any) => {
    setProductToEdit(product)
    setIsModalOpen(true)
  }

  const handleAddNew = () => {
    setProductToEdit(null)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteMutation.mutate(id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Products</h2>
          <p className="text-muted-foreground">
            Manage your product inventory and catalog.
          </p>
        </div>
        <Button onClick={handleAddNew} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      <div className="rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Tab / Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">Loading products...</TableCell>
              </TableRow>
            )}
            {isError && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-red-500">Error loading products.</TableCell>
              </TableRow>
            )}
            {!isLoading && !isError && data?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">No products found.</TableCell>
              </TableRow>
            )}
            {data?.map((product: any) => (
              <TableRow key={product._id}>
                <TableCell>
                  <div className="h-10 w-10 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-xs text-gray-400">No Img</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell className="capitalize">{product.tab}</TableCell>
                <TableCell>
                  <Badge variant={product.status === 'Active' ? 'default' : 'secondary'}>
                    {product.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(product._id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ProductFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        productToEdit={productToEdit} 
      />
    </div>
  )
}
