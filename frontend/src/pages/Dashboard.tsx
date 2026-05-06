import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp, DollarSign, Activity, AlertTriangle,
  CheckCircle, Clock, BarChart3, ArrowRight,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { portfolioApi } from '../api/client';
import StatCard from '../components/shared/StatCard';
import HealthBadge from '../components/shared/HealthBadge';
import type { PipelineMetrics, DeliveryMetrics, HealthStatus } from '../types';

const STAGE_LABELS: Record<string, string> = {
  prospect: 'Prospect', qualify: 'Qualify', develop: 'Develop',
  propose: 'Propose', negotiate: 'Negotiate',
};
const HEALTH_COLORS = { green: '#107C10', amber: '#D67B00', red: '#A4262C' };

export default function Dashboard() {
  const [pipeline, setPipeline] = useState<PipelineMetrics | null>(null);
  const [delivery, setDelivery] = useState<DeliveryMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([portfolioApi.pipelineMetrics(), portfolioApi.deliveryMetrics()])
      .then(([p, d]) => { setPipeline(p.data); setDelivery(d.data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-gray-400">Loading executive dashboard...</div>;

  const funnel = Object.entries(pipeline?.by_stage || {}).map(([k, v]) => ({
    stage: STAGE_LABELS[k] || k,
    value: Math.round(v.value / 1000),
    count: v.count,
  }));

  const healthPie = Object.entries(delivery?.health_summary || {}).map(([k, v]) => ({
    name: k.charAt(0).toUpperCase() + k.slice(1),
    value: v,
    color: HEALTH_COLORS[k as HealthStatus] || '#888',
  })).filter(d => d.value > 0);

  const fmt = (v: number) => v >= 1_000_000
    ? `$${(v / 1_000_000).toFixed(1)}M`
    : v >= 1_000 ? `$${(v / 1_000).toFixed(0)}K` : `$${v}`;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Executive Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Microsoft Professional Services — Delivery Excellence Portfolio</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Active Pipeline" value={fmt(pipeline?.total_pipeline_value || 0)} sub={`${pipeline?.active_opportunities || 0} opportunities`} icon={TrendingUp} color="blue" />
        <StatCard label="Weighted Pipeline" value={fmt(pipeline?.weighted_pipeline_value || 0)} sub={`Win rate: ${pipeline?.win_rate || 0}%`} icon={DollarSign} color="green" />
        <StatCard label="Active Projects" value={delivery?.active_projects || 0} sub={`${delivery?.completed_projects || 0} completed`} icon={Activity} color="purple" />
        <StatCard label="Projects at Risk" value={(delivery?.health_summary?.['amber'] || 0) + (delivery?.health_summary?.['red'] || 0)} sub={`${delivery?.open_raid_items || 0} open RAID items`} icon={AlertTriangle} color="amber" />
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
          {healthPie.length > 0 ? (
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={healthPie} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={3}>
                  {healthPie.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Legend iconType="circle" iconSize={8} />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-sm text-center py-12">No active projects</p>
          )}
          <div className="mt-2 grid grid-cols-3 gap-2 text-center">
            {['green', 'amber', 'red'].map(h => (
              <div key={h}>
                <div className="text-xl font-bold" style={{ color: HEALTH_COLORS[h as HealthStatus] }}>{delivery?.health_summary?.[h] || 0}</div>
                <div className="text-xs text-gray-500 capitalize">{h === 'green' ? 'On Track' : h === 'amber' ? 'At Risk' : 'Critical'}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Projects at Risk */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500" /> Projects Requiring Attention</h2>
          </div>
          {delivery?.projects_at_risk?.length ? (
            <div className="space-y-3">
              {delivery.projects_at_risk.map(p => (
                <Link key={p.id} to={`/delivery/${p.id}`} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{p.name}</div>
                    <div className="text-xs text-gray-500">{p.client_name}</div>
                  </div>
                  <HealthBadge status={p.overall_health as HealthStatus} size="sm" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-green-700 py-4">
              <CheckCircle className="w-4 h-4" /> All projects are on track
            </div>
          )}
        </div>

        {/* Delivery Dimensions */}
        <div className="card p-6">
          <h2 className="section-title mb-4">Portfolio Health Dimensions</h2>
          <div className="space-y-3">
            {['schedule', 'budget', 'scope', 'risk', 'satisfaction'].map(dim => {
              const h = delivery?.dimension_health?.[dim] || {};
              const total = (h.green || 0) + (h.amber || 0) + (h.red || 0);
              const greenPct = total ? Math.round((h.green || 0) / total * 100) : 0;
              return (
                <div key={dim} className="flex items-center gap-3">
                  <div className="w-24 text-xs text-gray-600 capitalize font-medium">{dim}</div>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden flex">
                    <div style={{ width: `${greenPct}%`, background: '#107C10' }} className="h-full" />
                    <div style={{ width: `${total ? Math.round((h.amber || 0) / total * 100) : 0}%`, background: '#D67B00' }} className="h-full" />
                    <div style={{ width: `${total ? Math.round((h.red || 0) / total * 100) : 0}%`, background: '#A4262C' }} className="h-full" />
                  </div>
                  <div className="flex gap-1 text-xs">
                    {h.green ? <span className="text-green-700 font-medium">{h.green}G</span> : null}
                    {h.amber ? <span className="text-amber-700 font-medium">{h.amber}A</span> : null}
                    {h.red ? <span className="text-red-700 font-medium">{h.red}R</span> : null}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-semibold text-gray-900">{delivery?.avg_completion || 0}%</div>
              <div className="text-gray-500 text-xs">Avg completion</div>
            </div>
            <div>
              <div className="font-semibold text-gray-900">{delivery?.overall_burn_rate || 0}%</div>
              <div className="text-gray-500 text-xs">Portfolio burn rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
