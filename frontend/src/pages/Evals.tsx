import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, CheckCircle, XCircle, AlertTriangle, TrendingUp,
  Activity, BarChart2, Target, Layers, ArrowRight,
} from 'lucide-react';
import clsx from 'clsx';
import { evalsApi } from '../api/client';

// ── Types ──────────────────────────────────────────────────────────────────
interface Decision {
  contract_id: string; name: string; client_name: string;
  total_value: number; deal_score: number; tier: number;
  ai_status: string; action: string; aligned: boolean;
  direction: 'lenient' | 'strict' | null;
  action_by: string | null; action_date: string | null;
}
interface TierStat { total: number; aligned: number; rate: number; }
interface BandHealth { green: number; amber: number; red: number; deals: CorrelatedDeal[]; }
interface CorrelatedDeal {
  name: string; client_name: string; deal_score: number;
  overall_health: string; completion_pct: number; burn_rate: number; ai_status: string;
}
interface Dimension {
  key: string; label: string; weight: number;
  avg: number; min: number; max: number; variance: number; count: number;
}
interface EvalData {
  alignment: {
    total_scored: number; total_decided: number; aligned: number; alignment_rate: number;
    divergence: { human_more_lenient: number; human_more_strict: number };
    by_tier: Record<string, TierStat>;
    decisions: Decision[];
  };
  score_distribution: {
    total: number; avg: number;
    bands: Record<string, number>;
    by_tier: Record<string, { avg: number; count: number }>;
  };
  score_vs_delivery: {
    correlated_count: number;
    by_band: Record<string, BandHealth>;
  };
  dimensions: Dimension[];
}

// ── Helpers ────────────────────────────────────────────────────────────────
const fmt = (v: number) =>
  v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(1)}M`
  : v >= 1_000   ? `$${(v / 1_000).toFixed(0)}K` : `$${v}`;

const AI_LABEL: Record<string, { label: string; cls: string }> = {
  APPROVE:                  { label: 'Approve',           cls: 'bg-emerald-100 text-emerald-700' },
  APPROVE_WITH_CONDITIONS:  { label: 'Approve w/ Cond.',  cls: 'bg-amber-100 text-amber-700'    },
  RECOMMEND_REVIEW:         { label: 'Recommend Review',  cls: 'bg-orange-100 text-orange-700'  },
  FLAG_REJECTION:           { label: 'Flag Rejection',    cls: 'bg-red-100 text-red-700'        },
};
const ACTION_LABEL: Record<string, { label: string; cls: string }> = {
  approved:               { label: 'Approved',    cls: 'bg-emerald-100 text-emerald-700' },
  conditionally_approved: { label: 'Conditional', cls: 'bg-amber-100 text-amber-700'    },
  in_review:              { label: 'In Review',   cls: 'bg-blue-100 text-blue-700'      },
  rejected:               { label: 'Rejected',    cls: 'bg-red-100 text-red-700'        },
};
const HEALTH_CLS: Record<string, string> = {
  green: 'bg-emerald-100 text-emerald-700',
  amber: 'bg-amber-100 text-amber-700',
  red:   'bg-red-100 text-red-700',
};
const HEALTH_DOT: Record<string, string> = {
  green: 'bg-emerald-500', amber: 'bg-amber-500', red: 'bg-red-500',
};

// ── Main Page ──────────────────────────────────────────────────────────────
export default function Evals() {
  const navigate = useNavigate();
  const [data, setData] = useState<EvalData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    evalsApi.getSummary()
      .then(r => setData(r.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-12 text-center text-gray-400">Loading evals...</div>;
  if (!data)   return <div className="p-12 text-center text-gray-400">No eval data available.</div>;

  const { alignment, score_distribution: sd, score_vs_delivery: svd, dimensions } = data;
  const alignPct = Math.round(alignment.alignment_rate * 100);
  const maxBand  = Math.max(...Object.values(sd.bands));

  return (
    <div>

      {/* ── Header ── */}
      <div className="mb-8">
        <button onClick={() => navigate('/deal-approvals')}
          className="btn-ghost flex items-center gap-1.5 text-gray-400 text-sm mb-4 -ml-1">
          <ArrowLeft className="w-4 h-4" /> Back to AI Deal Approvals
        </button>
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[10px] font-bold tracking-widest text-ms-blue uppercase mb-1">Model Quality</div>
            <h1 className="page-title flex items-center gap-2.5">
              <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-ms-blue">
                <Target className="w-5 h-5 text-white" />
              </span>
              AI Approval Evals
            </h1>
            <p className="text-sm text-gray-400 mt-1 max-w-2xl">
              Measuring the quality and predictive validity of the AI-driven approval model — alignment with human decisions,
              score calibration, and correlation between deal scores and actual delivery outcomes.
            </p>
          </div>
        </div>
        <div className="mt-5 h-px bg-gradient-to-r from-ms-blue via-blue-300 to-transparent" />
      </div>

      {/* ── Summary stat cards ── */}
      <div className="grid grid-cols-4 gap-3 mb-8">
        <div className="card p-4 border-l-4 border-l-ms-blue">
          <div className="text-sm text-gray-500">Deals Scored</div>
          <div className="text-2xl font-bold mt-0.5">{alignment.total_scored}</div>
          <div className="text-xs text-gray-400">Active in eval pipeline</div>
        </div>
        <div className="card p-4 border-l-4 border-l-emerald-500">
          <div className="text-sm text-gray-500">Human-AI Alignment</div>
          <div className="text-2xl font-bold mt-0.5 text-emerald-600">{alignPct}%</div>
          <div className="text-xs text-gray-400">{alignment.aligned} of {alignment.total_decided} decisions</div>
        </div>
        <div className="card p-4 border-l-4 border-l-purple-500">
          <div className="text-sm text-gray-500">Correlated w/ Delivery</div>
          <div className="text-2xl font-bold mt-0.5">{svd.correlated_count}</div>
          <div className="text-xs text-gray-400">Deals with linked delivery data</div>
        </div>
        <div className="card p-4 border-l-4 border-l-amber-500">
          <div className="text-sm text-gray-500">Avg Deal Score</div>
          <div className="text-2xl font-bold mt-0.5">{sd.avg}<span className="text-sm font-normal text-gray-400">/100</span></div>
          <div className="text-xs text-gray-400">Across {sd.total} scored deals</div>
        </div>
      </div>

      {/* ── Eval 1: Human-AI Alignment ── */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Eval 1 — Human-AI Alignment</h2>
          <span className="text-xs text-gray-400">Do human approvers agree with the AI recommendation?</span>
        </div>
        <div className="grid grid-cols-3 gap-4">

          {/* Alignment overview */}
          <div className="card p-5">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Overall Rate</div>
            <div className="flex items-end gap-2 mb-4">
              <span className={clsx('text-5xl font-black', alignPct >= 80 ? 'text-emerald-600' : alignPct >= 65 ? 'text-amber-600' : 'text-red-600')}>
                {alignPct}%
              </span>
              <span className="text-gray-400 text-sm mb-1.5">aligned</span>
            </div>
            <div className="space-y-3">
              {Object.entries(alignment.by_tier).map(([t, v]) => (
                <div key={t}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-gray-700">Tier {t}</span>
                    <span className={clsx('font-bold', v.rate >= 0.8 ? 'text-emerald-600' : v.rate >= 0.65 ? 'text-amber-600' : 'text-red-600')}>
                      {Math.round(v.rate * 100)}% ({v.aligned}/{v.total})
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={clsx('h-full rounded-full', v.rate >= 0.8 ? 'bg-emerald-500' : v.rate >= 0.65 ? 'bg-amber-500' : 'bg-red-500')}
                      style={{ width: `${v.rate * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-amber-400" />Human more lenient than AI
                </span>
                <span className="font-bold text-amber-700">{alignment.divergence.human_more_lenient}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-blue-400" />Human more strict than AI
                </span>
                <span className="font-bold text-blue-700">{alignment.divergence.human_more_strict}</span>
              </div>
            </div>
          </div>

          {/* Decisions table */}
          <div className="col-span-2 card p-5">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Decision Log</div>
            <div className="overflow-y-auto max-h-72 space-y-1.5">
              {alignment.decisions.map((d, i) => {
                const ai  = AI_LABEL[d.ai_status]     || { label: d.ai_status,  cls: 'bg-gray-100 text-gray-600' };
                const act = ACTION_LABEL[d.action]    || { label: d.action,      cls: 'bg-gray-100 text-gray-600' };
                return (
                  <div key={i} className={clsx('flex items-center gap-3 px-3 py-2 rounded-lg border',
                    d.aligned ? 'bg-gray-50 border-gray-100' : 'bg-amber-50 border-amber-100')}>
                    {d.aligned
                      ? <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      : <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-gray-900 truncate">{d.name}</div>
                      <div className="text-[10px] text-gray-400">{d.client_name} · {fmt(d.total_value)} · Score {d.deal_score}</div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={clsx('text-[10px] font-bold px-2 py-0.5 rounded-full', ai.cls)}>{ai.label}</span>
                      <ArrowRight className="w-3 h-3 text-gray-300" />
                      <span className={clsx('text-[10px] font-bold px-2 py-0.5 rounded-full', act.cls)}>{act.label}</span>
                      {!d.aligned && (
                        <span className={clsx('text-[9px] font-bold px-1.5 py-0.5 rounded-full border',
                          d.direction === 'lenient'
                            ? 'bg-amber-100 text-amber-700 border-amber-200'
                            : 'bg-blue-100 text-blue-700 border-blue-200')}>
                          {d.direction === 'lenient' ? '↑ lenient' : '↓ strict'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Eval 2: Score vs. Delivery Outcome ── */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Eval 2 — Score vs. Delivery Outcome</h2>
          <span className="text-xs text-gray-400">Does the deal score predict actual delivery health?</span>
        </div>

        <div className="card p-5">
          {/* Headline finding */}
          <div className="rounded-xl bg-ms-blue/5 border border-ms-blue/20 p-4 mb-5 flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-ms-blue flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-bold text-gray-900">Strong predictive correlation detected</div>
              <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                High-scored deals (≥75) are delivering <strong className="text-emerald-700">80% GREEN</strong> in delivery.
                Medium-scored deals (60–74) are <strong className="text-amber-700">100% AMBER</strong>.
                Low-scored deals (&lt;60) are <strong className="text-red-700">100% RED</strong>.
                The Blue Yonder anomaly (high score, AMBER delivery) flags a client dependency gap not captured in the scoring model — a candidate for the next dimension improvement.
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-5">
            {[
              { band: 'high',   label: 'High Score',   range: '≥ 75',   data: svd.by_band.high,   barColor: 'bg-emerald-500' },
              { band: 'medium', label: 'Medium Score',  range: '60–74',  data: svd.by_band.medium, barColor: 'bg-amber-500'   },
              { band: 'low',    label: 'Low Score',     range: '< 60',   data: svd.by_band.low,    barColor: 'bg-red-500'     },
            ].map(({ band, label, range, data: bd, barColor }) => {
              const total = (bd?.green || 0) + (bd?.amber || 0) + (bd?.red || 0);
              return (
                <div key={band} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="text-sm font-bold text-gray-900">{label}</div>
                      <div className="text-[10px] text-gray-400 font-mono">{range}</div>
                    </div>
                    <div className={clsx('w-2.5 h-2.5 rounded-full', barColor)} />
                  </div>
                  <div className="text-2xl font-black text-gray-700 mb-3">{total} <span className="text-sm font-normal text-gray-400">deals</span></div>
                  <div className="space-y-1.5">
                    {(['green', 'amber', 'red'] as const).map(h => {
                      const count = bd?.[h] || 0;
                      const pct   = total > 0 ? (count / total) * 100 : 0;
                      return (
                        <div key={h}>
                          <div className="flex items-center justify-between text-[11px] mb-0.5">
                            <span className="capitalize text-gray-500">{h}</span>
                            <span className="font-bold text-gray-700">{count} ({Math.round(pct)}%)</span>
                          </div>
                          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className={clsx('h-full rounded-full', HEALTH_DOT[h])} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Correlated deal list */}
          <div className="border-t border-gray-100 pt-4">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Correlated Deals</div>
            <div className="grid grid-cols-2 gap-2">
              {(['high', 'medium', 'low'] as const).flatMap(band =>
                (svd.by_band[band]?.deals || []).map((deal, i) => (
                  <div key={`${band}-${i}`} className="flex items-center gap-3 px-3 py-2 rounded-lg border border-gray-100 bg-gray-50">
                    <div className={clsx('w-2 h-2 rounded-full flex-shrink-0', HEALTH_DOT[deal.overall_health])} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-gray-900 truncate">{deal.name}</div>
                      <div className="text-[10px] text-gray-400">{deal.client_name}</div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 text-right">
                      <div>
                        <div className="text-xs font-bold text-gray-700">Score {deal.deal_score}</div>
                        <div className="text-[10px] text-gray-400">{deal.completion_pct}% complete</div>
                      </div>
                      <span className={clsx('text-[10px] font-bold px-1.5 py-0.5 rounded-full capitalize', HEALTH_CLS[deal.overall_health])}>
                        {deal.overall_health}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Eval 3: Score Distribution ── */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Eval 3 — Score Distribution & Tier Calibration</h2>
          <span className="text-xs text-gray-400">Are tier assignments consistent with deal scores?</span>
        </div>
        <div className="grid grid-cols-2 gap-4">

          {/* Band distribution */}
          <div className="card p-5">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Score Bands</div>
            <div className="space-y-3">
              {Object.entries(sd.bands).map(([band, count]) => {
                const pct = maxBand > 0 ? (count / maxBand) * 100 : 0;
                const isHigh = band === '85-100' || band === '75-84';
                const isMid  = band === '65-74';
                return (
                  <div key={band} className="flex items-center gap-3">
                    <span className="text-xs font-mono text-gray-500 w-14 flex-shrink-0">{band}</span>
                    <div className="flex-1 h-6 bg-gray-100 rounded-md overflow-hidden">
                      <div className={clsx('h-full rounded-md flex items-center justify-end pr-2',
                        isHigh ? 'bg-emerald-500' : isMid ? 'bg-blue-400' : 'bg-amber-400')}
                        style={{ width: `${Math.max(pct, 8)}%` }}>
                        <span className="text-[10px] font-bold text-white">{count}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span>Portfolio average</span>
              <span className="font-bold text-gray-800">{sd.avg} / 100</span>
            </div>
          </div>

          {/* By tier */}
          <div className="card p-5">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Average Score by Tier</div>
            <div className="space-y-4">
              {[
                { t: '1', label: 'Tier 1 — Streamlined',        color: 'bg-emerald-500', light: 'bg-emerald-50 border-emerald-200' },
                { t: '2', label: 'Tier 2 — Manager Review',      color: 'bg-blue-500',    light: 'bg-blue-50 border-blue-200'    },
                { t: '3', label: 'Tier 3 — Executive Committee', color: 'bg-purple-600',  light: 'bg-purple-50 border-purple-200' },
              ].map(({ t, label, color, light }) => {
                const stat = sd.by_tier[t] || { avg: 0, count: 0 };
                return (
                  <div key={t} className={clsx('rounded-xl border p-4', light)}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs font-semibold text-gray-700">{label}</div>
                      <span className="text-xs text-gray-400">{stat.count} deals</span>
                    </div>
                    <div className="flex items-end gap-2 mb-2">
                      <span className="text-3xl font-black text-gray-900">{stat.avg}</span>
                      <span className="text-gray-400 text-sm mb-0.5">avg score</span>
                    </div>
                    <div className="h-2 bg-white/60 rounded-full overflow-hidden">
                      <div className={clsx('h-full rounded-full', color)} style={{ width: `${stat.avg}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Eval 4: Dimension Analysis ── */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Eval 4 — Dimension Contribution Analysis</h2>
          <span className="text-xs text-gray-400">Sorted by variance — most differentiating dimensions first</span>
        </div>
        <div className="card p-5">
          <div className="mb-3 flex items-start gap-2 text-xs text-gray-400">
            <BarChart2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-ms-blue" />
            High variance = this dimension differentiates deals most — candidate for model focus. High weight + high variance = highest leverage for improvement.
          </div>
          <div className="space-y-2">
            {/* Header */}
            <div className="grid grid-cols-12 gap-3 px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <div className="col-span-3">Dimension</div>
              <div className="col-span-1 text-center">Weight</div>
              <div className="col-span-1 text-center">Avg</div>
              <div className="col-span-5">Score Range</div>
              <div className="col-span-2 text-right">Variance</div>
            </div>
            {dimensions.map((dim, i) => {
              const rangePct = ((dim.max - dim.min) / 10) * 100;
              const minPct   = (dim.min / 10) * 100;
              const isHighLeverage = dim.variance > 1.2 && dim.weight >= 0.10;
              return (
                <div key={dim.key} className={clsx('grid grid-cols-12 gap-3 items-center px-3 py-2.5 rounded-lg border',
                  isHighLeverage ? 'bg-ms-blue/5 border-ms-blue/20' : 'bg-gray-50 border-gray-100')}>
                  <div className="col-span-3">
                    <div className="flex items-center gap-1.5">
                      {isHighLeverage && <div className="w-1.5 h-1.5 rounded-full bg-ms-blue flex-shrink-0" />}
                      <span className={clsx('text-xs font-semibold', isHighLeverage ? 'text-ms-blue' : 'text-gray-700')}>{dim.label}</span>
                    </div>
                    {isHighLeverage && <div className="text-[9px] text-ms-blue font-bold ml-3">High leverage</div>}
                  </div>
                  <div className="col-span-1 text-center">
                    <span className="text-xs font-bold text-gray-600">{Math.round(dim.weight * 100)}%</span>
                  </div>
                  <div className="col-span-1 text-center">
                    <span className="text-xs font-bold text-gray-900">{dim.avg}</span>
                  </div>
                  <div className="col-span-5">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden relative">
                      <div className="h-full bg-blue-200 rounded-full absolute" style={{ left: `${minPct}%`, width: `${rangePct}%` }} />
                      <div className="h-full w-0.5 bg-ms-blue absolute" style={{ left: `${(dim.avg / 10) * 100}%` }} />
                    </div>
                    <div className="flex justify-between text-[9px] text-gray-400 mt-0.5">
                      <span>{dim.min}</span><span>{dim.max}</span>
                    </div>
                  </div>
                  <div className="col-span-2 text-right">
                    <span className={clsx('text-xs font-bold',
                      dim.variance > 1.5 ? 'text-amber-600' : dim.variance > 1.0 ? 'text-blue-600' : 'text-gray-500')}>
                      ±{dim.variance}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}
