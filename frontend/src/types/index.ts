export interface UserIdentity {
  telegram?: string;
  email?: string;
  slack?: string;
  discord?: string;
  whatsapp?: string;
}

export interface Responder {
  id: string;
  name: string;
  role: string;
  team: string;
  availability: string;
  preferred_channel: string;
  response_rate: number;
  identities: UserIdentity;
}

export interface IncidentEvent {
  id: string;
  event_type: string;
  actor: string;
  channel?: string | null;
  summary: string;
  details?: Record<string, any> | null;
  timestamp: string;
}

export interface Message {
  id: string;
  sender: string;
  recipient_id: string;
  channel: string;
  content: string;
  status: string;
  sent_at: string;
}

export interface AgentDecision {
  id: string;
  decision_type: string;
  severity?: string | null;
  confidence: number;
  action_taken: string;
  reasoning_summary: string;
  evidence?: string | null;
  created_at: string;
}

export interface Approval {
  id: string;
  action_name: string;
  risk_level: string;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "EXECUTED";
  requested_at: string;
  responded_at?: string | null;
  approved_by?: string | null;
}

export interface Postmortem {
  id: string;
  executive_summary: string;
  impact: string;
  root_cause: string;
  confidence: number;
  time_to_awareness: string;
  time_to_ack: string;
  total_escalations: number;
  channels_used: number;
  responders_involved: number;
  what_went_well?: string;
  what_failed?: string;
  preventive_actions?: string;
  follow_up_tasks?: string[];
  generated_at: string;
}

export interface Incident {
  id: string;
  title: string;
  service: string;
  region: string;
  severity: "P0" | "P1" | "P2" | "P3";
  status: "DETECTED" | "ESCALATING" | "RESPONDING" | "MITIGATING" | "RESOLVED";
  error_rate: number;
  latency: number;
  affected_users: number;
  escalation_level: number;
  owner?: string | null;
  primary_responder?: string | null;
  created_at: string;
  acknowledged_at?: string | null;
  resolved_at?: string | null;
  events?: IncidentEvent[];
  messages?: Message[];
  decisions?: AgentDecision[];
  approvals?: Approval[];
  postmortem?: Postmortem | null;
  plan?: {
    id: string;
    objective: string;
    current_status: string;
    steps: Array<{ id: string; title: string; status: string }>;
    waiting_for?: string;
    confidence: number;
  } | null;
}


export interface ChannelStatus {
  id: string;
  name: string;
  icon: string;
  status: string;
  delivery_rate: number;
  average_latency_ms: number;
  is_connected: boolean;
}

export interface AnalyticsData {
  active_incidents: number;
  responders_online: number;
  avg_ack_time_seconds: number;
  avg_resolution_minutes: number;
  escalations_today: number;
  connected_channels: number;
  ai_automation_rate: number;
  severity_breakdown: Record<string, number>;
  channel_stats: Array<{
    channel: string;
    deliveries: number;
    response_rate: number;
    success_rate: number;
  }>;
  total_incidents: number;
}
