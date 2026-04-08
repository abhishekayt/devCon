'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Cpu, Database, Radio, Play, RotateCw, Square, Trash2, Sparkles, Terminal } from 'lucide-react';
import { Resource } from '@/types/resource';
import { formatDistanceToNow } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ResourceInspectorDialog } from '@/components/resources/resource-inspector-dialog';

interface ResourceCardProps {
  resource: Resource;
  onStart: (id: string) => void;
  onRestart: (id: string) => void;
  onStop: (id: string) => void;
  onDelete: (id: string) => void;
  onGenerateWithAi: (resource: Resource) => void;
}

const typeIcons = {
  compute: Cpu,
  postgres: Database,
  redis: Radio,
  custom: Sparkles,
};

const typeLabels = {
  compute: 'Compute',
  postgres: 'PostgreSQL',
  redis: 'Redis',
  custom: 'Custom Compose',
};

const statusColors = {
  CREATED: 'border-slate-400/20 bg-slate-400/10 text-slate-100',
  CREATING: 'border-sky-400/20 bg-sky-400/10 text-sky-100',
  RUNNING: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100',
  STOPPED: 'border-white/10 bg-white/5 text-zinc-300',
  EXITED: 'border-amber-400/20 bg-amber-400/10 text-amber-100',
  ERROR: 'border-red-400/20 bg-red-400/10 text-red-100',
};

export function ResourceCard({
  resource,
  onStart,
  onRestart,
  onStop,
  onDelete,
  onGenerateWithAi,
}: ResourceCardProps) {
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const Icon = typeIcons[resource.type];
  const isRunning = resource.status === 'RUNNING';
  const isStopped =
    resource.status === 'STOPPED' || resource.status === 'EXITED' || resource.status === 'CREATED';
  const createdAt = new Date(resource.created_at * 1000);
  const hostPorts = resource.host_ports ?? [];
  const containerPorts = resource.container_ports ?? [];

  return (
    <Card className="surface-card border-white/10 bg-white/[0.04] transition-transform duration-200 hover:-translate-y-1">
      <CardHeader className="space-y-4 pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-black/20">
              <Icon className="h-5 w-5 text-orange-200" />
            </div>
            <div>
              <CardTitle className="text-lg text-white">{resource.name}</CardTitle>
              <p className="mt-1 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                {typeLabels[resource.type]}
              </p>
            </div>
          </div>
          <Badge variant="outline" className={statusColors[resource.status]}>
            {resource.status}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Image</p>
            <p className="mt-2 truncate font-medium text-white">{resource.image}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Ports</p>
            <p className="mt-2 font-medium text-white">
              {hostPorts.length > 0
                ? hostPorts.map((port, index) => `${port}:${containerPorts[index] ?? '?'}`).join(', ')
                : 'No published ports'}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Created</p>
          <p className="mt-1 text-sm text-zinc-200">
            {formatDistanceToNow(createdAt, { addSuffix: true })}
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          className="h-11 w-full rounded-2xl border border-orange-400/20 bg-orange-500/10 text-orange-100 hover:bg-orange-500/15"
          onClick={() => onGenerateWithAi(resource)}
        >
          <Sparkles className="mr-2 h-3.5 w-3.5" />
          Generate Docker config with AI
        </Button>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-10 rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10"
            onClick={() => setIsInspectorOpen(true)}
          >
            <Terminal className="mr-2 h-3.5 w-3.5" />
            Inspect
          </Button>
          {isStopped && (
            <Button
              variant="outline"
              size="sm"
              className="h-10 rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10"
              onClick={() => onStart(resource.id)}
            >
              <Play className="mr-2 h-3.5 w-3.5" />
              Start
            </Button>
          )}
          {isRunning && (
            <Button
              variant="outline"
              size="sm"
              className="h-10 rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10"
              onClick={() => onRestart(resource.id)}
            >
              <RotateCw className="mr-2 h-3.5 w-3.5" />
              Restart
            </Button>
          )}
          {isRunning && (
            <Button
              variant="outline"
              size="sm"
              className="h-10 rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10"
              onClick={() => onStop(resource.id)}
            >
              <Square className="mr-2 h-3.5 w-3.5" />
              Stop
            </Button>
          )}
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-10 w-full rounded-2xl border-red-400/20 bg-red-500/5 text-red-200 hover:bg-red-500/10"
            >
              <Trash2 className="mr-2 h-3.5 w-3.5" />
              Delete Resource
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Resource</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete <span className="font-semibold">{resource.name}</span>? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDelete(resource.id)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <ResourceInspectorDialog
          resource={resource}
          open={isInspectorOpen}
          onOpenChange={setIsInspectorOpen}
        />
      </CardContent>
    </Card>
  );
}
