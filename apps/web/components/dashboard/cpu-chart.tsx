"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const defaultData = [
  { time: "00:00", cpu: 28 },
  { time: "04:00", cpu: 28 },
  { time: "08:00", cpu: 45 },
  { time: "12:00", cpu: 62 },
  { time: "16:00", cpu: 48 },
  { time: "20:00", cpu: 38 },
  { time: "24:00", cpu: 42 },
];

export function CPUChart({
  data = defaultData,
}: {
  data?: Array<{ time: string; cpu: number }>;
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <defs>
          <linearGradient id="cpuStroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(251,146,60,1)" />
            <stop offset="100%" stopColor="rgba(56,189,248,1)" />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
        <XAxis
          dataKey="time"
          className="text-xs"
          stroke="rgba(255,255,255,0.45)"
        />
        <YAxis
          className="text-xs"
          stroke="rgba(255,255,255,0.45)"
          label={{ value: "CPU %", angle: -90, position: "insideLeft" }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#17120e",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "18px",
            color: "#fff",
          }}
        />
        <Line
          type="monotone"
          dataKey="cpu"
          stroke="url(#cpuStroke)"
          strokeWidth={3}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
