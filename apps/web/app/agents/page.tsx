"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Circle, Server, Monitor, Rss } from "lucide-react";
import { Button } from "@/components/ui/button";
import { system_service } from "@/service/system/system.service";
import { SystemStats } from "@/types/system";
import { container_service } from "@/service/container/container.service";
import { Resource } from "@/types/resource";

export default function AgentsPage() {
  const [stats, setStats] = useState<SystemStats>();
  const [resources, setResources] = useState<Resource[]>([]);
  const { getSystemStats } = system_service;
  const [loading, setLoading] = useState(false);

  const uptime = useMemo(() => {
    if (!stats?.host.uptime_seconds) {
      return "--";
    }

    const totalHours = Math.floor(stats.host.uptime_seconds / 3600);
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;
    const minutes = Math.floor((stats.host.uptime_seconds % 3600) / 60);

    return `${days}d ${hours}h ${minutes}m`;
  }, [stats?.host.uptime_seconds]);

  async function fetchStats() {
    setLoading(true);
    try {
      const [systemRes, resourceRes] = await Promise.all([
        getSystemStats(),
        container_service.getResources(),
      ]);
      setStats(systemRes.data.stats);
      setResources(resourceRes.data.resources);
    } catch (error) {
      console.log("err", error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchStats();
  }, []);
  if (!stats) return <div>Loading</div>;
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Agents</h1>
        <p className="text-muted-foreground mt-2">
          Manage local agents that connect your machine to the platform
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Server className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Local Agent</CardTitle>
                  <CardDescription className="mt-1">
                    {stats?.host.hostname}
                  </CardDescription>
                </div>
              </div>
              <Badge variant="outline" className="border-green-500/30">
                <Circle className="w-2 h-2 mr-2 fill-green-500" />
                Connected
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Mode</p>
                <p className="text-sm font-medium mt-1">Local Development</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Operating System
                </p>
                <p className="text-sm font-medium mt-1">
                  {stats?.host.platform}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Agent Version</p>
                <p className="text-sm font-medium mt-1">v1.4.2</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Uptime</p>
                <p className="text-sm font-medium mt-1">{uptime}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-border space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Resources Managed</span>
                <span className="font-medium">{resources.length} containers</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Last Heartbeat</span>
                <span className="font-medium">{loading ? "Refreshing..." : "Live"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-lg">
                <Monitor className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <CardTitle>System Resources</CardTitle>
                <CardDescription className="mt-1">
                  Host machine capacity
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">CPU Cores</span>
                  <span className="font-medium">{`${stats?.cpu.cores} (${stats.cpu.model})`}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${Math.floor(stats.cpu.usage_percent)}%` }} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.floor(stats.cpu.usage_percent)}% utilized
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Memory</span>
                  <span className="font-medium">
                    {Math.floor(stats.memory.total_gb)}GB
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${Math.floor(stats.memory.used_percent)}%` }} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.floor(stats.memory.used_gb)} GB /
                  {Math.floor(stats.memory.total_gb)} GB
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Disk Space</span>
                  <span className="font-medium">
                    {Math.floor(stats.disk.total_gb)} GB
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{
                      width: Math.floor(stats.disk.used_percent),
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.floor(stats.disk.used_gb)} GB /{" "}
                  {Math.floor(stats.disk.total_gb)} GB
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Install Agent</CardTitle>
          <CardDescription>
            Run this command to install the agent on a new machine
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code className="text-sm font-mono">
                docker run -d --name devplatform-agent \{"\n"}
                {"  "}-v /var/run/docker.sock:/var/run/docker.sock \{"\n"}
                {"  "}-e AGENT_TOKEN=your_secret_token \{"\n"}
                {"  "}-e PLATFORM_URL=http://localhost:8080 \{"\n"}
                {"  "}ghcr.io/devcon/agent:latest
              </code>
            </pre>
            <Button
              size="sm"
              variant="secondary"
              className="absolute top-2 right-2"
              onClick={() => {
                navigator.clipboard.writeText(
                  "docker run -d --name devplatform-agent -v /var/run/docker.sock:/var/run/docker.sock -e AGENT_TOKEN=your_secret_token -e PLATFORM_URL=http://localhost:8080 ghcr.io/devcon/agent:latest"
                );
              }}>
              Copy
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            After installation, the agent will automatically connect to your
            workspace and appear in this dashboard.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
