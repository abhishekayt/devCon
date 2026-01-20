"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Box, Cpu, HardDrive } from "lucide-react";
import { CPUChart } from "@/components/dashboard/cpu-chart";

const stats = [
  {
    title: "Total Resources",
    value: "12",
    icon: Box,
    description: "3 active",
  },
  {
    title: "Running Containers",
    value: "8",
    icon: Activity,
    description: "2 pending",
  },
  {
    title: "Total CPU Usage",
    value: "42%",
    icon: Cpu,
    description: "Across all resources",
  },
  {
    title: "Total Memory Usage",
    value: "8.4 GB",
    icon: HardDrive,
    description: "of 16 GB allocated",
  },
];

export default function DashboardPage() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Overview of your local development environment
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>CPU Usage Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <CPUChart />
        </CardContent>
      </Card>
    </div>
  );
}
