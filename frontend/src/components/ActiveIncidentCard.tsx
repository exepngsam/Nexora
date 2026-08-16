import React from "react";
import { 
  Flame, 
  Clock, 
  UserCheck, 
  Activity, 
  ShieldAlert, 
  CheckCircle2, 
  FileText, 
  Radio, 
  Zap, 
  AlertTriangle,
  Sparkles
} from "lucide-react";
import { Incident } from "../types";
import { SystemLiveTelemetryMonitor } from "./SystemLiveTelemetryMonitor";

interface ActiveIncidentCardProps {
  incident: Incident | null;
  remainingCountdown: number;
  onSimulateAck: () => void;
  onOpenApproval: () => void;
  onResolve: () => void;
  onViewPostmortem: () => void;
  hasPendingApproval: boolean;
  onTriggerSimulation?: (params: {
    service: string;
    region: string;
    error_rate: number;
    latency: number;
    affected_users: number;
    title: string;
  }) => void;
}

export const ActiveIncidentCard: React.FC<ActiveIncidentCardProps> = ({
  incident,
  remainingCountdown,
  onSimulateAck,
  onOpenApproval,
  onResolve,
  onViewPostmortem,
  hasPendingApproval,
  onTriggerSimulation,
}) => {
  if (!incident) {
    return <SystemLiveTelemetryMonitor onTriggerSimulation={onTriggerSimulation} />;
  }

  const isResolved = incident.status === "RESOLVED";
  const isEscalating = incident.status === "ESCALATING";
  const isResponding = incident.status === "RESPONDING";

  // Calculate circular progress for countdown
  const strokeDashoffset = 100 - (remainingCountdown / 10) * 100;

  return (
    <div className={`rounded-3xl p-6 sm:p-7 relative overflow-hidden transition-all duration-500 ${
      !isResolved 
        ? "bg-gradient-to-b from-[#1C123E]/50 via-[#0D091A]/95 to-[#07050E]/98 border border-[#8B5CF6]/40 shadow-2xl shadow-[#8B5CF6]/15 glow-critical" 
        : "bg-gradient-to-b from-[#1C123E]/30 via-[#0D091A]/95 to-[#07050E]/98 border border-[#8B5CF6]/30 shadow-2xl"
    }`}>
      {/* Background ambient lighting */}
      <div className={`absolute -top-10 -right-10 w-96 h-96 rounded-full blur-3xl pointer-events-none ${
        !isResolved ? "bg-rose-500/15" : "bg-[#8B5CF6]/20"
      }`} />

      {/* Top Banner Tag */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#8B5CF6]/20 relative z-10">
        <div className="flex items-center space-x-3">
          <span className={`px-3.5 py-1.5 rounded-xl text-xs font-black tracking-wider uppercase flex items-center space-x-2 font-heading ${
            isResolved 
              ? "bg-[#8B5CF6]/20 text-[#C084FC] border border-[#8B5CF6]/40 shadow-sm"
              : "bg-gradient-to-r from-rose-600/30 via-fuchsia-600/25 to-rose-600/30 text-rose-300 border border-rose-500/50 shadow-md shadow-rose-500/20"
          }`}>
            <Flame className={`h-4 w-4 ${!isResolved ? "animate-bounce text-rose-400" : "text-[#C084FC]"}`} />
            <span>{incident.severity} CRITICAL OUTAGE</span>
          </span>
          
          <span className="text-xs font-mono font-bold text-white bg-[#0D091A]/90 px-3 py-1.5 rounded-xl border border-[#8B5CF6]/25">
            {incident.id}
          </span>
          
          <span className="text-xs font-semibold text-slate-200">
            {incident.service} <span className="text-[#C4B5FD]/70">({incident.region})</span>
          </span>
        </div>

        {/* Live Status Pill & Circular SLA Countdown */}
        <div className="flex items-center space-x-3">
          {remainingCountdown > 0 && !incident.acknowledged_at && (
            <div className="flex items-center space-x-2 rounded-xl bg-amber-500/15 px-3 py-1.5 border border-amber-500/40 text-amber-300 text-xs font-bold font-mono shadow-sm">
              {/* Circular Mini Progress */}
              <div className="relative w-5 h-5 flex items-center justify-center shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="rgba(245, 158, 11, 0.2)"
                    strokeWidth="4"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="4"
                    strokeDasharray="100"
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-1000 linear"
                  />
                </svg>
              </div>
              <span>SLA: 00:{remainingCountdown < 10 ? `0${remainingCountdown}` : remainingCountdown}s</span>
            </div>
          )}

          <div className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider font-heading flex items-center space-x-1.5 ${
            isResolved
              ? "bg-[#8B5CF6]/20 text-[#C084FC] border border-[#8B5CF6]/40"
              : isEscalating
              ? "bg-rose-600/30 text-rose-200 border border-rose-500/60 animate-pulse"
              : isResponding
              ? "bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/40"
              : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
          }`}>
            <span className={`h-2 w-2 rounded-full ${
              isResolved ? "bg-[#C084FC]" : isEscalating ? "bg-rose-400 animate-ping" : "bg-[#A855F7] animate-pulse"
            }`} />
            <span>STATUS: {incident.status}</span>
          </div>
        </div>
      </div>

      {/* Hero Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6 relative z-10">
        
        {/* Error Rate */}
        <div className="p-4 rounded-2xl bg-[#0D091A]/80 border border-rose-500/25 relative overflow-hidden group hover:border-rose-500/40 transition-all">
          <span className="text-[10px] font-bold text-[#C4B5FD] uppercase tracking-wider font-heading">ERROR RATE</span>
          <div className="text-3xl font-black text-rose-400 mt-1 font-mono flex items-baseline space-x-1.5">
            <span>{incident.error_rate}%</span>
            {incident.error_rate > 5 && (
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                CRITICAL
              </span>
            )}
          </div>
          {/* Visual Mini Progress */}
          <div className="w-full h-1.5 bg-[#07050E] rounded-full mt-2.5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, incident.error_rate * 2)}%` }}
            />
          </div>
        </div>

        {/* Latency */}
        <div className="p-4 rounded-2xl bg-[#0D091A]/80 border border-amber-500/25 relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <span className="text-[10px] font-bold text-[#C4B5FD] uppercase tracking-wider font-heading">P99 LATENCY</span>
          <div className="text-3xl font-black text-amber-400 mt-1 font-mono">
            {incident.latency}s
          </div>
          <div className="w-full h-1.5 bg-[#07050E] rounded-full mt-2.5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, incident.latency * 10)}%` }}
            />
          </div>
        </div>

        {/* Affected Users */}
        <div className="p-4 rounded-2xl bg-[#0D091A]/80 border border-[#8B5CF6]/25 relative overflow-hidden group hover:border-[#A855F7]/40 transition-all">
          <span className="text-[10px] font-bold text-[#C4B5FD] uppercase tracking-wider font-heading">AFFECTED SESSIONS</span>
          <div className="text-3xl font-black text-white mt-1 font-mono">
            {incident.affected_users.toLocaleString()}
          </div>
          <div className="w-full h-1.5 bg-[#07050E] rounded-full mt-2.5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#A855F7] via-[#8B5CF6] to-[#6366F1] rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (incident.affected_users / 25000) * 100)}%` }}
            />
          </div>
        </div>

        {/* Active Owner */}
        <div className="p-4 rounded-2xl bg-[#0D091A]/80 border border-[#8B5CF6]/35 relative overflow-hidden group hover:shadow-lg hover:shadow-[#8B5CF6]/20 transition-all">
          <span className="text-[10px] font-bold text-[#C084FC] uppercase tracking-wider font-heading flex items-center space-x-1">
            <UserCheck className="h-3.5 w-3.5 text-[#C084FC]" />
            <span>INCIDENT OWNER</span>
          </span>
          <div className="text-lg font-bold text-white mt-1.5 flex items-center space-x-2 truncate">
            <span className="truncate">{incident.owner || "Unassigned"}</span>
            {incident.escalation_level > 1 && (
              <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-[#8B5CF6]/25 text-[#C084FC] border border-[#8B5CF6]/40 shrink-0">
                L{incident.escalation_level}
              </span>
            )}
          </div>
          <div className="text-[10px] text-[#C4B5FD] mt-1 flex items-center space-x-1">
            <Radio className="h-3 w-3 text-[#A855F7]" />
            <span>Active via Caspian</span>
          </div>
        </div>

      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#8B5CF6]/20 relative z-10">
        <div className="flex items-center space-x-2 text-xs text-slate-300 font-medium">
          <span>Escalation Level: <strong className="text-white font-mono">Level {incident.escalation_level}</strong></span>
          <span>•</span>
          <span>Ack Status: <strong className={incident.acknowledged_at ? "text-[#C084FC]" : "text-amber-400"}>
            {incident.acknowledged_at ? "✓ Received (Priya Sharma)" : "⏳ Awaiting Primary ACK"}
          </strong></span>
        </div>

        <div className="flex items-center space-x-3">
          
          {/* Simulate ACK (if not yet acknowledged) */}
          {!incident.acknowledged_at && (
            <button
              onClick={onSimulateAck}
              className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-[#8B5CF6]/30 via-[#6366F1]/30 to-[#8B5CF6]/30 px-4 py-2.5 text-xs font-bold text-white border border-[#A855F7]/50 hover:bg-[#8B5CF6]/40 hover:shadow-lg hover:shadow-[#8B5CF6]/25 active:scale-95 transition-all cursor-pointer font-heading"
            >
              <Zap className="h-4 w-4 text-[#C084FC] animate-pulse" />
              <span>Simulate Human ACK</span>
            </button>
          )}

          {/* Pending Approval Trigger */}
          {hasPendingApproval && !isResolved && (
            <button
              onClick={onOpenApproval}
              className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-amber-500/30 to-orange-500/30 px-4 py-2.5 text-xs font-bold text-amber-300 border border-amber-500/50 hover:bg-amber-500/40 animate-pulse hover:shadow-lg hover:shadow-amber-500/20 active:scale-95 transition-all cursor-pointer font-heading"
            >
              <ShieldAlert className="h-4 w-4 text-amber-400" />
              <span>Review Rollback Approval</span>
            </button>
          )}

          {/* Resolve Incident */}
          {!isResolved && (
            <button
              onClick={onResolve}
              className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-[#8B5CF6]/30 to-[#6366F1]/70 px-4 py-2.5 text-xs font-bold text-[#C084FC] border border-[#A855F7]/50 hover:bg-[#8B5CF6]/40 hover:shadow-lg hover:shadow-[#8B5CF6]/25 active:scale-95 transition-all cursor-pointer font-heading"
            >
              <CheckCircle2 className="h-4 w-4 text-[#C084FC]" />
              <span>Confirm Resolution</span>
            </button>
          )}

          {/* Postmortem View */}
          {isResolved && (
            <button
              onClick={onViewPostmortem}
              className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-[#8B5CF6]/25 to-[#6366F1]/50 px-4 py-2.5 text-xs font-bold text-white border border-[#A855F7]/40 hover:bg-[#8B5CF6]/35 hover:shadow-lg hover:shadow-[#8B5CF6]/25 active:scale-95 transition-all cursor-pointer font-heading"
            >
              <FileText className="h-4 w-4 text-[#C084FC]" />
              <span>View AI Postmortem</span>
            </button>
          )}

        </div>
      </div>
    </div>
  );
};
