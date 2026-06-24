import { Outlet } from "react-router-dom"
import Sidebar from "@/components/Sidebar"
import { Bell, Search, UserCircle } from "lucide-react"

export default function DashboardLayout() {
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
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="relative rounded-full p-2 hover:bg-muted">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-primary"></span>
            </button>
            <div className="flex items-center gap-2">
              <div className="flex flex-col text-right">
                <span className="text-sm font-medium leading-none">Super Admin</span>
                <span className="text-xs text-muted-foreground">admin@aivaenterprises.com</span>
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
