'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { time: '00:00', cpu: 35 },
  { time: '04:00', cpu: 28 },
  { time: '08:00', cpu: 45 },
  { time: '12:00', cpu: 62 },
  { time: '16:00', cpu: 48 },
  { time: '20:00', cpu: 38 },
  { time: '24:00', cpu: 42 },
];

export function CPUChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="time"
          className="text-xs"
          stroke="hsl(var(--muted-foreground))"
        />
        <YAxis
          className="text-xs"
          stroke="hsl(var(--muted-foreground))"
          label={{ value: 'CPU %', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px'
          }}
        />
        <Line
          type="monotone"
          dataKey="cpu"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
