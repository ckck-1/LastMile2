import React from "react";
import { InfrastructureData } from "../types";
import { Hospital, Stethoscope, GraduationCap, Droplet, MapPin, Building2 } from "lucide-react";

interface InfrastructureListProps {
  infrastructure: InfrastructureData;
}

export const InfrastructureList: React.FC<InfrastructureListProps> = ({ infrastructure }) => {
  const { facilities, counts, searchRadiusKm } = infrastructure;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "hospital":
        return <Hospital className="w-4 h-4 text-[#D94A38]" />;
      case "clinic":
        return <Stethoscope className="w-4 h-4 text-[#D94A38]" />;
      case "school":
        return <GraduationCap className="w-4 h-4 text-[#141414]" />;
      case "water_point":
        return <Droplet className="w-4 h-4 text-[#2E7D32]" />;
      default:
        return <Building2 className="w-4 h-4 text-[#141414]" />;
    }
  };

  return (
    <div className="tech-panel">
      <div className="tech-pane-title flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-[#D94A38]" />
          <span>Verified Infrastructure Nodes ({searchRadiusKm}km Radius)</span>
        </div>
        <span className="font-technical-mono text-[10px] font-bold uppercase bg-[#141414] text-white px-2 py-0.5">
          {counts.total} Nodes Found
        </span>
      </div>

      {/* Category Counts Pills */}
      <div className="p-4 border-b border-[#141414] bg-[#E4E3E0] flex flex-wrap gap-2 text-[10px] font-technical-mono font-bold uppercase">
        <span className="px-2.5 py-1 bg-white border border-[#141414] text-[#D94A38] flex items-center space-x-1">
          <Hospital className="w-3.5 h-3.5" />
          <span>{counts.hospital} Hospitals</span>
        </span>
        <span className="px-2.5 py-1 bg-white border border-[#141414] text-[#D94A38] flex items-center space-x-1">
          <Stethoscope className="w-3.5 h-3.5" />
          <span>{counts.clinic} Clinics</span>
        </span>
        <span className="px-2.5 py-1 bg-white border border-[#141414] text-[#141414] flex items-center space-x-1">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>{counts.school} Schools</span>
        </span>
        <span className="px-2.5 py-1 bg-white border border-[#141414] text-[#2E7D32] flex items-center space-x-1">
          <Droplet className="w-3.5 h-3.5" />
          <span>{counts.water_point} Water Points</span>
        </span>
        {counts.other > 0 && (
          <span className="px-2.5 py-1 bg-white border border-[#141414] text-[#141414] flex items-center space-x-1">
            <Building2 className="w-3.5 h-3.5" />
            <span>{counts.other} Community Nodes</span>
          </span>
        )}
      </div>

      {/* Facilities List Data Rows */}
      {facilities.length === 0 ? (
        <div className="p-4 text-center text-xs text-[#141414]/70 font-technical-mono italic">
          No specific indexed infrastructure nodes found within {searchRadiusKm}km in OpenStreetMap for this location.
        </div>
      ) : (
        <div className="divide-y divide-[#141414]/15 max-h-72 overflow-y-auto font-technical-mono text-xs">
          {facilities.map((facility) => (
            <div
              key={facility.id}
              className="p-3 hover:bg-[#E4E3E0] transition-colors flex items-center justify-between"
            >
              <div className="flex items-start space-x-2.5 min-w-0 pr-2">
                <div className="mt-0.5 shrink-0">{getCategoryIcon(facility.category)}</div>
                <div className="min-w-0">
                  <p className="font-bold text-[#141414] truncate">{facility.name}</p>
                  <p className="text-[10px] text-[#141414]/60 mt-0.5">
                    OSM #{facility.id} • Lat: {facility.lat.toFixed(4)}, Lon: {facility.lon.toFixed(4)}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="inline-block px-2 py-0.5 bg-white border border-[#141414] text-[9px] font-bold uppercase text-[#141414]">
                  {facility.category.replace("_", " ")}
                </span>
                <p className="text-xs font-bold text-[#D94A38] mt-1">
                  {facility.distanceKm} km
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
