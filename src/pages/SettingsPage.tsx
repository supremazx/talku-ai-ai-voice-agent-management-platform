import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Key, Globe, Shield } from 'lucide-react';
export default function SettingsPage() {
  return (
    <AppLayout container>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Configuration and platform API access.</p>
        </div>
        <div className="grid gap-8">
          <Card className="border-muted/40 shadow-soft">
            <CardHeader>
              <CardTitle>Organization</CardTitle>
              <CardDescription>General settings for your team workspace.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2 max-w-sm">
                <Label htmlFor="orgName">Organization Name</Label>
                <Input id="orgName" defaultValue="Acme Corp AI" />
              </div>
              <div className="grid gap-2 max-w-sm">
                <Label htmlFor="email">Admin Contact</Label>
                <Input id="email" defaultValue="admin@acme.ai" type="email" />
              </div>
              <Button className="mt-2">Update Workspace</Button>
            </CardContent>
          </Card>
          <Card className="border-muted/40 shadow-soft">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Key className="h-5 w-5 text-orange-500" />
                <CardTitle>API Access</CardTitle>
              </div>
              <CardDescription>Use these keys to integrate Talku.ai into your telephony provider.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/40 border">
                  <div>
                    <p className="text-sm font-semibold">Production Key</p>
                    <p className="text-xs text-muted-foreground font-mono">tk_live_••••••••••••••••</p>
                  </div>
                  <Button variant="ghost" size="sm">Reveal</Button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/40 border">
                  <div>
                    <p className="text-sm font-semibold">Development Key</p>
                    <p className="text-xs text-muted-foreground font-mono">tk_test_a1b2c3d4e5f6g7h8</p>
                  </div>
                  <Button variant="ghost" size="sm">Reveal</Button>
                </div>
              </div>
              <Button variant="outline" className="w-full">Generate New Key</Button>
            </CardContent>
          </Card>
          <Card className="border-muted/40 shadow-soft">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-500" />
                <CardTitle>Webhooks</CardTitle>
              </div>
              <CardDescription>Configure URLs for real-time call event delivery.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="webhookUrl">Target URL</Label>
                <div className="flex gap-2">
                  <Input id="webhookUrl" placeholder="https://api.yourdomain.com/webhooks" />
                  <Button variant="outline">Test</Button>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">CALL_ENDED</Badge>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">TRANSCRIPT_READY</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}