import { useEffect } from 'react';
import {
  X, CheckCircle, AlertTriangle, Clock, Activity,
  Presentation, ChevronDown, ChevronRight, TrendingUp,
  ArrowUp, ArrowDown, Minus, Target, Users, Eye,
  BarChart2, Shield, Bot,
} from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

type HealthStatus = 'green' | 'amber' | 'red';

interface HealthReviewData {
  project_name: string;
  client_name: string;
  project_manager: string;
  overall_health: HealthStatus;
  phase: string;
  budget: number;
  actuals: number;
  burn_rate: number;
  completion_pct: number;
  start_date: string;
  end_date: string;
  early_warning_score: number;
  ew_trend: string;
  ew_trend_delta: number;
  ew_components: Record<string, number>;
  health_dimensions: Record<string, HealthStatus>;
  predictions: { d30: HealthStatus; d60: HealthStatus; d90: HealthStatus };
  ai_assessment: string;
  ai_narrative: string;
  nomination_reason: string;
  value_at_risk: number;
  talking_points: string[];
  preparation_notes: string;
  key_risks: string[];
  key_achievements: string[];
  recommendation: string;
}

interface Props {
  data: HealthReviewData;
  onClose: () => void;
}

const fmt = (v: number) => v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(1)}M` : v >= 1_000 ? `$${(v / 1_000).toFixed(0)}K` : `$${v}`;

const HEALTH_CFG: Record<HealthStatus, { bg: string; text: string; dot: string; label: string; border: string; badge: string }> = {
  green: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500', label: 'Green', border: 'border-green-200', badge: 'Healthy' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500', label: 'Amber', border: 'border-amber-200', badge: 'At Risk' },
  red:   { bg: 'bg-red-50',   text: 'text-red-700',   dot: 'bg-red-500',   label: 'Red',   border: 'border-red-200',   badge: 'Critical' },
};

const ewScoreColor = (s: number) => s >= 80 ? 'text-red-700' : s >= 60 ? 'text-orange-700' : s >= 40 ? 'text-amber-700' : 'text-green-700';
const ewBarColor = (s: number) => s >= 80 ? 'bg-red-500' : s >= 60 ? 'bg-orange-500' : s >= 40 ? 'bg-amber-500' : 'bg-green-500';

const DIMS = ['schedule', 'budget', 'scope', 'risk', 'satisfaction'] as const;

function BriefCard({ label, text, accent }: { label: string; text: string; accent?: boolean }) {
  return (
    <div className={clsx('rounded-lg border p-3 flex flex-col gap-1', accent ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200')}>
      <div className={clsx('text-[9px] font-bold uppercase tracking-widest', accent ? 'text-slate-400' : 'text-gray-400')}>{label}</div>
      <p className={clsx('text-[11px] leading-relaxed line-clamp-4', accent ? 'text-white' : 'text-gray-700')}>{text}</p>
    </div>
  );
}

function AccordionSection({ title, icon: Icon, children }: { title: string; icon: typeof Shield; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-gray-50 transition-colors">
        <Icon className="w-3 h-3 text-gray-400 flex-shrink-0" />
        <span className="text-[11px] font-medium text-gray-700 flex-1">{title}</span>
        <ChevronDown className={clsx('w-3.5 h-3.5 text-gray-400 flex-shrink-0 transition-transform duration-150', open && 'rotate-180')} />
      </button>
      {open && <div className="px-3 pb-3 border-t border-gray-50">{children}</div>}
    </div>
  );
}

function HealthReviewSlide({ data }: { data: HealthReviewData }) {
  const hc = HEALTH_CFG[data.overall_health];
  const burnGap = Math.abs(data.burn_rate - data.completion_pct);

  return (
    <div className="bg-white rounded shadow-xl flex flex-col overflow-hidden w-full h-full">
      <div className={clsx('h-1.5 w-full flex-shrink-0', hc.dot)} />

      <div className="flex-1 overflow-y-auto px-8 py-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Monthly Health Review · Executive Briefing · Confidential</div>
            <h1 className="text-[19px] font-bold text-gray-900 leading-tight">{data.project_name}</h1>
            <div className="text-[12px] text-gray-500 mt-0.5">{data.client_name} · PM: {data.project_manager} · Phase: {data.phase}</div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className={clsx('px-3 py-1.5 rounded-lg border text-[12px] font-bold', hc.bg, hc.text, hc.border)}>
              {hc.badge}
            </div>
            <div className="text-right">
              <div className={clsx('text-[28px] font-bold leading-none', ewScoreColor(data.early_warning_score))}>{data.early_warning_score}</div>
              <div className="text-[10px] text-gray-400">EW Score</div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 mb-5" />

        {/* Executive Brief Cards */}
        <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">Executive Summary</div>
        <div className="grid grid-cols-3 gap-2 mb-2">
          <BriefCard label="AI Assessment" text={data.ai_narrative} accent />
          <BriefCard label="Nomination Reason" text={data.nomination_reason} />
          <BriefCard label="Recommendation" text={data.recommendation} />
        </div>
        <div className="grid grid-cols-2 gap-2 mb-6">
          <BriefCard label="Key Achievements" text={data.key_achievements.join('. ')} />
          <BriefCard label="Key Risks" text={data.key_risks.join('. ')} />
        </div>

        <div className="border-t border-gray-100 mb-5" />

        {/* Lower section: health dims + financials | predictions + EW components */}
        <div className="grid grid-cols-[1fr_180px] gap-6">
          <div>
            {/* Health Dimensions */}
            <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">Health Dimensions</div>
            <div className="space-y-1.5 mb-5">
              {DIMS.map(d => {
                const h = data.health_dimensions[d] as HealthStatus;
                const dc = HEALTH_CFG[h];
                return (
                  <div key={d} className="flex items-center gap-2 py-0.5">
                    <div className={clsx('w-2 h-2 rounded-full flex-shrink-0', dc.dot)} />
                    <span className="text-[10px] text-gray-600 w-24 flex-shrink-0 capitalize">{d}</span>
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={clsx('h-full rounded-full', dc.dot)} style={{ width: h === 'green' ? '100%' : h === 'amber' ? '60%' : '30%' }} />
                    </div>
                    <span className={clsx('text-[10px] font-bold w-12 text-right flex-shrink-0', dc.text)}>{dc.label}</span>
                  </div>
                );
              })}
            </div>

            {/* Financial Summary */}
            <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">Financial Summary</div>
            <div className="grid grid-cols-4 gap-2">
              <div className="rounded-lg border border-gray-200 p-2 text-center">
                <div className="text-[14px] font-bold text-gray-900">{fmt(data.budget)}</div>
                <div className="text-[9px] text-gray-400">Budget</div>
              </div>
              <div className="rounded-lg border border-gray-200 p-2 text-center">
                <div className="text-[14px] font-bold text-gray-900">{fmt(data.actuals)}</div>
                <div className="text-[9px] text-gray-400">Actuals</div>
              </div>
              <div className={clsx('rounded-lg border p-2 text-center', burnGap > 10 ? 'border-red-200 bg-red-50' : 'border-gray-200')}>
                <div className={clsx('text-[14px] font-bold', burnGap > 10 ? 'text-red-700' : 'text-gray-900')}>{data.burn_rate}%</div>
                <div className="text-[9px] text-gray-400">Burn Rate</div>
              </div>
              <div className="rounded-lg border border-gray-200 p-2 text-center">
                <div className="text-[14px] font-bold text-gray-900">{data.completion_pct}%</div>
                <div className="text-[9px] text-gray-400">Complete</div>
              </div>
            </div>
            {data.value_at_risk > 0 && (
              <div className="mt-2 flex items-center gap-1.5 text-[10px] text-red-600 font-medium">
                <AlertTriangle className="w-3 h-3" /> Value at risk: {fmt(data.value_at_risk)}
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {/* Predictions */}
            <div>
              <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Trajectory Forecast</div>
              <div className="space-y-1">
                {(['d30', 'd60', 'd90'] as const).map(k => {
                  const pred = data.predictions[k];
                  const pc = HEALTH_CFG[pred];
                  return (
                    <div key={k} className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-500 w-8">{k === 'd30' ? '30d' : k === 'd60' ? '60d' : '90d'}</span>
                      <div className={clsx('w-2 h-2 rounded-full', pc.dot)} />
                      <span className={clsx('text-[10px] font-semibold', pc.text)}>{pc.label}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center gap-1 mt-1.5 text-[10px] text-gray-500">
                {data.ew_trend === 'worsening' ? <ArrowUp className="w-3 h-3 text-red-500" /> : data.ew_trend === 'improving' ? <ArrowDown className="w-3 h-3 text-green-500" /> : <Minus className="w-3 h-3 text-gray-400" />}
                Trend: {data.ew_trend} ({data.ew_trend_delta > 0 ? '+' : ''}{data.ew_trend_delta})
              </div>
            </div>

            {/* EW Components */}
            <div>
              <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">EW Signal Components</div>
              <div className="space-y-1">
                {Object.entries(data.ew_components).map(([key, val]) => (
                  <div key={key} className="flex items-center gap-1.5">
                    <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div className={clsx('h-full rounded-full', ewBarColor(val))} style={{ width: `${val}%` }} />
                    </div>
                    <span className={clsx('text-[9px] font-bold w-5 text-right', ewScoreColor(val))}>{val}</span>
                    <span className="text-[9px] text-gray-400 w-14 truncate capitalize">{key.split('_').slice(0, 2).join(' ')}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div>
              <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Timeline</div>
              <div className="space-y-0.5 text-[10px] text-gray-600">
                <div>Start: {new Date(data.start_date).toLocaleDateString()}</div>
                <div>End: {new Date(data.end_date).toLocaleDateString()}</div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-ms-blue rounded-full" style={{ width: `${data.completion_pct}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 border-t border-gray-100 px-8 py-2 flex items-center justify-between">
        <span className="text-[9px] text-gray-400">Delivery Excellence · QA Health Review · AI-Generated · {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        <span className="text-[9px] text-gray-300">Slide 1 of 1</span>
      </div>
    </div>
  );
}

export default function HealthReviewModal({ data, onClose }: Props) {
  const hc = HEALTH_CFG[data.overall_health];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative flex flex-col m-3 rounded-lg overflow-hidden shadow-2xl flex-1 min-h-0">

        {/* Title Bar */}
        <div className="flex items-center px-4 h-10 flex-shrink-0 gap-3" style={{ background: '#1e293b' }}>
          <Presentation className="w-4 h-4 text-white opacity-80 flex-shrink-0" />
          <span className="text-white text-[13px] font-medium flex-1 truncate">{data.project_name} — Health Review Briefing</span>
          <div className={clsx('flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold', hc.bg, hc.text)}>
            {hc.badge} · EW {data.early_warning_score}
          </div>
          <button onClick={onClose} className="ml-2 text-white/70 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ribbon */}
        <div className="flex items-center px-4 h-7 gap-5 flex-shrink-0" style={{ background: '#f3f2f1', borderBottom: '1px solid #d0d0d0' }}>
          {['File', 'Home', 'Insert', 'Design', 'Transitions', 'Slide Show', 'Review'].map(tab => (
            <span key={tab} className="text-[11px] text-gray-600 cursor-default select-none hover:bg-gray-200 px-1.5 py-0.5 rounded">{tab}</span>
          ))}
          <span className="ml-auto text-[10px] text-gray-400 select-none">Delivery Excellence · AI Quality Assurance</span>
        </div>

        {/* Slide + Right Panel */}
        <div className="flex flex-1 min-h-0">
          <div className="flex-1 overflow-hidden flex items-stretch p-6" style={{ background: '#c8c8c8' }}>
            <HealthReviewSlide data={data} />
          </div>

          <div className="w-72 bg-white border-l border-gray-200 flex flex-col overflow-hidden flex-shrink-0">
            <div className="px-3 py-2 border-b border-gray-200 flex-shrink-0">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Review Preparation</div>
              <div className="text-[9px] text-gray-400 mt-0.5">Click any section to expand</div>
            </div>
            <div className="flex-1 overflow-y-auto">
              <AccordionSection title="AI Talking Points" icon={Bot}>
                <div className="mt-2 space-y-1.5">
                  {data.talking_points.map((tp, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <ChevronRight className="w-2.5 h-2.5 text-ms-blue mt-0.5 flex-shrink-0" />
                      <p className="text-[11px] text-gray-700 leading-relaxed">{tp}</p>
                    </div>
                  ))}
                </div>
              </AccordionSection>

              <AccordionSection title="Preparation Notes for PM" icon={Users}>
                <div className="mt-2">
                  <p className="text-[11px] text-gray-700 leading-relaxed">{data.preparation_notes}</p>
                </div>
              </AccordionSection>

              <AccordionSection title="Key Achievements" icon={CheckCircle}>
                <div className="mt-2 space-y-1">
                  {data.key_achievements.map((a, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <CheckCircle className="w-2.5 h-2.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <p className="text-[11px] text-gray-700 leading-relaxed">{a}</p>
                    </div>
                  ))}
                </div>
              </AccordionSection>

              <AccordionSection title="Key Risks & Concerns" icon={AlertTriangle}>
                <div className="mt-2 space-y-1">
                  {data.key_risks.map((r, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <AlertTriangle className="w-2.5 h-2.5 text-amber-500 mt-0.5 flex-shrink-0" />
                      <p className="text-[11px] text-gray-700 leading-relaxed">{r}</p>
                    </div>
                  ))}
                </div>
              </AccordionSection>

              <AccordionSection title="EW Signal Breakdown" icon={Activity}>
                <div className="mt-2 space-y-1.5">
                  {Object.entries(data.ew_components).map(([key, val]) => (
                    <div key={key}>
                      <div className="flex items-center justify-between text-[10px] mb-0.5">
                        <span className="text-gray-600 capitalize">{key.replace(/_/g, ' ')}</span>
                        <span className={clsx('font-bold', ewScoreColor(val))}>{val}</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className={clsx('h-full rounded-full', ewBarColor(val))} style={{ width: `${val}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionSection>

              <AccordionSection title="Financial Detail" icon={BarChart2}>
                <div className="mt-2 space-y-1 text-[11px]">
                  <div className="flex justify-between"><span className="text-gray-500">Budget</span><span className="font-semibold">{fmt(data.budget)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Actuals</span><span className="font-semibold">{fmt(data.actuals)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Burn Rate</span><span className={clsx('font-semibold', data.burn_rate > data.completion_pct + 10 ? 'text-red-700' : '')}>{data.burn_rate}%</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Completion</span><span className="font-semibold">{data.completion_pct}%</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Remaining</span><span className="font-semibold">{fmt(data.budget - data.actuals)}</span></div>
                  {data.value_at_risk > 0 && (
                    <div className="flex justify-between pt-1 border-t border-gray-100">
                      <span className="text-red-600 font-medium">Value at Risk</span>
                      <span className="font-bold text-red-700">{fmt(data.value_at_risk)}</span>
                    </div>
                  )}
                </div>
              </AccordionSection>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
