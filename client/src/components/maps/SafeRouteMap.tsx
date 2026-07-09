"use client";

import React, { useEffect, useRef, useState } from "react";
import { DARK_MAP_STYLES } from "@/hooks/useSafeRoute";

interface SafeRouteMapProps {
  userLat: number;
  userLng: number;
  accuracy?: number;
  onMapReady: (map: google.maps.Map) => void;
  className?: string;
}

export default function SafeRouteMap({
  userLat,
  userLng,
  accuracy,
  onMapReady,
  className = "",
}: SafeRouteMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const userMarkerRef = useRef<google.maps.Marker | null>(null);
  const accuracyCircleRef = useRef<google.maps.Circle | null>(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const onMapReadyRef = useRef(onMapReady);
  onMapReadyRef.current = onMapReady;

  // Initialize map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const google = window.google;
    if (!google?.maps) return;

    const map = new google.maps.Map(containerRef.current, {
      center: { lat: userLat, lng: userLng },
      zoom: 16,
      disableDefaultUI: true,
      clickableIcons: false,
      gestureHandling: "greedy",
      styles: DARK_MAP_STYLES,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    });

    // Build a small control button
    const makeCtrlBtn = (svgInner: string, ariaLabel: string, onClick: () => void) => {
      const btn = document.createElement("button");
      btn.innerHTML = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${svgInner}</svg>`;
      btn.setAttribute("aria-label", ariaLabel);
      btn.style.cssText = [
        "display:flex;align-items:center;justify-content:center;",
        "width:34px;height:34px;border-radius:9px;",
        "border:1px solid rgba(255,255,255,0.1);",
        "background:rgba(13,27,26,0.93);color:#94a3b8;",
        "cursor:pointer;transition:all 0.13s;",
        "box-shadow:0 2px 8px rgba(0,0,0,0.45);",
      ].join("");
      btn.addEventListener("mouseenter", () => {
        btn.style.background = "rgba(20,50,47,0.98)";
        btn.style.color = "#5cc698";
        btn.style.borderColor = "rgba(92,198,152,0.35)";
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.background = "rgba(13,27,26,0.93)";
        btn.style.color = "#94a3b8";
        btn.style.borderColor = "rgba(255,255,255,0.1)";
      });
      btn.addEventListener("mousedown", () => { btn.style.transform = "scale(0.92)"; });
      btn.addEventListener("mouseup", () => { btn.style.transform = "scale(1)"; });
      btn.onclick = onClick;
      return btn;
    };

    const ctrlDiv = document.createElement("div");
    ctrlDiv.style.cssText = "display:flex;flex-direction:column;gap:5px;margin:10px 8px;";

    ctrlDiv.appendChild(
      makeCtrlBtn(
        '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
        "Zoom in",
        () => map.setZoom((map.getZoom() ?? 14) + 1)
      )
    );
    ctrlDiv.appendChild(
      makeCtrlBtn(
        '<line x1="5" y1="12" x2="19" y2="12"/>',
        "Zoom out",
        () => map.setZoom((map.getZoom() ?? 14) - 1)
      )
    );
    ctrlDiv.appendChild(
      makeCtrlBtn(
        '<circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>',
        "Re-center on my location",
        () => {
          const pos = userMarkerRef.current?.getPosition();
          if (pos) {
            map.panTo(pos);
            map.setZoom(17);
          }
        }
      )
    );

    map.controls[google.maps.ControlPosition.RIGHT_TOP].push(ctrlDiv);
    mapRef.current = map;
    setMapInitialized(true);
    onMapReadyRef.current(map);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update user marker position whenever GPS coords change
  useEffect(() => {
    if (!mapRef.current || !mapInitialized) return;
    const google = window.google;
    if (!google?.maps) return;

    const position = { lat: userLat, lng: userLng };

    if (!userMarkerRef.current) {
      userMarkerRef.current = new google.maps.Marker({
        position,
        map: mapRef.current,
        zIndex: 100,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 11,
          fillColor: "#ef4444",
          fillOpacity: 1,
          strokeWeight: 3,
          strokeColor: "#ffffff",
        },
        title: "Your current location",
      });
    } else {
      userMarkerRef.current.setPosition(position);
    }

    // GPS accuracy circle
    if (accuracy !== undefined && accuracy > 0) {
      if (!accuracyCircleRef.current) {
        accuracyCircleRef.current = new google.maps.Circle({
          map: mapRef.current,
          center: position,
          radius: accuracy,
          fillColor: "#ef4444",
          fillOpacity: 0.07,
          strokeColor: "#ef4444",
          strokeOpacity: 0.25,
          strokeWeight: 1.5,
          clickable: false,
        });
      } else {
        accuracyCircleRef.current.setCenter(position);
        accuracyCircleRef.current.setRadius(accuracy);
      }
    }
  }, [userLat, userLng, accuracy, mapInitialized]);

  // Cleanup map elements on unmount
  useEffect(() => {
    return () => {
      userMarkerRef.current?.setMap(null);
      accuracyCircleRef.current?.setMap(null);
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
