import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Plus, BarChart3 } from 'lucide-react';
import { deliveryApi } from '../api/client';
import Header from '../components/layout/Header';
import HealthBadge from '../components/shared/HealthBadge';
import EmptyState from '../components/shared/EmptyState';
import type { DeliveryProject, HealthStatus } from '../types';

const DIMS = ['schedule', 'budget', 'scope', 'risk', 'satisfaction'] as const;

export default function Delivery() {
  const [projects, setProjects] = useState<DeliveryProject[]>([]);
  const [filter, setFilter] = useState('active');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    deliveryApi.listProjects().then(r => setProjects(r.data)).finally(() => setLoading(false));
  }, []);

  const filtered = filter ? projects.filter(p => p.status === filter) : projects;
  const fmt = (v: number) => v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(1)}M` : `$${(v / 1_000).toFixed(0)}K`;

  return (
    <div>
      <Header
        title="Delivery Projects"
        subtitle="Active engagement health management"
        actions={
          <Link to="/delivery/new" className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Project
          </Link>
        }
      />

      <div className="flex gap-2 mb-6">
        {['active', 'on_hold', 'completed', ''].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${filter === s ? 'bg-ms-blue text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {s === '' ? 'All' : s.replace('_', ' ')}
          </button>
        ))}
        <span className="ml-auto text-sm text-gray-500 self-center">{filtered.length} projects</span>
      </div>

      {loading ? (
        <div className="p-8 text-center text-gray-400">Loading...</div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Activity} title="No delivery projects" description="Projects are created from active contracts after handoff." action={<Link to="/contracts" className="btn-secondary">View Contracts</Link>} />
      ) : (
        <div className="space-y-4">
          {filtered.map(p => (
            <Link key={p.id} to={`/delivery/${p.id}`} className="card p-5 block hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-900">{p.name}</h3>
                    <HealthBadge status={p.overall_health as HealthStatus} />
                  </div>
                  <div className="text-sm text-gray-500 mt-0.5">
                    {p.client_name} · PM: {p.project_manager || '—'} · Phase: {p.phase || '—'}
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <div className="text-sm font-semibold">{fmt(p.budget)}</div>
                  <div className="text-xs text-gray-400">Budget · {p.burn_rate}% burn</div>
                </div>
              </div>

              {/* Health Dimensions */}
              <div className="flex items-center gap-3 flex-wrap mb-3">
                {DIMS.map(d => (
                  <div key={d} className="flex items-center gap-1 text-xs text-gray-500">
                    <div className={`w-2 h-2 rounded-full ${p[`health_${d}` as keyof DeliveryProject] === 'green' ? 'bg-green-500' : p[`health_${d}` as keyof DeliveryProject] === 'amber' ? 'bg-amber-500' : 'bg-red-500'}`} />
                    {d}
                  </div>
                ))}
              </div>

              {/* Progress Bar */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-ms-blue rounded-full transition-all" style={{ width: `${p.completion_pct}%` }} />
                </div>
                <span className="text-xs text-gray-500 flex-shrink-0">{p.completion_pct}%</span>
                {p.open_raid_count > 0 && (
                  <span className="badge-amber flex-shrink-0">{p.open_raid_count} RAID</span>
                )}
                <span className="text-xs text-gray-400">{p.milestone_count} milestones</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
