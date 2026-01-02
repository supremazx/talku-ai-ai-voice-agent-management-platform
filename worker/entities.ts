import { IndexedEntity } from "./core-utils";
import type { 
  Agent, 
  PhoneNumber, 
  GlobalCall, 
  Tenant, 
  InternalUser, 
  AuditLog, 
  Incident 
} from "@shared/types";
import { 
  MOCK_TENANTS, 
  MOCK_INTERNAL_USERS, 
  MOCK_CALLS, 
  MOCK_AUDIT_LOGS, 
  MOCK_INCIDENTS 
} from "@shared/mock-data";
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
export class InternalUserEntity extends IndexedEntity<InternalUser> {
  static readonly entityName = "internal-user";
  static readonly indexName = "internal-users";
  static readonly initialState: InternalUser = { id: "", email: "", name: "", role: "read-only", lastLogin: 0 };
  static seedData = MOCK_INTERNAL_USERS;
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
  static readonly initialState: AuditLog = { id: "", actorId: "", tenantId: null, action: "", reason: "", timestamp: 0 };
  static seedData = MOCK_AUDIT_LOGS;
}
export class IncidentEntity extends IndexedEntity<Incident> {
  static readonly entityName = "incident";
  static readonly indexName = "incidents";
  static readonly initialState: Incident = { id: "", type: "api_error", severity: "low", tenantId: null, status: "open", description: "", createdAt: 0 };
  static seedData = MOCK_INCIDENTS;
}