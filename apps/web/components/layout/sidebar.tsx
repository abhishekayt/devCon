'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  LayoutDashboard,
  Box,
  Cpu,
  Database,
  Radio,
  Server,
  Settings,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const primaryNavigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Resources', href: '/resources', icon: Box },
  { name: 'AI Studio', href: '/ai-studio', icon: Sparkles },
  { name: 'Agents', href: '/agents', icon: Server },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const resourceFilters = [
  { name: 'Compute', href: '/resources?type=compute', icon: Cpu, type: 'compute' },
  { name: 'Postgres', href: '/resources?type=postgres', icon: Database, type: 'postgres' },
  { name: 'Redis', href: '/resources?type=redis', icon: Radio, type: 'redis' },
  { name: 'Stacks', href: '/resources?type=custom', icon: Sparkles, type: 'custom' },
];

export function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeType = searchParams.get('type');

  return (
    <aside className="hidden w-[290px] shrink-0 border-r border-white/10 bg-[#0f1724]/95 xl:flex xl:flex-col">
      <div className="border-b border-white/10 px-6 py-6">
        <div className="surface-card overflow-hidden bg-gradient-to-br from-sky-400/14 via-transparent to-amber-300/10 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-300 text-slate-950 shadow-[0_10px_35px_rgba(56,189,248,0.28)]">
              <Server className="h-5 w-5" />
            </div>
            <div>
              <p className="eyebrow">Local Control Plane</p>
              <h1 className="text-lg font-semibold tracking-tight">Devcon</h1>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            A cleaner command center for Docker resources, local agents, and generated infrastructure.
          </p>
        </div>
      </div>

      <div className="flex-1 space-y-8 overflow-y-auto px-4 py-6">
        <section className="space-y-2">
          <p className="px-3 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-muted-foreground/80">
            Navigation
          </p>
          <div className="space-y-1.5">
            {primaryNavigation.map((item) => {
              const active = pathname === item.href || (item.href === '/resources' && pathname.startsWith('/resources'));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'group flex items-center justify-between rounded-2xl px-3 py-3 text-sm transition-all',
                    active
                      ? 'bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]'
                      : 'text-muted-foreground hover:bg-white/5 hover:text-white'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'flex h-9 w-9 items-center justify-center rounded-xl border transition-colors',
                        active
                          ? 'border-sky-300/35 bg-sky-400/12 text-sky-100'
                          : 'border-white/10 bg-white/5 text-muted-foreground group-hover:text-white'
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                    </div>
                    <span className="font-medium">{item.name}</span>
                  </div>
                  {active && <ArrowUpRight className="h-4 w-4 text-amber-200" />}
                </Link>
              );
            })}
          </div>
        </section>

        <section className="space-y-3">
          <div className="px-3">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-muted-foreground/80">
              Resource Views
            </p>
          </div>
          <div className="space-y-2">
            {resourceFilters.map((item) => {
              const active = pathname.startsWith('/resources') && activeType === item.type;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition-all',
                    active ? 'bg-sky-400/10 text-sky-100' : 'text-muted-foreground hover:bg-white/5 hover:text-white'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="px-3">
          <div className="surface-card ambient-grid overflow-hidden p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-100/80">
              System Pulse
            </p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Treat this sidebar as the operator rail: move fast between fleet health, live containers, and generated Docker config.
            </p>
          </div>
        </section>
      </div>
    </aside>
  );
}
