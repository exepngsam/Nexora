import React, { useState } from "react";
import { Terminal, Cpu, Shield, Send, ArrowRight, CheckCircle2, Clock, Filter, Copy, Check } from "lucide-react";
import { IncidentEvent } from "../types";

interface AgentActivityFeedProps {
  events: IncidentEvent[];
}

export const AgentActivityFeed: React.FC<AgentActivityFeedProps> = ({ events }) => {
  const [filter, setFilter] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredEvents = events.filter((evt) => {
    if (filter === "all") return true;
    if (filter === "ai") return evt.event_type.includes("classified") || evt.event_type.includes("decision");
    if (filter === "caspian") return evt.channel || evt.event_type.includes("message") || evt.event_type.includes("dispatched");
    if (filter === "escalation") return evt.event_type.includes("escalation") || evt.event_type.includes("timeout");
    if (filter === "approvals") return evt.event_type.includes("approval") || evt.event_type.includes("resolved");
    return true;
  });

  const handleCopy = (evt: IncidentEvent) => {
    navigator.clipboard.writeText(`[${new Date(evt.timestamp).toISOString()}] [${evt.event_type}] ${evt.summary}`);
    setCopiedId(evt.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="rounded-3xl glass-panel p-6 flex flex-col h-[520px] relative overflow-hidden transition-all">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3 relative z-10">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
            <Terminal className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-white font-heading">
              LIVE AGENT TELEMETRY FEED
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">
              {filteredEvents.length} events streamed via WebSocket
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 text-[10px] font-mono text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-full border border-white/10">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="text-emerald-400 font-bold">STREAM LIVE</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-1.5 mb-3 overflow-x-auto custom-scroll pb-1 relative z-10 text-[10px] font-mono">
        {[
          { id: "all", label: "All Telemetry" },
          { id: "ai", label: "AI Reasoning" },
          { id: "caspian", label: "Caspian Dispatch" },
          { id: "escalation", label: "Escalations" },
          { id: "approvals", label: "Approvals" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer font-medium whitespace-nowrap ${
              filter === tab.id
                ? "bg-[#06D6A0]/20 text-[#E6FBF6] border border-[#06D6A0]/40 font-bold"
                : "bg-[#061d19]/60 text-[#A7E8D8] border border-[#06D6A0]/10 hover:text-white hover:bg-[#0C4137]/40"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Terminal Content */}
      <div className="flex-1 overflow-y-auto custom-scroll space-y-2 pr-1 text-xs font-mono relative z-10">
        {filteredEvents.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 text-[11px]">
            <Terminal className="h-6 w-6 text-slate-600 mb-2 opacity-50" />
            <span>Waiting for incoming agent telemetry...</span>
          </div>
        ) : (
          filteredEvents.map((evt, idx) => {
            const timeStr = new Date(evt.timestamp).toLocaleTimeString();
            const isEscalation = evt.event_type.includes("escalation") || evt.event_type.includes("timeout");
            const isAck = evt.event_type.includes("ack.received") || evt.event_type.includes("resolved");
            const isAI = evt.event_type.includes("classified") || evt.event_type.includes("decision");

            return (
              <div
                key={evt.id || idx}
                className="p-3 rounded-2xl bg-slate-950/80 border border-white/5 hover:border-cyan-500/30 transition-all flex items-start space-x-3 group relative"
              >
                <span className="text-[10px] text-slate-500 shrink-0 pt-0.5 font-mono">
                  {timeStr}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1 flex-wrap gap-1">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-lg uppercase font-heading ${
                      isEscalation
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        : isAck
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : isAI
                        ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                        : "bg-cyan-500/15 text-cyan-300 border border-cyan-500/25"
                    }`}>
                      {evt.event_type}
                    </span>
                    {evt.channel && (
                      <span className="text-[10px] font-semibold text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-white/5">
                        via {evt.channel}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-200 leading-snug break-words">
                    {evt.summary}
                  </p>
                </div>

                <button
                  onClick={() => handleCopy(evt)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                  title="Copy telemetry log"
                >
                  {copiedId === evt.id ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

