import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Bot, TrendingUp, Zap, Activity, BarChart2,
  Clock, DollarSign, CheckCircle, AlertTriangle, Target,
} from 'lucide-react';
import clsx from 'clsx';
import { aclmApi } from '../api/client';

// ── Constants ──────────────────────────────────────────────────────────────
const BASELINE_TX         = 70_000;
const BASELINE_HRS_PER_TX = 4;
const BASELINE_CYCLE_DAYS = 18;
const AI_HRS_PER_TX       = 1.5;
const AI_CYCLE_DAYS       = 5;

const SCENARIOS = [
  { label: 'Conservative', target: 63_000, tag: '-10%', recommended: false },
  { label: 'Target',       target: 55_000, tag: '-21%', recommended: true  },
  { label: 'Aspirational', target: 50_000, tag: '-29%', recommended: false },
];

const BVT_LOG = [
  { feature: 'Autonomous Tier 1 Routing',   period: 'Q1 2026', detail: '4,200 low-risk deals auto-cleared without manual touch',                metric: 'Cycle time −2.3 days', tag: 'Time'           },
  { feature: 'Playbook Clause Enforcement', period: 'Q1 2026', detail: '340 deviation flags auto-surfaced before human sign-off',               metric: 'Rework rate −6pp',     tag: 'Quality'        },
  { feature: 'Deal Intelligence Score',     period: 'Q2 2026', detail: '91% AI-human decision alignment across 800 scored deals',               metric: 'Accuracy +14pp',       tag: 'Accuracy'       },
  { feature: 'Regional Rule Engine (EMEA)', period: 'Q2 2026', detail: '1,100 EMEA transactions cleared without escalation',                    metric: 'Tx eliminated: 1,100', tag: 'Simplification' },
];

const TAG_COLORS: Record<string, string> = {
  Time:           'bg-blue-100 text-blue-700',
  Quality:        'bg-emerald-100 text-emerald-700',
  Accuracy:       'bg-purple-100 text-purple-700',
  Simplification: 'bg-amber-100 text-amber-700',
};

const PIPELINE_SIGNALS = [
  '14 deals approaching approval funnel this week',
  '3 deals flagged as Tier 3 complexity',
  '$8.4M aggregate deal value entering Deal Shaping',
];

const DELIVERY_SIGNALS = [
  '7 active projects feeding live delivery metrics',
  '1 project AMBER — approval conditions partially met',
  'Avg delivery health: 81/100 across approved deals',
];

const fmt = (v: number) =>
  v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(1)}M`
  : v >= 1_000   ? `$${(v / 1_000).toFixed(0)}K`
  : `$${v}`;

const fmtN = (v: number) =>
  v >= 1_000 ? `${(v / 1_000).toFixed(0)}K` : `${v}`;

// ── Main Page ──────────────────────────────────────────────────────────────
export default function ACLMCockpit() {
  const navigate    = useNavigate();
  const [costPerTx, setCostPerTx] = useState(180);

  // Live multi-agent signals from the A-CLM backend (closed loop over pipeline +
  // delivery). The hardcoded arrays remain as fallback copy until the fetch lands.
  const [pipelineSignals, setPipelineSignals] = useState<string[]>(PIPELINE_SIGNALS);
  const [deliverySignals, setDeliverySignals] = useState<string[]>(DELIVERY_SIGNALS);
  const [signalsLive, setSignalsLive] = useState(false);

  useEffect(() => {
    aclmApi.getAgentSignals()
      .then(({ data }) => {
        if (Array.isArray(data?.pipeline_agent)) setPipelineSignals(data.pipeline_agent);
        if (Array.isArray(data?.delivery_agent)) setDeliverySignals(data.delivery_agent);
        setSignalsLive(true);
      })
      .catch(() => { /* keep fallback copy */ });
  }, []);

  const baselineCost  = BASELINE_TX * costPerTx;
  const baselineHours = BASELINE_TX * BASELINE_HRS_PER_TX;
  const savedCost     = (tx: number) => (BASELINE_TX - tx) * costPerTx;
  const savedHours    = (tx: number) => baselineHours - tx * AI_HRS_PER_TX;

  return (
    <div>

      {/* ── Page Header ── */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/aclm')}
          className="btn-ghost flex items-center gap-1.5 text-gray-400 text-sm mb-4 -ml-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to A-CLM
        </button>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold tracking-widest text-ms-blue uppercase">A-CLM · Central Hub</span>
            </div>
            <h1 className="page-title flex items-center gap-2.5">
              <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-ms-blue">
                <Bot className="w-5 h-5 text-white" />
              </span>
              Business Value Cockpit
            </h1>
            <p className="text-sm text-gray-400 mt-1 max-w-2xl">
              AI-driven improvement gains against the baseline of 70,000 annual approval transactions.
              Adjust cost per transaction to size the business value for your audience.
            </p>
          </div>

          {/* Cost-per-transaction input */}
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 mt-1">
            <DollarSign className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <span className="text-xs text-gray-500 whitespace-nowrap">Cost / transaction</span>
            <input
              type="number"
              min={50} max={2000} step={10}
              value={costPerTx}
              onChange={e => setCostPerTx(Math.max(50, Number(e.target.value)))}
              className="w-20 text-sm font-bold text-gray-900 bg-transparent border-none outline-none text-right"
            />
          </div>
        </div>

        <div className="mt-5 h-px bg-gradient-to-r from-ms-blue via-blue-300 to-transparent" />
      </div>

      {/* ── Baseline Anchor ── */}
      <div className="rounded-xl bg-gray-900 text-white p-5 mb-4">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">Hard Baseline — As-Is Today</div>
            <div className="flex items-end gap-3">
              <span className="text-5xl font-black tracking-tight">70,000</span>
              <span className="text-gray-400 text-sm mb-1.5">approval transactions / year</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">Manual process · Application workflow routing · Email-based handoffs · Multi-week deal cycles</div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-white/5 rounded-lg px-4 py-3">
              <div className="text-[10px] text-gray-400 uppercase tracking-wide mb-1 flex items-center justify-center gap-1">
                <Clock className="w-3 h-3" /> Avg Cycle
              </div>
              <div className="text-2xl font-bold">{BASELINE_CYCLE_DAYS}<span className="text-sm font-normal text-gray-400"> days</span></div>
            </div>
            <div className="bg-white/5 rounded-lg px-4 py-3">
              <div className="text-[10px] text-gray-400 uppercase tracking-wide mb-1 flex items-center justify-center gap-1">
                <Activity className="w-3 h-3" /> Man-Hours
              </div>
              <div className="text-2xl font-bold">{fmtN(baselineHours)}<span className="text-sm font-normal text-gray-400"> /yr</span></div>
            </div>
            <div className="bg-white/5 rounded-lg px-4 py-3">
              <div className="text-[10px] text-gray-400 uppercase tracking-wide mb-1 flex items-center justify-center gap-1">
                <DollarSign className="w-3 h-3" /> Annual Cost
              </div>
              <div className="text-2xl font-bold">{fmt(baselineCost)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Two Levers ── */}
      <div className="grid grid-cols-2 gap-4 mb-4">

        {/* Lever 1: Simplification */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-md bg-amber-100 flex items-center justify-center flex-shrink-0">
              <Target className="w-3.5 h-3.5 text-amber-700" />
            </div>
            <span className="text-sm font-bold text-gray-900">Lever 1 — Simplification</span>
          </div>
          <p className="text-xs text-gray-400 mb-4 ml-8">Eliminate transactions that should not exist — redundant steps, low-value handoffs, unnecessary escalations</p>
          <div className="space-y-3">
            {SCENARIOS.map(s => {
              const eliminated = BASELINE_TX - s.target;
              const barWidth   = (s.target / BASELINE_TX) * 100;
              return (
                <div key={s.label} className={clsx('rounded-lg border p-3', s.recommended ? 'border-ms-blue/40 bg-ms-blue/5' : 'border-gray-100 bg-gray-50')}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-900">{s.label}</span>
                      <span className={clsx('text-[10px] font-bold px-1.5 py-0.5 rounded-full', s.recommended ? 'bg-ms-blue text-white' : 'bg-gray-200 text-gray-600')}>{s.tag}</span>
                      {s.recommended && <span className="text-[10px] text-ms-blue font-semibold">Recommended</span>}
                    </div>
                    <span className="text-xs font-bold text-gray-700">{fmtN(s.target)} tx</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                    <div className={clsx('h-full rounded-full', s.recommended ? 'bg-ms-blue' : 'bg-gray-400')} style={{ width: `${barWidth}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-gray-500">
                    <span>{fmtN(eliminated)} transactions eliminated</span>
                    <span className="font-semibold text-emerald-700">{fmt(savedCost(s.target))} saved · {fmtN(savedHours(s.target))} hrs freed</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lever 2: Acceleration */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Zap className="w-3.5 h-3.5 text-blue-700" />
            </div>
            <span className="text-sm font-bold text-gray-900">Lever 2 — Acceleration</span>
          </div>
          <p className="text-xs text-gray-400 mb-4 ml-8">Speed remaining transactions through AI routing, playbook enforcement, and Deal Intelligence Scoring</p>
          <div className="space-y-3">
            {[
              {
                label: 'Avg Deal Cycle',
                baseline: `${BASELINE_CYCLE_DAYS} days`, ai: `${AI_CYCLE_DAYS} days`,
                improvement: `${Math.round((1 - AI_CYCLE_DAYS / BASELINE_CYCLE_DAYS) * 100)}% faster`,
                aiPct: (AI_CYCLE_DAYS / BASELINE_CYCLE_DAYS) * 100,
                icon: Clock,
              },
              {
                label: 'Man-Hours / Transaction',
                baseline: `${BASELINE_HRS_PER_TX}h`, ai: `${AI_HRS_PER_TX}h`,
                improvement: `${Math.round((1 - AI_HRS_PER_TX / BASELINE_HRS_PER_TX) * 100)}% reduction`,
                aiPct: (AI_HRS_PER_TX / BASELINE_HRS_PER_TX) * 100,
                icon: Activity,
              },
              {
                label: 'Annual Man-Hours (Target)',
                baseline: fmtN(baselineHours), ai: fmtN(Math.round(55_000 * AI_HRS_PER_TX)),
                improvement: `${Math.round((1 - (55_000 * AI_HRS_PER_TX) / baselineHours) * 100)}% reduction`,
                aiPct: ((55_000 * AI_HRS_PER_TX) / baselineHours) * 100,
                icon: BarChart2,
              },
            ].map(row => {
              const Icon = row.icon;
              return (
                <div key={row.label} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-xs font-semibold text-gray-700">{row.label}</span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700">{row.improvement}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-400 w-12 flex-shrink-0">Before</span>
                      <div className="flex-1 h-1.5 bg-red-200 rounded-full" />
                      <span className="text-[11px] font-bold text-gray-700 w-10 text-right">{row.baseline}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-400 w-12 flex-shrink-0">AI</span>
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${row.aiPct}%` }} />
                      </div>
                      <span className="text-[11px] font-bold text-emerald-700 w-10 text-right">{row.ai}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Value Scorecard ── */}
      <div className="card p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-900">Value Scorecard</h3>
          <span className="text-xs text-gray-400">5 dimensions · Baseline vs. AI-driven model</span>
        </div>
        <div className="space-y-3">
          {[
            { label: 'Deal Cycle Time',           baseline: '18 days',  ai: '5 days', pct: 72, unit: '% faster',      color: 'bg-blue-500'   },
            { label: 'Man-Hours / Transaction',   baseline: '4h',       ai: '1.5h',   pct: 63, unit: '% reduction',   color: 'bg-indigo-500' },
            { label: 'Contract Rework Rate',      baseline: '23%',      ai: '8%',     pct: 65, unit: '% improvement', color: 'bg-emerald-500'},
            { label: 'Compliance Exception Rate', baseline: '15%',      ai: '3%',     pct: 80, unit: '% improvement', color: 'bg-purple-500' },
            { label: 'Approval Accuracy',         baseline: 'Variable', ai: '94%',    pct: 94, unit: 'AI alignment',  color: 'bg-amber-500'  },
          ].map(row => (
            <div key={row.label} className="grid grid-cols-12 items-center gap-3">
              <div className="col-span-3 text-xs font-medium text-gray-700">{row.label}</div>
              <div className="col-span-2 text-xs text-gray-400 text-right">{row.baseline}</div>
              <div className="col-span-4">
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={clsx('h-full rounded-full', row.color)} style={{ width: `${row.pct}%` }} />
                </div>
              </div>
              <div className="col-span-1 text-xs font-bold text-emerald-700 text-center">{row.ai}</div>
              <div className="col-span-2 text-right">
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-full border border-emerald-200">
                  {row.pct}{row.unit}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── BVT Log + Agent Signals ── */}
      <div className="grid grid-cols-3 gap-4">

        {/* BVT Log */}
        <div className="col-span-2 card p-5">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-gray-900">Business Value Testing (BVT) Log</h3>
            <p className="text-xs text-gray-400">Measured impact of each A-CLM improvement introduced</p>
          </div>
          <div className="space-y-2">
            {BVT_LOG.map(entry => (
              <div key={entry.feature} className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50">
                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-gray-900">{entry.feature}</span>
                    <span className={clsx('text-[10px] font-bold px-1.5 py-0.5 rounded-full', TAG_COLORS[entry.tag])}>{entry.tag}</span>
                    <span className="text-[10px] text-gray-400">{entry.period}</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{entry.detail}</p>
                </div>
                <div className="text-[11px] font-bold text-emerald-700 whitespace-nowrap flex-shrink-0 text-right">{entry.metric}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-1.5 text-xs text-gray-400">
            <AlertTriangle className="w-3 h-3 text-amber-400 flex-shrink-0" />
            BVT validates that each feature delivers real gain — not just displacement of work. Automation of low-value processes is avoided.
          </div>
        </div>

        {/* Agent Signals */}
        <div className="space-y-4">
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-3.5 h-3.5 text-amber-700" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-amber-900">Pipeline Agent</div>
                <div className="text-[10px] text-amber-600 font-semibold uppercase tracking-wide">Signals ahead</div>
              </div>
              {signalsLive && (
                <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-700 uppercase tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
                </span>
              )}
            </div>
            <div className="space-y-2">
              {pipelineSignals.map(s => (
                <div key={s} className="flex items-start gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                  <span className="text-[11px] text-amber-800 leading-relaxed">{s}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <Activity className="w-3.5 h-3.5 text-emerald-700" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-emerald-900">Delivery Agent</div>
                <div className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wide">Feeds back</div>
              </div>
              {signalsLive && (
                <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-700 uppercase tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
                </span>
              )}
            </div>
            <div className="space-y-2">
              {deliverySignals.map(s => (
                <div key={s} className="flex items-start gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                  <span className="text-[11px] text-emerald-800 leading-relaxed">{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
