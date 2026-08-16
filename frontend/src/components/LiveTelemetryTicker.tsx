import React, { useState, useEffect } from "react";
import { Activity, Cpu, Zap, Radio, Globe, Shield, Wifi } from "lucide-react";

interface LiveTelemetryTickerProps {
  isSimulating: boolean;
  activeErrorRate?: number;
}

export const LiveTelemetryTicker: React.FC<LiveTelemetryTickerProps> = ({
  isSimulating,
  activeErrorRate = 0
}) => {
  const [rps, setRps] = useState(24850);
  const [latency, setLatency] = useState(142);
  const [tokPerSec, setTokPerSec] = useState(188);
  const [livePackets, setLivePackets] = useState<string[]>([
    "PAYMENT_GATEWAY: 200 OK (38ms)",
    "CASPIAN_WS: Heartbeat ack received",
    "VECTOR_STORE: 14 embedding nodes queried",
    "FEATHERLESS: DeepSeek-V3.2 active"
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Dynamic jitter based on whether an incident is active
      const errFactor = isSimulating ? 1.4 : 1.0;
      const newRps = Math.floor(24000 + Math.random() * 2500 * errFactor);
      const newLatency = isSimulating
        ? Math.floor(320 + Math.random() * 180)
        : Math.floor(135 + Math.random() * 25);
      const newTok = Math.floor(175 + Math.random() * 30);

      setRps(newRps);
      setLatency(newLatency);
      setTokPerSec(newTok);

      // Random new network packet event
      const samplePackets = [
        "INGRESS_ENVOY: TLS Handshake complete (0.8ms)",
        "CASPIAN_ROUTER: Telegram webhook dispatched",
        "AUTH_SERVICE: JWT verification pass (1.2ms)",
        "FEATHERLESS_API: Stream packet #44 parsed",
        "KNOWLEDGE_BASE: Similarity search 0.94 score",
        "REDIS_PRIMARY: Key eviction count: 0",
        "POSTGRES_REPLICA: Replication lag 2ms"
      ];
      const randomPkt = samplePackets[Math.floor(Math.random() * samplePackets.length)];
      setLivePackets((prev) => [randomPkt, ...prev.slice(0, 3)]);
    }, 1800);

    return () => clearInterval(interval);
  }, [isSimulating]);

  return (
    <div className="w-full bg-[#07050E]/90 border-y border-[#8B5CF6]/20 py-1.5 px-4 overflow-hidden select-none backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] font-mono gap-4">
        
        {/* Left: Global Ingress RPS & Latency */}
        <div className="flex items-center space-x-4 shrink-0">
          <div className="flex items-center space-x-1.5 text-white">
            <Activity className="h-3.5 w-3.5 text-[#C084FC] animate-pulse" />
            <span className="text-[#C4B5FD] uppercase tracking-wider font-heading text-[10px]">INGRESS:</span>
            <span className="font-bold font-mono text-[#A855F7]">{rps.toLocaleString()} RPS</span>
          </div>

          <div className="hidden sm:flex items-center space-x-1.5 text-white">
            <Wifi className="h-3.5 w-3.5 text-[#38BDF8]" />
            <span className="text-[#C4B5FD] uppercase tracking-wider font-heading text-[10px]">GLOBAL P50:</span>
            <span className={`font-bold ${isSimulating ? "text-amber-400" : "text-white"}`}>
              {latency}ms
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-1.5 text-white">
            <Cpu className="h-3.5 w-3.5 text-[#C084FC]" />
            <span className="text-[#C4B5FD] uppercase tracking-wider font-heading text-[10px]">LLM SPEED:</span>
            <span className="font-bold text-[#C084FC]">{tokPerSec} tok/s</span>
          </div>
        </div>

        {/* Center: Live Packet Stream Ticker */}
        <div className="hidden lg:flex items-center space-x-2 text-[#C4B5FD] truncate max-w-md">
          <Radio className="h-3 w-3 text-[#A855F7] animate-pulse shrink-0" />
          <span className="text-[10px] text-[#C084FC] font-bold shrink-0">[LIVE PACKET]</span>
          <span className="truncate text-[10px] text-slate-200">{livePackets[0]}</span>
        </div>

        {/* Right: Caspian Mesh Status */}
        <div className="flex items-center space-x-2 shrink-0">
          <span className="h-1.5 w-1.5 rounded-full bg-[#A855F7] animate-ping" />
          <span className="text-[10px] font-bold text-[#C084FC] uppercase font-heading tracking-wider">
            CASPIAN MESH ACTIVE
          </span>
        </div>

      </div>
    </div>
  );
};
