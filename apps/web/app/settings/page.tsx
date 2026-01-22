'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

export default function SettingsPage() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your workspace and platform preferences
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Workspace</CardTitle>
            <CardDescription>
              Configure your workspace settings and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="workspace-name">Workspace Name</Label>
              <Input id="workspace-name" defaultValue="Production Workspace" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="workspace-slug">Workspace Slug</Label>
              <Input id="workspace-slug" defaultValue="production" />
              <p className="text-xs text-muted-foreground">
                Used in URLs and API endpoints
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Agent Settings</CardTitle>
            <CardDescription>
              Configure how the local agent interacts with your resources
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-start Resources</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically start resources when agent connects
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Health Checks</Label>
                <p className="text-sm text-muted-foreground">
                  Enable automatic health monitoring for resources
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Log Collection</Label>
                <p className="text-sm text-muted-foreground">
                  Collect and stream logs from containers
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resource Limits</CardTitle>
            <CardDescription>
              Default resource limits for new deployments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="default-cpu">Default CPU Limit</Label>
                <Input id="default-cpu" defaultValue="1 core" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="default-memory">Default Memory Limit</Label>
                <Input id="default-memory" defaultValue="2 GB" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Danger Zone</CardTitle>
            <CardDescription>
              Irreversible actions that affect your workspace
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-destructive/50 rounded-lg">
              <div>
                <h4 className="font-medium">Delete All Resources</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Stop and remove all resources in this workspace
                </p>
              </div>
              <Button variant="destructive">Delete All</Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button>Save Changes</Button>
        </div>
      </div>
    </div>
  );
}
