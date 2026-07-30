import { useState, useEffect, useCallback } from "react";
import { Header } from "./components/Header";
import { LocationSearch } from "./components/LocationSearch";
import { RiskBulletin } from "./components/RiskBulletin";
import { InfrastructureList } from "./components/InfrastructureList";
import { InteractiveMap } from "./components/InteractiveMap";
import { HyperlocalAlerts } from "./components/HyperlocalAlerts";
import { RadioDissemination } from "./components/RadioDissemination";
import { SmsDissemination } from "./components/SmsDissemination";
import { CellBroadcastConcept } from "./components/CellBroadcastConcept";
import { AuditLogModal } from "./components/AuditLogModal";
import { DataAuditFooter } from "./components/DataAuditFooter";

import {
  RainfallMetrics,
  InfrastructureData,
  AlertGenerationResult,
} from "./types";

import {
  fetchRainfallData,
  fetchInfrastructureData,
  generateHyperlocalAlerts,
  fetchSystemLogs,
} from "./services/api";

import { AlertCircle, RefreshCw, Loader2, Sparkles, MapPin, Radio } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"hub" | "dissemination" | "cell_broadcast" | "audit_logs">("hub");

  // Selected Location State (Default: Garissa, Kenya - IGAD drought hotspot)
  const [currentLocation, setCurrentLocation] = useState({
    name: "Garissa, Kenya",
    lat: -0.4532,
    lon: 39.646,
    country: "Kenya",
  });

  // Data Layer States
  const [rainfallData, setRainfallData] = useState<RainfallMetrics | null>(null);
  const [infrastructureData, setInfrastructureData] = useState<InfrastructureData | null>(null);
  const [alertResult, setAlertResult] = useState<AlertGenerationResult | null>(null);

  // Loading & Error States
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Active Broadcast Item
  const [broadcastTarget, setBroadcastTarget] = useState<{
    title: string;
    text: string;
  }>({
    title: "",
    text: "",
  });

  const [apiLogsCount, setApiLogsCount] = useState<number>(0);

  // Load all live data for chosen location
  const loadLocationData = useCallback(
    async (loc: { name: string; lat: number; lon: number; country?: string }) => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        // Step 1: Fetch Live Rainfall from Open-Meteo
        setLoadingStep("Fetching live historical rainfall & SPI metrics from Open-Meteo API...");
        const rainfall = await fetchRainfallData(loc.lat, loc.lon, loc.name);
        setRainfallData(rainfall);

        // Step 2: Fetch Live Infrastructure from Overpass OSM API
        setLoadingStep("Querying real OpenStreetMap amenity & water nodes via Overpass API...");
        const infra = await fetchInfrastructureData(loc.lat, loc.lon);
        setInfrastructureData(infra);

        // Step 3: Generate Hyperlocal AI Alerts via Gemini API
        setLoadingStep("Generating fact-constrained localized alerts via Gemini AI...");
        const alerts = await generateHyperlocalAlerts(
          loc.name,
          rainfall.riskCategory,
          rainfall.riskLabel,
          rainfall,
          infra.facilities
        );
        setAlertResult(alerts);

        // Set default broadcast text
        if (alerts.alerts && alerts.alerts.length > 0) {
          const firstAlert = alerts.alerts[0];
          setBroadcastTarget({
            title: firstAlert.titleSw || firstAlert.titleEn,
            text: firstAlert.alertSw || firstAlert.alertEn,
          });
        }

        // Refresh system logs
        const logs = await fetchSystemLogs();
        setApiLogsCount(logs.length);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        setErrorMessage(
          `Live API query failed for ${loc.name}: ${msg}. Please check your connection and retry.`
        );
      } finally {
        setIsLoading(false);
        setLoadingStep("");
      }
    },
    []
  );

  // Initial load on startup
  useEffect(() => {
    loadLocationData(currentLocation);
  }, [loadLocationData, currentLocation]);

  const handleSelectLocation = (loc: { name: string; lat: number; lon: number; country?: string }) => {
    setCurrentLocation(loc);
    loadLocationData(loc);
  };

  const handleSelectAlertForDissemination = (text: string, title: string) => {
    setBroadcastTarget({ title, text });
    setActiveTab("dissemination");
  };

  return (
    <div className="min-h-screen bg-[#E4E3E0] text-[#141414] font-sans antialiased flex flex-col selection:bg-[#D94A38] selection:text-white">
      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        apiLogsCount={apiLogsCount}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Banner Alert Header */}
        <div className="bg-white border border-[#141414] p-4 sm:p-5 mb-6 shadow-[2px_2px_0px_rgba(20,20,20,0.1)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-none bg-[#D94A38] animate-ping"></span>
              <h1 className="text-lg sm:text-xl font-bold font-technical-serif text-[#141414] tracking-tight">
                IGAD Early Warning Translation & Dissemination Engine
              </h1>
            </div>
            <p className="text-xs text-[#141414]/80 mt-1 max-w-2xl leading-relaxed">
              Transforming raw hydro-meteorological data into plain-language actionable emergency alerts for farmers, pastoralists, and urban communities across East Africa.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs font-technical-mono text-[#141414] shrink-0 bg-[#E4E3E0] px-3 py-2 border border-[#141414]">
            <MapPin className="w-4 h-4 text-[#D94A38]" />
            <span>Target Sector: <strong className="text-[#D94A38] font-bold">{currentLocation.name}</strong></span>
          </div>
        </div>

        {/* TAB 1: RISK & ALERT HUB */}
        {activeTab === "hub" && (
          <div>
            {/* Location Search Bar & Presets */}
            <LocationSearch
              onSelectLocation={handleSelectLocation}
              isLoading={isLoading}
            />

            {/* Loading State Overlay */}
            {isLoading && (
              <div className="bg-white border border-[#141414] p-8 mb-6 text-center shadow-[2px_2px_0px_rgba(20,20,20,0.1)]">
                <Loader2 className="w-8 h-8 text-[#D94A38] animate-spin mx-auto mb-3" />
                <h3 className="text-sm font-bold font-technical-serif text-[#141414]">Executing Live API Data Pipeline...</h3>
                <p className="text-xs text-[#D94A38] font-technical-mono mt-1">{loadingStep}</p>
              </div>
            )}

            {/* Error State Banner */}
            {errorMessage && !isLoading && (
              <div className="bg-[#FFEBEE] border border-[#D94A38] p-5 mb-6 text-xs text-[#141414] flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-[#D94A38] shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-bold text-sm text-[#D94A38] font-technical-serif">Live API Retrieval Error</h3>
                  <p className="mt-1 leading-relaxed">{errorMessage}</p>
                  <button
                    onClick={() => loadLocationData(currentLocation)}
                    className="mt-3 tech-btn-accent flex items-center space-x-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Retry Live API Call</span>
                  </button>
                </div>
              </div>
            )}

            {/* Primary Results Display */}
            {!isLoading && rainfallData && infrastructureData && alertResult && (
              <div className="space-y-6">
                {/* Side-by-Side: Technical Bulletin + AI Hyperlocal Alert */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column: Technical Risk Bulletin */}
                  <RiskBulletin rainfall={rainfallData} />

                  {/* Right Column: AI Localized Alert */}
                  <HyperlocalAlerts
                    alertResult={alertResult}
                    onSelectAlertForDissemination={handleSelectAlertForDissemination}
                  />
                </div>

                {/* Geospatial Map View */}
                <InteractiveMap
                  centerLat={currentLocation.lat}
                  centerLon={currentLocation.lon}
                  locationName={currentLocation.name}
                  facilities={infrastructureData.facilities}
                />

                {/* Nearby Infrastructure Details */}
                <InfrastructureList infrastructure={infrastructureData} />
              </div>
            )}
          </div>
        )}

        {/* TAB 2: RADIO & SMS DISSEMINATION */}
        {activeTab === "dissemination" && (
          <div>
            <div className="mb-4 bg-white border border-[#141414] p-4 flex items-center justify-between font-technical-mono">
              <div className="flex items-center space-x-2 text-xs text-[#141414]">
                <Radio className="w-4 h-4 text-[#D94A38]" />
                <span>
                  Disseminating Alert for: <strong className="text-[#D94A38] font-bold">{currentLocation.name}</strong>
                </span>
              </div>

              <button
                onClick={() => setActiveTab("hub")}
                className="text-xs text-[#D94A38] hover:underline font-bold uppercase"
              >
                Change Location / Alert
              </button>
            </div>

            {/* Radio Announcement Player */}
            <RadioDissemination
              alertText={broadcastTarget.text || alertResult?.alerts[0]?.alertSw || alertResult?.alerts[0]?.alertEn || "Take protective action for weather conditions."}
              alertTitle={broadcastTarget.title || alertResult?.alerts[0]?.titleSw || alertResult?.alerts[0]?.titleEn || "Emergency Early Warning Alert"}
              locationName={currentLocation.name}
            />

            {/* Africa's Talking SMS Gateway */}
            <SmsDissemination
              alertText={broadcastTarget.text || alertResult?.alerts[0]?.alertSw || alertResult?.alerts[0]?.alertEn || "Take protective action for weather conditions."}
              alertTitle={broadcastTarget.title || alertResult?.alerts[0]?.titleSw || alertResult?.alerts[0]?.titleEn || "Emergency Early Warning Alert"}
              locationName={currentLocation.name}
            />
          </div>
        )}

        {/* TAB 3: CELL BROADCAST CONCEPT (PART 2) */}
        {activeTab === "cell_broadcast" && (
          <CellBroadcastConcept
            locationName={currentLocation.name}
            alertTitle={broadcastTarget.title || alertResult?.alerts[0]?.titleSw || alertResult?.alerts[0]?.titleEn || "IGAD Disaster Alert"}
            alertText={broadcastTarget.text || alertResult?.alerts[0]?.alertSw || alertResult?.alerts[0]?.alertEn || "Emergency warning issued for affected zone."}
          />
        )}

        {/* TAB 4: SYSTEM AUDIT LOGS */}
        {activeTab === "audit_logs" && <AuditLogModal />}
      </main>

      {/* Footer with Auditable API Sources */}
      <DataAuditFooter
        locationName={currentLocation.name}
        lastUpdatedTime={alertResult?.generatedAt}
      />
    </div>
  );
}
