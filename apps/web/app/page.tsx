"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Box, Cpu, HardDrive } from "lucide-react";
import { CPUChart } from "@/components/dashboard/cpu-chart";
import { container_service } from "@/service/container/container.service";
import { system_service } from "@/service/system/system.service";
import { Resource } from "@/types/resource";
import { SystemStats } from "@/types/system";

export default function DashboardPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [cpuHistory, setCpuHistory] = useState<Array<{ time: string; cpu: number }>>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const [resourceRes, systemRes] = await Promise.all([
        container_service.getResources(),
        system_service.getSystemStats(),
      ]);

      setResources(resourceRes.data.resources);
      setSystemStats(systemRes.data.stats);
      setCpuHistory((prev) => [
        ...prev.slice(-11),
        {
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          cpu: Number(systemRes.data.stats.cpu.usage_percent.toFixed(1)),
        },
      ]);
    };

    void fetchDashboardData();
    const interval = window.setInterval(() => {
      void fetchDashboardData();
    }, 10000);

    return () => window.clearInterval(interval);
  }, []);

  const runningCount = useMemo(
    () => resources.filter((resource) => resource.status === "RUNNING").length,
    [resources]
  );

  const stats = [
    {
      title: "Total Resources",
      value: String(resources.length),
      icon: Box,
      description: `${runningCount} active`,
    },
    {
      title: "Running Containers",
      value: String(runningCount),
      icon: Activity,
      description: `${Math.max(resources.length - runningCount, 0)} stopped`,
    },
    {
      title: "Total CPU Usage",
      value: systemStats ? `${Math.round(systemStats.cpu.usage_percent)}%` : "--",
      icon: Cpu,
      description: systemStats ? systemStats.cpu.model : "Across all resources",
    },
    {
      title: "Total Memory Usage",
      value: systemStats ? `${systemStats.memory.used_gb.toFixed(1)} GB` : "--",
      icon: HardDrive,
      description: systemStats
        ? `of ${systemStats.memory.total_gb.toFixed(1)} GB total`
        : "Host memory",
    },
  ];

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
          <CPUChart data={cpuHistory.length > 0 ? cpuHistory : undefined} />
        </CardContent>
      </Card>
    </div>
  );
}
