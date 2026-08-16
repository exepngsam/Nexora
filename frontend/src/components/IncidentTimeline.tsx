import React from "react";
import { Clock, Shield, AlertTriangle, Send, Mail, CheckCircle2, UserCheck, Flame, Cpu, FileText } from "lucide-react";
import { IncidentEvent } from "../types";

interface IncidentTimelineProps {
  events: IncidentEvent[];
}

export const IncidentTimeline: React.FC<IncidentTimelineProps> = ({ events }) => {
  return (
    <div className="rounded-2xl glass-panel p-5">
      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-cyan-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
            INCIDENT TIMELINE
          </h3>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">
          {events.length} events logged
        </span>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
        {events.length === 0 ? (
          <div className="text-xs text-slate-500 py-4">No events in timeline yet.</div>
        ) : (
          events.map((evt, idx) => {
            const isEscalation = evt.event_type.includes("timeout") || evt.event_type.includes("escalation");
            const isResolved = evt.event_type.includes("resolved") || evt.event_type.includes("postmortem");
            const isAck = evt.event_type.includes("ack.received");
            const isApproval = evt.event_type.includes("approval");

            return (
              <div key={evt.id || idx} className="relative group">
                {/* Timeline Dot */}
                <div className={`absolute -left-[27px] top-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#060913] ${
                  isEscalation
                    ? "bg-rose-500 ring-2 ring-rose-500/30 animate-pulse"
                    : isResolved
                    ? "bg-emerald-400 ring-2 ring-emerald-400/30"
                    : isAck
                    ? "bg-cyan-400 ring-2 ring-cyan-400/30"
                    : isApproval
                    ? "bg-amber-400 ring-2 ring-amber-400/30"
                    : "bg-indigo-500"
                }`} />

                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-xs font-bold text-white uppercase tracking-tight">
                    {evt.event_type.replace(".", " → ")}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">
                    {new Date(evt.timestamp).toLocaleTimeString()}
                  </span>
                </div>

                <p className="text-xs text-slate-300 mt-1 leading-snug">
                  {evt.summary}
                </p>

                <div className="flex items-center space-x-2 mt-1 text-[10px] text-slate-400">
                  <span>Actor: <strong className="text-slate-200">{evt.actor}</strong></span>
                  {evt.channel && (
                    <>
                      <span>•</span>
                      <span>Channel: <strong className="text-slate-200 capitalize">{evt.channel}</strong></span>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
