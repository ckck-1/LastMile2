export interface LocationItem {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  boundingbox: string[];
  lat: string;
  lon: string;
  display_name: string;
  class?: string;
  type?: string;
  importance?: number;
  country?: string;
  country_code?: string;
}

export type RiskCategory = 
  | 'EXTREME_FLOOD_RISK'
  | 'HIGH_RAINFALL_WARNING'
  | 'NORMAL_CONDITIONS'
  | 'MILD_MOISTURE_DEFICIT'
  | 'MODERATE_DROUGHT_WARNING'
  | 'SEVERE_DROUGHT_ALERT'
  | 'EXTREME_DROUGHT_EMERGENCY';

export interface RainfallMetrics {
  lat: number;
  lon: number;
  locationName: string;
  dailyData: { date: string; precipitation_mm: number }[];
  sum30Days: number;
  sum60Days: number;
  sum90Days: number;
  historicalAvg90Days: number;
  percentOfNormal: number;
  riskCategory: RiskCategory;
  riskLabel: string;
  severityLevel: 'low' | 'moderate' | 'high' | 'critical';
  colorCode: string;
  formulaExplanation: string;
  startDate: string;
  endDate: string;
  historicalYears: number[];
}

export interface FacilityNode {
  id: number;
  name: string;
  category: 'hospital' | 'clinic' | 'school' | 'water_point' | 'road' | 'other';
  amenity?: string;
  lat: number;
  lon: number;
  distanceKm: number;
  tags: Record<string, string>;
}

export interface InfrastructureData {
  facilities: FacilityNode[];
  counts: {
    hospital: number;
    clinic: number;
    school: number;
    water_point: number;
    other: number;
    total: number;
  };
  searchRadiusKm: number;
  queryTimestamp: string;
}

export interface LivelihoodAlert {
  livelihood: 'farmer' | 'pastoralist' | 'urban_resident';
  titleEn: string;
  titleSw: string;
  alertEn: string;
  alertSw: string;
  keyActionsEn: string[];
  keyActionsSw: string[];
  factsReferenced: string[];
}

export interface AlertGenerationResult {
  locationName: string;
  riskCategory: RiskCategory;
  rainfallSummary: string;
  alerts: LivelihoodAlert[];
  generatedAt: string;
  modelUsed: string;
}

export interface SmsSendResult {
  success: boolean;
  connected: boolean;
  phoneNumber?: string;
  messageId?: string;
  status?: string;
  cost?: string;
  rawResponse?: unknown;
  error?: string;
  timestamp: string;
}

export interface ApiCallLog {
  id: string;
  apiName: string;
  endpoint: string;
  method: string;
  status: number | string;
  durationMs: number;
  timestamp: string;
  params?: Record<string, unknown>;
  error?: string;
}
