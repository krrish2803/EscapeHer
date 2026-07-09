"use client";

import React, { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";

export interface LiveMapProps {
  latitude: number;
  longitude: number;
  accuracyMeters?: number;
  lastUpdatedSeconds?: number;
  isLive?: boolean;
  children?: React.ReactNode;
  className?: string;
}

function formatCoord(n: number) {
  return n.toFixed(5);
}

function formatAgo(s: number) {
  if (s < 60) return `${Math.round(s)}s ago`;
  return `${Math.floor(s / 60)}m ago`;
}

export default function LiveMap({
  latitude,
  longitude,
  accuracyMeters,
  lastUpdatedSeconds,
  isLive = true,
  children,
  className = "",
}: LiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [apiKeyExists, setApiKeyExists] = useState(false);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!key) {
      setApiKeyExists(false);
      return;
    }
    setApiKeyExists(true);

    (async () => {
      try {
        const { setOptions, importLibrary } = await import("@googlemaps/js-api-loader");
        setOptions({ key, v: "weekly" });
        await importLibrary("maps");

        if (!mapRef.current || !window.google?.maps) return;
        const google = window.google;

        const map = new google.maps.Map(mapRef.current, {
          center: { lat: latitude, lng: longitude },
          zoom: 15,
          disableDefaultUI: true,
          styles: [
            { elementType: "geometry", stylers: [{ color: "#16201f" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#16201f" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#a9bcc0" }] },
            { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#4b6068" }] },
            { featureType: "road", elementType: "geometry", stylers: [{ color: "#0f1e1c" }] },
            { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#16201f" }] },
            { featureType: "water", elementType: "geometry", stylers: [{ color: "#0c1716" }] },
          ],
        });

        new google.maps.Marker({
          position: { lat: latitude, lng: longitude },
          map,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: "#ef4444",
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: "#ffffff",
          },
        });

        setMapLoaded(true);
      } catch (err) {
        console.error("Google Maps failed to load:", err);
        setMapLoaded(false);
      }
    })();
  }, [latitude, longitude]);

  const renderFallbackMap = () => {
    return (
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        {/* Styled Vector Map background */}
        <div className="absolute inset-0 w-full h-full bg-[var(--eh-mist-50)]">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="none" aria-hidden="true">
            {/* Grid Pattern */}
            <defs>
              <pattern id="map-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="var(--eh-mist-200)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#map-grid)" />
            
            {/* Mock Streets/Roads */}
            <path 
              d="M -10,60 L 410,60 M -10,180 L 410,180 M -10,240 L 410,240 M 120,-10 L 120,310 M 280,-10 L 280,310 M 50,-10 L 200,310" 
              stroke="var(--eh-mist-200)" 
              strokeWidth="16" 
              strokeLinecap="round" 
              fill="none" 
            />
            <path 
              d="M -10,60 L 410,60 M -10,180 L 410,180 M -10,240 L 410,240 M 120,-10 L 120,310 M 280,-10 L 280,310 M 50,-10 L 200,310" 
              stroke="var(--eh-surface)" 
              strokeWidth="10" 
              strokeLinecap="round" 
              fill="none" 
            />

            {/* Safe Zone (Green Indicator) */}
            <g transform="translate(280, 60)">
              <circle r="14" fill="var(--eh-safe-100)" className="animate-pulse" />
              <circle r="6" fill="var(--eh-safe-600)" />
            </g>
            <text x="296" y="64" className="text-[10px] font-bold fill-[var(--eh-safe-600)]" style={{ fontFamily: "var(--eh-font-sans)" }}>
              SAFE ZONE
            </text>

            {/* Another Safe Zone */}
            <g transform="translate(120, 240)">
              <circle r="14" fill="var(--eh-safe-100)" className="animate-pulse" />
              <circle r="6" fill="var(--eh-safe-600)" />
            </g>

            {/* Safe Route (Teal Highlighted Path) */}
            <path 
              d="M 120,180 L 280,180 L 280,60" 
              stroke="var(--eh-teal-500)" 
              strokeWidth="4" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              fill="none" 
              strokeDasharray="6 4"
              className="animate-pulse"
            />
          </svg>
        </div>

        {/* User live location marker */}
        <div className="relative z-10 flex flex-col items-center">
          <span className="absolute -inset-4 rounded-full bg-[var(--eh-danger-600)]/20 animate-ping" />
          <span className="absolute -inset-2 rounded-full bg-[var(--eh-danger-600)]/35" />
          <span className="flex h-10 w-10 items-center justify-center rounded-full shadow-lg" style={{ background: "var(--eh-danger-600)" }}>
            <MapPin size={20} color="var(--eh-surface, #fff)" />
          </span>
          <span className="mt-2.5 px-3 py-1 rounded-full text-[9px] font-bold tracking-widest text-[var(--eh-danger-600)] bg-[var(--eh-danger-100)] border border-[var(--eh-danger-600)]/30 shadow-sm uppercase">
            Live Location
          </span>
        </div>

        {/* Informative overlay banner */}
        <div className="absolute bottom-2 left-2 right-2 bg-[var(--eh-surface)]/90 backdrop-blur-md border border-[var(--eh-mist-200)] rounded-xl px-3 py-2 text-center shadow-md">
          <p className="text-[10px] font-semibold text-[var(--eh-ink-600)] tracking-wide">
            📍 Mock safety route active. Google Maps API key not configured.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`overflow-hidden rounded-2xl ${className}`}
      style={{ background: "var(--eh-surface, #fff)", border: "1px solid var(--eh-mist-200)" }}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          {isLive && (
            <span className="relative flex h-2 w-2">
              <span
                className="absolute inline-flex h-full w-full rounded-full animate-ping"
                style={{ background: "var(--eh-danger-600)", opacity: 0.6 }}
              />
              <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: "var(--eh-danger-600)" }} />
            </span>
          )}
          <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--eh-ink-900)" }}>
            {isLive ? "Live location" : "Last known location"}
          </span>
        </div>
        {lastUpdatedSeconds !== undefined && (
          <span className="text-[11px] font-mono" style={{ color: "var(--eh-ink-600)" }}>
            {formatAgo(lastUpdatedSeconds)}
          </span>
        )}
      </div>

      <div
        className="relative aspect-[4/3] w-full"
        style={{ background: "var(--eh-mist-50)" }}
      >
        {children ? (
          children
        ) : apiKeyExists ? (
          <div ref={mapRef} className="absolute inset-0 w-full h-full" />
        ) : (
          renderFallbackMap()
        )}
      </div>

      <div className="flex items-center justify-between px-4 py-2.5">
        <span className="text-[11px] font-mono" style={{ color: "var(--eh-ink-600)" }}>
          {formatCoord(latitude)}, {formatCoord(longitude)}
        </span>
        {accuracyMeters !== undefined && (
          <span className="text-[11px]" style={{ color: "var(--eh-ink-600)" }}>
            ±{Math.round(accuracyMeters)}m accuracy
          </span>
        )}
      </div>
    </div>
  );
}
