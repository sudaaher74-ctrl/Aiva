import { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import DashboardLayout from './layouts/DashboardLayout'
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider, useAuth } from './contexts/AuthContext'

const Login = lazy(() => import('./pages/Login'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Leads = lazy(() => import('./pages/Leads'))
const Products = lazy(() => import('./pages/Products'))
const Quotations = lazy(() => import('./pages/Quotations'))
const PurchaseOrders = lazy(() => import('./pages/PurchaseOrders'))
const Search = lazy(() => import('./pages/Search'))
const Inventory = lazy(() => import('./pages/Inventory'))
const Customers = lazy(() => import('./pages/Customers'))
const Settings = lazy(() => import('./pages/Settings'))
const Reports = lazy(() => import('./pages/Reports'))

const queryClient = new QueryClient()

const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-zinc-950 text-zinc-400">
    <div className="flex flex-col items-center gap-3">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#c5a059] border-t-transparent" />
      <span className="text-xs text-zinc-500 font-medium tracking-wider uppercase">Loading Portal...</span>
    </div>
  </div>
)

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <PageLoader />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

function AppRoutes() {
  const { isAuthenticated } = useAuth()

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="reports" element={<Reports />} />
          <Route path="leads" element={<Leads />} />
          <Route path="customers" element={<Customers />} />
          <Route path="products" element={<Products />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="quotations" element={<Quotations />} />
          <Route path="purchase-orders" element={<PurchaseOrders />} />
          <Route path="search" element={<Search />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router basename="/admin">
          <AppRoutes />
        </Router>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
