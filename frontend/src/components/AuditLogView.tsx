import React, { useState, useEffect } from "react";
import { FileSpreadsheet, Shield, Search, RefreshCw, CheckCircle, Clock } from "lucide-react";
import { API_BASE } from "../services/api";

interface AuditEntry {
  id: string;
  incident_id?: string;
  actor: string;
  action: string;
  channel?: string;
  result: string;
  details?: Record<string, any>;
  timestamp: string;
}

export const AuditLogView: React.FC = () => {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [search, setSearch] = useState("");

  const loadLogs = async () => {
    try {
      const res = await fetch(`${API_BASE}/audit`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (e) {
      console.error("Failed to load audit logs", e);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const filtered = logs.filter(l =>
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    l.actor.toLowerCase().includes(search.toLowerCase()) ||
    (l.incident_id && l.incident_id.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="p-6 rounded-2xl glass-panel flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
              <FileSpreadsheet className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white flex items-center space-x-2">
                <span>TAMPER-EVIDENT AUDIT LEDGER</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Cryptographically verifiable event log of all agent tool invocations, human approvals, and channel dispatches.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={loadLogs}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Search */}
      <div className="p-4 rounded-2xl glass-panel border border-white/10 flex items-center space-x-3">
        <Search className="h-4 w-4 text-cyan-400 shrink-0" />
        <input
          type="text"
          placeholder="Filter audit log by actor, action, or incident ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent text-xs text-white placeholder:text-slate-500 focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl glass-panel border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950/80 border-b border-white/10 text-[10px] text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="p-3.5">TIMESTAMP</th>
                <th className="p-3.5">ACTOR</th>
                <th className="p-3.5">ACTION & EVENT</th>
                <th className="p-3.5">CHANNEL</th>
                <th className="p-3.5">INCIDENT ID</th>
                <th className="p-3.5 text-right">RESULT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 text-xs">
                    No audit records logged yet. Run a simulation to populate ledger.
                  </td>
                </tr>
              ) : (
                filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="p-3.5 text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</td>
                    <td className="p-3.5 font-bold text-white">{log.actor}</td>
                    <td className="p-3.5 text-slate-200">{log.action}</td>
                    <td className="p-3.5 text-cyan-400 capitalize">{log.channel || "—"}</td>
                    <td className="p-3.5 text-indigo-300">{log.incident_id || "—"}</td>
                    <td className="p-3.5 text-right">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        log.result === "SUCCESS" || log.result === "APPROVED"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : log.result === "TIMEOUT"
                          ? "bg-rose-500/20 text-rose-300"
                          : "bg-amber-500/20 text-amber-300"
                      }`}>
                        {log.result}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
