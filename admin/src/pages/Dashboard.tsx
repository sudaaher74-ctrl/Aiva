import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const API_URL = "http://localhost:5001/api";

export default function Dashboard() {
  const { data: poStats, isLoading: isPoStatsLoading } = useQuery({
    queryKey: ['poStats'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/purchase-orders/stats`);
      return response.data.data;
    }
  });

  const { data: inquiries, isLoading: isInquiriesLoading } = useQuery({
    queryKey: ['inquiries'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/inquiries`);
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
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total Revenue</h3>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">
              {isPoStatsLoading ? "..." : formatCurrency(totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">All time approved orders</p>
          </div>
        </div>

        {/* Active Leads Card */}
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Active Leads</h3>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">
              {isInquiriesLoading ? "..." : activeLeadsCount}
            </div>
            <p className="text-xs text-muted-foreground">Currently open inquiries</p>
          </div>
        </div>

        {/* Total Orders Card */}
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total Orders</h3>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">
              {isPoStatsLoading ? "..." : totalOrders}
            </div>
            <p className="text-xs text-muted-foreground">Total purchase orders</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 space-y-1">
            <h3 className="font-semibold leading-none tracking-tight">Order Status Overview</h3>
            <p className="text-sm text-muted-foreground">Distribution of purchase orders by status</p>
          </div>
          <div className="p-6 pt-0 h-[350px]">
            {isPoStatsLoading ? (
              <div className="flex h-full items-center justify-center text-muted-foreground">Loading chart...</div>
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
      </div>
    </div>
  );
}
