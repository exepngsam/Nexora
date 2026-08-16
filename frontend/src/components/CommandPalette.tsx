import React, { useState, useEffect } from "react";
import { Search, Zap, Flame, Cpu, Radio, CheckSquare, Brain, FileSpreadsheet, RefreshCw, X, Play, Pause } from "lucide-react";
import { NavTab } from "./Sidebar";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: NavTab) => void;
  onSimulate: () => void;
  onReset: () => void;
  onPauseAgent: () => void;
  onResumeAgent: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  onSimulate,
  onReset,
  onPauseAgent,
  onResumeAgent
}) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery("");
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const commands = [
    { id: "sim_p0", label: "Simulate P0 Payment API Outage", category: "Actions", icon: Zap, action: onSimulate },
    { id: "view_command", label: "Open Command Center Overview", category: "Navigation", icon: Flame, action: () => onSelectTab("command_center") },
    { id: "view_incidents", label: "View Live Incidents (3-Column Layout)", category: "Navigation", icon: Flame, action: () => onSelectTab("live_incidents") },
    { id: "view_plan", label: "Inspect Agent Plan & Execution Steps", category: "Agent", icon: Cpu, action: () => onSelectTab("agent_plan") },
    { id: "view_graph", label: "Open NEXORA Response Graph", category: "Topology", icon: Radio, action: () => onSelectTab("response_graph") },
    { id: "view_approvals", label: "Open Approval Center", category: "Safety", icon: CheckSquare, action: () => onSelectTab("approval_center") },
    { id: "view_memory", label: "Search Long-Term Incident Memory", category: "Intelligence", icon: Brain, action: () => onSelectTab("memory_history") },
    { id: "view_audit", label: "Inspect Audit Ledger", category: "Security", icon: FileSpreadsheet, action: () => onSelectTab("audit_log") },
    { id: "pause_agent", label: "Pause NEXORA Autonomous Loop", category: "Controls", icon: Pause, action: onPauseAgent },
    { id: "resume_agent", label: "Resume NEXORA Autonomous Loop", category: "Controls", icon: Play, action: onResumeAgent },
    { id: "reset_demo", label: "Clean Demo Reset", category: "System", icon: RefreshCw, action: onReset },
  ];

  const filtered = commands.filter(c =>
    c.label.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl rounded-2xl glass-panel border border-cyan-500/30 shadow-2xl shadow-cyan-500/15 overflow-hidden">
        
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/10 bg-slate-950/80">
          <Search className="h-4 w-4 text-cyan-400 mr-3 shrink-0" />
          <input
            type="text"
            placeholder="Type a command or search (e.g., 'simulate', 'plan', 'approval')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
          />
          <kbd className="text-[10px] font-mono font-bold bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-white/10">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="p-2 max-h-80 overflow-y-auto space-y-1 text-xs">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-slate-500">No matching commands found.</div>
          ) : (
            filtered.map((cmd) => {
              const Icon = cmd.icon;
              return (
                <div
                  key={cmd.id}
                  onClick={() => {
                    cmd.action();
                    onClose();
                  }}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-cyan-500/15 hover:text-cyan-300 text-slate-300 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="h-4 w-4 text-slate-400 group-hover:text-cyan-400" />
                    <span className="font-medium text-white">{cmd.label}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                    {cmd.category}
                  </span>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};
