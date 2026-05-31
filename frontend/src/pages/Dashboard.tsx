import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp, DollarSign, Activity, AlertTriangle, ShieldAlert,
  CheckCircle, ArrowRight, Gauge, Siren, Rocket, Bot, TrendingDown,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { portfolioApi } from '../api/client';
import { loadPortfolio, rescueHref, oversightHref, fmtMoney, type PortfolioIntel, type UnifiedProject } from '../api/portfolioData';
import StatCard from '../components/shared/StatCard';
import type { PipelineMetrics } from '../types';

const STAGE_LABELS: Record<string, string> = {
  prospect: 'Prospect', qualify: 'Qualify', develop: 'Develop', propose: 'Propose', negotiate: 'Negotiate',
};
const HEALTH_COLORS = { green: '#107C10', amber: '#D67B00', red: '#A4262C' };
const ewColor = (v: number) => v >= 75 ? 'text-red-600' : v >= 50 ? 'text-amber-600' : v >= 30 ? 'text-yellow-600' : 'text-green-600';
const ewHex = (v: number) => v >= 75 ? '#dc2626' : v >= 50 ? '#d97706' : v >= 30 ? '#ca8a04' : '#16a34a';

export default function Dashboard() {
  const [pipeline, setPipeline] = useState<PipelineMetrics | null>(null);
  const [intel, setIntel] = useState<PortfolioIntel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([portfolioApi.pipelineMetrics(), loadPortfolio()])
      .then(([p, bundle]) => { setPipeline(p.data); setIntel(bundle.intel); })
      .finally(() => setLoading(false));
  }, []);

  if (loading || !intel) return <div className="p-8 text-gray-400">Loading executive dashboard...</div>;

  const funnel = Object.entries(pipeline?.by_stage || {}).map(([k, v]) => ({
    stage: STAGE_LABELS[k] || k, value: Math.round(v.value / 1000), count: v.count,
  }));
  const healthPie = (['green', 'amber', 'red'] as const)
    .map(k => ({ name: k === 'green' ? 'On Track' : k === 'amber' ? 'At Risk' : 'Critical', value: intel.health[k], color: HEALTH_COLORS[k] }))
    .filter(d => d.value > 0);
  const greenPct = intel.activeProjects ? Math.round((intel.health.green / intel.activeProjects) * 100) : 0;

  return (
    <div>
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Executive Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Contoso Professional Services — pipeline-to-delivery portfolio, synced with AI Quality Assurance</p>
        </div>
        <Link to="/quality-assurance" className="text-xs text-ms-blue hover:underline flex items-center gap-1">
          <Bot className="w-3.5 h-3.5" /> AI Quality Assurance <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Weighted Pipeline" value={fmtMoney(pipeline?.weighted_pipeline_value || 0)} sub={`${pipeline?.active_opportunities || 0} active opps · ${fmtMoney(pipeline?.total_pipeline_value || 0)} total`} icon={TrendingUp} color="blue" />
        <StatCard label="Active Engagements" value={intel.activeProjects} sub={`${fmtMoney(intel.totalBudget)} portfolio · ${intel.burnRate}% burned`} icon={Activity} color="purple" />
        <StatCard label="Portfolio Health" value={`${greenPct}%`} sub={`On track · Avg EW ${intel.avgEW} (target <40)`} icon={Gauge} color="green" />
        <StatCard label="Value at Risk" value={fmtMoney(intel.valueAtRisk)} sub={`${intel.alertCounts.critical} critical · ${intel.alertCounts.caution} caution alerts`} icon={AlertTriangle} color="amber" />
      </div>

      {/* QA intelligence strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Link to="/quality-assurance" className="card p-4 hover:shadow-md transition-shadow border-l-4 border-l-ms-blue">
          <div className="flex items-center justify-between"><span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Avg Early Warning</span><Gauge className="w-4 h-4 text-ms-blue" /></div>
          <div className={`text-2xl font-bold mt-1 ${ewColor(intel.avgEW)}`}>{intel.avgEW}<span className="text-sm text-gray-400 font-normal"> /100</span></div>
          <div className="text-xs text-gray-400">{intel.monitoredCount} engagements monitored</div>
        </Link>
        <Link to={intel.rescue[0] ? rescueHref(intel.rescue[0]) : '/quality-assurance'} className="card p-4 hover:shadow-md transition-shadow border-l-4 border-l-red-500">
          <div className="flex items-center justify-between"><span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">In Rescue</span><Siren className="w-4 h-4 text-red-500" /></div>
          <div className="text-2xl font-bold mt-1 text-red-600">{intel.rescue.length}</div>
          <div className="text-xs text-gray-400 truncate">{intel.rescue.map(r => r.name.split(' ')[0]).join(', ') || 'None'}</div>
        </Link>
        <Link to={intel.oversight[0] ? oversightHref(intel.oversight[0]) : '/quality-assurance'} className="card p-4 hover:shadow-md transition-shadow border-l-4 border-l-sky-500">
          <div className="flex items-center justify-between"><span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Under Oversight</span><Rocket className="w-4 h-4 text-sky-500" /></div>
          <div className="text-2xl font-bold mt-1 text-sky-600">{intel.oversight.length}</div>
          <div className="text-xs text-gray-400 truncate">{intel.oversight.map(r => r.name.split(' ')[0]).join(', ') || 'None'}</div>
        </Link>
        <Link to="/quality-assurance" className="card p-4 hover:shadow-md transition-shadow border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between"><span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Get-to-Green</span><TrendingDown className="w-4 h-4 text-emerald-500" /></div>
          <div className="text-2xl font-bold mt-1 text-emerald-600">{intel.getToGreen.recoveryRate}%</div>
          <div className="text-xs text-gray-400">{intel.getToGreen.total} recovery plans · {intel.getToGreen.on_track} on track</div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Pipeline Funnel */}
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Pipeline by Stage ($K)</h2>
            <Link to="/pipeline" className="text-xs text-ms-blue hover:underline flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={funnel} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <XAxis dataKey="stage" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: number) => [`$${v}K`, 'Value']} />
              <Bar dataKey="value" fill="#0078D4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Delivery Health */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Delivery Health</h2>
            <Link to="/delivery" className="text-xs text-ms-blue hover:underline flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={healthPie} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={3} isAnimationActive={false}>
                {healthPie.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Legend iconType="circle" iconSize={8} />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 grid grid-cols-3 gap-2 text-center">
            {(['green', 'amber', 'red'] as const).map(h => (
              <div key={h}>
                <div className="text-xl font-bold" style={{ color: HEALTH_COLORS[h] }}>{intel.health[h]}</div>
                <div className="text-xs text-gray-500">{h === 'green' ? 'On Track' : h === 'amber' ? 'At Risk' : 'Critical'}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Engagements Requiring Attention */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-amber-500" /> Engagements Requiring Attention</h2>
            <span className="text-xs text-gray-400">{intel.needAttention.length} flagged</span>
          </div>
          {intel.needAttention.length ? (
            <div className="space-y-2">
              {intel.needAttention.slice(0, 6).map(p => (
                <div key={p.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="relative w-10 h-10 flex-shrink-0">
                    <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15.5" fill="none" stroke="#e5e7eb" strokeWidth="3.5" />
                      <circle cx="18" cy="18" r="15.5" fill="none" stroke={ewHex(p.ew || 0)} strokeWidth="3.5" strokeDasharray={`${p.ew} 100`} strokeLinecap="round" />
                    </svg>
                    <span className={`absolute inset-0 flex items-center justify-center text-[11px] font-bold ${ewColor(p.ew || 0)}`}>{p.ew}</span>
                  </div>
                  <Link to={`/delivery/${p.id}`} className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{p.name}</div>
                    <div className="text-xs text-gray-500 truncate">{p.client_name} · {p.overall_health.toUpperCase()} · pred 30d {(p.prediction_30d || '—').toUpperCase()}</div>
                  </Link>
                  {p.isRescue && <Link to={rescueHref(p)} className="flex-shrink-0 inline-flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white text-[11px] font-semibold px-2 py-1 rounded"><Siren className="w-3 h-3" /> Rescue</Link>}
                  {p.isOversight && <Link to={oversightHref(p)} className="flex-shrink-0 inline-flex items-center gap-1 bg-gradient-to-r from-sky-600 to-teal-500 text-white text-[11px] font-semibold px-2 py-1 rounded"><Rocket className="w-3 h-3" /> Oversight</Link>}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-green-700 py-4"><CheckCircle className="w-4 h-4" /> All engagements are on track</div>
          )}
        </div>

        {/* Predictions + Dimensions */}
        <div className="card p-6">
          <h2 className="section-title mb-4">Portfolio Outlook & Health Dimensions</h2>
          <div className="mb-4">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">30-Day RAG Forecast (AI-predicted)</div>
            <div className="flex h-7 rounded-lg overflow-hidden">
              {(['green', 'amber', 'red'] as const).map(h => {
                const v = intel.predictions30[h];
                const pct = intel.monitoredCount ? (v / intel.monitoredCount) * 100 : 0;
                return v ? <div key={h} className="flex items-center justify-center text-white text-xs font-bold" style={{ width: `${pct}%`, background: HEALTH_COLORS[h] }}>{v}</div> : null;
              })}
            </div>
          </div>
          <div className="space-y-2.5">
            {['schedule', 'budget', 'scope', 'risk', 'satisfaction'].map(dim => {
              const h = intel.dimensionHealth[dim] || { green: 0, amber: 0, red: 0 };
              const total = h.green + h.amber + h.red;
              return (
                <div key={dim} className="flex items-center gap-3">
                  <div className="w-24 text-xs text-gray-600 capitalize font-medium">{dim}</div>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden flex">
                    <div style={{ width: `${total ? (h.green / total) * 100 : 0}%`, background: '#107C10' }} className="h-full" />
                    <div style={{ width: `${total ? (h.amber / total) * 100 : 0}%`, background: '#D67B00' }} className="h-full" />
                    <div style={{ width: `${total ? (h.red / total) * 100 : 0}%`, background: '#A4262C' }} className="h-full" />
                  </div>
                  <div className="flex gap-1 text-xs w-16 justify-end">
                    {h.green ? <span className="text-green-700 font-medium">{h.green}G</span> : null}
                    {h.amber ? <span className="text-amber-700 font-medium">{h.amber}A</span> : null}
                    {h.red ? <span className="text-red-700 font-medium">{h.red}R</span> : null}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-3 gap-3 text-sm">
            <div><div className="font-semibold text-gray-900">{intel.avgCompletion}%</div><div className="text-gray-500 text-xs">Avg completion</div></div>
            <div><div className="font-semibold text-gray-900">{intel.burnRate}%</div><div className="text-gray-500 text-xs">Portfolio burn</div></div>
            <div><div className="font-semibold text-gray-900">{fmtMoney(intel.totalBudget)}</div><div className="text-gray-500 text-xs">Active budget</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
