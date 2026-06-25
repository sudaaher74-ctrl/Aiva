import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, Package, Settings, LogOut, FileText, ShoppingCart, ClipboardList, BarChart3, Building2 } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: BarChart3,
  },
  {
    title: "Leads (Inquiries)",
    href: "/leads",
    icon: Users,
  },
  {
    title: "Customers",
    href: "/customers",
    icon: Building2,
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
    <div className="flex h-full w-64 flex-col border-r border-zinc-800 bg-gradient-to-b from-zinc-950 to-zinc-900 text-white shadow-2xl z-20 shrink-0">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 font-bold text-xl tracking-wider text-[#c5a059] border-b border-zinc-800/50 bg-black/20">
        AIVA <span className="text-zinc-100 ml-2 text-sm font-normal">ENTERPRISES</span>
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
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300",
                isActive 
                  ? "bg-gradient-to-r from-[#c5a059] to-[#d4b982] text-zinc-950 shadow-glow scale-[1.02]" 
                  : "text-zinc-400 hover:bg-white/5 hover:text-zinc-50 hover:scale-[1.02]"
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {item.title}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="border-t border-zinc-800/50 p-4 bg-black/10">
        <Link to="/settings" className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-400 transition-all duration-300 hover:bg-white/5 hover:text-zinc-50 hover:scale-[1.02]">
          <Settings className="h-5 w-5" />
          Settings
        </Link>
        <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-400 transition-all duration-300 hover:bg-red-500/10 hover:text-red-400 hover:scale-[1.02] mt-1" onClick={() => {
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
