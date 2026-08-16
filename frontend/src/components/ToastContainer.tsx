import React from "react";
import { CheckCircle2, AlertTriangle, Info, X, Zap, Shield, Sparkles } from "lucide-react";

export interface ToastMessage {
  id: string;
  type: "success" | "info" | "warning" | "error";
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === "success";
        const isWarning = toast.type === "warning";
        const isError = toast.type === "error";

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl glass-panel border shadow-2xl flex items-start space-x-3 transition-all duration-300 transform translate-y-0 opacity-100 ${
              isSuccess
                ? "border-emerald-500/40 bg-slate-950/90 shadow-emerald-500/10"
                : isWarning
                ? "border-amber-500/40 bg-slate-950/90 shadow-amber-500/10"
                : isError
                ? "border-rose-500/40 bg-slate-950/90 shadow-rose-500/10"
                : "border-cyan-500/40 bg-slate-950/90 shadow-cyan-500/10"
            }`}
          >
            <div className={`p-1.5 rounded-xl mt-0.5 shrink-0 ${
              isSuccess
                ? "bg-emerald-500/20 text-emerald-400"
                : isWarning
                ? "bg-amber-500/20 text-amber-400"
                : isError
                ? "bg-rose-500/20 text-rose-400"
                : "bg-cyan-500/20 text-cyan-400"
            }`}>
              {isSuccess ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : isWarning ? (
                <AlertTriangle className="h-4 w-4" />
              ) : isError ? (
                <Zap className="h-4 w-4" />
              ) : (
                <Info className="h-4 w-4" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-white font-heading">{toast.title}</h4>
              {toast.message && (
                <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">{toast.message}</p>
              )}
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-500 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
