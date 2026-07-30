import React, { useState, useEffect } from "react";
import { Terminal, RefreshCw, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { ApiCallLog } from "../types";
import { fetchSystemLogs } from "../services/api";

export const AuditLogModal: React.FC = () => {
  const [logs, setLogs] = useState<ApiCallLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      const data = await fetchSystemLogs();
      setLogs(data);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <div className="tech-panel mb-6 font-technical-mono">
      <div className="tech-pane-title flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-[#D94A38]" />
          <span>System Audit Logs & Live HTTP Traces</span>
        </div>

        <button
          onClick={loadLogs}
          disabled={isLoading}
          className="tech-btn flex items-center space-x-1"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          <span>Refresh Traces</span>
        </button>
      </div>

      <div className="p-4 sm:p-5">
        {logs.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#141414]/70 bg-[#E4E3E0] border border-[#141414]">
            No HTTP trace logs recorded yet. Execute a location search or alert request above.
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {logs.map((log) => {
              const isSuccess = log.status === 200 || log.status === "200";
              return (
                <div
                  key={log.id}
                  className="p-3 bg-white border border-[#141414] text-xs flex flex-col space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {isSuccess ? (
                        <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-[#D94A38] shrink-0" />
                      )}
                      <span className="font-bold text-[#141414]">{log.apiName}</span>
                      <span
                        className={`px-1.5 py-0.2 border text-[10px] font-bold ${
                          isSuccess
                            ? "bg-[#E8F5E9] border-[#2E7D32] text-[#2E7D32]"
                            : "bg-[#FFEBEE] border-[#D94A38] text-[#D94A38]"
                        }`}
                      >
                        HTTP {log.status}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-[10px] text-[#141414]/60">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-[#141414]/60" />
                        <span>{log.durationMs}ms</span>
                      </span>
                      <span>•</span>
                      <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#141414] truncate">
                    <span className="text-[#D94A38] font-bold">{log.method}</span> {log.endpoint}
                  </p>

                  {log.params && (
                    <pre className="text-[10px] text-[#141414] bg-[#E4E3E0] p-2 border border-[#141414] overflow-x-auto">
                      {JSON.stringify(log.params)}
                    </pre>
                  )}

                  {log.error && (
                    <div className="text-[11px] text-[#D94A38] bg-[#FFEBEE] p-2 border border-[#D94A38]">
                      <strong>Error:</strong> {log.error}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
