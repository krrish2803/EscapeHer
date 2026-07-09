"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export type TimelineLevel = "info" | "warning" | "danger" | "safe";

export interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  description?: string;
  level?: TimelineLevel;
}

export interface IncidentTimelineProps {
  events: TimelineEvent[];
  className?: string;
}

const LEVEL_COLOR: Record<TimelineLevel, string> = {
  info: "var(--eh-teal-500)",
  warning: "var(--eh-spark-500)",
  danger: "var(--eh-danger-600)",
  safe: "var(--eh-safe-600)",
};



export default function IncidentTimeline({ events, className = "" }: IncidentTimelineProps) {
  return (
    <ol className={`relative ${className}`} aria-label="Incident timeline">
      {/* Vertical line indicator - absolute positioning behind all elements */}
      <span 
        className="absolute left-[9px] top-6 bottom-6 w-px bg-[var(--eh-mist-200)] z-0" 
        aria-hidden="true" 
      />

      <AnimatePresence mode="popLayout">
        {events.map((event, i) => {
          const color = LEVEL_COLOR[event.level ?? "info"];
          return (
            <motion.li 
              key={event.id} 
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="relative flex gap-6 pb-8 last:pb-0 z-10"
            >
              {/* Timeline Indicator Dot */}
              <div
                className="relative mt-1.5 h-[20px] w-[20px] shrink-0 rounded-full flex items-center justify-center border-2 border-black/85 shadow-sm bg-[var(--eh-surface)]"
                style={{ borderColor: color }}
                aria-hidden="true"
              >
                <span className="h-2 w-2 rounded-full shadow-sm" style={{ background: color }} />
              </div>

              {/* Event Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span
                    className="text-[11px] font-bold font-mono shrink-0 px-2 py-0.5 rounded bg-[var(--eh-mist-50)]"
                    style={{ color: "var(--eh-ink-600)", fontFamily: "var(--eh-font-mono, monospace)" }}
                  >
                    {event.time}
                  </span>
                  <span className="text-sm font-bold" style={{ color: "var(--eh-ink-900)" }}>
                    {event.title}
                  </span>
                </div>
                {event.description && (
                  <p className="text-xs mt-1.5 leading-relaxed" style={{ color: "var(--eh-ink-600)" }}>
                    {event.description}
                  </p>
                )}
              </div>
            </motion.li>
          );
        })}
      </AnimatePresence>
    </ol>
  );
}
