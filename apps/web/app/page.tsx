"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Box, Cpu, HardDrive, ArrowRight, Sparkles, Server } from "lucide-react";
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
      description: `${runningCount} active workloads`,
    },
    {
      title: "Running Containers",
      value: String(runningCount),
      icon: Activity,
      description: `${Math.max(resources.length - runningCount, 0)} idle or stopped`,
    },
    {
      title: "CPU Pressure",
      value: systemStats ? `${Math.round(systemStats.cpu.usage_percent)}%` : "--",
      icon: Cpu,
      description: systemStats ? systemStats.cpu.model : "Waiting for host metrics",
    },
    {
      title: "Memory Footprint",
      value: systemStats ? `${systemStats.memory.used_gb.toFixed(1)} GB` : "--",
      icon: HardDrive,
      description: systemStats
        ? `of ${systemStats.memory.total_gb.toFixed(1)} GB on host`
        : "Waiting for host metrics",
    },
  ];

  const activeResources = resources.slice(0, 4);

  return (
    <div className="section-shell space-y-6">
      <section className="surface-panel ambient-grid overflow-hidden px-6 py-7 sm:px-8 sm:py-8">
        <div className="grid gap-8 xl:grid-cols-[1.4fr_0.8fr]">
          <div className="space-y-5">
            <p className="eyebrow">Command Center</p>
            <div className="max-w-3xl space-y-3">
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Operate your local Docker environment without losing the thread.
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                Watch host pressure, keep resource state visible, and move directly into the containers that need work.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                <p className="text-muted-foreground">Agent Status</p>
                <p className="mt-1 font-semibold text-emerald-200">Connected and healthy</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                <p className="text-muted-foreground">Update Window</p>
                <p className="mt-1 font-semibold text-white">Every 10 seconds</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <div className="surface-card p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Live Fleet</p>
                <Server className="h-4 w-4 text-orange-300" />
              </div>
              <p className="mt-4 text-4xl font-semibold text-white">{runningCount}</p>
              <p className="mt-2 text-sm text-muted-foreground">containers currently serving traffic or workloads</p>
            </div>
            <div className="surface-card p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">AI Assist</p>
                <Sparkles className="h-4 w-4 text-sky-300" />
              </div>
              <p className="mt-4 text-lg font-semibold text-white">Generate Dockerfiles and Compose stacks faster</p>
              <p className="mt-2 text-sm text-muted-foreground">The studio stays close to runtime data instead of isolated from it.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="surface-card border-white/10 bg-white/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className="rounded-xl border border-white/10 bg-white/5 p-2">
                <stat.icon className="h-4 w-4 text-orange-200" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-white">{stat.value}</div>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <Card className="surface-card border-white/10 bg-white/5">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <p className="eyebrow">Telemetry</p>
              <CardTitle className="mt-2 text-2xl text-white">CPU usage over time</CardTitle>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-muted-foreground">
              {systemStats ? `${systemStats.cpu.cores} cores` : "Collecting"}
            </div>
          </CardHeader>
          <CardContent>
            <CPUChart data={cpuHistory.length > 0 ? cpuHistory : undefined} />
          </CardContent>
        </Card>

        <Card className="surface-card border-white/10 bg-white/5">
          <CardHeader>
            <p className="eyebrow">Attention Queue</p>
            <CardTitle className="mt-2 text-2xl text-white">Recent resources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeResources.length > 0 ? (
              activeResources.map((resource) => (
                <div
                  key={resource.id}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
                >
                  <div>
                    <p className="font-medium text-white">{resource.name}</p>
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      {resource.type}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">{resource.status}</span>
                    <ArrowRight className="h-4 w-4 text-orange-300" />
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-white/10 px-4 py-6 text-sm text-muted-foreground">
                No resources available yet.
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
