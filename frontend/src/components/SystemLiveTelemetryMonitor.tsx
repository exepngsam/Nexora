import React, { useState, useEffect } from "react";
import {
  Activity,
  Zap,
  Radio,
  Server,
  Database,
  Cpu,
  ShieldCheck,
  Flame,
  Globe,
  TrendingUp,
  Clock,
  Layers,
  Sparkles,
  RefreshCw,
  Sliders,
  CheckCircle2,
  HardDrive,
  BarChart3,
  Wifi,
  ExternalLink,
  ChevronRight,
  AlertTriangle
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  BarChart,
  Bar
} from "recharts";

interface SystemLiveTelemetryMonitorProps {
  onTriggerSimulation?: (params: {
    service: string;
    region: string;
    error_rate: number;
    latency: number;
    affected_users: number;
    title: string;
  }) => void;
}

interface ServiceNode {
  id: string;
  name: string;
  category: "edge" | "core" | "db" | "ai" | "comm";
  region: string;
  status: "nominal" | "warning" | "critical";
  errorRate: number;
  latencyMs: number;
  throughput: string;
  uptime: string;
  description: string;
}

export const SystemLiveTelemetryMonitor: React.FC<SystemLiveTelemetryMonitorProps> = ({
  onTriggerSimulation
}) => {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [activeMetricTab, setActiveMetricTab] = useState<"error" | "latency" | "throughput" | "caspian">("error");

  // Real-time dynamic rolling time-series buffer
  const [timeSeriesData, setTimeSeriesData] = useState<Array<{
    time: string;
    errorRate: number;
    latencyP99: number;
    throughputReq: number;
    paymentLatency: number;
    authLatency: number;
    dbLatency: number;
    kafkaLag: number;
  }>>(() => {
    const initial = [];
    const now = Date.now();
    for (let i = 20; i >= 0; i--) {
      const t = new Date(now - i * 2000);
      const timeStr = `${String(t.getMinutes()).padStart(2, "0")}:${String(t.getSeconds()).padStart(2, "0")}`;
      initial.push({
        time: timeStr,
        errorRate: +(0.01 + Math.random() * 0.03).toFixed(3),
        latencyP99: +(38 + Math.random() * 8).toFixed(1),
        throughputReq: Math.round(46000 + Math.random() * 4000),
        paymentLatency: +(36 + Math.random() * 10).toFixed(1),
        authLatency: +(16 + Math.random() * 4).toFixed(1),
        dbLatency: +(6 + Math.random() * 3).toFixed(1),
        kafkaLag: Math.round(Math.random() * 2)
      });
    }
    return initial;
  });

  // 1-second live telemetry tick stream
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = `${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
      
      setTimeSeriesData((prev) => {
        const last = prev[prev.length - 1];
        const nextPoint = {
          time: timeStr,
          errorRate: +(0.01 + Math.random() * 0.03).toFixed(3),
          latencyP99: +(38 + Math.random() * 8).toFixed(1),
          throughputReq: Math.round(46000 + Math.random() * 4000),
          paymentLatency: +(36 + Math.random() * 10).toFixed(1),
          authLatency: +(16 + Math.random() * 4).toFixed(1),
          dbLatency: +(6 + Math.random() * 3).toFixed(1),
          kafkaLag: Math.round(Math.random() * 2)
        };
        const updated = [...prev.slice(1), nextPoint];
        return updated;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  // 14 Core Monitored Microservices
  const services: ServiceNode[] = [
    {
      id: "svc_payment",
      name: "Payment API Gateway",
      category: "core",
      region: "India-East (ap-south-1)",
      status: "nominal",
      errorRate: 0.02,
      latencyMs: 42,
      throughput: "4,820 req/s",
      uptime: "99.99%",
      description: "Checkout, merchant settlement & Stripe/Razorpay webhooks"
    },
    {
      id: "svc_auth",
      name: "Hydra OAuth & Session",
      category: "core",
      region: "US-East (us-east-1)",
      status: "nominal",
      errorRate: 0.00,
      latencyMs: 18,
      throughput: "8,940 req/s",
      uptime: "100.0%",
      description: "JWT issuance, RBAC permissions & multi-factor auth tokens"
    },
    {
      id: "svc_postgres",
      name: "Postgres Aurora Primary",
      category: "db",
      region: "India-East (ap-south-1)",
      status: "nominal",
      errorRate: 0.00,
      latencyMs: 8,
      throughput: "1,420 qps",
      uptime: "99.99%",
      description: "Multi-AZ persistence, connection pool: 24/100 connections"
    },
    {
      id: "svc_kafka",
      name: "Kafka Event Bus Fabric",
      category: "core",
      region: "Global Edge",
      status: "nominal",
      errorRate: 0.00,
      latencyMs: 2,
      throughput: "28.4k msg/s",
      uptime: "100.0%",
      description: "Real-time telemetry event streaming & CDC pipeline"
    },
    {
      id: "svc_redis",
      name: "Redis Cluster & Locks",
      category: "db",
      region: "Global Multi-AZ",
      status: "nominal",
      errorRate: 0.00,
      latencyMs: 1.2,
      throughput: "34.2k ops/s",
      uptime: "100.0%",
      description: "98.6% cache hit rate, distributed state lock coordination"
    },
    {
      id: "svc_caspian",
      name: "Caspian Dispatch Hub",
      category: "comm",
      region: "Global Edge Gateway",
      status: "nominal",
      errorRate: 0.01,
      latencyMs: 12,
      throughput: "142 msg/min",
      uptime: "99.98%",
      description: "Telegram Bot, Priority Email, Slack War Room & WhatsApp"
    },
    {
      id: "svc_featherless",
      name: "Featherless AI Engine",
      category: "ai",
      region: "Serverless Cloud",
      status: "nominal",
      errorRate: 0.00,
      latencyMs: 240,
      throughput: "185 tok/s",
      uptime: "99.95%",
      description: "Llama-3.1-70B zero-shot severity classification & reasoning"
    },
    {
      id: "svc_envoy",
      name: "Envoy Edge Ingress WAF",
      category: "edge",
      region: "Global CDN Edge",
      status: "nominal",
      errorRate: 0.01,
      latencyMs: 12,
      throughput: "48,200 req/s",
      uptime: "100.0%",
      description: "TLS termination, DDoS mitigation & geo-distributed routing"
    },
    {
      id: "svc_orders",
      name: "Order & Cart Engine",
      category: "core",
      region: "India-East (ap-south-1)",
      status: "nominal",
      errorRate: 0.01,
      latencyMs: 34,
      throughput: "3,120 req/s",
      uptime: "99.98%",
      description: "Cart state, inventory hold allocation & pricing pipeline"
    },
    {
      id: "svc_inventory",
      name: "Inventory Sync API",
      category: "core",
      region: "EU-Central (eu-central-1)",
      status: "nominal",
      errorRate: 0.00,
      latencyMs: 26,
      throughput: "1,840 req/s",
      uptime: "100.0%",
      description: "Multi-warehouse real-time SKU stock synchronization"
    },
    {
      id: "svc_push",
      name: "Mobile Push Gateway",
      category: "comm",
      region: "Global",
      status: "nominal",
      errorRate: 0.02,
      latencyMs: 88,
      throughput: "12.4k push/m",
      uptime: "99.94%",
      description: "APNs & FCM low-latency device push dispatch"
    },
    {
      id: "svc_vector",
      name: "PGVector Long-Term Memory",
      category: "ai",
      region: "India-East",
      status: "nominal",
      errorRate: 0.00,
      latencyMs: 42,
      throughput: "240 queries/s",
      uptime: "99.99%",
      description: "Historical incident embeddings & semantic RCA lookup"
    },
    {
      id: "svc_prom",
      name: "Prometheus Metric Hub",
      category: "edge",
      region: "Global Edge",
      status: "nominal",
      errorRate: 0.00,
      latencyMs: 4,
      throughput: "1.2M metrics/s",
      uptime: "100.0%",
      description: "High-frequency scrape agents & SLO evaluation loop"
    },
    {
      id: "svc_audit",
      name: "Audit Log Cryptoledger",
      category: "core",
      region: "Global Multi-AZ",
      status: "nominal",
      errorRate: 0.00,
      latencyMs: 3,
      throughput: "820 writes/s",
      uptime: "100.0%",
      description: "SHA-256 tamper-evident human decision ledger"
    }
  ];

  // Quick Chaos Simulation Trigger
  const triggerChaosOutage = (serviceName = "Payment API", severity = "P0") => {
    if (onTriggerSimulation) {
      if (serviceName.includes("Payment")) {
        onTriggerSimulation({
          service: "Payment API",
          region: "India-East",
          error_rate: 42.0,
          latency: 8.7,
          affected_users: 18420,
          title: "Critical Payment Gateway 504 Degradation"
        });
      } else if (serviceName.includes("Postgres") || serviceName.includes("Database")) {
        onTriggerSimulation({
          service: "Postgres Aurora Primary",
          region: "India-East",
          error_rate: 28.5,
          latency: 6.2,
          affected_users: 9400,
          title: "Postgres Connection Pool Saturation P1"
        });
      } else {
        onTriggerSimulation({
          service: serviceName,
          region: "US-East",
          error_rate: 15.0,
          latency: 3.4,
          affected_users: 5200,
          title: `${serviceName} Latency Anomaly (${severity})`
        });
      }
    }
  };

  const latestPoint = timeSeriesData[timeSeriesData.length - 1] || {
    errorRate: 0.02,
    latencyP99: 42,
    throughputReq: 48200
  };

  return (
    <div className="rounded-3xl glass-panel p-6 sm:p-7 border border-[#8B5CF6]/30 shadow-2xl relative overflow-hidden space-y-6 animate-in fade-in duration-300">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-bl from-emerald-500/10 via-cyan-500/10 to-transparent blur-3xl pointer-events-none" />

      {/* Top Banner: Real-time Nominal Health Status */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[#8B5CF6]/20 relative z-10">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 shadow-lg shadow-emerald-500/20">
            <ShieldCheck className="h-7 w-7 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h2 className="text-xl sm:text-2xl font-black text-white font-heading tracking-tight">
                LIVE MULTI-SYSTEM TELEMETRY & OBSERVABILITY
              </h2>
              <span className="text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider font-heading bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center space-x-1.5 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <span>14/14 SERVICES OPERATIONAL</span>
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Autonomous telemetry monitoring 14 microservices across 6 global regions • Real-time Prometheus stream
            </p>
          </div>
        </div>

        {/* Chaos Injection Action Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => triggerChaosOutage("Payment API", "P0")}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-600/30 to-fuchsia-600/30 hover:from-rose-600/50 hover:to-fuchsia-600/50 text-rose-200 text-xs font-bold border border-rose-500/40 shadow-lg shadow-rose-500/20 active:scale-95 transition-all cursor-pointer font-heading"
            title="Inject P0 Payment 504 Outage"
          >
            <Flame className="h-4 w-4 text-rose-400 animate-bounce" />
            <span>Simulate P0 Outage</span>
          </button>

          <button
            onClick={() => triggerChaosOutage("Postgres Aurora Primary", "P1")}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-600/25 to-orange-600/25 hover:from-amber-600/40 hover:to-orange-600/40 text-amber-200 text-xs font-bold border border-amber-500/40 shadow-md active:scale-95 transition-all cursor-pointer font-heading"
            title="Inject P1 Database Pool Exhaustion"
          >
            <Zap className="h-4 w-4 text-amber-400" />
            <span>Simulate DB Saturation</span>
          </button>
        </div>
      </div>

      {/* Hero Real-time Metrics Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10">
        
        {/* Global Error Rate */}
        <div className="p-4 rounded-2xl bg-[#0D091A]/85 border border-emerald-500/30 relative overflow-hidden group hover:border-emerald-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#C4B5FD] uppercase tracking-wider font-heading">GLOBAL ERROR RATE</span>
            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              NOMINAL
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1 font-mono flex items-baseline space-x-1.5">
            <span>{latestPoint.errorRate}%</span>
            <span className="text-[10px] text-slate-400 font-sans font-normal">&lt; 1.0% threshold</span>
          </div>
          <div className="w-full h-1.5 bg-[#07050E] rounded-full mt-2.5 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full w-[4%]" />
          </div>
        </div>

        {/* Global P99 Latency */}
        <div className="p-4 rounded-2xl bg-[#0D091A]/85 border border-cyan-500/30 relative overflow-hidden group hover:border-cyan-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#C4B5FD] uppercase tracking-wider font-heading">EDGE P99 LATENCY</span>
            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              OPTIMAL
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-cyan-400 mt-1 font-mono flex items-baseline space-x-1.5">
            <span>{latestPoint.latencyP99}ms</span>
            <span className="text-[10px] text-slate-400 font-sans font-normal">avg response</span>
          </div>
          <div className="w-full h-1.5 bg-[#07050E] rounded-full mt-2.5 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-500 to-indigo-400 rounded-full w-[24%]" />
          </div>
        </div>

        {/* Total Ingress Throughput */}
        <div className="p-4 rounded-2xl bg-[#0D091A]/85 border border-purple-500/30 relative overflow-hidden group hover:border-purple-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#C4B5FD] uppercase tracking-wider font-heading">TOTAL THROUGHPUT</span>
            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
              PEAK LOAD
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-1 font-mono flex items-baseline space-x-1.5">
            <span>{(latestPoint.throughputReq).toLocaleString()}</span>
            <span className="text-[10px] text-slate-400 font-sans font-normal">req/s</span>
          </div>
          <div className="w-full h-1.5 bg-[#07050E] rounded-full mt-2.5 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 rounded-full w-[78%]" />
          </div>
        </div>

        {/* Caspian Omni-Channel Signal */}
        <div className="p-4 rounded-2xl bg-[#0D091A]/85 border border-[#8B5CF6]/30 relative overflow-hidden group hover:border-[#8B5CF6]/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#C084FC] uppercase tracking-wider font-heading flex items-center space-x-1">
              <Radio className="h-3.5 w-3.5 text-[#C084FC] animate-pulse" />
              <span>CASPIAN REACHABILITY</span>
            </span>
            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              100%
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#C084FC] mt-1 font-mono">
            4 / 4 CHANNELS
          </div>
          <div className="text-[10px] text-slate-400 mt-1 flex items-center space-x-1.5">
            <span className="text-emerald-400">● Telegram</span>
            <span>● Email</span>
            <span>● Slack</span>
            <span>● WhatsApp</span>
          </div>
        </div>

      </div>

      {/* LIVE INTERACTIVE STREAMING TELEMETRY GRAPH */}
      <div className="p-5 rounded-2xl bg-[#0D091A]/90 border border-[#8B5CF6]/30 relative overflow-hidden space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Activity className="h-4 w-4 text-cyan-400 animate-pulse" />
            <h3 className="text-xs font-black uppercase tracking-wider text-white font-heading">
              REAL-TIME TELEMETRY STREAM (ROLLING 60s BUFFER)
            </h3>
          </div>

          {/* Metric Selector Tabs */}
          <div className="flex items-center space-x-1.5 text-[11px] font-mono">
            {[
              { id: "error", label: "Error Rate (%)" },
              { id: "latency", label: "P99 Latency (ms)" },
              { id: "throughput", label: "Throughput (req/s)" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveMetricTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  activeMetricTab === tab.id
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30"
                    : "bg-slate-900/80 text-slate-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Recharts Live Chart Canvas */}
        <div className="h-56 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {activeMetricTab === "error" ? (
              <AreaChart data={timeSeriesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorError" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" domain={[0, 0.1]} tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}%`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#07050e", borderColor: "#334155", borderRadius: "12px", fontSize: "11px" }}
                  formatter={(val: any) => [`${val}%`, "Global Error Rate"]}
                />
                <Area
                  type="monotone"
                  dataKey="errorRate"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fill="url(#colorError)"
                  isAnimationActive={false}
                />
              </AreaChart>
            ) : activeMetricTab === "latency" ? (
              <LineChart data={timeSeriesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" domain={[0, 60]} tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}ms`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#07050e", borderColor: "#334155", borderRadius: "12px", fontSize: "11px" }}
                />
                <Line type="monotone" dataKey="paymentLatency" name="Payment API" stroke="#06b6d4" strokeWidth={2} dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="authLatency" name="Hydra Auth" stroke="#a855f7" strokeWidth={2} dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="dbLatency" name="Postgres" stroke="#f59e0b" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            ) : (
              <AreaChart data={timeSeriesData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorThroughput" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#07050e", borderColor: "#334155", borderRadius: "12px", fontSize: "11px" }}
                  formatter={(val: any) => [`${Number(val).toLocaleString()} req/s`, "Ingress Traffic"]}
                />
                <Area
                  type="monotone"
                  dataKey="throughputReq"
                  stroke="#8b5cf6"
                  strokeWidth={2.5}
                  fill="url(#colorThroughput)"
                  isAnimationActive={false}
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* 14 CORE MONITORED MICROSERVICES GRID */}
      <div className="space-y-3 relative z-10">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-wider text-white font-heading flex items-center space-x-2">
            <Server className="h-4 w-4 text-purple-400" />
            <span>GLOBAL MICROSERVICES CLUSTER (14 SERVICES MONITORED)</span>
          </h3>
          <span className="text-[10px] font-mono text-slate-400">Click service to inspect telemetry or inject fault</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {services.map((svc) => {
            const isSelected = selectedService === svc.id;
            return (
              <div
                key={svc.id}
                onClick={() => setSelectedService(isSelected ? null : svc.id)}
                className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between relative group ${
                  isSelected
                    ? "bg-slate-900 border-cyan-400 shadow-xl shadow-cyan-500/20 scale-102"
                    : "bg-[#0D091A]/80 border-white/10 hover:border-purple-500/40 hover:bg-[#120D24]/90"
                }`}
              >
                <div>
                  {/* Top Status Pip */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-white/5 truncate max-w-[130px]">
                      {svc.region.split(" ")[0]}
                    </span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      <span>{svc.uptime}</span>
                    </span>
                  </div>

                  {/* Name & Desc */}
                  <h4 className="text-xs font-bold text-white font-heading group-hover:text-purple-300 transition-colors">
                    {svc.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                    {svc.description}
                  </p>
                </div>

                {/* Metrics Row */}
                <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] font-mono">
                  <div>
                    <span className="text-[9px] text-slate-500 block">ERROR</span>
                    <span className="font-bold text-emerald-400">{svc.errorRate}%</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 block">LATENCY</span>
                    <span className="font-bold text-cyan-300">{svc.latencyMs}ms</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 block">LOAD</span>
                    <span className="font-bold text-slate-300">{svc.throughput}</span>
                  </div>
                </div>

                {/* Quick Inject Fault Button on Hover/Select */}
                {isSelected && (
                  <div className="mt-3 pt-2.5 border-t border-cyan-500/30 flex items-center justify-between gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerChaosOutage(svc.name, "P0");
                      }}
                      className="w-full py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold shadow-md transition-all flex items-center justify-center space-x-1"
                    >
                      <Flame className="h-3 w-3" />
                      <span>Inject Fault Anomaly</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 6 GLOBAL REGIONAL CLUSTERS HEALTH */}
      <div className="p-5 rounded-2xl bg-[#0D091A]/90 border border-white/10 relative overflow-hidden space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-300 font-heading flex items-center space-x-2">
            <Globe className="h-3.5 w-3.5 text-cyan-400" />
            <span>GLOBAL MULTI-REGION TOPOLOGY STATUS</span>
          </span>
          <span className="text-[10px] font-mono text-emerald-400">All 6 Regions Nominal</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs font-mono">
          {[
            { region: "India-East", code: "ap-south-1", lat: "12ms", nodes: 18 },
            { region: "US-East", code: "us-east-1", lat: "18ms", nodes: 32 },
            { region: "EU-Central", code: "eu-central-1", lat: "24ms", nodes: 16 },
            { region: "Asia-Pacific", code: "ap-southeast-1", lat: "15ms", nodes: 14 },
            { region: "US-West", code: "us-west-2", lat: "22ms", nodes: 20 },
            { region: "SA-East", code: "sa-east-1", lat: "48ms", nodes: 8 }
          ].map((r) => (
            <div key={r.code} className="p-2.5 rounded-xl bg-slate-950/80 border border-white/5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-[11px]">{r.region}</span>
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
              </div>
              <div className="text-[10px] text-slate-400 flex items-center justify-between">
                <span>{r.code}</span>
                <span className="text-cyan-300 font-bold">{r.lat}</span>
              </div>
              <div className="text-[9px] text-slate-500">{r.nodes} Edge Nodes</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
