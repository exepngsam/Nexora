import React, { useState } from "react";
import { CheckSquare, ShieldAlert, CheckCircle, XCircle, Clock, AlertTriangle, UserCheck, ShieldCheck, Zap, ArrowRight, Lock } from "lucide-react";
import { Approval } from "../types";

interface ApprovalCenterProps {
  approvals: Approval[];
  onApprove: (approvalId: string) => void;
  onReject: (approvalId: string) => void;
}

export const ApprovalCenter: React.FC<ApprovalCenterProps> = ({
  approvals,
  onApprove,
  onReject
}) => {
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("ALL");

  const filtered = approvals.filter(a => {
    if (filter === "ALL") return true;
    return a.status === filter;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl glass-panel flex flex-wrap items-center justify-between gap-4 relative overflow-hidden">
        <div className="flex items-center space-x-3.5 relative z-10">
          <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-400 glow-signal">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-black text-white font-heading">
                HUMAN-IN-THE-LOOP APPROVAL GATE
              </h2>
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-heading">
                Zero Trust Gated
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Autonomous agent proposes mitigation actions; destructive infrastructure rollbacks require cryptographic human approval.
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1 rounded-2xl bg-slate-900/90 p-1 border border-white/10 relative z-10 text-xs font-heading">
          {(["ALL", "PENDING", "APPROVED", "REJECTED"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                filter === f
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Approvals List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="p-16 rounded-3xl glass-panel text-center text-slate-500 text-xs flex flex-col items-center justify-center">
            <ShieldCheck className="h-10 w-10 text-slate-600 mb-2 opacity-60" />
            <span className="font-heading text-sm text-slate-400">No approval requests in this filter</span>
            <span className="text-[11px] text-slate-500 mt-1">Pending rollback authorizations will appear here in real-time.</span>
          </div>
        ) : (
          filtered.map((a) => {
            const isPending = a.status === "PENDING";
            const isApproved = a.status === "APPROVED";
            const isRejected = a.status === "REJECTED";

            return (
              <div
                key={a.id}
                className={`p-6 rounded-3xl glass-panel border transition-all duration-300 relative overflow-hidden ${
                  isPending
                    ? "border-amber-500/60 bg-gradient-to-r from-amber-950/20 to-slate-950/80 shadow-xl shadow-amber-500/10"
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-white/10">
                  <div>
                    <div className="flex items-center space-x-2.5 flex-wrap gap-1">
                      <span className="text-base font-bold text-white font-heading">{a.action_name}</span>
                      <span className="text-[10px] font-black px-2.5 py-0.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 font-heading">
                        {a.risk_level} BLAST RISK
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-white/5">
                        {a.id}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{a.reason}</p>
                  </div>

                  <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider font-heading shrink-0 ${
                    isPending
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse"
                      : isApproved
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      : "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                  }`}>
                    {a.status}
                  </span>
                </div>

                {/* Blast Radius & Risk Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4 text-xs font-mono">
                  <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/5">
                    <span className="text-[9px] text-slate-400 uppercase font-heading block">TARGET ENVIRONMENT</span>
                    <span className="text-white font-semibold mt-0.5 block">Production (ap-south-1)</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/5">
                    <span className="text-[9px] text-slate-400 uppercase font-heading block">EXECUTION TIMEOUT</span>
                    <span className="text-amber-400 font-semibold mt-0.5 block">60 Seconds Safe Rollback</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/5">
                    <span className="text-[9px] text-slate-400 uppercase font-heading block">REQUIRED SRE PRIVILEGE</span>
                    <span className="text-cyan-400 font-semibold mt-0.5 block">L2 Platform Lead</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
                  <div className="flex items-center space-x-3 text-[11px] text-slate-400">
                    <span>Requested by: <strong className="text-cyan-400 font-heading">NEXORA Agent Core</strong></span>
                    <span>•</span>
                    <span>Requested at: <strong className="text-slate-200 font-mono">{new Date(a.requested_at).toLocaleTimeString()}</strong></span>
                    {a.approved_by && (
                      <>
                        <span>•</span>
                        <span>Authorized by: <strong className="text-emerald-400 font-heading">✓ {a.approved_by}</strong></span>
                      </>
                    )}
                  </div>

                  {isPending && (
                    <div className="flex items-center space-x-2.5">
                      <button
                        onClick={() => onReject(a.id)}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all cursor-pointer font-heading"
                      >
                        Reject Action
                      </button>
                      <button
                        onClick={() => onApprove(a.id)}
                        className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-black text-xs shadow-lg shadow-emerald-600/30 transition-all cursor-pointer font-heading flex items-center space-x-1.5"
                      >
                        <ShieldCheck className="h-4 w-4" />
                        <span>Authorize & Execute Rollback</span>
                      </button>
                    </div>
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

