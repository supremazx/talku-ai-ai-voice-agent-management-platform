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
export interface BusinessHours {
  enabled: boolean;
  timezone: string;
  schedule: {
    day: number; // 0-6
    start: string; // HH:mm
    end: string; // HH:mm
    closed: boolean;
  }[];
}
export interface RoutingRules {
  officeHours: BusinessHours;
  fallbackNumber: string;
  inboundTimeout: number; // seconds
}
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
export interface TenantContext {
  activeTenant: Tenant | null;
  activeTenantId: string;
}
export interface Agent {
  id: string;
  tenantId: string;
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
  routingRules: RoutingRules;
}
export type GlobalCall = {
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
};
export type CallSession = GlobalCall;
export interface BillingRecord {
  id: string;
  ts: number;
  description: string;
  type: 'top-up' | 'usage' | 'subscription' | 'refund';
  amount: number;
  tenantId: string;
}
export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  tenantId: string | null;
  action: string;
  reason: string;
  timestamp: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  payload?: {
    before?: any;
    after?: any;
    [key: string]: any;
  };
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
export interface ProviderMetric {
  provider: VoiceProvider;
  volume: number;
  latency: number;
  errorRate: number;
}
export interface User { id: string; name: string; }
export interface Chat { id: string; title: string; }
export interface ChatMessage { id: string; chatId: string; userId: string; text: string; ts: number; }