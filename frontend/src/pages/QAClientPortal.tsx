import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Globe, CheckCircle, AlertTriangle, Activity, Clock,
  Bot,
} from 'lucide-react';
import clsx from 'clsx';
import { qualityAssuranceApi } from '../api/client';

type HealthStatus = 'green' | 'amber' | 'red';
type DisclosurePolicy = 'minimal' | 'standard' | 'transparent';
interface ClientView {
  project_id: string; project_name: string; client_name: string;
  disclosure_policy: DisclosurePolicy; client_health_status: HealthStatus;
  client_narrative: string;
  milestone_progress: { name: string; status: string; due: string; completion_pct: number }[];
  disclosed_risks: { risk: string; mitigation: string; status: string }[];
  next_update_date: string; client_sentiment_signals: string[];
}

const HEALTH_CFG: Record<HealthStatus, { bg: string; text: string; dot: string; label: string }> = {
  green: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500', label: 'Green' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500', label: 'Amber' },
  red:   { bg: 'bg-red-50',   text: 'text-red-700',   dot: 'bg-red-500',   label: 'Red' },
};
const DISCLOSURE_CFG: Record<DisclosurePolicy, { label: string; bg: string }> = {
  minimal:     { label: 'Minimal',     bg: 'bg-gray-100 text-gray-700' },
  standard:    { label: 'Standard',    bg: 'bg-blue-100 text-blue-700' },
  transparent: { label: 'Transparent', bg: 'bg-emerald-100 text-emerald-700' },
};

export default function QAClientPortal() {
  const navigate = useNavigate();
  const [views, setViews] = useState<ClientView[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    qualityAssuranceApi.getData()
      .then(r => setViews(r.data.client_portal))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-12 text-center text-gray-400">Loading client portal...</div>;

  return (
    <div>
      <div className="mb-6">
        <button onClick={() => navigate('/qa-framework')}
          className="btn-ghost flex items-center gap-1.5 text-gray-400 text-sm mb-4 -ml-1">
          <ArrowLeft className="w-4 h-4" /> Back to AI-QA Framework
        </button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="page-title flex items-center gap-2">
              <Globe className="w-7 h-7 text-emerald-600" />
              Client-Facing QA Agent
            </h1>
            <p className="text-sm text-gray-500 mt-1 max-w-2xl">
              Industry-first contract companion — curated, permission-controlled quality assurance visibility for clients.
            </p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 bg-gray-50 text-xs text-gray-400">
            <Bot className="w-3 h-3" /> Powered by Claude
          </div>
        </div>
      </div>

      <div className="card p-5 mb-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-100">
        <div className="flex items-center gap-3">
          <Globe className="w-5 h-5 text-emerald-600" />
          <div>
            <div className="text-sm font-bold text-gray-900">Contract Companion — No firm has productized this</div>
            <div className="text-xs text-gray-500">Proactive, transparent quality assurance visibility that positions the firm as uniquely trustworthy in proposals.</div>
          </div>
          <div className="ml-auto text-right">
            <div className="text-xs font-bold text-emerald-700">{views.length} projects configured</div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {views.map(v => {
          const dcfg = DISCLOSURE_CFG[v.disclosure_policy];
          const hcfg = HEALTH_CFG[v.client_health_status];
          return (
            <div key={v.project_id} className={clsx('card overflow-hidden border-l-4',
              v.client_health_status === 'green' ? 'border-l-emerald-500' : v.client_health_status === 'amber' ? 'border-l-amber-500' : 'border-l-red-500'
            )}>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={clsx('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold', hcfg.bg, hcfg.text)}>
                        <div className={clsx('w-2 h-2 rounded-full', hcfg.dot)} />
                        {hcfg.label}
                      </span>
                      <span className={clsx('text-xs font-semibold px-2 py-0.5 rounded', dcfg.bg)}>{dcfg.label}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm">{v.project_name}</h3>
                    <div className="text-xs text-gray-500">{v.client_name} · Next update: {new Date(v.next_update_date).toLocaleDateString()}</div>
                  </div>
                </div>

                <div className="rounded-lg bg-white border border-gray-200 p-4 mb-3">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">Client-Facing Narrative</div>
                  <p className="text-xs text-gray-700 leading-relaxed">{v.client_narrative}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">Milestone Progress</div>
                    <div className="space-y-2">
                      {v.milestone_progress.map((m, i) => (
                        <div key={i}>
                          <div className="flex items-center justify-between text-xs mb-0.5">
                            <span className={m.status === 'completed' ? 'text-green-700 font-medium' : 'text-gray-700'}>{m.name}</span>
                            <span className="text-gray-400">{m.completion_pct}%</span>
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className={clsx('h-full rounded-full', m.status === 'completed' ? 'bg-green-500' : m.status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-200')}
                              style={{ width: `${m.completion_pct}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">Disclosed Risks</div>
                    <div className="space-y-2">
                      {v.disclosed_risks.map((r, i) => (
                        <div key={i} className="rounded-lg bg-gray-50 border border-gray-100 p-2">
                          <div className="text-xs font-medium text-gray-700 mb-0.5">{r.risk}</div>
                          <div className="text-[10px] text-gray-500">{r.mitigation}</div>
                          <span className={clsx('text-[10px] font-semibold', r.status === 'mitigated' ? 'text-green-600' : 'text-amber-600')}>{r.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {v.client_sentiment_signals.length > 0 && (
                  <div className="rounded-lg bg-indigo-50 border border-indigo-100 p-3">
                    <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-wide mb-1">Client Sentiment Signals (Internal Only)</div>
                    <div className="flex flex-wrap gap-1.5">
                      {v.client_sentiment_signals.map((s, i) => (
                        <span key={i} className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
