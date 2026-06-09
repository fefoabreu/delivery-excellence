import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { GitBranch, Plus, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { handoffApi } from '../api/client';
import Header from '../components/layout/Header';
import EmptyState from '../components/shared/EmptyState';
import type { Handoff } from '../types';

export default function Handoffs() {
  const [handoffs, setHandoffs] = useState<Handoff[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const contractFilter = searchParams.get('contract');

  useEffect(() => {
    handoffApi.list().then(r => setHandoffs(r.data)).finally(() => setLoading(false));
  }, []);

  const filtered = contractFilter ? handoffs.filter(h => h.contract_id === contractFilter) : handoffs;

  return (
    <div>
      <Header
        eyebrow="Delivery · Sales-to-Delivery Handoff"
        title="Handoff Center"
        subtitle="Sales-to-delivery transition management"
        actions={
          <Link to="/handoffs/new" className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Handoff
          </Link>
        }
      />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card p-4 border-l-4 border-l-flux">
          <div className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-faint">Total Handoffs</div>
          <div className="kpi-number text-ink mt-1">{handoffs.length}</div>
        </div>
        <div className="card p-4 border-l-4 border-l-ms-green">
          <div className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-faint">Completed</div>
          <div className="kpi-number text-ink mt-1">{handoffs.filter(h => h.status === 'completed').length}</div>
        </div>
        <div className="card p-4 border-l-4 border-l-amber-500">
          <div className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-faint">Pending</div>
          <div className="kpi-number text-ink mt-1">{handoffs.filter(h => h.status !== 'completed').length}</div>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div className="p-8 text-center text-ink-faint">Loading...</div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={GitBranch} title="No handoffs yet" description="Initiate a handoff from an active contract to transfer knowledge to the delivery team." action={<Link to="/handoffs/new" className="btn-primary">New Handoff</Link>} />
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map(h => (
              <Link key={h.id} to={`/handoffs/${h.id}`} className="flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${h.status === 'completed' ? 'bg-green-100' : 'bg-amber-100'}`}>
                  {h.status === 'completed'
                    ? <CheckCircle className="w-5 h-5 text-green-600" />
                    : <Clock className="w-5 h-5 text-amber-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-ink truncate">{h.customer_vision?.slice(0, 80)}...</div>
                  <div className="flex items-center gap-4 mt-1 text-xs text-ink-soft">
                    <span>{h.pre_sales_owner} → {h.delivery_owner || 'TBD'}</span>
                    <span>·</span>
                    <span>{h.contacts.length} contacts</span>
                    <span>·</span>
                    <span className="capitalize">{h.status.replace('_', ' ')}</span>
                    <span>·</span>
                    <span>{h.risks.length} risks · {h.pitfalls.length} pitfalls</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-ink-faint" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
