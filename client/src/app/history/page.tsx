"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/common/PageHeader";
import IncidentTimeline from "@/components/timeline/IncidentTimeline";
import type { TimelineEvent } from "@/components/timeline/IncidentTimeline";
import { Filter, Download } from "lucide-react";

// Demo data — TODO: replace with GET /api/incidents from Krrish's API
// Each incident group is a past emergency session
const DEMO_EVENTS: TimelineEvent[] = [
  {
    id: "evt-001",
    time: "2026-07-07 · 22:14:03",
    title: "Emergency session started",
    description: "Danger Mode activated via SOS button. Trusted contacts alerted.",
    level: "danger",
  },
  {
    id: "evt-002",
    time: "2026-07-07 · 22:14:10",
    title: "GPS tracking active",
    description: "Live location sharing started. Accuracy: ±8m.",
    level: "info",
  },
  {
    id: "evt-003",
    time: "2026-07-07 · 22:14:15",
    title: "Audio recording started",
    description: "Recording to local cache. Syncing when connection restored.",
    level: "info",
  },
  {
    id: "evt-004",
    time: "2026-07-07 · 22:15:30",
    title: "Heartbeat check-in — missed",
    description: "No response within 60 seconds. Escalating to next contact.",
    level: "warning",
  },
  {
    id: "evt-005",
    time: "2026-07-07 · 22:16:00",
    title: "Alert escalated — Family notified",
    description: "Escalation Level 2: family contact Rohit (Dad) alerted with live location.",
    level: "danger",
  },
  {
    id: "evt-006",
    time: "2026-07-07 · 22:22:41",
    title: "Session ended — Confirmed safe",
    description: "User confirmed safe. Session closed. Evidence log archived.",
    level: "safe",
  },
  {
    id: "evt-007",
    time: "2026-07-05 · 18:30:00",
    title: "Emergency session started",
    description: "Danger Mode activated. 2 contacts alerted.",
    level: "danger",
  },
  {
    id: "evt-008",
    time: "2026-07-05 · 18:45:12",
    title: "Session ended — Confirmed safe",
    description: "User confirmed safe after 15 minutes.",
    level: "safe",
  },
];

type FilterLevel = "all" | "danger" | "warning" | "info" | "safe";

const FILTER_OPTIONS: { value: FilterLevel; label: string }[] = [
  { value: "all", label: "All events" },
  { value: "danger", label: "Danger only" },
  { value: "warning", label: "Warnings" },
  { value: "safe", label: "Safe" },
  { value: "info", label: "Info" },
];

export default function HistoryPage() {
  const [filter, setFilter] = useState<FilterLevel>("all");

  const filteredEvents =
    filter === "all"
      ? DEMO_EVENTS
      : DEMO_EVENTS.filter((e) => e.level === filter);

  return (
    <DashboardLayout>
      <div className="px-4 md:px-8 py-8 space-y-8 max-w-4xl mx-auto eh-page">
        <PageHeader
          title="Incident History"
          subtitle="Full timestamped log of all emergency sessions."
          action={
            <button
              type="button"
              aria-label="Export incident log"
              className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold border border-[var(--eh-mist-200)] bg-[var(--eh-surface)] text-[var(--eh-ink-900)] hover:border-[var(--eh-teal-500)]/30 hover:bg-[var(--eh-teal-100)]/10 shadow-sm transition-all duration-200 active:scale-[0.97]"
            >
              <Download size={14} className="text-[var(--eh-teal-700)]" />
              <span>Export Log</span>
            </button>
          }
        />

        {/* Filter bar */}
        <div
          className="flex items-center gap-2.5 overflow-x-auto pb-1"
          role="group"
          aria-label="Filter incident events"
        >
          <Filter size={14} color="var(--eh-ink-600)" className="shrink-0" />
          {FILTER_OPTIONS.map(({ value, label }) => {
            const active = filter === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                className={`shrink-0 rounded-full px-4.5 py-2 text-xs font-semibold border transition-all duration-200 active:scale-95 ${
                  active 
                    ? "bg-[var(--eh-teal-500)] text-[var(--eh-surface)] border-[var(--eh-teal-500)] shadow-sm" 
                    : "bg-[var(--eh-surface)] text-[var(--eh-ink-600)] border-[var(--eh-mist-200)] hover:text-[var(--eh-teal-700)] hover:border-[var(--eh-teal-500)]/30"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Timeline — wrapped from UIKit */}
        <div
          className="rounded-3xl p-6 border border-[var(--eh-mist-200)] bg-[var(--eh-surface)] shadow-sm hover:border-[var(--eh-teal-500)]/10 transition-colors duration-300"
        >
          {filteredEvents.length > 0 ? (
            <IncidentTimeline events={filteredEvents} />
          ) : (
            <p className="text-sm text-center py-8" style={{ color: "var(--eh-ink-600)" }}>
              No events matching this filter.
            </p>
          )}
        </div>

        {/* AI Summary placeholder — rendered by Kamal */}
        <div
          className="rounded-3xl p-6 border border-[var(--eh-mist-200)] bg-[var(--eh-surface)] shadow-sm hover:border-[var(--eh-teal-500)]/15 transition-colors duration-300"
        >
          <p className="text-xs font-bold uppercase tracking-wider mb-2 text-[var(--eh-teal-700)]">
            AI Evidence Summary
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "var(--eh-ink-600)" }}>
            {/* TODO: render Kamal's Gemini AI summary output here */}
            AI-generated evidence summary will appear here once the session ends.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
