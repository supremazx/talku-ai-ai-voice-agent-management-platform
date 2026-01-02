import { Hono } from "hono";
import type { Env } from './core-utils';
import { 
  TenantEntity, 
  InternalUserEntity, 
  CallSessionEntity, 
  AuditLogEntity, 
  IncidentEntity 
} from "./entities";
import { ok, bad, notFound } from './core-utils';
import { DashboardStats } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // ADMIN DASHBOARD STATS
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
  // TENANTS
  app.get('/api/admin/tenants', async (c) => {
    await TenantEntity.ensureSeed(c.env);
    return ok(c, await TenantEntity.list(c.env));
  });
  app.patch('/api/admin/tenants/:id', async (c) => {
    const id = c.req.param('id');
    const { reason, actorId, ...updates } = await c.req.json();
    if (!reason) return bad(c, 'Audit reason required for this action');
    const tenant = new TenantEntity(c.env, id);
    if (!await tenant.exists()) return notFound(c);
    const oldState = await tenant.getState();
    await tenant.patch(updates);
    // Create Audit Log
    await AuditLogEntity.create(c.env, {
      id: crypto.randomUUID(),
      actorId: actorId || 'system',
      tenantId: id,
      action: 'TENANT_UPDATE',
      reason,
      timestamp: Date.now(),
      payload: { before: oldState, after: updates }
    });
    return ok(c, await tenant.getState());
  });
  // GLOBAL CALLS
  app.get('/api/calls', async (c) => {
    await CallSessionEntity.ensureSeed(c.env);
    const list = await CallSessionEntity.list(c.env);
    // In a real app we'd join with tenant names, but for now just returning items
    return ok(c, list);
  });
  // AUDIT LOGS
  app.get('/api/admin/audit-logs', async (c) => {
    await AuditLogEntity.ensureSeed(c.env);
    return ok(c, await AuditLogEntity.list(c.env));
  });
  // SYSTEM INCIDENTS
  app.get('/api/admin/incidents', async (c) => {
    await IncidentEntity.ensureSeed(c.env);
    return ok(c, await IncidentEntity.list(c.env));
  });
}