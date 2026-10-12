import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { RegionLocation } from '../../types';

interface TrendMapProps {
  currentRegion: RegionLocation;
  onMapClickCoordinates?: (lat: number, lon: number) => void;
  gibsOverlayLayer?: string;
  variableColor?: string;
  trendVerdict?: string;
}

export const TrendMap: React.FC<TrendMapProps> = ({
  currentRegion,
  onMapClickCoordinates,
  gibsOverlayLayer,
  variableColor = '#2DD4BF',
  trendVerdict
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const bboxLayerRef = useRef<L.Rectangle | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [activeBaseLayer, setActiveBaseLayer] = useState<'dark' | 'blue_marble' | 'night_lights'>('dark');
  const [mouseCoords, setMouseCoords] = useState<{ lat: number; lon: number } | null>(null);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [currentRegion.lat, currentRegion.lon],
        zoom: currentRegion.defaultZoom,
        minZoom: 2,
        maxZoom: 10,
        zoomControl: false,
        attributionControl: false
      });

      // Add Zoom Control to bottom-right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Mouse move coordinates listener
      map.on('mousemove', (e: L.LeafletMouseEvent) => {
        setMouseCoords({
          lat: Number(e.latlng.lat.toFixed(3)),
          lon: Number(e.latlng.lng.toFixed(3))
        });
      });

      map.on('mouseout', () => {
        setMouseCoords(null);
      });

      // Click to pick custom coordinates
      map.on('click', (e: L.LeafletMouseEvent) => {
        if (onMapClickCoordinates) {
          const lat = Number(e.latlng.lat.toFixed(4));
          const lon = Number(e.latlng.lng.toFixed(4));
          onMapClickCoordinates(lat, lon);
        }
      });

      mapInstanceRef.current = map;
    }

    return () => {
      // Keep map alive unless unmounted
    };
  }, []);

  // Base tile layer management
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove existing tile layers
    map.eachLayer(layer => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    if (activeBaseLayer === 'dark') {
      // Dark scientific tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(map);
    } else if (activeBaseLayer === 'blue_marble') {
      // Real NASA GIBS Blue Marble
      L.tileLayer('https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/BlueMarble_ShadedRelief_Bathymetry/default/GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpeg', {
        maxZoom: 8,
        tileSize: 256
      }).addTo(map);
    } else if (activeBaseLayer === 'night_lights') {
      // Real NASA GIBS VIIRS Earth at Night
      L.tileLayer('https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_CityLights_2012/default/GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpg', {
        maxZoom: 8,
        tileSize: 256
      }).addTo(map);
    }
  }, [activeBaseLayer]);

  // Update Region Center, Bounding Box & Marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    map.flyTo([currentRegion.lat, currentRegion.lon], currentRegion.defaultZoom, {
      duration: 1.2,
      easeLinearity: 0.25
    });

    // Clean previous bbox
    if (bboxLayerRef.current) {
      map.removeLayer(bboxLayerRef.current);
    }

    // Add Bounding Box polygon
    const [minLon, minLat, maxLon, maxLat] = currentRegion.bbox;
    const bounds = L.latLngBounds([minLat, minLon], [maxLat, maxLon]);
    const rect = L.rectangle(bounds, {
      color: variableColor,
      weight: 1.5,
      dashArray: '4 4',
      fillColor: variableColor,
      fillOpacity: 0.12
    }).addTo(map);
    bboxLayerRef.current = rect;

    // Clean previous marker
    if (markerRef.current) {
      map.removeLayer(markerRef.current);
    }

    // Custom scientific target icon
    const targetIcon = L.divIcon({
      className: 'custom-map-pin',
      html: `
        <div style="position: relative; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; inset: 0; border-radius: 9999px; border: 2px solid ${variableColor}; opacity: 0.8; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="position: absolute; top: 4px; left: 4px; width: 20px; height: 20px; border-radius: 9999px; background: #000000; border: 2px solid ${variableColor}; display: flex; align-items: center; justify-content: center;">
            <div style="width: 6px; height: 6px; border-radius: 9999px; background: ${variableColor};"></div>
          </div>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    const marker = L.marker([currentRegion.lat, currentRegion.lon], { icon: targetIcon }).addTo(map);
    marker.bindPopup(`
      <div style="font-family: 'Inter', sans-serif; font-size: 12px; line-height: 1.4; background: #000000; color: #ffffff; padding: 4px;">
        <div style="font-weight: 700; color: #f64137; margin-bottom: 2px;">${currentRegion.name}</div>
        <div style="color: #a0b0c0; font-family: 'JetBrains Mono', monospace; font-size: 11px;">
          Lat: ${currentRegion.lat.toFixed(2)}° | Lon: ${currentRegion.lon.toFixed(2)}°
        </div>
        ${trendVerdict ? `<div style="margin-top: 4px; color: #ffffff; font-weight: 500;">${trendVerdict}</div>` : ''}
      </div>
    `);
    markerRef.current = marker;
  }, [currentRegion, variableColor, trendVerdict]);

  const resetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([currentRegion.lat, currentRegion.lon], currentRegion.defaultZoom);
    }
  };

  return (
    <div className="relative w-full h-[460px] lg:h-[520px] bg-[#000000] rounded-2xl overflow-hidden border border-[rgba(246,65,55,0.3)] shadow-[0_4px_25px_rgba(0,0,0,0.8)]">
      {/* Map DOM Element */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top Left: Active Observation Coordinates & Region Badge */}
      <div className="absolute top-3 left-3 z-[400] bg-[#000000]/95 backdrop-blur-md border border-[rgba(255,255,255,0.15)] rounded-xl px-4 py-2.5 pointer-events-auto shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#f64137] animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-[2px] text-[#f64137]">
            NASA GIBS Observation Domain
          </span>
        </div>
        <div className="text-sm font-bold text-[#ffffff] mt-0.5">
          {currentRegion.name}
        </div>
        <div className="text-[11px] font-mono text-[#a0b0c0]">
          Center: {currentRegion.lat > 0 ? `${currentRegion.lat}°N` : `${Math.abs(currentRegion.lat)}°S`}, {currentRegion.lon > 0 ? `${currentRegion.lon}°E` : `${Math.abs(currentRegion.lon)}°W`}
        </div>
      </div>

      {/* Top Right: Satellite Layer Switcher */}
      <div className="absolute top-3 right-3 z-[400] bg-[#000000]/95 backdrop-blur-md border border-[rgba(255,255,255,0.15)] rounded-xl p-1.5 flex gap-1.5 pointer-events-auto text-xs font-mono shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
        <button
          onClick={() => setActiveBaseLayer('dark')}
          className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
            activeBaseLayer === 'dark' 
              ? 'bg-[#f64137] text-[#ffffff] font-semibold shadow-[0_0_12px_rgba(246,65,55,0.4)]' 
              : 'text-[#a0b0c0] hover:text-[#ffffff]'
          }`}
          title="Dark Cartographic Baseline"
        >
          Dark Map
        </button>
        <button
          onClick={() => setActiveBaseLayer('blue_marble')}
          className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
            activeBaseLayer === 'blue_marble' 
              ? 'bg-[#f64137] text-[#ffffff] font-semibold shadow-[0_0_12px_rgba(246,65,55,0.4)]' 
              : 'text-[#a0b0c0] hover:text-[#ffffff]'
          }`}
          title="NASA GIBS Blue Marble True Color Tiles"
        >
          NASA Blue Marble
        </button>
        <button
          onClick={() => setActiveBaseLayer('night_lights')}
          className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
            activeBaseLayer === 'night_lights' 
              ? 'bg-[#f64137] text-[#ffffff] font-semibold shadow-[0_0_12px_rgba(246,65,55,0.4)]' 
              : 'text-[#a0b0c0] hover:text-[#ffffff]'
          }`}
          title="NASA VIIRS Earth at Night"
        >
          Earth at Night
        </button>
      </div>

      {/* Bottom Left: Mouse Coordinate Readout & Click Prompt */}
      <div className="absolute bottom-3 left-3 z-[400] bg-[#000000]/90 backdrop-blur-sm border border-[rgba(255,255,255,0.15)] rounded-lg px-3.5 py-1.5 text-[11px] font-mono text-[#a0b0c0] flex items-center gap-3">
        <div>
          {mouseCoords ? (
            <span>Lat: <strong className="text-[#f64137]">{mouseCoords.lat}°</strong>, Lon: <strong className="text-[#f64137]">{mouseCoords.lon}°</strong></span>
          ) : (
            <span>Click map to probe any coordinate</span>
          )}
        </div>
        <button
          onClick={resetView}
          className="text-[#f64137] hover:underline cursor-pointer pl-2 border-l border-[rgba(255,255,255,0.15)] font-semibold"
        >
          Reset view
        </button>
      </div>
    </div>
  );
};
