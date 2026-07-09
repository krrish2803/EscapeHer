"use client";

import React from "react";

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
      {events.map((event, i) => {
        const color = LEVEL_COLOR[event.level ?? "info"];
        const isLast = i === events.length - 1;
        return (
          <li key={event.id} className="relative flex gap-4 pb-6 last:pb-0">
            {!isLast && (
              <span
                className="absolute left-[7px] top-4 bottom-0 w-px"
                style={{ background: "var(--eh-mist-200)" }}
                aria-hidden="true"
              />
            )}
            <span
              className="relative mt-1.5 h-[15px] w-[15px] shrink-0 rounded-full ring-4"
              style={{ background: color, boxShadow: "0 0 0 4px var(--eh-surface, #fff)" }}
              aria-hidden="true"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span
                  className="text-[11px] font-mono shrink-0"
                  style={{ color: "var(--eh-ink-600)", fontFamily: "var(--eh-font-mono, monospace)" }}
                >
                  {event.time}
                </span>
                <span className="text-sm font-semibold" style={{ color: "var(--eh-ink-900)" }}>
                  {event.title}
                </span>
              </div>
              {event.description && (
                <p className="text-xs mt-0.5" style={{ color: "var(--eh-ink-600)" }}>
                  {event.description}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
