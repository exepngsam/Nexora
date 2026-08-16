import React from "react";
import { ShieldAlert, AlertTriangle, CheckCircle, XCircle, ArrowRight, Lock } from "lucide-react";
import { Approval } from "../types";

interface HumanApprovalModalProps {
  approval: Approval | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (approvalId: string) => void;
  onReject: (approvalId: string) => void;
}

export const HumanApprovalModal: React.FC<HumanApprovalModalProps> = ({
  approval,
  isOpen,
  onClose,
  onApprove,
  onReject
}) => {
  if (!isOpen || !approval) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl glass-panel p-6 border border-amber-500/40 shadow-2xl shadow-amber-500/20 relative">
        
        {/* Header */}
        <div className="flex items-center space-x-3 pb-4 border-b border-white/10">
          <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <span>HUMAN APPROVAL REQUIRED</span>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                {approval.risk_level} RISK
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              NEXORA safety policy prevents automated execution of destructive actions.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="my-5 space-y-4 text-xs">
          
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/5">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
              RECOMMENDED ACTION
            </span>
            <div className="text-sm font-bold text-white">
              {approval.action_name}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              AGENT RATIONALE
            </span>
            <p className="text-slate-300 leading-relaxed">
              {approval.reason}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-cyan-300 flex items-start space-x-2">
            <Lock className="h-4 w-4 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-tight">
              Executing this action will cycle production pods, reset connection quotas, and revert configuration build #481.
            </p>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-white/10">
          <button
            onClick={() => {
              onReject(approval.id);
              onClose();
            }}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <XCircle className="h-4 w-4" />
            <span>REJECT ACTION</span>
          </button>

          <button
            onClick={() => {
              onApprove(approval.id);
              onClose();
            }}
            className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold shadow-lg shadow-emerald-500/30 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            <CheckCircle className="h-4 w-4" />
            <span>AUTHORIZE & EXECUTE</span>
          </button>
        </div>

      </div>
    </div>
  );
};
