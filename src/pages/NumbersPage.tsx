import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Phone, Globe, Link as LinkIcon, MoreVertical } from 'lucide-react';
import { api } from '@/lib/api-client';
import { AppLayout } from '@/components/layout/AppLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PhoneNumber, Agent } from '@shared/types';
import { toast } from 'sonner';
export default function NumbersPage() {
  const queryClient = useQueryClient();
  const { data: numbers, isLoading: numbersLoading } = useQuery({
    queryKey: ['numbers'],
    queryFn: () => api<{ items: PhoneNumber[] }>('/api/numbers')
  });
  const { data: agents } = useQuery({
    queryKey: ['agents'],
    queryFn: () => api<{ items: Agent[] }>('/api/agents')
  });
  const updateNumber = useMutation({
    mutationFn: ({ id, agentId }: { id: string, agentId: string }) => 
      api<PhoneNumber>(`/api/numbers/${id}`, { method: 'PATCH', body: JSON.stringify({ agentId }) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['numbers'] });
      toast.success('Routing updated');
    }
  });
  return (
    <AppLayout container>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Numbers & Routing</h1>
          <p className="text-muted-foreground">Manage your E.164 inventory and agent assignments.</p>
        </div>
        <div className="rounded-xl border bg-card shadow-soft overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Number</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned Agent</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {numbersLoading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-10">Loading numbers...</TableCell></TableRow>
              ) : (
                numbers?.items.map((num) => (
                  <TableRow key={num.id}>
                    <TableCell className="font-mono font-medium">{num.e164}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Globe className="h-3 w-3 text-muted-foreground" />
                        {num.country}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={num.status === 'active' ? 'secondary' : 'outline'}>
                        {num.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select 
                        defaultValue={num.agentId || 'unassigned'} 
                        onValueChange={(val) => updateNumber.mutate({ id: num.id, agentId: val })}
                      >
                        <SelectTrigger className="w-[180px] h-8 text-xs">
                          <SelectValue placeholder="Select agent" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unassigned">Unassigned</SelectItem>
                          {agents?.items.map(a => (
                            <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <MoreVertical className="h-4 w-4 ml-auto text-muted-foreground cursor-pointer" />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppLayout>
  );
}