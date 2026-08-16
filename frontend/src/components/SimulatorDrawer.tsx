import React, { useState } from "react";
import { X, Send, Zap, Radio, AlertCircle, Database, ShieldAlert, Server, Play, Clock, CheckCircle, Flame, Layers } from "lucide-react";

interface SimulatorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onRunSimulation: (params: {
    service: string;
    region: string;
    error_rate: number;
    latency: number;
    affected_users: number;
    title: string;
  }) => void;
  onSimulateChannelResponse: (channel: string, userName: string, text: string) => void;
  activeIncidentId: string | null;
}

const PRESET_SCENARIOS = [
  {
    id: "payment_outage",
    name: "API Outage: Payment Gateway 504",
    service: "Payment API",
    region: "India-East",
    error_rate: 42.0,
    latency: 8.7,
    affected_users: 18420,
    title: "Critical Payment Gateway 504 Degradation",
    severity: "P0",
    icon: Flame,
    color: "text-rose-400"
  },
  {
    id: "db_saturation",
    name: "Database Connection Pool Saturation",
    service: "Order Database",
    region: "India-Central",
    error_rate: 31.4,
    latency: 6.2,
    affected_users: 9800,
    title: "PostgreSQL Primary Pool Exhaustion",
    severity: "P0",
    icon: Database,
    color: "text-amber-400"
  },
  {
    id: "kafka_lag",
    name: "Kafka Consumer Lag & Event Backpressure",
    service: "Event Ingestion Pipeline",
    region: "India-West",
    error_rate: 22.8,
    latency: 4.5,
    affected_users: 12500,
    title: "Kafka Consumer Partition Deadlock",
    severity: "P1",
    icon: Layers,
    color: "text-[#C084FC]"
  },
  {
    id: "cyber_alert",
    name: "Cybersecurity Alert: Auth Anomaly",
    service: "Auth Service",
    region: "Global",
    error_rate: 15.2,
    latency: 2.1,
    affected_users: 4300,
    title: "Suspicious Credential Stuffing Surge",
    severity: "P1",
    icon: ShieldAlert,
    color: "text-[#38BDF8]"
  },
  {
    id: "server_thermal",
    name: "Edge CDN BGP Routing Flap",
    service: "Edge Gateway",
    region: "APAC-South",
    error_rate: 18.5,
    latency: 3.8,
    affected_users: 6100,
    title: "Edge Anycast BGP Route Oscillation",
    severity: "P2",
    icon: Server,
    color: "text-[#A855F7]"
  }
];

export const SimulatorDrawer: React.FC<SimulatorDrawerProps> = ({
  isOpen,
  onClose,
  onRunSimulation,
  onSimulateChannelResponse,
  activeIncidentId
}) => {
  const [selectedPreset, setSelectedPreset] = useState(PRESET_SCENARIOS[0]);
  const [customService, setCustomService] = useState(PRESET_SCENARIOS[0].service);
  const [customErrorRate, setCustomErrorRate] = useState(PRESET_SCENARIOS[0].error_rate);
  const [customLatency, setCustomLatency] = useState(PRESET_SCENARIOS[0].latency);
  const [customUsers, setCustomUsers] = useState(PRESET_SCENARIOS[0].affected_users);

  if (!isOpen) return null;

  const handleSelectPreset = (preset: typeof PRESET_SCENARIOS[0]) => {
    setSelectedPreset(preset);
    setCustomService(preset.service);
    setCustomErrorRate(preset.error_rate);
    setCustomLatency(preset.latency);
    setCustomUsers(preset.affected_users);
  };

  const handleLaunch = () => {
    onRunSimulation({
      service: customService,
      region: selectedPreset.region,
      error_rate: customErrorRate,
      latency: customLatency,
      affected_users: customUsers,
      title: `${customService} Degradation Outage`
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md h-full bg-[#07050E] border-l border-[#8B5CF6]/30 p-6 flex flex-col justify-between overflow-y-auto custom-scroll shadow-2xl">
        
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-[#8B5CF6]/20">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-[#C084FC]" />
              <h3 className="text-sm font-black text-white uppercase tracking-wider font-heading">
                CHAOS & INCIDENT SIMULATOR
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-[#C4B5FD] hover:text-white rounded-lg hover:bg-[#1E143E] transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Section 1: Presets */}
          <div className="my-5">
            <span className="text-[10px] font-bold text-[#C4B5FD] uppercase tracking-wider block mb-2.5 font-heading">
              1. CHOOSE CHAOS SCENARIO
            </span>
            <div className="space-y-2">
              {PRESET_SCENARIOS.map((p) => {
                const Icon = p.icon;
                const isSelected = selectedPreset.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => handleSelectPreset(p)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? "border-[#A855F7]/60 bg-[#1E143E]/70 shadow-lg shadow-[#8B5CF6]/15"
                        : "border-[#8B5CF6]/15 bg-[#0D091A]/80 hover:border-[#8B5CF6]/35"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <Icon className={`h-4 w-4 ${p.color}`} />
                        <span className="text-xs font-bold text-white">{p.name}</span>
                      </div>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#07050E] text-[#C084FC] border border-[#8B5CF6]/30">
                        {p.severity}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Tuning Telemetry */}
          <div className="my-5 space-y-3">
            <span className="text-[10px] font-bold text-[#C4B5FD] uppercase tracking-wider block font-heading">
              2. CONFIGURE TELEMETRY METRICS
            </span>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-[#C4B5FD] block mb-1">Error Rate (%)</label>
                <input
                  type="number"
                  value={customErrorRate}
                  onChange={(e) => setCustomErrorRate(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#0D091A] border border-[#8B5CF6]/25 rounded-xl px-3 py-1.5 text-xs text-white focus:border-[#A855F7]/60 outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#C4B5FD] block mb-1">P99 Latency (s)</label>
                <input
                  type="number"
                  step="0.1"
                  value={customLatency}
                  onChange={(e) => setCustomLatency(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#0D091A] border border-[#8B5CF6]/25 rounded-xl px-3 py-1.5 text-xs text-white focus:border-[#A855F7]/60 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-[#C4B5FD] block mb-1">Affected Sessions</label>
              <input
                type="number"
                value={customUsers}
                onChange={(e) => setCustomUsers(parseInt(e.target.value) || 0)}
                className="w-full bg-[#0D091A] border border-[#8B5CF6]/25 rounded-xl px-3 py-1.5 text-xs text-white focus:border-[#A855F7]/60 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Footer Trigger */}
        <div className="pt-4 border-t border-[#8B5CF6]/20">
          <button
            onClick={handleLaunch}
            className="w-full flex items-center justify-center space-x-2 py-3 rounded-2xl bg-gradient-to-r from-rose-600 via-fuchsia-600 to-violet-700 text-xs font-black text-white shadow-xl shadow-fuchsia-600/30 hover:shadow-fuchsia-600/50 hover:brightness-110 active:scale-95 transition-all cursor-pointer font-heading border border-fuchsia-400/40"
          >
            <Flame className="h-4 w-4 animate-bounce" />
            <span>DISPATCH CHAOS OUTAGE</span>
          </button>
        </div>

      </div>
    </div>
  );
};
