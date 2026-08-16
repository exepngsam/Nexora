import { Incident, AnalyticsData, ChannelStatus, Responder, Approval } from "../types";

const API_BASE = "http://localhost:8000/api";

export async function fetchIncidents(): Promise<Incident[]> {
  const res = await fetch(`${API_BASE}/incidents`);
  if (!res.ok) throw new Error("Failed to fetch incidents");
  return res.json();
}

export async function fetchIncidentDetail(id: string): Promise<Incident> {
  const res = await fetch(`${API_BASE}/incidents/${id}`);
  if (!res.ok) throw new Error("Failed to fetch incident details");
  return res.json();
}

export async function simulateIncident(payload?: {
  service?: string;
  region?: string;
  error_rate?: number;
  latency?: number;
  affected_users?: number;
  title?: string;
}) {
  const res = await fetch(`${API_BASE}/incidents/simulate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload || {
      service: "Payment API",
      region: "India-East",
      error_rate: 42.0,
      latency: 8.7,
      affected_users: 18420
    })
  });
  if (!res.ok) throw new Error("Simulation trigger failed");
  return res.json();
}

export async function acknowledgeIncident(incidentId: string, payload?: {
  user_id?: string;
  user_name?: string;
  channel?: string;
  message_text?: string;
}) {
  const res = await fetch(`${API_BASE}/incidents/${incidentId}/acknowledge`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload || {
      user_id: "usr_priya",
      user_name: "Priya Sharma",
      channel: "email",
      message_text: "I'm responding. Looking into it now."
    })
  });
  if (!res.ok) throw new Error("Acknowledgement failed");
  return res.json();
}

export async function respondToApproval(approvalId: string, approved: boolean, approverName = "Priya Sharma") {
  const res = await fetch(`${API_BASE}/approvals/${approvalId}/respond`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ approved, approver_name: approverName })
  });
  if (!res.ok) throw new Error("Approval submission failed");
  return res.json();
}

export async function resolveIncident(incidentId: string, resolverName = "Priya Sharma") {
  const res = await fetch(`${API_BASE}/incidents/${incidentId}/resolve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resolver_name: resolverName })
  });
  if (!res.ok) throw new Error("Resolution failed");
  return res.json();
}

export async function fetchChannels(): Promise<ChannelStatus[]> {
  const res = await fetch(`${API_BASE}/channels/status`);
  if (!res.ok) throw new Error("Failed to fetch channels");
  return res.json();
}

export async function fetchResponders(): Promise<Responder[]> {
  const res = await fetch(`${API_BASE}/responders`);
  if (!res.ok) throw new Error("Failed to fetch responders");
  return res.json();
}

export async function fetchAnalytics(): Promise<AnalyticsData> {
  const res = await fetch(`${API_BASE}/analytics`);
  if (!res.ok) throw new Error("Failed to fetch analytics");
  return res.json();
}

export async function fetchFeatherlessModels(): Promise<{
  models: Array<{
    id: string;
    name: string;
    provider: string;
    description: string;
    size: string;
    context: string;
    recommended_for: string;
  }>;
  active_model: string;
  mode: string;
  base_url: string;
  promo_code: string;
  has_api_key: boolean;
}> {
  const res = await fetch(`${API_BASE}/featherless/models`);
  if (!res.ok) throw new Error("Failed to fetch Featherless models");
  return res.json();
}

export async function updateFeatherlessConfig(params: {
  model?: string;
  api_key?: string;
  mode?: string;
}) {
  const res = await fetch(`${API_BASE}/featherless/config`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params)
  });
  if (!res.ok) throw new Error("Failed to update Featherless config");
  return res.json();
}

export async function testFeatherlessConnection(params?: {
  api_key?: string;
  model?: string;
}) {
  const res = await fetch(`${API_BASE}/featherless/test`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params || {})
  });
  if (!res.ok) throw new Error("Failed to test Featherless connection");
  return res.json();
}

export async function fetchSystemStatus() {
  const res = await fetch(`${API_BASE}/system/status`);
  if (!res.ok) throw new Error("Failed to fetch system status");
  return res.json();
}

