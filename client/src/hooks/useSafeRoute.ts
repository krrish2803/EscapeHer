"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export interface NearbyPlace {
  id: string;
  name: string;
  type: "police" | "hospital" | "public";
  lat: number;
  lng: number;
  vicinity: string;
  distance?: number; // metres from user
  marker?: google.maps.Marker;
}

export interface RouteStep {
  instruction: string;
  distance: string;
  duration: string;
  maneuver?: string;
}

export interface SafeRouteState {
  steps: RouteStep[];
  totalDistance: string;
  totalDuration: string;
  polyline: google.maps.Polyline | null;
  nearbyPlaces: NearbyPlace[];
  destinationPlace: NearbyPlace | null;
  status: "idle" | "searching" | "routing" | "navigating" | "error";
  error: string | null;
}

interface UseSafeRouteOptions {
  mapsReady: boolean;
  map: google.maps.Map | null;
  userLat: number | null;
  userLng: number | null;
}

const DARK_MAP_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#0d1b1a" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0d1b1a" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8ac0b8" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#1a2f2d" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#0f2220" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#6da09a" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#1d3c38" }] },
  { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#0f2220" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#071312" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#3d6b67" }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ color: "#11201f" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#0c2420" }] },
  { featureType: "transit", elementType: "geometry", stylers: [{ color: "#12201f" }] },
  { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#2a4542" }] },
];

export { DARK_MAP_STYLES };

const PLACE_ICON_COLORS = {
  police: "#3b82f6",
  hospital: "#10b981",
  public: "#f59e0b",
};

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function useSafeRoute({ mapsReady, map, userLat, userLng }: UseSafeRouteOptions) {
  const [state, setState] = useState<SafeRouteState>({
    steps: [],
    totalDistance: "",
    totalDuration: "",
    polyline: null,
    nearbyPlaces: [],
    destinationPlace: null,
    status: "idle",
    error: null,
  });

  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  // Initialize services when map and google are ready
  useEffect(() => {
    if (!mapsReady || !map || !window.google?.maps) return;
    const g = window.google;
    directionsServiceRef.current = new g.maps.DirectionsService();
    placesServiceRef.current = new g.maps.places.PlacesService(map);
  }, [mapsReady, map]);

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];
  }, []);

  const clearRoute = useCallback(() => {
    if (state.polyline) {
      state.polyline.setMap(null);
    }
  }, [state.polyline]);

  // Fetch nearby safe places
  const fetchNearbyPlaces = useCallback(async (): Promise<NearbyPlace[]> => {
    const g = window.google;
    if (!g || !map || !placesServiceRef.current || userLat === null || userLng === null) {
      return [];
    }

    const center = new g.maps.LatLng(userLat, userLng);
    const radius = 2000;

    const searches: Array<{ type: string; category: NearbyPlace["type"] }> = [
      { type: "police", category: "police" },
      { type: "hospital", category: "hospital" },
      { type: "shopping_mall", category: "public" },
    ];

    const allPlaces: NearbyPlace[] = [];

    await Promise.all(
      searches.map(({ type, category }) =>
        new Promise<void>((resolve) => {
          placesServiceRef.current!.nearbySearch(
            { location: center, radius, type },
            (results, status) => {
              if (status === g.maps.places.PlacesServiceStatus.OK && results) {
                results.slice(0, 3).forEach((r) => {
                  const lat = r.geometry?.location?.lat();
                  const lng = r.geometry?.location?.lng();
                  if (lat === undefined || lng === undefined) return;
                  const dist = haversineDistance(userLat!, userLng!, lat, lng);
                  allPlaces.push({
                    id: r.place_id ?? `${lat}${lng}`,
                    name: r.name ?? "Unknown",
                    type: category,
                    lat,
                    lng,
                    vicinity: r.vicinity ?? "",
                    distance: Math.round(dist),
                  });
                });
              }
              resolve();
            }
          );
        })
      )
    );

    return allPlaces.sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));
  }, [map, userLat, userLng]);

  // Add place markers to the map
  const addPlaceMarkers = useCallback(
    (places: NearbyPlace[]) => {
      const g = window.google;
      if (!g || !map) return;

      places.forEach((place) => {
        const iconColor = PLACE_ICON_COLORS[place.type];
        const marker = new g.maps.Marker({
          position: { lat: place.lat, lng: place.lng },
          map,
          title: place.name,
          icon: {
            path: g.maps.SymbolPath.CIRCLE,
            scale: 9,
            fillColor: iconColor,
            fillOpacity: 0.9,
            strokeWeight: 2.5,
            strokeColor: "#ffffff",
          },
        });

        const infoWindow = new g.maps.InfoWindow({
          content: `
            <div style="font-family: sans-serif; padding: 4px 2px; min-width: 160px;">
              <div style="font-weight: 700; font-size: 13px; color: #111;">${place.name}</div>
              <div style="font-size: 11px; color: #555; margin-top: 2px;">${place.vicinity}</div>
              ${place.distance ? `<div style="font-size: 11px; color: ${iconColor}; margin-top: 4px; font-weight: 600;">${place.distance < 1000 ? place.distance + "m away" : (place.distance / 1000).toFixed(1) + "km away"}</div>` : ""}
            </div>
          `,
        });

        marker.addListener("click", () => infoWindow.open(map, marker));
        markersRef.current.push(marker);
      });
    },
    [map]
  );

  // Build a walking route to a destination
  const routeTo = useCallback(
    (destination: NearbyPlace) => {
      const g = window.google;
      if (!g || !map || !directionsServiceRef.current || userLat === null || userLng === null) return;

      clearRoute();
      setState((prev) => ({ ...prev, status: "routing", error: null }));

      directionsServiceRef.current.route(
        {
          origin: new g.maps.LatLng(userLat, userLng),
          destination: new g.maps.LatLng(destination.lat, destination.lng),
          travelMode: g.maps.TravelMode.WALKING,
        },
        (result, status) => {
          if (status !== g.maps.DirectionsStatus.OK || !result) {
            setState((prev) => ({
              ...prev,
              status: "error",
              error: "Could not calculate route. Try again.",
            }));
            return;
          }

          const leg = result.routes[0].legs[0];
          const steps: RouteStep[] = leg.steps.map((s) => ({
            instruction: s.instructions.replace(/<[^>]+>/g, ""),
            distance: s.distance?.text ?? "",
            duration: s.duration?.text ?? "",
            maneuver: s.maneuver,
          }));

          // Draw the route polyline
          const path = result.routes[0].overview_path;
          const polyline = new g.maps.Polyline({
            path,
            strokeColor: "#ef4444",
            strokeOpacity: 0.9,
            strokeWeight: 5,
            map,
          });

          // Fit map to show full route
          const bounds = new g.maps.LatLngBounds();
          path.forEach((pt) => bounds.extend(pt));
          map.fitBounds(bounds, { top: 60, right: 40, bottom: 60, left: 40 });

          setState((prev) => ({
            ...prev,
            steps,
            totalDistance: leg.distance?.text ?? "",
            totalDuration: leg.duration?.text ?? "",
            polyline,
            destinationPlace: destination,
            status: "navigating",
          }));
        }
      );
    },
    [map, userLat, userLng, clearRoute]
  );

  // Search nearby and auto-route to nearest safe place
  const findAndRoute = useCallback(async () => {
    setState((prev) => ({ ...prev, status: "searching", error: null }));
    clearMarkers();

    try {
      const places = await fetchNearbyPlaces();
      addPlaceMarkers(places);

      setState((prev) => ({ ...prev, nearbyPlaces: places }));

      // Auto-route to nearest police station, fallback to hospital, then any
      const nearest =
        places.find((p) => p.type === "police") ||
        places.find((p) => p.type === "hospital") ||
        places[0];

      if (nearest) {
        routeTo(nearest);
      } else {
        setState((prev) => ({
          ...prev,
          status: "error",
          error: "No safe places found nearby. Try again.",
        }));
      }
    } catch {
      setState((prev) => ({
        ...prev,
        status: "error",
        error: "Failed to search nearby places.",
      }));
    }
  }, [fetchNearbyPlaces, addPlaceMarkers, routeTo, clearMarkers]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearMarkers();
      if (state.polyline) state.polyline.setMap(null);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { ...state, routeTo, findAndRoute, clearMarkers };
}
