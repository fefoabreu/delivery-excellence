import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { contractsApi } from '../api/client';
import Header from '../components/layout/Header';
import EmptyState from '../components/shared/EmptyState';
import type { Contract } from '../types';

const fmt = (v: number) => v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(2)}M` : v >= 1_000 ? `$${(v / 1_000).toFixed(0)}K` : `$${v}`;

const statusConfig: Record<string, { label: string; className: string; icon: typeof Clock }> = {
  draft: { label: 'Draft', className: 'badge-gray', icon: Clock },
  pending_approval: { label: 'Pending Approval', className: 'badge-amber', icon: Clock },
  approved: { label: 'Approved', className: 'badge-blue', icon: CheckCircle },
  active: { label: 'Active', className: 'badge-green', icon: CheckCircle },
  completed: { label: 'Completed', className: 'badge-gray', icon: CheckCircle },
  cancelled: { label: 'Cancelled', className: 'badge-red', icon: AlertCircle },
};

export default function Contracts() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    contractsApi.list().then(r => setContracts(r.data)).finally(() => setLoading(false));
  }, []);

  const filtered = filter ? contracts.filter(c => c.status === filter) : contracts;
  const totalValue = contracts.filter(c => ['approved', 'active'].includes(c.status)).reduce((s, c) => s + c.total_value, 0);
  const pending = contracts.filter(c => c.status === 'pending_approval');

  return (
    <div>
      <Header
        title="Contracts & SOWs"
        subtitle="Statement of Work management and executive approvals"
        actions={
          <Link to="/contracts/new" className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Contract
          </Link>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card p-4 border-l-4 border-l-ms-blue">
          <div className="text-sm text-gray-500">Total Contracts</div>
          <div className="text-2xl font-bold mt-1">{contracts.length}</div>
        </div>
        <div className="card p-4 border-l-4 border-l-ms-green">
          <div className="text-sm text-gray-500">Contract Value</div>
          <div className="text-2xl font-bold mt-1">{fmt(totalValue)}</div>
        </div>
        <div className="card p-4 border-l-4 border-l-amber-500">
          <div className="text-sm text-gray-500">Pending Approval</div>
          <div className="text-2xl font-bold mt-1">{pending.length}</div>
        </div>
        <div className="card p-4 border-l-4 border-l-purple-500">
          <div className="text-sm text-gray-500">Active</div>
          <div className="text-2xl font-bold mt-1">{contracts.filter(c => c.status === 'active').length}</div>
        </div>
      </div>

      {pending.length > 0 && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <div className="text-sm font-medium text-amber-800">{pending.length} contract{pending.length > 1 ? 's' : ''} awaiting executive approval</div>
            <div className="text-xs text-amber-600 mt-0.5">{pending.map(c => c.name).join(', ')}</div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="p-4 border-b border-gray-100 flex items-center gap-3">
          <div className="flex gap-2">
            {['', 'draft', 'pending_approval', 'approved', 'active', 'completed'].map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${filter === s ? 'bg-ms-blue text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {s === '' ? 'All' : s.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={FileText} title="No contracts found" description="Create a contract from an approved opportunity." action={<Link to="/contracts/new" className="btn-primary">New Contract</Link>} />
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map(c => {
              const scfg = statusConfig[c.status] || statusConfig.draft;
              return (
                <Link key={c.id} to={`/contracts/${c.id}`} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-ms-blue" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 truncate">{c.name}</span>
                      <span className={`${scfg.className} text-xs font-medium px-2 py-0.5 rounded-full`}>{scfg.label}</span>
                      {c.has_handoff && <span className="badge-blue">Handoff</span>}
                      {c.has_delivery && <span className="badge-green">Delivery</span>}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span>{c.contract_number}</span>
                      <span>·</span>
                      <span>{c.client_name}</span>
                      {c.approved_by && <><span>·</span><span>Approved by {c.approved_by}</span></>}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-semibold text-gray-900">{fmt(c.total_value)}</div>
                    <div className="text-xs text-gray-400">{c.service_lines.length} service lines</div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
