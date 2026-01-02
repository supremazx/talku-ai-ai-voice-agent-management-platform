import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { History, Eye, Download, Search } from 'lucide-react';
import { api } from '@/lib/api-client';
import { AppLayout } from '@/components/layout/AppLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { CallSession } from '@shared/types';
import { cn } from '@/lib/utils';
export default function CallLogsPage() {
  const [selectedCall, setSelectedCall] = useState<CallSession | null>(null);
  const { data: calls, isLoading } = useQuery({
    queryKey: ['calls'],
    queryFn: () => api<{ items: CallSession[] }>('/api/calls')
  });
  return (
    <AppLayout container>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Call History</h1>
            <p className="text-muted-foreground">Detailed logs of all interactions.</p>
          </div>
          <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export CSV</Button>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9 bg-muted/20" placeholder="Search by number or ID..." />
          </div>
        </div>
        <div className="rounded-xl border bg-card shadow-soft overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={7} className="text-center py-20">Analysing records...</TableCell></TableRow>
              ) : !calls?.items?.length ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-20 text-muted-foreground">
                    No call records found
                  </TableCell>
                </TableRow>
              ) : (
                (calls?.items || []).map((call) => (
                  <TableRow key={call.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="text-xs text-muted-foreground">
                      {format(new Date(call.startTime), 'MMM dd, HH:mm')}
                    </TableCell>
                    <TableCell className="font-mono text-sm">{call.fromNumber}</TableCell>
                    <TableCell className="font-mono text-sm">{call.toNumber}</TableCell>
                    <TableCell>{Math.floor(call.duration / 60)}m {call.duration % 60}s</TableCell>
                    <TableCell>
                      <Badge variant={call.status === 'completed' ? 'secondary' : 'destructive'} className="text-[10px]">
                        {call.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium text-emerald-600 dark:text-emerald-400">${call.cost.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => setSelectedCall(call)}>
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
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                Call Details
              </SheetTitle>
            </SheetHeader>
            {selectedCall && (
              <div className="mt-8 space-y-6">
                <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted/40 p-4 text-xs">
                  <div>
                    <p className="text-muted-foreground uppercase tracking-widest font-bold text-[10px]">ID</p>
                    <p className="font-mono mt-1">{selectedCall.id}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground uppercase tracking-widest font-bold text-[10px]">Duration</p>
                    <p className="mt-1">{selectedCall.duration} seconds</p>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1">${selectedCall.cost?.toFixed(2) || '0.00'}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold border-b pb-2">Transcript</h3>
                  <div className="space-y-4">
                    {selectedCall.transcript.map((msg, i) => (
                      <div key={i} className={cn("flex flex-col gap-1", msg.role === 'agent' ? "items-start" : "items-end")}>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">{msg.role}</span>
                        <div className={cn("max-w-[80%] rounded-lg px-3 py-2 text-sm", msg.role === 'agent' ? "bg-accent" : "bg-primary text-primary-foreground")}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </AppLayout>
  );
}