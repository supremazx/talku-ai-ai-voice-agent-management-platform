import { IndexedEntity } from "./core-utils";
import type { Agent, PhoneNumber, CallSession, BillingRecord } from "@shared/types";
import { MOCK_AGENTS, MOCK_NUMBERS, MOCK_CALLS, MOCK_BILLING } from "@shared/mock-data";
export class AgentEntity extends IndexedEntity<Agent> {
  static readonly entityName = "agent";
  static readonly indexName = "agents";
  static readonly initialState: Agent = { id: "", name: "", prompt: "", voice: "bella", language: "en-US", provider: "elevenlabs", temperature: 0.7 };
  static seedData = MOCK_AGENTS;
}
export class NumberEntity extends IndexedEntity<PhoneNumber> {
  static readonly entityName = "phone-number";
  static readonly indexName = "phone-numbers";
  static readonly initialState: PhoneNumber = { id: "", e164: "", country: "US", agentId: null, status: "pending" };
  static seedData = MOCK_NUMBERS;
}
export class CallSessionEntity extends IndexedEntity<CallSession> {
  static readonly entityName = "call-session";
  static readonly indexName = "call-sessions";
  static readonly initialState: CallSession = { id: "", agentId: "", fromNumber: "", toNumber: "", startTime: 0, duration: 0, cost: 0, status: "completed", transcript: [] };
  static seedData = MOCK_CALLS;
}
export class BillingEntity extends IndexedEntity<BillingRecord> {
  static readonly entityName = "billing";
  static readonly indexName = "billing-records";
  static readonly initialState: BillingRecord = { id: "", amount: 0, type: "usage", description: "", ts: 0 };
  static seedData = MOCK_BILLING;
}