import { useSearchParams } from "react-router-dom"
import { Search as SearchIcon } from "lucide-react"

export default function Search() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get("q") || ""

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Search Results</h2>
        <p className="text-muted-foreground">
          Showing results for "{query}"
        </p>
      </div>

      <div className="flex flex-col items-center justify-center py-24 text-center rounded-xl border bg-card shadow-sm">
        <div className="rounded-full bg-primary/10 p-4 mb-4">
          <SearchIcon className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Global Search Coming Soon</h3>
        <p className="text-muted-foreground max-w-md">
          The global search endpoint is under construction. Soon you will be able to search for "{query}" across Leads, Products, and Purchase Orders all in one place.
        </p>
      </div>
    </div>
  )
}
