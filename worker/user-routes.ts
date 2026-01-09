import { Hono } from "hono";
import type { Env } from './core-utils';
import {
  TenantEntity,
  CallSessionEntity,
  AgentEntity,
  PhoneNumberEntity,
  AuditLogEntity,
  IncidentEntity
} from "./entities";
import { ok, bad, notFound } from './core-utils';
import { GlobalCall, MediaSFUEvent } from "@shared/types";
import { MOCK_BILLING_RECORDS } from "@shared/mock-data";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  const getTenantId = (c: any) => c.req.header('X-Tenant-Id') || 'tenant-1';
  // --- MEDIASFU WEBHOOKS ---
  app.post('/api/webhooks/mediasfu', async (c) => {
    const payload = await c.req.json() as {
      event: MediaSFUEvent;
      sessionId: string;
      tenantId: string;
      data: any;
      ts: number;
    };
    const inst = new CallSessionEntity(c.env, payload.sessionId);
    let state: GlobalCall;
    if (await inst.exists()) {
      state = await inst.getState();
    } else {
      state = {
        ...CallSessionEntity.initialState,
        id: payload.sessionId,
        tenantId: payload.tenantId,
        startTime: payload.ts,
        is_live: true,
        mediasfu_status: 'initiating',
        metadata: { ...CallSessionEntity.initialState.metadata, sessionId: payload.sessionId }
      };
    }
    switch (payload.event) {
      case 'call.started':
        state.mediasfu_status = 'ringing';
        break;
      case 'call.answered':
        state.mediasfu_status = 'connected';
        break;
      case 'stt.partial':
      case 'llm.response':
        if (payload.data?.text) {
          state.transcript.push({
            role: payload.event === 'stt.partial' ? 'user' : 'agent',
            text: payload.data.text,
            ts: payload.ts
          });
        }
        break;
      case 'call.ended':
        state.mediasfu_status = 'ended';
        state.is_live = false;
        state.status = 'completed';
        state.duration = Math.floor((payload.ts - state.startTime) / 1000);
        state.cost = state.duration * 0.015;
        state.margin = state.cost * 0.4;
        break;
    }
    await inst.save(state);
    return ok(c, { received: true });
  });
  // --- SIMULATION ---
  app.post('/api/admin/simulate-call', async (c) => {
    const sessionId = `sim-${crypto.randomUUID().slice(0, 8)}`;
    const tenantId = 'tenant-1';
    const agent = (await AgentEntity.list(c.env, null, 1)).items[0];
    const call: GlobalCall = {
      ...CallSessionEntity.initialState,
      id: sessionId,
      tenantId,
      agentId: agent?.id || 'agent-1',
      fromNumber: '+15551234567',
      toNumber: '+18881239999',
      startTime: Date.now(),
      is_live: true,
      mediasfu_status: 'connected',
      transcript: [{ role: 'agent', text: 'Hello, simulated system online.', ts: Date.now() }]
    };
    await new CallSessionEntity(c.env, sessionId).save(call);
    const idx = new (require('./core-utils').Index)(c.env, 'call-sessions');
    await idx.add(sessionId);
    return ok(c, call);
  });
  // --- LIVE CALLS ---
  app.get('/api/app/calls/live', async (c) => {
    const tenantId = getTenantId(c);
    const active = await CallSessionEntity.listActive(c.env);
    return ok(c, { items: active.filter(cl => cl.tenantId === tenantId) });
  });
  app.get('/api/admin/calls/live', async (c) => {
    const active = await CallSessionEntity.listActive(c.env);
    return ok(c, { items: active });
  });
  // --- AGENTS ---
  app.get('/api/app/agents', async (c) => {
    const tenantId = getTenantId(c);
    const list = await AgentEntity.list(c.env);
    return ok(c, { items: list.items.filter(a => a.tenantId === tenantId) });
  });
  app.post('/api/app/agents', async (c) => {
    const tenantId = getTenantId(c);
    const body = await c.req.json();
    const created = await AgentEntity.create(c.env, {
      ...AgentEntity.initialState,
      ...body,
      id: crypto.randomUUID(),
      tenantId
    });
    return ok(c, created);
  });
  // --- NUMBERS ---
  app.get('/api/app/numbers', async (c) => {
    const tenantId = getTenantId(c);
    const list = await PhoneNumberEntity.list(c.env);
    return ok(c, { items: list.items.filter(n => n.tenantId === tenantId) });
  });
  app.patch('/api/app/numbers/:id', async (c) => {
    const tenantId = getTenantId(c);
    const inst = new PhoneNumberEntity(c.env, c.req.param('id'));
    if (!await inst.exists()) return notFound(c);
    const state = await inst.getState();
    if (state.tenantId !== tenantId) return bad(c, 'Unauthorized');
    const updates = await c.req.json();
    await inst.patch(updates);
    return ok(c, await inst.getState());
  });
  // --- BILLING ---
  app.get('/api/billing', async (c) => {
    const tenantId = getTenantId(c);
    const isAdmin = !c.req.path.includes('/app/');
    if (isAdmin) {
       return ok(c, { items: MOCK_BILLING_RECORDS });
    }
    return ok(c, { items: MOCK_BILLING_RECORDS.filter(r => r.tenantId === tenantId) });
  });
  // --- ADMIN ---
  app.get('/api/admin/stats', async (c) => {
    const tenants = await TenantEntity.list(c.env);
    const activeCalls = await CallSessionEntity.listActive(c.env);
    return ok(c, {
      totalActiveTenants: tenants.items.filter(t => t.status === 'active').length,
      globalCallVolume: Array.from({ length: 7 }).map((_, i) => ({ 
        date: `2024-05-${10 + i}`, 
        count: Math.floor(Math.random() * 50) + 10 
      })),
      totalNetMargin: 420.50,
      activeIncidents: 0,
      totalCalls24h: 150,
      revenue24h: 240.00
    });
  });
  app.get('/api/admin/tenants', async (c) => {
    return ok(c, await TenantEntity.list(c.env));
  });
  app.get('/api/admin/audit-logs', async (c) => {
    return ok(c, await AuditLogEntity.list(c.env));
  });
  app.get('/api/admin/incidents', async (c) => {
    return ok(c, await IncidentEntity.list(c.env));
  });
  app.get('/api/admin/usage-stats', async (c) => {
    return ok(c, {
      providers: [
        { provider: 'openai', volume: 1000, latency: 850, errorRate: 0.01 },
        { provider: 'elevenlabs', volume: 800, latency: 420, errorRate: 0.02 },
        { provider: 'deepgram', volume: 600, latency: 150, errorRate: 0.005 }
      ]
    });
  });
  app.get('/api/app/calls', async (c) => {
    const tenantId = getTenantId(c);
    const list = await CallSessionEntity.list(c.env);
    return ok(c, { items: list.items.filter(cl => cl.tenantId === tenantId) });
  });
  app.get('/api/calls', async (c) => {
    return ok(c, await CallSessionEntity.list(c.env));
  });
}