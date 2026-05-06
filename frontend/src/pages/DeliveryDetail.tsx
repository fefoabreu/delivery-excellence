import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Bot, Plus, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { deliveryApi } from '../api/client';
import Header from '../components/layout/Header';
import HealthBadge from '../components/shared/HealthBadge';
import type { DeliveryProject, Milestone, RAIDItem, StatusUpdate, HealthStatus } from '../types';

const DIMS: Array<[keyof DeliveryProject, string]> = [
  ['health_schedule', 'Schedule'], ['health_budget', 'Budget'], ['health_scope', 'Scope'],
  ['health_risk', 'Risk'], ['health_satisfaction', 'Client Satisfaction'],
];
const fmt = (v: number) => v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(2)}M` : `$${(v / 1_000).toFixed(0)}K`;

export default function DeliveryDetail() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<DeliveryProject | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [raid, setRaid] = useState<RAIDItem[]>([]);
  const [updates, setUpdates] = useState<StatusUpdate[]>([]);
  const [tab, setTab] = useState<'overview' | 'milestones' | 'raid' | 'updates'>('overview');
  const [editing, setEditing] = useState(false);
  const [healthForm, setHealthForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id || id === 'new') return;
    Promise.all([
      deliveryApi.getProject(id),
      deliveryApi.getMilestones(id),
      deliveryApi.getRaid(id),
      deliveryApi.getStatusUpdates(id),
    ]).then(([p, m, r, u]) => {
      setProject(p.data);
      setMilestones(m.data);
      setRaid(r.data);
      setUpdates(u.data);
      setHealthForm({
        overall_health: p.data.overall_health,
        health_schedule: p.data.health_schedule,
        health_budget: p.data.health_budget,
        health_scope: p.data.health_scope,
        health_risk: p.data.health_risk,
        health_satisfaction: p.data.health_satisfaction,
        completion_pct: String(p.data.completion_pct),
        actuals: String(p.data.actuals),
        phase: p.data.phase || '',
        executive_summary: p.data.executive_summary || '',
      });
    });
  }, [id]);

  const saveHealth = async () => {
    if (!project) return;
    setSaving(true);
    const r = await deliveryApi.updateProject(project.id, { ...healthForm, completion_pct: parseInt(healthForm.completion_pct), actuals: parseFloat(healthForm.actuals) });
    setProject(r.data);
    setEditing(false);
    setSaving(false);
  };

  const milestoneStatus = { completed: '✓', in_progress: '●', not_started: '○', overdue: '!', at_risk: '▲' };
  const msCls = { completed: 'text-green-600', in_progress: 'text-ms-blue', not_started: 'text-gray-400', overdue: 'text-red-600', at_risk: 'text-amber-600' };
  const raidCls: Record<string, string> = { risk: 'bg-red-50 text-red-700', assumption: 'bg-blue-50 text-blue-700', issue: 'bg-amber-50 text-amber-700', dependency: 'bg-purple-50 text-purple-700' };

  if (!project) return <div className="p-8 text-gray-400">Loading...</div>;

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Link to="/delivery" className="btn-ghost flex items-center gap-1 text-gray-500"><ArrowLeft className="w-4 h-4" /> Delivery</Link>
      </div>

      <Header
        title={project.name}
        subtitle={`${project.client_name} · PM: ${project.project_manager || '—'} · ${project.phase || ''}`}
        actions={
          <div className="flex gap-2">
            <Link to={`/agent?context=delivery&id=${id}`} className="btn-secondary flex items-center gap-2"><Bot className="w-4 h-4" /> AI Analysis</Link>
            {!editing && <button onClick={() => setEditing(true)} className="btn-secondary">Update Health</button>}
            {editing && (
              <>
                <button onClick={() => setEditing(false)} className="btn-secondary">Cancel</button>
                <button onClick={saveHealth} disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Save Health'}</button>
              </>
            )}
          </div>
        }
      />

      {/* Health Banner */}
      <div className={`mb-6 rounded-xl p-5 border-2 ${project.overall_health === 'green' ? 'bg-green-50 border-green-200' : project.overall_health === 'amber' ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200'}`}>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <HealthBadge status={project.overall_health as HealthStatus} label={`Overall: ${project.overall_health.toUpperCase()}`} />
              <span className="text-sm text-gray-600">{project.phase?.toUpperCase()} Phase · {project.completion_pct}% complete</span>
            </div>
            {project.executive_summary && <p className="text-sm text-gray-700 max-w-2xl leading-relaxed">{project.executive_summary}</p>}
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Budget vs. Actuals</div>
            <div className="text-lg font-bold">{fmt(project.actuals)} <span className="text-sm text-gray-400">of {fmt(project.budget)}</span></div>
            <div className="text-xs text-gray-500">{project.burn_rate}% burn rate</div>
          </div>
        </div>
      </div>

      {editing ? (
        <div className="card p-6 mb-6 max-w-2xl">
          <h3 className="section-title mb-4">Update Health Status</h3>
          <div className="grid grid-cols-2 gap-4">
            {[['overall_health', 'Overall Health'], ...DIMS.map(([k, l]) => [k, l])].map(([key, label]) => (
              <div key={key as string}>
                <label className="label">{label as string}</label>
                <select className="input" value={healthForm[key as string] || 'green'} onChange={e => setHealthForm(f => ({ ...f, [key as string]: e.target.value }))}>
                  <option value="green">Green — On Track</option>
                  <option value="amber">Amber — At Risk</option>
                  <option value="red">Red — Critical</option>
                </select>
              </div>
            ))}
            <div>
              <label className="label">Phase</label>
              <select className="input" value={healthForm.phase || ''} onChange={e => setHealthForm(f => ({ ...f, phase: e.target.value }))}>
                {['initiate', 'plan', 'execute', 'monitor', 'close'].map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Completion %</label>
              <input type="number" min={0} max={100} className="input" value={healthForm.completion_pct} onChange={e => setHealthForm(f => ({ ...f, completion_pct: e.target.value }))} />
            </div>
            <div>
              <label className="label">Actuals ($)</label>
              <input type="number" className="input" value={healthForm.actuals} onChange={e => setHealthForm(f => ({ ...f, actuals: e.target.value }))} />
            </div>
            <div className="col-span-2">
              <label className="label">Executive Summary</label>
              <textarea className="input" rows={4} value={healthForm.executive_summary} onChange={e => setHealthForm(f => ({ ...f, executive_summary: e.target.value }))} />
            </div>
          </div>
        </div>
      ) : null}

      {/* Health Dimensions Grid */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        {DIMS.map(([key, label]) => {
          const val = project[key] as HealthStatus;
          return (
            <div key={key as string} className={`card p-3 text-center border-t-4 ${val === 'green' ? 'border-t-green-500' : val === 'amber' ? 'border-t-amber-500' : 'border-t-red-500'}`}>
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
            {t === 'milestones' && <span className="ml-1 badge-gray">{milestones.length}</span>}
            {t === 'raid' && raid.filter(r => r.status === 'open').length > 0 && <span className="ml-1 badge-amber">{raid.filter(r => r.status === 'open').length}</span>}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="card p-5">
            <h3 className="section-title mb-3">Project Info</h3>
            <div className="space-y-2">
              <div className="flex justify-between"><span className="text-gray-500">Project Manager</span><span className="font-medium">{project.project_manager || '—'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Technical Lead</span><span className="font-medium">{project.technical_lead || '—'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Start Date</span><span>{project.start_date || '—'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">End Date</span><span>{project.end_date || '—'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Status</span><span className="capitalize">{project.status}</span></div>
            </div>
          </div>
          <div className="card p-5">
            <h3 className="section-title mb-3">Financial</h3>
            <div className="space-y-2">
              <div className="flex justify-between"><span className="text-gray-500">Budget</span><span className="font-medium">{fmt(project.budget)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Actuals</span><span className="font-medium">{fmt(project.actuals)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Remaining</span><span className="font-medium">{fmt(project.budget - project.actuals)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Burn Rate</span><span className={`font-semibold ${project.burn_rate > 90 ? 'text-red-600' : project.burn_rate > 70 ? 'text-amber-600' : 'text-green-700'}`}>{project.burn_rate}%</span></div>
            </div>
          </div>
        </div>
      )}

      {tab === 'milestones' && (
        <div className="card divide-y divide-gray-100">
          {milestones.length === 0 && <div className="p-6 text-center text-gray-400">No milestones defined.</div>}
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
          {raid.length === 0 && <div className="card p-6 text-center text-gray-400">No RAID items logged.</div>}
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
          {updates.length === 0 && <div className="card p-6 text-center text-gray-400">No status updates yet.</div>}
        </div>
      )}
    </div>
  );
}
