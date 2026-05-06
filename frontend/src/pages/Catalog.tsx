import { useEffect, useState } from 'react';
import { Package, Search } from 'lucide-react';
import { catalogApi } from '../api/client';
import Header from '../components/layout/Header';
import type { ServiceCatalog } from '../types';

const CAT_CONFIG: Record<string, { label: string; color: string }> = {
  cloud_adoption: { label: 'Cloud Adoption', color: 'bg-blue-100 text-blue-800' },
  ai_agentic: { label: 'AI & Agentic', color: 'bg-purple-100 text-purple-800' },
  dynamics: { label: 'Dynamics 365', color: 'bg-indigo-100 text-indigo-800' },
  security: { label: 'Security', color: 'bg-red-100 text-red-800' },
  data_analytics: { label: 'Data & Analytics', color: 'bg-green-100 text-green-800' },
};

const UNIT_LABELS: Record<string, string> = { day: '/day', hour: '/hr', fixed: 'fixed', user_month: '/user/mo' };

export default function Catalog() {
  const [services, setServices] = useState<ServiceCatalog[]>([]);
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    catalogApi.list().then(r => setServices(r.data)).finally(() => setLoading(false));
  }, []);

  const filtered = services.filter(s =>
    (!cat || s.category === cat) &&
    (!search || s.name.toLowerCase().includes(search.toLowerCase()) || s.description?.toLowerCase().includes(search.toLowerCase()))
  );

  const grouped = filtered.reduce((acc, s) => {
    acc[s.category] = acc[s.category] || [];
    acc[s.category].push(s);
    return acc;
  }, {} as Record<string, ServiceCatalog[]>);

  return (
    <div>
      <Header title="Service Catalog" subtitle="Microsoft Professional Services offerings — Cloud, AI, Dynamics, Security & Data" />

      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input className="input pl-9" placeholder="Search services..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setCat('')} className={`px-3 py-1.5 rounded-md text-xs font-medium ${!cat ? 'bg-ms-blue text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>All</button>
          {Object.entries(CAT_CONFIG).map(([k, v]) => (
            <button key={k} onClick={() => setCat(cat === k ? '' : k)} className={`px-3 py-1.5 rounded-md text-xs font-medium ${cat === k ? 'bg-ms-blue text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{v.label}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-gray-400">Loading catalog...</div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([category, svcs]) => {
            const cfg = CAT_CONFIG[category] || { label: category, color: 'bg-gray-100 text-gray-700' };
            return (
              <div key={category} className="card">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                  <Package className="w-4 h-4 text-gray-400" />
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.color}`}>{cfg.label}</span>
                  <span className="text-sm text-gray-400">{svcs.length} services</span>
                </div>
                <div className="divide-y divide-gray-100">
                  {svcs.map(s => (
                    <div key={s.id} className="px-6 py-4 flex items-start justify-between gap-6 hover:bg-gray-50">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 text-sm">{s.name}</div>
                        <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">{s.description}</div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="font-semibold text-gray-900">${(s.list_price || 0).toLocaleString()}<span className="font-normal text-gray-400 text-xs">{UNIT_LABELS[s.unit || ''] || ''}</span></div>
                        <div className="text-xs text-gray-400">{s.practice}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="card p-12 text-center">
              <Package className="w-8 h-8 text-gray-300 mx-auto mb-3" />
              <div className="text-gray-400">No services match your search.</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
