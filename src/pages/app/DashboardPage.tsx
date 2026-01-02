import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Mic, History, Wallet, Bot, TrendingUp, PhoneIncoming } from 'lucide-react';
import { api } from '@/lib/api-client';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { GlobalCall } from '@shared/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
export function DashboardPage() {
  const { data: calls, isLoading: callsLoading } = useQuery({
    queryKey: ['app-calls'],
    queryFn: () => api<{ items: GlobalCall[] }>('/api/app/calls')
  });
  const chartData = [
    { name: 'Mon', count: 45 },
    { name: 'Tue', count: 52 },
    { name: 'Wed', count: 48 },
    { name: 'Thu', count: 61 },
    { name: 'Fri', count: 75 },
    { name: 'Sat', count: 32 },
    { name: 'Sun', count: 28 },
  ];
  if (callsLoading) {
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
  return (
    <AppLayout container>
      <div className="space-y-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">Welcome, Acme Corp</h1>
          <p className="text-muted-foreground">Real-time status of your voice AI infrastructure.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Calls Today" value="124" icon={PhoneIncoming} trend="+12%" />
          <StatCard title="Active Agents" value="3" icon={Bot} />
          <StatCard title="Avg. Duration" value="2m 45s" icon={Mic} />
          <StatCard title="Available Credits" value="$124.50" icon={Wallet} trend="Expires in 12d" trendColor="text-orange-500" />
        </div>
        <div className="grid gap-4 md:grid-cols-7">
          <Card className="md:col-span-4 shadow-soft border-border/50">
            <CardHeader>
              <CardTitle>Call Activity</CardTitle>
              <CardDescription>Volume over the last 7 days.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ea580c" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ea580c" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                    itemStyle={{ color: '#ea580c' }}
                  />
                  <Area type="monotone" dataKey="count" stroke="#ea580c" fillOpacity={1} fill="url(#colorCount)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="md:col-span-3 shadow-soft border-border/50 overflow-hidden">
            <CardHeader className="bg-muted/10">
              <CardTitle className="flex items-center gap-2">
                <History className="h-4 w-4 text-orange-600" />
                Recent Calls
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {calls?.items.slice(0, 6).map((call) => (
                  <div key={call.id} className="flex items-center justify-between p-4 hover:bg-accent/50 transition-colors">
                    <div className="flex flex-col gap-1">
                      <p className="text-xs font-mono font-bold">{call.fromNumber}</p>
                      <p className="text-[10px] text-muted-foreground uppercase">{format(call.startTime, 'HH:mm:ss')}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={call.status === 'completed' ? 'secondary' : 'destructive'} className="text-[9px] uppercase px-1 py-0">
                        {call.status}
                      </Badge>
                      <p className="text-[10px] font-bold text-emerald-600 mt-1">-${call.cost.toFixed(2)}</p>
                    </div>
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
function StatCard({ title, value, icon: Icon, trend, trendColor = "text-emerald-500" }: { title: string; value: string; icon: any; trend?: string; trendColor?: string }) {
  return (
    <Card className="shadow-soft border-border/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{title}</CardTitle>
        <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-950/20">
          <Icon className="h-4 w-4 text-orange-600 dark:text-orange-400" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <div className={cn("flex items-center gap-1 text-[10px] mt-1 font-bold", trendColor)}>
            <TrendingUp className="h-3 w-3" />
            {trend}
          </div>
        )}
      </CardContent>
    </Card>
  );
}