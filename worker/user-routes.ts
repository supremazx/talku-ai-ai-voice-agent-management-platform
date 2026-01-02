import { Hono } from "hono";
import type { Env } from './core-utils';
import { AgentEntity, NumberEntity, CallSessionEntity, BillingEntity } from "./entities";
import { ok, bad, notFound } from './core-utils';
import { DashboardStats } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // AGENTS
  app.get('/api/agents', async (c) => {
    await AgentEntity.ensureSeed(c.env);
    return ok(c, await AgentEntity.list(c.env));
  });
  app.post('/api/agents', async (c) => {
    const data = await c.req.json();
    if (!data.name) return bad(c, 'Name required');
    const agent = await AgentEntity.create(c.env, { ...data, id: crypto.randomUUID() });
    return ok(c, agent);
  });
  // NUMBERS
  app.get('/api/numbers', async (c) => {
    await NumberEntity.ensureSeed(c.env);
    return ok(c, await NumberEntity.list(c.env));
  });
  app.patch('/api/numbers/:id', async (c) => {
    const id = c.req.param('id');
    const data = await c.req.json();
    const entity = new NumberEntity(c.env, id);
    if (!await entity.exists()) return notFound(c);
    await entity.patch(data);
    return ok(c, await entity.getState());
  });
  // CALLS
  app.get('/api/calls', async (c) => {
    await CallSessionEntity.ensureSeed(c.env);
    return ok(c, await CallSessionEntity.list(c.env));
  });
  // BILLING
  app.get('/api/billing', async (c) => {
    await BillingEntity.ensureSeed(c.env);
    return ok(c, await BillingEntity.list(c.env));
  });
  // DASHBOARD STATS
  app.get('/api/stats', async (c) => {
    await Promise.all([
      AgentEntity.ensureSeed(c.env),
      CallSessionEntity.ensureSeed(c.env)
    ]);
    const calls = await CallSessionEntity.list(c.env);
    const agents = await AgentEntity.list(c.env);
    const stats: DashboardStats = {
      totalCalls: calls.items.length,
      activeAgents: agents.items.length,
      totalSpend: calls.items.reduce((acc, call) => acc + call.cost, 0),
      avgDuration: calls.items.length > 0 ? calls.items.reduce((acc, call) => acc + call.duration, 0) / calls.items.length : 0,
      callVolume: [
        { date: '2024-05-01', count: 12 },
        { date: '2024-05-02', count: 19 },
        { date: '2024-05-03', count: 15 },
        { date: '2024-05-04', count: 22 },
        { date: '2024-05-05', count: 30 },
        { date: '2024-05-06', count: 25 },
        { date: '2024-05-07', count: 40 },
      ]
    };
    return ok(c, stats);
  });
}