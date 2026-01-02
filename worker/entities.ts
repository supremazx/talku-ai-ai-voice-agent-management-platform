import { IndexedEntity } from "./core-utils";
import type {
  Agent,
  PhoneNumber,
  GlobalCall,
  Tenant,
  InternalUser,
  AuditLog,
  Incident,
  BusinessHours
} from "@shared/types";
import {
  MOCK_TENANTS,
  MOCK_INTERNAL_USERS,
  MOCK_CALLS,
  MOCK_AUDIT_LOGS,
  MOCK_INCIDENTS
} from "@shared/mock-data";
const DEFAULT_HOURS: BusinessHours = {
  enabled: false,
  timezone: "UTC",
  schedule: Array.from({ length: 7 }).map((_, i) => ({
    day: i,
    start: "09:00",
    end: "17:00",
    closed: i === 0 || i === 6
  }))
};
export class TenantEntity extends IndexedEntity<Tenant> {
  static readonly entityName = "tenant";
  static readonly indexName = "tenants";
  static readonly initialState: Tenant = {
    id: "",
    name: "",
    plan: "free",
    status: "active",
    credits: 0,
    limits: { concurrency: 1, maxDuration: 600 },
    metrics: { calls30d: 0, minutes30d: 0, spend30d: 0 },
    createdAt: 0
  };
  static seedData = MOCK_TENANTS;
}
export class PhoneNumberEntity extends IndexedEntity<PhoneNumber> {
  static readonly entityName = "phone-number";
  static readonly indexName = "phone-numbers";
  static readonly initialState: PhoneNumber = {
    id: "",
    e164: "",
    country: "US",
    agentId: null,
    tenantId: "",
    status: "active",
    routingRules: {
      officeHours: DEFAULT_HOURS,
      fallbackNumber: "",
      inboundTimeout: 30
    }
  };
  static seedData: PhoneNumber[] = [
    {
      id: "num-1",
      e164: "+15551234567",
      country: "US",
      agentId: "agent-1",
      tenantId: "tenant-1",
      status: "active",
      routingRules: { officeHours: DEFAULT_HOURS, fallbackNumber: "+15559990001", inboundTimeout: 20 }
    },
    {
      id: "num-2",
      e164: "+15552223333",
      country: "US",
      agentId: "agent-2",
      tenantId: "tenant-1",
      status: "active",
      routingRules: { officeHours: DEFAULT_HOURS, fallbackNumber: "", inboundTimeout: 30 }
    },
    {
      id: "num-3",
      e164: "+442071234567",
      country: "UK",
      agentId: "agent-3",
      tenantId: "tenant-2",
      status: "active",
      routingRules: { officeHours: DEFAULT_HOURS, fallbackNumber: "+442079998888", inboundTimeout: 15 }
    },
    {
      id: "num-4",
      e164: "+18887776666",
      country: "US",
      agentId: null,
      tenantId: "tenant-3",
      status: "active",
      routingRules: { officeHours: DEFAULT_HOURS, fallbackNumber: "", inboundTimeout: 30 }
    }
  ];
}
export class InternalUserEntity extends IndexedEntity<InternalUser> {
  static readonly entityName = "internal-user";
  static readonly indexName = "internal-users";
  static readonly initialState: InternalUser = { id: "", email: "", name: "", role: "read-only", lastLogin: 0 };
  static seedData = MOCK_INTERNAL_USERS;
}
export class AgentEntity extends IndexedEntity<Agent> {
  static readonly entityName = "agent";
  static readonly indexName = "agents";
  static readonly initialState: Agent = {
    id: "",
    tenantId: "tenant-1",
    name: "",
    prompt: "",
    voice: "bella",
    language: "en-US",
    provider: "openai",
    temperature: 0.7
  };
  static seedData: Agent[] = [
    { id: "agent-1", tenantId: "tenant-1", name: "Support Agent", prompt: "Help users with their orders.", voice: "bella", language: "en-US", provider: "openai", temperature: 0.7 },
    { id: "agent-2", tenantId: "tenant-1", name: "Sales Agent", prompt: "Pitch our new product.", voice: "echo", language: "en-US", provider: "elevenlabs", temperature: 0.8 },
    { id: "agent-3", tenantId: "tenant-2", name: "Receptionist", prompt: "Greet visitors.", voice: "nova", language: "en-US", provider: "openai", temperature: 0.5 },
  ];
}
export class CallSessionEntity extends IndexedEntity<GlobalCall> {
  static readonly entityName = "call-session";
  static readonly indexName = "call-sessions";
  static readonly initialState: GlobalCall = {
    id: "",
    tenantId: "",
    agentId: "",
    fromNumber: "",
    toNumber: "",
    startTime: 0,
    duration: 0,
    cost: 0,
    margin: 0,
    status: "completed",
    providerStatuses: { stt: 'ok', llm: 'ok', tts: 'ok' },
    transcript: []
  };
  static seedData = MOCK_CALLS;
}
export class AuditLogEntity extends IndexedEntity<AuditLog> {
  static readonly entityName = "audit-log";
  static readonly indexName = "audit-logs";
  static readonly initialState: AuditLog = {
    id: "",
    actorId: "system",
    actorName: "System",
    tenantId: null,
    action: "",
    reason: "",
    timestamp: 0,
    severity: "low"
  };
  static seedData = MOCK_AUDIT_LOGS;
}
export class IncidentEntity extends IndexedEntity<Incident> {
  static readonly entityName = "incident";
  static readonly indexName = "incidents";
  static readonly initialState: Incident = { id: "", type: "api_error", severity: "low", tenantId: null, status: "open", description: "", createdAt: 0 };
  static seedData = MOCK_INCIDENTS;
}