import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PhoneCall, Users, DollarSign, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { api } from '@/lib/api-client';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DashboardStats, CallSession } from '@shared/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
export function HomePage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: () => api<DashboardStats>('/api/stats')
  });
  const { data: calls, isLoading: callsLoading } = useQuery({
    queryKey: ['recent-calls'],
    queryFn: () => api<{ items: CallSession[] }>('/api/calls')
  });
  if (statsLoading) {
    return (
      <AppLayout container>
        <div className="space-y-8 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
          </div>
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      </AppLayout>
    );
  }
  const recentCalls = calls?.items?.slice(0, 5) ?? [];
  return (
    <AppLayout container>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Command Center</h1>
          <p className="text-muted-foreground">Monitor your AI voice agent fleet in real-time.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard title="Total Calls" value={stats?.totalCalls ?? 0} icon={PhoneCall} trend="+12.5%" trendType="up" />
          <MetricCard title="Active Agents" value={stats?.activeAgents ?? 0} icon={Users} />
          <MetricCard title="Total Spend" value={`$${stats?.totalSpend?.toFixed(2) ?? '0.00'}`} icon={DollarSign} trend="-2.4%" trendType="down" />
          <MetricCard title="Avg. Duration" value={`${Math.floor((stats?.avgDuration ?? 0) / 60)}m ${Math.floor((stats?.avgDuration ?? 0) % 60)}s`} icon={Clock} />
        </div>
        <div className="grid gap-4 md:grid-cols-7">
          <Card className="md:col-span-4 border-muted/40 shadow-soft">
            <CardHeader>
              <CardTitle>Call Volume</CardTitle>
              <CardDescription>Daily call frequency for the last 7 days.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.callVolume ?? []}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                    itemStyle={{ color: '#f97316' }}
                  />
                  <Area type="monotone" dataKey="count" stroke="#f97316" fillOpacity={1} fill="url(#colorCount)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="md:col-span-3 border-muted/40 shadow-soft">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest call connections across your fleet.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCalls.map((call) => (
                  <div key={call.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{call.fromNumber}</p>
                      <p className="text-xs text-muted-foreground">{new Date(call.startTime).toLocaleTimeString()}</p>
                    </div>
                    <Badge variant={call.status === 'completed' ? 'secondary' : 'destructive'} className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0">
                      {call.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
function MetricCard({ title, value, icon: Icon, trend, trendType }: { title: string; value: string | number; icon: any; trend?: string; trendType?: 'up' | 'down' }) {
  return (
    <Card className="border-muted/40 shadow-soft">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className={cn("text-xs flex items-center mt-1", trendType === 'up' ? "text-emerald-500" : "text-rose-500")}>
            {trendType === 'up' ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
            {trend} from last month
          </p>
        )}
      </CardContent>
    </Card>
  );
}