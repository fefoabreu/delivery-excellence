import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, TrendingUp, Activity, DollarSign, AlertTriangle } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend, RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from 'recharts';
import { portfolioApi } from '../api/client';
import Header from '../components/layout/Header';
import StatCard from '../components/shared/StatCard';
import HealthBadge from '../components/shared/HealthBadge';
import type { PipelineMetrics, DeliveryMetrics, HealthStatus } from '../types';

const STAGE_LABELS: Record<string, string> = {
  prospect: 'Prospect', qualify: 'Qualify', develop: 'Develop', propose: 'Propose', negotiate: 'Negotiate',
};
const HEALTH_COLORS = { green: '#107C10', amber: '#D67B00', red: '#A4262C' };
const fmt = (v: number) => v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(1)}M` : v >= 1_000 ? `$${(v / 1_000).toFixed(0)}K` : `$${v}`;

export default function Portfolio() {
  const [pipeline, setPipeline] = useState<PipelineMetrics | null>(null);
  const [delivery, setDelivery] = useState<DeliveryMetrics | null>(null);
  const [tab, setTab] = useState<'pipeline' | 'delivery'>('pipeline');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([portfolioApi.pipelineMetrics(), portfolioApi.deliveryMetrics()])
      .then(([p, d]) => { setPipeline(p.data); setDelivery(d.data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-gray-400">Loading portfolio...</div>;

  const funnelData = Object.entries(pipeline?.by_stage || {}).map(([k, v]) => ({
    stage: STAGE_LABELS[k] || k,
    value: Math.round(v.value / 1000),
    count: v.count,
    weighted: Math.round(v.weighted / 1000),
  }));

  const regionData = Object.entries(pipeline?.by_region || {}).map(([k, v]) => ({ name: k, value: v.count, amount: v.value }));
  const ownerData = Object.entries(pipeline?.by_owner || {}).map(([k, v]) => ({ name: k.split(' ')[0], value: Math.round(v.value / 1000) })).sort((a, b) => b.value - a.value);

  const healthPie = Object.entries(delivery?.health_summary || {}).map(([k, v]) => ({
    name: k === 'green' ? 'On Track' : k === 'amber' ? 'At Risk' : 'Critical',
    value: v, color: HEALTH_COLORS[k as HealthStatus] || '#888',
  })).filter(d => d.value > 0);

  const radarData = Object.entries(delivery?.dimension_health || {}).map(([dim, counts]) => {
    const total = (counts.green || 0) + (counts.amber || 0) + (counts.red || 0);
    return { dim: dim.charAt(0).toUpperCase() + dim.slice(1), score: total ? Math.round((counts.green || 0) / total * 100) : 100 };
  });

  return (
    <div>
      <Header title="Portfolio Dashboard" subtitle="Integrated pre-sales and delivery metrics" />

      <div className="flex gap-1 mb-6 border-b border-gray-200">
        {(['pipeline', 'delivery'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-6 py-2.5 text-sm font-medium border-b-2 capitalize transition-colors ${tab === t ? 'border-ms-blue text-ms-blue' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {t === 'pipeline' ? '📊 Sales Pipeline' : '🚀 Delivery Health'}
          </button>
        ))}
      </div>

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
                  <Bar dataKey="value" name="value" fill="#C7E0F4" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="weighted" name="weighted" fill="#0078D4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex gap-4 mt-2 text-xs text-gray-500 justify-center">
                <span className="flex items-center gap-1"><span className="w-3 h-2 bg-blue-200 rounded inline-block" />Total</span>
                <span className="flex items-center gap-1"><span className="w-3 h-2 bg-ms-blue rounded inline-block" />Weighted</span>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="section-title mb-4">Pipeline by Region</h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={regionData} cx="50%" cy="50%" outerRadius={80} dataKey="value" nameKey="name" label={({ name, value }) => `${name} (${value})`}>
                    {regionData.map((_, i) => <Cell key={i} fill={['#0078D4', '#5C2D91', '#107C10'][i % 3]} />)}
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
                <Bar dataKey="value" fill="#0078D4" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {tab === 'delivery' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Active Projects" value={delivery?.active_projects || 0} sub={`${delivery?.completed_projects} completed`} icon={Activity} color="blue" />
            <StatCard label="Portfolio Budget" value={fmt(delivery?.total_budget || 0)} sub={`${delivery?.overall_burn_rate}% burn rate`} icon={DollarSign} color="purple" />
            <StatCard label="At Risk" value={(delivery?.health_summary?.['amber'] || 0) + (delivery?.health_summary?.['red'] || 0)} sub={`${delivery?.open_raid_items} open RAID items`} icon={AlertTriangle} color="amber" />
            <StatCard label="Avg Completion" value={`${delivery?.avg_completion || 0}%`} sub={`${delivery?.overdue_milestones} overdue milestones`} icon={BarChart3} color="green" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card p-6">
              <h3 className="section-title mb-4">Portfolio Health Distribution</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={healthPie} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={4}>
                    {healthPie.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Legend iconType="circle" iconSize={8} />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="card p-6">
              <h3 className="section-title mb-4">Health by Dimension</h3>
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="dim" tick={{ fontSize: 11 }} />
                  <Radar name="Health Score" dataKey="score" stroke="#0078D4" fill="#0078D4" fillOpacity={0.3} />
                  <Tooltip formatter={(v: number) => [`${v}%`, 'Green %']} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {(delivery?.projects_at_risk?.length || 0) > 0 && (
            <div className="card p-6">
              <h3 className="section-title mb-4 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500" /> Projects Requiring Attention</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {delivery?.projects_at_risk.map(p => (
                  <Link key={p.id} to={`/delivery/${p.id}`} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div>
                      <div className="font-medium text-sm">{p.name}</div>
                      <div className="text-xs text-gray-500">{p.client_name}</div>
                    </div>
                    <HealthBadge status={p.overall_health as HealthStatus} size="sm" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
