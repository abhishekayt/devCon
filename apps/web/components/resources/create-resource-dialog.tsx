'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CreateResourcePayload, ResourceType } from '@/types/resource';

interface CreateResourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (resource: CreateResourcePayload) => void;
}

export function CreateResourceDialog({ open, onOpenChange, onCreate }: CreateResourceDialogProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<ResourceType>('compute');
  const [hostPort, setHostPort] = useState('3000');

  const presets: Record<ResourceType, { image: string; containerPort: string; env?: string[] }> = {
    compute: { image: 'nginx:alpine', containerPort: '80' },
    postgres: { image: 'postgres:16', containerPort: '5432', env: ['POSTGRES_PASSWORD=devcon', 'POSTGRES_DB=devcon'] },
    redis: { image: 'redis:7-alpine', containerPort: '6379' },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const preset = presets[type];
    onCreate({
      name,
      image: preset.image,
      containerPort: preset.containerPort,
      hostPort,
      env: preset.env,
    });
    setName('');
    setType('compute');
    setHostPort('3000');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Resource</DialogTitle>
          <DialogDescription>
            Configure and deploy a new resource to your local environment
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="type">Resource Type</Label>
              <Select value={type} onValueChange={(value) => setType(value as ResourceType)}>
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compute">Compute Container</SelectItem>
                  <SelectItem value="postgres">PostgreSQL Database</SelectItem>
                  <SelectItem value="redis">Redis Cache</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Resource Name</Label>
              <Input
                id="name"
                placeholder="my-api-service"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Use lowercase letters, numbers, and hyphens
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="host-port">Host Port</Label>
              <Input
                id="host-port"
                placeholder="3000"
                value={hostPort}
                onChange={(e) => setHostPort(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                {type === 'compute' && 'Maps to container port 80 using nginx:alpine'}
                {type === 'postgres' && 'Maps to container port 5432 using postgres:16'}
                {type === 'redis' && 'Maps to container port 6379 using redis:7-alpine'}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Resource</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
