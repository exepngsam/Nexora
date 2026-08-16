import React from "react";
import { Flame, Clock, Cpu, UserCheck, ShieldAlert, CheckCircle2, AlertTriangle, FileText, Zap } from "lucide-react";
import { Incident, IncidentEvent } from "../types";
import { IncidentTimeline } from "./IncidentTimeline";
import { AIDecisionPanel } from "./AIDecisionPanel";

interface LiveIncidentsViewProps {
  incident: Incident | null;
  events: IncidentEvent[];
  onSimulateAck: () => void;
  onOpenApproval: () => void;
  onResolve: () => void;
  onViewPostmortem: () => void;
  hasPendingApproval: boolean;
}

export const LiveIncidentsView: React.FC<LiveIncidentsViewProps> = ({
  incident,
  events,
  onSimulateAck,
  onOpenApproval,
  onResolve,
  onViewPostmortem,
  hasPendingApproval
}) => {
  if (!incident) {
    return (
      <div className="p-12 rounded-2xl glass-panel text-center text-slate-500 text-xs">
        No active incident. Click "SIMULATE INCIDENT" in the top navigation to trigger a P0 outage.
      </div>
    );
  }

  const isResolved = incident.status === "RESOLVED";

  return (
    <div className="space-y-6">
      
      {/* 3-Column Incident Commander Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Incident Context (Col 4) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl glass-panel border border-rose-500/30 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center space-x-1">
                <Flame className="h-3.5 w-3.5" />
                <span>{incident.severity} CRITICAL</span>
              </span>
              <span className="text-xs font-mono font-bold text-slate-400">{incident.id}</span>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">{incident.title}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{incident.service} ({incident.region})</p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/5 flex justify-between">
                <span className="text-slate-400">Error Rate:</span>
                <span className="font-bold text-rose-400">{incident.error_rate}%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/5 flex justify-between">
                <span className="text-slate-400">P99 Latency:</span>
                <span className="font-bold text-amber-400">{incident.latency}s</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/5 flex justify-between">
                <span className="text-slate-400">Affected Users:</span>
                <span className="font-bold text-purple-300">{incident.affected_users.toLocaleString()}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/5 flex justify-between">
                <span className="text-slate-400">Assigned Owner:</span>
                <span className="font-bold text-cyan-300">{incident.owner || "Unassigned"}</span>
              </div>
            </div>

            {/* Quick Action Triggers */}
            <div className="pt-3 border-t border-white/10 space-y-2">
              {!incident.acknowledged_at && (
                <button
                  onClick={onSimulateAck}
                  className="w-full py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold text-xs border border-cyan-500/40 transition-colors cursor-pointer"
                >
                  ⚡ Simulate Human ACK
                </button>
              )}

              {hasPendingApproval && !isResolved && (
                <button
                  onClick={onOpenApproval}
                  className="w-full py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs border border-amber-500/40 animate-pulse transition-colors cursor-pointer"
                >
                  ⚠️ Review Pending Approval
                </button>
              )}

              {!isResolved && (
                <button
                  onClick={onResolve}
                  className="w-full py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs border border-emerald-500/40 transition-colors cursor-pointer"
                >
                  ✓ Confirm Resolution
                </button>
              )}

              {isResolved && (
                <button
                  onClick={onViewPostmortem}
                  className="w-full py-2 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 font-bold text-xs border border-indigo-500/40 transition-colors cursor-pointer"
                >
                  📄 View AI Postmortem
                </button>
              )}
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: Live Timeline (Col 5) */}
        <div className="lg:col-span-5">
          <IncidentTimeline events={events} />
        </div>

        {/* RIGHT COLUMN: AI Commander Panel (Col 3) */}
        <div className="lg:col-span-3 space-y-4">
          <AIDecisionPanel
            incident={incident}
            decisions={incident.decisions || []}
          />
        </div>

      </div>

    </div>
  );
};
