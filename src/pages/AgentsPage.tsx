import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Bot, Mic, Languages, Sparkles } from 'lucide-react';
import { api } from '@/lib/api-client';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Agent } from '@shared/types';
import { toast } from 'sonner';
export default function AgentsPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const { data: agents, isLoading } = useQuery({
    queryKey: ['agents'],
    queryFn: () => api<{ items: Agent[] }>('/api/agents')
  });
  const createAgent = useMutation({
    mutationFn: (newAgent: Partial<Agent>) => api<Agent>('/api/agents', { method: 'POST', body: JSON.stringify(newAgent) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      setOpen(false);
      toast.success('Agent created successfully');
    }
  });
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createAgent.mutate({
      name: formData.get('name') as string,
      prompt: formData.get('prompt') as string,
      voice: formData.get('voice') as string,
      language: 'en-US',
      provider: 'openai',
      temperature: 0.7
    });
  };
  return (
    <AppLayout container>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">AI Agents</h1>
            <p className="text-muted-foreground">Design and manage your voice personalities.</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="btn-gradient">
                <Plus className="mr-2 h-4 w-4" /> Create Agent
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>New Voice Agent</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Agent Name</Label>
                  <Input id="name" name="name" placeholder="e.g. Receptionist Bot" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="voice">Voice Model</Label>
                  <Select name="voice" defaultValue="bella">
                    <SelectTrigger>
                      <SelectValue placeholder="Select a voice" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bella">Bella (Soft, Friendly)</SelectItem>
                      <SelectItem value="echo">Echo (Confident, Deep)</SelectItem>
                      <SelectItem value="nova">Nova (Bright, Energetic)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prompt">System Prompt</Label>
                  <Textarea 
                    id="prompt" 
                    name="prompt" 
                    className="h-32" 
                    placeholder="Describe how the agent should behave..." 
                    required 
                  />
                </div>
                <Button type="submit" className="w-full" disabled={createAgent.isPending}>
                  {createAgent.isPending ? "Creating..." : "Save Agent"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => <Card key={i} className="h-48 animate-pulse bg-muted" />)
          ) : (
            agents?.items.map((agent) => (
              <Card key={agent.id} className="group overflow-hidden border-muted/40 transition-all hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-950 text-orange-600">
                      <Bot className="h-6 w-6" />
                    </div>
                    <Badge variant="outline" className="text-[10px]">{agent.provider}</Badge>
                  </div>
                  <CardTitle className="mt-4">{agent.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">{agent.prompt}</p>
                </CardContent>
                <CardFooter className="bg-muted/30 flex justify-between pt-4">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Mic className="h-3 w-3" /> {agent.voice}</span>
                    <span className="flex items-center gap-1"><Languages className="h-3 w-3" /> {agent.language}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 text-xs">Configure</Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}