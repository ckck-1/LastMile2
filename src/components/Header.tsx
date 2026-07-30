import React from "react";
import { Radio, AlertTriangle, ShieldCheck, Terminal, Smartphone } from "lucide-react";

interface HeaderProps {
  activeTab: "hub" | "dissemination" | "cell_broadcast" | "audit_logs";
  setActiveTab: (tab: "hub" | "dissemination" | "cell_broadcast" | "audit_logs") => void;
  apiLogsCount: number;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, apiLogsCount }) => {
  return (
    <header className="bg-[#E4E3E0] border-b border-[#141414] text-[#141414] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab("hub")}>
            <div className="bg-[#141414] p-2 rounded-none text-white font-bold flex items-center justify-center border border-[#141414]">
              <Radio className="w-5 h-5 animate-pulse text-[#D94A38]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-black font-technical-mono tracking-tighter uppercase text-[#141414]">LastMile</span>
                <span className="bg-[#141414] text-white text-[10px] uppercase font-technical-mono font-bold px-2 py-0.5">
                  IGAD 2026
                </span>
              </div>
              <p className="text-xs font-technical-serif italic text-[#141414]/70 hidden sm:block">
                Early Warning / Early Action Platform
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex space-x-1 sm:space-x-2">
            <button
              onClick={() => setActiveTab("hub")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-technical-mono uppercase font-bold transition-all border ${
                activeTab === "hub"
                  ? "bg-[#141414] text-white border-[#141414]"
                  : "bg-white hover:bg-[#E4E3E0] text-[#141414] border-[#141414]/40"
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-[#D94A38]" />
              <span>Risk & Alert Hub</span>
            </button>

            <button
              onClick={() => setActiveTab("dissemination")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-technical-mono uppercase font-bold transition-all border ${
                activeTab === "dissemination"
                  ? "bg-[#141414] text-white border-[#141414]"
                  : "bg-white hover:bg-[#E4E3E0] text-[#141414] border-[#141414]/40"
              }`}
            >
              <Radio className="w-4 h-4 text-[#D94A38]" />
              <span>Radio & SMS Delivery</span>
            </button>

            <button
              onClick={() => setActiveTab("cell_broadcast")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-technical-mono uppercase font-bold transition-all border ${
                activeTab === "cell_broadcast"
                  ? "bg-[#D94A38] text-white border-[#141414]"
                  : "bg-white hover:bg-[#E4E3E0] text-[#141414] border-[#141414]/40"
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span className="hidden sm:inline">Cell Broadcast</span>
              <span className="sm:hidden">Broadcast</span>
              <span className="bg-[#141414] text-white text-[9px] px-1.5 py-0.2 font-technical-mono ml-1">
                CONCEPT
              </span>
            </button>

            <button
              onClick={() => setActiveTab("audit_logs")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-technical-mono uppercase font-bold transition-all border ${
                activeTab === "audit_logs"
                  ? "bg-[#141414] text-white border-[#141414]"
                  : "bg-white hover:bg-[#E4E3E0] text-[#141414] border-[#141414]/40"
              }`}
            >
              <Terminal className="w-4 h-4 text-[#2E7D32]" />
              <span className="hidden md:inline">Audit Logs</span>
              {apiLogsCount > 0 && (
                <span className="bg-[#2E7D32] text-white text-[10px] px-1.5 py-0.2 font-technical-mono border border-[#141414]">
                  {apiLogsCount}
                </span>
              )}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
