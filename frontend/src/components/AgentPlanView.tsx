import React from "react";
import { Cpu, CheckCircle2, Clock, Pause, Play, AlertCircle, ShieldAlert, ArrowRight } from "lucide-react";
import { Incident } from "../types";

interface AgentPlanViewProps {
  incident: Incident | null;
  onPause: () => void;
  onResume: () => void;
  onIntervene: () => void;
}

export const AgentPlanView: React.FC<AgentPlanViewProps> = ({
  incident,
  onPause,
  onResume,
  onIntervene
}) => {
  const plan = incident?.plan;
  const isPaused = plan?.current_status === "PAUSED";

  const defaultSteps = [
    { id: "s1", title: "1. Observe incident telemetry & affected user blast radius", status: incident ? "completed" : "pending" },
    { id: "s2", title: "2. Classify severity & urgency via Featherless AI", status: incident ? "completed" : "pending" },
    { id: "s3", title: "3. Score & select primary responder (Payments Lead)", status: incident ? "completed" : "pending" },
    { id: "s4", title: "4. Reach primary responder via Caspian (Telegram)", status: incident ? "completed" : "pending" },
    { id: "s5", title: "5. Monitor 10s acknowledgement SLA countdown", status: incident?.escalation_level && incident.escalation_level > 1 ? "completed" : incident ? "in_progress" : "pending" },
    { id: "s6", title: "6. Autonomously escalate to backup on timeout (Priya / Email)", status: incident?.escalation_level && incident.escalation_level > 1 ? "completed" : "pending" },
    { id: "s7", title: "7. Coordinate cross-team mitigation (Database team on Slack)", status: incident?.acknowledged_at ? "completed" : "pending" },
    { id: "s8", title: "8. Request human approval for rollback deployment #481", status: incident?.status === "MITIGATING" || incident?.status === "RESOLVED" ? "completed" : incident?.acknowledged_at ? "in_progress" : "pending" },
    { id: "s9", title: "9. Verify telemetry recovery (error rate < 1%)", status: incident?.status === "RESOLVED" ? "completed" : incident?.status === "MITIGATING" ? "in_progress" : "pending" },
    { id: "s10", title: "10. Synthesize AI postmortem & persist memory learnings", status: incident?.status === "RESOLVED" ? "completed" : "pending" },
  ];

  const steps = plan?.steps || defaultSteps;

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl glass-panel flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-400">
              <Cpu className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white flex items-center space-x-2">
                <span>NEXORA AGENT PLAN & EXECUTION GRAPH</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  isPaused
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                }`}>
                  {isPaused ? "PAUSED" : "AUTONOMOUS ACTIVE"}
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Transparent inspection of the agent's objective, execution state, and replanning cycle.
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3">
          {isPaused ? (
            <button
              onClick={onResume}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
            >
              <Play className="h-4 w-4" />
              <span>RESUME AGENT</span>
            </button>
          ) : (
            <button
              onClick={onPause}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-lg shadow-amber-600/30 transition-all cursor-pointer"
            >
              <Pause className="h-4 w-4" />
              <span>PAUSE AGENT</span>
            </button>
          )}

          <button
            onClick={onIntervene}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-white/10 transition-colors cursor-pointer"
          >
            <ShieldAlert className="h-4 w-4" />
            <span>INTERVENE</span>
          </button>
        </div>
      </div>

      {/* Plan Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Objective */}
        <div className="p-4 rounded-xl glass-panel border border-white/10">
          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block mb-1">
            ACTIVE OBJECTIVE
          </span>
          <p className="text-xs font-medium text-white leading-relaxed">
            {plan?.objective || (incident ? `Coordinate triage, adaptive escalation, and stabilization for ${incident.service}` : "Awaiting incident trigger")}
          </p>
        </div>

        {/* Waiting For */}
        <div className="p-4 rounded-xl glass-panel border border-white/10">
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
            CURRENTLY WAITING FOR
          </span>
          <p className="text-xs font-medium text-white leading-relaxed">
            {incident?.status === "RESOLVED"
              ? "All steps completed. Postmortem persisted."
              : incident?.status === "RESPONDING"
              ? "Human approval for rollback deployment"
              : incident?.status === "ESCALATING"
              ? "Backup responder acknowledgement via Email"
              : "Primary responder acknowledgement SLA (10s)"}
          </p>
        </div>

        {/* Confidence */}
        <div className="p-4 rounded-xl glass-panel border border-white/10">
          <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block mb-1">
            AI REASONING CONFIDENCE
          </span>
          <div className="text-2xl font-black text-purple-300 mt-0.5">
            {plan ? `${Math.round(plan.confidence * 100)}%` : "96%"}
          </div>
          <span className="text-[10px] text-slate-400">Featherless Llama-3.1-70B model</span>
        </div>

      </div>

      {/* Structured Checklist Steps */}
      <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
          COORDINATION PLAN EXECUTION CHECKLIST
        </h3>

        <div className="space-y-2.5">
          {steps.map((s: any, idx: number) => {
            const isDone = s.status === "completed";
            const isInProg = s.status === "in_progress";

            return (
              <div
                key={s.id || idx}
                className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                  isDone
                    ? "bg-emerald-950/20 border-emerald-500/30 text-slate-200"
                    : isInProg
                    ? "bg-cyan-950/20 border-cyan-500/50 shadow-md shadow-cyan-500/10 text-white"
                    : "bg-slate-950/60 border-white/5 text-slate-500"
                }`}
              >
                <div className="flex items-center space-x-3">
                  {isDone ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  ) : isInProg ? (
                    <Clock className="h-4 w-4 text-cyan-400 shrink-0 animate-spin" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border border-slate-600 shrink-0" />
                  )}
                  <span className={`text-xs font-semibold ${isDone ? "line-through opacity-80" : ""}`}>
                    {s.title}
                  </span>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                  isDone
                    ? "bg-emerald-500/20 text-emerald-300"
                    : isInProg
                    ? "bg-cyan-500/20 text-cyan-300 animate-pulse"
                    : "bg-slate-800 text-slate-500"
                }`}>
                  {s.status.replace("_", " ")}
                </span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
