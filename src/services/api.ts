import {
  LocationItem,
  RainfallMetrics,
  InfrastructureData,
  AlertGenerationResult,
  SmsSendResult,
  ApiCallLog,
} from "../types";

export async function searchLocation(query: string): Promise<LocationItem[]> {
  const response = await fetch(`/api/geocoding/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Geocoding request failed (${response.status})`);
  }
  const data = await response.json();
  return data.results || [];
}

export async function fetchRainfallData(
  lat: number,
  lon: number,
  locationName: string
): Promise<RainfallMetrics> {
  const url = `/api/weather/rainfall?lat=${lat}&lon=${lon}&locationName=${encodeURIComponent(locationName)}`;
  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Rainfall data request failed (${response.status})`);
  }
  return await response.json();
}

export async function fetchInfrastructureData(
  lat: number,
  lon: number
): Promise<InfrastructureData> {
  const url = `/api/infrastructure/nearby?lat=${lat}&lon=${lon}`;
  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Infrastructure request failed (${response.status})`);
  }
  return await response.json();
}

export async function generateHyperlocalAlerts(
  locationName: string,
  riskCategory: string,
  riskLabel: string,
  rainfallData: RainfallMetrics,
  facilities: InfrastructureData["facilities"]
): Promise<AlertGenerationResult> {
  const response = await fetch("/api/alerts/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      locationName,
      riskCategory,
      riskLabel,
      rainfallData,
      facilities,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `AI Alert generation failed (${response.status})`);
  }

  return await response.json();
}

export async function generateGeminiSpeech(text: string, voice = "Kore"): Promise<{ audioUrl: string; fallbackToSpeechSynth?: boolean; error?: string }> {
  const response = await fetch("/api/tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, voice }),
  });

  if (!response.ok) {
    const rawText = await response.text();
    let errorMsg = `Gemini TTS failed (${response.status})`;
    try {
      const errorData = JSON.parse(rawText);
      if (errorData.error) errorMsg = errorData.error;
    } catch {
      const cleanHtml = rawText.startsWith("<")
        ? rawText.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 150)
        : rawText;
      errorMsg = `Server error (HTTP ${response.status}): ${cleanHtml || response.statusText}`;
    }
    throw new Error(errorMsg);
  }

  const data = await response.json();
  if (data.fallbackToSpeechSynth || (!data.audioUrl && data.error)) {
    return {
      audioUrl: "",
      fallbackToSpeechSynth: true,
      error: data.error || "Gemini TTS high demand. Defaulting to local speech synthesis.",
    };
  }

  return data;
}

export async function sendSmsAlert(
  phoneNumber: string,
  message: string,
  forceSimulation = false
): Promise<SmsSendResult> {
  const response = await fetch("/api/sms/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phoneNumber, message, forceSimulation }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    return {
      success: false,
      connected: errorData.connected ?? false,
      error: errorData.error || `SMS sending failed (${response.status})`,
      rawResponse: errorData.rawResponse,
      timestamp: new Date().toISOString(),
    };
  }

  return await response.json();
}

export async function fetchSystemLogs(): Promise<ApiCallLog[]> {
  const response = await fetch("/api/logs");
  if (!response.ok) return [];
  const data = await response.json();
  return data.logs || [];
}
