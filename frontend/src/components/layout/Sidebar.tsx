import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, TrendingUp, FileText, GitBranch,
  Activity, BarChart3, Bot, Package, Kanban, Sparkles,
} from 'lucide-react';
import clsx from 'clsx';

const nav = [
  { label: 'Executive Dashboard', to: '/', icon: LayoutDashboard },
  { type: 'divider', label: 'Pre-Sales' },
  { label: 'Pipeline', to: '/pipeline', icon: TrendingUp },
  { label: 'Contracts & SOWs', to: '/contracts', icon: FileText },
  { label: 'AI Deal Approvals', to: '/deal-approvals', icon: Bot, agentic: true },
  { type: 'divider', label: 'Delivery' },
  { label: 'Handoff Center', to: '/handoffs', icon: GitBranch },
  { label: 'Delivery Projects', to: '/delivery', icon: Activity },
  { label: 'AI Quality Assurance', to: '/quality-assurance', icon: Bot, agentic: true },
  { type: 'divider', label: 'Portfolio' },
  { label: 'Portfolio Dashboard', to: '/portfolio', icon: BarChart3 },
  { label: 'Service Catalog', to: '/catalog', icon: Package },
  { type: 'divider', label: 'Tools & Methods' },
  { label: 'DE Backlog', to: '/backlog', icon: Kanban },
  { type: 'divider', label: 'AI Assistant' },
  { label: 'Delivery Agent', to: '/agent', icon: Bot, agentic: true },
];

export default function Sidebar() {
  return (
    <aside className="relative w-64 flex-shrink-0 flex flex-col h-screen sticky top-0 bg-ink-rail text-white overflow-hidden">
      {/* faint engineering grid + cyan signal wash on the ink rail */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
        }}
      />
      <div
        className="pointer-events-none absolute -top-24 -right-16 h-64 w-64 rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(16,183,196,0.18), transparent 70%)' }}
      />

      {/* ── Wordmark ──────────────────────────────────────────────────── */}
      <div className="relative px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="relative grid h-10 w-10 place-items-center rounded-xl bg-flux-sheen shadow-[0_8px_22px_-8px_rgba(37,64,217,0.8)]">
            <Sparkles className="h-5 w-5 text-white" strokeWidth={2} />
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-cyan-glow shadow-[0_0_8px_2px_rgba(95,227,236,0.7)]" />
          </div>
          <div className="leading-none">
            <div className="font-display text-[17px] font-semibold tracking-tight text-white">
              Delivery
            </div>
            <div
              className="font-display text-[17px] font-semibold italic leading-tight"
              style={{ background: 'linear-gradient(110deg,#9fb1ff,#7fe6ee)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}
            >
              Excellence
            </div>
          </div>
        </div>
        <div className="mt-3 font-mono text-[9px] uppercase tracking-[0.24em] text-white/35">
          Atelier&nbsp;OS · Agentic
        </div>
      </div>

      <div className="relative mx-5 h-px bg-white/10" />

      {/* ── Navigation ────────────────────────────────────────────────── */}
      <nav className="relative flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
        {nav.map((item, i) => {
          if ('type' in item) {
            return (
              <div key={i} className="px-3 pt-5 pb-1.5">
                <span className="font-mono text-[9.5px] font-semibold uppercase tracking-[0.22em] text-white/30">
                  {item.label}
                </span>
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
                  'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-[13.5px] transition-all duration-200',
                  isActive
                    ? 'bg-white/[0.07] text-white'
                    : 'text-white/55 hover:bg-white/[0.04] hover:text-white'
                )
              }
            >
              {({ isActive }) => (
                <>
                  {/* active signal bar */}
                  <span
                    className={clsx(
                      'absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full transition-all duration-300',
                      isActive ? 'bg-flux-sheen opacity-100' : 'opacity-0'
                    )}
                  />
                  <Icon
                    className={clsx(
                      'h-[18px] w-[18px] flex-shrink-0 transition-colors',
                      isActive ? 'text-cyan-glow' : 'text-white/45 group-hover:text-white/80'
                    )}
                    strokeWidth={isActive ? 2.2 : 1.8}
                  />
                  <span className="flex-1">{item.label}</span>
                  {item.agentic && (
                    <span className="signal-dot !h-1.5 !w-1.5 opacity-80" aria-hidden />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* ── Agentic status footer ─────────────────────────────────────── */}
      <div className="relative border-t border-white/10 px-4 py-3.5">
        <div className="flex items-center gap-2">
          <span className="signal-dot" aria-hidden />
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-glow">
            3 Agents Online
          </span>
        </div>
        <div className="mt-1.5 text-[11px] text-white/40">Contoso Professional Services</div>
        <div className="font-mono text-[10px] text-white/25">Delivery Excellence · v1.0</div>
      </div>
    </aside>
  );
}
