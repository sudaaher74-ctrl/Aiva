import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { api } from "@/lib/axios"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { UserCircle } from "lucide-react"

export default function Settings() {
  const { user, login } = useAuth()
  const { toast } = useToast()
  
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setName(user.name || "")
      setEmail(user.email || "")
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await api.put("/auth/profile", { 
        name, 
        email, 
        ...(password ? { password } : {}) 
      })
      
      if (response.data.success) {
        const token = localStorage.getItem('token')
        if (token) {
           login(token, response.data.data)
        }
        
        toast({ title: "Profile updated successfully" })
        setPassword("") // clear password field
      }
    } catch (error: any) {
      toast({ 
        title: "Error updating profile", 
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive" 
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="p-6 border-b">
          <div className="flex items-center gap-4">
            <UserCircle className="h-12 w-12 text-muted-foreground" />
            <div>
              <h3 className="font-semibold text-lg">Admin Profile</h3>
              <p className="text-sm text-muted-foreground">Update your personal details here.</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input id="name" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">New Password (leave blank to keep current)</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <div className="pt-4">
              <Button type="submit" disabled={isLoading} className="bg-[#c5a059] hover:bg-[#b38b45] text-zinc-950">
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
