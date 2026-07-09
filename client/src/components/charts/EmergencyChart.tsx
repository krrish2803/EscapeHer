"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

export interface EmergencyChartDatum {
  /** Short label, e.g. "Mon" */
  label: string;
  resolvedSafely: number;
  escalated: number;
}

export interface EmergencyChartProps {
  data: EmergencyChartDatum[];
  height?: number;
  className?: string;
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-lg px-3 py-2 text-xs shadow-sm"
      style={{ background: "var(--eh-surface, #fff)", border: "1px solid var(--eh-mist-200)" }}
    >
      <p className="font-semibold mb-1" style={{ color: "var(--eh-ink-900)" }}>
        {label}
      </p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

export default function EmergencyChart({ data, height = 240, className = "" }: EmergencyChartProps) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div 
        style={{ width: "100%", height, background: "var(--eh-mist-50)" }} 
        className="animate-pulse rounded-2xl"
      />
    );
  }

  return (
    <div className={className} style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barGap={4} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--eh-mist-200)" />
          <XAxis
            dataKey="label"
            tick={{ fill: "var(--eh-ink-600)", fontSize: 12 }}
            axisLine={{ stroke: "var(--eh-mist-200)" }}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: "var(--eh-ink-600)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--eh-mist-50)" }} />
          <Legend
            wrapperStyle={{ fontSize: 12, color: "var(--eh-ink-600)" }}
            iconType="circle"
            iconSize={8}
          />
          <Bar dataKey="resolvedSafely" name="Resolved safely" stackId="a" fill="var(--eh-safe-600)" radius={[0, 0, 4, 4]} />
          <Bar dataKey="escalated" name="Escalated" stackId="a" fill="var(--eh-danger-600)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
