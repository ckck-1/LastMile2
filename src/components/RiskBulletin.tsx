import React from "react";
import { RainfallMetrics } from "../types";
import { Activity, Droplets, Calendar, Calculator, Info, ShieldAlert } from "lucide-react";

interface RiskBulletinProps {
  rainfall: RainfallMetrics;
}

export const RiskBulletin: React.FC<RiskBulletinProps> = ({ rainfall }) => {
  return (
    <div className="tech-panel">
      <div className="tech-pane-title flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-[#D94A38]" />
          <span>Technical Bulletin: Precipitation & Risk</span>
        </div>
        <span
          className="px-2 py-0.5 text-[10px] font-technical-mono font-bold uppercase text-white"
          style={{ backgroundColor: rainfall.colorCode }}
        >
          {rainfall.riskLabel}
        </span>
      </div>

      {/* Primary Data Rows */}
      <div className="divide-y divide-[#141414]/15 font-technical-mono text-xs">
        <div className="tech-data-row">
          <span className="text-[#141414]/60 uppercase text-[10px]">30-Day Cumulative</span>
          <span className="text-right font-bold text-[#141414]">{rainfall.sum30Days} mm</span>
        </div>

        <div className="tech-data-row">
          <span className="text-[#141414]/60 uppercase text-[10px]">90-Day Cumulative</span>
          <span className="text-right font-bold text-[#141414]">{rainfall.sum90Days} mm</span>
        </div>

        <div className="tech-data-row">
          <span className="text-[#141414]/60 uppercase text-[10px]">3-Yr Historical Avg</span>
          <span className="text-right font-bold text-[#141414]">{rainfall.historicalAvg90Days} mm</span>
        </div>

        <div className="tech-data-row">
          <span className="text-[#141414]/60 uppercase text-[10px]">Percent of Normal</span>
          <span className="text-right font-bold" style={{ color: rainfall.colorCode }}>
            {rainfall.percentOfNormal}%
          </span>
        </div>
      </div>

      {/* Risk Category Card */}
      <div
        className="p-4 text-white m-4 border border-[#141414] font-technical-mono shadow-[2px_2px_0px_rgba(20,20,20,0.1)]"
        style={{ backgroundColor: rainfall.colorCode || "#D94A38" }}
      >
        <div className="text-[10px] uppercase font-bold tracking-wider opacity-90">RISK CATEGORY</div>
        <div className="text-xl sm:text-2xl font-black uppercase mt-1 tracking-tight">{rainfall.riskLabel}</div>
        <div className="text-[10px] mt-2 opacity-90 font-mono">
          CLASSIFICATION: {rainfall.riskCategory.toUpperCase()} • DEVIATION: {rainfall.percentOfNormal}%
        </div>
      </div>

      {/* Mathematical Formula Breakdown */}
      <div className="p-4 bg-[#E4E3E0] border-t border-[#141414] text-xs font-technical-mono text-[#141414]">
        <div className="flex items-center space-x-1.5 font-bold mb-1">
          <Info className="w-4 h-4 text-[#D94A38]" />
          <span>SPI & Threshold Calculation Formula:</span>
        </div>
        <p className="text-[11px] leading-relaxed opacity-90">
          {rainfall.formulaExplanation}
        </p>
      </div>

      {/* Threshold Bands Reference */}
      <div className="p-4 border-t border-[#141414] bg-white font-technical-mono">
        <p className="text-[10px] font-bold text-[#141414]/80 uppercase mb-2 flex items-center space-x-1">
          <ShieldAlert className="w-3.5 h-3.5 text-[#D94A38]" />
          <span>IGAD Regional Threshold Spectrum (% of Normal Baseline):</span>
        </p>

        {/* Drought Deficit Spectrum */}
        <div className="mb-2.5">
          <span className="text-[9px] uppercase font-bold text-[#141414]/60 block mb-1">Drought Deficit Bands (&lt;80%):</span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 text-[10px]">
            <div className="p-1.5 bg-[#E4E3E0] border border-[#141414] text-[#2E7D32] font-bold text-center">
              80–119%: Normal
            </div>
            <div className="p-1.5 bg-[#E4E3E0] border border-[#141414] text-[#141414] font-bold text-center">
              65–79%: Mild Deficit
            </div>
            <div className="p-1.5 bg-[#FFECB3] border border-[#141414] text-[#B71C1C] font-bold text-center">
              45–64%: Moderate
            </div>
            <div className="p-1.5 bg-[#D94A38] border border-[#141414] text-white font-bold text-center">
              &lt; 45%: Severe Drought
            </div>
          </div>
        </div>

        {/* Precipitation Surplus Spectrum */}
        <div>
          <span className="text-[9px] uppercase font-bold text-[#141414]/60 block mb-1">Precipitation Surplus Bands (≥120%):</span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 text-[10px]">
            <div className="p-1.5 bg-[#E4E3E0] border border-[#141414] text-[#2E7D32] font-bold text-center">
              80–119%: Normal
            </div>
            <div className="p-1.5 bg-[#E0F2FE] border border-[#141414] text-[#0284C7] font-bold text-center">
              120–149%: High Rainfall
            </div>
            <div className="p-1.5 bg-[#0284C7] border border-[#141414] text-white font-bold text-center">
              ≥ 150%: Severe Flood
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
