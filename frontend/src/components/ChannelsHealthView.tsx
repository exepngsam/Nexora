import React from "react";
import { Zap, Send, Mail, MessageSquare, PhoneCall, CheckCircle2, Radio, Activity } from "lucide-react";
import { ChannelStatus } from "../types";

interface ChannelsHealthViewProps {
  channels: ChannelStatus[];
}

export const ChannelsHealthView: React.FC<ChannelsHealthViewProps> = ({ channels }) => {
  const iconMap: Record<string, any> = {
    telegram: Send,
    email: Mail,
    slack: MessageSquare,
    whatsapp: PhoneCall,
    discord: Radio
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl glass-panel flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
              <Zap className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white flex items-center space-x-2">
                <span>CASPIAN CHANNELS & REACH TOPOLOGY</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time delivery rates, network latencies, and automatic failover health across unified endpoints.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-emerald-500/10 px-3.5 py-1.5 rounded-xl border border-emerald-500/30 text-emerald-400 text-xs font-bold">
          <Activity className="h-4 w-4" />
          <span>All Gateways Active</span>
        </div>
      </div>

      {/* Grid of Channels */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {channels.map((ch) => {
          const Icon = iconMap[ch.id.toLowerCase()] || Radio;
          return (
            <div key={ch.id} className="p-5 rounded-2xl glass-panel border border-white/10 space-y-4 hover:border-cyan-500/30 transition-all">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{ch.name}</h3>
                    <span className="text-[10px] text-slate-400">Caspian Gateway</span>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {ch.status.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5">
                  <span className="text-[9px] font-bold text-slate-400 uppercase">DELIVERY RATE</span>
                  <div className="text-base font-black text-emerald-400 mt-0.5">
                    {Math.round(ch.delivery_rate * 1000) / 10}%
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5">
                  <span className="text-[9px] font-bold text-slate-400 uppercase">AVG LATENCY</span>
                  <div className="text-base font-black text-cyan-400 mt-0.5">
                    {ch.average_latency_ms} ms
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>Failover Target: <strong className="text-white">Active</strong></span>
                <span className="text-emerald-400 font-semibold flex items-center space-x-1">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>SLA 99.9%</span>
                </span>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
