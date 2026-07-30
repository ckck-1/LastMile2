import React, { useState } from "react";
import { Search, MapPin, Loader2, Globe } from "lucide-react";
import { LocationItem } from "../types";
import { searchLocation } from "../services/api";

interface LocationSearchProps {
  onSelectLocation: (location: { name: string; lat: number; lon: number; country?: string }) => void;
  isLoading: boolean;
}

// Preset locations for the 8 IGAD member states
const IGAD_PRESETS = [
  { name: "Garissa, Kenya", lat: -0.4532, lon: 39.646, country: "Kenya" },
  { name: "Jijiga, Ethiopia", lat: 9.35, lon: 42.8, country: "Ethiopia" },
  { name: "Baidoa, Somalia", lat: 3.1138, lon: 43.6498, country: "Somalia" },
  { name: "Moroto, Uganda", lat: 2.5345, lon: 34.6666, country: "Uganda" },
  { name: "Malakal, South Sudan", lat: 9.5334, lon: 31.6605, country: "South Sudan" },
  { name: "Kassala, Sudan", lat: 15.4508, lon: 36.4, country: "Sudan" },
  { name: "Ali Sabieh, Djibouti", lat: 11.1558, lon: 42.7125, country: "Djibouti" },
  { name: "Barentu, Eritrea", lat: 15.1139, lon: 37.5928, country: "Eritrea" },
];

export const LocationSearch: React.FC<LocationSearchProps> = ({ onSelectLocation, isLoading }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LocationItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setSearchError(null);
    try {
      const items = await searchLocation(query);
      setResults(items);
      if (items.length === 0) {
        setSearchError("No location found. Please try a different place name in East Africa.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setSearchError(`Live geocoding search failed: ${msg}`);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectResult = (item: LocationItem) => {
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);
    onSelectLocation({
      name: item.display_name,
      lat,
      lon,
      country: item.class || "East Africa",
    });
    setResults([]);
    setQuery("");
  };

  return (
    <div className="tech-panel mb-6">
      <div className="tech-pane-title flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Globe className="w-4 h-4 text-[#D94A38]" />
          <span>IGAD Location Selector</span>
        </div>
        <span className="text-[10px] text-[#141414]/60 font-technical-mono">Nominatim Geocoding API</span>
      </div>

      <div className="p-4 sm:p-5">
        {/* Search Input Form */}
        <form onSubmit={handleSearchSubmit} className="relative mb-4">
          <div className="relative flex">
            <div className="relative flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search city, district, or village in IGAD region (e.g. Garissa, Jijiga, Baidoa, Moroto...)"
                className="w-full bg-[#E4E3E0] border border-[#141414] text-[#141414] placeholder-[#141414]/50 pl-10 pr-4 py-2 text-xs font-technical-mono focus:outline-none focus:bg-white"
                disabled={isLoading}
              />
              <Search className="w-4 h-4 text-[#141414]/60 absolute left-3 top-2.5" />
            </div>
            <button
              type="submit"
              disabled={isSearching || isLoading || !query.trim()}
              className="tech-btn ml-2 flex items-center space-x-1"
            >
              {isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>Search</span>}
            </button>
          </div>
        </form>

        {/* Search Error State */}
        {searchError && (
          <div className="p-3 mb-3 bg-[#FFEBEE] border border-[#D94A38] text-xs text-[#141414] font-technical-mono">
            {searchError}
          </div>
        )}

        {/* Search Results Dropdown List */}
        {results.length > 0 && (
          <div className="mb-4 bg-white border border-[#141414] divide-y divide-[#141414]/20 max-h-60 overflow-y-auto">
            {results.map((item) => (
              <button
                key={item.place_id}
                onClick={() => handleSelectResult(item)}
                className="w-full text-left px-4 py-2.5 hover:bg-[#E4E3E0] transition-colors flex items-start space-x-2 text-xs text-[#141414]"
              >
                <MapPin className="w-4 h-4 text-[#D94A38] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#141414]">{item.display_name}</p>
                  <p className="text-[10px] text-[#141414]/60 font-technical-mono mt-0.5">
                    Lat: {parseFloat(item.lat).toFixed(4)}, Lon: {parseFloat(item.lon).toFixed(4)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Quick Presets for IGAD Member States */}
        <div>
          <p className="text-xs font-technical-serif italic text-[#141414]/80 mb-2">Quick Pick IGAD Member Country Hubs:</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {IGAD_PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => onSelectLocation(preset)}
                disabled={isLoading}
                className="px-3 py-2 bg-[#E4E3E0] hover:bg-white border border-[#141414] text-left text-xs transition-all flex items-center justify-between group disabled:opacity-50"
              >
                <div>
                  <span className="font-bold text-[#141414] group-hover:text-[#D94A38] block truncate font-technical-mono text-[11px]">
                    {preset.name}
                  </span>
                  <span className="text-[10px] text-[#141414]/60 block truncate font-technical-serif italic">{preset.country}</span>
                </div>
                <MapPin className="w-3.5 h-3.5 text-[#141414]/50 group-hover:text-[#D94A38] shrink-0 ml-1" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
