import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function Dashboard() {
  const { data: poStats, isLoading: isPoStatsLoading } = useQuery({
    queryKey: ['poStats'],
    queryFn: async () => {
      const response = await api.get(`/purchase-orders/stats`);
      return response.data.data;
    }
  });

  const { data: inquiries, isLoading: isInquiriesLoading } = useQuery({
    queryKey: ['inquiries'],
    queryFn: async () => {
      const response = await api.get(`/inquiries`);
      return response.data.data;
    }
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const totalRevenue = poStats?.totalRevenue || 0;
  const activeLeadsCount = inquiries?.filter((i: any) => i.status !== 'Closed' && i.status !== 'Lost').length || 0;
  const totalOrders = poStats?.total || 0;

  // Prepare chart data for PO Statuses
  const chartData = poStats?.statuses ? Object.keys(poStats.statuses).map(key => ({
    name: key,
    value: poStats.statuses[key]
  })) : [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome to AIVA Enterprises Admin Dashboard.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue Card */}
        <div className="rounded-2xl border border-zinc-200/60 bg-white/60 backdrop-blur-md text-card-foreground premium-shadow hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <h3 className="tracking-tight text-sm font-semibold text-zinc-500 uppercase">Total Revenue</h3>
            <div className="p-2.5 bg-gradient-to-br from-[#c5a059]/20 to-[#c5a059]/5 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-[#c5a059]"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            </div>
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">
              {isPoStatsLoading ? <Skeleton className="h-8 w-24" /> : formatCurrency(totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">All time approved orders</p>
          </div>
        </div>

        {/* Active Leads Card */}
        <div className="rounded-2xl border border-zinc-200/60 bg-white/60 backdrop-blur-md text-card-foreground premium-shadow hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <h3 className="tracking-tight text-sm font-semibold text-zinc-500 uppercase">Active Leads</h3>
            <div className="p-2.5 bg-gradient-to-br from-blue-500/20 to-blue-500/5 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-blue-600"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">
              {isInquiriesLoading ? <Skeleton className="h-8 w-16" /> : activeLeadsCount}
            </div>
            <p className="text-xs text-muted-foreground">Currently open inquiries</p>
          </div>
        </div>

        {/* Total Orders Card */}
        <div className="rounded-2xl border border-zinc-200/60 bg-white/60 backdrop-blur-md text-card-foreground premium-shadow hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <h3 className="tracking-tight text-sm font-semibold text-zinc-500 uppercase">Total Orders</h3>
            <div className="p-2.5 bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-emerald-600"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
            </div>
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">
              {isPoStatsLoading ? <Skeleton className="h-8 w-16" /> : totalOrders}
            </div>
            <p className="text-xs text-muted-foreground">Total purchase orders</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 rounded-2xl border border-zinc-200/60 bg-white/60 backdrop-blur-md text-card-foreground premium-shadow overflow-hidden">
          <div className="p-6 space-y-1">
            <h3 className="font-semibold leading-none tracking-tight">Order Status Overview</h3>
            <p className="text-sm text-muted-foreground">Distribution of purchase orders by status</p>
          </div>
          <div className="p-6 pt-0 h-[350px]">
            {isPoStatsLoading ? (
              <Skeleton className="h-[300px] w-full mt-4" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)' }}
                  />
                  <Bar dataKey="value" fill="#c5a059" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="col-span-3 rounded-2xl border border-zinc-200/60 bg-white/60 backdrop-blur-md text-card-foreground premium-shadow flex flex-col overflow-hidden">
          <div className="p-6 space-y-1 border-b">
            <h3 className="font-semibold leading-none tracking-tight">Recent Inquiries</h3>
            <p className="text-sm text-muted-foreground">Latest leads requiring attention</p>
          </div>
          <div className="p-6 pt-0 flex-1 overflow-auto">
            {isInquiriesLoading ? (
              <div className="space-y-4 mt-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-zinc-100 last:border-0 pb-3 last:pb-0">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[150px]" />
                      <Skeleton className="h-3 w-[100px]" />
                    </div>
                    <Skeleton className="h-5 w-[60px] rounded-full" />
                  </div>
                ))}
              </div>
            ) : inquiries && inquiries.length > 0 ? (
              <div className="space-y-4 mt-4">
                {inquiries.slice(0, 5).map((inquiry: any) => (
                  <div key={inquiry._id} className="flex items-center justify-between border-b border-zinc-100 last:border-0 pb-3 last:pb-0">
                    <div>
                      <p className="font-medium text-sm">{inquiry.name}</p>
                      <p className="text-xs text-muted-foreground">{inquiry.company}</p>
                    </div>
                    <div className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                      {inquiry.status || 'New'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground py-4 text-center">No recent inquiries.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
