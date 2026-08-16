import React, { useState, useEffect } from "react";
import {
  Activity,
  X,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Radio,
  Database,
  Shield,
  Sparkles,
  Zap,
  Key,
  RefreshCw,
  Gift,
  ExternalLink
} from "lucide-react";
import {
  fetchFeatherlessModels,
  updateFeatherlessConfig,
  testFeatherlessConnection
} from "../services/api";

interface SystemDiagnosticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  diagnostics: Record<string, any> | null;
}

export const SystemDiagnosticsModal: React.FC<SystemDiagnosticsModalProps> = ({
  isOpen,
  onClose,
  diagnostics
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "featherless">("featherless");
  const [models, setModels] = useState<any[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("deepseek-ai/DeepSeek-V3.2");
  const [apiKey, setApiKey] = useState<string>("");
  const [llmMode, setLlmMode] = useState<string>("mock");
  const [promoCode, setPromoCode] = useState<string>("AIBUILD26");
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      fetchFeatherlessModels()
        .then((data) => {
          setModels(data.models || []);
          if (data.active_model) setSelectedModel(data.active_model);
          if (data.mode) setLlmMode(data.mode);
          if (data.promo_code) setPromoCode(data.promo_code);
        })
        .catch(console.error);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const defaultDiag = {
    agent: { status: "operational", latency_ms: 12, version: "1.0.0" },
    featherless: { status: "operational", latency_ms: llmMode === "live" ? 280 : 45, model: selectedModel },
    caspian: { status: "operational", latency_ms: 420, channels_active: 4 },
    database: { status: "operational", latency_ms: 3, pool_size: 20 },
    websocket: { status: "operational", active_clients: 1 }
  };

  const diag = diagnostics || defaultDiag;

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await testFeatherlessConnection({
        api_key: apiKey || undefined,
        model: selectedModel
      });
      setTestResult(res);
    } catch (err: any) {
      setTestResult({
        status: "error",
        message: err.message || "Failed to reach test endpoint"
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveConfig = async () => {
    setIsSaving(true);
    try {
      await updateFeatherlessConfig({
        model: selectedModel,
        api_key: apiKey || undefined,
        mode: apiKey ? "live" : llmMode
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      console.error("Failed to save config", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-2xl glass-panel p-6 border border-cyan-500/40 shadow-2xl relative max-h-[90vh] overflow-y-auto flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
              <Cpu className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white tracking-wide">SYSTEM DIAGNOSTICS & FEATHERLESS AI</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  v1.0
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Real-time health telemetry & Featherless open-source model manager.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 my-4 border-b border-white/5 pb-2">
          <button
            onClick={() => setActiveTab("featherless")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeTab === "featherless"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span>Featherless AI Brain</span>
          </button>

          <button
            onClick={() => setActiveTab("overview")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeTab === "overview"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <Activity className="h-3.5 w-3.5 text-indigo-400" />
            <span>Infrastructure Health</span>
          </button>
        </div>

        {/* Tab 1: Featherless AI Controls */}
        {activeTab === "featherless" && (
          <div className="space-y-4 text-xs">
            
            {/* Promo Code Callout Banner */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-amber-500/5 border border-amber-500/30 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  <Gift className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-bold text-amber-200">Featherless Hackathon Setup Guide Promo</div>
                  <div className="text-[11px] text-slate-300">
                    Get 1 month free Feather Chat + 40,000+ open-source models with promo code:{" "}
                    <span className="font-mono font-bold text-amber-300 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-500/40">
                      {promoCode}
                    </span>
                  </div>
                </div>
              </div>
              <a
                href="https://featherless.ai/models"
                target="_blank"
                rel="noreferrer"
                className="hidden sm:flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-200 border border-amber-500/40 hover:bg-amber-500/30 transition-all font-semibold text-[11px]"
              >
                <span>Browse Models</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            {/* Model Catalog Selector */}
            <div className="space-y-2">
              <label className="font-bold text-white uppercase tracking-wider text-[10px] flex items-center space-x-1.5">
                <Cpu className="h-3.5 w-3.5 text-cyan-400" />
                <span>Select Active Featherless Open-Source Model</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
                {models.map((m) => {
                  const isSelected = selectedModel === m.id;
                  return (
                    <div
                      key={m.id}
                      onClick={() => setSelectedModel(m.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? "bg-cyan-500/15 border-cyan-400 shadow-md shadow-cyan-500/10 glow-signal"
                          : "bg-slate-950/60 border-white/5 hover:border-white/20 hover:bg-slate-900/60"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-xs">{m.name}</span>
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-white/10">
                            {m.size}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {m.description}
                        </p>
                      </div>
                      <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[9px]">
                        <span className="text-cyan-400 font-medium truncate max-w-[150px]">
                          {m.recommended_for}
                        </span>
                        {isSelected && (
                          <span className="font-bold text-emerald-400 flex items-center space-x-0.5">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>ACTIVE</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* API Key Configuration */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Key className="h-3.5 w-3.5 text-cyan-400" />
                  <span className="font-bold text-white text-xs">Featherless API Key Authorization</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => setLlmMode("mock")}
                    className={`px-2.5 py-0.5 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                      llmMode === "mock" && !apiKey
                        ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/40"
                        : "text-slate-400 border-transparent hover:text-white"
                    }`}
                  >
                    Demo Engine
                  </button>
                  <button
                    onClick={() => setLlmMode("live")}
                    className={`px-2.5 py-0.5 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                      llmMode === "live" || !!apiKey
                        ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                        : "text-slate-400 border-transparent hover:text-white"
                    }`}
                  >
                    Live API
                  </button>
                </div>
              </div>

              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="fw-... (Optional: paste your Featherless API key from Step 02)"
                className="w-full rounded-lg bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-500 border border-white/10 focus:border-cyan-400 focus:outline-none font-mono"
              />
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>Base URL: <code className="text-cyan-400">https://api.featherless.ai/v1</code></span>
                <span>Concurrency: 4 units max (Auto-Retry on 503 & 429)</span>
              </div>
            </div>

            {/* Test Connection Output */}
            {testResult && (
              <div
                className={`p-3 rounded-xl border text-xs ${
                  testResult.status === "connected" || testResult.status === "simulated"
                    ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-300"
                    : "bg-rose-950/20 border-rose-500/40 text-rose-300"
                }`}
              >
                <div className="flex items-center justify-between font-bold mb-1">
                  <span className="flex items-center space-x-1.5">
                    {testResult.status === "connected" || testResult.status === "simulated" ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-rose-400" />
                    )}
                    <span>
                      {testResult.status === "connected"
                        ? "Live Featherless API Benchmark Success"
                        : testResult.status === "simulated"
                        ? "High-Fidelity Mock Engine Operational"
                        : "Benchmark Warning / Offline"}
                    </span>
                  </span>
                  <span className="font-mono text-[11px]">
                    {testResult.latency_ms}ms roundtrip
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">{testResult.message}</p>
                {testResult.reply && (
                  <div className="mt-1.5 p-2 rounded bg-slate-900/80 border border-white/5 font-mono text-[10px] text-slate-300 italic">
                    "{testResult.reply}"
                  </div>
                )}
              </div>
            )}

            {/* Controls */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleTestConnection}
                disabled={isTesting}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 border border-white/10 font-bold transition-all cursor-pointer"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isTesting ? "animate-spin text-cyan-400" : ""}`} />
                <span>{isTesting ? "Benchmarking..." : "Test Connection Benchmark"}</span>
              </button>

              <button
                onClick={handleSaveConfig}
                disabled={isSaving}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold shadow-md shadow-cyan-500/20 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                <Zap className="h-3.5 w-3.5" />
                <span>{isSaving ? "Saving..." : saveSuccess ? "Saved Active Model!" : "Apply Active Model"}</span>
              </button>
            </div>

          </div>
        )}

        {/* Tab 2: Infrastructure Telemetry */}
        {activeTab === "overview" && (
          <div className="space-y-3 text-xs my-2">
            
            {/* Agent */}
            <div className="p-3 rounded-xl bg-slate-950/70 border border-white/5 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <Shield className="h-4 w-4 text-cyan-400" />
                <div>
                  <div className="font-bold text-white">Agent Coordination Engine</div>
                  <div className="text-[10px] text-slate-400">Observe-Think-Plan-Act Loop</div>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                HEALTHY ({diag.agent?.latency_ms || 12}ms)
              </span>
            </div>

            {/* Featherless */}
            <div className="p-3 rounded-xl bg-slate-950/70 border border-white/5 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <Cpu className="h-4 w-4 text-purple-400" />
                <div>
                  <div className="font-bold text-white">Featherless AI Inference</div>
                  <div className="text-[10px] text-slate-400">{selectedModel}</div>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                OPERATIONAL ({diag.featherless?.latency_ms || 280}ms)
              </span>
            </div>

            {/* Caspian */}
            <div className="p-3 rounded-xl bg-slate-950/70 border border-white/5 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <Radio className="h-4 w-4 text-indigo-400" />
                <div>
                  <div className="font-bold text-white">Caspian Unified Comm SDK</div>
                  <div className="text-[10px] text-slate-400">Telegram, Email, Slack, WhatsApp</div>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                CONNECTED ({diag.caspian?.channels_active || 4} channels)
              </span>
            </div>

            {/* Database */}
            <div className="p-3 rounded-xl bg-slate-950/70 border border-white/5 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <Database className="h-4 w-4 text-amber-400" />
                <div>
                  <div className="font-bold text-white">Database & Memory Store</div>
                  <div className="text-[10px] text-slate-400">SQLite / PostgreSQL Engine</div>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                OPERATIONAL ({diag.database?.latency_ms || 3}ms)
              </span>
            </div>

          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-white/10 flex justify-end shrink-0 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Dismiss
          </button>
        </div>

      </div>
    </div>
  );
};

