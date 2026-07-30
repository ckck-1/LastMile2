import React from "react";
import { Radio, AlertOctagon, Smartphone, ArrowRight, ShieldCheck, Zap } from "lucide-react";

interface CellBroadcastConceptProps {
  locationName: string;
  alertTitle: string;
  alertText: string;
}

export const CellBroadcastConcept: React.FC<CellBroadcastConceptProps> = ({
  locationName,
  alertTitle,
  alertText,
}) => {
  return (
    <div className="tech-panel mb-6">
      <div className="tech-pane-title flex items-center justify-between bg-[#141414] text-white">
        <div className="flex items-center space-x-2">
          <AlertOctagon className="w-4 h-4 text-[#D94A38]" />
          <span>3GPP Cell Broadcast Architecture (Future MNO Roadmap)</span>
        </div>
        <span className="bg-[#D94A38] text-white text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 font-technical-mono">
          CONCEPTUAL ARCHITECTURE
        </span>
      </div>

      <div className="p-4 sm:p-5 font-technical-mono text-xs border-b border-[#141414] bg-[#E4E3E0]">
        <div className="flex flex-col md:flex-row items-start justify-between gap-4">
          <div className="max-w-xl">
            <div className="flex items-center space-x-1 text-[#D94A38] font-bold uppercase text-[10px] mb-1">
              <Zap className="w-3.5 h-3.5" />
              <span>Next-Phase Telecom Integration Vision</span>
            </div>
            <h2 className="text-base font-bold text-[#141414] font-technical-serif">
              National Emergency Cell Broadcast Warning System
            </h2>
            <p className="text-xs text-[#141414]/80 mt-1 leading-relaxed">
              While Africa&apos;s Talking SMS and Community Radio TTS are fully live in this prototype today, scaling to millions of citizens across East Africa during sudden flash floods or extreme drought alerts requires MNO-level Cell Broadcast (3GPP ETWS / Commercial Mobile Alert System).
            </p>
          </div>

          <div className="bg-white border border-[#141414] p-3 text-xs text-[#141414] shrink-0 max-w-xs shadow-[2px_2px_0px_rgba(20,20,20,0.1)]">
            <div className="font-bold text-[#D94A38] mb-1 flex items-center space-x-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Judge Pitch Callout:</span>
            </div>
            <p className="italic text-[11px] leading-snug font-technical-serif">
              &ldquo;SMS and Radio are fully live right now. Next, this shows the MNO deployment roadmap for Safaricom, Ethio Telecom, and Hormuud.&rdquo;
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-2 gap-6 font-technical-mono">
        {/* Mockup 1: Mobile Phone Lockscreen Broadcast Alert */}
        <div className="bg-white border border-[#141414] p-4 flex flex-col items-center">
          <span className="text-xs font-bold text-[#141414] mb-3 flex items-center space-x-1 uppercase">
            <Smartphone className="w-4 h-4 text-[#D94A38]" />
            <span>Simulated Lockscreen Alert</span>
          </span>

          {/* Smartphone Frame Mockup */}
          <div className="w-full max-w-xs bg-[#E4E3E0] border-2 border-[#141414] p-3 shadow-[4px_4px_0px_rgba(20,20,20,0.15)] relative">
            <div className="w-16 h-2 bg-[#141414] mx-auto mb-4"></div>

            {/* Lockscreen content */}
            <div className="bg-white border border-[#141414] p-4 text-center min-h-[260px] flex flex-col justify-between">
              <div>
                <p className="text-2xl font-bold text-[#141414]">12:45</p>
                <p className="text-[10px] text-[#141414]/70">Wednesday, IGAD Sector Alert</p>
              </div>

              {/* Cell Broadcast Alert Popup */}
              <div className="bg-[#D94A38] text-white p-3 text-left border border-[#141414] my-4 shadow-[2px_2px_0px_rgba(20,20,20,0.2)]">
                <div className="flex items-center justify-between pb-1 border-b border-white/40 mb-1.5">
                  <span className="text-[9px] font-bold uppercase flex items-center space-x-1">
                    <Radio className="w-3 h-3" />
                    <span>EMERGENCY CELL BROADCAST</span>
                  </span>
                  <span className="text-[8px]">NOW</span>
                </div>
                <h5 className="font-bold text-xs mb-1">{alertTitle || "Disaster Emergency Alert"}</h5>
                <p className="text-[10px] leading-snug font-technical-serif">
                  {alertText ? alertText.slice(0, 130) + "..." : `IGAD Disaster Alert for ${locationName}. Take protective action.`}
                </p>
              </div>

              <p className="text-[9px] text-[#141414]/60">Pushed by Cell Tower • Zero Data Required</p>
            </div>

            <div className="w-16 h-1 bg-[#141414] mx-auto mt-3"></div>
          </div>
        </div>

        {/* Column 2: Architectural Advantages & Telecom Integration Flow */}
        <div className="flex flex-col justify-between space-y-4">
          <div className="bg-white border border-[#141414] p-4 text-xs">
            <h4 className="font-bold text-[#141414] uppercase mb-2 border-b border-[#141414]/20 pb-1">
              Cell Broadcast Benefits for IGAD:
            </h4>
            <ul className="space-y-2 text-[11px] text-[#141414]">
              <li className="flex items-start space-x-2">
                <ArrowRight className="w-3.5 h-3.5 text-[#D94A38] shrink-0 mt-0.5" />
                <span>
                  <strong>Zero Network Congestion:</strong> Broadcasts 1 payload to millions simultaneously without SMS network lag.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <ArrowRight className="w-3.5 h-3.5 text-[#D94A38] shrink-0 mt-0.5" />
                <span>
                  <strong>No Phone Numbers Needed:</strong> Reaches every active handset connected to cell towers in the sector.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <ArrowRight className="w-3.5 h-3.5 text-[#D94A38] shrink-0 mt-0.5" />
                <span>
                  <strong>Feature Phone Support:</strong> Standard 3GPP ETWS works on basic non-smart handsets.
                </span>
              </li>
            </ul>
          </div>

          {/* MNO Partner Integration Roadmap */}
          <div className="bg-white border border-[#141414] p-4 text-xs">
            <h4 className="font-bold text-[#141414] uppercase mb-2 border-b border-[#141414]/20 pb-1">Target MNO Integration Protocols:</h4>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="p-2 bg-[#E4E3E0] border border-[#141414] text-[#141414] font-bold">
                Safaricom (Kenya) • CAP Protocol
              </div>
              <div className="p-2 bg-[#E4E3E0] border border-[#141414] text-[#141414] font-bold">
                Ethio Telecom (Ethiopia) • CBE Gateway
              </div>
              <div className="p-2 bg-[#E4E3E0] border border-[#141414] text-[#141414] font-bold">
                Hormuud (Somalia) • CBC Interface
              </div>
              <div className="p-2 bg-[#E4E3E0] border border-[#141414] text-[#141414] font-bold">
                MTN Uganda & Zain Sudan
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
