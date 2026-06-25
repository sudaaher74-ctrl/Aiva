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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function Reports() {
  const { data, isLoading } = useQuery({
    queryKey: ['poStats'],
    queryFn: async () => {
      const response = await api.get(`/purchase-orders/stats`)
      return response.data.data
    }
  })

  const COLORS = ['#c5a059', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }

  const renderCountryChart = () => {
    if (!data?.countryBreakdown || data.countryBreakdown.length === 0) {
      return <div className="flex h-full items-center justify-center text-muted-foreground">No data available</div>
    }
    
    // Format for recharts
    const chartData = data.countryBreakdown.map((item: any) => ({
      name: item._id || 'Unknown',
      value: item.value // Display Sales Value instead of count
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
          <Tooltip 
            formatter={(value: any) => formatCurrency(Number(value))}
            contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)' }} 
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    )
  }

  const renderTopBuyersChart = () => {
    if (!data?.recentBuyers || data.recentBuyers.length === 0) {
      return <div className="flex h-full items-center justify-center text-muted-foreground">No data available</div>
    }

    const chartData = data.recentBuyers.map((item: any) => ({
      name: item._id || 'Unknown',
      revenue: item.totalValue
    }))

    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" tickFormatter={(v) => `$${v/1000}k`} axisLine={false} tickLine={false} />
          <YAxis dataKey="name" type="category" width={120} axisLine={false} tickLine={false} />
          <Tooltip 
            formatter={(value: any) => formatCurrency(Number(value))}
            cursor={{fill: 'transparent'}}
            contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)' }}
          />
          <Bar dataKey="revenue" fill="#3b82f6" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytics & Reports</h2>
        <p className="text-muted-foreground">
          Detailed metrics for your B2B sales and purchase orders.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
          <h3 className="tracking-tight text-sm font-medium mb-2 text-muted-foreground">Total Revenue</h3>
          <div className="text-3xl font-bold">
            {isLoading ? <Skeleton className="h-10 w-32" /> : formatCurrency(data?.totalRevenue || 0)}
          </div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
          <h3 className="tracking-tight text-sm font-medium mb-2 text-muted-foreground">Total Purchase Orders</h3>
          <div className="text-3xl font-bold">
            {isLoading ? <Skeleton className="h-10 w-24" /> : data?.total || 0}
          </div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
          <h3 className="tracking-tight text-sm font-medium mb-2 text-muted-foreground">Orders Today</h3>
          <div className="text-3xl font-bold">
            {isLoading ? <Skeleton className="h-10 w-24" /> : data?.today || 0}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 space-y-1">
            <h3 className="font-semibold leading-none tracking-tight">Sales by Country</h3>
            <p className="text-sm text-muted-foreground">Revenue distribution across regions</p>
          </div>
          <div className="p-6 pt-0 h-[300px]">
            {isLoading ? <Skeleton className="h-full w-full" /> : renderCountryChart()}
          </div>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 space-y-1">
            <h3 className="font-semibold leading-none tracking-tight">Top Buyers</h3>
            <p className="text-sm text-muted-foreground">Customers generating the most revenue</p>
          </div>
          <div className="p-6 pt-0 h-[300px]">
            {isLoading ? <Skeleton className="h-full w-full" /> : renderTopBuyersChart()}
          </div>
        </div>
      </div>
      
      <div className="rounded-xl border bg-card text-card-foreground shadow">
        <div className="p-6 space-y-1">
          <h3 className="font-semibold leading-none tracking-tight">Top Buyers List</h3>
          <p className="text-sm text-muted-foreground">Detailed breakdown of top customers</p>
        </div>
        <div className="p-6 pt-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Total Orders</TableHead>
                <TableHead className="text-right">Total Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4"><Skeleton className="h-6 w-full" /></TableCell>
                </TableRow>
              )}
              {!isLoading && data?.recentBuyers?.map((buyer: any) => (
                <TableRow key={buyer._id}>
                  <TableCell className="font-medium">{buyer._id}</TableCell>
                  <TableCell>{buyer.buyerName}</TableCell>
                  <TableCell>{buyer.country}</TableCell>
                  <TableCell>{buyer.totalOrders}</TableCell>
                  <TableCell className="text-right">{formatCurrency(buyer.totalValue)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
