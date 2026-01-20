'use client';

import { ChevronDown, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

export function Header() {
  return (
    <header className="flex items-center justify-between h-16 px-6 border-b border-border bg-card">
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <span className="font-medium">Production Workspace</span>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem>Production Workspace</DropdownMenuItem>
            <DropdownMenuItem>Development Workspace</DropdownMenuItem>
            <DropdownMenuItem>Staging Workspace</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-3">
        <Badge variant="secondary" className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">
          <Circle className="w-2 h-2 mr-2 fill-current" />
          Local Mode
        </Badge>
        <Badge variant="outline" className="border-green-500/30">
          <Circle className="w-2 h-2 mr-2 fill-green-500" />
          Agent Connected
        </Badge>
      </div>
    </header>
  );
}
