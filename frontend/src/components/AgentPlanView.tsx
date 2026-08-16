import React, { useState, useEffect, useRef } from "react";
import {
  Cpu,
  CheckCircle2,
  Clock,
  Pause,
  Play,
  AlertCircle,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  Zap,
  Activity,
  Send,
  Mail,
  MessageSquare,
  ShieldCheck,
  RotateCcw,
  Sliders,
  Terminal,
  FileText,
  UserCheck,
  ChevronRight,
  Database,
  Sparkles,
  ExternalLink,
  Flame,
  Volume2,
  VolumeX,
  FastForward,
  Info
} from "lucide-react";
import { Incident, Approval } from "../types";
import { soundEngine } from "../services/sound";

interface AgentPlanViewProps {
  incident: Incident | null;
  onPause?: () => void;
  onResume?: () => void;
  onIntervene?: () => void;
  onTriggerSimulation?: (params: {
    service: string;
    region: string;
    error_rate: number;
    latency: number;
    affected_users: number;
    title: string;
  }) => Promise<void>;
  onSimulateAck?: (channel?: string, userName?: string, text?: string) => Promise<void>;
  onApproveRollback?: (approvalId: string) => Promise<void>;
  onResolveIncident?: () => Promise<void>;
  activeApproval?: Approval | null;
  countdown?: number;
  events?: any[];
  isSimulating?: boolean;
}

export interface PlanStepNode {
  id: string;
  number: number;
  title: string;
  shortName: string;
  category: "observe" | "think" | "score" | "dispatch" | "sla" | "escalate" | "coordinate" | "safety" | "remediate" | "memorize";
  icon: string;
  status: "pending" | "in_progress" | "completed" | "escalated" | "blocked";
  description: string;
  durationMs?: number;
  aiPrompt?: string;
  aiOutput?: string;
  payloadDetails?: Record<string, any>;
  actionHint?: string;
}

export const AgentPlanView: React.FC<AgentPlanViewProps> = ({
  incident,
  onPause,
  onResume,
  onIntervene,
  onTriggerSimulation,
  onSimulateAck,
  onApproveRollback,
  onResolveIncident,
  activeApproval,
  countdown = 0,
  events = [],
  isSimulating = false
}) => {
  // 1. Internal Live State Machine
  const [internalRunning, setInternalRunning] = useState(false);
  const [internalPaused, setInternalPaused] = useState(false);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [internalCountdown, setInternalCountdown] = useState<number>(10);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // 1x, 2x, 4x
  const [selectedNode, setSelectedNode] = useState<PlanStepNode | null>(null);
  const [logFilter, setLogFilter] = useState<"all" | "ai" | "dispatch" | "safety">("all");
  const [activeTab, setActiveTab] = useState<"graph" | "checklist" | "console">("graph");

  // Terminal reasoning logs
  const [reasoningLogs, setReasoningLogs] = useState<Array<{
    id: string;
    timestamp: string;
    tag: "THOUGHT" | "TOOL" | "CASPIAN" | "SLA" | "ESCALATE" | "SAFETY" | "MEMORY" | "RESOLVE";
    message: string;
  }>>([
    {
      id: "log_init_0",
      timestamp: "00:00.00",
      tag: "THOUGHT",
      message: "NEXORA autonomous agent online. Awaiting incident trigger or start command."
    }
  ]);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Define the 10 Master DAG Nodes
  const [nodes, setNodes] = useState<PlanStepNode[]>([
    {
      id: "step_1",
      number: 1,
      title: "Observe incident telemetry & affected user blast radius",
      shortName: "Telemetry Ingest",
      category: "observe",
      icon: "Activity",
      status: "pending",
      description: "Ingests real-time Prometheus / CloudWatch telemetry metrics. Calculates user blast radius & impact slope.",
      durationMs: 180,
      aiPrompt: "INGEST telemetry: {service: 'Payment API', error_rate: 42.0%, latency: 8.7s, affected_users: 18420}",
      aiOutput: "High anomaly detected. 504 Gateway spike across India-East edge cluster.",
      payloadDetails: {
        service: "Payment API",
        region: "India-East",
        error_rate: "42.0%",
        latency: "8.7s",
        affected_users: "18,420"
      }
    },
    {
      id: "step_2",
      number: 2,
      title: "Classify severity & urgency via Featherless AI",
      shortName: "AI Classification",
      category: "think",
      icon: "Cpu",
      status: "pending",
      description: "Queries Featherless Llama-3.1-70B model with zero-shot prompt to determine P0 severity & recommended team.",
      durationMs: 420,
      aiPrompt: "CLASSIFY: Payment API 42% 504 error rate. Determine severity, confidence score, and primary team.",
      aiOutput: '{\n  "severity": "P0",\n  "confidence": 0.974,\n  "team": "Payments",\n  "recommended_action": "Rollback deployment #481"\n}',
      payloadDetails: {
        model: "Featherless Llama-3.1-70B-Instruct",
        confidence: "97.4%",
        severity: "P0 (Critical Outage)"
      }
    },
    {
      id: "step_3",
      number: 3,
      title: "Score & select primary responder (Payments Lead)",
      shortName: "Identity Scoring",
      category: "score",
      icon: "UserCheck",
      status: "pending",
      description: "Ranks candidate responders using multi-factor availability, past resolution MTTA, and current timezone match.",
      durationMs: 95,
      aiPrompt: "RANK responders for service: 'Payment API'. Candidates: [Alex Vance, Priya Sharma, Rahul Nair]",
      aiOutput: "Selected Primary: Alex Vance (Score 92/100, Preferred: Telegram, MTTA: 3.2m)",
      payloadDetails: {
        primary: "Alex Vance",
        score: "92 / 100",
        channel: "Telegram Bot (@alexvance)",
        reason: "Highest domain ownership score & active working hours in IST"
      }
    },
    {
      id: "step_4",
      number: 4,
      title: "Reach primary responder via Caspian (Telegram)",
      shortName: "Caspian Dispatch",
      category: "dispatch",
      icon: "Send",
      status: "pending",
      description: "Dispatches rich incident alert payload with 1-click tokenized response buttons via Caspian Telegram gateway.",
      durationMs: 310,
      aiPrompt: "DISPATCH Caspian Telegram payload to @alexvance with 10s SLA acknowledgement token #tok_981.",
      aiOutput: "HTTP 200 OK: Message delivered to Telegram Bot @alexvance_bot. MessageID #msg_8842",
      payloadDetails: {
        recipient: "Alex Vance",
        channel: "Telegram",
        ack_token: "tok_p0_98421_india_east",
        status: "Delivered to device"
      }
    },
    {
      id: "step_5",
      number: 5,
      title: "Monitor 10s acknowledgement SLA countdown",
      shortName: "SLA Monitor (10s)",
      category: "sla",
      icon: "Clock",
      status: "pending",
      description: "Autonomous countdown loop actively monitors webhook receipt. Prepares automated escalation on timeout.",
      durationMs: 10000,
      aiPrompt: "MONITOR ACK window: 10 seconds. Webhook target: /api/incidents/{id}/acknowledge",
      aiOutput: "Countdown running... [10s -> 0s]. Primary responder did not acknowledge in window.",
      payloadDetails: {
        configured_sla: "10 seconds",
        status: "Monitoring WebSocket stream"
      },
      actionHint: "Simulate human response or let timer expire to test auto-escalation"
    },
    {
      id: "step_6",
      number: 6,
      title: "Autonomously escalate to backup on timeout (Priya / Email)",
      shortName: "Auto Escalation",
      category: "escalate",
      icon: "Flame",
      status: "pending",
      description: "SLA timeout triggers autonomous failover. Re-routes incident to Tier-2 responder Priya Sharma via Caspian Email.",
      durationMs: 380,
      aiPrompt: "ESCALATE incident to Level 2. Backup candidate: Priya Sharma (Senior Platform SRE) via Caspian Email.",
      aiOutput: "Priority Email dispatched with 1-click ACK token to priya.sharma@nexora.ai. Escalation level set to 2.",
      payloadDetails: {
        escalation_level: "Level 2",
        backup_owner: "Priya Sharma",
        channel: "Caspian Priority Email",
        reason: "Primary responder 10s SLA expired"
      }
    },
    {
      id: "step_7",
      number: 7,
      title: "Coordinate cross-team mitigation (Database team on Slack)",
      shortName: "War Room Sync",
      category: "coordinate",
      icon: "MessageSquare",
      status: "pending",
      description: "Creates Slack War Room #war-room-p0, broadcasts AI summary, and engages Database architect Rahul Nair.",
      durationMs: 440,
      aiPrompt: "CREATE war room channel #war-room-p0. Post telemetry snapshot and query long-term memory for past incidents.",
      aiOutput: "Slack channel synced. Long-term memory query matched INC-8821 (Connection pool saturation).",
      payloadDetails: {
        channel: "Slack #war-room-p0",
        memory_match: "INC-8821: Connection pool exhaustion after deployment",
        specialist: "Rahul Nair (Database Architect)"
      }
    },
    {
      id: "step_8",
      number: 8,
      title: "Request human approval for rollback deployment #481",
      shortName: "Human Safety Gate",
      category: "safety",
      icon: "ShieldAlert",
      status: "pending",
      description: "Enforces Human-in-the-Loop policy. Halts autonomous loop until authorized SRE signs off on production rollback.",
      durationMs: 120,
      aiPrompt: "SAFETY CHECK: Action 'Rollback payment deployment #481' flagged HIGH RISK. Request human approval.",
      aiOutput: "Approval requested #appr_882. Awaiting cryptographic sign-off from Priya Sharma.",
      payloadDetails: {
        action: "Rollback payment deployment #481 -> #480",
        risk_level: "HIGH",
        status: "AWAITING HUMAN APPROVAL"
      },
      actionHint: "Approve rollback to authorize automated mitigation"
    },
    {
      id: "step_9",
      number: 9,
      title: "Verify telemetry recovery (error rate < 1%)",
      shortName: "Canary Rollback",
      category: "remediate",
      icon: "Zap",
      status: "pending",
      description: "Executes automated canary rollback to build #480. Polls telemetry to verify error rate drops from 42% to nominal <0.2%.",
      durationMs: 1500,
      aiPrompt: "EXECUTE rollback build #480. Verify metric health: error_rate < 1.0%, latency < 0.2s.",
      aiOutput: "Rollback completed. Error rate stabilized to 0.12%. Latency 118ms. Nominal baseline restored.",
      payloadDetails: {
        build: "#480 (Stable)",
        final_error_rate: "0.12%",
        final_latency: "0.118s",
        status: "STABILIZED"
      }
    },
    {
      id: "step_10",
      number: 10,
      title: "Synthesize AI postmortem & persist memory learnings",
      shortName: "Memory Synthesis",
      category: "memorize",
      icon: "Sparkles",
      status: "pending",
      description: "Synthesizes comprehensive incident timeline, RCA, and MTTR stats. Persists vector embeddings in long-term memory store.",
      durationMs: 680,
      aiPrompt: "SYNTHESIZE postmortem: Summarize root cause, timeline, actions taken, and preventive follow-ups.",
      aiOutput: "AI Postmortem generated. Vector embeddings indexed to Pinecone/PGVector for future instant recall.",
      payloadDetails: {
        mtta: "24 seconds",
        mttr: "1 minute 42 seconds",
        root_cause: "Connection pool exhaustion in deployment #481",
        prevention: "Add pool saturation circuit breaker"
      }
    }
  ]);

  // Sync with real incident if provided
  useEffect(() => {
    if (incident) {
      setNodes((prev) =>
        prev.map((node, idx) => {
          if (idx === 0) return { ...node, status: "completed" };
          if (idx === 1) return { ...node, status: "completed" };
          if (idx === 2) return { ...node, status: "completed" };
          if (idx === 3) return { ...node, status: "completed" };
          if (idx === 4) {
            return {
              ...node,
              status: (incident.escalation_level && incident.escalation_level > 1) || incident.acknowledged_at ? "completed" : "in_progress"
            };
          }
          if (idx === 5) {
            return {
              ...node,
              status: incident.escalation_level && incident.escalation_level > 1 ? "completed" : "pending"
            };
          }
          if (idx === 6) {
            return {
              ...node,
              status: incident.acknowledged_at ? "completed" : "pending"
            };
          }
          if (idx === 7) {
            return {
              ...node,
              status: incident.status === "MITIGATING" || incident.status === "RESOLVED" ? "completed" : incident.acknowledged_at ? "in_progress" : "pending"
            };
          }
          if (idx === 8) {
            return {
              ...node,
              status: incident.status === "RESOLVED" ? "completed" : incident.status === "MITIGATING" ? "in_progress" : "pending"
            };
          }
          if (idx === 9) {
            return {
              ...node,
              status: incident.status === "RESOLVED" ? "completed" : "pending"
            };
          }
          return node;
        })
      );
    }
  }, [incident]);

  // Auto-scroll terminal
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [reasoningLogs]);

  // Add Log Helper
  const addLog = (tag: "THOUGHT" | "TOOL" | "CASPIAN" | "SLA" | "ESCALATE" | "SAFETY" | "MEMORY" | "RESOLVE", message: string) => {
    const now = new Date();
    const mm = String(now.getMinutes()).padStart(2, "0");
    const ss = String(now.getSeconds()).padStart(2, "0");
    const ms = String(Math.floor(now.getMilliseconds() / 10)).padStart(2, "0");
    const timestamp = `${mm}:${ss}.${ms}`;
    setReasoningLogs((prev) => [
      ...prev,
      {
        id: "log_" + Math.random().toString(36).substr(2, 9),
        timestamp,
        tag,
        message
      }
    ]);
  };

  // 2. LIVE AUTONOMOUS STEP RUNNER LOOP
  useEffect(() => {
    if (!internalRunning || internalPaused) return;

    let timer: any;
    const speedMultiplier = playbackSpeed;

    // Step 0 -> Step 1 (Ingest -> Classify)
    if (currentStepIdx === 0) {
      soundEngine.playAlertBeep("critical");
      addLog("THOUGHT", "🚨 High anomaly detected on Payment API: 42.0% error rate. Ingesting telemetry blast radius...");
      setNodes((prev) => prev.map((n, i) => (i === 0 ? { ...n, status: "in_progress" } : n)));

      timer = setTimeout(() => {
        setNodes((prev) => prev.map((n, i) => (i === 0 ? { ...n, status: "completed" } : n)));
        addLog("TOOL", "Telemetry parsed: 18,420 affected users in India-East region.");
        setCurrentStepIdx(1);
      }, 700 / speedMultiplier);
    }
    // Step 1 -> Step 2 (Classify -> Score)
    else if (currentStepIdx === 1) {
      addLog("THOUGHT", "🧠 Querying Featherless Llama-3.1-70B model for zero-shot outage classification...");
      setNodes((prev) => prev.map((n, i) => (i === 1 ? { ...n, status: "in_progress" } : n)));

      timer = setTimeout(() => {
        setNodes((prev) => prev.map((n, i) => (i === 1 ? { ...n, status: "completed" } : n)));
        addLog("THOUGHT", "Featherless AI output: P0 Critical Outage (Confidence: 97.4%). Recommended Team: Payments.");
        setCurrentStepIdx(2);
      }, 1000 / speedMultiplier);
    }
    // Step 2 -> Step 3 (Score -> Dispatch)
    else if (currentStepIdx === 2) {
      addLog("TOOL", "Scoring candidate on-call responders with multi-factor weighting...");
      setNodes((prev) => prev.map((n, i) => (i === 2 ? { ...n, status: "in_progress" } : n)));

      timer = setTimeout(() => {
        setNodes((prev) => prev.map((n, i) => (i === 2 ? { ...n, status: "completed" } : n)));
        addLog("TOOL", "Selected Primary Responder: Alex Vance (Score 92/100, MTTA 3.2m, Telegram preferred).");
        setCurrentStepIdx(3);
      }, 800 / speedMultiplier);
    }
    // Step 3 -> Step 4 (Dispatch -> SLA Countdown)
    else if (currentStepIdx === 3) {
      addLog("CASPIAN", "Dispatched high-urgency payload to Telegram Bot @alexvance_bot (Token #tok_98421)...");
      setNodes((prev) => prev.map((n, i) => (i === 3 ? { ...n, status: "in_progress" } : n)));

      timer = setTimeout(() => {
        setNodes((prev) => prev.map((n, i) => (i === 3 ? { ...n, status: "completed" } : n)));
        addLog("CASPIAN", "Telegram packet delivered. Initiating autonomous 10s acknowledgement countdown.");
        setInternalCountdown(10);
        setCurrentStepIdx(4);
      }, 900 / speedMultiplier);
    }
    // Step 4: SLA Countdown (10 seconds)
    else if (currentStepIdx === 4) {
      setNodes((prev) => prev.map((n, i) => (i === 4 ? { ...n, status: "in_progress" } : n)));

      const countdownInterval = setInterval(() => {
        setInternalCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            addLog("SLA", "⏱️ 10s SLA countdown EXPIRED. Primary responder Alex Vance did not acknowledge.");
            setNodes((prev) => prev.map((n, i) => (i === 4 ? { ...n, status: "completed" } : n)));
            setCurrentStepIdx(5); // Move to auto-escalate
            return 0;
          }
          if (prev % 3 === 0) {
            addLog("SLA", `Awaiting acknowledgement... ${prev - 1}s remaining.`);
          }
          return prev - 1;
        });
      }, 1000 / speedMultiplier);

      return () => clearInterval(countdownInterval);
    }
    // Step 5: Auto Escalation
    else if (currentStepIdx === 5) {
      soundEngine.playAlertBeep("escalate");
      addLog("ESCALATE", "⚠️ Autonomous Tier-2 Escalation triggered! Re-routing to secondary responder Priya Sharma...");
      setNodes((prev) => prev.map((n, i) => (i === 5 ? { ...n, status: "in_progress" } : n)));

      timer = setTimeout(() => {
        setNodes((prev) => prev.map((n, i) => (i === 5 ? { ...n, status: "completed" } : n)));
        addLog("CASPIAN", "Priority Email alert sent to priya.sharma@nexora.ai. Escalation level set to 2.");
        // Auto simulate Priya ACK after 1.5s
        setTimeout(() => {
          soundEngine.playAlertBeep("ack");
          addLog("TOOL", "👤 Priya Sharma acknowledged via Email: \"Acknowledged. Checking connection pool exhaustion.\"");
          setCurrentStepIdx(6);
        }, 1200 / speedMultiplier);
      }, 1000 / speedMultiplier);
    }
    // Step 6: War room sync & memory lookup
    else if (currentStepIdx === 6) {
      addLog("TOOL", "Syncing Slack War Room #war-room-p0 with Database architect Rahul Nair...");
      setNodes((prev) => prev.map((n, i) => (i === 6 ? { ...n, status: "in_progress" } : n)));

      timer = setTimeout(() => {
        setNodes((prev) => prev.map((n, i) => (i === 6 ? { ...n, status: "completed" } : n)));
        addLog("MEMORY", "Vector memory query match found: INC-8821 \"Connection pool exhaustion after deployment #481\".");
        addLog("THOUGHT", "Recommended mitigation: Rollback payment deployment #481 -> #480.");
        setCurrentStepIdx(7);
      }, 1100 / speedMultiplier);
    }
    // Step 7: Safety Gate (Human Approval)
    else if (currentStepIdx === 7) {
      soundEngine.playAlertBeep("critical");
      addLog("SAFETY", "🛡️ HUMAN SAFETY GATE TRIGGERED: Rollback deployment #481 is HIGH RISK. Autonomous loop paused for human sign-off.");
      setNodes((prev) => prev.map((n, i) => (i === 7 ? { ...n, status: "blocked" } : n)));
      // Pause here until user or auto approves
    }
    // Step 8: Execute Rollback & Verification
    else if (currentStepIdx === 8) {
      addLog("TOOL", "Executing automated canary rollback deployment #480...");
      setNodes((prev) => prev.map((n, i) => (i === 8 ? { ...n, status: "in_progress" } : n)));

      timer = setTimeout(() => {
        soundEngine.playAlertBeep("success");
        setNodes((prev) => prev.map((n, i) => (i === 8 ? { ...n, status: "completed" } : n)));
        addLog("RESOLVE", "✅ Telemetry verified: Error rate nominal at 0.12%. Latency dropped to 118ms.");
        setCurrentStepIdx(9);
      }, 1500 / speedMultiplier);
    }
    // Step 9: Postmortem synthesis & memory persistence
    else if (currentStepIdx === 9) {
      addLog("MEMORY", "Synthesizing AI postmortem & indexing vector embeddings into long-term memory store...");
      setNodes((prev) => prev.map((n, i) => (i === 9 ? { ...n, status: "in_progress" } : n)));

      timer = setTimeout(() => {
        soundEngine.playAlertBeep("success");
        soundEngine.speak("Agent coordination plan successfully completed. All systems nominal.");
        setNodes((prev) => prev.map((n, i) => (i === 9 ? { ...n, status: "completed" } : n)));
        addLog("RESOLVE", "🎉 Autonomous workflow completed. MTTR: 1m 42s. Knowledge persisted.");
        setInternalRunning(false);
      }, 1200 / speedMultiplier);
    }

    return () => clearTimeout(timer);
  }, [internalRunning, internalPaused, currentStepIdx, playbackSpeed]);

  // Handlers for Live Actions
  const handleStartAutonomousRun = async () => {
    setInternalRunning(true);
    setInternalPaused(false);
    setCurrentStepIdx(0);
    setInternalCountdown(10);
    setSelectedNode(null);
    addLog("THOUGHT", "🚀 Initiating full autonomous coordination cycle on Payment API...");

    if (onTriggerSimulation) {
      try {
        await onTriggerSimulation({
          service: "Payment API",
          region: "India-East",
          error_rate: 42.0,
          latency: 8.7,
          affected_users: 18420,
          title: "Critical Payment Gateway 504 Degradation"
        });
      } catch (e) {
        console.warn("Backend simulation trigger failed, continuing with client autonomous runner", e);
      }
    }
  };

  const handleStepForward = () => {
    if (currentStepIdx < 9) {
      const nextIdx = currentStepIdx + 1;
      setNodes((prev) =>
        prev.map((n, i) => {
          if (i < nextIdx) return { ...n, status: "completed" };
          if (i === nextIdx) return { ...n, status: "in_progress" };
          return { ...n, status: "pending" };
        })
      );
      setCurrentStepIdx(nextIdx);
      addLog("TOOL", `Stepped to phase ${nextIdx + 1}: ${nodes[nextIdx].shortName}`);
    }
  };

  const handleApproveSafetyGate = async () => {
    addLog("SAFETY", "🛡️ Rollback deployment #480 APPROVED by human operator Priya Sharma.");
    setNodes((prev) => prev.map((n, i) => (i === 7 ? { ...n, status: "completed" } : n)));
    if (activeApproval && onApproveRollback) {
      try {
        await onApproveRollback(activeApproval.id);
      } catch (e) {
        console.warn("API approval call skipped", e);
      }
    }
    setCurrentStepIdx(8);
  };

  const handleSimulateHumanAck = async () => {
    soundEngine.playAlertBeep("ack");
    addLog("TOOL", "👤 Alex Vance responded via Telegram Bot: \"ACK. On it.\"");
    setNodes((prev) => prev.map((n, i) => (i === 4 ? { ...n, status: "completed" } : n)));
    if (onSimulateAck) {
      try {
        await onSimulateAck("telegram", "Alex Vance", "Acknowledged. Investigating.");
      } catch (e) {
        console.warn("API ack call skipped", e);
      }
    }
    setCurrentStepIdx(6); // Jump straight to war room coordination
  };

  const handleResetPlan = () => {
    setInternalRunning(false);
    setInternalPaused(false);
    setCurrentStepIdx(0);
    setInternalCountdown(10);
    setSelectedNode(null);
    setNodes((prev) => prev.map((n) => ({ ...n, status: "pending" })));
    addLog("THOUGHT", "Agent plan reset to initial standby state.");
  };

  const completedStepsCount = nodes.filter((n) => n.status === "completed").length;
  const progressPercent = Math.round((completedStepsCount / nodes.length) * 100);
  const activeNode = nodes.find((n) => n.status === "in_progress" || n.status === "blocked") || (internalRunning ? nodes[currentStepIdx] : null);

  const isPaused = internalPaused || (incident?.plan?.current_status === "PAUSED");

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. TOP HEADER & COMMAND CONTROLS */}
      <div className="p-6 rounded-3xl glass-panel border border-[#8B5CF6]/30 shadow-2xl relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-96 h-64 bg-gradient-to-bl from-purple-500/15 via-cyan-500/10 to-transparent blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          
          {/* Title & Status */}
          <div className="flex items-center space-x-3.5">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-600/30 to-indigo-600/30 border border-purple-500/40 text-purple-300 shadow-lg shadow-purple-500/20">
              <Cpu className="h-7 w-7 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <h2 className="text-xl sm:text-2xl font-black text-white font-heading tracking-tight">
                  NEXORA AGENT PLAN & EXECUTION GRAPH
                </h2>
                <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider font-heading border flex items-center space-x-1.5 ${
                  isPaused
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                    : internalRunning
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse"
                    : "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                }`}>
                  <span className={`h-2 w-2 rounded-full ${
                    isPaused ? "bg-amber-400" : internalRunning ? "bg-emerald-400 animate-ping" : "bg-cyan-400"
                  }`} />
                  <span>{isPaused ? "PAUSED" : internalRunning ? "AUTONOMOUS LIVE RUNNING" : "READY (STANDBY)"}</span>
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Real-time inspection of Featherless AI reasoning, Caspian multi-channel dispatch, 10s SLA monitoring, and safety gates.
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            
            {/* Speed Selector */}
            <div className="flex items-center space-x-1 bg-slate-900/90 p-1 rounded-xl border border-white/10 text-[11px] font-bold">
              {[1, 2, 4].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    playbackSpeed === spd
                      ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                      : "text-slate-400 hover:text-white"
                  }`}
                  title={`${spd}x Speed`}
                >
                  {spd}x
                </button>
              ))}
            </div>

            {/* Step Forward Button */}
            <button
              onClick={handleStepForward}
              disabled={completedStepsCount >= 10}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-bold border border-white/10 transition-all cursor-pointer"
              title="Execute Next Step"
            >
              <FastForward className="h-4 w-4 text-cyan-400" />
              <span className="hidden sm:inline">STEP</span>
            </button>

            {/* Pause / Resume */}
            {internalRunning ? (
              <button
                onClick={() => {
                  setInternalPaused(!internalPaused);
                  if (internalPaused ? onResume : onPause) {
                    internalPaused ? onResume?.() : onPause?.();
                  }
                }}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-white text-xs font-bold shadow-lg transition-all cursor-pointer ${
                  internalPaused
                    ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30"
                    : "bg-amber-600 hover:bg-amber-500 shadow-amber-600/30"
                }`}
              >
                {internalPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                <span>{internalPaused ? "RESUME" : "PAUSE"}</span>
              </button>
            ) : null}

            {/* Main Start / Re-run CTA Button */}
            <button
              onClick={handleStartAutonomousRun}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white text-xs font-black shadow-xl shadow-purple-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer font-heading tracking-wide"
            >
              <Sparkles className="h-4 w-4 animate-spin" />
              <span>{completedStepsCount > 0 ? "RE-RUN LIVE WORKFLOW" : "START LIVE AUTONOMOUS RUN"}</span>
            </button>

            {/* Reset Button */}
            {completedStepsCount > 0 && (
              <button
                onClick={handleResetPlan}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-white/10 transition-colors"
                title="Reset Plan"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            )}

          </div>

        </div>

        {/* Live Progress Bar */}
        <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between gap-4">
          <div className="flex-1 bg-slate-900/80 rounded-full h-2.5 overflow-hidden border border-white/10 p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 via-cyan-400 to-emerald-400 transition-all duration-500 shadow-lg shadow-cyan-500/40"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="text-xs font-bold text-slate-300 font-mono shrink-0 flex items-center space-x-2">
            <span>{completedStepsCount} / 10 STEPS</span>
            <span className="text-cyan-400">({progressPercent}%)</span>
          </div>
        </div>

      </div>

      {/* 2. REAL-TIME TELEMETRY & STATUS STRIP (3 CARDS) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Active Objective */}
        <div className="p-5 rounded-2xl glass-panel border border-[#8B5CF6]/30 relative overflow-hidden">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest flex items-center space-x-1.5 font-heading">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>ACTIVE OBJECTIVE</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400">STAGE {currentStepIdx + 1}/10</span>
          </div>
          <p className="text-xs font-bold text-white leading-relaxed font-heading">
            {activeNode?.title || (completedStepsCount === 10 ? "Postmortem synthesized & systems fully nominal." : "Awaiting incident simulation trigger")}
          </p>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center space-x-1.5">
            <Activity className="h-3.5 w-3.5 text-cyan-400" />
            <span>Target: Payment API (India-East)</span>
          </div>
        </div>

        {/* Currently Waiting For & SLA Countdown */}
        <div className="p-5 rounded-2xl glass-panel border border-[#8B5CF6]/30 relative overflow-hidden">
          <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest block mb-1.5 font-heading">
            CURRENTLY WAITING FOR
          </span>
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-white leading-relaxed font-heading">
              {completedStepsCount === 10
                ? "All 10 steps executed. Postmortem persisted in memory."
                : currentStepIdx === 7 || activeApproval?.status === "PENDING"
                ? "Human sign-off for deployment rollback #481"
                : currentStepIdx === 5
                ? "Backup responder (Priya) ACK via Email"
                : currentStepIdx === 4
                ? `Primary responder ACK SLA countdown (${internalCountdown}s)`
                : "Next autonomous pipeline transition"}
            </p>
            {currentStepIdx === 4 && (
              <div className="shrink-0 ml-3 flex items-center justify-center h-10 w-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono font-black text-sm animate-pulse">
                {internalCountdown}s
              </div>
            )}
          </div>
          {/* Quick inline action if waiting */}
          {currentStepIdx === 4 && (
            <div className="mt-2.5 flex items-center gap-2">
              <button
                onClick={handleSimulateHumanAck}
                className="px-2.5 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-[10px] font-bold transition-all shadow-md"
              >
                Simulate Alex ACK (Telegram)
              </button>
            </div>
          )}
          {currentStepIdx === 7 && (
            <div className="mt-2.5 flex items-center gap-2">
              <button
                onClick={handleApproveSafetyGate}
                className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold transition-all shadow-md flex items-center space-x-1"
              >
                <ShieldCheck className="h-3 w-3" />
                <span>Authorize Rollback #480</span>
              </button>
            </div>
          )}
        </div>

        {/* AI Confidence & Model */}
        <div className="p-5 rounded-2xl glass-panel border border-[#8B5CF6]/30 relative overflow-hidden">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest font-heading">
              AI REASONING ENGINE
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Llama-3.1-70B
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-white font-heading">97.4%</span>
            <span className="text-[11px] text-emerald-400 font-bold">Confidence Score</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Featherless open-source serverless inference • 240ms avg token latency
          </p>
        </div>

      </div>

      {/* 3. VIEW TOGGLE BAR: [EXECUTION GRAPH] [CHECKLIST] [REASONING CONSOLE] */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab("graph")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all font-heading ${
              activeTab === "graph"
                ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                : "bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Activity className="h-4 w-4" />
            <span>INTERACTIVE EXECUTION GRAPH (DAG)</span>
          </button>

          <button
            onClick={() => setActiveTab("checklist")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all font-heading ${
              activeTab === "checklist"
                ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                : "bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>COORDINATION CHECKLIST ({completedStepsCount}/10)</span>
          </button>

          <button
            onClick={() => setActiveTab("console")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all font-heading ${
              activeTab === "console"
                ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                : "bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Terminal className="h-4 w-4" />
            <span>AI REASONING STREAM ({reasoningLogs.length})</span>
          </button>
        </div>

        <div className="text-[11px] text-slate-400 hidden sm:flex items-center space-x-2">
          <span>Click any node to inspect payload</span>
        </div>
      </div>

      {/* 4. TAB CONTENT 1: INTERACTIVE 2D/3D EXECUTION GRAPH (DAG) */}
      {activeTab === "graph" && (
        <div className="p-6 rounded-3xl glass-panel border border-[#8B5CF6]/30 relative overflow-hidden space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-white font-heading flex items-center space-x-2">
              <Zap className="h-4 w-4 text-cyan-400" />
              <span>NEXORA DIRECTED ACYCLIC GRAPH (DAG) EXECUTION FLOW</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-400">10-NODE AUTONOMOUS PIPELINE</span>
          </div>

          {/* Node Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 relative">
            {nodes.map((node, idx) => {
              const isDone = node.status === "completed";
              const isInProg = node.status === "in_progress";
              const isBlocked = node.status === "blocked";
              const isSelected = selectedNode?.id === node.id;

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between relative group ${
                    isSelected
                      ? "ring-2 ring-cyan-400 bg-slate-900 border-cyan-400 shadow-xl shadow-cyan-500/20 scale-105 z-20"
                      : isDone
                      ? "bg-emerald-950/20 border-emerald-500/40 hover:border-emerald-400 shadow-md shadow-emerald-500/10"
                      : isInProg
                      ? "bg-cyan-950/30 border-cyan-500/60 shadow-xl shadow-cyan-500/25 scale-102 animate-pulse"
                      : isBlocked
                      ? "bg-amber-950/30 border-amber-500/60 shadow-xl shadow-amber-500/20 scale-102"
                      : "bg-slate-950/70 border-white/10 hover:border-purple-500/40 text-slate-400"
                  }`}
                >
                  {/* Step Number Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-white/10">
                      #{node.number}
                    </span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-heading ${
                      isDone
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : isInProg
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse"
                        : isBlocked
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse"
                        : "bg-slate-800 text-slate-500"
                    }`}>
                      {isDone ? "COMPLETED" : isInProg ? "EXECUTING" : isBlocked ? "BLOCKED" : "PENDING"}
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="space-y-1.5 my-1">
                    <div className={`p-2 rounded-xl w-fit ${
                      isDone ? "bg-emerald-500/20 text-emerald-400" : isInProg ? "bg-cyan-500/20 text-cyan-300" : isBlocked ? "bg-amber-500/20 text-amber-400" : "bg-slate-800 text-slate-400"
                    }`}>
                      {isDone ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : isInProg ? (
                        <Clock className="h-4 w-4 animate-spin" />
                      ) : isBlocked ? (
                        <ShieldAlert className="h-4 w-4 text-amber-400" />
                      ) : (
                        <Cpu className="h-4 w-4" />
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-white font-heading leading-snug">
                      {node.shortName}
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2">
                      {node.description}
                    </p>
                  </div>

                  {/* Duration Tag */}
                  <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>{node.durationMs ? `${node.durationMs}ms` : "Async"}</span>
                    <span className="text-cyan-400 font-bold group-hover:underline">Inspect →</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Node Detailed Inspector */}
          {selectedNode && (
            <div className="p-5 rounded-2xl bg-slate-900/95 border border-cyan-500/40 shadow-2xl relative animate-in fade-in duration-200">
              <div className="flex items-start justify-between pb-3 border-b border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    <Info className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-white font-heading">
                        Node #{selectedNode.number}: {selectedNode.title}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300">
                        {selectedNode.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5">{selectedNode.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700"
                >
                  ✕ Close
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-xs font-mono">
                {/* AI Prompt */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-white/10 space-y-1">
                  <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block font-heading">
                    AI Execution Prompt / Trigger
                  </span>
                  <pre className="text-[11px] text-slate-300 whitespace-pre-wrap">
                    {selectedNode.aiPrompt || "Standard automated trigger."}
                  </pre>
                </div>

                {/* AI Output / Result */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-white/10 space-y-1">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block font-heading">
                    Agent Action Output / Packet
                  </span>
                  <pre className="text-[11px] text-emerald-300 whitespace-pre-wrap">
                    {selectedNode.aiOutput || "Pending node execution."}
                  </pre>
                </div>
              </div>

              {/* Node Payload Metadata */}
              {selectedNode.payloadDetails && (
                <div className="mt-3 p-3 rounded-xl bg-slate-950/60 border border-white/5 flex flex-wrap items-center gap-4 text-[11px]">
                  {Object.entries(selectedNode.payloadDetails).map(([k, v]) => (
                    <div key={k} className="flex items-center space-x-1.5">
                      <span className="text-slate-500 font-bold uppercase text-[9px]">{k.replace("_", " ")}:</span>
                      <span className="text-white font-mono">{String(v)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* 5. TAB CONTENT 2: STRUCTURED COORDINATION CHECKLIST */}
      {activeTab === "checklist" && (
        <div className="p-6 rounded-3xl glass-panel border border-[#8B5CF6]/30 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-white font-heading">
              COORDINATION PLAN EXECUTION CHECKLIST (10 STEPS)
            </h3>
            <span className="text-[10px] font-mono text-cyan-400">
              {completedStepsCount} of 10 Completed
            </span>
          </div>

          <div className="space-y-3">
            {nodes.map((s) => {
              const isDone = s.status === "completed";
              const isInProg = s.status === "in_progress";
              const isBlocked = s.status === "blocked";

              return (
                <div
                  key={s.id}
                  className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-3 transition-all duration-300 ${
                    isDone
                      ? "bg-emerald-950/20 border-emerald-500/30 text-slate-200"
                      : isInProg
                      ? "bg-cyan-950/30 border-cyan-500/50 shadow-lg shadow-cyan-500/10 text-white scale-101"
                      : isBlocked
                      ? "bg-amber-950/30 border-amber-500/50 shadow-lg shadow-amber-500/15 text-white"
                      : "bg-slate-950/60 border-white/5 text-slate-500"
                  }`}
                >
                  <div className="flex items-center space-x-3.5">
                    {isDone ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                    ) : isInProg ? (
                      <Clock className="h-5 w-5 text-cyan-400 shrink-0 animate-spin" />
                    ) : isBlocked ? (
                      <ShieldAlert className="h-5 w-5 text-amber-400 shrink-0" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border border-slate-700 shrink-0 flex items-center justify-center text-[10px] font-mono text-slate-500">
                        {s.number}
                      </div>
                    )}
                    <div>
                      <span className={`text-xs font-bold font-heading ${isDone ? "text-slate-300 line-through opacity-85" : "text-white"}`}>
                        {s.number}. {s.title}
                      </span>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {s.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {/* Contextual Action Button */}
                    {s.number === 5 && isInProg && (
                      <button
                        onClick={handleSimulateHumanAck}
                        className="px-3 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-[11px] font-bold shadow transition-all"
                      >
                        Simulate Human ACK
                      </button>
                    )}
                    {s.number === 8 && isBlocked && (
                      <button
                        onClick={handleApproveSafetyGate}
                        className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold shadow transition-all flex items-center space-x-1"
                      >
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>Authorize Rollback</span>
                      </button>
                    )}

                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider font-heading ${
                      isDone
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : isInProg
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse"
                        : isBlocked
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse"
                        : "bg-slate-800 text-slate-500"
                    }`}>
                      {s.status.replace("_", " ")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. TAB CONTENT 3: AI REASONING CONSOLE & LOG STREAM */}
      {activeTab === "console" && (
        <div className="p-6 rounded-3xl glass-panel border border-[#8B5CF6]/30 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <Terminal className="h-4 w-4 text-purple-400" />
              <h3 className="text-xs font-black uppercase tracking-wider text-white font-heading">
                FEATHERLESS AI REASONING & CASPIAN DISPATCH TERMINAL
              </h3>
            </div>

            {/* Filter Tags */}
            <div className="flex items-center space-x-1.5 text-[10px] font-mono">
              {(["all", "ai", "dispatch", "safety"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setLogFilter(f)}
                  className={`px-2.5 py-1 rounded-lg uppercase tracking-wider transition-all ${
                    logFilter === f
                      ? "bg-purple-600 text-white font-bold"
                      : "bg-slate-900 text-slate-400 hover:text-white"
                  }`}
                >
                  {f}
                </button>
              ))}
              <button
                onClick={() => setReasoningLogs([])}
                className="px-2.5 py-1 rounded-lg bg-slate-900 text-slate-400 hover:text-rose-400"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Terminal Box */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 font-mono text-xs max-h-96 overflow-y-auto space-y-2 select-text shadow-inner">
            {reasoningLogs.length === 0 ? (
              <div className="text-slate-500 py-8 text-center">No logs generated yet. Click "Start Live Autonomous Run" to begin.</div>
            ) : (
              reasoningLogs
                .filter((log) => {
                  if (logFilter === "ai") return log.tag === "THOUGHT";
                  if (logFilter === "dispatch") return log.tag === "CASPIAN" || log.tag === "TOOL";
                  if (logFilter === "safety") return log.tag === "SAFETY" || log.tag === "ESCALATE";
                  return true;
                })
                .map((log) => {
                  const tagColors: Record<string, string> = {
                    THOUGHT: "text-purple-400 bg-purple-500/10 border-purple-500/30",
                    TOOL: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
                    CASPIAN: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30",
                    SLA: "text-amber-400 bg-amber-500/10 border-amber-500/30",
                    ESCALATE: "text-rose-400 bg-rose-500/10 border-rose-500/30",
                    SAFETY: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
                    MEMORY: "text-blue-400 bg-blue-500/10 border-blue-500/30",
                    RESOLVE: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
                  };

                  return (
                    <div key={log.id} className="flex items-start space-x-2.5 py-0.5 leading-relaxed">
                      <span className="text-slate-500 text-[10px] select-none">{log.timestamp}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border uppercase shrink-0 ${tagColors[log.tag] || "text-slate-400"}`}>
                        [{log.tag}]
                      </span>
                      <span className="text-slate-200">{log.message}</span>
                    </div>
                  );
                })
            )}
            <div ref={terminalEndRef} />
          </div>
        </div>
      )}

    </div>
  );
};

