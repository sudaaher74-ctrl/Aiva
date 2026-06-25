import { Outlet } from "react-router-dom"
import Sidebar from "@/components/Sidebar"
import { Bell, Search, UserCircle } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "../contexts/AuthContext"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5001/api' : '/api'

export default function DashboardLayout() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  // Polling for new inquiries every 30s
  const { data: inquiries } = useQuery({
    queryKey: ['notifications-inquiries'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/inquiries`)
      return response.data.data
    },
    refetchInterval: 30000
  })

  const newInquiries = inquiries?.filter((i: any) => i.status === 'New') || []
  const totalNotifications = newInquiries.length

  return (
    <div className="flex h-screen w-full bg-secondary/30">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="flex h-16 items-center justify-between border-b bg-background px-6">
          <div className="flex items-center w-full max-w-md gap-2 rounded-md border bg-muted/50 px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>
          <div className="flex items-center gap-4">
            
            <Popover>
              <PopoverTrigger asChild>
                <button className="relative rounded-full p-2 hover:bg-muted outline-none">
                  <Bell className="h-5 w-5" />
                  {totalNotifications > 0 && (
                    <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] text-white">
                      {totalNotifications}
                    </span>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80">
                <div className="font-medium border-b pb-2 mb-2">Notifications</div>
                <ScrollArea className="h-72">
                  {totalNotifications === 0 ? (
                    <div className="text-sm text-muted-foreground text-center py-4">No new notifications.</div>
                  ) : (
                    <div className="space-y-4">
                      {newInquiries.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-blue-600 mb-1">New Inquiries ({newInquiries.length})</h4>
                          {newInquiries.slice(0, 5).map((inquiry: any) => (
                            <div key={inquiry._id} className="text-sm mb-1">
                              • Lead from {inquiry.name} ({inquiry.company})
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </ScrollArea>
              </PopoverContent>
            </Popover>

            <div className="flex items-center gap-2">
              <div className="flex flex-col text-right">
                <span className="text-sm font-medium leading-none">{user?.name || "Admin"}</span>
                <span className="text-xs text-muted-foreground">{user?.email || "admin@aivaenterprises.com"}</span>
              </div>
              <UserCircle className="h-8 w-8 text-muted-foreground" />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
