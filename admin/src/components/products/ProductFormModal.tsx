import { useState, useEffect } from "react"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const API_URL = "http://localhost:5000/api"

export default function ProductFormModal({ 
  isOpen, 
  onClose, 
  productToEdit 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  productToEdit?: any 
}) {
  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [tab, setTab] = useState("aseptic")
  const [brix, setBrix] = useState("")
  const [shelfLife, setShelfLife] = useState("")
  const [status, setStatus] = useState("Active")
  
  const queryClient = useQueryClient()
  const { toast } = useToast()

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name || "")
      setCategory(productToEdit.category || "")
      setDescription(productToEdit.description || "")
      setTab(productToEdit.tab || "aseptic")
      setBrix(productToEdit.brix || "")
      setShelfLife(productToEdit.shelfLife || "")
      setStatus(productToEdit.status || "Active")
    } else {
      // Reset form
      setName("")
      setCategory("")
      setDescription("")
      setTab("aseptic")
      setBrix("")
      setShelfLife("")
      setStatus("Active")
    }
  }, [productToEdit, isOpen])

  const mutation = useMutation({
    mutationFn: async (newProduct: any) => {
      if (productToEdit) {
        return axios.patch(`${API_URL}/products/${productToEdit._id}`, newProduct)
      } else {
        return axios.post(`${API_URL}/products`, newProduct)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast({
        title: productToEdit ? "Product updated" : "Product created",
        description: `Successfully ${productToEdit ? 'updated' : 'created'} ${name}.`,
      })
      onClose()
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "There was an error saving the product.",
        variant: "destructive",
      })
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate({
      name,
      category,
      description,
      tab,
      brix,
      shelfLife,
      status
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{productToEdit ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input id="category" value={category} onChange={e => setCategory(e.target.value)} required />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" value={description} onChange={e => setDescription(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tab">Tab</Label>
              <Select value={tab} onValueChange={setTab}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tab" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aseptic">Aseptic</SelectItem>
                  <SelectItem value="iqf">IQF</SelectItem>
                  <SelectItem value="frozen">Frozen</SelectItem>
                  <SelectItem value="canned">Canned</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brix">Brix Level</Label>
              <Input id="brix" value={brix} onChange={e => setBrix(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shelfLife">Shelf Life</Label>
              <Input id="shelfLife" value={shelfLife} onChange={e => setShelfLife(e.target.value)} />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Saving..." : "Save Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
