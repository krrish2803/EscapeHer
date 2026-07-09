"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { LOCATION_UPDATE_INTERVAL_MS } from "@/lib/constants";

export interface LocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  speed: number | null;
  heading: number | null;
  timestamp: number | null;
  error: string | null;
  isTracking: boolean;
  isSupported: boolean;
}

/**
 * Hook for managing geolocation — provides current position,
 * continuous tracking, and error handling.
 */
export function useLocation() {
  const [location, setLocation] = useState<LocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    speed: null,
    heading: null,
    timestamp: null,
    error: null,
    isTracking: false,
    isSupported: typeof navigator !== "undefined" && "geolocation" in navigator,
  });

  const watchIdRef = useRef<number | null>(null);

  /**
   * Get the current position once.
   */
  const getCurrentPosition = useCallback((): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported"));
        return;
      }
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      });
    });
  }, []);

  /**
   * Fetch and set the current position.
   */
  const refreshPosition = useCallback(async () => {
    try {
      const position = await getCurrentPosition();
      setLocation((prev) => ({
        ...prev,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        speed: position.coords.speed,
        heading: position.coords.heading,
        timestamp: position.timestamp,
        error: null,
      }));
    } catch (err) {
      const message =
        err instanceof GeolocationPositionError
          ? err.message
          : "Unable to get location";
      setLocation((prev) => ({ ...prev, error: message }));
    }
  }, [getCurrentPosition]);

  /**
   * Start continuous location tracking.
   */
  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setLocation((prev) => ({
        ...prev,
        error: "Geolocation is not supported",
      }));
      return;
    }

    if (watchIdRef.current !== null) return;

    const id = navigator.geolocation.watchPosition(
      (position) => {
        setLocation((prev) => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          speed: position.coords.speed,
          heading: position.coords.heading,
          timestamp: position.timestamp,
          error: null,
          isTracking: true,
        }));
      },
      (err) => {
        setLocation((prev) => ({
          ...prev,
          error: err.message,
          isTracking: false,
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: LOCATION_UPDATE_INTERVAL_MS,
        maximumAge: 5000,
      }
    );

    watchIdRef.current = id;
    setLocation((prev) => ({ ...prev, isTracking: true }));
  }, []);

  /**
   * Stop continuous tracking.
   */
  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
      setLocation((prev) => ({ ...prev, isTracking: false }));
    }
  }, []);

  /* ── Cleanup on unmount ──────────────────────────────────────────── */
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return {
    ...location,
    getCurrentPosition,
    refreshPosition,
    startTracking,
    stopTracking,
  };
}
