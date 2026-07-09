"use client";

import React from "react";
import { ShieldCheck, History, AlertCircle, Activity } from "lucide-react";

export interface StatsData {
  totalIncidents: number;
  resolvedSafely: number;
  escalated: number;
  heartbeatUptime: number; // percentage
}

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
}

function StatCard({ icon: Icon, label, value, sub, accent = "var(--eh-teal-500)" }: StatCardProps) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-4 border border-[var(--eh-mist-200)] bg-[var(--eh-surface)] hover:border-[var(--eh-teal-500)]/25 hover:shadow-sm transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        <span
          className="flex h-10 w-10 items-center justify-center rounded-xl shadow-inner"
          style={{ background: "var(--eh-teal-100)" }}
        >
          <Icon size={20} color={accent} />
        </span>
      </div>
      <div>
        <p
          className="text-3xl font-extrabold tracking-tight"
          style={{ color: "var(--eh-ink-900)", fontFamily: "var(--eh-font-display)" }}
        >
          {value}
        </p>
        <p className="text-xs font-bold uppercase tracking-wider mt-1 text-[var(--eh-ink-600)]">
          {label}
        </p>
        {sub && (
          <p className="text-[10px] mt-1.5 font-mono tracking-tight text-[var(--eh-ink-600)]">
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

interface DashboardStatsProps {
  stats?: StatsData;
  className?: string;
}

const DEFAULT_STATS: StatsData = {
  totalIncidents: 0,
  resolvedSafely: 0,
  escalated: 0,
  heartbeatUptime: 100,
};

export default function DashboardStats({
  stats = DEFAULT_STATS,
  className = "",
}: DashboardStatsProps) {
  return (
    <div className={`grid grid-cols-2 gap-3 ${className}`}>
      <StatCard
        icon={Activity}
        label="Total incidents"
        value={stats.totalIncidents}
        accent="var(--eh-teal-500)"
      />
      <StatCard
        icon={ShieldCheck}
        label="Resolved safely"
        value={stats.resolvedSafely}
        accent="var(--eh-safe-600)"
      />
      <StatCard
        icon={AlertCircle}
        label="Escalated"
        value={stats.escalated}
        accent="var(--eh-spark-500)"
      />
      <StatCard
        icon={History}
        label="Heartbeat uptime"
        value={`${stats.heartbeatUptime}%`}
        accent="var(--eh-teal-500)"
      />
    </div>
  );
}
