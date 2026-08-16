import React, { useState } from "react";
import { Brain, Search, Sparkles, CheckCircle2, History, ArrowRight, ShieldAlert, Database, Flame, Zap } from "lucide-react";

export const MemoryView: React.FC = () => {
  const [query, setQuery] = useState("connection pool exhaustion");

  const historicalIncidents = [
    {
      id: "INC-2026-0031",
      title: "Payment API Latency Spike & 504 Gateway Errors",
      service: "Payment API",
      severity: "P0 CRITICAL",
      days_ago: "18 days ago",
      match_score: 87,
      root_cause: "Database connection pool exhaustion on primary cluster (max_connections capped at 100 with lingering idle sockets).",
      successful_mitigation: "Increase base pool limit to 500, cycle idle connections, and enforce connection lease timeouts.",
      responders: ["Alex Vance", "Priya Sharma"],
      embedding_distance: "0.13 cosine distance"
    },
    {
      id: "INC-2026-0019",
      title: "Order Database Thread Starvation Anomaly",
      service: "Order Database",
      severity: "P0 CRITICAL",
      days_ago: "45 days ago",
      match_score: 64,
      root_cause: "Slow query locks in checkout transaction table blocking worker pool threads.",
      successful_mitigation: "Terminated uncommitted locks and deployed indexing patch #290.",
      responders: ["Rahul Nair", "Priya Sharma"],
      embedding_distance: "0.36 cosine distance"
    }
  ];

  const searchKeywords = [
    "connection pool exhaustion",
    "gateway timeout 504",
    "redis cache stampede",
    "deadlock in payments",
    "kafka partition rebalance"
  ];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl glass-panel flex flex-wrap items-center justify-between gap-4 relative overflow-hidden">
        <div className="flex items-center space-x-3.5 relative z-10">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/40 text-purple-400 glow-signal">
            <Brain className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white font-heading">
              VECTOR INCIDENT MEMORY & INTELLIGENCE
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              High-dimensional vector memory retrieval associating real-time telemetry symptoms with past postmortems.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono relative z-10">
          <span className="px-3.5 py-1.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 font-bold flex items-center space-x-1.5 font-heading">
            <Sparkles className="h-3.5 w-3.5" />
            <span>SEMANTIC EMBEDDINGS</span>
          </span>
        </div>
      </div>

      {/* Search Input & Quick Chips */}
      <div className="p-5 rounded-3xl glass-panel border border-white/10 space-y-3">
        <div className="flex items-center space-x-3 bg-slate-950/80 border border-white/10 rounded-2xl px-4 py-3">
          <Search className="h-4 w-4 text-cyan-400 shrink-0" />
          <input
            type="text"
            placeholder="Search historical memory by symptoms, root causes, or mitigation procedures..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-white placeholder:text-slate-500 focus:outline-none font-mono"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[10px] text-slate-400 font-bold mr-1 font-heading">POPULAR VECTORS:</span>
          {searchKeywords.map((kw, idx) => (
            <button
              key={idx}
              onClick={() => setQuery(kw)}
              className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-900/80 border border-white/10 text-slate-300 hover:border-purple-500/50 hover:text-purple-300 transition-all cursor-pointer font-mono"
            >
              {kw}
            </button>
          ))}
        </div>
      </div>

      {/* Memory Match Cards */}
      <div className="space-y-4">
        {historicalIncidents.map((inc) => (
          <div key={inc.id} className="p-6 rounded-3xl glass-panel border border-purple-500/30 space-y-4 hover:border-purple-500/60 transition-all relative overflow-hidden group">
            
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10 relative z-10">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-bold text-white font-heading">{inc.title}</span>
                <span className="text-xs font-mono text-cyan-400 bg-slate-900 px-2.5 py-1 rounded-xl border border-white/10">
                  {inc.id}
                </span>
                <span className="text-xs text-slate-400 font-mono">{inc.days_ago}</span>
              </div>

              {/* Memory Match Score Pill */}
              <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 px-3.5 py-1.5 rounded-xl border border-purple-500/40 text-purple-300">
                <Brain className="h-4 w-4" />
                <span className="text-xs font-black font-heading">VECTOR MATCH: {inc.match_score}%</span>
                <span className="text-[9px] text-slate-400 font-mono hidden sm:inline">({inc.embedding_distance})</span>
              </div>
            </div>

            {/* Score progress line */}
            <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${inc.match_score}%` }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs relative z-10">
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-rose-500/20">
                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block mb-1.5 font-heading">
                  HISTORICAL ROOT CAUSE
                </span>
                <p className="text-slate-300 leading-relaxed font-medium">
                  {inc.root_cause}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-emerald-500/20">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1.5 font-heading">
                  VERIFIED REMEDIATION PROCEDURE
                </span>
                <p className="text-slate-300 leading-relaxed font-medium">
                  {inc.successful_mitigation}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 relative z-10">
              <span>Past Responders: <strong className="text-white font-heading">{inc.responders.join(", ")}</strong></span>
              <span className="text-cyan-400 font-semibold font-mono">Service: {inc.service}</span>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

