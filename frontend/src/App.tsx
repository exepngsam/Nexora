import React, { useState, useEffect, useRef } from "react";
import { Navbar } from "./components/Navbar";
import { Sidebar, NavTab } from "./components/Sidebar";
import { LandingHero } from "./components/LandingHero";
import { SolarSystem3DLanding } from "./components/SolarSystem3DLanding";
import { MetricStrip } from "./components/MetricStrip";
import { ActiveIncidentCard } from "./components/ActiveIncidentCard";
import { ResponseGraph } from "./components/ResponseGraph";
import { AgentActivityFeed } from "./components/AgentActivityFeed";
import { AIDecisionPanel } from "./components/AIDecisionPanel";
import { IncidentTimeline } from "./components/IncidentTimeline";
import { HumanApprovalModal } from "./components/HumanApprovalModal";
import { PostmortemModal } from "./components/PostmortemModal";
import { SimulatorDrawer } from "./components/SimulatorDrawer";
import { AnalyticsView } from "./components/AnalyticsView";
import { HumanDirectory } from "./components/HumanDirectory";
import { DemoWalkthroughModal } from "./components/DemoWalkthroughModal";
import { CommandPalette } from "./components/CommandPalette";
import { AgentPlanView } from "./components/AgentPlanView";
import { ApprovalCenter } from "./components/ApprovalCenter";
import { PlaybooksView, PlaybookItem } from "./components/PlaybooksView";
import { MemoryView } from "./components/MemoryView";
import { AuditLogView } from "./components/AuditLogView";
import { ChannelsHealthView } from "./components/ChannelsHealthView";
import { SystemDiagnosticsModal } from "./components/SystemDiagnosticsModal";
import { LiveIncidentsView } from "./components/LiveIncidentsView";
import { ToastContainer, ToastMessage } from "./components/ToastContainer";
import { LiveTelemetryTicker } from "./components/LiveTelemetryTicker";
import { CommandTerminalDrawer } from "./components/CommandTerminalDrawer";
import { ThreeCanvasBackground } from "./components/ThreeCanvasBackground";
import { LoginPortal, AuthenticatedUser } from "./components/LoginPortal";
import { soundEngine } from "./services/sound";

import {
  fetchIncidents,
  fetchIncidentDetail,
  fetchAnalytics,
  fetchResponders,
  fetchChannels,
  simulateIncident,
  acknowledgeIncident,
  respondToApproval,
  resolveIncident,
  API_BASE,
  WS_BASE
} from "./services/api";

import { Incident, IncidentEvent, AnalyticsData, Responder, Approval, ChannelStatus } from "./types";
import { ThemeOption } from "./components/Navbar";

export function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(() => {
    try {
      const saved = localStorage.getItem("nexora_auth_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [activeTab, setActiveTab] = useState<NavTab>("command_center");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState<ThemeOption>(() => (localStorage.getItem("nexora_theme") as ThemeOption) || "cosmic");
  const [isSoundMuted, setIsSoundMuted] = useState(() => soundEngine.getIsMuted());

  const handleToggleSound = () => {
    const muted = soundEngine.toggleMute();
    setIsSoundMuted(muted);
    addToast({
      type: "info",
      title: muted ? "Sound Alerts Muted" : "Sound Alerts Active",
      message: muted ? "Audio feedback disabled." : "Voice broadcasts & frequency chimes enabled."
    });
  };

  const handleThemeChange = (newTheme: ThemeOption) => {
    setTheme(newTheme);
    localStorage.setItem("nexora_theme", newTheme);
    const themeNames: Record<ThemeOption, string> = {
      cosmic: "Cosmic Ultraviolet 🌌",
      emerald: "Matrix Emerald 🌿",
      amber: "Sunset Amber 🔥",
      ruby: "Cyber Ruby 🌸"
    };
    addToast({
      type: "info",
      title: "Theme Updated",
      message: `Switched color palette to ${themeNames[newTheme]}`
    });
  };

  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [currentIncident, setCurrentIncident] = useState<Incident | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [responders, setResponders] = useState<Responder[]>([]);
  const [channels, setChannels] = useState<ChannelStatus[]>([]);
  const [approvalsList, setApprovalsList] = useState<Approval[]>([]);
  const [playbooks, setPlaybooks] = useState<PlaybookItem[]>([]);
  const [events, setEvents] = useState<IncidentEvent[]>([]);
  const [countdown, setCountdown] = useState<number>(0);
  const [activeChannelSignal, setActiveChannelSignal] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Toast Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (toast: Omit<ToastMessage, "id">) => {
    const id = "t_" + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, toast.duration || 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Modals & Drawers
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [isPostmortemModalOpen, setIsPostmortemModalOpen] = useState(false);
  const [isDemoGuideOpen, setIsDemoGuideOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [activeApproval, setActiveApproval] = useState<Approval | null>(null);

  const wsRef = useRef<WebSocket | null>(null);

  // Global Keyboard Shortcuts (Ctrl+` for Terminal, Ctrl+K for Palette)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "`") {
        e.preventDefault();
        setIsTerminalOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Load initial data
  const loadInitialData = async () => {
    try {
      const [incList, stats, respList, chList] = await Promise.all([
        fetchIncidents(),
        fetchAnalytics(),
        fetchResponders(),
        fetchChannels()
      ]);
      setIncidents(incList);
      setAnalytics(stats);
      setResponders(respList);
      setChannels(chList);

      // Load playbooks & approvals
      try {
        const pbRes = await fetch(`${API_BASE}/playbooks`);
        if (pbRes.ok) setPlaybooks(await pbRes.json());

        const appRes = await fetch(`${API_BASE}/approvals`);
        if (appRes.ok) setApprovalsList(await appRes.json());
      } catch (e) {
        console.error("Secondary fetch error", e);
      }

      if (incList.length > 0) {
        const detail = await fetchIncidentDetail(incList[0].id);
        setCurrentIncident(detail);
        if (detail.events) setEvents(detail.events);
        if (detail.approvals && detail.approvals.length > 0) {
          const pending = detail.approvals.find(a => a.status === "PENDING");
          if (pending) setActiveApproval(pending);
        }
      }
    } catch (err) {
      console.error("Failed to load initial data", err);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // WebSocket Connection
  useEffect(() => {
    let ws: WebSocket;
    let reconnectTimeout: any;

    const connectWS = () => {
      ws = new WebSocket(WS_BASE);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("[NEXORA WS] Connected to agent telemetry stream.");
      };

      ws.onmessage = async (event) => {
        try {
          const payload = JSON.parse(event.data);
          const { type, data } = payload;

          if (type === "timeline.event") {
            setEvents((prev) => [...prev, data]);
          } else if (type === "ack.countdown") {
            setCountdown(data.remaining_seconds);
          } else if (type === "message.sent") {
            setActiveChannelSignal(data.channel);
            setTimeout(() => setActiveChannelSignal(null), 3000);
            addToast({
              type: "info",
              title: `Caspian Dispatch: ${data.channel.toUpperCase()}`,
              message: `Alert dispatched to ${data.recipient || "Responder"}`
            });
          } else if (type === "escalation.level") {
            soundEngine.playAlertBeep("escalate");
            soundEngine.speak(`Escalating incident to Level ${data.level}. Re-routing to secondary responder ${data.new_owner}`);
            if (currentIncident) {
              setCurrentIncident((prev) => prev ? {
                ...prev,
                escalation_level: data.level,
                owner: data.new_owner,
                status: "ESCALATING"
              } : null);
            }
            addToast({
              type: "warning",
              title: `Autonomous Escalation: Level ${data.level}`,
              message: `10s SLA exceeded. Re-routed to backup responder ${data.new_owner}`
            });
          } else if (type === "ack.received") {
            soundEngine.playAlertBeep("ack");
            soundEngine.speak(`Human acknowledgment received from ${data.owner_name}`);
            setCountdown(0);
            setCurrentIncident((prev) => prev ? {
              ...prev,
              status: "RESPONDING",
              owner: data.owner_name,
              acknowledged_at: new Date().toISOString()
            } : null);
            addToast({
              type: "success",
              title: "Human ACK Received",
              message: `${data.owner_name} acknowledged via ${data.channel || "Caspian"}`
            });
          } else if (type === "approval.requested") {
            soundEngine.playAlertBeep("escalate");
            const newAppr: Approval = {
              id: data.approval_id,
              action_name: data.action_name,
              risk_level: data.risk_level,
              reason: data.reason,
              status: "PENDING",
              requested_at: new Date().toISOString()
            };
            setActiveApproval(newAppr);
            setApprovalsList((prev) => [newAppr, ...prev]);
            setIsApprovalModalOpen(true);
            addToast({
              type: "warning",
              title: "Safety Gate Triggered",
              message: `Approval requested: ${data.action_name}`
            });
          } else if (type === "approval.executed") {
            soundEngine.playAlertBeep("success");
            setCurrentIncident((prev) => prev ? {
              ...prev,
              error_rate: data.error_rate,
              latency: data.latency,
              status: "MITIGATING"
            } : null);
            if (activeApproval) {
              setActiveApproval((prev) => prev ? { ...prev, status: "APPROVED" } : null);
            }
            addToast({
              type: "success",
              title: "Rollback Executed",
              message: `Error rate stabilized to ${data.error_rate}%`
            });
          } else if (type === "incident.resolved") {
            soundEngine.playAlertBeep("success");
            soundEngine.speak("Incident resolved. All systems restored to baseline.");
            setCurrentIncident((prev) => prev ? {
              ...prev,
              status: "RESOLVED",
              resolved_at: new Date().toISOString(),
              error_rate: 0.1,
              latency: 0.12
            } : null);
            addToast({
              type: "success",
              title: "Incident Resolved",
              message: "Telemetry restored to nominal baseline."
            });
            const stats = await fetchAnalytics();
            setAnalytics(stats);
          }
        } catch (e) {
          console.error("WS message parse error", e);
        }
      };

      ws.onclose = () => {
        reconnectTimeout = setTimeout(connectWS, 3000);
      };
    };

    connectWS();

    return () => {
      if (ws) ws.close();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
    };
  }, [currentIncident]);

  // Handlers
  const handleRunSimulation = async (params: {
    service: string;
    region: string;
    error_rate: number;
    latency: number;
    affected_users: number;
    title: string;
  }) => {
    setIsSimulating(true);
    setEvents([]);
    soundEngine.playAlertBeep("critical");
    soundEngine.speak(`Warning. Critical P0 Outage detected on ${params.service}. Autonomous response initialized.`);
    try {
      addToast({
        type: "info",
        title: "Simulation Started",
        message: `Triggering P0 incident on ${params.service}...`
      });
      const res = await simulateIncident(params);
      if (res.incident_id) {
        const detail = await fetchIncidentDetail(res.incident_id);
        setCurrentIncident(detail);
        if (detail.events) setEvents(detail.events);
      }
      const updatedStats = await fetchAnalytics();
      setAnalytics(updatedStats);
      setActiveTab("command_center");
    } catch (err) {
      console.error("Simulation failed", err);
      addToast({
        type: "error",
        title: "Simulation Error",
        message: "Failed to trigger incident simulation."
      });
    } finally {
      setIsSimulating(false);
    }
  };

  const handleSimulateAck = async (channel = "email", userName = "Priya Sharma", text = "I'm responding. Looking into it now.") => {
    if (!currentIncident) return;
    try {
      await acknowledgeIncident(currentIncident.id, {
        user_id: userName.toLowerCase().includes("priya") ? "usr_priya" : "usr_alex",
        user_name: userName,
        channel: channel,
        message_text: text
      });
      const updated = await fetchIncidentDetail(currentIncident.id);
      setCurrentIncident(updated);
    } catch (err) {
      console.error("Acknowledge failed", err);
    }
  };

  const handleApprovalResponse = async (approvalId: string, approved: boolean) => {
    try {
      await respondToApproval(approvalId, approved, "Priya Sharma");
      if (currentIncident) {
        const updated = await fetchIncidentDetail(currentIncident.id);
        setCurrentIncident(updated);
      }
      const appRes = await fetch(`${API_BASE}/approvals`);
      if (appRes.ok) setApprovalsList(await appRes.json());
      addToast({
        type: approved ? "success" : "info",
        title: approved ? "Rollback Authorized" : "Rollback Rejected",
        message: approved ? "Deploying rollback build #480..." : "Action rejected by SRE lead."
      });
    } catch (err) {
      console.error("Approval action failed", err);
    }
  };

  const handleResolveIncident = async () => {
    if (!currentIncident) return;
    try {
      await resolveIncident(currentIncident.id, "Priya Sharma");
      const updated = await fetchIncidentDetail(currentIncident.id);
      setCurrentIncident(updated);
      setIsPostmortemModalOpen(true);
    } catch (err) {
      console.error("Resolution failed", err);
    }
  };

  const handleGeneratePlaybook = async (prompt: string, service: string) => {
    addToast({
      type: "info",
      title: "Synthesizing Playbook",
      message: `Querying Featherless AI for ${service}...`
    });
    const res = await fetch(`${API_BASE}/playbooks/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, service })
    });
    if (res.ok) {
      const pbListRes = await fetch(`${API_BASE}/playbooks`);
      if (pbListRes.ok) setPlaybooks(await pbListRes.json());
      addToast({
        type: "success",
        title: "Playbook Generated",
        message: "New playbook generated and stored in registry."
      });
    }
  };

  const handleAgentIntervene = async (action: "pause" | "resume") => {
    if (!currentIncident) return;
    await fetch(`${API_BASE}/agent/intervene/${currentIncident.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action })
    });
    const updated = await fetchIncidentDetail(currentIncident.id);
    setCurrentIncident(updated);
    addToast({
      type: "info",
      title: action === "pause" ? "Agent Paused" : "Agent Resumed",
      message: action === "pause" ? "Autonomous loop suspended." : "Autonomous loop executing."
    });
  };

  const handleResetDemo = async () => {
    setCountdown(0);
    setEvents([]);
    addToast({
      type: "info",
      title: "Demo Initialized",
      message: "Resetting P0 incident state to baseline..."
    });
    await handleRunSimulation({
      service: "Payment API",
      region: "India-East",
      error_rate: 42.0,
      latency: 8.7,
      affected_users: 18420,
      title: "Critical Payment Gateway 504 Degradation"
    });
  };

  const pendingApprovalsCount = approvalsList.filter(a => a.status === "PENDING").length;
  const activeIncidentsCount = incidents.filter(i => i.status !== "RESOLVED").length;

  return (
    <div className={`min-h-screen theme-${theme} text-white flex selection:bg-[#8B5CF6]/30 selection:text-white transition-colors duration-500 relative`}>
      
      {/* 1. If Login View is explicitly triggered */}
      {showLogin ? (
        <div className="w-full min-h-screen animate-in fade-in duration-300">
          <LoginPortal
            onLoginSuccess={(user) => {
              setCurrentUser(user);
              setShowLogin(false);
              setShowLanding(false);
              addToast({
                type: "success",
                title: "Authentication Successful",
                message: `Signed in as ${user.name} (${user.role})`
              });
            }}
            onBackToLanding={() => {
              setShowLogin(false);
              setShowLanding(true);
            }}
            onContinueAsGuest={() => {
              const guestUser: AuthenticatedUser = {
                id: "usr_guest",
                name: "Guest Evaluator",
                email: "evaluator@nexora.ai",
                role: "Evaluator / Demo Mode",
                avatar: "GE",
                team: "Guest SRE",
                preferred_channel: "telegram",
                permissions: ["incident.simulate", "incident.ack", "incident.resolve"]
              };
              setCurrentUser(guestUser);
              setShowLogin(false);
              setShowLanding(false);
            }}
          />
        </div>
      ) : showLanding ? (
        /* 2. DEFAULT STARTING SCREEN: 3D Solar System Planet Orbit Exploration */
        <div className="w-full min-h-screen animate-in fade-in duration-500">
          <SolarSystem3DLanding
            onLaunch={() => {
              setShowLanding(false);
              setShowLogin(false);
            }}
            onOpenDemo={() => setIsDemoGuideOpen(true)}
            onOpenLogin={() => setShowLogin(true)}
          />
        </div>
      ) : (
        /* 3. INCIDENT COMMAND CENTER DASHBOARD */
        <>
          {/* 3D Interactive WebGL Universe Background */}
          <ThreeCanvasBackground isSimulating={isSimulating} />

          {/* Collapsible Enterprise Sidebar */}
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            collapsed={sidebarCollapsed}
            setCollapsed={setSidebarCollapsed}
            pendingApprovalsCount={pendingApprovalsCount}
            activeIncidentsCount={activeIncidentsCount}
          />

          {/* Main App Container */}
          <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
            
            {/* Top Navbar */}
            <Navbar
              onOpenSimulator={() => setIsSimulatorOpen(true)}
              onOpenDemoGuide={() => setIsDemoGuideOpen(true)}
              onResetDemo={handleResetDemo}
              onShowLanding={() => setShowLanding(true)}
              onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
              onOpenDiagnostics={() => setIsDiagnosticsOpen(true)}
              onOpenTerminal={() => setIsTerminalOpen(true)}
              onOpenLogin={() => setShowLogin(true)}
              onLogout={() => {
                setCurrentUser(null);
                localStorage.removeItem("nexora_auth_user");
                addToast({
                  type: "info",
                  title: "Logged Out",
                  message: "You have signed out of your SRE session."
                });
              }}
              currentUser={currentUser}
              isSoundMuted={isSoundMuted}
              onToggleSound={handleToggleSound}
              isSimulating={isSimulating}
              caspianMode="mock"
              theme={theme}
              onThemeChange={handleThemeChange}
            />

            {/* Live Telemetry Stream Ticker */}
            <LiveTelemetryTicker
              isSimulating={isSimulating}
              activeErrorRate={currentIncident?.error_rate || 0}
            />

            {/* Dynamic Main Body with smooth transition */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 transition-all duration-300">
              {activeTab === "command_center" ? (
                /* Command Center View */
                <div className="space-y-6 animate-in fade-in duration-300">
                  <MetricStrip analytics={analytics} />

                  <ActiveIncidentCard
                    incident={currentIncident}
                    remainingCountdown={countdown}
                    onSimulateAck={() => handleSimulateAck("email", "Priya Sharma")}
                    onOpenApproval={() => setIsApprovalModalOpen(true)}
                    onResolve={handleResolveIncident}
                    onViewPostmortem={() => setIsPostmortemModalOpen(true)}
                    hasPendingApproval={activeApproval?.status === "PENDING"}
                  />

              <ResponseGraph
                incident={currentIncident}
                activeChannelSignal={activeChannelSignal}
              />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AIDecisionPanel
                  incident={currentIncident}
                  decisions={currentIncident?.decisions || []}
                />
                <AgentActivityFeed events={events} />
              </div>

              <IncidentTimeline events={events} />
            </div>
          ) : activeTab === "live_incidents" ? (
            <div className="animate-in fade-in duration-300">
              <LiveIncidentsView
                incident={currentIncident}
                events={events}
                onSimulateAck={() => handleSimulateAck("email", "Priya Sharma")}
                onOpenApproval={() => setIsApprovalModalOpen(true)}
                onResolve={handleResolveIncident}
                onViewPostmortem={() => setIsPostmortemModalOpen(true)}
                hasPendingApproval={activeApproval?.status === "PENDING"}
              />
            </div>
          ) : activeTab === "agent_plan" ? (
            <div className="animate-in fade-in duration-300">
              <AgentPlanView
                incident={currentIncident}
                onPause={() => handleAgentIntervene("pause")}
                onResume={() => handleAgentIntervene("resume")}
                onIntervene={() => setIsApprovalModalOpen(true)}
              />
            </div>
          ) : activeTab === "response_graph" ? (
            <div className="space-y-6 animate-in fade-in duration-300">
              <ResponseGraph
                incident={currentIncident}
                activeChannelSignal={activeChannelSignal}
              />
            </div>
          ) : activeTab === "approval_center" ? (
            <div className="animate-in fade-in duration-300">
              <ApprovalCenter
                approvals={approvalsList}
                onApprove={(id) => handleApprovalResponse(id, true)}
                onReject={(id) => handleApprovalResponse(id, false)}
              />
            </div>
          ) : activeTab === "people_identity" ? (
            <div className="animate-in fade-in duration-300">
              <HumanDirectory responders={responders} />
            </div>
          ) : activeTab === "channels_health" ? (
            <div className="animate-in fade-in duration-300">
              <ChannelsHealthView channels={channels} />
            </div>
          ) : activeTab === "playbooks_builder" ? (
            <div className="animate-in fade-in duration-300">
              <PlaybooksView
                playbooks={playbooks}
                onGeneratePlaybook={handleGeneratePlaybook}
              />
            </div>
          ) : activeTab === "memory_history" ? (
            <div className="animate-in fade-in duration-300">
              <MemoryView />
            </div>
          ) : activeTab === "analytics" ? (
            <div className="animate-in fade-in duration-300">
              <AnalyticsView analytics={analytics} />
            </div>
          ) : activeTab === "audit_log" ? (
            <div className="animate-in fade-in duration-300">
              <AuditLogView />
            </div>
          ) : null}

        </main>
      </div>
      </>
      )}

      {/* Global Toast Feedback */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Modals & Overlays */}
      <SimulatorDrawer
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        onRunSimulation={handleRunSimulation}
        onSimulateChannelResponse={handleSimulateAck}
        activeIncidentId={currentIncident?.id || null}
      />

      <CommandTerminalDrawer
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
        currentIncident={currentIncident}
        responders={responders}
        onTriggerSimulation={async (svc, err, lat, title) => {
          await handleRunSimulation({
            service: svc,
            region: "India-East",
            error_rate: err,
            latency: lat,
            affected_users: 15000,
            title
          });
        }}
        onAcknowledge={() => handleSimulateAck("email", "Priya Sharma")}
        onResolve={handleResolveIncident}
        onOpenApproval={() => setIsApprovalModalOpen(true)}
      />

      <HumanApprovalModal
        approval={activeApproval}
        isOpen={isApprovalModalOpen}
        onClose={() => setIsApprovalModalOpen(false)}
        onApprove={(id) => handleApprovalResponse(id, true)}
        onReject={(id) => handleApprovalResponse(id, false)}
      />

      <PostmortemModal
        postmortem={currentIncident?.postmortem || null}
        isOpen={isPostmortemModalOpen}
        onClose={() => setIsPostmortemModalOpen(false)}
      />

      <DemoWalkthroughModal
        isOpen={isDemoGuideOpen}
        onClose={() => setIsDemoGuideOpen(false)}
        onLaunchHeroDemo={handleResetDemo}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectTab={(t) => {
          setActiveTab(t);
          setShowLanding(false);
        }}
        onSimulate={() => {
          setIsCommandPaletteOpen(false);
          setIsSimulatorOpen(true);
        }}
        onReset={handleResetDemo}
        onPauseAgent={() => handleAgentIntervene("pause")}
        onResumeAgent={() => handleAgentIntervene("resume")}
      />

      <SystemDiagnosticsModal
        isOpen={isDiagnosticsOpen}
        onClose={() => setIsDiagnosticsOpen(false)}
        diagnostics={null}
      />

    </div>
  );
}

export default App;


