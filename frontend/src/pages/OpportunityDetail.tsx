import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, FileText, Bot } from 'lucide-react';
import { opportunitiesApi } from '../api/client';
import Header from '../components/layout/Header';
import StageChip from '../components/shared/StageChip';
import type { Opportunity } from '../types';

const STAGES = ['prospect', 'qualify', 'develop', 'propose', 'negotiate', 'closed_won', 'closed_lost'];
const fmt = (v: number) => v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(2)}M` : v >= 1_000 ? `$${(v / 1_000).toFixed(0)}K` : `$${v}`;

export default function OpportunityDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [opp, setOpp] = useState<Opportunity | null>(null);
  const [editing, setEditing] = useState(id === 'new');
  const [form, setForm] = useState<Partial<Opportunity>>({});
  const [saving, setSaving] = useState(false);

  const isNew = id === 'new';

  useEffect(() => {
    if (!isNew && id) {
      opportunitiesApi.get(id).then(r => {
        setOpp(r.data);
        setForm(r.data);
      });
    } else {
      setForm({ stage: 'prospect', estimated_value: 0, services: [] });
    }
  }, [id, isNew]);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isNew) {
        const r = await opportunitiesApi.create(form);
        navigate(`/pipeline/${r.data.id}`);
      } else {
        const r = await opportunitiesApi.update(id!, form);
        setOpp(r.data);
        setEditing(false);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this opportunity?')) return;
    await opportunitiesApi.delete(id!);
    navigate('/pipeline');
  };

  const setField = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  if (!isNew && !opp) return <div className="p-8 text-gray-400">Loading...</div>;

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Link to="/pipeline" className="btn-ghost flex items-center gap-1 text-gray-500">
          <ArrowLeft className="w-4 h-4" /> Pipeline
        </Link>
      </div>

      <Header
        title={isNew ? 'New Opportunity' : (opp?.name || '')}
        subtitle={opp ? `${opp.client_name} · ${opp.stage}` : ''}
        actions={
          <div className="flex gap-2">
            {!isNew && !editing && (
              <>
                <Link to={`/agent?context=opportunity&id=${id}`} className="btn-secondary flex items-center gap-2"><Bot className="w-4 h-4" /> AI Assist</Link>
                <Link to={`/contracts/new?opp=${id}`} className="btn-secondary flex items-center gap-2"><FileText className="w-4 h-4" /> Create Contract</Link>
                <button onClick={() => setEditing(true)} className="btn-secondary flex items-center gap-2"><Edit2 className="w-4 h-4" /> Edit</button>
                <button onClick={handleDelete} className="btn-secondary text-red-600 flex items-center gap-2"><Trash2 className="w-4 h-4" /> Delete</button>
              </>
            )}
            {editing && (
              <>
                <button onClick={() => { setEditing(false); if (!isNew) setForm(opp!); }} className="btn-secondary">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Save'}</button>
              </>
            )}
          </div>
        }
      />

      {!editing && opp ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6">
              <h3 className="section-title mb-4">Overview</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="label">Stage</span><StageChip stage={opp.stage} /></div>
                <div><span className="label">Probability</span><span className="font-medium">{opp.probability}%</span></div>
                <div><span className="label">Estimated Value</span><span className="font-semibold text-lg">{fmt(opp.estimated_value)}</span></div>
                <div><span className="label">Weighted Value</span><span className="font-medium">{fmt(opp.weighted_value)}</span></div>
                <div><span className="label">Close Date</span><span>{opp.close_date || '—'}</span></div>
                <div><span className="label">Owner</span><span>{opp.owner || '—'}</span></div>
                <div><span className="label">Industry</span><span>{opp.industry || '—'}</span></div>
                <div><span className="label">Region</span><span>{opp.region || '—'}</span></div>
              </div>
            </div>
            {opp.description && (
              <div className="card p-6">
                <h3 className="section-title mb-3">Description</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{opp.description}</p>
              </div>
            )}
            {opp.notes && (
              <div className="card p-6">
                <h3 className="section-title mb-3">Notes</h3>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{opp.notes}</p>
              </div>
            )}
          </div>
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="section-title mb-3">Contact</h3>
              <div className="text-sm space-y-2">
                <div className="font-medium text-gray-900">{opp.client_name}</div>
                {opp.client_contact && <div className="text-gray-600">{opp.client_contact}</div>}
                {opp.client_contact_email && <a href={`mailto:${opp.client_contact_email}`} className="text-ms-blue hover:underline">{opp.client_contact_email}</a>}
              </div>
            </div>
            <div className="card p-6">
              <h3 className="section-title mb-3">Pipeline Stage</h3>
              <div className="space-y-2">
                {STAGES.map((s, i) => {
                  const current = STAGES.indexOf(opp.stage);
                  const active = i === current;
                  const done = i < current && !['closed_won', 'closed_lost'].includes(opp.stage);
                  return (
                    <div key={s} className={`flex items-center gap-2 text-sm ${active ? 'text-ms-blue font-semibold' : done ? 'text-gray-400' : 'text-gray-400'}`}>
                      <div className={`w-2 h-2 rounded-full ${active ? 'bg-ms-blue' : done ? 'bg-gray-300' : 'bg-gray-200'}`} />
                      {s.replace('_', ' ')}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card p-6 max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="label">Opportunity Name *</label>
              <input className="input" value={form.name || ''} onChange={e => setField('name', e.target.value)} placeholder="e.g. Contoso Azure Migration" />
            </div>
            <div>
              <label className="label">Client Name *</label>
              <input className="input" value={form.client_name || ''} onChange={e => setField('client_name', e.target.value)} />
            </div>
            <div>
              <label className="label">Stage</label>
              <select className="input" value={form.stage || 'prospect'} onChange={e => setField('stage', e.target.value)}>
                {STAGES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Estimated Value ($)</label>
              <input type="number" className="input" value={form.estimated_value || 0} onChange={e => setField('estimated_value', parseFloat(e.target.value))} />
            </div>
            <div>
              <label className="label">Close Date</label>
              <input type="date" className="input" value={form.close_date || ''} onChange={e => setField('close_date', e.target.value)} />
            </div>
            <div>
              <label className="label">Client Contact</label>
              <input className="input" value={form.client_contact || ''} onChange={e => setField('client_contact', e.target.value)} />
            </div>
            <div>
              <label className="label">Contact Email</label>
              <input type="email" className="input" value={form.client_contact_email || ''} onChange={e => setField('client_contact_email', e.target.value)} />
            </div>
            <div>
              <label className="label">Owner</label>
              <input className="input" value={form.owner || ''} onChange={e => setField('owner', e.target.value)} />
            </div>
            <div>
              <label className="label">Industry</label>
              <input className="input" value={form.industry || ''} onChange={e => setField('industry', e.target.value)} />
            </div>
            <div>
              <label className="label">Region</label>
              <select className="input" value={form.region || ''} onChange={e => setField('region', e.target.value)}>
                <option value="">Select region</option>
                {['Americas', 'EMEA', 'APAC'].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="label">Description</label>
              <textarea className="input" rows={4} value={form.description || ''} onChange={e => setField('description', e.target.value)} placeholder="Describe the client situation, opportunity scope, and strategic context..." />
            </div>
            <div className="md:col-span-2">
              <label className="label">Notes</label>
              <textarea className="input" rows={3} value={form.notes || ''} onChange={e => setField('notes', e.target.value)} placeholder="Internal notes, pitfalls, key intel..." />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
