import React from "react";
import { FileText, Download, X, CheckCircle, AlertTriangle, Shield, Clock } from "lucide-react";
import { Postmortem } from "../types";

interface PostmortemModalProps {
  postmortem: Postmortem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PostmortemModal: React.FC<PostmortemModalProps> = ({
  postmortem,
  isOpen,
  onClose
}) => {
  if (!isOpen || !postmortem) return null;

  const handleExport = () => {
    const mdContent = `# NEXORA POST-INCIDENT REPORT
Incident ID: ${postmortem.id}
Generated: ${new Date(postmortem.generated_at).toUTCString()}

## EXECUTIVE SUMMARY
${postmortem.executive_summary}

## IMPACT
${postmortem.impact}

## ROOT CAUSE (Confidence: ${Math.round(postmortem.confidence * 100)}%)
${postmortem.root_cause}

## RESPONSE PERFORMANCE
- Time to Awareness: ${postmortem.time_to_awareness}
- Time to Acknowledge: ${postmortem.time_to_ack}
- Escalations: ${postmortem.total_escalations}
- Channels Used: ${postmortem.channels_used}
- Responders Involved: ${postmortem.responders_involved}

## WHAT WENT WELL
${postmortem.what_went_well || "Caspian multi-channel failover ensured rapid escalation."}

## WHAT FAILED
${postmortem.what_failed || "Primary on-call missed initial Telegram window."}

## PREVENTIVE ACTIONS
${postmortem.preventive_actions || "1. Increase connection pool limits\n2. Add pre-emptive warning alerts."}

## FOLLOW-UP TASKS
${(postmortem.follow_up_tasks || []).map((t, idx) => `${idx + 1}. ${t}`).join("\n")}
`;

    const blob = new Blob([mdContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `NEXORA_Postmortem_${postmortem.id}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl glass-panel p-6 border border-cyan-500/40 shadow-2xl overflow-hidden relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <span>AI POST-INCIDENT REPORT</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {postmortem.id}
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Automatically synthesized by Featherless AI engine from coordination telemetry.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto my-4 pr-2 space-y-4 text-xs">
          
          {/* Performance Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 p-3 rounded-xl bg-slate-950/80 border border-white/5 text-center">
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase">AWARENESS</span>
              <div className="text-sm font-black text-cyan-400 mt-0.5">{postmortem.time_to_awareness}</div>
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase">ACK TIME</span>
              <div className="text-sm font-black text-emerald-400 mt-0.5">{postmortem.time_to_ack}</div>
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase">ESCALATIONS</span>
              <div className="text-sm font-black text-purple-400 mt-0.5">{postmortem.total_escalations}</div>
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase">CHANNELS</span>
              <div className="text-sm font-black text-amber-400 mt-0.5">{postmortem.channels_used}</div>
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase">RESPONDERS</span>
              <div className="text-sm font-black text-indigo-400 mt-0.5">{postmortem.responders_involved}</div>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5">
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block mb-1">
              EXECUTIVE SUMMARY
            </span>
            <p className="text-slate-200 leading-relaxed">
              {postmortem.executive_summary}
            </p>
          </div>

          {/* Root Cause */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-rose-500/20">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">
                ROOT CAUSE ANALYSIS
              </span>
              <span className="text-[10px] font-bold text-rose-300">
                Confidence: {Math.round(postmortem.confidence * 100)}%
              </span>
            </div>
            <p className="text-slate-200 leading-relaxed font-medium">
              {postmortem.root_cause}
            </p>
          </div>

          {/* Impact */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              USER & BUSINESS IMPACT
            </span>
            <p className="text-slate-300 leading-relaxed">
              {postmortem.impact}
            </p>
          </div>

          {/* What Went Well & What Failed */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-emerald-500/20">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                WHAT WENT WELL
              </span>
              <p className="text-slate-300 leading-relaxed">
                {postmortem.what_went_well}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-amber-500/20">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                AREAS OF IMPROVEMENT
              </span>
              <p className="text-slate-300 leading-relaxed">
                {postmortem.what_failed}
              </p>
            </div>
          </div>

          {/* Preventive Actions */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block mb-1">
              PREVENTIVE ACTIONS & RECOMMENDATIONS
            </span>
            <p className="text-slate-300 leading-relaxed whitespace-pre-line">
              {postmortem.preventive_actions}
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10 shrink-0">
          <span className="text-[11px] text-slate-400">
            NEXORA incident record INC-2026-0042
          </span>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handleExport}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
            >
              <Download className="h-4 w-4" />
              <span>EXPORT REPORT (.MD)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
