import { useState, useEffect } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/axios"
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

export default function CustomerFormModal({ 
  isOpen, 
  onClose, 
  customerToEdit 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  customerToEdit?: any 
}) {
  const [company_name, setCompanyName] = useState("")
  const [contact_person, setContactPerson] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [country, setCountry] = useState("")
  
  const queryClient = useQueryClient()
  const { toast } = useToast()

  useEffect(() => {
    if (customerToEdit) {
      setCompanyName(customerToEdit.company_name || "")
      setContactPerson(customerToEdit.contact_person || "")
      setEmail(customerToEdit.email || "")
      setPhone(customerToEdit.phone || "")
      setCountry(customerToEdit.country || "")
    } else {
      setCompanyName("")
      setContactPerson("")
      setEmail("")
      setPhone("")
      setCountry("")
    }
  }, [customerToEdit, isOpen])

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (customerToEdit) {
        return api.put(`/customers/${customerToEdit._id}`, data)
      } else {
        return api.post(`/customers`, data)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      toast({
        title: customerToEdit ? "Customer updated" : "Customer created",
        description: `Successfully ${customerToEdit ? 'updated' : 'created'} customer.`,
      })
      onClose()
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "There was an error saving the customer.",
        variant: "destructive",
      })
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate({ company_name, contact_person, email, phone, country })
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{customerToEdit ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="company_name">Company Name</Label>
            <Input id="company_name" value={company_name} onChange={e => setCompanyName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact_person">Contact Person</Label>
            <Input id="contact_person" value={contact_person} onChange={e => setContactPerson(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input id="country" value={country} onChange={e => setCountry(e.target.value)} />
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Saving..." : "Save Customer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
