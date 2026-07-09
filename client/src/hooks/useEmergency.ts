"use client";

import { useContext } from "react";
import {
  EmergencyContext,
  type EmergencyContextValue,
} from "@/context/EmergencyContext";

/**
 * Hook to access the EmergencyContext.
 * Must be used within an <EmergencyProvider>.
 */
export function useEmergency(): EmergencyContextValue {
  const context = useContext(EmergencyContext);
  if (context === undefined) {
    throw new Error("useEmergency must be used within an EmergencyProvider");
  }
  return context;
}
