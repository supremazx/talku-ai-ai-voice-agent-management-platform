import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Shield, Radio, Building2, Zap, Clock, ShieldAlert } from 'lucide-react';
import { api } from '@/lib/api-client';
import { AppLayout } from '@/components/layout/AppLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GlobalCall } from '@shared/types';
import { cn } from '@/lib/utils';
export default function AdminLiveCallsPage() {
  const { data: liveCalls, isLoading } = useQuery({
    queryKey: ['admin-calls-live'],
    queryFn: () => api<{ items: GlobalCall[] }>('/api/admin/calls/live'),
    refetchInterval: 2000,
  });
  return (
    <AppLayout container>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Shield className="h-8 w-8 text-orange-600" />
              Global Live Monitor
            </h1>
            <p className="text-muted-foreground">Real-time infrastructure-wide telephony traffic surveillance.</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 border px-4 py-2 rounded-lg flex flex-col items-center">
              <span className="text-[10px] uppercase font-bold">STT Health</span>
              <span className="text-lg font-bold">99.9%</span>
            </div>
            <div className="bg-red-500/10 text-red-600 border-red-500/20 border px-4 py-2 rounded-lg flex flex-col items-center">
              <span className="text-[10px] uppercase font-bold">Global Load</span>
              <span className="text-lg font-bold">{liveCalls?.items?.length || 0} Sessions</span>
            </div>
          </div>
        </div>
        <div className="grid gap-6">
          <div className="rounded-xl border bg-card shadow-soft overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Tenant ID</TableHead>
                  <TableHead>Session Context</TableHead>
                  <TableHead>Latencies (ms)</TableHead>
                  <TableHead>Provider Status</TableHead>
                  <TableHead>Load</TableHead>
                  <TableHead className="text-right">Admin</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-20">Syncing with MediaSFU Clusters...</TableCell></TableRow>
                ) : (liveCalls?.items || []).length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-20 text-muted-foreground italic">No global traffic detected.</TableCell></TableRow>
                ) : (
                  (liveCalls?.items || []).map((call) => (
                    <TableRow key={call.id} className="hover:bg-muted/20">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs font-mono font-bold truncate max-w-[100px]">{call.tenantId}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] font-mono leading-none">{call.fromNumber}</span>
                          <span className="text-[9px] text-muted-foreground uppercase tracking-tighter">SID: {call.id.slice(0, 8)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Badge variant="outline" className="text-[9px] font-mono bg-blue-50/50">STT: 140</Badge>
                          <Badge variant="outline" className="text-[9px] font-mono bg-orange-50/50">LLM: 840</Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-emerald-500/50 shadow" />
                          <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-emerald-500/50 shadow" />
                          <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-emerald-500/50 shadow" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-xs">
                          <Clock className="h-3 w-3" />
                          {Math.floor((Date.now() - call.startTime) / 1000)}s
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-600 hover:bg-rose-50">
                          <ShieldAlert className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}