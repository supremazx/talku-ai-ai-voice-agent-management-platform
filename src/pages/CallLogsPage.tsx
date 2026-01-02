import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { History, Eye, Download, Search, Info, TrendingUp, DollarSign } from 'lucide-react';
import { api } from '@/lib/api-client';
import { AppLayout } from '@/components/layout/AppLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { GlobalCall } from '@shared/types';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
export default function CallLogsPage() {
  const [selectedCall, setSelectedCall] = useState<GlobalCall | null>(null);
  const { data: calls, isLoading } = useQuery({
    queryKey: ['admin-calls'],
    queryFn: () => api<{ items: GlobalCall[] }>('/api/calls')
  });
  return (
    <AppLayout container>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Global Call Logs</h1>
            <p className="text-muted-foreground">Unified monitoring for all tenant traffic.</p>
          </div>
          <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export Audit CSV</Button>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search by number, tenant ID, or call ID..." />
          </div>
        </div>
        <div className="rounded-xl border bg-card shadow-soft overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Tenant ID</TableHead>
                <TableHead>Connection</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Margin</TableHead>
                <TableHead className="text-right">Detail</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={7} className="text-center py-20 italic">Scanning global database...</TableCell></TableRow>
              ) : (
                (calls?.items || []).map((call) => (
                  <TableRow key={call.id} className="hover:bg-muted/30">
                    <TableCell className="text-[11px] font-mono">
                      {format(new Date(call.startTime), 'MM-dd HH:mm:ss')}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[9px] font-mono">{call.tenantId}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-[11px]">
                        <span className="font-mono text-muted-foreground">F: {call.fromNumber}</span>
                        <span className="font-mono text-muted-foreground">T: {call.toNumber}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">{Math.floor(call.duration / 60)}m {call.duration % 60}s</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Badge variant={call.status === 'completed' ? 'secondary' : 'destructive'} className="text-[9px] uppercase px-1 py-0">
                          {call.status}
                        </Badge>
                        {call.providerStatuses.llm === 'error' && <Info className="h-3 w-3 text-red-500" />}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-emerald-600">
                      +${call.margin.toFixed(3)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => setSelectedCall(call)} className="h-7 w-7">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <Sheet open={!!selectedCall} onOpenChange={() => setSelectedCall(null)}>
          <SheetContent className="sm:max-w-lg overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Admin Debug Console</SheetTitle>
              <SheetDescription className="font-mono text-[10px]">{selectedCall?.id}</SheetDescription>
            </SheetHeader>
            {selectedCall && (
              <div className="mt-6 space-y-6">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-muted/40 p-3 space-y-1">
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" /> Margin Analysis
                    </p>
                    <div className="pt-2">
                      <p className="text-xl font-bold text-emerald-600">${selectedCall.margin.toFixed(3)}</p>
                      <p className="text-[10px] text-muted-foreground">Total Charge: ${selectedCall.cost.toFixed(3)}</p>
                    </div>
                  </div>
                  <div className="rounded-lg bg-muted/40 p-3 space-y-1">
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                      <Activity className="h-3 w-3" /> Provider State
                    </p>
                    <div className="pt-2 space-y-1">
                      <div className="flex justify-between text-[10px]"><span>STT</span><span className="text-emerald-600">OK</span></div>
                      <div className="flex justify-between text-[10px]"><span>LLM</span><span className={selectedCall.providerStatuses.llm === 'ok' ? "text-emerald-600" : "text-red-600"}>{selectedCall.providerStatuses.llm.toUpperCase()}</span></div>
                      <div className="flex justify-between text-[10px]"><span>TTS</span><span className="text-emerald-600">OK</span></div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-widest border-b pb-1">Transcript Preview</h3>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                    {selectedCall.transcript.map((msg, i) => (
                      <div key={i} className={cn("text-xs p-2 rounded", msg.role === 'agent' ? "bg-accent/50 ml-4" : "bg-muted mr-4")}>
                        <p className="font-bold text-[9px] uppercase mb-1">{msg.role}</p>
                        <p className="leading-relaxed">{msg.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-4 flex gap-2">
                  <Button variant="outline" className="flex-1 text-xs">Download PCAP</Button>
                  <Button variant="destructive" className="flex-1 text-xs gap-2">
                    <DollarSign className="h-3 w-3" /> Refund Call
                  </Button>
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </AppLayout>
  );
}