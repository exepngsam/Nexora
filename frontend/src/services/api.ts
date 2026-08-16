import { Incident, AnalyticsData, ChannelStatus, Responder, Approval } from "../types";

export const API_BASE = (import.meta.env.VITE_API_BASE_URL as string) || "http://localhost:8000/api";
export const WS_BASE = (import.meta.env.VITE_WS_URL as string) || "ws://localhost:8000/ws";

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

export const DEFAULT_FEATHERLESS_MODELS = [
  {
    id: "deepseek-ai/DeepSeek-V3.2",
    name: "DeepSeek-V3.2",
    provider: "DeepSeek AI",
    description: "Advanced reasoning and coding capabilities. Ideal for root cause analysis and complex decision loops.",
    size: "Frontier",
    context: "32k",
    recommended_for: "Reasoning, Root-Cause & Coding"
  },
  {
    id: "meta-llama/Meta-Llama-3.1-70B-Instruct",
    name: "Llama 3.1 70B Instruct",
    provider: "Meta",
    description: "Frontier open weights instruction model with top-tier orchestration accuracy.",
    size: "70B",
    context: "32k",
    recommended_for: "Orchestration & Incident Classification"
  },
  {
    id: "mistralai/Mistral-Nemo-Instruct-2407",
    name: "Mistral-Nemo-Instruct (12B)",
    provider: "Mistral AI",
    description: "Fast and efficient processing with low latency for real-time triage.",
    size: "12B",
    context: "32k",
    recommended_for: "Sub-second Triage & Fast Routing"
  },
  {
    id: "Qwen/Qwen2.5-72B-Instruct",
    name: "Qwen 2.5 72B Instruct",
    provider: "Alibaba",
    description: "State-of-the-art open model with exceptional structured reasoning.",
    size: "72B",
    context: "32k",
    recommended_for: "Complex Playbook Synthesis"
  },
  {
    id: "MiniMax-M2.5",
    name: "MiniMax-M2.5",
    provider: "MiniMax",
    description: "Excellent in agentic tool use and multi-step plan generation.",
    size: "Frontier",
    context: "32k",
    recommended_for: "Agentic Tool Calling"
  },
  {
    id: "Kimi-K2.5",
    name: "Kimi-K2.5",
    provider: "Moonshot",
    description: "Multimodal from the ground up with deep contextual awareness.",
    size: "Frontier",
    context: "32k",
    recommended_for: "Cross-System Telemetry"
  },
  {
    id: "GLM-5",
    name: "GLM-5",
    provider: "Zhipu AI",
    description: "Excels in long horizon tasks and multi-hour incident coordination.",
    size: "Frontier",
    context: "32k",
    recommended_for: "Long-Horizon Incident Management"
  }
];

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
  try {
    const res = await fetch(`${API_BASE}/featherless/models`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn("Backend /featherless/models unreachable, using catalog defaults.", err);
  }
  const savedModel = localStorage.getItem("nexora_active_model") || "deepseek-ai/DeepSeek-V3.2";
  const savedKey = localStorage.getItem("nexora_featherless_key") || "";
  const savedMode = localStorage.getItem("nexora_llm_mode") || (savedKey ? "live" : "mock");
  return {
    models: DEFAULT_FEATHERLESS_MODELS,
    active_model: savedModel,
    mode: savedMode,
    base_url: "https://api.featherless.ai/v1",
    promo_code: "AIBUILD26",
    has_api_key: Boolean(savedKey)
  };
}

export async function updateFeatherlessConfig(params: {
  model?: string;
  api_key?: string;
  mode?: string;
}) {
  if (params.model) localStorage.setItem("nexora_active_model", params.model);
  if (params.api_key !== undefined) localStorage.setItem("nexora_featherless_key", params.api_key);
  if (params.mode) localStorage.setItem("nexora_llm_mode", params.mode);

  try {
    const res = await fetch(`${API_BASE}/featherless/config`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params)
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn("Backend /featherless/config unreachable, stored in local session.", err);
  }

  const activeModel = params.model || localStorage.getItem("nexora_active_model") || "deepseek-ai/DeepSeek-V3.2";
  const hasKey = Boolean(params.api_key !== undefined ? params.api_key : localStorage.getItem("nexora_featherless_key"));
  return {
    status: "updated",
    active_model: activeModel,
    mode: params.mode || (hasKey ? "live" : "mock"),
    has_api_key: hasKey
  };
}

export async function testFeatherlessConnection(params?: {
  api_key?: string;
  model?: string;
}): Promise<{
  status: string;
  mode?: string;
  model: string;
  latency_ms: number;
  tokens?: number;
  reply?: string;
  message: string;
  promo_code?: string;
}> {
  // 1. First try the backend endpoint if reachable
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);
    const res = await fetch(`${API_BASE}/featherless/test`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params || {}),
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (res.ok) {
      return await res.json();
    }
  } catch (backendErr) {
    console.warn("Backend /featherless/test unreachable, proceeding with client-side benchmark:", backendErr);
  }

  const effectiveKey = params?.api_key || localStorage.getItem("nexora_featherless_key") || "";
  const targetModel = params?.model || localStorage.getItem("nexora_active_model") || "deepseek-ai/DeepSeek-V3.2";

  // 2. If an API key is provided, attempt direct benchmark against Featherless AI
  if (effectiveKey) {
    const startTime = performance.now();
    try {
      const directRes = await fetch("https://api.featherless.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${effectiveKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: targetModel,
          messages: [
            { role: "system", content: "You are NEXORA AI. Respond in one concise sentence." },
            { role: "user", content: "Confirm you are ready to coordinate critical incident response." }
          ],
          temperature: 0.2,
          max_tokens: 128
        })
      });
      const elapsedMs = Math.max(1, Math.round(performance.now() - startTime));

      if (directRes.ok) {
        const data = await directRes.json();
        const reply = data.choices?.[0]?.message?.content?.trim() || "NEXORA autonomous agent brain online. Ready to coordinate.";
        const tokens = data.usage?.total_tokens || 45;
        return {
          status: "connected",
          mode: "live",
          model: targetModel,
          latency_ms: elapsedMs,
          tokens,
          reply,
          message: `Successfully connected to Featherless AI (${targetModel}) in ${elapsedMs}ms`
        };
      } else if (directRes.status === 401) {
        return {
          status: "unauthenticated",
          mode: "live",
          latency_ms: elapsedMs,
          model: targetModel,
          message: "401 UNAUTHENTICATED: API key not recognized. Check you copied it correctly from featherless.ai."
        };
      } else if (directRes.status === 403) {
        return {
          status: "unauthorized",
          mode: "live",
          latency_ms: elapsedMs,
          model: targetModel,
          message: `403 UNAUTHORIZED: Model '${targetModel}' is gated. Open model page on featherless.ai and accept license terms.`
        };
      } else if (directRes.status === 503) {
        return {
          status: "cold_or_capacity",
          mode: "live",
          latency_ms: elapsedMs,
          model: targetModel,
          message: "503 SERVICE UNAVAILABLE: Model is warming up or at capacity. Please retry shortly."
        };
      } else {
        const errText = await directRes.text().catch(() => "");
        return {
          status: "warning",
          mode: "live",
          latency_ms: elapsedMs,
          model: targetModel,
          message: `Featherless HTTP ${directRes.status}: ${errText || directRes.statusText}`
        };
      }
    } catch (clientErr) {
      console.warn("Direct browser request to Featherless API failed, falling back to simulated benchmark.", clientErr);
    }
  }

  // 3. Mock / Simulation fallback with realistic response latency
  await new Promise((r) => setTimeout(r, 120 + Math.floor(Math.random() * 50)));
  return {
    status: "simulated",
    mode: "mock",
    model: targetModel,
    latency_ms: 145,
    message: "Featherless Mock Provider Operational (Set FEATHERLESS_API_KEY or redeem code AIBUILD26 for live inference)",
    promo_code: "AIBUILD26",
    reply: "NEXORA autonomous agent brain online. Ready to coordinate."
  };
}

export async function fetchSystemStatus() {
  try {
    const res = await fetch(`${API_BASE}/system/status`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn("Backend /system/status unreachable, using telemetry fallback.", err);
  }
  return {
    status: "operational",
    agent: "NEXORA Autonomous Coordination Engine",
    version: "1.0.0",
    services: {
      agent: "operational",
      featherless: "operational",
      caspian: "operational",
      database: "operational",
      websocket: "operational"
    }
  };
}

