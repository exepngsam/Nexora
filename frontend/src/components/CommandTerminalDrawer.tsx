import React, { useState, useEffect, useRef } from "react";
import { Terminal, X, Minimize2, Maximize2, Send, CornerDownLeft, Shield, Cpu, Activity, Play, RefreshCw, Zap } from "lucide-react";
import { Incident, Responder } from "../types";

interface CommandTerminalDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentIncident: Incident | null;
  responders: Responder[];
  onTriggerSimulation: (service: string, error_rate: number, latency: number, title: string) => Promise<void>;
  onAcknowledge: () => Promise<void>;
  onResolve: () => Promise<void>;
  onOpenApproval: () => void;
}

interface TerminalLog {
  id: string;
  type: "input" | "output" | "error" | "system";
  text: string;
  time: string;
}

export const CommandTerminalDrawer: React.FC<CommandTerminalDrawerProps> = ({
  isOpen,
  onClose,
  currentIncident,
  responders,
  onTriggerSimulation,
  onAcknowledge,
  onResolve,
  onOpenApproval
}) => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);
  const [logs, setLogs] = useState<TerminalLog[]>([
    {
      id: "1",
      type: "system",
      text: "NEXORA Autonomous SRE Terminal Engine v2.4.0 [Featherless AI + Caspian Runtime]",
      time: new Date().toLocaleTimeString()
    },
    {
      id: "2",
      type: "system",
      text: "Type 'help' to see all available live commands, or 'status' for real-time telemetry.",
      time: new Date().toLocaleTimeString()
    }
  ]);

  const [isExpanded, setIsExpanded] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const addLog = (type: TerminalLog["type"], text: string) => {
    setLogs((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substr(2, 9),
        type,
        text,
        time: new Date().toLocaleTimeString()
      }
    ]);
  };

  const handleCommand = async (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    addLog("input", `$ ${trimmed}`);
    setHistory((prev) => [...prev, trimmed]);
    setHistoryIdx(-1);
    setInput("");

    const parts = trimmed.split(" ");
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (cmd) {
      case "help":
        addLog(
          "output",
          `AVAILABLE COMMANDS:
  status                   - Display active incident, error rate, SLA and responders
  responders list          - List all on-call engineers with Caspian reachability score
  incident simulate <svc>  - Trigger a high-priority P0 simulation (e.g. 'incident simulate Auth')
  incident ack             - Dispatch human acknowledgment via Caspian channel
  incident approve         - Open safety approval gate for canary rollback
  incident resolve         - Confirm incident mitigation and resolution
  chaos <type>             - Inject chaos scenario: 'redis', 'db_pool', 'bgp', 'ssl'
  featherless test         - Benchmark Featherless AI connection latency & active model
  clear                    - Clear the terminal console buffer
  help                     - Show this command reference`
        );
        break;

      case "status":
        if (!currentIncident) {
          addLog("output", "✓ System status: ALL SYSTEMS HEALTHY. No active P0/P1 incidents.");
        } else {
          addLog(
            "output",
            `[ACTIVE INCIDENT]
ID: ${currentIncident.id}
Service: ${currentIncident.service} (${currentIncident.region})
Severity: ${currentIncident.severity}
Error Rate: ${currentIncident.error_rate}%
P99 Latency: ${currentIncident.latency}s
Affected Users: ${currentIncident.affected_users.toLocaleString()}
Escalation Level: Level ${currentIncident.escalation_level}
Status: ${currentIncident.status}
Owner: ${currentIncident.owner || "Unassigned"}`
          );
        }
        break;

      case "responders":
        if (args[0] === "list" || !args[0]) {
          const listStr = responders
            .map(
              (r) =>
                `  • ${r.name.padEnd(16)} | Role: ${r.role.padEnd(12)} | Status: ${r.availability} | Response Rate: ${(r.response_rate * 100).toFixed(0)}% | Ch: ${r.preferred_channel}`
            )
            .join("\n");
          addLog("output", `ON-CALL RESPONDER DIRECTORY:\n${listStr}`);
        } else {
          addLog("error", "Usage: responders list");
        }
        break;

      case "incident":
        if (args[0] === "simulate") {
          const svc = args[1] || "Payment API";
          addLog("output", `[SIMULATION INITIATED] Generating P0 outage for service: '${svc}'...`);
          await onTriggerSimulation(svc, 48.5, 9.2, `Critical Outage in ${svc}`);
          addLog("output", `✓ Incident simulation successfully launched! Multi-channel orchestration dispatched.`);
        } else if (args[0] === "ack") {
          addLog("output", "Dispatching human acknowledgment packet...");
          await onAcknowledge();
          addLog("output", "✓ Acknowledgment verified and recorded in audit ledger.");
        } else if (args[0] === "approve") {
          onOpenApproval();
          addLog("output", "✓ Opening Human Safety Approval Gate...");
        } else if (args[0] === "resolve") {
          addLog("output", "Resolving active incident and generating postmortem...");
          await onResolve();
          addLog("output", "✓ Incident resolved. System metrics restored to baseline.");
        } else {
          addLog("error", "Usage: incident <simulate|ack|approve|resolve>");
        }
        break;

      case "chaos":
        const chaosType = args[0] || "redis";
        const chaosMap: Record<string, { svc: string; err: number; lat: number; title: string }> = {
          redis: { svc: "Redis Session Store", err: 64.0, lat: 12.4, title: "Redis Cache Thundering Herd Failure" },
          db_pool: { svc: "Postgres Primary", err: 88.0, lat: 15.0, title: "DB Connection Pool Exhaustion" },
          bgp: { svc: "Edge CDN Gateway", err: 52.0, lat: 7.8, title: "BGP Route Flap & Packet Loss Spike" },
          ssl: { svc: "Auth Service", err: 95.0, lat: 1.2, title: "SSL Certificate Expiry Outage" }
        };

        const target = chaosMap[chaosType] || chaosMap.redis;
        addLog("output", `[CHAOS INJECTION] Triggering '${target.title}' (${target.svc})...`);
        await onTriggerSimulation(target.svc, target.err, target.lat, target.title);
        addLog("output", `✓ Chaos scenario injected! Watching autonomous SRE agent react.`);
        break;

      case "featherless":
        if (args[0] === "test" || !args[0]) {
          addLog("output", "Benchmarking Featherless AI endpoint (https://api.featherless.ai/v1)...");
          try {
            const res = await fetch("http://localhost:8000/api/llm/test", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({})
            });
            const data = await res.json();
            if (data.status === "ok") {
              addLog(
                "output",
                `✓ FEATHERLESS BENCHMARK PASSED:
  Model: ${data.model}
  Latency: ${data.latency_ms}ms
  Test Response: "${data.reply}"`
              );
            } else {
              addLog("error", `Featherless test warning: ${data.message}`);
            }
          } catch (e: any) {
            addLog("error", `Connection test failed: ${e.message}`);
          }
        } else {
          addLog("error", "Usage: featherless test");
        }
        break;

      case "clear":
        setLogs([]);
        break;

      default:
        addLog("error", `Command not recognized: '${cmd}'. Type 'help' for available commands.`);
        break;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(input);
    } else if (e.key === "ArrowUp") {
      if (history.length > 0) {
        const nextIdx = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1);
        setHistoryIdx(nextIdx);
        setInput(history[nextIdx]);
      }
    } else if (e.key === "ArrowDown") {
      if (historyIdx !== -1) {
        const nextIdx = historyIdx + 1;
        if (nextIdx < history.length) {
          setHistoryIdx(nextIdx);
          setInput(history[nextIdx]);
        } else {
          setHistoryIdx(-1);
          setInput("");
        }
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed z-50 transition-all duration-300 ${
        isExpanded
          ? "inset-4 rounded-3xl"
          : "bottom-4 right-4 w-full max-w-2xl h-[480px] rounded-3xl"
      } bg-[#07050E]/95 border border-[#8B5CF6]/40 shadow-2xl backdrop-blur-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95`}
    >
      {/* Top Terminal Bar */}
      <div className="h-12 bg-[#0D091A]/95 border-b border-[#8B5CF6]/25 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2.5">
          <div className="flex items-center space-x-1.5">
            <span className="h-3 w-3 rounded-full bg-rose-500/80 cursor-pointer hover:opacity-100" onClick={onClose} />
            <span className="h-3 w-3 rounded-full bg-amber-500/80 cursor-pointer hover:opacity-100" onClick={() => setLogs([])} />
            <span
              className="h-3 w-3 rounded-full bg-[#A855F7]/80 cursor-pointer hover:opacity-100"
              onClick={() => setIsExpanded(!isExpanded)}
            />
          </div>
          <span className="text-xs font-mono font-bold text-white flex items-center space-x-1.5 ml-2">
            <Terminal className="h-3.5 w-3.5 text-[#C084FC]" />
            <span>nexora@autonomous-sre: ~</span>
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-mono text-[#C084FC] bg-[#8B5CF6]/15 px-2 py-0.5 rounded-full border border-[#8B5CF6]/30">
            WS: CONNECTED
          </span>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-lg text-[#C4B5FD] hover:text-white hover:bg-[#1E143E] transition-colors"
          >
            {isExpanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#C4B5FD] hover:text-white hover:bg-[#1E143E] transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Output Stream */}
      <div className="flex-1 p-4 overflow-y-auto custom-scroll font-mono text-xs space-y-1.5 selection:bg-[#8B5CF6]/30 selection:text-white">
        {logs.map((l) => (
          <div key={l.id} className="leading-relaxed">
            {l.type === "input" && <div className="text-[#C084FC] font-bold">{l.text}</div>}
            {l.type === "system" && <div className="text-[#C4B5FD]/70">{l.text}</div>}
            {l.type === "output" && (
              <div className="text-white whitespace-pre-wrap bg-[#140E30]/80 p-2.5 rounded-xl border border-[#8B5CF6]/20 my-1 shadow-sm">
                {l.text}
              </div>
            )}
            {l.type === "error" && (
              <div className="text-rose-400 whitespace-pre-wrap bg-rose-950/20 p-2 rounded-xl border border-rose-500/20 my-1">
                {l.text}
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Terminal Input Bar */}
      <div className="p-3 bg-[#0D091A]/95 border-t border-[#8B5CF6]/25 flex items-center space-x-2 shrink-0">
        <span className="text-[#A855F7] font-mono font-bold">$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type 'help', 'status', 'chaos redis', 'incident ack'..."
          className="flex-1 bg-transparent font-mono text-xs text-white placeholder-[#C4B5FD]/40 outline-none"
        />
        <button
          onClick={() => handleCommand(input)}
          className="p-1.5 rounded-lg bg-[#8B5CF6]/20 hover:bg-[#8B5CF6]/30 text-[#C084FC] transition-colors cursor-pointer"
        >
          <CornerDownLeft className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
