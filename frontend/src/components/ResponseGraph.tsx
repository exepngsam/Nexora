import React, { useState } from "react";
import { Shield, Send, Mail, MessageSquare, PhoneCall, CheckCircle2, AlertTriangle, ArrowRight, UserCheck, Flame, Radio, Zap, Info, Clock, Activity } from "lucide-react";
import { Incident } from "../types";

interface ResponseGraphProps {
  incident: Incident | null;
  activeChannelSignal: string | null;
}

export const ResponseGraph: React.FC<ResponseGraphProps> = ({ incident, activeChannelSignal }) => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const isResolved = incident?.status === "RESOLVED";
  const isEscalated = (incident?.escalation_level || 1) > 1;
  const isAcked = !!incident?.acknowledged_at;

  const getNodeInfo = (node: string) => {
    switch (node) {
      case "core":
        return {
          title: "NEXORA Unified Agent Core",
          type: "AI Orchestrator",
          status: "Autonomous (Online)",
          detail: "Orchestrates multi-channel reachability using Featherless open-source LLM inference. Evaluates 4 candidate channels simultaneously."
        };
      case "telegram":
        return {
          title: "Telegram Bot Gateway",
          type: "Primary Dispatch",
          status: isEscalated ? "ACK Timeout Expired (10s)" : incident ? "Live Packet Dispatched" : "Standby",
          detail: "Direct mobile push channel to Alex Vance (@alexvance). Automatic fallback triggered if ACK not registered within 10s."
        };
      case "email":
        return {
          title: "Caspian High-Priority Email",
          type: "Escalation Tier 2",
          status: isEscalated ? "Escalation Active (Delivered)" : "Standby",
          detail: "Interactive email with 1-click ACK token sent to Priya Sharma (priya@nexora.internal)."
        };
      case "slack":
        return {
          title: "Slack Incident War Room #war-room-p0",
          type: "Team Coordination",
          status: "Sync Active",
          detail: "Thread created with incident brief, real-time Caspian event logs, and human-in-the-loop controls."
        };
      case "alex":
        return {
          title: "Alex Vance (Payments Lead)",
          type: "Primary Responder",
          status: isEscalated ? "No Response (Auto-Escalated)" : "Primary Target",
          detail: "Historical MTTA: 3.2m • Owns Payment Checkout API • Timezone: IST"
        };
      case "priya":
        return {
          title: "Priya Sharma (Senior Platform SRE)",
          type: "Escalated Responder",
          status: isAcked ? "Acknowledged & Acting" : isEscalated ? "Awaiting ACK" : "Standby",
          detail: "Historical MTTA: 42s • Authorized for emergency production rollbacks"
        };
      case "rahul":
        return {
          title: "Rahul Nair (Database Architect)",
          type: "Domain Specialist",
          status: isAcked ? "Coordinated in Slack" : "Standby",
          detail: "Connection pool isolation & replica failover specialist"
        };
      default:
        return {
          title: "Topology Node",
          type: "Generic Node",
          status: "Nominal",
          detail: "Select a node to inspect payload and telemetry."
        };
    }
  };

  const activeNodeData = selectedNode ? getNodeInfo(selectedNode) : null;

  return (
    <div className="rounded-3xl glass-panel p-6 relative overflow-hidden transition-all">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#8B5CF6]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between pb-4 border-b border-[#8B5CF6]/20 mb-6 gap-3 relative z-10">
        <div>
          <h3 className="text-sm font-black tracking-wider text-white uppercase flex items-center space-x-2 font-heading">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A855F7] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#8B5CF6]"></span>
            </span>
            <span>NEXORA RESPONSE TOPOLOGY & PACKET FLOW</span>
          </h3>
          <p className="text-xs text-[#C4B5FD] mt-0.5">
            Caspian multi-channel autonomous dispatch pipeline with real-time signal tracking & route validation
          </p>
        </div>

        <div className="flex items-center space-x-3 text-[11px] font-mono">
          <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-[#0D091A]/80 border border-[#8B5CF6]/30 text-[#C084FC]">
            <span className="h-2 w-2 rounded-full bg-[#A855F7] animate-pulse"></span>
            <span>Dispatched</span>
          </span>
          <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-[#0D091A]/80 border border-rose-500/20 text-rose-300">
            <span className="h-2 w-2 rounded-full bg-rose-400"></span>
            <span>Timeout</span>
          </span>
          <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-[#0D091A]/80 border border-[#38BDF8]/20 text-[#38BDF8]">
            <span className="h-2 w-2 rounded-full bg-[#38BDF8]"></span>
            <span>Acknowledged</span>
          </span>
        </div>
      </div>

      {/* Visual Canvas */}
      <div className="relative py-4 flex flex-col items-center">
        
        {/* LEVEL 1: Premium Central Agent Core Hub */}
        <div 
          onClick={() => setSelectedNode("core")}
          className="relative z-10 flex flex-col items-center cursor-pointer group"
        >
          {/* Outer Ambient Glow Aura */}
          <div className="absolute -inset-4 bg-gradient-to-r from-[#8B5CF6]/30 via-[#A855F7]/40 to-[#6366F1]/30 rounded-3xl blur-2xl opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none" />

          {/* Premium Core Hub Hex Shield */}
          <div className="relative flex items-center justify-center h-20 w-20 rounded-2xl bg-gradient-to-br from-[#1E143E] via-[#0D091A] to-[#07050E] border-2 border-[#A855F7]/60 shadow-2xl shadow-[#8B5CF6]/40 group-hover:scale-105 group-hover:border-[#C084FC] transition-all duration-300">
            
            {/* Concentric Signal Rings */}
            <div className="absolute inset-0 rounded-2xl border border-[#8B5CF6]/30 animate-ping opacity-20 pointer-events-none" />
            <div className="absolute inset-1.5 rounded-xl border border-[#8B5CF6]/20" />
            
            {/* Central Core Holographic Emblem */}
            <div className="relative flex flex-col items-center justify-center">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#8B5CF6] via-[#A855F7] to-[#6366F1] flex items-center justify-center shadow-lg shadow-[#8B5CF6]/50">
                <Shield className="h-5 w-5 text-white" />
              </div>
            </div>

            {/* Live Status Pip */}
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#06D6A0] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#06D6A0] border-2 border-[#0D091A]"></span>
            </span>
          </div>

          {/* Node Identity Pill */}
          <div className="text-[11px] font-bold text-white mt-2.5 bg-[#0D091A]/95 px-3.5 py-1 rounded-full border border-[#8B5CF6]/40 flex items-center space-x-2 shadow-xl group-hover:border-[#A855F7] transition-colors font-heading">
            <Zap className="h-3.5 w-3.5 text-[#C084FC]" />
            <span>CASPIAN AGENT RUNTIME v1.0</span>
            <span className="text-[#C4B5FD]/40">•</span>
            <span className="text-[10px] font-mono text-[#06D6A0]">ONLINE</span>
          </div>
        </div>

        {/* SVG Laser Cables (Core -> Channels) */}
        <div className="w-full max-w-2xl my-2 flex justify-center">
          <svg className="w-full h-16 overflow-visible" viewBox="0 0 600 60">
            <defs>
              <linearGradient id="grad-purple" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#A855F7" />
                <stop offset="100%" stopColor="#6366F1" />
              </linearGradient>
              <linearGradient id="grad-emerald" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#6366F1" />
              </linearGradient>
              <linearGradient id="grad-rose" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="#e11d48" />
              </linearGradient>
            </defs>

            {/* Cable Left (Telegram) */}
            <path
              d="M 300 0 C 300 30, 100 30, 100 60"
              fill="none"
              stroke={isEscalated ? "#f43f5e" : (incident ? "#06b6d4" : "rgba(255,255,255,0.12)")}
              strokeWidth={incident ? "2.5" : "1.5"}
              strokeDasharray={isEscalated ? "4,4" : "none"}
              className={`transition-all duration-500 ${incident && !isEscalated ? "laser-pulse" : ""}`}
            />
            
            {/* Cable Middle (Email) */}
            <path
              d="M 300 0 L 300 60"
              fill="none"
              stroke={isEscalated ? "#10b981" : "rgba(255,255,255,0.12)"}
              strokeWidth={isEscalated ? "3" : "1.5"}
              className={`transition-all duration-500 ${isEscalated ? "laser-pulse" : ""}`}
            />

            {/* Cable Right (Slack) */}
            <path
              d="M 300 0 C 300 30, 500 30, 500 60"
              fill="none"
              stroke={isAcked ? "#a855f7" : "rgba(255,255,255,0.12)"}
              strokeWidth={isAcked ? "2.5" : "1.5"}
              className={`transition-all duration-500 ${isAcked ? "laser-pulse" : ""}`}
            />
          </svg>
        </div>

        {/* LEVEL 2: Caspian Communication Channels */}
        <div className="grid grid-cols-3 gap-4 sm:gap-8 w-full max-w-2xl relative z-10">
          
          {/* Channel: Telegram (Primary) */}
          <div 
            onClick={() => setSelectedNode("telegram")}
            className={`p-4 rounded-2xl glass-panel text-center flex flex-col items-center border transition-all duration-300 cursor-pointer hover:scale-105 ${
              isEscalated
                ? "border-rose-500/50 bg-rose-950/30"
                : activeChannelSignal === "telegram"
                ? "border-cyan-400 shadow-xl shadow-cyan-500/25 glow-signal"
                : "border-white/10 hover:border-cyan-500/40"
            }`}
          >
            <div className={`p-3 rounded-xl mb-2 ${
              isEscalated ? "bg-rose-500/20 text-rose-400" : "bg-cyan-500/15 text-cyan-400"
            }`}>
              <Send className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold text-white font-heading">Telegram Bot</span>
            <span className={`text-[10px] font-bold mt-1.5 px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
              isEscalated
                ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                : incident
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 animate-pulse"
                : "bg-slate-800 text-slate-400"
            }`}>
              {isEscalated ? "TIMEOUT (10s)" : incident ? "PRIMARY DISPATCH" : "STANDBY"}
            </span>
          </div>

          {/* Channel: Email (Backup / Escalation) */}
          <div 
            onClick={() => setSelectedNode("email")}
            className={`p-4 rounded-2xl glass-panel text-center flex flex-col items-center border transition-all duration-300 cursor-pointer hover:scale-105 ${
              isEscalated
                ? "border-emerald-500/60 bg-emerald-950/30 shadow-xl shadow-emerald-500/25 glow-signal"
                : "border-white/10 hover:border-indigo-500/40"
            }`}
          >
            <div className={`p-3 rounded-xl mb-2 ${
              isEscalated ? "bg-emerald-500/20 text-emerald-400" : "bg-indigo-500/15 text-indigo-400"
            }`}>
              <Mail className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold text-white font-heading">Caspian Email</span>
            <span className={`text-[10px] font-bold mt-1.5 px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
              isEscalated
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse"
                : "bg-slate-800 text-slate-400"
            }`}>
              {isEscalated ? "ESCALATED (Priya)" : "BACKUP TIER"}
            </span>
          </div>

          {/* Channel: Slack (Coordination) */}
          <div 
            onClick={() => setSelectedNode("slack")}
            className={`p-4 rounded-2xl glass-panel text-center flex flex-col items-center border transition-all duration-300 cursor-pointer hover:scale-105 ${
              isAcked 
                ? "border-purple-500/50 bg-purple-950/30 shadow-xl shadow-purple-500/20" 
                : "border-white/10 hover:border-purple-500/40"
            }`}
          >
            <div className="p-3 rounded-xl mb-2 bg-purple-500/15 text-purple-400">
              <MessageSquare className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold text-white font-heading">Slack War Room</span>
            <span className={`text-[10px] font-bold mt-1.5 px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
              isAcked ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" : "bg-slate-800 text-slate-400"
            }`}>
              {isAcked ? "DB TEAM SYNCED" : "CROSS-TEAM"}
            </span>
          </div>

        </div>

        {/* SVG Cables to Responders */}
        <div className="w-full max-w-2xl my-2 flex justify-center">
          <svg className="w-full h-12 overflow-visible" viewBox="0 0 600 40">
            <line 
              x1="100" y1="0" x2="100" y2="40" 
              stroke={isEscalated ? "#f43f5e" : "#06b6d4"} 
              strokeWidth="2" 
              strokeDasharray={isEscalated ? "3,3" : "none"} 
            />
            <line 
              x1="300" y1="0" x2="300" y2="40" 
              stroke={isEscalated ? "#10b981" : "rgba(255,255,255,0.12)"} 
              strokeWidth="2" 
              className={isEscalated ? "laser-pulse" : ""}
            />
            <line 
              x1="500" y1="0" x2="500" y2="40" 
              stroke={isAcked ? "#a855f7" : "rgba(255,255,255,0.12)"} 
              strokeWidth="2" 
            />
          </svg>
        </div>

        {/* LEVEL 3: Human Responders */}
        <div className="grid grid-cols-3 gap-4 sm:gap-8 w-full max-w-2xl relative z-10">
          
          {/* Alex Vance */}
          <div 
            onClick={() => setSelectedNode("alex")}
            className={`p-4 rounded-2xl bg-slate-950/80 border text-center transition-all duration-300 cursor-pointer hover:scale-105 ${
              isEscalated ? "border-rose-500/40 opacity-70" : "border-cyan-500/40"
            }`}
          >
            <div className="text-xs font-bold text-white font-heading">Alex Vance</div>
            <div className="text-[10px] text-slate-400">Payments Lead</div>
            <div className={`mt-2 text-[10px] font-bold ${
              isEscalated ? "text-rose-400" : "text-cyan-400"
            }`}>
              {isEscalated ? "No Response (10s)" : "Primary Target"}
            </div>
          </div>

          {/* Priya Sharma */}
          <div 
            onClick={() => setSelectedNode("priya")}
            className={`p-4 rounded-2xl bg-slate-950/80 border text-center transition-all duration-300 cursor-pointer hover:scale-105 ${
              isEscalated ? "border-emerald-500/60 shadow-lg shadow-emerald-500/15" : "border-white/10"
            }`}
          >
            <div className="text-xs font-bold text-white font-heading">Priya Sharma</div>
            <div className="text-[10px] text-slate-400">Senior Platform SRE</div>
            <div className={`mt-2 text-[10px] font-bold ${
              isAcked ? "text-emerald-400 flex items-center justify-center space-x-1" : isEscalated ? "text-amber-300" : "text-slate-500"
            }`}>
              {isAcked ? "✓ Acknowledged & Acting" : isEscalated ? "Notified via Email" : "On Standby"}
            </div>
          </div>

          {/* Rahul Nair */}
          <div 
            onClick={() => setSelectedNode("rahul")}
            className={`p-4 rounded-2xl bg-slate-950/80 border text-center transition-all duration-300 cursor-pointer hover:scale-105 ${
              isAcked ? "border-purple-500/50 shadow-md shadow-purple-500/10" : "border-white/10"
            }`}
          >
            <div className="text-xs font-bold text-white font-heading">Rahul Nair</div>
            <div className="text-[10px] text-slate-400">Database Architect</div>
            <div className="mt-2 text-[10px] font-bold text-purple-400">
              {isAcked ? "Coordinated in Slack" : "On Standby"}
            </div>
          </div>

        </div>

        {/* Selected Node Inspector Drawer / Tooltip */}
        {activeNodeData && (
          <div className="mt-6 w-full max-w-2xl p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-cyan-500/40 shadow-xl flex items-start justify-between animate-fadeIn">
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 mt-0.5">
                <Info className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-white font-heading">{activeNodeData.title}</span>
                  <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-slate-800 text-slate-300">
                    {activeNodeData.type}
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 mt-1">
                  {activeNodeData.detail}
                </div>
                <div className="text-[10px] font-bold text-cyan-400 mt-1.5 flex items-center space-x-1">
                  <Activity className="h-3 w-3" />
                  <span>State: {activeNodeData.status}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 hover:bg-slate-700"
            >
              ✕
            </button>
          </div>
        )}

        {/* LEVEL 4: Coordinated Resolution Bar */}
        <div className="mt-6 w-full max-w-2xl p-4 rounded-2xl bg-slate-950/90 border border-white/10 flex items-center justify-between shadow-lg">
          <div className="flex items-center space-x-3">
            <div className={`p-2.5 rounded-xl ${isResolved ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"}`}>
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white font-heading">
                {isResolved ? "Incident Successfully Resolved" : "Active Autonomous Coordination"}
              </div>
              <div className="text-[11px] text-slate-400">
                {isResolved
                  ? "All systems operational (0.4% error rate). AI postmortem generated."
                  : isAcked
                  ? "Priya managing rollback. Database pool remediation in progress."
                  : isEscalated
                  ? "Auto-escalated to Email. Waiting for Priya acknowledgement."
                  : "NEXORA monitoring Telegram ack window."}
              </div>
            </div>
          </div>

          <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider font-heading ${
            isResolved ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse"
          }`}>
            {isResolved ? "COMPLETED" : "IN PROGRESS"}
          </span>
        </div>

      </div>
    </div>
  );
};

