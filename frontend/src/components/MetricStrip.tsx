import React from "react";
import { AlertCircle, Clock, Users, CheckCircle2, Zap, Radio, TrendingUp, Sparkles } from "lucide-react";
import { AnalyticsData } from "../types";

interface MetricStripProps {
  analytics: AnalyticsData | null;
}

export const MetricStrip: React.FC<MetricStripProps> = ({ analytics }) => {
  const metrics = [
    {
      label: "ACTIVE INCIDENTS",
      value: analytics ? `${analytics.active_incidents < 10 ? '0' : ''}${analytics.active_incidents}` : "01",
      icon: AlertCircle,
      color: "text-rose-400",
      bg: "bg-rose-500/15",
      border: "border-rose-500/30 hover:border-rose-500/60 shadow-rose-500/10",
      cardGrad: "from-rose-950/30 via-[#140E30]/80 to-[#07050E]/95",
      trend: "Real-time Telemetry",
      sparkline: "M0 16 Q 15 4, 30 18 T 60 8 T 90 2",
      glowColor: "bg-rose-500/15"
    },
    {
      label: "RESPONDERS REACHABLE",
      value: analytics ? `${analytics.responders_online < 10 ? '0' : ''}${analytics.responders_online}` : "04",
      icon: Users,
      color: "text-[#C084FC]",
      bg: "bg-[#8B5CF6]/15",
      border: "border-[#8B5CF6]/30 hover:border-[#A855F7]/60 shadow-[#8B5CF6]/10",
      cardGrad: "from-[#8B5CF6]/20 via-[#140E30]/80 to-[#07050E]/95",
      trend: "100% Omni-channel",
      sparkline: "M0 14 Q 20 8, 40 12 T 70 6 T 90 4",
      glowColor: "bg-[#8B5CF6]/15"
    },
    {
      label: "AVG ACK TIME (SLA)",
      value: analytics ? `${analytics.avg_ack_time_seconds}s` : "21s",
      icon: Clock,
      color: "text-amber-400",
      bg: "bg-amber-500/15",
      border: "border-amber-500/30 hover:border-amber-500/60 shadow-amber-500/10",
      cardGrad: "from-amber-950/25 via-[#140E30]/80 to-[#07050E]/95",
      trend: "Target < 30s SLA",
      sparkline: "M0 4 Q 25 18, 50 10 T 80 14 T 90 8",
      glowColor: "bg-amber-500/15"
    },
    {
      label: "AVG RESOLUTION",
      value: analytics ? `${analytics.avg_resolution_minutes}m` : "8m",
      icon: CheckCircle2,
      color: "text-[#38BDF8]",
      bg: "bg-[#38BDF8]/15",
      border: "border-[#38BDF8]/30 hover:border-[#38BDF8]/60 shadow-[#38BDF8]/10",
      cardGrad: "from-[#38BDF8]/20 via-[#140E30]/80 to-[#07050E]/95",
      trend: "85% Faster MTTR",
      sparkline: "M0 18 Q 30 14, 55 6 T 85 4 T 90 2",
      glowColor: "bg-[#38BDF8]/15"
    },
    {
      label: "AUTONOMOUS ESCALATIONS",
      value: analytics ? `${analytics.escalations_today < 10 ? '0' : ''}${analytics.escalations_today}` : "07",
      icon: Zap,
      color: "text-[#A855F7]",
      bg: "bg-[#A855F7]/15",
      border: "border-[#A855F7]/30 hover:border-[#A855F7]/60 shadow-[#A855F7]/10",
      cardGrad: "from-[#A855F7]/20 via-[#140E30]/80 to-[#07050E]/95",
      trend: "Zero-Human Delay",
      sparkline: "M0 16 Q 20 12, 45 4 T 75 14 T 90 6",
      glowColor: "bg-[#A855F7]/15"
    },
    {
      label: "CHANNELS CONNECTED",
      value: analytics ? `${analytics.connected_channels < 10 ? '0' : ''}${analytics.connected_channels}` : "04",
      icon: Radio,
      color: "text-[#C084FC]",
      bg: "bg-[#8B5CF6]/15",
      border: "border-[#8B5CF6]/30 hover:border-[#A855F7]/60 shadow-[#8B5CF6]/10",
      cardGrad: "from-[#8B5CF6]/20 via-[#140E30]/80 to-[#07050E]/95",
      trend: "TG • Email • Slack",
      sparkline: "M0 10 Q 25 6, 50 10 T 75 6 T 90 4",
      glowColor: "bg-[#8B5CF6]/15"
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      {metrics.map((m, idx) => {
        const Icon = m.icon;
        return (
          <div
            key={idx}
            className={`p-4 rounded-3xl bg-gradient-to-b ${m.cardGrad} backdrop-blur-2xl border ${m.border} flex flex-col justify-between transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl relative overflow-hidden group cursor-pointer`}
          >
            {/* Luminous glow on hover */}
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 ${m.glowColor} rounded-full blur-2xl group-hover:scale-150 transition-transform pointer-events-none`} />

            <div className="flex items-center justify-between relative z-10">
              <span className="text-[10px] font-bold tracking-wider text-[#C4B5FD] uppercase font-heading">
                {m.label}
              </span>
              <div className={`p-1.5 rounded-xl ${m.bg} border border-white/10`}>
                <Icon className={`h-3.5 w-3.5 ${m.color}`} />
              </div>
            </div>

            <div className="mt-3 flex items-end justify-between relative z-10">
              <div>
                <div className="text-2xl font-black tracking-tight text-white font-mono">
                  {m.value}
                </div>
                <div className="text-[10px] font-medium text-[#C4B5FD]/70 mt-0.5 flex items-center space-x-0.5">
                  <span>{m.trend}</span>
                </div>
              </div>

              {/* Sparkline */}
              <div className="w-16 h-6 opacity-80 group-hover:opacity-100 transition-opacity">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 90 20">
                  <path
                    d={m.sparkline}
                    fill="none"
                    stroke="currentColor"
                    className={`${m.color} transition-all duration-500`}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
