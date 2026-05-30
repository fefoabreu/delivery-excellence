import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, TrendingUp, FileText, GitBranch,
  Activity, BarChart3, Bot, Package, ChevronRight, Kanban, Siren, Rocket,
} from 'lucide-react';
import clsx from 'clsx';

const nav = [
  { label: 'Executive Dashboard', to: '/', icon: LayoutDashboard },
  { type: 'divider', label: 'PRE-SALES' },
  { label: 'Pipeline', to: '/pipeline', icon: TrendingUp },
  { label: 'Contracts & SOWs', to: '/contracts', icon: FileText },
  { label: 'AI Deal Approvals', to: '/deal-approvals', icon: Bot },
  { type: 'divider', label: 'DELIVERY' },
  { label: 'Handoff Center', to: '/handoffs', icon: GitBranch },
  { label: 'Delivery Projects', to: '/delivery', icon: Activity },
  { label: 'AI Quality Assurance', to: '/quality-assurance', icon: Bot },
  { label: 'Rescue Command', to: '/rescue-command', icon: Siren, indicator: { color: 'red', count: 2 } },
  { label: 'Oversight Studio', to: '/oversight', icon: Rocket, indicator: { color: 'sky', count: 2 } },
  { type: 'divider', label: 'PORTFOLIO' },
  { label: 'Portfolio Dashboard', to: '/portfolio', icon: BarChart3 },
  { label: 'Service Catalog', to: '/catalog', icon: Package },
  { type: 'divider', label: 'TOOLS & METHODS' },
  { label: 'DE Backlog', to: '/backlog', icon: Kanban },
  { type: 'divider', label: 'AI ASSISTANT' },
  { label: 'Delivery Agent', to: '/agent', icon: Bot },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-sidebar flex-shrink-0 flex flex-col h-screen sticky top-0">
      <div className="px-6 py-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-ms-blue rounded-md flex items-center justify-center">
            <ChevronRight className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-white font-bold text-sm leading-tight">Delivery</div>
            <div className="text-blue-300 text-xs leading-tight">Excellence</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
        {nav.map((item, i) => {
          if ('type' in item) {
            return (
              <div key={i} className="px-3 pt-5 pb-1">
                <span className="text-[10px] font-semibold tracking-widest text-gray-500 uppercase">{item.label}</span>
              </div>
            );
          }
          const Icon = item.icon!;
          return (
            <NavLink
              key={item.to}
              to={item.to!}
              end={item.to === '/'}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors group',
                  isActive
                    ? 'bg-ms-blue text-white'
                    : 'text-gray-400 hover:bg-sidebar-hover hover:text-white'
                )
              }
            >
              {(() => {
                const ind = 'indicator' in item ? item.indicator : undefined;
                const isRed = ind?.color === 'red';
                return <>
                  <Icon className={clsx('w-4 h-4 flex-shrink-0', ind && (isRed ? 'text-red-400' : 'text-sky-400'))} />
                  <span>{item.label}</span>
                  {ind && (
                    <span className="ml-auto flex items-center gap-1">
                      <span className="relative flex h-2 w-2">
                        <span className={clsx('absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping', isRed ? 'bg-red-500' : 'bg-sky-500')} />
                        <span className={clsx('relative inline-flex rounded-full h-2 w-2', isRed ? 'bg-red-500' : 'bg-sky-500')} />
                      </span>
                      <span className={clsx('text-[10px] font-bold', isRed ? 'text-red-400' : 'text-sky-400')}>{ind.count}</span>
                    </span>
                  )}
                </>;
              })()}
            </NavLink>
          );
        })}
      </nav>

      <div className="px-4 py-3 border-t border-white/10">
        <div className="text-xs text-gray-500">Contoso Professional Services</div>
        <div className="text-xs text-gray-600">Delivery Excellence v1.0</div>
      </div>
    </aside>
  );
}
