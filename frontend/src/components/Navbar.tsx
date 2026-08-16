import React, { useState, useRef, useEffect } from "react";
import { 
  Shield, 
  RefreshCw, 
  Play, 
  Brain, 
  Search, 
  Palette, 
  Check, 
  Terminal, 
  Volume2, 
  VolumeX, 
  Flame, 
  User, 
  LogOut, 
  Lock,
  ChevronDown
} from "lucide-react";
import { AuthenticatedUser } from "./LoginPortal";

export type ThemeOption = "cosmic" | "emerald" | "amber" | "ruby";

interface NavbarProps {
  onOpenSimulator: () => void;
  onOpenDemoGuide: () => void;
  onResetDemo: () => void;
  onShowLanding: () => void;
  onOpenCommandPalette: () => void;
  onOpenDiagnostics: () => void;
  onOpenTerminal: () => void;
  onOpenLogin: () => void;
  onLogout: () => void;
  currentUser: AuthenticatedUser | null;
  isSoundMuted: boolean;
  onToggleSound: () => void;
  isSimulating: boolean;
  caspianMode: string;
  theme: ThemeOption;
  onThemeChange: (theme: ThemeOption) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSimulator,
  onOpenDemoGuide,
  onResetDemo,
  onShowLanding,
  onOpenCommandPalette,
  onOpenDiagnostics,
  onOpenTerminal,
  onOpenLogin,
  onLogout,
  currentUser,
  isSoundMuted,
  onToggleSound,
  isSimulating,
  theme,
  onThemeChange,
}) => {
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const themeMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const themeList: { id: ThemeOption; label: string; dot: string; border: string; glow: string }[] = [
    { id: "cosmic", label: "Cosmic Ultraviolet 🌌", dot: "bg-[#A855F7]", border: "border-[#A855F7]/40", glow: "shadow-[#A855F7]/30" },
    { id: "emerald", label: "Matrix Emerald 🌿", dot: "bg-[#06D6A0]", border: "border-[#06D6A0]/40", glow: "shadow-[#06D6A0]/20" },
    { id: "amber", label: "Solar Flare 🔥", dot: "bg-amber-400", border: "border-amber-500/40", glow: "shadow-amber-500/20" },
    { id: "ruby", label: "Cyber Ruby 🌸", dot: "bg-rose-400", border: "border-rose-500/40", glow: "shadow-rose-500/20" },
  ];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(e.target as Node)) {
        setIsThemeOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#8B5CF6]/20 bg-[#07050E]/95 backdrop-blur-2xl">
      <div className="w-full px-4 sm:px-6 flex h-14 items-center justify-between gap-2 max-w-[1600px] mx-auto">
        
        {/* Left: Brand Identity */}
        <div className="flex items-center space-x-2.5 cursor-pointer group shrink-0" onClick={onShowLanding}>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#A855F7] via-[#6366F1] to-[#07050E] shadow-md shadow-[#8B5CF6]/30 p-0.5 group-hover:scale-105 transition-transform border border-[#C084FC]/40 glow-signal">
            <div className="h-full w-full bg-[#0D091A]/90 rounded-xl flex items-center justify-center">
              <Shield className="h-4 w-4 text-[#C084FC]" />
            </div>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="text-base font-black tracking-wider text-white font-heading">NEXORA</span>
            <span className="hidden sm:inline-block text-[9px] font-black px-1.5 py-0.2 rounded-full bg-[#8B5CF6]/15 text-[#C084FC] border border-[#8B5CF6]/30 font-heading whitespace-nowrap">
              AUTONOMOUS SRE
            </span>
          </div>
        </div>

        {/* Center: Clean Quick Search Bar */}
        <div className="hidden md:flex flex-1 max-w-xs mx-2">
          <button
            onClick={onOpenCommandPalette}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl bg-[#0D091A]/80 border border-[#8B5CF6]/25 text-xs text-[#C4B5FD] hover:text-white hover:border-[#A855F7]/50 transition-all cursor-pointer font-heading"
            title="Open Command Palette (Ctrl+K)"
          >
            <div className="flex items-center space-x-2 truncate">
              <Search className="h-3.5 w-3.5 text-[#A855F7] shrink-0" />
              <span className="truncate text-xs">Search SRE commands...</span>
            </div>
            <kbd className="text-[9px] font-mono bg-[#1E143E]/80 text-[#C084FC] px-1.5 py-0.2 rounded border border-[#8B5CF6]/30 shrink-0 ml-1.5">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Right: Consolidated Controls (Never Overflowing) */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
          
          {/* Integrated Status & AI Model Pill */}
          <button
            onClick={onOpenDiagnostics}
            className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-[#0D091A]/90 border border-[#8B5CF6]/30 text-xs hover:border-[#A855F7]/60 transition-all cursor-pointer whitespace-nowrap"
            title="Featherless AI Engine & Health Diagnostics"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A855F7] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8B5CF6]"></span>
            </span>
            <span className="text-[10px] font-black text-[#C084FC] font-heading">ONLINE</span>
            <span className="text-[#C4B5FD]/40">•</span>
            <span className="font-mono text-[11px] font-semibold text-white">DeepSeek-V3.2</span>
          </button>

          {/* Quick Utility Icon Group */}
          <div className="flex items-center bg-[#0D091A]/90 p-0.5 rounded-xl border border-[#8B5CF6]/25 space-x-0.5 shadow-sm">
            
            {/* Terminal Button */}
            <button
              onClick={onOpenTerminal}
              className="p-1.5 rounded-lg text-[#C4B5FD] hover:text-white hover:bg-[#1E143E] transition-colors cursor-pointer"
              title="Autonomous SRE CLI Console (Ctrl+`)"
            >
              <Terminal className="h-3.5 w-3.5 text-[#C084FC]" />
            </button>

            {/* Sound Toggle Button */}
            <button
              onClick={onToggleSound}
              className="p-1.5 rounded-lg text-[#C4B5FD] hover:text-white hover:bg-[#1E143E] transition-colors cursor-pointer"
              title={isSoundMuted ? "Audio Muted (Click to Unmute)" : "Audio ON (Voice alerts & sound chimes)"}
            >
              {!isSoundMuted ? <Volume2 className="h-3.5 w-3.5 text-[#C084FC]" /> : <VolumeX className="h-3.5 w-3.5 text-rose-400" />}
            </button>

            {/* Color Theme Dropdown */}
            <div className="relative" ref={themeMenuRef}>
              <button
                onClick={() => setIsThemeOpen(!isThemeOpen)}
                className="p-1.5 rounded-lg text-[#C4B5FD] hover:text-white hover:bg-[#1E143E] transition-colors cursor-pointer"
                title="Select Theme Color"
              >
                <Palette className="h-3.5 w-3.5 text-[#C084FC]" />
              </button>

              {/* Theme Dropdown Menu */}
              {isThemeOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-[#0D091A]/98 border border-[#8B5CF6]/40 p-1.5 shadow-2xl backdrop-blur-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2.5 py-1.5 text-[10px] font-bold text-[#C4B5FD] uppercase tracking-wider font-heading border-b border-[#8B5CF6]/20">
                    Select Theme Palette
                  </div>
                  <div className="mt-1 space-y-0.5">
                    {themeList.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          onThemeChange(t.id);
                          setIsThemeOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                          theme === t.id
                            ? "bg-[#8B5CF6]/25 text-white font-bold border border-[#8B5CF6]/40 shadow-sm"
                            : "text-[#C4B5FD] hover:bg-[#1E143E] hover:text-white"
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span className={`h-2.5 w-2.5 rounded-full ${t.dot} shadow-sm ${t.glow}`} />
                          <span>{t.label}</span>
                        </div>
                        {theme === t.id && <Check className="h-3.5 w-3.5 text-[#C084FC]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* 90s Demo Walkthrough */}
          <button
            onClick={onOpenDemoGuide}
            className="hidden sm:flex items-center space-x-1.5 rounded-xl bg-[#8B5CF6]/15 px-2.5 py-1.5 text-xs font-bold text-[#C084FC] border border-[#8B5CF6]/30 hover:bg-[#8B5CF6]/25 transition-all font-heading cursor-pointer whitespace-nowrap"
          >
            <Play className="h-3 w-3 fill-[#C084FC] text-[#C084FC] shrink-0" />
            <span>90s Demo</span>
          </button>

          {/* Simulate Incident Button */}
          <button
            onClick={onOpenSimulator}
            disabled={isSimulating}
            className="flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-rose-600 via-fuchsia-600 to-violet-700 px-3 py-1.5 text-xs font-black text-white shadow-lg shadow-fuchsia-600/30 hover:shadow-fuchsia-600/50 hover:brightness-110 active:scale-95 transition-all cursor-pointer font-heading whitespace-nowrap border border-fuchsia-400/30"
          >
            <Flame className="h-3.5 w-3.5 animate-pulse shrink-0 text-white" />
            <span>{isSimulating ? "Simulating..." : "Simulate Outage"}</span>
          </button>

          {/* User Auth Profile Dropdown */}
          {currentUser ? (
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-1.5 p-1 rounded-xl bg-[#0D091A]/90 border border-[#8B5CF6]/30 hover:border-[#A855F7]/60 transition-all cursor-pointer shadow-sm group"
                title={`User: ${currentUser.name} (${currentUser.role})`}
              >
                <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-[#8B5CF6] to-[#6366F1] flex items-center justify-center text-[10px] font-black text-white shadow-sm group-hover:scale-105 transition-transform">
                  {currentUser.avatar || "U"}
                </div>
                <ChevronDown className="h-3 w-3 text-[#C4B5FD] mr-0.5" />
              </button>

              {/* Profile Card Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0D091A]/98 border border-[#8B5CF6]/40 p-3 shadow-2xl backdrop-blur-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center space-x-2.5 pb-2.5 border-b border-[#8B5CF6]/20 mb-2">
                    <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#6366F1] flex items-center justify-center text-xs font-black text-white shadow-md">
                      {currentUser.avatar || "U"}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate font-heading">
                        {currentUser.name}
                      </div>
                      <div className="text-[10px] text-[#C084FC] font-mono truncate">
                        {currentUser.role}
                      </div>
                    </div>
                  </div>

                  <div className="text-[10px] font-mono text-[#C4B5FD]/70 space-y-1 mb-2.5">
                    <div>Team: <span className="text-white">{currentUser.team}</span></div>
                    <div>Channel: <span className="text-[#38BDF8] uppercase font-bold">{currentUser.preferred_channel}</span></div>
                  </div>

                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center justify-center space-x-2 py-1.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:bg-rose-500/25 text-xs font-bold font-heading transition-all cursor-pointer"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="flex items-center space-x-1.5 rounded-xl bg-[#8B5CF6]/20 px-2.5 py-1.5 text-xs font-bold text-[#C084FC] border border-[#8B5CF6]/40 hover:bg-[#8B5CF6]/30 transition-all font-heading cursor-pointer whitespace-nowrap shadow-sm"
              title="Authenticate SRE Session"
            >
              <Lock className="h-3 w-3 text-[#C084FC]" />
              <span>Login</span>
            </button>
          )}

          {/* Reset Demo State */}
          <button
            onClick={onResetDemo}
            title="Reset Incident State"
            className="rounded-xl p-1.5 text-[#C4B5FD] hover:text-white hover:bg-[#1E143E] transition-colors cursor-pointer shrink-0"
          >
            <RefreshCw className="h-4 w-4" />
          </button>

        </div>
      </div>
    </header>
  );
};
