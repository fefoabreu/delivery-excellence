import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, TrendingUp, DollarSign, Users } from 'lucide-react';
import { opportunitiesApi } from '../api/client';
import Header from '../components/layout/Header';
import StageChip from '../components/shared/StageChip';
import StatCard from '../components/shared/StatCard';
import EmptyState from '../components/shared/EmptyState';
import type { Opportunity } from '../types';

const STAGES = ['prospect', 'qualify', 'develop', 'propose', 'negotiate', 'closed_won', 'closed_lost'];

const fmt = (v: number) => v >= 1_000_000
  ? `$${(v / 1_000_000).toFixed(1)}M`
  : v >= 1_000 ? `$${(v / 1_000).toFixed(0)}K` : `$${v}`;

export default function Pipeline() {
  const [opps, setOpps] = useState<Opportunity[]>([]);
  const [search, setSearch] = useState('');
  const [stage, setStage] = useState('');
  const [region, setRegion] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    opportunitiesApi.list().then(r => setOpps(r.data)).finally(() => setLoading(false));
  }, []);

  const active = opps.filter(o => !['closed_won', 'closed_lost'].includes(o.stage));
  const filtered = opps.filter(o =>
    (!stage || o.stage === stage) &&
    (!region || o.region === region) &&
    (!search || o.name.toLowerCase().includes(search.toLowerCase()) || o.client_name.toLowerCase().includes(search.toLowerCase()))
  );

  const totalPipeline = active.reduce((s, o) => s + o.estimated_value, 0);
  const weighted = active.reduce((s, o) => s + o.weighted_value, 0);
  const won = opps.filter(o => o.stage === 'closed_won');

  return (
    <div>
      <Header
        eyebrow="Pre-Sales · Dynamics Pipeline"
        title="Sales Pipeline"
        subtitle="Microsoft Dynamics pipeline framework"
        actions={
          <Link to="/pipeline/new" className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Opportunity
          </Link>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Active Pipeline" value={fmt(totalPipeline)} sub={`${active.length} opportunities`} icon={TrendingUp} color="blue" />
        <StatCard label="Weighted Value" value={fmt(weighted)} sub="Probability-adjusted" icon={DollarSign} color="green" />
        <StatCard label="Closed Won" value={fmt(won.reduce((s, o) => s + o.estimated_value, 0))} sub={`${won.length} deals`} icon={TrendingUp} color="purple" />
        <StatCard label="Avg Deal Size" value={fmt(active.length ? totalPipeline / active.length : 0)} sub="Active opportunities" icon={Users} color="amber" />
      </div>

      {/* Kanban-style stage summary */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {STAGES.slice(0, 5).map(s => {
          const stageOpps = opps.filter(o => o.stage === s);
          return (
            <button
              key={s}
              onClick={() => setStage(stage === s ? '' : s)}
              className={`flex-shrink-0 px-4 py-3 rounded-xl border text-left transition-all min-w-[140px] ${stage === s ? 'border-flux bg-flux-light shadow-glow' : 'border-line bg-paper hover:border-flux/40 hover:-translate-y-0.5'}`}
            >
              <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint capitalize mb-1.5">{s}</div>
              <div className="kpi-number text-2xl text-ink">{stageOpps.length}</div>
              <div className="text-xs text-ink-faint mt-0.5">{fmt(stageOpps.reduce((s, o) => s + o.estimated_value, 0))}</div>
            </button>
          );
        })}
      </div>

      <div className="card">
        <div className="p-4 border-b border-gray-100 flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input className="input pl-9" placeholder="Search opportunities..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="input w-auto" value={stage} onChange={e => setStage(e.target.value)}>
            <option value="">All stages</option>
            {STAGES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
          </select>
          <select className="input w-auto" value={region} onChange={e => setRegion(e.target.value)}>
            <option value="">All regions</option>
            <option value="Americas">Americas</option>
            <option value="EMEA">EMEA</option>
            <option value="APAC">APAC</option>
          </select>
          <span className="text-sm text-gray-500">{filtered.length} results</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={TrendingUp} title="No opportunities found" description="Create your first opportunity to start tracking your pipeline." action={<Link to="/pipeline/new" className="btn-primary">New Opportunity</Link>} />
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map(opp => (
              <Link key={opp.id} to={`/pipeline/${opp.id}`} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 truncate">{opp.name}</span>
                    <StageChip stage={opp.stage} />
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                    <span>{opp.client_name}</span>
                    {opp.owner && <span>· {opp.owner}</span>}
                    {opp.region && <span>· {opp.region}</span>}
                    {opp.industry && <span>· {opp.industry}</span>}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-semibold text-gray-900">{fmt(opp.estimated_value)}</div>
                  <div className="text-xs text-gray-400">{opp.probability}% · {fmt(opp.weighted_value)} weighted</div>
                </div>
                {opp.close_date && (
                  <div className="text-right flex-shrink-0 hidden lg:block">
                    <div className="text-xs text-gray-500">Close date</div>
                    <div className="text-sm font-medium text-gray-700">{opp.close_date}</div>
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
