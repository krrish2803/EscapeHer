"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export type GoogleMapsStatus = "idle" | "loading" | "ready" | "error";

export interface UseGoogleMapsReturn {
  google: typeof window.google | null;
  status: GoogleMapsStatus;
  error: string | null;
  reload: () => void;
}

// Singleton promise so we only load the API once per session
let loaderPromise: Promise<typeof window.google> | null = null;

function loadGoogleMapsScript(apiKey: string): Promise<typeof window.google> {
  if (loaderPromise) return loaderPromise;

  loaderPromise = (async () => {
    const { setOptions, importLibrary } = await import("@googlemaps/js-api-loader");

    setOptions({
      key: apiKey,
      v: "weekly",
    });

    // Load core libraries sequentially so global google.maps is populated
    await importLibrary("maps");
    await importLibrary("places");
    await importLibrary("geometry");
    await importLibrary("routes");

    if (typeof window === "undefined" || !window.google?.maps) {
      throw new Error("Google Maps failed to initialise");
    }
    return window.google;
  })();

  return loaderPromise;
}

export function useGoogleMaps(): UseGoogleMapsReturn {
  const [status, setStatus] = useState<GoogleMapsStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [google, setGoogle] = useState<typeof window.google | null>(null);
  const mountedRef = useRef(true);

  const load = useCallback(async () => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      setStatus("error");
      setError(
        "Google Maps API key is not configured. Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env.local file."
      );
      return;
    }

    setStatus("loading");
    setError(null);
    loaderPromise = null; // force reload on retry

    try {
      const g = await loadGoogleMapsScript(apiKey);
      if (!mountedRef.current) return;
      setGoogle(g);
      setStatus("ready");
    } catch (err) {
      if (!mountedRef.current) return;
      const msg = err instanceof Error ? err.message : "Failed to load Google Maps";
      setError(msg);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    load();
    return () => {
      mountedRef.current = false;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const reload = useCallback(() => {
    load();
  }, [load]);

  return { google, status, error, reload };
}
