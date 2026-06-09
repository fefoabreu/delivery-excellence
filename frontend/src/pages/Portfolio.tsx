import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, TrendingUp, Activity, DollarSign, AlertTriangle, Gauge, Siren, Rocket } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend, RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from 'recharts';
import { portfolioApi } from '../api/client';
import { loadPortfolio, rescueHref, oversightHref, fmtMoney, type PortfolioIntel, type UnifiedProject } from '../api/portfolioData';
import Header from '../components/layout/Header';
import StatCard from '../components/shared/StatCard';
import HealthBadge from '../components/shared/HealthBadge';
import GlassPanel from '../components/shared/GlassPanel';
import type { PipelineMetrics, HealthStatus } from '../types';

const STAGE_LABELS: Record<string, string> = {
  prospect: 'Prospect', qualify: 'Qualify', develop: 'Develop', propose: 'Propose', negotiate: 'Negotiate',
};
const HEALTH_COLORS = { green: '#1c7c54', amber: '#be7415', red: '#b23a3a' };
const fmt = fmtMoney;
const ewColor = (v: number) => v >= 75 ? 'text-red-600' : v >= 50 ? 'text-amber-600' : v >= 30 ? 'text-yellow-600' : 'text-green-600';
const ewHex = (v: number) => v >= 75 ? '#dc2626' : v >= 50 ? '#d97706' : v >= 30 ? '#ca8a04' : '#16a34a';

export default function Portfolio() {
  const [pipeline, setPipeline] = useState<PipelineMetrics | null>(null);
  const [intel, setIntel] = useState<PortfolioIntel | null>(null);
  const [projects, setProjects] = useState<UnifiedProject[]>([]);
  const [tab, setTab] = useState<'pipeline' | 'delivery'>('delivery');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([portfolioApi.pipelineMetrics(), loadPortfolio()])
      .then(([p, bundle]) => { setPipeline(p.data); setIntel(bundle.intel); setProjects(bundle.projects); })
      .finally(() => setLoading(false));
  }, []);

  if (loading || !intel) return <div className="p-8 text-ink-faint">Loading portfolio…</div>;

  const funnelData = Object.entries(pipeline?.by_stage || {}).map(([k, v]) => ({
    stage: STAGE_LABELS[k] || k, value: Math.round(v.value / 1000), weighted: Math.round(v.weighted / 1000),
  }));
  const regionData = Object.entries(pipeline?.by_region || {}).map(([k, v]) => ({ name: k, value: v.count }));
  const ownerData = Object.entries(pipeline?.by_owner || {}).map(([k, v]) => ({ name: k.split(' ')[0], value: Math.round(v.value / 1000) })).sort((a, b) => b.value - a.value);

  const healthPie = (['green', 'amber', 'red'] as const)
    .map(k => ({ name: k === 'green' ? 'On Track' : k === 'amber' ? 'At Risk' : 'Critical', value: intel.health[k], color: HEALTH_COLORS[k] }))
    .filter(d => d.value > 0);
  const radarData = Object.entries(intel.dimensionHealth).map(([dim, c]) => {
    const total = c.green + c.amber + c.red;
    return { dim: dim.charAt(0).toUpperCase() + dim.slice(1), score: total ? Math.round((c.green / total) * 100) : 100 };
  });

  const monitored = projects.filter(p => p.hasQA);
  const ewBuckets = [
    { name: 'Healthy (0–29)', value: monitored.filter(p => (p.ew || 0) < 30).length, color: '#16a34a' },
    { name: 'Watch (30–49)', value: monitored.filter(p => (p.ew || 0) >= 30 && (p.ew || 0) < 50).length, color: '#ca8a04' },
    { name: 'Caution (50–74)', value: monitored.filter(p => (p.ew || 0) >= 50 && (p.ew || 0) < 75).length, color: '#d97706' },
    { name: 'Critical (75+)', value: monitored.filter(p => (p.ew || 0) >= 75).length, color: '#dc2626' },
  ];

  return (
    <div>
      <Header eyebrow="Portfolio · Pipeline-to-Delivery" title="Portfolio Dashboard" subtitle="Integrated pre-sales pipeline and AI-monitored delivery health" />

      <div className="flex gap-1 mb-6 border-b border-line">
        {(['delivery', 'pipeline'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2.5 text-xs font-mono font-semibold uppercase tracking-wider border-b-2 transition-colors ${tab === t ? 'border-flux text-flux' : 'border-transparent text-ink-faint hover:text-ink'}`}>
            {t === 'pipeline' ? 'Sales Pipeline' : 'Delivery Health'}
          </button>
        ))}
      </div>

      {tab === 'delivery' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Active Engagements" value={intel.activeProjects} sub={`${intel.monitoredCount} AI-monitored`} icon={Activity} color="blue" />
            <StatCard label="Portfolio Budget" value={fmt(intel.totalBudget)} sub={`${intel.burnRate}% burned · ${intel.avgCompletion}% complete`} icon={DollarSign} color="purple" />
            <StatCard label="Value at Risk" value={fmt(intel.valueAtRisk)} sub={`${intel.alertCounts.critical} critical · ${intel.alertCounts.caution} caution`} icon={AlertTriangle} color="amber" />
            <StatCard label="Avg Early Warning" value={`${intel.avgEW}`} sub={`Target <40 · ${intel.health.green}/${intel.activeProjects} green`} icon={Gauge} color="green" />
          </div>

          {/* Rescue & Oversight callouts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <GlassPanel tint="red" deep className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="section-title flex items-center gap-2"><Siren className="w-4 h-4 text-red-500" /> In Rescue ({intel.rescue.length})</h3>
                <span className="text-xs text-ink-faint">Executive oversight · war-room command</span>
              </div>
              <div className="space-y-2">
                {intel.rescue.length ? intel.rescue.map(p => (
                  <div key={p.id} className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-red-50">
                    <Link to={`/delivery/${p.id}`} className="min-w-0">
                      <div className="text-sm font-medium text-ink truncate">{p.name}</div>
                      <div className="text-xs text-ink-soft">{p.client_name} · EW {p.ew} · {fmt(p.valueAtRisk)} at risk</div>
                    </Link>
                    <Link to={rescueHref(p)} className="flex-shrink-0 inline-flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white text-[11px] font-semibold px-2.5 py-1.5 rounded"><Siren className="w-3 h-3" /> Command</Link>
                  </div>
                )) : <div className="text-sm text-ink-faint py-2">No engagements in rescue.</div>}
              </div>
            </GlassPanel>
            <GlassPanel tint="cyan" deep className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="section-title flex items-center gap-2"><Rocket className="w-4 h-4 text-sky-500" /> Under Oversight ({intel.oversight.length})</h3>
                <span className="text-xs text-ink-faint">Flagship performance maximization</span>
              </div>
              <div className="space-y-2">
                {intel.oversight.length ? intel.oversight.map(p => (
                  <div key={p.id} className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-sky-50">
                    <Link to={`/delivery/${p.id}`} className="min-w-0">
                      <div className="text-sm font-medium text-ink truncate">{p.name}</div>
                      <div className="text-xs text-ink-soft">{p.client_name} · {fmt(p.budget)} flagship · EW {p.ew}</div>
                    </Link>
                    <Link to={oversightHref(p)} className="flex-shrink-0 inline-flex items-center gap-1 bg-gradient-to-r from-sky-600 to-teal-500 text-white text-[11px] font-semibold px-2.5 py-1.5 rounded"><Rocket className="w-3 h-3" /> Studio</Link>
                  </div>
                )) : <div className="text-sm text-ink-faint py-2">No flagship oversight engagements.</div>}
              </div>
            </GlassPanel>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="card p-6">
              <h3 className="section-title mb-4">Health Distribution</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={healthPie} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={4} isAnimationActive={false}>
                    {healthPie.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Legend iconType="circle" iconSize={8} />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="card p-6">
              <h3 className="section-title mb-4">Early Warning Distribution</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={ewBuckets} layout="vertical" margin={{ left: 30 }}>
                  <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={92} />
                  <Tooltip formatter={(v: number) => [v, 'Engagements']} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {ewBuckets.map((b, i) => <Cell key={i} fill={b.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="card p-6">
              <h3 className="section-title mb-4">Health by Dimension</h3>
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="dim" tick={{ fontSize: 11 }} />
                  <Radar name="Green %" dataKey="score" stroke="#2540d9" fill="#2540d9" fillOpacity={0.28} />
                  <Tooltip formatter={(v: number) => [`${v}%`, 'Green %']} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 30-day forecast bar */}
          <div className="card p-6">
            <h3 className="section-title mb-3">30-Day RAG Forecast (AI-predicted)</h3>
            <div className="flex h-8 rounded-lg overflow-hidden mb-2">
              {(['green', 'amber', 'red'] as const).map(h => {
                const v = intel.predictions30[h];
                const pct = intel.monitoredCount ? (v / intel.monitoredCount) * 100 : 0;
                return v ? <div key={h} className="flex items-center justify-center text-white text-sm font-bold" style={{ width: `${pct}%`, background: HEALTH_COLORS[h] }}>{v}</div> : null;
              })}
            </div>
            <div className="flex gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full" style={{ background: HEALTH_COLORS.green }} /> On Track</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full" style={{ background: HEALTH_COLORS.amber }} /> At Risk</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full" style={{ background: HEALTH_COLORS.red }} /> Critical</span>
            </div>
          </div>

          {/* Engagements requiring attention */}
          {intel.needAttention.length > 0 && (
            <div className="card p-6">
              <h3 className="section-title mb-4 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500" /> Engagements Requiring Attention ({intel.needAttention.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {intel.needAttention.map(p => (
                  <div key={p.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="relative w-10 h-10 flex-shrink-0">
                      <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="15.5" fill="none" stroke="#e5e7eb" strokeWidth="3.5" />
                        <circle cx="18" cy="18" r="15.5" fill="none" stroke={ewHex(p.ew || 0)} strokeWidth="3.5" strokeDasharray={`${p.ew} 100`} strokeLinecap="round" />
                      </svg>
                      <span className={`absolute inset-0 flex items-center justify-center text-[11px] font-bold ${ewColor(p.ew || 0)}`}>{p.ew}</span>
                    </div>
                    <Link to={`/delivery/${p.id}`} className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{p.name}</div>
                      <div className="text-xs text-gray-500 truncate">{p.client_name} · pred 30d {(p.prediction_30d || '—').toUpperCase()}</div>
                    </Link>
                    <HealthBadge status={p.overall_health as HealthStatus} size="sm" />
                    {p.isRescue && <Link to={rescueHref(p)} className="flex-shrink-0 inline-flex items-center gap-1 bg-red-600 text-white text-[10px] font-semibold px-2 py-1 rounded"><Siren className="w-3 h-3" /></Link>}
                    {p.isOversight && <Link to={oversightHref(p)} className="flex-shrink-0 inline-flex items-center gap-1 bg-gradient-to-r from-sky-600 to-teal-500 text-white text-[10px] font-semibold px-2 py-1 rounded"><Rocket className="w-3 h-3" /></Link>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'pipeline' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Pipeline" value={fmt(pipeline?.total_pipeline_value || 0)} sub={`${pipeline?.active_opportunities} active opps`} icon={TrendingUp} color="blue" />
            <StatCard label="Weighted Pipeline" value={fmt(pipeline?.weighted_pipeline_value || 0)} sub="Probability-adjusted" icon={DollarSign} color="green" />
            <StatCard label="Win Rate" value={`${pipeline?.win_rate || 0}%`} sub={`${pipeline?.closed_won_count} deals won`} icon={BarChart3} color="purple" />
            <StatCard label="Closed Won Value" value={fmt(pipeline?.closed_won_value || 0)} sub="This period" icon={DollarSign} color="green" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card p-6">
              <h3 className="section-title mb-4">Pipeline by Stage ($K)</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={funnelData}>
                  <XAxis dataKey="stage" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v: number, name: string) => [`$${v}K`, name === 'value' ? 'Total' : 'Weighted']} />
                  <Bar dataKey="value" name="value" fill="#DCE1FA" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="weighted" name="weighted" fill="#2540d9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex gap-4 mt-2 text-xs text-ink-faint justify-center">
                <span className="flex items-center gap-1"><span className="w-3 h-2 rounded inline-block" style={{ background: '#DCE1FA' }} />Total</span>
                <span className="flex items-center gap-1"><span className="w-3 h-2 rounded inline-block bg-flux" />Weighted</span>
              </div>
            </div>
            <div className="card p-6">
              <h3 className="section-title mb-4">Pipeline by Region</h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={regionData} cx="50%" cy="50%" outerRadius={80} dataKey="value" nameKey="name" isAnimationActive={false} label={({ name, value }) => `${name} (${value})`}>
                    {regionData.map((_, i) => <Cell key={i} fill={['#2540d9', '#5b45c9', '#10b7c4'][i % 3]} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => [v, 'Opportunities']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="section-title mb-4">Pipeline by Owner ($K)</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={ownerData} layout="vertical" margin={{ left: 60 }}>
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={80} />
                <Tooltip formatter={(v: number) => [`$${v}K`, 'Pipeline']} />
                <Bar dataKey="value" fill="#2540d9" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
