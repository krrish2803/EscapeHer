"use client";

import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";

export interface ResponseChartDatum {
  /** Short label, e.g. session index or date */
  label: string;
  /** Seconds it took for a heartbeat to be acknowledged */
  responseSeconds: number;
}

export interface ResponseChartProps {
  data: ResponseChartDatum[];
  /** Target/threshold in seconds, shown as a reference line. */
  targetSeconds?: number;
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
      <p style={{ color: "var(--eh-teal-700)" }}>{payload[0].value}s response time</p>
    </div>
  );
}

export default function ResponseChart({
  data,
  targetSeconds,
  height = 220,
  className = "",
}: ResponseChartProps) {
  return (
    <div className={className} style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="ehResponseFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--eh-teal-500)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="var(--eh-teal-500)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="var(--eh-mist-200)" />
          <XAxis
            dataKey="label"
            tick={{ fill: "var(--eh-ink-600)", fontSize: 12 }}
            axisLine={{ stroke: "var(--eh-mist-200)" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "var(--eh-ink-600)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            unit="s"
          />
          <Tooltip content={<ChartTooltip />} />
          {targetSeconds !== undefined && (
            <ReferenceLine
              y={targetSeconds}
              stroke="var(--eh-spark-500)"
              strokeDasharray="4 4"
              label={{ value: `Target ${targetSeconds}s`, position: "insideTopRight", fill: "var(--eh-spark-500)", fontSize: 11 }}
            />
          )}
          <Area
            type="monotone"
            dataKey="responseSeconds"
            stroke="var(--eh-teal-700)"
            strokeWidth={2}
            fill="url(#ehResponseFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
