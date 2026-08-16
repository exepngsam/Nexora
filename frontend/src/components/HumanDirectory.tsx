import React, { useState } from "react";
import {
  Users,
  Send,
  Mail,
  MessageSquare,
  PhoneCall,
  ShieldCheck,
  CheckCircle2,
  Award,
  Zap,
  Radio,
  Bell,
  Clock,
  Globe,
  Activity,
  Layers,
  Sparkles,
  Phone,
  MessageCircle,
  Calendar,
  ExternalLink
} from "lucide-react";
import { Responder } from "../types";

interface HumanDirectoryProps {
  responders: Responder[];
}

interface EnhancedResponder extends Responder {
  avatar: string;
  timezone: string;
  shiftHours: string;
  historicalMTTA: string;
  domainExpertise: string[];
  onCallStatus: "primary" | "secondary" | "standby" | "off_shift";
  scoreBreakdown?: {
    ownership: number;
    availability: number;
    mtta: number;
    overall: number;
  };
}

export const HumanDirectory: React.FC<HumanDirectoryProps> = ({ responders }) => {
  const [pingedUser, setPingedUser] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<"all" | "on_call" | "payments" | "platform">("all");
  const [selectedResponder, setSelectedResponder] = useState<EnhancedResponder | null>(null);

  // Fallback enriched roster (ensures page is never blank)
  const defaultResponders: EnhancedResponder[] = [
    {
      id: "usr_alex",
      name: "Alex Vance",
      role: "Lead On-Call SRE",
      team: "Payments & Edge Infrastructure",
      availability: "online",
      preferred_channel: "telegram",
      response_rate: 94,
      avatar: "AV",
      timezone: "Asia/Kolkata (IST)",
      shiftHours: "08:00 - 20:00 IST (Active Shift)",
      historicalMTTA: "3.2 mins",
      domainExpertise: ["Payment Checkout API", "Envoy Ingress", "Razorpay Webhooks", "504 Gateway Triage"],
      onCallStatus: "primary",
      scoreBreakdown: {
        ownership: 95,
        availability: 98,
        mtta: 90,
        overall: 94
      },
      identities: {
        telegram: "@alexvance",
        email: "alex.vance@nexora.ai",
        slack: "@alex-vance (Payments Lead)",
        whatsapp: "+91 98401 22910"
      }
    },
    {
      id: "usr_priya",
      name: "Priya Sharma",
      role: "Senior Platform SRE",
      team: "Tier-2 Autonomous Escalation",
      availability: "online",
      preferred_channel: "email",
      response_rate: 98,
      avatar: "PS",
      timezone: "UTC / IST",
      shiftHours: "24/7 Escalation Failover SLA",
      historicalMTTA: "42 seconds",
      domainExpertise: ["Production Rollback Authority", "Postgres Aurora Saturation", "Canary Verification", "Disaster Recovery"],
      onCallStatus: "secondary",
      scoreBreakdown: {
        ownership: 92,
        availability: 100,
        mtta: 98,
        overall: 96
      },
      identities: {
        telegram: "@priyasharma_sre",
        email: "priya.sharma@nexora.ai",
        slack: "@priya (Senior SRE)",
        whatsapp: "+91 98402 88419"
      }
    },
    {
      id: "usr_rahul",
      name: "Rahul Nair",
      role: "Database Architect",
      team: "Persistence & Kafka Streams",
      availability: "online",
      preferred_channel: "slack",
      response_rate: 91,
      avatar: "RN",
      timezone: "Asia/Kolkata (IST)",
      shiftHours: "10:00 - 22:00 IST (Standby)",
      historicalMTTA: "1.8 mins",
      domainExpertise: ["Postgres Connection Pooling", "Kafka Topic Lag", "Redis Cluster Locks", "CDC Streaming"],
      onCallStatus: "standby",
      scoreBreakdown: {
        ownership: 90,
        availability: 88,
        mtta: 94,
        overall: 91
      },
      identities: {
        telegram: "@rahulnair_db",
        email: "rahul.nair@nexora.ai",
        slack: "#war-room-p0 (Database Lead)",
        whatsapp: "+91 98403 77124"
      }
    },
    {
      id: "usr_marcus",
      name: "Marcus Chen",
      role: "Staff Reliability Engineer",
      team: "Core Infrastructure & CDN",
      availability: "online",
      preferred_channel: "telegram",
      response_rate: 96,
      avatar: "MC",
      timezone: "America/New_York (EST)",
      shiftHours: "08:00 - 20:00 EST (On-Call US)",
      historicalMTTA: "2.1 mins",
      domainExpertise: ["Cloudflare WAF", "Kubernetes Ingress", "Envoy Edge Proxy", "BGP Anycast Routing"],
      onCallStatus: "standby",
      scoreBreakdown: {
        ownership: 94,
        availability: 96,
        mtta: 92,
        overall: 94
      },
      identities: {
        telegram: "@marcuschen_infra",
        email: "marcus.chen@nexora.ai",
        slack: "@marcus (Infra Lead)",
        whatsapp: "+1 (555) 482-1920"
      }
    },
    {
      id: "usr_admin",
      name: "Elena Rostova",
      role: "Chief Reliability Officer",
      team: "Executive Incident Command",
      availability: "online",
      preferred_channel: "whatsapp",
      response_rate: 99,
      avatar: "CRO",
      timezone: "Europe/London (GMT)",
      shiftHours: "Executive Incident Escalation (P0)",
      historicalMTTA: "1.2 mins",
      domainExpertise: ["Executive Sign-off", "Public Communication", "Multi-Region Failover", "RCA Persist"],
      onCallStatus: "secondary",
      scoreBreakdown: {
        ownership: 98,
        availability: 99,
        mtta: 96,
        overall: 98
      },
      identities: {
        telegram: "@elena_cro",
        email: "admin@nexora.ai",
        slack: "#exec-incident-room",
        whatsapp: "+44 7700 900481"
      }
    }
  ];

  // Merge with any backend responder data
  const roster: EnhancedResponder[] = defaultResponders.map((def) => {
    const match = responders.find((r) => r.id === def.id || r.name.toLowerCase() === def.name.toLowerCase());
    if (match) {
      return {
        ...def,
        role: match.role || def.role,
        team: match.team || def.team,
        availability: match.availability || def.availability,
        preferred_channel: match.preferred_channel || def.preferred_channel,
        response_rate: match.response_rate || def.response_rate,
        identities: { ...def.identities, ...match.identities }
      };
    }
    return def;
  });

  // Filter roster
  const filteredRoster = roster.filter((r) => {
    if (activeFilter === "on_call") return r.onCallStatus === "primary" || r.onCallStatus === "secondary";
    if (activeFilter === "payments") return r.team.toLowerCase().includes("payment");
    if (activeFilter === "platform") return r.team.toLowerCase().includes("platform") || r.team.toLowerCase().includes("tier-2");
    return true;
  });

  const handlePing = (user: EnhancedResponder) => {
    setPingedUser(user.id);
    setTimeout(() => setPingedUser(null), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. TOP HEADER BANNER */}
      <div className="p-6 rounded-3xl glass-panel border border-[#8B5CF6]/30 shadow-2xl relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-64 bg-gradient-to-bl from-purple-500/15 via-cyan-500/10 to-transparent blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 rounded-2xl bg-purple-500/15 border border-purple-500/40 text-purple-300 shadow-lg shadow-purple-500/20">
              <Users className="h-7 w-7 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <h2 className="text-xl sm:text-2xl font-black text-white font-heading tracking-tight">
                  UNIFIED HUMAN IDENTITY MATRIX
                </h2>
                <span className="text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider font-heading bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center space-x-1.5 shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>5 SRE RESPONDERS ONLINE</span>
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                NEXORA maintains single persistent human identities mapped across diverse Caspian endpoints (Telegram, Priority Email, Slack, WhatsApp).
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs font-mono">
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-white/10 text-slate-300">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Identity Sync: <strong className="text-emerald-400">100% Verified</strong></span>
            </div>
            <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-white/10 text-slate-400 text-[11px]">
              <Radio className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
              <span>Zero-Loss Endpoint Reach</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. STATS & COVERAGE RIBBON (4 CARDS) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        {/* Total Roster */}
        <div className="p-4 rounded-2xl glass-panel border border-[#8B5CF6]/30 relative overflow-hidden group hover:border-purple-500/50 transition-all">
          <span className="text-[10px] font-bold text-[#C4B5FD] uppercase tracking-wider font-heading block">
            MAPPED SRE IDENTITIES
          </span>
          <div className="text-2xl sm:text-3xl font-black text-white mt-1 font-mono">
            {roster.length} Engineers
          </div>
          <div className="w-full h-1.5 bg-slate-950 rounded-full mt-2.5 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full w-[100%]" />
          </div>
        </div>

        {/* On-Call Coverage */}
        <div className="p-4 rounded-2xl glass-panel border border-emerald-500/30 relative overflow-hidden group hover:border-emerald-500/50 transition-all">
          <span className="text-[10px] font-bold text-[#C4B5FD] uppercase tracking-wider font-heading block">
            ON-CALL COVERAGE
          </span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1 font-mono">
            24 / 7 Active
          </div>
          <div className="w-full h-1.5 bg-slate-950 rounded-full mt-2.5 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full w-[100%]" />
          </div>
        </div>

        {/* Avg Team MTTA */}
        <div className="p-4 rounded-2xl glass-panel border border-cyan-500/30 relative overflow-hidden group hover:border-cyan-500/50 transition-all">
          <span className="text-[10px] font-bold text-[#C4B5FD] uppercase tracking-wider font-heading block">
            AVG HISTORICAL MTTA
          </span>
          <div className="text-2xl sm:text-3xl font-black text-cyan-400 mt-1 font-mono">
            21.4 Seconds
          </div>
          <div className="w-full h-1.5 bg-slate-950 rounded-full mt-2.5 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-500 to-indigo-400 rounded-full w-[35%]" />
          </div>
        </div>

        {/* Multi-Channel Reach */}
        <div className="p-4 rounded-2xl glass-panel border border-[#8B5CF6]/30 relative overflow-hidden group hover:border-[#8B5CF6]/50 transition-all">
          <span className="text-[10px] font-bold text-[#C084FC] uppercase tracking-wider font-heading block">
            ACTIVE CASPIAN CHANNELS
          </span>
          <div className="text-2xl sm:text-3xl font-black text-[#C084FC] mt-1 font-mono">
            4 Endpoints/User
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Telegram • Email • Slack • WhatsApp</div>
        </div>

      </div>

      {/* 3. ROSTER FILTER TABS */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center space-x-2">
          {[
            { id: "all", label: "ALL SRE RESPONDERS (5)" },
            { id: "on_call", label: "PRIMARY & SECONDARY ON-CALL (2)" },
            { id: "payments", label: "PAYMENTS & EDGE SQUAD" },
            { id: "platform", label: "TIER-2 PLATFORM SRE" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all font-heading ${
                activeFilter === tab.id
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                  : "bg-slate-900/70 text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-[11px] font-mono text-slate-400 hidden sm:block">
          Showing {filteredRoster.length} of {roster.length} Engineers
        </span>
      </div>

      {/* 4. GRID OF RESPONDER IDENTITY CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredRoster.map((r) => {
          const isPinged = pingedUser === r.id;
          const isPrimary = r.onCallStatus === "primary";
          const isSecondary = r.onCallStatus === "secondary";

          return (
            <div
              key={r.id}
              className={`p-6 rounded-3xl glass-panel border space-y-4 hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden ${
                isPrimary
                  ? "border-cyan-500/40 bg-gradient-to-br from-cyan-950/20 via-[#0D091A]/90 to-[#07050E]"
                  : isSecondary
                  ? "border-purple-500/40 bg-gradient-to-br from-purple-950/20 via-[#0D091A]/90 to-[#07050E]"
                  : "border-white/10"
              }`}
            >
              <div>
                {/* Profile Header */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center space-x-3.5">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-500 via-indigo-600 to-cyan-500 p-0.5 shadow-lg shadow-purple-500/20 flex items-center justify-center">
                      <div className="h-full w-full bg-slate-950 rounded-2xl flex items-center justify-center text-white font-black text-sm font-heading">
                        {r.avatar}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center space-x-2 font-heading">
                        <span>{r.name}</span>
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
                      </h3>
                      <p className="text-xs text-slate-300 mt-0.5 font-medium">
                        {r.role} • <span className="text-slate-400">{r.team}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider font-heading ${
                      isPrimary
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse"
                        : isSecondary
                        ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                        : "bg-slate-800 text-slate-400"
                    }`}>
                      {isPrimary ? "PRIMARY ON-CALL" : isSecondary ? "SECONDARY SRE" : "STANDBY"}
                    </span>
                    <div className="text-xs font-mono font-bold text-emerald-400 mt-1">
                      {r.response_rate}% Reliability
                    </div>
                  </div>
                </div>

                {/* Shift & Timezone Bar */}
                <div className="mt-3 p-2.5 rounded-xl bg-slate-950/60 border border-white/5 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 gap-2">
                  <div className="flex items-center space-x-1.5">
                    <Clock className="h-3.5 w-3.5 text-cyan-400" />
                    <span>{r.shiftHours}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-slate-300">
                    <Globe className="h-3.5 w-3.5 text-purple-400" />
                    <span>{r.timezone}</span>
                  </div>
                </div>

                {/* Multi-Factor AI Scoring Breakdown */}
                {r.scoreBreakdown && (
                  <div className="grid grid-cols-4 gap-2 mt-3 text-xs font-mono text-center">
                    <div className="p-2 rounded-xl bg-slate-950/80 border border-white/5">
                      <span className="text-[8px] text-slate-500 block uppercase">Ownership</span>
                      <span className="font-black text-cyan-300">{r.scoreBreakdown.ownership}%</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-950/80 border border-white/5">
                      <span className="text-[8px] text-slate-500 block uppercase">Availability</span>
                      <span className="font-black text-emerald-400">{r.scoreBreakdown.availability}%</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-950/80 border border-white/5">
                      <span className="text-[8px] text-slate-500 block uppercase">MTTA Speed</span>
                      <span className="font-black text-purple-300">{r.historicalMTTA}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-950/80 border border-white/5">
                      <span className="text-[8px] text-slate-500 block uppercase">AI Score</span>
                      <span className="font-black text-amber-300">{r.scoreBreakdown.overall}/100</span>
                    </div>
                  </div>
                )}

                {/* Mapped Caspian Communication Endpoints */}
                <div className="mt-4 space-y-2">
                  <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider block font-heading">
                    MAPPED CASPIAN COMMUNICATION ENDPOINTS
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                    {r.identities.telegram && (
                      <div className="p-2.5 rounded-xl bg-slate-950/80 border border-white/5 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Send className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                          <span className="text-slate-300 truncate">{r.identities.telegram}</span>
                        </div>
                        {r.preferred_channel === "telegram" && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-bold">PRIMARY</span>
                        )}
                      </div>
                    )}

                    {r.identities.email && (
                      <div className="p-2.5 rounded-xl bg-slate-950/80 border border-white/5 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                          <span className="text-slate-300 truncate">{r.identities.email}</span>
                        </div>
                        {r.preferred_channel === "email" && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-bold">PRIMARY</span>
                        )}
                      </div>
                    )}

                    {r.identities.slack && (
                      <div className="p-2.5 rounded-xl bg-slate-950/80 border border-white/5 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <MessageSquare className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                          <span className="text-slate-300 truncate">{r.identities.slack}</span>
                        </div>
                        {r.preferred_channel === "slack" && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-bold">PRIMARY</span>
                        )}
                      </div>
                    )}

                    {r.identities.whatsapp && (
                      <div className="p-2.5 rounded-xl bg-slate-950/80 border border-white/5 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <MessageCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                          <span className="text-slate-300 truncate">{r.identities.whatsapp}</span>
                        </div>
                        {r.preferred_channel === "whatsapp" && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">PRIMARY</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Domain Expertise Badges */}
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  {r.domainExpertise.map((exp, idx) => (
                    <span
                      key={idx}
                      className="text-[9px] font-mono px-2 py-0.5 rounded-lg bg-slate-900 text-slate-300 border border-white/5"
                    >
                      {exp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Footer */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-white/10">
                <div className="flex items-center space-x-2">
                  <span>Routing: <strong className="text-white capitalize font-mono">{r.preferred_channel}</strong></span>
                  <span>•</span>
                  <span className="text-emerald-400 font-semibold flex items-center space-x-1 font-mono">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Reachable</span>
                  </span>
                </div>

                <button
                  onClick={() => handlePing(r)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer font-heading flex items-center space-x-1.5 ${
                    isPinged
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg shadow-emerald-500/20"
                      : "bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10 hover:text-white"
                  }`}
                >
                  <Bell className={`h-3.5 w-3.5 ${isPinged ? "animate-spin text-emerald-400" : "text-cyan-400"}`} />
                  <span>{isPinged ? "Ping Sent via Caspian!" : "Test Dispatch"}</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
