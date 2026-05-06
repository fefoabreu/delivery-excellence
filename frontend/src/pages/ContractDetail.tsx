import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Send, GitBranch, Activity, Bot, Plus, Trash2 } from 'lucide-react';
import { contractsApi, catalogApi } from '../api/client';
import Header from '../components/layout/Header';
import type { Contract, ServiceCatalog } from '../types';

const fmt = (v: number) => v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(2)}M` : v >= 1_000 ? `$${(v / 1_000).toFixed(0)}K` : `$${v}`;

const CAT_LABELS: Record<string, string> = {
  cloud_adoption: 'Cloud Adoption', ai_agentic: 'AI & Agentic', dynamics: 'Dynamics 365',
  security: 'Security', data_analytics: 'Data & Analytics',
};

interface ServiceLineForm { service_id: string; quantity: number; discount_pct: number; }

export default function ContractDetail() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [contract, setContract] = useState<Contract | null>(null);
  const [catalog, setCatalog] = useState<ServiceCatalog[]>([]);
  const [form, setForm] = useState<Record<string, unknown>>({
    opportunity_id: searchParams.get('opp') || '',
    name: '', client_name: '', scope_summary: '', start_date: '', end_date: '', created_by: '',
  });
  const [lines, setLines] = useState<ServiceLineForm[]>([]);
  const [approver, setApprover] = useState('');
  const [saving, setSaving] = useState(false);
  const [actionNote, setActionNote] = useState('');
  const [showApproval, setShowApproval] = useState(false);

  useEffect(() => {
    catalogApi.list().then(r => setCatalog(r.data));
    if (!isNew && id) contractsApi.get(id).then(r => setContract(r.data));
  }, [id, isNew]);

  const handleCreate = async () => {
    setSaving(true);
    try {
      const r = await contractsApi.create({ ...form, service_lines: lines });
      navigate(`/contracts/${r.data.id}`);
    } finally { setSaving(false); }
  };

  const handleSubmit = async () => {
    if (!contract) return;
    const r = await contractsApi.submit(contract.id);
    setContract(r.data);
  };

  const handleApprove = async (action: 'approve' | 'reject') => {
    if (!contract || !approver) return;
    const r = await contractsApi.approve(contract.id, { action, approved_by: approver, notes: actionNote });
    setContract(r.data);
    setShowApproval(false);
  };

  const handleClose = async () => {
    if (!contract) return;
    const r = await contractsApi.close(contract.id);
    setContract(r.data);
  };

  const addLine = () => setLines(l => [...l, { service_id: '', quantity: 1, discount_pct: 0 }]);
  const removeLine = (i: number) => setLines(l => l.filter((_, idx) => idx !== i));
  const updateLine = (i: number, k: string, v: unknown) => setLines(l => l.map((line, idx) => idx === i ? { ...line, [k]: v } : line));

  const lineTotal = (line: ServiceLineForm) => {
    const svc = catalog.find(s => s.id === line.service_id);
    return svc ? (svc.list_price || 0) * line.quantity * (1 - line.discount_pct / 100) : 0;
  };

  const grouped = catalog.reduce((acc, s) => {
    acc[s.category] = acc[s.category] || [];
    acc[s.category].push(s);
    return acc;
  }, {} as Record<string, ServiceCatalog[]>);

  if (!isNew && !contract) return <div className="p-8 text-gray-400">Loading...</div>;

  const canSubmit = contract?.status === 'draft';
  const canApprove = contract?.status === 'pending_approval';
  const canClose = contract?.status === 'approved';

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Link to="/contracts" className="btn-ghost flex items-center gap-1 text-gray-500"><ArrowLeft className="w-4 h-4" /> Contracts</Link>
      </div>

      <Header
        title={isNew ? 'New Contract / SOW' : contract!.name}
        subtitle={contract ? `${contract.contract_number} · ${contract.client_name}` : ''}
        actions={
          <div className="flex gap-2">
            {isNew && <button onClick={handleCreate} disabled={saving} className="btn-primary">{saving ? 'Creating...' : 'Create Contract'}</button>}
            {!isNew && canSubmit && <button onClick={handleSubmit} className="btn-primary flex items-center gap-2"><Send className="w-4 h-4" /> Submit for Approval</button>}
            {!isNew && canApprove && <button onClick={() => setShowApproval(true)} className="btn-primary flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Executive Review</button>}
            {!isNew && canClose && <button onClick={handleClose} className="btn-primary flex items-center gap-2"><Activity className="w-4 h-4" /> Activate Contract</button>}
            {!isNew && contract?.status === 'active' && !contract.has_handoff && (
              <Link to={`/handoffs/new?contract=${contract.id}`} className="btn-primary flex items-center gap-2"><GitBranch className="w-4 h-4" /> Start Handoff</Link>
            )}
            {!isNew && contract?.has_handoff && (
              <Link to={`/handoffs?contract=${contract.id}`} className="btn-secondary flex items-center gap-2"><GitBranch className="w-4 h-4" /> View Handoff</Link>
            )}
            {!isNew && <Link to={`/agent?context=contract&id=${id}`} className="btn-secondary flex items-center gap-2"><Bot className="w-4 h-4" /> AI Assist</Link>}
          </div>
        }
      />

      {showApproval && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold mb-4">Executive Approval</h3>
            <div className="mb-3">
              <label className="label">Approver Name *</label>
              <input className="input" value={approver} onChange={e => setApprover(e.target.value)} placeholder="e.g. Patricia Evans, VP Delivery" />
            </div>
            <div className="mb-4">
              <label className="label">Notes (optional)</label>
              <textarea className="input" rows={3} value={actionNote} onChange={e => setActionNote(e.target.value)} />
            </div>
            <div className="flex gap-3">
              <button onClick={() => handleApprove('approve')} disabled={!approver} className="btn-primary flex items-center gap-2 flex-1 justify-center"><CheckCircle className="w-4 h-4" /> Approve</button>
              <button onClick={() => handleApprove('reject')} disabled={!approver} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 flex-1 justify-center"><XCircle className="w-4 h-4" /> Reject</button>
              <button onClick={() => setShowApproval(false)} className="btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {isNew ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6">
              <h3 className="section-title mb-4">Contract Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="label">Contract Name *</label>
                  <input className="input" value={form.name as string} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Contoso Azure Migration - Phase 1" />
                </div>
                <div>
                  <label className="label">Client Name *</label>
                  <input className="input" value={form.client_name as string} onChange={e => setForm(f => ({ ...f, client_name: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Created By</label>
                  <input className="input" value={form.created_by as string} onChange={e => setForm(f => ({ ...f, created_by: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Start Date</label>
                  <input type="date" className="input" value={form.start_date as string} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))} />
                </div>
                <div>
                  <label className="label">End Date</label>
                  <input type="date" className="input" value={form.end_date as string} onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))} />
                </div>
                <div className="col-span-2">
                  <label className="label">Scope Summary</label>
                  <textarea className="input" rows={5} value={form.scope_summary as string} onChange={e => setForm(f => ({ ...f, scope_summary: e.target.value }))} placeholder="Describe the full scope of services to be delivered..." />
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="section-title">Service Lines</h3>
                <button onClick={addLine} className="btn-secondary flex items-center gap-1"><Plus className="w-4 h-4" /> Add Service</button>
              </div>
              {lines.length === 0 && <p className="text-sm text-gray-400">Add services from the catalog to build the contract value.</p>}
              <div className="space-y-3">
                {lines.map((line, i) => {
                  const svc = catalog.find(s => s.id === line.service_id);
                  return (
                    <div key={i} className="grid grid-cols-12 gap-2 items-center p-3 bg-gray-50 rounded-lg">
                      <div className="col-span-5">
                        <select className="input text-xs" value={line.service_id} onChange={e => updateLine(i, 'service_id', e.target.value)}>
                          <option value="">Select service...</option>
                          {Object.entries(grouped).map(([cat, svcs]) => (
                            <optgroup key={cat} label={CAT_LABELS[cat] || cat}>
                              {svcs.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </optgroup>
                          ))}
                        </select>
                      </div>
                      <div className="col-span-2">
                        <input type="number" min={0.5} step={0.5} className="input text-xs" value={line.quantity} onChange={e => updateLine(i, 'quantity', parseFloat(e.target.value))} placeholder="Qty" />
                      </div>
                      <div className="col-span-2 text-xs text-gray-500 text-center">{svc?.unit || '—'}</div>
                      <div className="col-span-2 text-right text-sm font-semibold">{fmt(lineTotal(line))}</div>
                      <div className="col-span-1 flex justify-end">
                        <button onClick={() => removeLine(i)} className="text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  );
                })}
                {lines.length > 0 && (
                  <div className="flex justify-end pt-2 border-t border-gray-200">
                    <span className="font-bold text-lg">{fmt(lines.reduce((s, l) => s + lineTotal(l), 0))}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="card p-6 h-fit">
            <h3 className="section-title mb-3">Service Catalog</h3>
            <div className="space-y-3 text-xs">
              {Object.entries(grouped).map(([cat, svcs]) => (
                <div key={cat}>
                  <div className="font-semibold text-gray-500 uppercase tracking-wide text-[10px] mb-1">{CAT_LABELS[cat] || cat}</div>
                  {svcs.map(s => (
                    <div key={s.id} className="flex justify-between py-1 border-b border-gray-50">
                      <span className="text-gray-700 truncate">{s.name}</span>
                      <span className="text-gray-500 ml-2">${(s.list_price || 0).toLocaleString()}/{s.unit}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : contract && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6">
              <h3 className="section-title mb-4">Contract Overview</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="label">Status</span><span className="font-medium capitalize">{contract.status.replace('_', ' ')}</span></div>
                <div><span className="label">Approval</span><span className="font-medium capitalize">{contract.approval_status}</span></div>
                <div><span className="label">Total Value</span><span className="text-2xl font-bold">{fmt(contract.total_value)}</span></div>
                {contract.approved_by && <div><span className="label">Approved By</span><span>{contract.approved_by}</span></div>}
                <div><span className="label">Start Date</span><span>{contract.start_date || '—'}</span></div>
                <div><span className="label">End Date</span><span>{contract.end_date || '—'}</span></div>
                {contract.created_by && <div><span className="label">Created By</span><span>{contract.created_by}</span></div>}
              </div>
              {contract.scope_summary && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="label">Scope Summary</div>
                  <p className="text-sm text-gray-700 leading-relaxed">{contract.scope_summary}</p>
                </div>
              )}
            </div>
            <div className="card p-6">
              <h3 className="section-title mb-4">Service Lines</h3>
              <div className="divide-y divide-gray-100">
                {contract.service_lines.map(sl => (
                  <div key={sl.id} className="flex items-center justify-between py-3">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{sl.service_name}</div>
                      <div className="text-xs text-gray-500">{sl.quantity} {sl.unit} · ${(sl.unit_price || 0).toLocaleString()}/{sl.unit}</div>
                    </div>
                    <div className="font-semibold">{fmt(sl.total)}</div>
                  </div>
                ))}
                <div className="flex justify-between pt-3 font-bold text-lg">
                  <span>Total Contract Value</span>
                  <span>{fmt(contract.total_value)}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="card p-5">
              <h3 className="font-semibold text-gray-900 mb-3">Contract Lifecycle</h3>
              {['draft', 'pending_approval', 'approved', 'active', 'completed'].map((s, i) => {
                const current = ['draft', 'pending_approval', 'approved', 'active', 'completed'].indexOf(contract.status);
                const active = i === current;
                const done = i < current;
                return (
                  <div key={s} className={`flex items-center gap-2 py-1.5 text-sm ${active ? 'text-ms-blue font-semibold' : done ? 'text-gray-400' : 'text-gray-300'}`}>
                    <div className={`w-2 h-2 rounded-full ${active ? 'bg-ms-blue' : done ? 'bg-green-400' : 'bg-gray-200'}`} />
                    {s.replace('_', ' ')}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
