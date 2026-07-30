import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FacilityNode } from "../types";

interface InteractiveMapProps {
  centerLat: number;
  centerLon: number;
  locationName: string;
  facilities: FacilityNode[];
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  centerLat,
  centerLon,
  locationName,
  facilities,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize Map if not existing
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [centerLat, centerLon],
        zoom: 11,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView([centerLat, centerLon], 11);
    }

    const map = mapInstanceRef.current;

    // Clear existing non-tile layers
    map.eachLayer((layer) => {
      if (!(layer instanceof L.TileLayer)) {
        map.removeLayer(layer);
      }
    });

    // Custom Marker Creator (Technical Data Grid aesthetic)
    const createCustomIcon = (bgColor: string, textColor: string, label: string) =>
      L.divIcon({
        className: "custom-leaflet-marker",
        html: `<div style="background-color: ${bgColor}; color: ${textColor}; border: 2px solid #141414; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 11px; font-family: ui-monospace, monospace;">${label}</div>`,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
      });

    // 15km Zone Circle Overlay
    L.circle([centerLat, centerLon], {
      color: "#D94A38",
      fillColor: "#D94A38",
      fillOpacity: 0.1,
      weight: 2,
      dashArray: "4, 6",
      radius: 15000, // 15km
    }).addTo(map);

    // Center Location Marker
    L.marker([centerLat, centerLon], {
      icon: createCustomIcon("#D94A38", "#ffffff", "★"),
    })
      .addTo(map)
      .bindPopup(
        `<div style="font-family: ui-monospace, monospace; font-size: 12px; font-weight: bold; padding: 2px;">
          📍 ${locationName}<br/>
          <span style="font-size: 10px; color: #141414; font-weight: normal;">Center: ${centerLat.toFixed(4)}, ${centerLon.toFixed(4)}</span>
        </div>`
      )
      .openPopup();

    // Infrastructure Facility Markers
    facilities.forEach((f) => {
      let iconBg = "#141414";
      let iconText = "#ffffff";
      let symbol = "📍";

      if (f.category === "hospital") {
        iconBg = "#D94A38";
        symbol = "H";
      } else if (f.category === "clinic") {
        iconBg = "#D94A38";
        symbol = "C";
      } else if (f.category === "school") {
        iconBg = "#141414";
        symbol = "S";
      } else if (f.category === "water_point") {
        iconBg = "#2E7D32";
        symbol = "W";
      }

      L.marker([f.lat, f.lon], {
        icon: createCustomIcon(iconBg, iconText, symbol),
      })
        .addTo(map)
        .bindPopup(
          `<div style="font-family: ui-monospace, monospace; font-size: 12px; padding: 2px;">
            <strong style="color: #141414;">${f.name}</strong><br/>
            <span style="font-size: 11px; color: #D94A38; font-weight: 700;">Category: ${f.category.replace("_", " ").toUpperCase()}</span><br/>
            <span style="font-size: 10px; color: #141414;">Distance: ${f.distanceKm} km from alert center</span>
          </div>`
        );
    });

    // Handle map resize
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

  }, [centerLat, centerLon, locationName, facilities]);

  return (
    <div className="tech-panel mb-6">
      <div className="tech-pane-title flex items-center justify-between">
        <div>
          <span>Geospatial Map: {locationName} (15km Sector Radius)</span>
        </div>
        <div className="hidden sm:flex items-center space-x-3 text-[10px] font-technical-mono font-bold uppercase text-[#141414]">
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 bg-[#D94A38] inline-block border border-[#141414]"></span>
            <span>Alert Center</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 bg-[#D94A38] inline-block border border-[#141414]"></span>
            <span>Hospital/Clinic</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 bg-[#141414] inline-block border border-[#141414]"></span>
            <span>School</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 bg-[#2E7D32] inline-block border border-[#141414]"></span>
            <span>Water Point</span>
          </span>
        </div>
      </div>

      <div className="relative">
        <div
          ref={mapContainerRef}
          className="w-full h-80 sm:h-96 border-b border-[#141414] z-10"
        />
        <div className="absolute bottom-3 left-3 bg-white/90 p-2 text-[10px] border border-[#141414] font-technical-mono font-bold z-20 shadow-[2px_2px_0px_rgba(20,20,20,0.1)]">
          MAP VIEW: {locationName.toUpperCase()} (15KM RADIUS)
        </div>
      </div>
    </div>
  );
};
