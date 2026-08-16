import React, { useState } from "react";
import { Users, Send, Mail, MessageSquare, PhoneCall, ShieldCheck, CheckCircle2, Award, Zap, Radio, Bell } from "lucide-react";
import { Responder } from "../types";

interface HumanDirectoryProps {
  responders: Responder[];
}

export const HumanDirectory: React.FC<HumanDirectoryProps> = ({ responders }) => {
  const [pingedUser, setPingedUser] = useState<string | null>(null);

  const handlePing = (user: Responder) => {
    setPingedUser(user.id);
    setTimeout(() => setPingedUser(null), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl glass-panel flex flex-wrap items-center justify-between gap-4 relative overflow-hidden">
        <div className="flex items-center space-x-3.5 relative z-10">
          <div className="p-3 rounded-2xl bg-cyan-500/15 border border-cyan-500/40 text-cyan-400 glow-signal">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white font-heading">
              UNIFIED HUMAN IDENTITY MATRIX
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
              NEXORA maintains single persistent human identities mapped across diverse communication endpoints (Telegram, Email, Slack).
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono relative z-10">
          <span className="px-3.5 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-bold flex items-center space-x-1.5 font-heading">
            <ShieldCheck className="h-4 w-4" />
            <span>4 SRE RESPONDERS ONLINE</span>
          </span>
        </div>
      </div>

      {/* Grid of Responders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {responders.map((r) => {
          const isPinged = pingedUser === r.id;

          return (
            <div key={r.id} className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4 hover:border-cyan-500/40 transition-all duration-300 group relative overflow-hidden">
              
              {/* Profile Bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3.5">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-cyan-500 via-indigo-600 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/15 flex items-center justify-center">
                    <div className="h-full w-full bg-slate-950 rounded-2xl flex items-center justify-center text-white font-black text-sm font-heading">
                      {r.name.split(" ").map(n => n[0]).join("")}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center space-x-2 font-heading">
                      <span>{r.name}</span>
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5 font-medium">{r.role} • <span className="text-slate-300">{r.team}</span></p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block font-heading">RELIABILITY SCORE</span>
                  <span className="text-base font-black text-emerald-400 font-mono">{r.response_rate}% SLA</span>
                </div>
              </div>

              {/* Mapped Identities Row */}
              <div className="pt-3 border-t border-white/10 space-y-2">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block font-heading">
                  MAPPED CASPIAN COMMUNICATION CHANNELS
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                  {r.identities.telegram && (
                    <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/5 flex items-center space-x-2">
                      <Send className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                      <span className="text-slate-300 truncate">{r.identities.telegram}</span>
                    </div>
                  )}

                  {r.identities.email && (
                    <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/5 flex items-center space-x-2">
                      <Mail className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                      <span className="text-slate-300 truncate">{r.identities.email}</span>
                    </div>
                  )}

                  {r.identities.slack && (
                    <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/5 flex items-center space-x-2">
                      <MessageSquare className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                      <span className="text-slate-300 truncate">{r.identities.slack}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Channel Preference & Test Ping Button */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-white/5">
                <div className="flex items-center space-x-2">
                  <span>Primary: <strong className="text-white capitalize font-mono">{r.preferred_channel}</strong></span>
                  <span>•</span>
                  <span className="text-emerald-400 font-semibold flex items-center space-x-1 font-mono">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Active Reachable</span>
                  </span>
                </div>

                <button
                  onClick={() => handlePing(r)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer font-heading flex items-center space-x-1 ${
                    isPinged
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      : "bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10 hover:text-white"
                  }`}
                >
                  <Bell className={`h-3 w-3 ${isPinged ? "animate-spin text-emerald-400" : ""}`} />
                  <span>{isPinged ? "Ping Dispatched!" : "Test Ping"}</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};

