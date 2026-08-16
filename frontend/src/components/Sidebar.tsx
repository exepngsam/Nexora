import React from "react";
import {
  Shield,
  Activity,
  GitPullRequest,
  Users,
  Radio,
  BookOpen,
  History,
  BarChart3,
  FileCheck,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
  Zap,
  Globe,
  Layers
} from "lucide-react";

export type NavTab =
  | "command_center"
  | "live_incidents"
  | "agent_plan"
  | "response_graph"
  | "approval_center"
  | "people_identity"
  | "channels_health"
  | "playbooks_builder"
  | "memory_history"
  | "analytics"
  | "audit_log";

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  pendingApprovalsCount?: number;
  activeIncidentsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  pendingApprovalsCount = 0,
  activeIncidentsCount = 0
}) => {
  const navItems = [
    { id: "command_center", label: "Incident Command", icon: Shield, badge: activeIncidentsCount > 0 ? "LIVE" : null, badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/30 animate-pulse" },
    { id: "live_incidents", label: "Live Telemetry", icon: Activity, badge: null },
    { id: "agent_plan", label: "AI Reasoner & Plan", icon: Sparkles, badge: "AUTONOMOUS", badgeColor: "bg-[#8B5CF6]/20 text-[#C084FC] border-[#8B5CF6]/30" },
    { id: "response_graph", label: "Caspian Mesh Graph", icon: Layers, badge: null },
    { id: "approval_center", label: "Human Safety Gates", icon: GitPullRequest, badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : null, badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30 animate-bounce" },
    { id: "people_identity", label: "On-Call Directory", icon: Users, badge: "4 ACTIVE", badgeColor: "bg-[#8B5CF6]/20 text-[#C084FC] border-[#8B5CF6]/30" },
    { id: "channels_health", label: "Caspian Channels", icon: Radio, badge: "4/4 OK", badgeColor: "bg-[#8B5CF6]/20 text-[#C084FC] border-[#8B5CF6]/30" },
    { id: "playbooks_builder", label: "Playbook Synthesizer", icon: BookOpen, badge: null },
    { id: "memory_history", label: "Vector DB Memory", icon: History, badge: null },
    { id: "analytics", label: "Analytics & MTTA", icon: BarChart3, badge: null },
    { id: "audit_log", label: "Audit Ledger", icon: FileCheck, badge: null }
  ];

  return (
    <aside
      className={`h-screen sticky top-0 bg-[#07050E]/95 backdrop-blur-2xl border-r border-[#8B5CF6]/20 flex flex-col justify-between transition-all duration-300 ease-in-out z-30 shrink-0 select-none ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Brand Header & Animated Toggle */}
      <div>
        <div className="h-16 flex items-center justify-between px-3.5 border-b border-[#8B5CF6]/20">
          <div 
            className="flex items-center space-x-3 overflow-hidden cursor-pointer group" 
            onClick={() => setActiveTab("command_center")}
          >
            <div className="h-10 w-10 shrink-0 rounded-2xl bg-gradient-to-br from-[#A855F7] via-[#6366F1] to-[#07050E] p-0.5 shadow-lg shadow-[#8B5CF6]/30 group-hover:scale-105 transition-transform flex items-center justify-center border border-[#C084FC]/40 glow-signal">
              <div className="h-full w-full bg-[#0D091A]/90 rounded-2xl flex items-center justify-center">
                <Shield className="h-5 w-5 text-[#C084FC]" />
              </div>
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <div className="flex items-center space-x-1.5">
                  <span className="text-base font-black tracking-wider text-white font-heading">NEXORA</span>
                  <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-[#8B5CF6]/20 text-[#C084FC] border border-[#8B5CF6]/30 font-heading shadow-sm">
                    SRE
                  </span>
                </div>
                <p className="text-[10px] text-[#C4B5FD] font-mono truncate">Autonomous Core</p>
              </div>
            )}
          </div>

          {/* Cyber Animated Toggle Switch */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`p-2 rounded-xl border transition-all duration-300 cursor-pointer flex items-center justify-center ${
              collapsed
                ? "bg-[#8B5CF6]/15 border-[#8B5CF6]/40 text-[#C084FC] hover:bg-[#8B5CF6]/25 glow-signal"
                : "bg-[#0D091A]/90 border-[#8B5CF6]/20 text-[#C4B5FD] hover:text-white hover:border-[#8B5CF6]/40 hover:bg-[#1E143E]"
            }`}
            title={collapsed ? "Expand Sidebar (Ctrl+B)" : "Collapse Sidebar (Ctrl+B)"}
          >
            {collapsed ? (
              <PanelLeftOpen className="h-4 w-4 transform transition-transform duration-300 hover:scale-110 text-[#C084FC]" />
            ) : (
              <PanelLeftClose className="h-4 w-4 transform transition-transform duration-300 hover:scale-110 text-[#C084FC]" />
            )}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1.5 overflow-y-auto custom-scroll max-h-[calc(100vh-145px)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as NavTab)}
                className={`w-full relative flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 cursor-pointer group ${
                  isActive
                    ? "bg-gradient-to-r from-[#8B5CF6]/25 via-[#6366F1]/15 to-transparent text-white border border-[#A855F7]/40 shadow-lg shadow-[#8B5CF6]/15 font-bold"
                    : "text-[#C4B5FD] hover:text-white hover:bg-[#1E143E]/60 border border-transparent"
                }`}
                title={collapsed ? item.label : undefined}
              >
                {/* Active Indicator Bar */}
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-gradient-to-b from-[#A855F7] via-[#8B5CF6] to-[#6366F1] shadow-sm shadow-[#8B5CF6]/50" />
                )}

                <div className="flex items-center space-x-3 truncate">
                  <Icon className={`h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? "text-[#C084FC]" : "text-[#C4B5FD] group-hover:text-white"
                  }`} />
                  {!collapsed && (
                    <span className="truncate font-heading tracking-wide text-left">
                      {item.label}
                    </span>
                  )}
                </div>

                {!collapsed && item.badge !== null && (
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border shrink-0 ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-[#8B5CF6]/20">
        {!collapsed ? (
          <div className="p-2.5 rounded-2xl bg-[#0D091A]/90 border border-[#8B5CF6]/25 flex items-center justify-between shadow-inner">
            <div className="flex items-center space-x-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A855F7] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8B5CF6]"></span>
              </span>
              <span className="text-[10px] font-bold text-slate-200 font-mono">Featherless + Caspian</span>
            </div>
            <span className="text-[10px] font-mono text-[#C084FC] font-bold">READY</span>
          </div>
        ) : (
          <div className="flex justify-center py-1">
            <span className="h-2.5 w-2.5 rounded-full bg-[#A855F7] animate-pulse" title="Connected & Ready" />
          </div>
        )}
      </div>
    </aside>
  );
};
