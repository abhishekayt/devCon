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
import { Resource, ResourceType } from '@/app/resources/page';

interface CreateResourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (resource: Omit<Resource, 'id' | 'cpu' | 'memory' | 'createdAt'>) => void;
}

export function CreateResourceDialog({ open, onOpenChange, onCreate }: CreateResourceDialogProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<ResourceType>('compute');
  const [cpuLimit, setCpuLimit] = useState('1 core');
  const [memoryLimit, setMemoryLimit] = useState('2 GB');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({
      name,
      type,
      status: 'CREATING',
      cpuLimit,
      memoryLimit,
    });
    setName('');
    setType('compute');
    setCpuLimit('1 core');
    setMemoryLimit('2 GB');
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cpu">CPU Limit</Label>
                <Select value={cpuLimit} onValueChange={setCpuLimit}>
                  <SelectTrigger id="cpu">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.5 cores">0.5 cores</SelectItem>
                    <SelectItem value="1 core">1 core</SelectItem>
                    <SelectItem value="2 cores">2 cores</SelectItem>
                    <SelectItem value="4 cores">4 cores</SelectItem>
                    <SelectItem value="8 cores">8 cores</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="memory">Memory Limit</Label>
                <Select value={memoryLimit} onValueChange={setMemoryLimit}>
                  <SelectTrigger id="memory">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="512 MB">512 MB</SelectItem>
                    <SelectItem value="1 GB">1 GB</SelectItem>
                    <SelectItem value="2 GB">2 GB</SelectItem>
                    <SelectItem value="4 GB">4 GB</SelectItem>
                    <SelectItem value="8 GB">8 GB</SelectItem>
                    <SelectItem value="16 GB">16 GB</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
