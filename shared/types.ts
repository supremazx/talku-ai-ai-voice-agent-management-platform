export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export type VoiceProvider = 'elevenlabs' | 'openai' | 'deepgram';
export type CallStatus = 'completed' | 'ongoing' | 'failed' | 'no-answer';
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
  status: 'active' | 'pending' | 'released';
}
export interface CallSession {
  id: string;
  agentId: string;
  fromNumber: string;
  toNumber: string;
  startTime: number;
  duration: number; // seconds
  cost: number;
  status: CallStatus;
  transcript: { role: 'agent' | 'user'; text: string; ts: number }[];
}
export interface BillingRecord {
  id: string;
  amount: number;
  type: 'top-up' | 'usage';
  description: string;
  ts: number;
}
export interface DashboardStats {
  totalCalls: number;
  activeAgents: number;
  totalSpend: number;
  avgDuration: number;
  callVolume: { date: string; count: number }[];
}
// Keeping legacy types for compatibility with template internals if needed
export interface User { id: string; name: string; }
export interface Chat { id: string; title: string; }
export interface ChatMessage { id: string; chatId: string; userId: string; text: string; ts: number; }