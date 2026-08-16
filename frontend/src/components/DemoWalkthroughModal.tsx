import React from "react";
import { X, Play, Clock, CheckCircle2, Shield, Send, ArrowRight } from "lucide-react";

interface DemoWalkthroughModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchHeroDemo: () => void;
}

export const DemoWalkthroughModal: React.FC<DemoWalkthroughModalProps> = ({
  isOpen,
  onClose,
  onLaunchHeroDemo
}) => {
  if (!isOpen) return null;

  const steps = [
    { time: "0:00", title: "The Problem", text: "AI has become very good at thinking. But thinking is useless if the AI cannot reach the human who needs to act." },
    { time: "0:20", title: "Simulate P0 Incident", text: "Trigger the Payment API 42% outage anomaly on India-East." },
    { time: "0:30", title: "AI Classification", text: "Featherless AI classifies P0 severity with 97% confidence in 3 seconds." },
    { time: "0:40", title: "Caspian Primary Reach", text: "NEXORA identifies Alex Vance and dispatches a Telegram alert with 10s SLA." },
    { time: "1:00", title: "Autonomous Escalation", text: "Alex misses the 10s window. NEXORA autonomously initiates Level 2 escalation." },
    { time: "1:15", title: "Multi-Channel Failover", text: "Caspian routes urgent email alert to Priya Sharma (Senior Platform SRE)." },
    { time: "1:25", title: "Human Acknowledgement", text: "Priya acknowledges. Ownership transfers instantly; Slack DB team is notified." },
    { time: "1:45", title: "Human-in-the-Loop Safety", text: "NEXORA recommends rollback build #481 and blocks for human approval." },
    { time: "2:05", title: "Resolution & Postmortem", text: "Metrics normalize (0.4% error rate). AI synthesizes full postmortem report." },
    { time: "2:30", title: "The NEXORA Response Graph", text: "Highlight one persistent AI agent orchestrating multiple channels and humans." },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl glass-panel p-6 border border-indigo-500/40 shadow-2xl overflow-hidden relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400">
              <Play className="h-6 w-6 fill-indigo-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                3-MINUTE HACKATHON LIVE DEMO SCRIPT
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Exact presentation flow designed for Caspian AI Agent Hackathon judges.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Steps List */}
        <div className="flex-1 overflow-y-auto my-4 pr-2 space-y-3 text-xs">
          {steps.map((s, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-950/70 border border-white/5 flex items-start space-x-3">
              <span className="px-2 py-1 rounded bg-indigo-500/20 text-indigo-300 font-mono font-bold shrink-0">
                {s.time}
              </span>
              <div>
                <h4 className="font-bold text-white mb-0.5">{s.title}</h4>
                <p className="text-slate-300 text-[11px] leading-snug">{s.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-400">
            Clicking below initiates the full live autonomous flow.
          </span>

          <button
            onClick={() => {
              onClose();
              onLaunchHeroDemo();
            }}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white text-xs font-bold shadow-lg shadow-cyan-500/30 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            <Play className="h-3.5 w-3.5 fill-white" />
            <span>START LIVE DEMO RUN</span>
          </button>
        </div>

      </div>
    </div>
  );
};
