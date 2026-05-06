import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Plus, Trash2, UserCircle2, Bot } from 'lucide-react';
import { handoffApi } from '../api/client';
import Header from '../components/layout/Header';
import type { Handoff } from '../types';

export default function HandoffDetail() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [handoff, setHandoff] = useState<Handoff | null>(null);
  const [editing, setEditing] = useState(isNew);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    contract_id: searchParams.get('contract') || '',
    customer_vision: '',
    business_objectives: [''],
    success_criteria: [''],
    risks: [''],
    pitfalls: [''],
    key_decisions: [''],
    delivery_notes: '',
    pre_sales_owner: '',
    delivery_owner: '',
    contacts: [] as Array<{ name: string; title: string; email: string; phone: string; role: string }>,
  });

  useEffect(() => {
    if (!isNew && id) {
      handoffApi.get(id).then(r => {
        setHandoff(r.data);
        setForm({ ...r.data, contract_id: r.data.contract_id });
      });
    }
  }, [id, isNew]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        business_objectives: form.business_objectives.filter(Boolean),
        success_criteria: form.success_criteria.filter(Boolean),
        risks: form.risks.filter(Boolean),
        pitfalls: form.pitfalls.filter(Boolean),
        key_decisions: form.key_decisions.filter(Boolean),
      };
      if (isNew) {
        const r = await handoffApi.create(payload);
        navigate(`/handoffs/${r.data.id}`);
      } else {
        const r = await handoffApi.update(id!, payload);
        setHandoff(r.data);
        setEditing(false);
      }
    } finally { setSaving(false); }
  };

  const handleComplete = async () => {
    if (!handoff) return;
    const r = await handoffApi.update(handoff.id, { status: 'completed' });
    setHandoff(r.data);
  };

  const listField = (key: keyof typeof form) => {
    const arr = form[key] as string[];
    return (
      <div className="space-y-2">
        {arr.map((v, i) => (
          <div key={i} className="flex gap-2">
            <input className="input flex-1" value={v} onChange={e => {
              const next = [...arr]; next[i] = e.target.value;
              setForm(f => ({ ...f, [key]: next }));
            }} placeholder={`Item ${i + 1}...`} />
            <button onClick={() => setForm(f => ({ ...f, [key]: arr.filter((_, idx) => idx !== i) }))} className="text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
        <button onClick={() => setForm(f => ({ ...f, [key]: [...arr, ''] }))} className="text-xs text-ms-blue hover:underline flex items-center gap-1">
          <Plus className="w-3 h-3" /> Add item
        </button>
      </div>
    );
  };

  if (!isNew && !handoff && !editing) return <div className="p-8 text-gray-400">Loading...</div>;

  const data = handoff;

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Link to="/handoffs" className="btn-ghost flex items-center gap-1 text-gray-500"><ArrowLeft className="w-4 h-4" /> Handoffs</Link>
      </div>

      <Header
        title={isNew ? 'New Handoff Document' : 'Handoff Record'}
        subtitle={data ? `${data.pre_sales_owner} → ${data.delivery_owner || 'TBD'} · ${data.status}` : ''}
        actions={
          <div className="flex gap-2">
            {!isNew && !editing && data?.status !== 'completed' && (
              <>
                <button onClick={handleComplete} className="btn-primary flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Mark Complete</button>
                <button onClick={() => setEditing(true)} className="btn-secondary">Edit</button>
                <Link to={`/agent?context=handoff&id=${id}`} className="btn-secondary flex items-center gap-2"><Bot className="w-4 h-4" /> AI Assist</Link>
              </>
            )}
            {editing && (
              <>
                <button onClick={() => { setEditing(false); }} className="btn-secondary">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Save'}</button>
              </>
            )}
          </div>
        }
      />

      {editing ? (
        <div className="space-y-6 max-w-3xl">
          {isNew && (
            <div className="card p-6">
              <label className="label">Contract ID</label>
              <input className="input" value={form.contract_id} onChange={e => setForm(f => ({ ...f, contract_id: e.target.value }))} placeholder="Paste contract ID" />
            </div>
          )}
          <div className="card p-6">
            <h3 className="section-title mb-4">Ownership</h3>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="label">Pre-Sales Owner</label><input className="input" value={form.pre_sales_owner} onChange={e => setForm(f => ({ ...f, pre_sales_owner: e.target.value }))} /></div>
              <div><label className="label">Delivery Owner</label><input className="input" value={form.delivery_owner} onChange={e => setForm(f => ({ ...f, delivery_owner: e.target.value }))} /></div>
            </div>
          </div>
          <div className="card p-6">
            <h3 className="section-title mb-3">Customer Vision</h3>
            <textarea className="input" rows={4} value={form.customer_vision} onChange={e => setForm(f => ({ ...f, customer_vision: e.target.value }))} placeholder="What is the client trying to achieve? What does success look like to them in 3 years?" />
          </div>
          {([
            ['business_objectives', 'Business Objectives'],
            ['success_criteria', 'Success Criteria'],
            ['risks', 'Risks Identified in Pre-Sales'],
            ['pitfalls', 'Pitfalls & Watch-Outs'],
            ['key_decisions', 'Key Decisions Made'],
          ] as const).map(([key, label]) => (
            <div key={key} className="card p-6">
              <h3 className="section-title mb-3">{label}</h3>
              {listField(key)}
            </div>
          ))}
          <div className="card p-6">
            <h3 className="section-title mb-3">Delivery Notes</h3>
            <textarea className="input" rows={4} value={form.delivery_notes} onChange={e => setForm(f => ({ ...f, delivery_notes: e.target.value }))} placeholder="Critical information the delivery team must know on Day 1..." />
          </div>
        </div>
      ) : data && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {data.customer_vision && (
              <div className="card p-6">
                <h3 className="section-title mb-3">Customer Vision</h3>
                <p className="text-sm text-gray-700 leading-relaxed italic">"{data.customer_vision}"</p>
              </div>
            )}
            {[
              ['Business Objectives', data.business_objectives, 'bg-blue-50 border-blue-200'],
              ['Success Criteria', data.success_criteria, 'bg-green-50 border-green-200'],
              ['Risks', data.risks, 'bg-red-50 border-red-200'],
              ['Pitfalls & Watch-Outs', data.pitfalls, 'bg-amber-50 border-amber-200'],
              ['Key Decisions', data.key_decisions, 'bg-purple-50 border-purple-200'],
            ].map(([label, items, cls]) => (items as string[]).length > 0 && (
              <div key={label as string} className={`card p-6 border ${cls as string}`}>
                <h3 className="section-title mb-3">{label as string}</h3>
                <ul className="space-y-2">
                  {(items as string[]).map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {data.delivery_notes && (
              <div className="card p-6 bg-yellow-50 border-yellow-200 border">
                <h3 className="section-title mb-3">🔑 Delivery Team Notes</h3>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{data.delivery_notes}</p>
              </div>
            )}
          </div>
          <div className="space-y-4">
            <div className="card p-5">
              <h3 className="font-semibold text-gray-900 mb-3">Key Contacts</h3>
              {data.contacts.length === 0 && <p className="text-sm text-gray-400">No contacts recorded.</p>}
              <div className="space-y-3">
                {data.contacts.map(c => (
                  <div key={c.id} className="flex items-start gap-3">
                    <UserCircle2 className="w-8 h-8 text-gray-300 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium">{c.name}</div>
                      <div className="text-xs text-gray-500">{c.title}</div>
                      <div className="text-xs text-ms-blue">{c.email}</div>
                      <span className="badge-gray mt-1 inline-block">{c.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card p-5">
              <h3 className="font-semibold text-gray-900 mb-2">Ownership</h3>
              <div className="text-sm space-y-2">
                <div><span className="text-gray-500">Pre-Sales:</span> <span className="font-medium">{data.pre_sales_owner || '—'}</span></div>
                <div><span className="text-gray-500">Delivery:</span> <span className="font-medium">{data.delivery_owner || '—'}</span></div>
                <div><span className="text-gray-500">Status:</span> <span className={`font-medium capitalize ${data.status === 'completed' ? 'text-green-700' : 'text-amber-700'}`}>{data.status}</span></div>
                {data.completed_at && <div><span className="text-gray-500">Completed:</span> <span>{new Date(data.completed_at).toLocaleDateString()}</span></div>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
