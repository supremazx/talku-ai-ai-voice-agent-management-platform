import { Hono } from "hono";
import type { Env } from './core-utils';
import {
  TenantEntity,
  InternalUserEntity,
  CallSessionEntity,
  AuditLogEntity,
  IncidentEntity,
  AgentEntity,
  PhoneNumberEntity
} from "./entities";
import { ok, bad, notFound } from './core-utils';
import { DashboardStats, BillingRecord, ProviderMetric, Agent, PhoneNumber } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  const getTenantId = (c: any) => c.req.header('X-Tenant-Id') || 'tenant-1';
  // --- CUSTOMER SCOPED ROUTES (/api/app/*) ---
  app.get('/api/app/agents', async (c) => {
    const tenantId = getTenantId(c);
    await AgentEntity.ensureSeed(c.env);
    const list = await AgentEntity.list(c.env);
    const filtered = list.items.filter(a => a.tenantId === tenantId);
    return ok(c, { items: filtered });
  });
  app.post('/api/app/agents', async (c) => {
    const tenantId = getTenantId(c);
    const body = await c.req.json();
    const agent: Agent = {
      ...AgentEntity.initialState,
      ...body,
      id: crypto.randomUUID(),
      tenantId
    };
    const created = await AgentEntity.create(c.env, agent);
    return ok(c, created);
  });
  app.get('/api/app/numbers', async (c) => {
    const tenantId = getTenantId(c);
    await PhoneNumberEntity.ensureSeed(c.env);
    const list = await PhoneNumberEntity.list(c.env);
    const filtered = list.items.filter(n => n.tenantId === tenantId);
    return ok(c, { items: filtered });
  });
  app.patch('/api/app/numbers/:id', async (c) => {
    const tenantId = getTenantId(c);
    const id = c.req.param('id');
    const updates = await c.req.json();
    const inst = new PhoneNumberEntity(c.env, id);
    if (!await inst.exists()) return notFound(c);
    const state = await inst.getState();
    if (state.tenantId !== tenantId) return bad(c, 'Unauthorized access to number');
    await inst.patch(updates);
    return ok(c, await inst.getState());
  });
  app.post('/api/app/numbers/provision', async (c) => {
    const tenantId = getTenantId(c);
    const { e164, country } = await c.req.json();
    const number: PhoneNumber = {
      ...PhoneNumberEntity.initialState,
      id: crypto.randomUUID(),
      e164,
      country: country || 'US',
      tenantId,
      status: 'active'
    };
    const created = await PhoneNumberEntity.create(c.env, number);
    return ok(c, created);
  });
  app.get('/api/app/calls', async (c) => {
    const tenantId = getTenantId(c);
    await CallSessionEntity.ensureSeed(c.env);
    const list = await CallSessionEntity.list(c.env);
    const filtered = list.items.filter(call => call.tenantId === tenantId);
    return ok(c, { items: filtered });
  });
  // --- ADMIN GLOBAL ROUTES (/api/admin/*) ---
  app.get('/api/admin/stats', async (c) => {
    await Promise.all([
      TenantEntity.ensureSeed(c.env),
      CallSessionEntity.ensureSeed(c.env),
      IncidentEntity.ensureSeed(c.env)
    ]);
    const tenants = await TenantEntity.list(c.env);
    const calls = await CallSessionEntity.list(c.env);
    const incidents = await IncidentEntity.list(c.env);
    const stats: DashboardStats = {
      totalActiveTenants: tenants.items.filter(t => t.status === 'active').length,
      globalCallVolume: [
        { date: '2024-05-01', count: 450 },
        { date: '2024-05-02', count: 520 },
        { date: '2024-05-03', count: 480 },
        { date: '2024-05-04', count: 610 },
        { date: '2024-05-05', count: 750 },
        { date: '2024-05-06', count: 690 },
        { date: '2024-05-07', count: 820 },
      ],
      totalNetMargin: calls.items.reduce((acc, call) => acc + call.margin, 0),
      activeIncidents: incidents.items.filter(i => i.status !== 'resolved').length,
      totalCalls24h: calls.items.filter(cl => cl.startTime > Date.now() - 86400000).length,
      revenue24h: calls.items.filter(cl => cl.startTime > Date.now() - 86400000).reduce((a, b) => a + b.cost, 0),
    };
    return ok(c, stats);
  });
  app.get('/api/admin/tenants', async (c) => {
    await TenantEntity.ensureSeed(c.env);
    return ok(c, await TenantEntity.list(c.env));
  });
  app.patch('/api/admin/tenants/:id', async (c) => {
    const id = c.req.param('id');
    const { reason, actorId, actorName, ...updates } = await c.req.json();
    if (!reason) return bad(c, 'Audit reason required for this action');
    const tenant = new TenantEntity(c.env, id);
    if (!await tenant.exists()) return notFound(c);
    const oldState = await tenant.getState();
    await tenant.patch(updates);
    await AuditLogEntity.create(c.env, {
      id: crypto.randomUUID(),
      actorId: actorId || 'system',
      actorName: actorName || 'System Admin',
      tenantId: id,
      action: 'TENANT_UPDATE',
      reason,
      timestamp: Date.now(),
      severity: 'medium',
      payload: { before: oldState, after: updates }
    });
    return ok(c, await tenant.getState());
  });
  app.get('/api/calls', async (c) => {
    await CallSessionEntity.ensureSeed(c.env);
    return ok(c, await CallSessionEntity.list(c.env));
  });
  app.get('/api/billing', async (c) => {
    const calls = await CallSessionEntity.list(c.env);
    const records: BillingRecord[] = calls.items.map(call => ({
      id: `bill-${call.id}`,
      ts: call.startTime,
      description: `Call Usage: ${call.fromNumber} -> ${call.toNumber}`,
      type: 'usage',
      amount: -call.cost,
      tenantId: call.tenantId
    }));
    return ok(c, { items: records.sort((a, b) => b.ts - a.ts) });
  });
  app.get('/api/admin/audit-logs', async (c) => {
    await AuditLogEntity.ensureSeed(c.env);
    return ok(c, await AuditLogEntity.list(c.env));
  });
  app.get('/api/admin/incidents', async (c) => {
    await IncidentEntity.ensureSeed(c.env);
    return ok(c, await IncidentEntity.list(c.env));
  });
  app.get('/api/admin/usage-stats', async (c) => {
    const metrics: ProviderMetric[] = [
      { provider: 'elevenlabs', volume: 45000, latency: 420, errorRate: 0.02 },
      { provider: 'openai', volume: 120000, latency: 1100, errorRate: 0.01 },
      { provider: 'deepgram', volume: 85000, latency: 150, errorRate: 0.005 }
    ];
    return ok(c, { providers: metrics });
  });
  // Legacy fallback
  app.get('/api/agents', async (c) => {
    await AgentEntity.ensureSeed(c.env);
    return ok(c, await AgentEntity.list(c.env));
  });
  app.get('/api/numbers', async (c) => {
    await PhoneNumberEntity.ensureSeed(c.env);
    return ok(c, await PhoneNumberEntity.list(c.env));
  });
}