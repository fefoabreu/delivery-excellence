import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Bot, Siren, Rocket } from 'lucide-react';
import { loadPortfolio, rescueHref, oversightHref, fmtMoney, type UnifiedProject } from '../api/portfolioData';
import Header from '../components/layout/Header';
import HealthBadge from '../components/shared/HealthBadge';
import EmptyState from '../components/shared/EmptyState';
import type { HealthStatus } from '../types';

const DIMS = ['schedule', 'budget', 'scope', 'risk', 'satisfaction'] as const;
const ewColor = (v: number) => v >= 75 ? 'text-red-600' : v >= 50 ? 'text-amber-600' : v >= 30 ? 'text-yellow-600' : 'text-green-600';
const ewHex = (v: number) => v >= 75 ? '#dc2626' : v >= 50 ? '#d97706' : v >= 30 ? '#ca8a04' : '#16a34a';
const ALERT_CFG: Record<string, { label: string; cls: string }> = {
  critical: { label: 'Critical', cls: 'bg-red-100 text-red-700' },
  caution: { label: 'Caution', cls: 'bg-amber-100 text-amber-700' },
  watch: { label: 'Watch', cls: 'bg-yellow-100 text-yellow-700' },
};
const dotCls = (h?: string) => h === 'green' ? 'bg-green-500' : h === 'amber' ? 'bg-amber-500' : h === 'red' ? 'bg-red-500' : 'bg-gray-300';
const predCls = (h?: string) => h === 'green' ? 'text-green-700' : h === 'amber' ? 'text-amber-700' : 'text-red-700';

export default function Delivery() {
  const [projects, setProjects] = useState<UnifiedProject[]>([]);
  const [filter, setFilter] = useState('active');
  const [view, setView] = useState<'all' | 'attention' | 'rescue' | 'oversight'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPortfolio().then(b => setProjects(b.projects)).finally(() => setLoading(false));
  }, []);

  let filtered = filter ? projects.filter(p => p.status === filter) : projects;
  if (view === 'attention') filtered = filtered.filter(p => p.hasQA && (p.overall_health !== 'green' || (p.ew || 0) >= 50));
  if (view === 'rescue') filtered = filtered.filter(p => p.isRescue);
  if (view === 'oversight') filtered = filtered.filter(p => p.isOversight);
  filtered = [...filtered].sort((a, b) => (b.ew || 0) - (a.ew || 0));

  const counts = {
    active: projects.filter(p => p.status === 'active').length,
    on_hold: projects.filter(p => p.status === 'on_hold').length,
    completed: projects.filter(p => p.status === 'completed').length,
    cancelled: projects.filter(p => p.status === 'cancelled').length,
  };

  return (
    <div>
      <Header
        eyebrow="Delivery · Active Engagements"
        title="Delivery Projects"
        subtitle="AI-monitored engagement health · synced with Quality Assurance"
        actions={<Link to="/quality-assurance" className="btn-secondary flex items-center gap-2"><Bot className="w-4 h-4" /> QA Portfolio Monitor</Link>}
      />

      <div className="flex flex-wrap items-center gap-2 mb-5">
        {(['active', 'on_hold', 'completed', 'cancelled', ''] as const).map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${filter === s ? 'bg-ms-blue text-white' : 'bg-white border border-gray-200 text-ink-soft hover:bg-gray-50'}`}>
            {s === '' ? 'All statuses' : s.replace('_', ' ')}
            {s && <span className="ml-1 opacity-60">{(counts as any)[s]}</span>}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          {([['all', 'All'], ['attention', 'Needs attention'], ['rescue', 'In rescue'], ['oversight', 'Oversight']] as const).map(([v, label]) => (
            <button key={v} onClick={() => setView(v)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${view === v ? 'bg-ink text-white' : 'bg-white border border-gray-200 text-ink-soft hover:bg-gray-50'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-ink-faint">Loading...</div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Activity} title="No engagements match" description="Adjust the status or view filters." />
      ) : (
        <div className="space-y-4">
          {filtered.map(p => (
            <div key={p.id} className="card p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-start gap-3 min-w-0">
                  {p.hasQA && (
                    <div className="relative w-12 h-12 flex-shrink-0">
                      <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="15.5" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                        <circle cx="18" cy="18" r="15.5" fill="none" stroke={ewHex(p.ew || 0)} strokeWidth="3" strokeDasharray={`${p.ew} 100`} strokeLinecap="round" />
                      </svg>
                      <span className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${ewColor(p.ew || 0)}`}>{p.ew}</span>
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link to={`/delivery/${p.id}`}><h3 className="font-semibold text-ink hover:text-flux transition-colors">{p.name}</h3></Link>
                      <HealthBadge status={p.overall_health as HealthStatus} size="sm" />
                      {p.alert_level && <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ALERT_CFG[p.alert_level].cls}`}>{ALERT_CFG[p.alert_level].label}</span>}
                      {p.isRescue && <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-600 text-white"><Siren className="w-3 h-3" /> Rescue</span>}
                      {p.isOversight && <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200"><Rocket className="w-3 h-3" /> Oversight</span>}
                    </div>
                    <div className="text-sm text-ink-faint mt-0.5">{p.client_name} · PM: {p.project_manager || '—'} · {p.phase || '—'}</div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-semibold text-ink">{fmtMoney(p.budget)}</div>
                  <div className="text-xs text-ink-faint">{p.burn_rate}% burn</div>
                </div>
              </div>

              {/* dimensions + predictions */}
              <div className="flex items-center gap-3 flex-wrap mb-3">
                {DIMS.map(d => (
                  <div key={d} className="flex items-center gap-1 text-xs text-ink-soft">
                    <div className={`w-2 h-2 rounded-full ${dotCls(p.dims[d])}`} /> {d}
                  </div>
                ))}
                {p.hasQA && (
                  <div className="ml-auto flex items-center gap-2 text-xs text-ink-faint">
                    <span>30d <span className={`font-semibold ${predCls(p.prediction_30d)}`}>{(p.prediction_30d || '—').toUpperCase()}</span></span>
                    <span>60d <span className={`font-semibold ${predCls(p.prediction_60d)}`}>{(p.prediction_60d || '—').toUpperCase()}</span></span>
                    <span>90d <span className={`font-semibold ${predCls(p.prediction_90d)}`}>{(p.prediction_90d || '—').toUpperCase()}</span></span>
                  </div>
                )}
              </div>

              {/* progress + actions */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-ms-blue rounded-full transition-all" style={{ width: `${p.completion_pct}%` }} />
                </div>
                <span className="text-xs text-ink-soft flex-shrink-0">{p.completion_pct}%</span>
                {p.isRescue && <Link to={rescueHref(p)} className="flex-shrink-0 inline-flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white text-[11px] font-semibold px-2.5 py-1 rounded"><Siren className="w-3 h-3" /> Rescue Command</Link>}
                {p.isOversight && <Link to={oversightHref(p)} className="flex-shrink-0 inline-flex items-center gap-1 bg-gradient-to-r from-sky-600 to-teal-500 hover:from-sky-700 hover:to-teal-600 text-white text-[11px] font-semibold px-2.5 py-1 rounded"><Rocket className="w-3 h-3" /> Oversight Studio</Link>}
                <Link to={`/delivery/${p.id}`} className="flex-shrink-0 text-xs text-flux hover:underline">Details →</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
