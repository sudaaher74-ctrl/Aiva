import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, Package, Settings, LogOut, FileText, ShoppingCart, ClipboardList } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Leads (Inquiries)",
    href: "/leads",
    icon: Users,
  },
  {
    title: "Products",
    href: "/products",
    icon: Package,
  },
  {
    title: "Inventory",
    href: "/inventory",
    icon: ClipboardList,
  },
  {
    title: "Quotations",
    href: "/quotations",
    icon: FileText,
  },
  {
    title: "Purchase Orders",
    href: "/purchase-orders",
    icon: ShoppingCart,
  },
]

export default function Sidebar() {
  const location = useLocation()
  const { logout } = useAuth()

  return (
    <div className="flex h-full w-64 flex-col border-r bg-black text-white">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 font-bold text-xl tracking-wider text-primary border-b border-gray-800">
        AIVA <span className="text-white ml-2 text-sm font-normal">ENTERPRISES</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {item.title}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="border-t border-gray-800 p-4">
        <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800 hover:text-white">
          <Settings className="h-5 w-5" />
          Settings
        </button>
        <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800 hover:text-white mt-1" onClick={() => {
          logout();
          window.location.href = '/login';
        }}>
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  )
}
