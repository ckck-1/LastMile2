import React, { useState } from "react";
import { AlertGenerationResult, LivelihoodAlert } from "../types";
import { Sparkles, Languages, Tractor, Compass, Building, CheckCircle2, FileText, Share2, Copy, Check } from "lucide-react";

interface HyperlocalAlertsProps {
  alertResult: AlertGenerationResult;
  onSelectAlertForDissemination?: (text: string, title: string) => void;
}

export const HyperlocalAlerts: React.FC<HyperlocalAlertsProps> = ({
  alertResult,
  onSelectAlertForDissemination,
}) => {
  const [selectedLivelihood, setSelectedLivelihood] = useState<"farmer" | "pastoralist" | "urban_resident">("farmer");
  const [language, setLanguage] = useState<"en" | "sw">("en");
  const [copied, setCopied] = useState(false);

  const activeAlert: LivelihoodAlert | undefined = alertResult.alerts.find(
    (a) => a.livelihood === selectedLivelihood
  ) || alertResult.alerts[0];

  if (!activeAlert) return null;

  const currentTitle = language === "en" ? activeAlert.titleEn : activeAlert.titleSw;
  const currentText = language === "en" ? activeAlert.alertEn : activeAlert.alertSw;
  const currentActions = language === "en" ? activeAlert.keyActionsEn : activeAlert.keyActionsSw;

  const handleCopyAlert = () => {
    const copyText = `${currentTitle}\n\n${currentText}\n\nKey Actions:\n${currentActions
      .map((act) => `• ${act}`)
      .join("\n")}`;
    navigator.clipboard.writeText(copyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="tech-panel">
      {/* Header with Title and Language Toggle */}
      <div className="tech-pane-title flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-[#D94A38]" />
          <span>Localized Action Alerts</span>
        </div>

        {/* Language Switcher Toggle */}
        <div className="flex items-center space-x-1 font-technical-mono text-[10px] font-bold">
          <button
            onClick={() => setLanguage("en")}
            className={`px-2 py-0.5 border ${
              language === "en"
                ? "bg-[#141414] text-white border-[#141414]"
                : "bg-white text-[#141414] border-[#141414]/30 hover:bg-[#E4E3E0]"
            }`}
          >
            EN
          </button>
          <span>|</span>
          <button
            onClick={() => setLanguage("sw")}
            className={`px-2 py-0.5 border ${
              language === "sw"
                ? "bg-[#141414] text-white border-[#141414]"
                : "bg-white text-[#141414] border-[#141414]/30 hover:bg-[#E4E3E0]"
            }`}
          >
            SW
          </button>
        </div>
      </div>

      {/* Livelihood Selector Tabs */}
      <div className="grid grid-cols-3 border-b border-[#141414] font-technical-mono text-xs font-bold text-center">
        <button
          onClick={() => setSelectedLivelihood("farmer")}
          className={`p-2.5 uppercase border-r border-[#141414] transition-all flex items-center justify-center space-x-1.5 ${
            selectedLivelihood === "farmer"
              ? "bg-[#141414] text-white"
              : "bg-[#E4E3E0] text-[#141414] hover:bg-white"
          }`}
        >
          <Tractor className="w-4 h-4" />
          <span>Farmer</span>
        </button>

        <button
          onClick={() => setSelectedLivelihood("pastoralist")}
          className={`p-2.5 uppercase border-r border-[#141414] transition-all flex items-center justify-center space-x-1.5 ${
            selectedLivelihood === "pastoralist"
              ? "bg-[#141414] text-white"
              : "bg-[#E4E3E0] text-[#141414] hover:bg-white"
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Pastoralist</span>
        </button>

        <button
          onClick={() => setSelectedLivelihood("urban_resident")}
          className={`p-2.5 uppercase transition-all flex items-center justify-center space-x-1.5 ${
            selectedLivelihood === "urban_resident"
              ? "bg-[#141414] text-white"
              : "bg-[#E4E3E0] text-[#141414] hover:bg-white"
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Urban</span>
        </button>
      </div>

      {/* Main Alert Body Narrative */}
      <div className="p-5 font-technical-serif text-[#141414]">
        <div className="flex items-center justify-between mb-3 border-b border-[#141414]/15 pb-2">
          <span className="bg-[#141414] text-white font-technical-mono text-[10px] uppercase font-bold px-2 py-0.5">
            {language === "en" ? "Actionable Alert" : "Tahadhari"}
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyAlert}
              className="px-2 py-1 bg-[#E4E3E0] border border-[#141414] text-[#141414] text-[10px] font-technical-mono font-bold hover:bg-white transition-colors flex items-center space-x-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#2E7D32]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "COPIED" : "COPY"}</span>
            </button>

            {onSelectAlertForDissemination && (
              <button
                onClick={() => onSelectAlertForDissemination(currentText, currentTitle)}
                className="tech-btn-accent flex items-center space-x-1 text-[10px]"
              >
                <Share2 className="w-3 h-3" />
                <span>BROADCAST</span>
              </button>
            )}
          </div>
        </div>

        <h4 className="text-lg font-bold text-[#141414] mb-2 leading-snug">{currentTitle}</h4>
        <p className="text-sm text-[#141414] leading-relaxed mb-4">{currentText}</p>

        {/* Key Action Steps */}
        <div className="border-t border-[#141414]/20 pt-3">
          <p className="text-xs font-bold text-[#D94A38] uppercase font-technical-mono mb-2">
            {language === "en" ? "Key Recommended Actions:" : "Hatua Kuu Zilizopendekezwa:"}
          </p>
          <ul className="space-y-1.5 font-sans">
            {currentActions.map((action, idx) => (
              <li key={idx} className="flex items-start space-x-2 text-xs text-[#141414]">
                <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0 mt-0.5" />
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Audit Citation of Real Facts */}
      {activeAlert.factsReferenced && activeAlert.factsReferenced.length > 0 && (
        <div className="bg-[#E4E3E0] border-t border-[#141414] p-3.5 text-xs text-[#141414]">
          <div className="flex items-center space-x-1.5 font-bold font-technical-mono text-[11px] mb-1">
            <FileText className="w-3.5 h-3.5 text-[#D94A38]" />
            <span>Auditable Facts Grounding:</span>
          </div>
          <ul className="list-disc list-inside space-y-0.5 text-[10px] font-technical-mono text-[#141414]/80">
            {activeAlert.factsReferenced.map((fact, i) => (
              <li key={i}>{fact}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
