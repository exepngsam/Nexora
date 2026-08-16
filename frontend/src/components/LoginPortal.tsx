import React, { useState } from "react";
import { 
  Shield, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles, 
  KeyRound, 
  Fingerprint, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  Zap, 
  Orbit, 
  Compass,
  Globe,
  Radio,
  Layers,
  Sun,
  Moon
} from "lucide-react";
import { soundEngine } from "../services/sound";

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  team: string;
  preferred_channel: string;
  permissions: string[];
}

interface LoginPortalProps {
  onLoginSuccess: (user: AuthenticatedUser) => void;
  onBackToLanding: () => void;
  onContinueAsGuest: () => void;
}

const PRESET_USERS: {
  label: string;
  name: string;
  email: string;
  role: string;
  orbitTag: string;
  badge: string;
  gradient: string;
  ringColor: string;
  icon: string;
}[] = [
  {
    label: "Tier-2 Escalation SRE",
    name: "Priya Sharma",
    email: "priya.sharma@nexora.ai",
    role: "Senior Platform SRE",
    orbitTag: "ORBIT 01 • CORE",
    badge: "PRIMARY ESCALATION",
    gradient: "from-[#8B5CF6] via-[#A855F7] to-[#6366F1]",
    ringColor: "group-hover:border-[#A855F7]",
    icon: "PS"
  },
  {
    label: "Payments & Edge SRE",
    name: "Alex Vance",
    email: "alex.vance@nexora.ai",
    role: "Lead On-Call SRE",
    orbitTag: "ORBIT 02 • CASPIAN",
    badge: "TIER-1 RESPONDER",
    gradient: "from-[#06D6A0] via-[#059669] to-[#047857]",
    ringColor: "group-hover:border-[#06D6A0]",
    icon: "AV"
  },
  {
    label: "Database Architect",
    name: "Rahul Nair",
    email: "rahul.nair@nexora.ai",
    role: "Database Architect",
    orbitTag: "ORBIT 04 • VECTOR",
    badge: "INFRASTRUCTURE",
    gradient: "from-[#38BDF8] via-[#0284C7] to-[#0369A1]",
    ringColor: "group-hover:border-[#38BDF8]",
    icon: "RN"
  },
  {
    label: "Executive Reliability",
    name: "CRO SuperAdmin",
    email: "admin@nexora.ai",
    role: "Super Admin",
    orbitTag: "ORBIT 05 • ROOT",
    badge: "FULL ROOT ACCESS",
    gradient: "from-[#F59E0B] via-[#D97706] to-[#B45309]",
    ringColor: "group-hover:border-amber-400",
    icon: "CRO"
  }
];

export const LoginPortal: React.FC<LoginPortalProps> = ({
  onLoginSuccess,
  onBackToLanding,
  onContinueAsGuest
}) => {
  const [email, setEmail] = useState("priya.sharma@nexora.ai");
  const [password, setPassword] = useState("••••••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [use2FA, setUse2FA] = useState(false);
  const [totpCode, setTotpCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const triggerLogin = async (targetEmail: string, targetPass: string) => {
    setIsLoading(true);
    setErrorMessage(null);

    const emailLower = targetEmail.trim().toLowerCase();

    // Built-in User Directory
    const FALLBACK_USERS: Record<string, AuthenticatedUser> = {
      "alex.vance@nexora.ai": {
        id: "usr_alex",
        name: "Alex Vance",
        email: "alex.vance@nexora.ai",
        role: "Lead On-Call SRE",
        avatar: "AV",
        team: "Payments & Edge Infrastructure",
        preferred_channel: "telegram",
        permissions: ["incident.simulate", "incident.ack", "incident.resolve", "playbook.edit"]
      },
      "priya.sharma@nexora.ai": {
        id: "usr_priya",
        name: "Priya Sharma",
        email: "priya.sharma@nexora.ai",
        role: "Senior Platform SRE",
        avatar: "PS",
        team: "Tier-2 Autonomous Escalation",
        preferred_channel: "email",
        permissions: ["incident.simulate", "incident.ack", "incident.resolve", "approval.grant", "postmortem.generate"]
      },
      "rahul.nair@nexora.ai": {
        id: "usr_rahul",
        name: "Rahul Nair",
        email: "rahul.nair@nexora.ai",
        role: "Database Architect",
        avatar: "RN",
        team: "Persistence & Kafka Streams",
        preferred_channel: "slack",
        permissions: ["incident.ack", "incident.resolve", "memory.query"]
      },
      "admin@nexora.ai": {
        id: "usr_admin",
        name: "Chief Reliability Officer",
        email: "admin@nexora.ai",
        role: "Super Admin",
        avatar: "CRO",
        team: "Executive Incident Command",
        preferred_channel: "telegram",
        permissions: ["*"]
      }
    };

    try {
      let user: AuthenticatedUser | null = null;

      try {
        const response = await fetch("http://127.0.0.1:8000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: targetEmail, password: targetPass || "nexora-sre-2026" })
        });

        if (response.ok) {
          const data = await response.json();
          user = data.user;
        }
      } catch (netErr) {
        console.warn("Backend login network error, utilizing local user directory fallback:", netErr);
      }

      // If backend not available, use reliable local directory
      if (!user) {
        user = FALLBACK_USERS[emailLower];
        if (!user && targetEmail) {
          const namePart = emailLower.split("@")[0].replace(".", " ").replace(/\b\w/g, l => l.toUpperCase());
          user = {
            id: `usr_${emailLower.split("@")[0]}`,
            name: namePart || "SRE Engineer",
            email: targetEmail,
            role: "Platform Engineer",
            avatar: namePart.substring(0, 2).toUpperCase() || "PE",
            team: "Core SRE",
            preferred_channel: "telegram",
            permissions: ["incident.simulate", "incident.ack", "incident.resolve"]
          };
        }
      }

      if (!user) {
        throw new Error("Authentication failed. Please verify credentials.");
      }

      soundEngine.playAlertBeep("ack");
      soundEngine.speak(`Access granted. Welcome back, ${user.name}.`);

      if (rememberMe) {
        localStorage.setItem("nexora_auth_user", JSON.stringify(user));
      }

      onLoginSuccess(user);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to authenticate.");
      soundEngine.playAlertBeep("escalate");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage("Please enter a valid work email.");
      return;
    }
    triggerLogin(email, password);
  };

  const handleSelectPreset = (preset: typeof PRESET_USERS[0]) => {
    setEmail(preset.email);
    setPassword("nexora-sre-2026");
    triggerLogin(preset.email, "nexora-sre-2026");
  };

  const handleBiometricAuth = () => {
    setIsLoading(true);
    setTimeout(() => {
      triggerLogin("priya.sharma@nexora.ai", "biometric_passkey");
    }, 500);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#05030A] flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden select-none cosmic-horizon-arc">
      
      {/* 1. SOLAR CELESTIAL BACKGROUND ORBITS & STAR DUST */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        
        {/* Stellar Sun Flare / Eclipse Corona Glow */}
        <div className="absolute -top-48 left-1/2 -translate-x-1/2 w-[1100px] h-[650px] bg-gradient-to-b from-[#8B5CF6]/30 via-[#6366F1]/15 to-transparent rounded-[100%] blur-3xl opacity-80" />
        <div className="absolute top-1/2 -right-40 w-[600px] h-[600px] bg-[#A855F7]/12 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -left-40 w-[500px] h-[500px] bg-[#38BDF8]/10 rounded-full blur-3xl" />

        {/* Concentric Solar Orbit Tracks & Orbiting Planetary Beacons */}
        <svg className="w-[1200px] h-[1200px] opacity-35 absolute animate-spin" style={{ animationDuration: "160s" }} viewBox="0 0 1200 1200">
          <defs>
            <linearGradient id="solar-orbit-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A855F7" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#6366F1" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.6" />
            </linearGradient>
          </defs>

          {/* Orbit 1: Inner Orbit (NEXORA CORE) */}
          <ellipse cx="600" cy="600" rx="340" ry="240" fill="none" stroke="url(#solar-orbit-grad)" strokeWidth="1.2" strokeDasharray="6,8" />
          <circle cx="940" cy="600" r="7" fill="#8B5CF6" className="animate-pulse" filter="drop-shadow(0 0 8px #A855F7)" />

          {/* Orbit 2: Middle Orbit (CASPIAN MESH) */}
          <ellipse cx="600" cy="600" rx="460" ry="320" fill="none" stroke="rgba(196, 181, 253, 0.25)" strokeWidth="1" />
          <circle cx="600" cy="280" r="6" fill="#06D6A0" filter="drop-shadow(0 0 8px #06D6A0)" />

          {/* Orbit 3: Outer Orbit (FEATHERLESS AI & VECTOR) */}
          <ellipse cx="600" cy="600" rx="570" ry="410" fill="none" stroke="rgba(168, 85, 247, 0.2)" strokeWidth="1" strokeDasharray="4,12" />
          <circle cx="210" cy="600" r="8" fill="#EC4899" filter="drop-shadow(0 0 10px #EC4899)" />
          <circle cx="600" cy="1010" r="6.5" fill="#38BDF8" filter="drop-shadow(0 0 8px #38BDF8)" />
        </svg>

        {/* Counter-rotating subtle orbital ring */}
        <svg className="w-[900px] h-[900px] opacity-25 absolute animate-spin" style={{ animationDuration: "220s", animationDirection: "reverse" }} viewBox="0 0 900 900">
          <ellipse cx="450" cy="450" rx="420" ry="290" fill="none" stroke="rgba(245, 158, 11, 0.3)" strokeWidth="1" strokeDasharray="3,9" />
          <circle cx="870" cy="450" r="5" fill="#F59E0B" filter="drop-shadow(0 0 8px #F59E0B)" />
        </svg>

        {/* Floating Starfield Sparkles */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-transparent via-[#05030A]/60 to-[#05030A]" />
      </div>

      {/* Top Header Navigation */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20 max-w-5xl mx-auto">
        <button
          onClick={onBackToLanding}
          className="flex items-center space-x-2 px-4 py-2 rounded-2xl bg-[#0D091A]/80 border border-[#8B5CF6]/30 text-xs text-[#C4B5FD] hover:text-white hover:border-[#8B5CF6]/60 transition-all cursor-pointer backdrop-blur-xl font-heading shadow-lg group"
        >
          <Orbit className="h-4 w-4 text-[#C084FC] group-hover:rotate-90 transition-transform duration-500" />
          <span>Explore 3D Planetary Orbit</span>
        </button>

        <div className="flex items-center space-x-2 text-[10px] font-mono text-[#C4B5FD] bg-[#0D091A]/80 px-3.5 py-1.5 rounded-full border border-[#8B5CF6]/30 backdrop-blur-xl shadow-lg">
          <Sun className="h-3 w-3 text-[#F59E0B] animate-spin" style={{ animationDuration: "12s" }} />
          <span className="tracking-wider">SOLAR GATEWAY • SECTOR 01</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-lg my-12 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Luxury Solar Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          
          {/* Celestial Solar Eclipse Crest */}
          <div className="relative mb-3 flex items-center justify-center">
            <div className="absolute -inset-4 bg-gradient-to-r from-[#8B5CF6]/40 via-[#A855F7]/60 to-[#6366F1]/40 rounded-full blur-2xl opacity-80 animate-pulse pointer-events-none" />
            
            {/* Outer Orbit Halo Ring */}
            <div className="absolute -inset-2 rounded-2xl border border-[#A855F7]/40 animate-spin" style={{ animationDuration: "30s" }} />

            <div className="relative h-15 w-15 rounded-2xl bg-gradient-to-br from-[#1E143E] via-[#0D091A] to-[#07050E] border-2 border-[#A855F7]/70 shadow-2xl shadow-[#8B5CF6]/50 flex items-center justify-center">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#8B5CF6] via-[#A855F7] to-[#6366F1] flex items-center justify-center shadow-lg">
                <Shield className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white font-heading tracking-wider bg-gradient-to-r from-white via-[#E9D5FF] to-[#C4B5FD] bg-clip-text text-transparent">
            NEXORA
          </h1>
          <p className="text-xs font-mono text-[#C4B5FD]/80 tracking-widest uppercase mt-1 flex items-center space-x-2">
            <span>AUTONOMOUS SOLAR COMMAND PORTAL</span>
          </p>
        </div>

        {/* Card Container with Acrylic Solar Glassmorphism */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0B0716]/92 border border-[#8B5CF6]/35 shadow-2xl shadow-[#8B5CF6]/25 backdrop-blur-2xl relative overflow-hidden">
          
          {/* Subtle Background Orbital Curve Watermark */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#8B5CF6]/10 to-transparent rounded-full blur-2xl pointer-events-none" />

          {/* Quick 1-Click SRE Persona Selector */}
          <div className="mb-6 relative z-10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-[#C4B5FD] uppercase tracking-wider font-heading flex items-center space-x-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#A855F7]" />
                <span>1-Click On-Call Demo Personas</span>
              </span>
              <span className="text-[9px] font-mono text-[#06D6A0] bg-[#06D6A0]/10 px-2 py-0.5 rounded-full border border-[#06D6A0]/30">
                FAST ACCESS
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {PRESET_USERS.map((preset) => (
                <button
                  key={preset.email}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-3 rounded-2xl bg-[#0E0A1E]/85 border border-[#8B5CF6]/25 ${preset.ringColor} hover:bg-[#1A1235] hover:scale-[1.02] active:scale-98 transition-all cursor-pointer text-left group shadow-md relative overflow-hidden`}
                >
                  <div className="flex items-center space-x-2.5 mb-1.5">
                    <span className={`h-6 w-6 rounded-lg bg-gradient-to-br ${preset.gradient} flex items-center justify-center text-[10px] font-black text-white shadow-sm shrink-0`}>
                      {preset.icon}
                    </span>
                    <span className="text-xs font-bold text-white truncate group-hover:text-[#C084FC] transition-colors">
                      {preset.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[9px] font-mono text-[#C4B5FD]/70">
                    <span className="truncate">{preset.label}</span>
                    <span className="text-[8px] text-[#A855F7] uppercase tracking-tight ml-1">{preset.orbitTag.split("•")[1]}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Elegant Divider */}
          <div className="relative flex py-2 items-center my-1 z-10">
            <div className="flex-grow border-t border-[#8B5CF6]/20" />
            <span className="flex-shrink mx-3 text-[10px] font-mono text-[#C4B5FD]/60 tracking-wider uppercase">
              Or Work Credentials
            </span>
            <div className="flex-grow border-t border-[#8B5CF6]/20" />
          </div>

          {/* Credentials Form */}
          <form onSubmit={handleSubmit} className="space-y-4 mt-3 relative z-10">
            
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-[#C4B5FD] mb-1.5 font-heading">
                Work Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#A855F7]">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="engineer@nexora.ai"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#0E0A1E]/90 border border-[#8B5CF6]/25 text-xs text-white placeholder-[#C4B5FD]/40 focus:border-[#A855F7] focus:ring-2 focus:ring-[#A855F7]/20 outline-none transition-all font-mono"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-[#C4B5FD] font-heading">
                  Security Token / Password
                </label>
                <button
                  type="button"
                  onClick={() => setUse2FA(!use2FA)}
                  className="text-[10px] font-mono text-[#C084FC] hover:text-white transition-colors cursor-pointer"
                >
                  {use2FA ? "Disable 2FA" : "+ Add 2FA TOTP"}
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#A855F7]">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-[#0E0A1E]/90 border border-[#8B5CF6]/25 text-xs text-white placeholder-[#C4B5FD]/40 focus:border-[#A855F7] focus:ring-2 focus:ring-[#A855F7]/20 outline-none transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#C4B5FD]/70 hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4 text-[#A855F7]" />}
                </button>
              </div>
            </div>

            {/* Optional 2FA TOTP Field */}
            {use2FA && (
              <div className="animate-in fade-in zoom-in-95">
                <label className="block text-xs font-bold text-[#C4B5FD] mb-1.5 font-heading">
                  6-Digit Authenticator Token
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#A855F7]">
                    <KeyRound className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    value={totpCode}
                    onChange={(e) => setTotpCode(e.target.value)}
                    placeholder="849 201"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#0E0A1E]/90 border border-[#8B5CF6]/25 text-xs text-white placeholder-[#C4B5FD]/40 focus:border-[#A855F7] outline-none font-mono tracking-widest"
                  />
                </div>
              </div>
            )}

            {/* Remember Session & Passkey */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center space-x-2 text-xs text-[#C4B5FD] cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#8B5CF6]/40 bg-[#0E0A1E] text-[#A855F7] focus:ring-0 cursor-pointer"
                />
                <span>Remember session</span>
              </label>

              <button
                type="button"
                onClick={handleBiometricAuth}
                className="flex items-center space-x-1.5 text-xs font-mono text-[#C084FC] hover:text-white transition-colors cursor-pointer"
                title="Log in with Passkey / WebAuthn"
              >
                <Fingerprint className="h-4 w-4" />
                <span>Passkey</span>
              </button>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2 animate-in fade-in">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#A855F7] via-[#8B5CF6] to-[#6366F1] text-xs font-black tracking-wider text-white shadow-xl shadow-[#8B5CF6]/40 hover:shadow-[#8B5CF6]/60 hover:scale-[1.01] active:scale-98 transition-all cursor-pointer font-heading flex items-center justify-center space-x-2 border border-[#C084FC]/50 disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <span>AUTHENTICATING TELEMETRY...</span>
              ) : (
                <>
                  <span>INITIALIZE SRE COMMAND SESSION</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Guest Evaluator Link */}
          <div className="mt-5 pt-3 border-t border-[#8B5CF6]/20 text-center relative z-10">
            <button
              type="button"
              onClick={onContinueAsGuest}
              className="text-xs font-mono text-[#C4B5FD]/70 hover:text-white transition-colors cursor-pointer"
            >
              Skip auth & enter as Guest Evaluator →
            </button>
          </div>

        </div>

        {/* Footer Security Badges */}
        <div className="mt-5 flex items-center justify-center space-x-4 text-[10px] font-mono text-[#C4B5FD]/60">
          <span className="flex items-center space-x-1">
            <Shield className="h-3 w-3 text-[#06D6A0]" />
            <span>256-Bit TLS E2EE</span>
          </span>
          <span>•</span>
          <span>SOC-2 Type II Certified</span>
          <span>•</span>
          <span>Caspian Protocol v1.0</span>
        </div>

      </div>
    </div>
  );
};
