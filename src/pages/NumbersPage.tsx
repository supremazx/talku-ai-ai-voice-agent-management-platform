import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Phone, Globe, Link as LinkIcon, MoreVertical, Settings2, Plus, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import { api } from '@/lib/api-client';
import { AppLayout } from '@/components/layout/AppLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { PhoneNumber, Agent } from '@shared/types';
import { useTenantStore } from '@/lib/tenant-store';
import { toast } from 'sonner';
export default function NumbersPage() {
  const queryClient = useQueryClient();
  const activeTenantId = useTenantStore((s) => s.activeTenantId);
  const [selectedNum, setSelectedNum] = useState<PhoneNumber | null>(null);
  const { data: numbers, isLoading: numbersLoading } = useQuery({
    queryKey: ['app-numbers', activeTenantId],
    queryFn: () => api<{ items: PhoneNumber[] }>('/api/app/numbers', {
      headers: { 'X-Tenant-Id': activeTenantId }
    })
  });
  const { data: agents } = useQuery({
    queryKey: ['app-agents', activeTenantId],
    queryFn: () => api<{ items: Agent[] }>('/api/app/agents', {
      headers: { 'X-Tenant-Id': activeTenantId }
    })
  });
  const updateNumber = useMutation({
    mutationFn: (updates: Partial<PhoneNumber>) =>
      api<PhoneNumber>(`/api/app/numbers/${selectedNum?.id}`, { 
        method: 'PATCH', 
        headers: { 'X-Tenant-Id': activeTenantId },
        body: JSON.stringify(updates) 
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['app-numbers'] });
      toast.success('Routing configuration updated');
      setSelectedNum(null);
    }
  });
  const provisionNumber = useMutation({
    mutationFn: () => api<PhoneNumber>('/api/app/numbers/provision', {
      method: 'POST',
      headers: { 'X-Tenant-Id': activeTenantId },
      body: JSON.stringify({ e164: `+1555${Math.floor(1000000 + Math.random() * 9000000)}`, country: 'US' })
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['app-numbers'] });
      toast.success('New number provisioned');
    }
  });
  return (
    <AppLayout container>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Numbers & Routing</h1>
            <p className="text-muted-foreground">Manage your E.164 telephony inventory and AI mapping.</p>
          </div>
          <Button onClick={() => provisionNumber.mutate()} disabled={provisionNumber.isPending} className="btn-gradient">
            <Plus className="mr-2 h-4 w-4" /> Provision Number
          </Button>
        </div>
        <div className="rounded-xl border bg-card shadow-soft overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Number</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Assigned Agent</TableHead>
                <TableHead>Rules</TableHead>
                <TableHead className="text-right">Manage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {numbersLoading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-20 animate-pulse">Scanning telephony backbone...</TableCell></TableRow>
              ) : numbers?.items.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-20 text-muted-foreground">No active numbers. Provision your first one above.</TableCell></TableRow>
              ) : (
                numbers?.items.map((num) => (
                  <TableRow key={num.id} className="group hover:bg-muted/30">
                    <TableCell className="font-mono font-bold text-primary">{num.e164}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Globe className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs">{num.country}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={num.agentId ? 'secondary' : 'outline'} className="gap-1.5 px-2">
                        {num.agentId ? (
                          <>
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            {agents?.items.find(a => a.id === num.agentId)?.name || 'Linked'}
                          </>
                        ) : 'Unassigned'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {num.routingRules.officeHours.enabled && <Clock className="h-3 w-3 text-orange-500" />}
                        {num.routingRules.fallbackNumber && <ShieldCheck className="h-3 w-3 text-blue-500" />}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => setSelectedNum(num)} className="h-8 w-8">
                        <Settings2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <Sheet open={!!selectedNum} onOpenChange={() => setSelectedNum(null)}>
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Routing Configuration</SheetTitle>
              <SheetDescription className="font-mono text-xs">{selectedNum?.e164}</SheetDescription>
            </SheetHeader>
            {selectedNum && (
              <div className="mt-8 space-y-8">
                <section className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Primary Destination</h3>
                  <div className="space-y-2">
                    <Label>Assign Agent</Label>
                    <Select 
                      defaultValue={selectedNum.agentId || 'none'} 
                      onValueChange={(val) => updateNumber.mutate({ agentId: val === 'none' ? null : val })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an AI Agent" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None (Hang up)</SelectItem>
                        {agents?.items.map(a => (
                          <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </section>
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Office Hours</h3>
                    <Switch 
                      checked={selectedNum.routingRules.officeHours.enabled}
                      onCheckedChange={(val) => updateNumber.mutate({ 
                        routingRules: { ...selectedNum.routingRules, officeHours: { ...selectedNum.routingRules.officeHours, enabled: val } } 
                      })}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">If enabled, calls outside business hours will skip the agent.</p>
                </section>
                <section className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Fallback Logic</h3>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label>PSTN Fallback Number</Label>
                      <Input 
                        placeholder="+15550000000" 
                        defaultValue={selectedNum.routingRules.fallbackNumber}
                        onBlur={(e) => updateNumber.mutate({ 
                          routingRules: { ...selectedNum.routingRules, fallbackNumber: e.target.value } 
                        })}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Ring Timeout (Seconds)</Label>
                      <Input 
                        type="number"
                        defaultValue={selectedNum.routingRules.inboundTimeout}
                        onBlur={(e) => updateNumber.mutate({ 
                          routingRules: { ...selectedNum.routingRules, inboundTimeout: parseInt(e.target.value) } 
                        })}
                      />
                    </div>
                  </div>
                </section>
              </div>
            )}
            <SheetFooter className="mt-8">
              <Button variant="outline" className="w-full" onClick={() => setSelectedNum(null)}>Done</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </AppLayout>
  );
}