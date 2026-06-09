import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Bot, CheckCircle, AlertTriangle, Clock, Siren, Rocket, Gauge, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { deliveryApi } from '../api/client';
import { loadPortfolio, rescueHref, oversightHref, fmtMoney, type UnifiedProject } from '../api/portfolioData';
import Header from '../components/layout/Header';
import HealthBadge from '../components/shared/HealthBadge';
import GlassPanel from '../components/shared/GlassPanel';
import type { Milestone, RAIDItem, StatusUpdate, HealthStatus } from '../types';

const DIMS: Array<[string, string]> = [
  ['schedule', 'Schedule'], ['budget', 'Budget'], ['scope', 'Scope'], ['risk', 'Risk'], ['satisfaction', 'Client Satisfaction'],
];
const ewColor = (v: number) => v >= 75 ? 'text-red-600' : v >= 50 ? 'text-amber-600' : v >= 30 ? 'text-yellow-600' : 'text-green-600';
const ewHex = (v: number) => v >= 75 ? '#dc2626' : v >= 50 ? '#d97706' : v >= 30 ? '#ca8a04' : '#16a34a';
const ewBg = (v: number) => v >= 75 ? 'bg-red-500' : v >= 50 ? 'bg-amber-500' : v >= 30 ? 'bg-yellow-400' : 'bg-green-500';
const predCls = (h?: string) => h === 'green' ? 'text-green-700' : h === 'amber' ? 'text-amber-700' : 'text-red-700';
const ALERT_CFG: Record<string, { label: string; cls: string }> = {
  critical: { label: 'Critical Alert', cls: 'bg-red-100 text-red-700' },
  caution: { label: 'Caution Alert', cls: 'bg-amber-100 text-amber-700' },
  watch: { label: 'Watch', cls: 'bg-yellow-100 text-yellow-700' },
};
const TrendIcon = ({ t }: { t?: string }) => t === 'worsening' ? <TrendingUp className="w-3.5 h-3.5 text-red-500" /> : t === 'improving' ? <TrendingDown className="w-3.5 h-3.5 text-green-500" /> : <Minus className="w-3.5 h-3.5 text-gray-400" />;

export default function DeliveryDetail() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<UnifiedProject | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [raid, setRaid] = useState<RAIDItem[]>([]);
  const [updates, setUpdates] = useState<StatusUpdate[]>([]);
  const [tab, setTab] = useState<'overview' | 'milestones' | 'raid' | 'updates'>('overview');

  useEffect(() => {
    if (!id) return;
    loadPortfolio().then(b => {
      const p = b.projects.find(x => x.id === id);
      if (!p) { setNotFound(true); return; }
      setProject(p);
    });
    // optional detailed artifacts (only some engagements have these sub-files)
    deliveryApi.getMilestones(id).then(r => setMilestones(r.data)).catch(() => setMilestones([]));
    deliveryApi.getRaid(id).then(r => setRaid(r.data)).catch(() => setRaid([]));
    deliveryApi.getStatusUpdates(id).then(r => setUpdates(r.data)).catch(() => setUpdates([]));
  }, [id]);

  const milestoneStatus = { completed: '✓', in_progress: '●', not_started: '○', overdue: '!', at_risk: '▲' };
  const msCls = { completed: 'text-green-600', in_progress: 'text-ms-blue', not_started: 'text-gray-400', overdue: 'text-red-600', at_risk: 'text-amber-600' };
  const raidCls: Record<string, string> = { risk: 'bg-red-50 text-red-700', assumption: 'bg-blue-50 text-blue-700', issue: 'bg-amber-50 text-amber-700', dependency: 'bg-purple-50 text-purple-700' };

  if (notFound) return <div className="p-8 text-gray-400">Engagement not found. <Link to="/delivery" className="text-ms-blue">Back to Delivery</Link></div>;
  if (!project) return <div className="p-8 text-gray-400">Loading...</div>;
  const p = project;

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Link to="/delivery" className="btn-ghost flex items-center gap-1 text-gray-500"><ArrowLeft className="w-4 h-4" /> Delivery</Link>
      </div>

      <Header
        title={p.name}
        subtitle={`${p.client_name} · PM: ${p.project_manager || '—'} · ${p.phase || ''}`}
        actions={
          <div className="flex gap-2">
            <Link to={`/agent?context=delivery&id=${id}`} className="btn-secondary flex items-center gap-2"><Bot className="w-4 h-4" /> AI Analysis</Link>
            {p.isRescue && <Link to={rescueHref(p)} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"><Siren className="w-4 h-4" /> Rescue Command</Link>}
            {p.isOversight && <Link to={oversightHref(p)} className="flex items-center gap-2 bg-gradient-to-r from-sky-600 to-teal-500 hover:from-sky-700 hover:to-teal-600 text-white px-4 py-2 rounded-md text-sm font-medium"><Rocket className="w-4 h-4" /> Oversight Studio</Link>}
          </div>
        }
      />

      {/* Health Banner */}
      <div className={`mb-6 rounded-xl p-5 border-2 ${p.overall_health === 'green' ? 'bg-green-50 border-green-200' : p.overall_health === 'amber' ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200'}`}>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <HealthBadge status={p.overall_health as HealthStatus} label={`Overall: ${p.overall_health.toUpperCase()}`} />
              <span className="text-sm text-gray-600">{p.phase?.toUpperCase()} Phase · {p.completion_pct}% complete</span>
              {p.alert_level && <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${ALERT_CFG[p.alert_level].cls}`}>{ALERT_CFG[p.alert_level].label}</span>}
            </div>
            {p.ai_narrative && <p className="text-sm text-gray-700 max-w-2xl leading-relaxed">{p.ai_narrative}</p>}
            {p.qa_director_override && <p className="text-xs text-purple-700 italic mt-2">QA Director: {p.qa_director_override}</p>}
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-sm text-gray-500">Budget vs. Actuals</div>
            <div className="text-lg font-bold">{fmtMoney(p.actuals)} <span className="text-sm text-gray-400">of {fmtMoney(p.budget)}</span></div>
            <div className="text-xs text-gray-500">{p.burn_rate}% burn rate</div>
          </div>
        </div>
      </div>

      {/* Health Dimensions Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {DIMS.map(([key, label]) => {
          const val = (p.dims[key] || 'green') as HealthStatus;
          return (
            <div key={key} className={`card p-3 text-center border-t-4 ${val === 'green' ? 'border-t-green-500' : val === 'amber' ? 'border-t-amber-500' : 'border-t-red-500'}`}>
              <div className="text-xs text-gray-500 mb-1">{label}</div>
              <HealthBadge status={val} size="sm" />
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 border-b border-gray-200">
        {(['overview', 'milestones', 'raid', 'updates'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors capitalize ${tab === t ? 'border-ms-blue text-ms-blue' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {t === 'raid' ? 'RAID Log' : t === 'updates' ? 'Status Updates' : t}
            {t === 'milestones' && milestones.length > 0 && <span className="ml-1 badge-gray">{milestones.length}</span>}
            {t === 'raid' && raid.filter(r => r.status === 'open').length > 0 && <span className="ml-1 badge-amber">{raid.filter(r => r.status === 'open').length}</span>}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="space-y-4">
          {p.hasQA && (
            <GlassPanel tint="blue" deep className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="section-title flex items-center gap-2"><Gauge className="w-4 h-4 text-flux" /> AI Quality Assurance Intelligence</h3>
                <Link to="/quality-assurance" className="text-xs text-flux hover:underline">Portfolio Monitor →</Link>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* EW score + predictions */}
                <div>
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(20,22,28,0.12)" strokeWidth="3" />
                        <circle cx="18" cy="18" r="15.5" fill="none" stroke={ewHex(p.ew || 0)} strokeWidth="3" strokeDasharray={`${p.ew} 100`} strokeLinecap="round" />
                      </svg>
                      <span className={`absolute inset-0 flex items-center justify-center text-lg font-bold tabular-nums ${ewColor(p.ew || 0)}`}>{p.ew}</span>
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-ink-soft uppercase tracking-wide">Early Warning</div>
                      <div className="flex items-center gap-1 text-sm font-medium text-ink-soft"><TrendIcon t={p.trend} /> {p.trend || 'stable'} {p.trend_delta != null && <span className="text-ink-faint">({p.trend_delta > 0 ? '+' : ''}{p.trend_delta})</span>}</div>
                      <div className="text-xs text-ink-faint capitalize">Assessment: {p.ai_assessment}</div>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                    {(['prediction_30d', 'prediction_60d', 'prediction_90d'] as const).map((k, i) => (
                      <div key={k} className="rounded-lg bg-white/45 py-1.5">
                        <div className="text-[10px] text-ink-faint">{[30, 60, 90][i]}d</div>
                        <div className={`text-xs font-bold ${predCls(p[k])}`}>{(p[k] || '—').toUpperCase()}</div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* component breakdown */}
                <div className="lg:col-span-2">
                  <div className="text-[11px] font-bold text-ink-soft uppercase tracking-wide mb-2">Early-Warning Signal Components</div>
                  <div className="grid grid-cols-2 gap-x-5 gap-y-1.5">
                    {Object.entries(p.components || {}).map(([k, v]) => (
                      <div key={k} className="flex items-center gap-2">
                        <span className="text-xs text-ink-soft capitalize w-32 flex-shrink-0">{k.replace(/_/g, ' ')}</span>
                        <div className="flex-1 h-1.5 bg-black/10 rounded-full overflow-hidden"><div className={`h-full rounded-full ${ewBg(v)}`} style={{ width: `${v}%` }} /></div>
                        <span className={`text-xs font-bold w-7 text-right tabular-nums ${ewColor(v)}`}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </GlassPanel>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="card p-5">
              <h3 className="section-title mb-3">Project Info</h3>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-gray-500">Project Manager</span><span className="font-medium">{p.project_manager || '—'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Technical Lead</span><span className="font-medium">{p.technical_lead || '—'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Start Date</span><span>{p.start_date || '—'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">End Date</span><span>{p.end_date || '—'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Status</span><span className="capitalize">{p.status.replace('_', ' ')}</span></div>
              </div>
            </div>
            <div className="card p-5">
              <h3 className="section-title mb-3">Financial</h3>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-gray-500">Budget</span><span className="font-medium">{fmtMoney(p.budget)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Actuals</span><span className="font-medium">{fmtMoney(p.actuals)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Remaining</span><span className="font-medium">{fmtMoney(p.budget - p.actuals)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Burn Rate</span><span className={`font-semibold ${p.burn_rate > 90 ? 'text-red-600' : p.burn_rate > 70 ? 'text-amber-600' : 'text-green-700'}`}>{p.burn_rate}%</span></div>
                {p.hasQA && <div className="flex justify-between"><span className="text-gray-500">Value at Risk</span><span className="font-semibold text-amber-700">{fmtMoney(p.valueAtRisk)}</span></div>}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'milestones' && (
        <div className="card divide-y divide-gray-100">
          {milestones.length === 0 && <div className="p-6 text-center text-gray-400">No milestone detail available for this engagement.</div>}
          {milestones.map(m => (
            <div key={m.id} className="flex items-start gap-4 p-4">
              <span className={`text-lg flex-shrink-0 mt-0.5 ${msCls[m.status as keyof typeof msCls] || 'text-gray-400'}`}>{milestoneStatus[m.status as keyof typeof milestoneStatus] || '○'}</span>
              <div className="flex-1">
                <div className="font-medium text-gray-900">{m.name}</div>
                {m.description && <div className="text-sm text-gray-500">{m.description}</div>}
                <div className="text-xs text-gray-400 mt-1">Due: {m.due_date || '—'} · Owner: {m.owner || '—'}</div>
              </div>
              <HealthBadge status={(m.status === 'completed' ? 'green' : m.status === 'overdue' ? 'red' : m.status === 'at_risk' ? 'amber' : 'green') as HealthStatus} label={m.status.replace('_', ' ')} size="sm" />
            </div>
          ))}
        </div>
      )}

      {tab === 'raid' && (
        <div className="space-y-3">
          {['risk', 'assumption', 'issue', 'dependency'].map(type => {
            const items = raid.filter(r => r.item_type === type);
            if (!items.length) return null;
            return (
              <div key={type} className="card">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-semibold capitalize flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs ${raidCls[type]}`}>{type.toUpperCase()}S</span>
                    <span className="text-gray-500 text-sm">{items.length} items · {items.filter(r => r.status === 'open').length} open</span>
                  </h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {items.map(r => (
                    <div key={r.id} className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="font-medium text-sm text-gray-900">{r.title}</div>
                          <div className="text-xs text-gray-500 mt-1">{r.description}</div>
                          {r.mitigation && <div className="text-xs text-green-700 mt-1 italic">Mitigation: {r.mitigation}</div>}
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <span className={`badge-${r.impact === 'high' ? 'red' : r.impact === 'medium' ? 'amber' : 'gray'} text-xs`}>{r.impact}</span>
                          <span className={`badge-${r.status === 'open' ? 'red' : r.status === 'in_progress' ? 'amber' : 'green'} text-xs`}>{r.status}</span>
                        </div>
                      </div>
                      {r.owner && <div className="text-xs text-gray-400 mt-1">Owner: {r.owner} {r.due_date ? `· Due: ${r.due_date}` : ''}</div>}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          {raid.length === 0 && <div className="card p-6 text-center text-gray-400">No RAID detail available for this engagement.</div>}
        </div>
      )}

      {tab === 'updates' && (
        <div className="space-y-4">
          {updates.map(u => (
            <div key={u.id} className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">{u.period}</h3>
                <HealthBadge status={u.overall_health as HealthStatus} size="sm" />
              </div>
              <p className="text-sm text-gray-700 mb-3">{u.summary}</p>
              {u.accomplishments.length > 0 && (
                <div className="mb-2">
                  <div className="text-xs font-semibold text-gray-500 mb-1">ACCOMPLISHMENTS</div>
                  <ul className="space-y-1">{u.accomplishments.map((a, i) => <li key={i} className="text-sm flex gap-2"><CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />{a}</li>)}</ul>
                </div>
              )}
              {u.next_steps.length > 0 && (
                <div className="mb-2">
                  <div className="text-xs font-semibold text-gray-500 mb-1">NEXT STEPS</div>
                  <ul className="space-y-1">{u.next_steps.map((n, i) => <li key={i} className="text-sm flex gap-2"><Clock className="w-3 h-3 text-ms-blue mt-0.5 flex-shrink-0" />{n}</li>)}</ul>
                </div>
              )}
              {u.escalations.length > 0 && (
                <div className="mt-2 p-3 bg-red-50 rounded-lg">
                  <div className="text-xs font-semibold text-red-700 mb-1">ESCALATIONS</div>
                  <ul className="space-y-1">{u.escalations.map((e, i) => <li key={i} className="text-sm text-red-700 flex gap-2"><AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />{e}</li>)}</ul>
                </div>
              )}
            </div>
          ))}
          {updates.length === 0 && <div className="card p-6 text-center text-gray-400">No status updates available for this engagement.</div>}
        </div>
      )}
    </div>
  );
}
