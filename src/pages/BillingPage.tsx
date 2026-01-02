import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { CreditCard, Wallet, TrendingUp, Download } from 'lucide-react';
import { api } from '@/lib/api-client';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BillingRecord } from '@shared/types';
import { format } from 'date-fns';
export default function BillingPage() {
  const { data: records, isLoading } = useQuery({
    queryKey: ['billing'],
    queryFn: () => api<{ items: BillingRecord[] }>('/api/billing')
  });
  return (
    <AppLayout container>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Billing & Usage</h1>
          <p className="text-muted-foreground">Manage your credits and view consumption history.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-primary text-primary-foreground shadow-lg border-none relative overflow-hidden">
            <div className="absolute right-[-20px] top-[-20px] opacity-10">
              <Wallet className="h-32 w-32" />
            </div>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-primary-foreground/80 uppercase tracking-widest">Available Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">$124.50</div>
              <Button variant="secondary" size="sm" className="mt-4 w-full font-bold">Add Credits</Button>
            </CardContent>
          </Card>
          <Card className="border-muted/40 shadow-soft">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Estimated Month Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$12.45</div>
              <div className="flex items-center gap-1 text-xs text-emerald-500 mt-1">
                <TrendingUp className="h-3 w-3" /> 5% lower than last month
              </div>
            </CardContent>
          </Card>
          <Card className="border-muted/40 shadow-soft">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Active Phone Numbers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground mt-1">$2.00 / month each</p>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Ledger History</h3>
            <Button variant="ghost" size="sm"><Download className="h-4 w-4 mr-2" /> Download Report</Button>
          </div>
          <div className="rounded-xl border bg-card shadow-soft overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-10">Fetching history...</TableCell></TableRow>
                ) : (
                  records?.items.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="text-sm text-muted-foreground">{format(record.ts, 'MMM dd, yyyy')}</TableCell>
                      <TableCell className="font-medium">{record.description}</TableCell>
                      <TableCell>
                        <Badge variant={record.type === 'top-up' ? 'secondary' : 'outline'} className="capitalize">
                          {record.type}
                        </Badge>
                      </TableCell>
                      <TableCell className={`text-right font-mono ${record.amount < 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                        {record.amount < 0 ? '' : '+'}${record.amount.toFixed(2)}
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