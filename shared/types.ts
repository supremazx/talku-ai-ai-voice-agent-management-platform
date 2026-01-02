export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export type VoiceProvider = 'elevenlabs' | 'openai' | 'deepgram';
export type CallStatus = 'completed' | 'ongoing' | 'failed' | 'no-answer';
export type AdminRole = 'owner' | 'admin' | 'support' | 'finance' | 'read-only';
export type TenantStatus = 'active' | 'suspended' | 'pending' | 'restricted';
export type TenantPlan = 'free' | 'pro' | 'enterprise';
export interface InternalUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  lastLogin: number;
}
export interface Tenant {
  id: string;
  name: string;
  plan: TenantPlan;
  status: TenantStatus;
  credits: number;
  limits: {
    concurrency: number;
    maxDuration: number;
  };
  metrics: {
    calls30d: number;
    minutes30d: number;
    spend30d: number;
  };
  createdAt: number;
}
export interface Agent {
  id: string;
  name: string;
  prompt: string;
  voice: string;
  language: string;
  provider: VoiceProvider;
  temperature: number;
}
export interface PhoneNumber {
  id: string;
  e164: string;
  country: string;
  agentId: string | null;
  tenantId: string;
  status: 'active' | 'pending' | 'released';
}
export interface GlobalCall {
  id: string;
  tenantId: string;
  agentId: string;
  fromNumber: string;
  toNumber: string;
  startTime: number;
  duration: number; // seconds
  cost: number;
  margin: number;
  status: CallStatus;
  providerStatuses: {
    stt: 'ok' | 'error';
    llm: 'ok' | 'error';
    tts: 'ok' | 'error';
  };
  transcript: { role: 'agent' | 'user'; text: string; ts: number }[];
}
// Alias for backwards compatibility where needed, but GlobalCall is preferred
export type CallSession = GlobalCall;
export interface AuditLog {
  id: string;
  actorId: string; // InternalUser ID
  tenantId: string | null;
  action: string;
  reason: string;
  timestamp: number;
  payload?: Record<string, any>;
}
export interface Incident {
  id: string;
  type: 'provider_latency' | 'api_error' | 'billing_failure' | 'abuse_spike';
  severity: 'low' | 'medium' | 'high' | 'critical';
  tenantId: string | null;
  status: 'open' | 'investigating' | 'resolved';
  description: string;
  createdAt: number;
}
export interface DashboardStats {
  totalActiveTenants: number;
  globalCallVolume: { date: string; count: number }[];
  totalNetMargin: number;
  activeIncidents: number;
  totalCalls24h: number;
  revenue24h: number;
}
// Keeping legacy types for compatibility with template internals if needed
export interface User { id: string; name: string; }
export interface Chat { id: string; title: string; }
export interface ChatMessage { id: string; chatId: string; userId: string; text: string; ts: number; }