"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Navigation2,
  MapPin,
  Phone,
  Share2,
  RefreshCw,
  Volume2,
  VolumeX,
  ShieldX,
  Wifi,
  WifiOff,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Hospital,
  ShieldCheck,
  Store,
  Clock,
  Ruler,
  Crosshair,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { useGoogleMaps } from "@/hooks/useGoogleMaps";
import { useLocation } from "@/hooks/useLocation";
import { useSafeRoute, type NearbyPlace } from "@/hooks/useSafeRoute";
import { useSocket } from "@/hooks/useSocket";
import dynamic from "next/dynamic";

const SafeRouteMap = dynamic(() => import("@/components/maps/SafeRouteMap"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-zinc-950">
      <Loader2 size={24} className="text-red-500 animate-spin" />
    </div>
  ),
});

/* ─────────────────────────────────────────────────────────── helpers ── */

function formatDistance(m: number): string {
  if (m < 1000) return `${Math.round(m)}m`;
  return `${(m / 1000).toFixed(1)}km`;
}

function formatCoord(n: number): string {
  return n.toFixed(5);
}

function formatAgo(ts: number | null): string {
  if (!ts) return "—";
  const diff = Math.round((Date.now() - ts) / 1000);
  if (diff < 60) return `${diff}s ago`;
  return `${Math.floor(diff / 60)}m ago`;
}

function placeIcon(type: NearbyPlace["type"]) {
  if (type === "police") return <ShieldCheck size={14} />;
  if (type === "hospital") return <Hospital size={14} />;
  return <Store size={14} />;
}

function placeColor(type: NearbyPlace["type"]): string {
  if (type === "police") return "#3b82f6";
  if (type === "hospital") return "#10b981";
  return "#f59e0b";
}

/* ─────────────────────────────────────────────────────────── component ── */

export default function SafeRoutePage() {
  const router = useRouter();
  const { status: mapsStatus, error: mapsError, reload: reloadMaps } = useGoogleMaps();
  const location = useLocation();
  const { emit, isConnected } = useSocket();

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [sirenOn, setSirenOn] = useState(false);
  const [activePanel, setActivePanel] = useState<"route" | "places" | "info">("route");
  const [locationDenied, setLocationDenied] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<number | null>(null);
  const sirenRef = useRef<OscillatorNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const route = useSafeRoute({
    mapsReady: mapsStatus === "ready",
    map,
    userLat: location.latitude,
    userLng: location.longitude,
  });

  /* ── Start location tracking on mount ──────────────────────── */
  useEffect(() => {
    if (!location.isSupported) {
      setLocationDenied(true);
      return;
    }
    location.startTracking();
    return () => location.stopTracking();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Detect location permission denied ─────────────────────── */
  useEffect(() => {
    if (location.error?.toLowerCase().includes("denied") || location.error?.toLowerCase().includes("permission")) {
      setLocationDenied(true);
    }
  }, [location.error]);

  /* ── Emit live location via Socket.IO ──────────────────────── */
  useEffect(() => {
    if (location.latitude === null || location.longitude === null) return;
    setLastUpdate(Date.now());
    emit("location:update", {
      lat: location.latitude,
      lng: location.longitude,
      accuracy: location.accuracy,
      timestamp: Date.now(),
    });
  }, [location.latitude, location.longitude, emit]);

  /* ── Once map + location ready, auto-search and route ──────── */
  useEffect(() => {
    if (!map || mapsStatus !== "ready" || location.latitude === null || location.longitude === null) return;
    if (route.status === "idle") {
      route.findAndRoute();
    }
  }, [map, mapsStatus, location.latitude, location.longitude]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Siren control ──────────────────────────────────────────── */
  const toggleSiren = useCallback(() => {
    if (sirenOn) {
      sirenRef.current?.stop();
      sirenRef.current = null;
      setSirenOn(false);
    } else {
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.setValueAtTime(440, ctx.currentTime + 0.5);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 1.0);
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      osc.start();
      sirenRef.current = osc;
      setSirenOn(true);
    }
  }, [sirenOn]);

  /* ── Share location via Web Share API ──────────────────────── */
  const shareLocation = useCallback(() => {
    if (location.latitude === null || location.longitude === null) return;
    const text = `🚨 Emergency — my live location:\nhttps://maps.google.com/?q=${location.latitude},${location.longitude}`;
    if (navigator.share) {
      navigator.share({ title: "EscapeHer – Live Location", text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text).catch(() => {});
    }
  }, [location.latitude, location.longitude]);

  /* ── Retry location after denial ───────────────────────────── */
  const retryLocation = useCallback(() => {
    setLocationDenied(false);
    location.startTracking();
  }, [location]);

  /* ─────────────────────────────── render states ── */

  /* Permission denied screen */
  if (locationDenied) {
    return <LocationDeniedScreen onRetry={retryLocation} onBack={() => router.back()} />;
  }

  /* Google Maps API error */
  if (mapsStatus === "error") {
    return (
      <MapErrorScreen
        error={mapsError ?? "Unknown error"}
        onRetry={reloadMaps}
        onBack={() => router.back()}
        userLat={location.latitude}
        userLng={location.longitude}
      />
    );
  }

  /* Loading state */
  const isLoading = mapsStatus === "loading" || mapsStatus === "idle";

  return (
    <main
      className="h-dvh max-h-dvh overflow-hidden flex flex-col bg-zinc-950 text-white select-none"
      aria-label="Safe Escape Route"
    >
      {/* ── Top bar ─────────────────────────────────────────── */}
      <nav className="flex-shrink-0 flex items-center gap-2 px-3 py-3 bg-zinc-950/95 backdrop-blur-md border-b border-white/8 z-20">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Go back"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/6 border border-white/10 hover:bg-white/12 active:scale-95 transition-all"
        >
          <ChevronLeft size={20} className="text-zinc-300" />
        </button>

        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-bold leading-none">Safe Escape Route</h1>
          <div className="flex items-center gap-2 mt-0.5">
            {location.isTracking ? (
              <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 font-mono">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                GPS LIVE
              </span>
            ) : (
              <span className="text-[10px] font-semibold text-zinc-500 font-mono">GPS CONNECTING</span>
            )}
            <span className="text-zinc-700">·</span>
            <span
              className={`flex items-center gap-1 text-[10px] font-mono font-semibold ${
                isConnected ? "text-blue-400" : "text-zinc-500"
              }`}
            >
              {isConnected ? <Wifi size={10} /> : <WifiOff size={10} />}
              {isConnected ? "CONNECTED" : "OFFLINE"}
            </span>
          </div>
        </div>

        {/* Route status badge */}
        <div className="flex items-center gap-1.5">
          <AnimatePresence mode="wait">
            {route.status === "searching" || route.status === "routing" ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-700 px-2.5 py-1.5 rounded-full"
              >
                <Loader2 size={11} className="animate-spin text-red-400" />
                <span className="text-[10px] font-bold text-zinc-300">
                  {route.status === "searching" ? "FINDING…" : "ROUTING…"}
                </span>
              </motion.div>
            ) : route.status === "navigating" ? (
              <motion.div
                key="navigating"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1.5 bg-red-950/60 border border-red-800/50 px-2.5 py-1.5 rounded-full"
              >
                <Navigation2 size={11} className="text-red-400 animate-pulse" />
                <span className="text-[10px] font-bold text-red-300">NAVIGATING</span>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </nav>

      {/* ── Main layout ─────────────────────────────────────── */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row">

        {/* ── Map area (70-75% on desktop) ─────────────────── */}
        <div className="relative flex-shrink-0 h-[50vh] lg:h-full lg:flex-1">

          {/* Loading overlay */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-zinc-950"
              >
                <Loader2 size={32} className="text-red-500 animate-spin mb-3" />
                <p className="text-sm font-semibold text-zinc-300">Loading map…</p>
                <p className="text-xs text-zinc-600 mt-1">Requesting GPS permission</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Google Map */}
          {mapsStatus === "ready" && location.latitude !== null && location.longitude !== null && (
            <SafeRouteMap
              userLat={location.latitude}
              userLng={location.longitude}
              accuracy={location.accuracy ?? undefined}
              onMapReady={setMap}
              className="absolute inset-0"
            />
          )}

          {/* Waiting for GPS (maps loaded but no location yet) */}
          {!isLoading && (location.latitude === null || location.longitude === null) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 z-10">
              <div className="relative mb-4">
                <Crosshair size={40} className="text-zinc-600 animate-pulse" />
              </div>
              <p className="text-sm font-semibold text-zinc-300">Acquiring GPS signal…</p>
              <p className="text-xs text-zinc-600 mt-1">Please allow location access</p>
              {location.error && (
                <div className="mt-4 bg-red-950/50 border border-red-800/50 rounded-xl px-4 py-3 max-w-xs text-center">
                  <p className="text-xs text-red-300">{location.error}</p>
                  <button
                    onClick={retryLocation}
                    className="mt-2 text-xs font-bold text-red-400 hover:text-red-300 underline"
                  >
                    Retry
                  </button>
                </div>
              )}
            </div>
          )}

          {/* GPS Coordinates overlay */}
          {location.latitude !== null && !isLoading && (
            <div className="absolute bottom-3 left-3 bg-zinc-950/88 backdrop-blur-sm border border-white/10 rounded-xl px-3 py-2 z-10 pointer-events-none">
              <p className="text-[10px] font-mono text-zinc-400 leading-tight">
                {formatCoord(location.latitude)}, {formatCoord(location.longitude)}
              </p>
              {location.accuracy && (
                <p className="text-[9px] font-mono text-zinc-600 mt-0.5">±{Math.round(location.accuracy)}m · {formatAgo(lastUpdate)}</p>
              )}
            </div>
          )}

          {/* Emergency quick-action strip — bottom of map */}
          <div className="absolute bottom-3 right-3 flex flex-col gap-2 z-10">
            <button
              onClick={() => { window.location.href = "tel:100"; }}
              aria-label="Call police"
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600 hover:bg-red-700 active:scale-90 transition-all shadow-lg shadow-red-950/60 border border-red-500/30"
            >
              <Phone size={19} className="text-white" />
            </button>
            <button
              onClick={shareLocation}
              aria-label="Share location"
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-800 hover:bg-zinc-700 active:scale-90 transition-all shadow-md border border-white/10"
            >
              <Share2 size={17} className="text-zinc-200" />
            </button>
            <button
              onClick={toggleSiren}
              aria-label={sirenOn ? "Disable siren" : "Enable siren"}
              className={`flex h-12 w-12 items-center justify-center rounded-2xl active:scale-90 transition-all shadow-md border ${
                sirenOn
                  ? "bg-amber-600 hover:bg-amber-700 border-amber-500/40 shadow-amber-950/60"
                  : "bg-zinc-800 hover:bg-zinc-700 border-white/10"
              }`}
            >
              {sirenOn ? <VolumeX size={17} className="text-white" /> : <Volume2 size={17} className="text-zinc-200" />}
            </button>
          </div>
        </div>

        {/* ── Right panel (30% desktop / full mobile bottom scroll) ── */}
        <aside className="flex-shrink-0 w-full lg:w-[340px] xl:w-[380px] flex flex-col bg-zinc-950 border-t lg:border-t-0 lg:border-l border-white/8 overflow-hidden">

          {/* Panel tabs */}
          <div className="flex border-b border-white/8 flex-shrink-0">
            {(["route", "places", "info"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActivePanel(tab)}
                className={`flex-1 py-3 text-[11px] font-bold uppercase tracking-wider transition-colors ${
                  activePanel === tab
                    ? "text-red-400 border-b-2 border-red-500"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {tab === "route" ? "Navigation" : tab === "places" ? "Safe Places" : "Status"}
              </button>
            ))}
          </div>

          {/* Panel content */}
          <div className="flex-1 overflow-y-auto overscroll-contain">
            <AnimatePresence mode="wait">

              {/* ROUTE PANEL */}
              {activePanel === "route" && (
                <motion.div
                  key="route"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.18 }}
                  className="p-4 space-y-3"
                >
                  {/* Route summary */}
                  {route.status === "navigating" && route.destinationPlace && (
                    <div className="bg-zinc-900/80 border border-white/8 rounded-2xl p-4">
                      <div className="flex items-start gap-3">
                        <div
                          className="h-10 w-10 flex items-center justify-center rounded-xl shrink-0"
                          style={{ background: `${placeColor(route.destinationPlace.type)}22` }}
                        >
                          <span style={{ color: placeColor(route.destinationPlace.type) }}>
                            {placeIcon(route.destinationPlace.type)}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-zinc-100 truncate">{route.destinationPlace.name}</p>
                          <p className="text-[10px] text-zinc-500 truncate mt-0.5">{route.destinationPlace.vicinity}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-400">
                              <Clock size={10} />
                              {route.totalDuration}
                            </span>
                            <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-blue-400">
                              <Ruler size={10} />
                              {route.totalDistance}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Re-route button */}
                  <button
                    onClick={route.findAndRoute}
                    disabled={route.status === "searching" || route.status === "routing"}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-zinc-900 border border-white/10 hover:bg-zinc-800 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] transition-all text-sm font-semibold text-zinc-200"
                  >
                    <RefreshCw size={14} className={route.status === "searching" || route.status === "routing" ? "animate-spin" : ""} />
                    {route.status === "idle" ? "Find Nearest Safe Place" : route.status === "searching" ? "Searching…" : route.status === "routing" ? "Routing…" : "Re-route"}
                  </button>

                  {/* Error */}
                  {route.status === "error" && route.error && (
                    <div className="flex items-start gap-2.5 bg-red-950/40 border border-red-800/40 rounded-xl p-3">
                      <AlertTriangle size={14} className="text-red-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-red-300">{route.error}</p>
                    </div>
                  )}

                  {/* Steps */}
                  {route.steps.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-2 px-1">
                        Turn-by-Turn
                      </p>
                      <ol className="space-y-2">
                        {route.steps.map((step, i) => (
                          <li key={i} className="flex gap-3 items-start">
                            <div
                              className={`mt-0.5 h-6 w-6 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${
                                i === 0 ? "bg-red-600 text-white" : "bg-zinc-800 text-zinc-400"
                              }`}
                            >
                              {i === 0 ? <Navigation2 size={11} /> : i + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-zinc-200 leading-snug">{step.instruction}</p>
                              <p className="text-[10px] font-mono text-zinc-500 mt-0.5">
                                {step.distance} · {step.duration}
                              </p>
                            </div>
                          </li>
                        ))}
                        <li className="flex gap-3 items-start">
                          <div className="mt-0.5 h-6 w-6 rounded-full flex items-center justify-center shrink-0 bg-emerald-700 text-white">
                            <CheckCircle2 size={11} />
                          </div>
                          <p className="text-xs text-emerald-400 font-semibold">You have arrived at a safe location</p>
                        </li>
                      </ol>
                    </div>
                  )}

                  {/* Idle state prompt */}
                  {route.status === "idle" && (
                    <div className="text-center py-6">
                      <Navigation2 size={28} className="text-zinc-700 mx-auto mb-2" />
                      <p className="text-sm text-zinc-500">Tap "Find Nearest Safe Place" to begin navigation</p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* PLACES PANEL */}
              {activePanel === "places" && (
                <motion.div
                  key="places"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.18 }}
                  className="p-4 space-y-2"
                >
                  {/* Legend */}
                  <div className="flex items-center gap-4 pb-2">
                    {(["police", "hospital", "public"] as const).map((t) => (
                      <div key={t} className="flex items-center gap-1.5">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ background: placeColor(t) }}
                        />
                        <span className="text-[10px] font-semibold capitalize text-zinc-500">
                          {t === "public" ? "Public" : t}
                        </span>
                      </div>
                    ))}
                  </div>

                  {route.nearbyPlaces.length === 0 ? (
                    <div className="text-center py-8">
                      <MapPin size={28} className="text-zinc-700 mx-auto mb-2" />
                      <p className="text-sm text-zinc-500">
                        {route.status === "searching" ? "Searching nearby…" : "No places found yet. Tap 'Find' in Navigation tab."}
                      </p>
                    </div>
                  ) : (
                    route.nearbyPlaces.map((place) => (
                      <button
                        key={place.id}
                        type="button"
                        onClick={() => {
                          route.routeTo(place);
                          setActivePanel("route");
                        }}
                        className={`w-full text-left flex items-center gap-3 p-3 rounded-xl border transition-all active:scale-[0.98] hover:bg-white/5 ${
                          route.destinationPlace?.id === place.id
                            ? "border-red-800/50 bg-red-950/20"
                            : "border-white/8 bg-white/[0.02]"
                        }`}
                      >
                        <div
                          className="h-9 w-9 flex items-center justify-center rounded-xl shrink-0"
                          style={{ background: `${placeColor(place.type)}20` }}
                        >
                          <span style={{ color: placeColor(place.type) }}>{placeIcon(place.type)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-zinc-100 truncate">{place.name}</p>
                          <p className="text-[10px] text-zinc-500 truncate">{place.vicinity}</p>
                        </div>
                        <div className="flex flex-col items-end gap-0.5 shrink-0">
                          {place.distance !== undefined && (
                            <span className="text-[10px] font-mono font-bold text-zinc-400">
                              {formatDistance(place.distance)}
                            </span>
                          )}
                          {route.destinationPlace?.id === place.id ? (
                            <span className="text-[9px] text-red-400 font-bold">ROUTING</span>
                          ) : (
                            <ChevronRight size={12} className="text-zinc-600" />
                          )}
                        </div>
                      </button>
                    ))
                  )}
                </motion.div>
              )}

              {/* INFO / STATUS PANEL */}
              {activePanel === "info" && (
                <motion.div
                  key="info"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.18 }}
                  className="p-4 space-y-3"
                >
                  {/* GPS Status */}
                  <InfoCard label="GPS Status">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-bold ${location.isTracking ? "text-emerald-400" : "text-zinc-500"}`}>
                        {location.isTracking ? "Live Tracking Active" : "Not Tracking"}
                      </span>
                      {location.isTracking && (
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
                          <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
                        </span>
                      )}
                    </div>
                  </InfoCard>

                  {/* Coordinates */}
                  {location.latitude !== null && location.longitude !== null && (
                    <InfoCard label="Current Coordinates">
                      <p className="text-xs font-mono text-zinc-200 break-all">
                        {formatCoord(location.latitude)}, {formatCoord(location.longitude)}
                      </p>
                    </InfoCard>
                  )}

                  {/* Accuracy */}
                  {location.accuracy !== null && (
                    <InfoCard label="GPS Accuracy">
                      <p className="text-sm font-bold text-zinc-200">
                        ±{Math.round(location.accuracy!)}m
                        <span className={`ml-2 text-xs font-medium ${location.accuracy! < 15 ? "text-emerald-400" : location.accuracy! < 50 ? "text-amber-400" : "text-red-400"}`}>
                          {location.accuracy! < 15 ? "High" : location.accuracy! < 50 ? "Medium" : "Low"}
                        </span>
                      </p>
                    </InfoCard>
                  )}

                  {/* Last update */}
                  <InfoCard label="Last GPS Update">
                    <p className="text-sm font-bold text-zinc-200">{formatAgo(lastUpdate)}</p>
                  </InfoCard>

                  {/* Socket */}
                  <InfoCard label="Connection Status">
                    <div className="flex items-center gap-2">
                      {isConnected
                        ? <><Wifi size={14} className="text-blue-400" /><span className="text-sm font-bold text-blue-400">Live (Socket.IO)</span></>
                        : <><WifiOff size={14} className="text-zinc-500" /><span className="text-sm font-bold text-zinc-500">Offline</span></>
                      }
                    </div>
                  </InfoCard>

                  {/* Route info */}
                  {route.totalDuration && (
                    <InfoCard label="ETA">
                      <p className="text-sm font-bold text-emerald-400">{route.totalDuration}</p>
                    </InfoCard>
                  )}
                  {route.totalDistance && (
                    <InfoCard label="Remaining Distance">
                      <p className="text-sm font-bold text-blue-400">{route.totalDistance}</p>
                    </InfoCard>
                  )}

                  {/* Advisory */}
                  <div className="flex items-start gap-3 bg-red-950/20 border border-red-900/30 rounded-xl p-3 mt-2">
                    <AlertTriangle size={14} className="text-red-500 shrink-0 mt-0.5 animate-pulse" />
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      Stay on well-lit, populated streets. Avoid alleys. Your live location is being transmitted to trusted contacts.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Bottom control strip ─────────────────────────── */}
          <div className="flex-shrink-0 p-3 border-t border-white/8 bg-zinc-950">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => { window.location.href = "tel:100"; }}
                className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-red-700 hover:bg-red-600 active:scale-[0.97] transition-all text-sm font-bold text-white"
              >
                <Phone size={15} />
                Call Police
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 active:scale-[0.97] transition-all text-sm font-semibold text-zinc-200 border border-white/10"
              >
                <ShieldX size={15} />
                End Session
              </button>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

/* ─────────────────────────────────────── sub-components ── */

function InfoCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-zinc-900/60 border border-white/6 rounded-xl p-3">
      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-1.5">{label}</p>
      {children}
    </div>
  );
}

function LocationDeniedScreen({ onRetry, onBack }: { onRetry: () => void; onBack: () => void }) {
  return (
    <main className="min-h-dvh bg-zinc-950 text-white flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-sm text-center space-y-6">
        <div className="mx-auto h-20 w-20 rounded-2xl bg-red-950/60 border border-red-800/40 flex items-center justify-center">
          <MapPin size={36} className="text-red-500" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-zinc-100">Location Access Required</h1>
          <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
            EscapeHer needs your precise location to plot the safest route and share it with emergency contacts. Without it, navigation is not possible.
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-left space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">How to enable:</p>
          <ol className="space-y-2 text-xs text-zinc-400">
            <li className="flex gap-2"><span className="text-red-400 font-bold shrink-0">1.</span>Click the lock icon in your browser's address bar</li>
            <li className="flex gap-2"><span className="text-red-400 font-bold shrink-0">2.</span>Find "Location" and set it to "Allow"</li>
            <li className="flex gap-2"><span className="text-red-400 font-bold shrink-0">3.</span>Reload this page</li>
          </ol>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={onRetry}
            className="w-full py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 active:scale-[0.97] transition-all text-sm font-bold text-white"
          >
            Retry Location Access
          </button>
          <button
            onClick={onBack}
            className="w-full py-3.5 rounded-2xl bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 active:scale-[0.97] transition-all text-sm font-semibold text-zinc-300"
          >
            Go Back
          </button>
        </div>
      </div>
    </main>
  );
}

function MapErrorScreen({
  error,
  onRetry,
  onBack,
  userLat,
  userLng,
}: {
  error: string;
  onRetry: () => void;
  onBack: () => void;
  userLat: number | null;
  userLng: number | null;
}) {
  return (
    <main className="min-h-dvh bg-zinc-950 text-white flex flex-col font-sans">
      {/* Nav */}
      <nav className="flex items-center gap-3 px-4 py-4 border-b border-white/8">
        <button type="button" onClick={onBack} className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/6 border border-white/10 hover:bg-white/10 active:scale-95 transition-all">
          <ChevronLeft size={20} className="text-zinc-300" />
        </button>
        <h1 className="text-base font-bold">Safe Escape Route</h1>
      </nav>

      {/* Fallback UI */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6 max-w-md mx-auto">
        <div className="h-20 w-20 rounded-2xl bg-amber-950/60 border border-amber-800/40 flex items-center justify-center">
          <AlertTriangle size={36} className="text-amber-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-zinc-100">Map Unavailable</h2>
          <p className="text-sm text-zinc-400 mt-2 leading-relaxed">{error}</p>
        </div>

        {/* Direct options when maps fail */}
        <div className="w-full space-y-3">
          <a
            href={`https://maps.google.com/?q=${userLat ?? 0},${userLng ?? 0}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-blue-700 hover:bg-blue-600 transition-all text-sm font-bold text-white"
          >
            <ExternalLink size={15} />
            Open in Google Maps
          </a>
          <button
            onClick={() => { window.location.href = "tel:100"; }}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-red-700 hover:bg-red-600 active:scale-[0.97] transition-all text-sm font-bold text-white"
          >
            <Phone size={15} />
            Call Police (100)
          </button>
          <button
            onClick={onRetry}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 active:scale-[0.97] transition-all text-sm font-semibold text-zinc-300"
          >
            <RefreshCw size={14} />
            Retry Map Load
          </button>
        </div>

        {userLat !== null && userLng !== null && (
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3 w-full">
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-600 mb-1">Your Coordinates</p>
            <p className="text-xs font-mono text-zinc-300">{userLat.toFixed(6)}, {userLng.toFixed(6)}</p>
            <p className="text-[10px] text-zinc-600 mt-0.5">Share these with emergency contacts</p>
          </div>
        )}
      </div>
    </main>
  );
}
