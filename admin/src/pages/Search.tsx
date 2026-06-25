import { useSearchParams, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { Search as SearchIcon, Package, Users, ShoppingCart } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function Search() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get("q") || ""
  const navigate = useNavigate()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['search', query],
    queryFn: async () => {
      const response = await api.get(`/search?q=${encodeURIComponent(query)}`)
      return response.data.data
    },
    enabled: !!query
  })

  if (!query) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <h3 className="text-xl font-semibold mb-2">Search</h3>
        <p className="text-muted-foreground">Enter a term to search across the platform.</p>
      </div>
    )
  }

  const { products = [], inquiries = [], purchaseOrders = [] } = data || {}
  const totalResults = products.length + inquiries.length + purchaseOrders.length

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Search Results</h2>
        <p className="text-muted-foreground">
          Showing {isLoading ? "..." : totalResults} results for "{query}"
        </p>
      </div>

      {isLoading && (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      )}

      {isError && (
        <div className="text-red-500 py-8 text-center">Failed to fetch search results.</div>
      )}

      {!isLoading && !isError && totalResults === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center rounded-xl border bg-card shadow-sm">
          <div className="rounded-full bg-muted p-4 mb-4">
            <SearchIcon className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No results found</h3>
          <p className="text-muted-foreground max-w-md">
            We couldn't find any products, leads, or purchase orders matching "{query}".
          </p>
        </div>
      )}

      {!isLoading && totalResults > 0 && (
        <div className="space-y-8">
          {products.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 border-b pb-2">
                <Package className="h-5 w-5" /> Products ({products.length})
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {products.map((p: any) => (
                  <div key={p._id} className="p-4 rounded-xl border bg-card hover:bg-accent cursor-pointer transition-colors" onClick={() => navigate('/products')}>
                    <div className="font-medium text-lg">{p.name}</div>
                    <div className="text-sm text-muted-foreground">{p.category}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {inquiries.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 border-b pb-2">
                <Users className="h-5 w-5" /> Leads ({inquiries.length})
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {inquiries.map((i: any) => (
                  <div key={i._id} className="p-4 rounded-xl border bg-card hover:bg-accent cursor-pointer transition-colors" onClick={() => navigate('/leads')}>
                    <div className="font-medium text-lg">{i.name} <span className="text-sm font-normal text-muted-foreground ml-2">({i.company})</span></div>
                    <div className="text-sm text-muted-foreground mt-1">ID: {i.inquiryId}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {purchaseOrders.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 border-b pb-2">
                <ShoppingCart className="h-5 w-5" /> Purchase Orders ({purchaseOrders.length})
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {purchaseOrders.map((po: any) => (
                  <div key={po._id} className="p-4 rounded-xl border bg-card hover:bg-accent cursor-pointer transition-colors" onClick={() => navigate('/purchase-orders')}>
                    <div className="font-medium text-lg flex justify-between">
                      <span>{po.poNumber}</span>
                      <span className="text-sm font-normal bg-secondary px-2 py-0.5 rounded">{po.status}</span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">{po.buyerCompany}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
