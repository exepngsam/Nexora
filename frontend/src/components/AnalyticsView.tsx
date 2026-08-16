import React from "react";
import { BarChart3, TrendingUp, Clock, CheckCircle2, Radio, Users, Shield, Zap, Sparkles, Activity } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from "recharts";
import { AnalyticsData } from "../types";

interface AnalyticsViewProps {
  analytics: AnalyticsData | null;
}

const SEVERITY_COLORS = ["#f43f5e", "#f59e0b", "#06b6d4", "#10b981"];

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ analytics }) => {
  const channelData = analytics?.channel_stats || [
    { channel: "Telegram", response_rate: 94, success_rate: 99.2 },
    { channel: "Email", response_rate: 98, success_rate: 99.9 },
    { channel: "Slack", response_rate: 91, success_rate: 98.8 },
    { channel: "WhatsApp", response_rate: 88, success_rate: 98.5 },
  ];

  const severityData = [
    { name: "P0 Critical", value: analytics?.severity_breakdown?.["P0"] || 3 },
    { name: "P1 Major", value: analytics?.severity_breakdown?.["P1"] || 2 },
    { name: "P2 Moderate", value: analytics?.severity_breakdown?.["P2"] || 1 },
    { name: "P3 Low", value: analytics?.severity_breakdown?.["P3"] || 0 },
  ];

  const ackTrendData = [
    { time: "09:00", manual_mtta: 180, nexora_mtta: 24 },
    { time: "11:00", manual_mtta: 240, nexora_mtta: 21 },
    { time: "13:00", manual_mtta: 210, nexora_mtta: 18 },
    { time: "15:00", manual_mtta: 300, nexora_mtta: 22 },
    { time: "17:00", manual_mtta: 260, nexora_mtta: 20 },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl glass-panel flex flex-wrap items-center justify-between gap-4 relative overflow-hidden">
        <div className="flex items-center space-x-3.5 relative z-10">
          <div className="p-3 rounded-2xl bg-cyan-500/15 border border-cyan-500/40 text-cyan-400 glow-signal">
            <BarChart3 className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white font-heading">
              SRE INCIDENT & COORDINATION TELEMETRY
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live MTTA/MTTR reduction metrics and Caspian omni-channel delivery success benchmarks.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 relative z-10">
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-emerald-500/30 text-center">
            <span className="text-[9px] font-bold text-slate-400 uppercase font-heading block">AI ESCALATION RATE</span>
            <div className="text-xl font-black text-emerald-400 font-mono mt-0.5">96.4% Auto</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-cyan-500/30 text-center">
            <span className="text-[9px] font-bold text-slate-400 uppercase font-heading block">AVG TIME TO RECOVER</span>
            <div className="text-xl font-black text-cyan-400 font-mono mt-0.5">8.2 min</div>
          </div>
        </div>
      </div>

      {/* Grid of Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: MTTA Benchmark: Traditional Pager vs NEXORA */}
        <div className="p-6 rounded-3xl glass-panel relative overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
            <div>
              <h3 className="text-xs font-black text-white uppercase tracking-wider font-heading">
                MEAN TIME TO ACKNOWLEDGE (MTTA) COMPARISON
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5 font-mono">Seconds taken to achieve human responder engagement</p>
            </div>
            <span className="text-[10px] font-black px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-heading">
              -91% FASTER
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ackTrendData}>
                <defs>
                  <linearGradient id="colorNexora" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} fontStyle="monospace" />
                <YAxis stroke="#64748b" fontSize={11} unit="s" fontStyle="monospace" />
                <Tooltip contentStyle={{ backgroundColor: "#060913", borderColor: "#334155", borderRadius: "12px", fontSize: "12px" }} />
                <Area type="monotone" dataKey="manual_mtta" stroke="#f43f5e" strokeWidth={2} fill="transparent" name="Legacy Paging (s)" />
                <Area type="monotone" dataKey="nexora_mtta" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorNexora)" name="NEXORA Multi-Channel (s)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Channel Response Rates */}
        <div className="p-6 rounded-3xl glass-panel relative overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
            <div>
              <h3 className="text-xs font-black text-white uppercase tracking-wider font-heading">
                CASPIAN CHANNEL RESPONSE RATES (%)
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5 font-mono">Response probability across connected unified channels</p>
            </div>
            <span className="text-[10px] font-black px-2.5 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-heading">
              CASPIAN REACH
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={channelData}>
                <XAxis dataKey="channel" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={[70, 100]} unit="%" />
                <Tooltip contentStyle={{ backgroundColor: "#060913", borderColor: "#334155", borderRadius: "12px", fontSize: "12px" }} />
                <Bar dataKey="response_rate" fill="#6366f1" radius={[8, 8, 0, 0]} name="Response Rate %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Severity Breakdown Bar */}
      <div className="p-6 rounded-3xl glass-panel">
        <h3 className="text-xs font-black text-white uppercase tracking-wider font-heading mb-4">
          INCIDENTS RESOLVED BY SEVERITY (LAST 30 DAYS)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {severityData.map((s, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-950/70 border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase font-heading">{s.name}</span>
                <div className="text-2xl font-black text-white font-mono mt-1">{s.value} Incidents</div>
              </div>
              <div 
                className="w-3.5 h-3.5 rounded-full" 
                style={{ backgroundColor: SEVERITY_COLORS[idx % SEVERITY_COLORS.length] }} 
              />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

