import React, { useState } from "react";
import { BookOpen, Sparkles, Plus, Clock, ShieldCheck, CheckCircle2, ArrowRight, Zap, Shield, Flame, Check, Play } from "lucide-react";

export interface PlaybookItem {
  id: string;
  name: string;
  description: string;
  service: string;
  severity: string;
  primary_team: string;
  backup_team: string;
  ack_timeout_seconds: number;
  escalation_strategy: string;
  approval_required_actions: string[];
  resolution_conditions: string;
}

interface PlaybooksViewProps {
  playbooks: PlaybookItem[];
  onGeneratePlaybook: (prompt: string, service: string) => Promise<void>;
}

export const PlaybooksView: React.FC<PlaybooksViewProps> = ({
  playbooks,
  onGeneratePlaybook
}) => {
  const [promptText, setPromptText] = useState("");
  const [serviceName, setServiceName] = useState("Payment API");
  const [isGenerating, setIsGenerating] = useState(false);

  const promptSuggestions = [
    { title: "Kafka Consumer Lag Surge", service: "Kafka Ingestion", prompt: "Create an autonomous response playbook for Kafka consumer partition lag exceeding 50,000 messages with rebalance loop detection." },
    { title: "PostgreSQL Connection Pool Leak", service: "Order Database", prompt: "Response procedure for database connection pool exhaustion with client-side connection leakage and automated pg_terminate_backend fallback." },
    { title: "Auth Credential Stuffing Burst", service: "Auth & Identity", prompt: "Security incident playbook for distributed credential stuffing attack against OAuth endpoint with automated Cloudflare IP challenge." },
    { title: "K8s OOMKill Pod Crashloop", service: "Core Services", prompt: "Playbook for Kubernetes pod OOMKill cascade across node group with automated HPA limit adjustments." }
  ];

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!promptText.trim()) return;
    setIsGenerating(true);
    try {
      await onGeneratePlaybook(promptText, serviceName);
      setPromptText("");
    } catch (err) {
      console.error("Failed to generate playbook", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const applySuggestion = (s: typeof promptSuggestions[0]) => {
    setPromptText(s.prompt);
    setServiceName(s.service);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl glass-panel flex flex-wrap items-center justify-between gap-4 relative overflow-hidden">
        <div className="flex items-center space-x-3.5 relative z-10">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/40 text-cyan-400 glow-signal">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white font-heading">
              INCIDENT PLAYBOOKS & AI GENERATOR
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Deterministic incident response workflows synthesized with Featherless open-source AI.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono relative z-10">
          <span className="px-3 py-1 rounded-full bg-slate-900/80 border border-white/10 text-slate-300">
            {playbooks.length} Active Playbooks
          </span>
        </div>
      </div>

      {/* AI Playbook Generator Form */}
      <form onSubmit={handleGenerate} className="p-6 rounded-3xl glass-panel border border-cyan-500/30 space-y-4 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-cyan-400 animate-spin" />
            <h3 className="text-xs font-black uppercase tracking-wider text-white font-heading">
              SYNTHESIZE NEW PLAYBOOK VIA FEATHERLESS AI
            </h3>
          </div>
          <span className="text-[10px] font-mono text-purple-300 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/30">
            deepseek-ai/DeepSeek-V3.2
          </span>
        </div>

        {/* Quick prompt suggestions */}
        <div className="flex flex-wrap gap-2 pt-1">
          <span className="text-[10px] text-slate-400 font-bold self-center mr-1">TRY TEMPLATES:</span>
          {promptSuggestions.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applySuggestion(s)}
              className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-900/80 border border-white/10 text-slate-300 hover:border-cyan-500/50 hover:text-cyan-300 hover:bg-slate-800 transition-all cursor-pointer font-medium"
            >
              {s.title}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="Describe incident scenario & response steps (e.g. Response procedure for Redis cache stampede)..."
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              className="w-full bg-slate-950/80 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Service Name (e.g. Payment API)"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              className="w-full bg-slate-950/80 border border-white/10 rounded-2xl px-3.5 py-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all"
            />
            <button
              type="submit"
              disabled={isGenerating || !promptText.trim()}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white text-xs font-black shrink-0 shadow-lg shadow-cyan-500/25 hover:brightness-110 active:scale-95 transition-all cursor-pointer disabled:opacity-50 font-heading flex items-center space-x-1.5"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="h-3.5 w-3.5 animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Zap className="h-3.5 w-3.5" />
                  <span>Generate</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Playbooks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {playbooks.map((pb) => (
          <div key={pb.id} className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4 hover:border-cyan-500/40 transition-all group relative overflow-hidden">
            
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/10">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-bold text-white font-heading">{pb.name}</h3>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.2 rounded border border-cyan-500/20">
                    {pb.service}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{pb.description}</p>
              </div>
              <span className="text-[10px] font-black px-2.5 py-1 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 shrink-0 font-heading">
                {pb.severity}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-[11px] font-mono">
              <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/5">
                <span className="text-slate-400 block text-[9px] font-bold uppercase font-heading">PRIMARY RESPONDER</span>
                <span className="text-white font-semibold mt-0.5 block">{pb.primary_team}</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/5">
                <span className="text-slate-400 block text-[9px] font-bold uppercase font-heading">BACKUP ESCALATION</span>
                <span className="text-white font-semibold mt-0.5 block">{pb.backup_team}</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/5">
                <span className="text-slate-400 block text-[9px] font-bold uppercase font-heading">ACK TIMEOUT SLA</span>
                <span className="text-amber-400 font-semibold mt-0.5 block">{pb.ack_timeout_seconds}s (Telegram)</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/5">
                <span className="text-slate-400 block text-[9px] font-bold uppercase font-heading">ROUTING STRATEGY</span>
                <span className="text-cyan-400 font-semibold mt-0.5 block">{pb.escalation_strategy}</span>
              </div>
            </div>

            {/* Approval gates & resolution condition */}
            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-purple-500/20 space-y-1.5 text-xs">
              <div className="flex items-center space-x-2 text-slate-300">
                <Shield className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                <span>Approval Actions: <strong className="text-purple-300 font-mono">{pb.approval_required_actions.join(", ")}</strong></span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>Resolution Target: <strong className="text-emerald-400 font-mono">{pb.resolution_conditions}</strong></span>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

