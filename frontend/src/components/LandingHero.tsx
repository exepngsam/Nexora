import React from "react";
import { Shield, ArrowRight, Play, Cpu, Send, Mail, MessageSquare, CheckCircle, Zap, Users, Lock, Sparkles, Brain, Radio, Layers } from "lucide-react";
import { NexoraCore3D } from "./NexoraCore3D";

interface LandingHeroProps {
  onLaunch: () => void;
  onOpenDemo: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onLaunch, onOpenDemo }) => {
  return (
    <div className="relative min-h-[92vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-16 overflow-hidden select-none cosmic-horizon-arc">
      
      {/* Background celestial cosmic glows */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-gradient-to-b from-[#8B5CF6]/30 via-[#6366F1]/15 to-transparent rounded-[100%] blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] bg-[#A855F7]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -left-40 w-[550px] h-[550px] bg-[#6366F1]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Pill Badge */}
      <div className="inline-flex items-center space-x-2.5 rounded-full bg-[#8B5CF6]/15 px-5 py-2 border border-[#8B5CF6]/40 text-xs font-bold text-[#C084FC] shadow-xl shadow-[#8B5CF6]/20 mb-6 font-heading relative z-10 glow-signal">
        <Zap className="h-4 w-4 text-[#A855F7] animate-pulse" />
        <span>FEATHERLESS OPEN-SOURCE AI + CASPIAN AGENT RUNTIME</span>
      </div>

      {/* 3D Interactive Polyhedron Core in Hero */}
      <div className="relative z-10 flex flex-col items-center my-2 group">
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-[#8B5CF6]/30 via-[#A855F7]/40 to-[#6366F1]/30 rounded-full blur-2xl opacity-75 group-hover:opacity-100 transition-opacity pointer-events-none" />
          <NexoraCore3D size={200} interactive={true} />
        </div>
        <span className="text-[10px] font-mono text-[#C084FC] bg-[#0D091A]/90 px-3 py-1 rounded-full border border-[#8B5CF6]/30 mt-1 shadow-sm">
          [INTERACTIVE 3D AGENT CORE • DRAG / HOVER TO ROTATE]
        </span>
      </div>

      {/* Hero Headline */}
      <div className="text-center max-w-5xl mx-auto space-y-4 relative z-10 mt-4">
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white font-heading">
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-[#E0E7FF] to-[#C4B5FD]">
            ONE AGENT.
          </span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#C084FC] via-[#A855F7] to-[#6366F1]">
            EVERY HUMAN.
          </span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-fuchsia-400 to-pink-500">
            ZERO DELAY.
          </span>
        </h1>
        
        <p className="text-base sm:text-xl text-[#C4B5FD] max-w-3xl mx-auto pt-2 font-normal leading-relaxed">
          The autonomous incident orchestration platform that connects machine telemetry to multi-channel human action across Telegram, Email, and Slack.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 relative z-10">
        <button
          onClick={onLaunch}
          className="flex items-center space-x-3 rounded-2xl bg-gradient-to-r from-[#A855F7] via-[#8B5CF6] to-[#6366F1] px-8 py-4 text-sm font-black text-white shadow-2xl shadow-[#8B5CF6]/40 hover:shadow-[#8B5CF6]/60 hover:scale-105 active:scale-95 transition-all cursor-pointer font-heading border border-[#C084FC]/40"
        >
          <span>LAUNCH COMMAND CENTER</span>
          <ArrowRight className="h-4 w-4" />
        </button>

        <button
          onClick={onOpenDemo}
          className="flex items-center space-x-3 rounded-2xl bg-[#0D091A]/90 px-7 py-4 text-sm font-bold text-[#C4B5FD] border border-[#8B5CF6]/30 hover:bg-[#1E143E] hover:text-white hover:border-[#A855F7]/60 transition-all cursor-pointer font-heading shadow-lg"
        >
          <Play className="h-4 w-4 fill-[#C084FC] text-[#C084FC]" />
          <span>INTERACTIVE 90s DEMO SCRIPT</span>
        </button>
      </div>

      {/* Hero Architecture 3D Holographic Graphic */}
      <div className="w-full max-w-5xl mt-16 p-8 rounded-3xl glass-panel-cosmic relative border border-[#8B5CF6]/30 shadow-2xl">
        <div className="text-center text-xs font-black uppercase tracking-widest text-[#C084FC] mb-8 font-heading flex items-center justify-center space-x-2">
          <Sparkles className="h-4 w-4 text-[#A855F7]" />
          <span>THE NEXORA AUTONOMOUS SRE COORDINATION PIPELINE</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 items-stretch">
          {/* Step 1: Detect */}
          <div className="flex flex-col items-center text-center p-5 rounded-2xl bg-[#0D091A]/80 border border-[#8B5CF6]/20 hover:border-rose-500/40 hover:shadow-lg hover:shadow-rose-500/10 transition-all">
            <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 mb-3">
              <Cpu className="h-6 w-6" />
            </div>
            <h4 className="text-xs font-bold text-white mb-1 font-heading">1. Featherless AI Brain</h4>
            <p className="text-[11px] text-[#C4B5FD]/80 leading-relaxed">Classifies P0 severity in 3s with DeepSeek-V3.2 open-source reasoning.</p>
          </div>

          {/* Step 2: Caspian Reach */}
          <div className="flex flex-col items-center text-center p-5 rounded-2xl bg-[#0D091A]/80 border border-[#8B5CF6]/40 shadow-xl shadow-[#8B5CF6]/15 glow-signal">
            <div className="p-3.5 rounded-2xl bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 text-[#C084FC] mb-3">
              <Shield className="h-6 w-6" />
            </div>
            <h4 className="text-xs font-bold text-white mb-1 font-heading">2. Caspian Multi-Channel</h4>
            <p className="text-[11px] text-[#C4B5FD] leading-relaxed">Unified human reach across Telegram, Email, and Slack in parallel.</p>
          </div>

          {/* Step 3: Auto Escalate */}
          <div className="flex flex-col items-center text-center p-5 rounded-2xl bg-[#0D091A]/80 border border-[#8B5CF6]/20 hover:border-[#A855F7]/40 hover:shadow-lg hover:shadow-[#8B5CF6]/15 transition-all">
            <div className="p-3.5 rounded-2xl bg-[#A855F7]/15 border border-[#A855F7]/30 text-[#C084FC] mb-3">
              <Users className="h-6 w-6" />
            </div>
            <h4 className="text-xs font-bold text-white mb-1 font-heading">3. Autonomous Escalation</h4>
            <p className="text-[11px] text-[#C4B5FD]/80 leading-relaxed">10s ACK SLA countdown auto-escalates to Tier-2 SRE without human delay.</p>
          </div>

          {/* Step 4: Resolve & Learn */}
          <div className="flex flex-col items-center text-center p-5 rounded-2xl bg-[#0D091A]/80 border border-[#8B5CF6]/20 hover:border-[#38BDF8]/40 hover:shadow-lg hover:shadow-[#38BDF8]/15 transition-all">
            <div className="p-3.5 rounded-2xl bg-[#38BDF8]/15 border border-[#38BDF8]/30 text-[#38BDF8] mb-3">
              <CheckCircle className="h-6 w-6" />
            </div>
            <h4 className="text-xs font-bold text-white mb-1 font-heading">4. Gated Safety & Synthesis</h4>
            <p className="text-[11px] text-[#C4B5FD]/80 leading-relaxed">Zero-trust human rollback authorization + automatic AI postmortems.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
