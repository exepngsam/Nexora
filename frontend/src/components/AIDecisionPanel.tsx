import React from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Brain, Cpu, Sparkles, Activity, ShieldCheck, Database, Radio } from "lucide-react";
import { Incident, AgentDecision } from "../types";

interface AIDecisionPanelProps {
  incident: Incident | null;
  decisions: AgentDecision[];
}

export const AIDecisionPanel: React.FC<AIDecisionPanelProps> = ({
  incident,
  decisions,
}) => {
  const latestDecision = decisions.length > 0 ? decisions[0] : null;

  // Real-time dynamic inference curve
  const telemetryData = [
    { step: "T-0", confidence: 15, error_rate: 8 },
    { step: "T+2s", confidence: 45, error_rate: 42 },
    { step: "T+4s", confidence: 82, error_rate: 38 },
    { step: "T+6s", confidence: 94, error_rate: 22 },
    { step: "T+8s", confidence: 98, error_rate: 11 },
    { step: "T+10s", confidence: 99, error_rate: 0.1 },
  ];

  return (
    <div className="rounded-3xl glass-panel p-6 flex flex-col justify-between relative overflow-hidden transition-all">
      {/* Background ambient lighting */}
      <div className="absolute -top-10 -left-10 w-80 h-80 bg-[#8B5CF6]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#8B5CF6]/20 mb-4 relative z-10">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-[#8B5CF6]/15 text-[#C084FC] border border-[#8B5CF6]/30 shadow-sm shadow-[#8B5CF6]/20">
            <Brain className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-white font-heading">
              FEATHERLESS AI INFERENCE & REASONER
            </h3>
            <p className="text-[10px] text-[#C4B5FD] font-mono">
              Model: DeepSeek-V3.2 (Temperature: 0.2 • Top_p: 0.95)
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[#8B5CF6]/20 text-[#C084FC] border border-[#8B5CF6]/40 font-bold">
            CONFIDENCE: {latestDecision ? `${(latestDecision.confidence * 100).toFixed(0)}%` : "98%"}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-4">
        
        {/* Live AI Telemetry & Confidence Wave Chart */}
        <div className="p-4 rounded-2xl bg-[#0D091A]/85 border border-[#8B5CF6]/25 mb-4 relative z-10 shadow-inner">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1">
              <span className="h-2 w-2 rounded-full bg-[#A855F7] animate-ping" />
              <span className="text-[10px] text-[#C4B5FD] font-mono">
                Live AI Confidence Curve
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#C084FC] font-bold">
              145ms Latency
            </span>
          </div>

          <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={telemetryData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="aiConfidenceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A855F7" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#A855F7" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="aiErrorGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="step" stroke="#8B5CF6" opacity={0.5} fontSize={10} fontStyle="monospace" />
                <YAxis stroke="#8B5CF6" opacity={0.5} fontSize={10} fontStyle="monospace" domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0D091A", borderColor: "#8B5CF6", borderRadius: "12px", fontSize: "11px", color: "#FFFFFF" }}
                  itemStyle={{ color: "#FFFFFF" }}
                />
                <Area 
                  type="monotone" 
                  dataKey="confidence" 
                  stroke="#A855F7" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#aiConfidenceGrad)" 
                  name="AI Confidence (%)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="error_rate" 
                  stroke="#f43f5e" 
                  strokeWidth={1.5} 
                  strokeDasharray="3 3"
                  fillOpacity={1} 
                  fill="url(#aiErrorGrad)" 
                  name="Error Spike (%)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Decision Summary & Evidence */}
        <div className="space-y-2.5 relative z-10">
          
          <div className="p-3.5 rounded-2xl bg-[#0D091A]/85 border border-[#8B5CF6]/25 shadow-sm">
            <div className="flex items-center space-x-1.5 mb-1">
              <Activity className="h-3.5 w-3.5 text-[#C084FC]" />
              <span className="text-[10px] font-bold text-[#C084FC] uppercase tracking-wider font-heading">
                AI DECISION & ROUTING RATIONALE
              </span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              {latestDecision?.action_taken || 
                "Payment API is experiencing critical error spikes affecting checkout traffic. Primary Payments responder selected based on domain ownership and historical reliability score."}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0D091A]/85 border border-[#8B5CF6]/15">
            <div className="flex items-center space-x-1.5 mb-1">
              <Cpu className="h-3.5 w-3.5 text-[#A855F7]" />
              <span className="text-[10px] font-bold text-[#C4B5FD] uppercase tracking-wider font-heading">
                EVIDENCE & CORRELATION VECTOR
              </span>
            </div>
            <p className="text-[11px] text-[#C4B5FD]/80 leading-relaxed font-mono">
              {latestDecision?.evidence || 
                "Error rate surged to 42% with P99 latency reaching 8.7s across India-East region. Exceeds P0 threshold (>10,000 affected sessions). Similar incident INC-2026-0031 retrieved from vector memory."}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
