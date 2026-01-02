import { Agent, PhoneNumber, CallSession, BillingRecord } from './types';
export const MOCK_AGENTS: Agent[] = [
  { id: 'agent-1', name: 'Customer Support', prompt: 'You are a helpful support agent.', voice: 'bella', language: 'en-US', provider: 'elevenlabs', temperature: 0.7 },
  { id: 'agent-2', name: 'Sales Closer', prompt: 'You are an aggressive sales closer.', voice: 'echo', language: 'en-GB', provider: 'openai', temperature: 0.9 },
  { id: 'agent-3', name: 'Appointment Setter', prompt: 'Help users book a slot on the calendar.', voice: 'nova', language: 'es-ES', provider: 'openai', temperature: 0.5 }
];
export const MOCK_NUMBERS: PhoneNumber[] = [
  { id: 'num-1', e164: '+1 (555) 001-2233', country: 'US', agentId: 'agent-1', status: 'active' },
  { id: 'num-2', e164: '+44 20 7946 0958', country: 'UK', agentId: 'agent-2', status: 'active' },
  { id: 'num-3', e164: '+1 (555) 004-5566', country: 'US', agentId: null, status: 'pending' }
];
export const MOCK_CALLS: CallSession[] = Array.from({ length: 25 }).map((_, i) => ({
  id: `call-${i}`,
  agentId: MOCK_AGENTS[i % 3].id,
  fromNumber: `+1555000${1000 + i}`,
  toNumber: MOCK_NUMBERS[0].e164,
  startTime: Date.now() - (i * 3600000),
  duration: Math.floor(Math.random() * 300) + 30,
  cost: Number((Math.random() * 2).toFixed(2)),
  status: i % 10 === 0 ? 'failed' : 'completed',
  transcript: [
    { role: 'agent', text: 'Hello, how can I help you today?', ts: Date.now() - 10000 },
    { role: 'user', text: 'I would like to check my order status.', ts: Date.now() - 5000 }
  ]
}));
export const MOCK_BILLING: BillingRecord[] = [
  { id: 'bill-1', amount: 50.00, type: 'top-up', description: 'Credit Top-up', ts: Date.now() - 86400000 * 5 },
  { id: 'bill-2', amount: -2.45, type: 'usage', description: 'Call usage for Agent-1', ts: Date.now() - 86400000 * 2 },
  { id: 'bill-3', amount: -1.20, type: 'usage', description: 'Call usage for Agent-2', ts: Date.now() - 86400000 * 1 }
];
export const MOCK_USERS = [{ id: 'u1', name: 'Admin User' }];
export const MOCK_CHATS = [];
export const MOCK_CHAT_MESSAGES = [];