import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts"
import { Skeleton } from "@/components/ui/skeleton"

export default function Reports() {
  const { data, isLoading } = useQuery({
    queryKey: ['analytics-stats'],
    queryFn: async () => {
      const response = await api.get(`/analytics/stats`)
      return response.data.data
    }
  })

  const COLORS = ['#c5a059', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

  const renderCountryChart = () => {
    if (!data?.countryBreakdown || data.countryBreakdown.length === 0) {
      return <div className="flex h-full items-center justify-center text-muted-foreground">No data available</div>
    }
    
    // Format for recharts
    const chartData = data.countryBreakdown.map((item: any) => ({
      name: item._id || 'Unknown',
      value: item.count
    }))

    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)' }} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    )
  }

  const renderPageViewsChart = () => {
    if (!data?.pageViews || data.pageViews.length === 0) {
      return <div className="flex h-full items-center justify-center text-muted-foreground">No data available</div>
    }

    const chartData = data.pageViews.map((item: any) => ({
      name: item._id || 'Home',
      views: item.count
    }))

    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" axisLine={false} tickLine={false} />
          <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} />
          <Tooltip 
            cursor={{fill: 'transparent'}}
            contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)' }}
          />
          <Bar dataKey="views" fill="#3b82f6" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytics & Reports</h2>
        <p className="text-muted-foreground">
          Detailed metrics for your website traffic and user engagement.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
          <h3 className="tracking-tight text-sm font-medium mb-2 text-muted-foreground">Total Website Visits</h3>
          <div className="text-3xl font-bold">
            {isLoading ? <Skeleton className="h-10 w-24" /> : data?.totalVisits || 0}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 space-y-1">
            <h3 className="font-semibold leading-none tracking-tight">Visits by Country</h3>
            <p className="text-sm text-muted-foreground">Geographic distribution of visitors</p>
          </div>
          <div className="p-6 pt-0 h-[300px]">
            {isLoading ? <Skeleton className="h-full w-full" /> : renderCountryChart()}
          </div>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 space-y-1">
            <h3 className="font-semibold leading-none tracking-tight">Top Pages</h3>
            <p className="text-sm text-muted-foreground">Most viewed pages on the site</p>
          </div>
          <div className="p-6 pt-0 h-[300px]">
            {isLoading ? <Skeleton className="h-full w-full" /> : renderPageViewsChart()}
          </div>
        </div>
      </div>
    </div>
  )
}
