import { useEffect, useState } from 'react';
import {
  Zap, UserCheck, Shield, CheckCircle, AlertTriangle, XCircle,
  Search, RefreshCw, ChevronDown, ChevronUp, Bot, TrendingUp,
  Target, Clock, BarChart2, ArrowRight,
} from 'lucide-react';
import clsx from 'clsx';
import { dealApprovalsApi } from '../api/client';

// ── Types ──────────────────────────────────────────────────────────────────
interface ScoreDimension { 0: string; 1: string; 2: string; }
interface Deal {
  id: string; contract_number: string; name: string; client_name: string;
  total_value: number; status: string; scope_summary: string; created_at: string;
  service_lines: Array<{ service_name: string; category: string; quantity: number; unit: string; total: number }>;
  profile: {
    strategy_pillars: string[]; internal_investment_pct: number; sold_margin_pct: number;
    solution_complexity: string; vendor_name?: string; vendor_participation_pct: number;
    similar_projects_count: number; delivery_success_rate: number; reference_projects: string[];
    playbook_available: boolean; sow_template_used: boolean; ip_leverage_score: number;
    regulatory_requirements: string[]; compliance_risk: string;
    azure_consumption_monthly: number; azure_acr_percentage: number;
    expansion_type: string; is_delivery_led: boolean;
    score_breakdown: Record<string, number>; deal_score: number; approval_tier: number;
    ai_recommendation_status: string; ai_recommendation_text: string; ai_conditions: string[];
    action_taken?: string; action_by?: string; action_notes?: string; action_date?: string;
  };
  score_dimensions: Array<[string, string, string]>;
}
interface KR { id: string; label: string; unit: string; current: number; target: number; direction: string; description: string; }
interface OKRConfig { objective: string; krs: KR[]; kpis: Array<{ label: string; value: string; target: string }>; tiers: Array<{ tier: number; label: string; criteria: string[]; sla: string; approver: string; color: string; icon: string; description: string }>; }

// ── Config ─────────────────────────────────────────────────────────────────
const AI_STATUS_CFG: Record<string, { label: string; bg: string; text: string; border: string; Icon: typeof CheckCircle }> = {
  APPROVE:                  { label: 'AI: Approved',             bg: 'bg-green-50',   text: 'text-green-700',   border: 'border-green-200', Icon: CheckCircle },
  APPROVE_WITH_CONDITIONS:  { label: 'AI: Approve w/ Conditions', bg: 'bg-amber-50',  text: 'text-amber-700',   border: 'border-amber-200', Icon: AlertTriangle },
  RECOMMEND_REVIEW:         { label: 'AI: Recommend Review',      bg: 'bg-orange-50', text: 'text-orange-700',  border: 'border-orange-200', Icon: Search },
  FLAG_REJECTION:           { label: 'AI: Flag for Rejection',    bg: 'bg-red-50',    text: 'text-red-700',     border: 'border-red-200',   Icon: XCircle },
};

const TIER_CFG: Record<number, { label: string; bg: string; text: string; ring: string; TierIcon: typeof Zap }> = {
  1: { label: 'Tier 1 — Streamlined',        bg: 'bg-emerald-500', text: 'text-white', ring: 'ring-emerald-200', TierIcon: Zap },
  2: { label: 'Tier 2 — Manager Review',      bg: 'bg-blue-600',   text: 'text-white', ring: 'ring-blue-200',    TierIcon: UserCheck },
  3: { label: 'Tier 3 — Executive Committee', bg: 'bg-purple-700', text: 'text-white', ring: 'ring-purple-200',  TierIcon: Shield },
};

const SCORE_COLOR = (s: number) =>
  s >= 8.5 ? 'bg-emerald-500' : s >= 7.0 ? 'bg-blue-500' : s >= 5.5 ? 'bg-amber-500' : 'bg-red-500';

const ACTION_CFG: Record<string, { label: string; bg: string }> = {
  approved:               { label: 'Approved',      bg: 'bg-green-100 text-green-700' },
  conditionally_approved: { label: 'Conditional',   bg: 'bg-amber-100 text-amber-700' },
  in_review:              { label: 'In Review',      bg: 'bg-blue-100 text-blue-700' },
  rejected:               { label: 'Rejected',       bg: 'bg-red-100 text-red-700' },
};

const fmt = (v: number) =>
  v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(2)}M` : v >= 1_000 ? `$${(v / 1_000).toFixed(0)}K` : `$${v}`;

const fmtPct = (current: number, target: number, dir: string) => {
  const pct = dir === 'higher'
    ? Math.min(100, (current / target) * 100)
    : Math.min(100, ((2 * target - current) / target) * 100);
  return Math.max(0, pct);
};

// ── OKR Panel ──────────────────────────────────────────────────────────────
function OKRPanel({ config }: { config: OKRConfig }) {
  return (
    <div className="card p-5 mb-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Objective</div>
          <h2 className="text-base font-bold text-gray-900">{config.objective}</h2>
        </div>
        <div className="flex gap-3">
          {config.kpis.map(kpi => (
            <div key={kpi.label} className="text-center bg-gray-50 rounded-lg px-3 py-2 min-w-[90px]">
              <div className="text-xs font-bold text-gray-900">{kpi.value}</div>
              <div className="text-[10px] text-gray-500">{kpi.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {config.krs.map((kr, i) => {
          const pct = fmtPct(kr.current, kr.target, kr.direction);
          const onTrack = pct >= 70;
          return (
            <div key={kr.id} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-600 truncate">{kr.label}</span>
                <span className={clsx('text-xs font-bold', onTrack ? 'text-green-700' : 'text-amber-600')}>
                  {kr.current}{kr.unit} → {kr.target}{kr.unit}
                </span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={clsx('h-full rounded-full transition-all', onTrack ? 'bg-green-500' : 'bg-amber-500')}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="text-[10px] text-gray-400">{kr.description}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Tier Workflow ──────────────────────────────────────────────────────────
function TierWorkflow({ tiers, deals }: { tiers: OKRConfig['tiers']; deals: Deal[] }) {
  const countsByTier = deals.reduce<Record<number, number>>((acc, d) => {
    acc[d.profile.approval_tier] = (acc[d.profile.approval_tier] || 0) + 1; return acc;
  }, {});

  const COLORS = { green: { bg: 'bg-emerald-500', light: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' }, blue: { bg: 'bg-blue-600', light: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' }, purple: { bg: 'bg-purple-700', light: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700' } };

  return (
    <div className="card p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title">Tiered Approval Workflow</h2>
        <span className="text-xs text-gray-400">Policy-led · AI-validated · Audit-tracked</span>
      </div>
      <div className="flex items-stretch gap-0 relative">
        {tiers.map((tier, i) => {
          const c = COLORS[tier.color as keyof typeof COLORS];
          const TierIcon = i === 0 ? Zap : i === 1 ? UserCheck : Shield;
          const count = countsByTier[tier.tier] || 0;
          return (
            <div key={tier.tier} className="flex-1 flex items-stretch">
              <div className={clsx('flex-1 rounded-xl border p-4', c.light, c.border)}>
                <div className="flex items-center justify-between mb-3">
                  <div className={clsx('flex items-center gap-2 px-2.5 py-1 rounded-full text-white text-xs font-bold', c.bg)}>
                    <TierIcon className="w-3 h-3" />
                    Tier {tier.tier}
                  </div>
                  {count > 0 && <span className={clsx('text-xs font-bold px-2 py-0.5 rounded-full', c.light, c.text, 'border', c.border)}>{count} deal{count > 1 ? 's' : ''}</span>}
                </div>
                <div className="font-semibold text-gray-900 text-sm mb-1">{tier.label}</div>
                <div className="text-xs text-gray-500 mb-3 leading-relaxed">{tier.description}</div>
                <div className="space-y-1 mb-3">
                  {tier.criteria.map((c2, j) => (
                    <div key={j} className="flex items-center gap-1.5 text-xs text-gray-600">
                      <div className="w-1 h-1 rounded-full bg-gray-400 flex-shrink-0" />
                      {c2}
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 pt-2 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="font-medium">SLA:</span> <span className="text-gray-600">{tier.sla}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <UserCheck className="w-3 h-3 text-gray-400" />
                    <span className="font-medium">Approver:</span> <span className="text-gray-600">{tier.approver}</span>
                  </div>
                </div>
              </div>
              {i < tiers.length - 1 && (
                <div className="flex items-center px-1">
                  <ArrowRight className="w-4 h-4 text-gray-300" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Score Bar Row ──────────────────────────────────────────────────────────
function ScoreBar({ label, description, score }: { label: string; description: string; score: number }) {
  const pct = (score / 10) * 100;
  const colorCls = SCORE_COLOR(score);
  return (
    <div className="group">
      <div className="flex items-center gap-3 py-1.5">
        <div className="w-36 text-xs text-gray-600 font-medium flex-shrink-0 truncate" title={description}>{label}</div>
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className={clsx('h-full rounded-full transition-all', colorCls)} style={{ width: `${pct}%` }} />
        </div>
        <div className="w-10 text-right">
          <span className={clsx('text-xs font-bold', score >= 8.5 ? 'text-emerald-700' : score >= 7.0 ? 'text-blue-700' : score >= 5.5 ? 'text-amber-700' : 'text-red-700')}>
            {score.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Deal Tile ──────────────────────────────────────────────────────────────
function DealTile({ deal, onActionTaken }: { deal: Deal; onActionTaken: (id: string, updated: Deal) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [actionBy, setActionBy] = useState('');
  const [actionNotes, setActionNotes] = useState('');
  const [showActionForm, setShowActionForm] = useState(false);
  const [pendingAction, setPendingAction] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  const p = deal.profile;
  const tierCfg = TIER_CFG[p.approval_tier];
  const aiCfg = AI_STATUS_CFG[p.ai_recommendation_status] || AI_STATUS_CFG.RECOMMEND_REVIEW;
  const AICfgIcon = aiCfg.Icon;
  const TierIcon = tierCfg.TierIcon;

  const score = p.deal_score;
  const scoreColor = score >= 80 ? 'text-emerald-700' : score >= 65 ? 'text-blue-700' : score >= 50 ? 'text-amber-700' : 'text-red-700';
  const scoreBg = score >= 80 ? 'bg-emerald-50 border-emerald-200' : score >= 65 ? 'bg-blue-50 border-blue-200' : score >= 50 ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200';

  const handleAction = async (action: string) => {
    if (!actionBy.trim()) return;
    setSubmitting(true);
    try {
      const r = await dealApprovalsApi.takeAction(deal.id, { action, action_by: actionBy, action_notes: actionNotes });
      onActionTaken(deal.id, r.data);
      setShowActionForm(false);
    } finally { setSubmitting(false); }
  };

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      const r = await dealApprovalsApi.regenerateAI(deal.id);
      onActionTaken(deal.id, r.data);
    } finally { setRegenerating(false); }
  };

  const actionTaken = p.action_taken;
  const actionCfg = actionTaken ? ACTION_CFG[actionTaken] : null;

  return (
    <div className={clsx('card overflow-hidden transition-shadow hover:shadow-lg border-t-4',
      p.approval_tier === 1 ? 'border-t-emerald-500' :
      p.approval_tier === 2 ? 'border-t-blue-600' : 'border-t-purple-700'
    )}>
      {/* ── Header ── */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={clsx('inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold', tierCfg.bg, tierCfg.text)}>
                <TierIcon className="w-3 h-3" /> Tier {p.approval_tier}
              </span>
              {actionCfg && <span className={clsx('text-xs font-medium px-2 py-0.5 rounded-full', actionCfg.bg)}>{actionCfg.label}</span>}
              {p.expansion_type === 'new_logo' && <span className="badge-green">New Logo</span>}
              {p.vendor_participation_pct > 0 && <span className="badge-gray">{p.vendor_name} {p.vendor_participation_pct}%</span>}
            </div>
            <h3 className="font-bold text-gray-900 text-sm leading-snug truncate">{deal.name}</h3>
            <div className="text-xs text-gray-500 mt-0.5">{deal.client_name} · {deal.contract_number}</div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-xl font-bold text-gray-900">{fmt(deal.total_value)}</div>
            <div className="text-xs text-gray-400">{p.sold_margin_pct}% margin</div>
          </div>
        </div>

        {/* Quick stats row */}
        <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap mb-3">
          {p.azure_consumption_monthly > 0 && (
            <span className="flex items-center gap-1 text-blue-600 font-medium">
              <BarChart2 className="w-3 h-3" /> {fmt(p.azure_consumption_monthly)}/mo ACR
            </span>
          )}
          {p.regulatory_requirements.length > 0 && (
            <span className="text-amber-600">{p.regulatory_requirements.join(', ')}</span>
          )}
          <span>{p.solution_complexity} complexity</span>
          <span>{p.delivery_success_rate}% delivery success rate</span>
          {p.internal_investment_pct > 0 && <span className="text-emerald-600 font-medium">{p.internal_investment_pct}% IOI</span>}
        </div>

        {/* ── Deal Score + Dimensions ── */}
        <div className={clsx('rounded-xl border p-4 mb-3', scoreBg)}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">Deal Health Score</span>
            <div className="flex items-center gap-2">
              <div className="relative w-12 h-12">
                <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.5" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.5" fill="none"
                    stroke={score >= 80 ? '#10b981' : score >= 65 ? '#3b82f6' : score >= 50 ? '#f59e0b' : '#ef4444'}
                    strokeWidth="3" strokeDasharray={`${score} 100`} strokeLinecap="round" />
                </svg>
                <span className={clsx('absolute inset-0 flex items-center justify-center text-sm font-bold', scoreColor)}>{Math.round(score)}</span>
              </div>
            </div>
          </div>
          <div className="space-y-0.5">
            {deal.score_dimensions.map(([key, label]) => (
              p.score_breakdown[key] !== undefined && (
                <ScoreBar key={key} label={label} description={''} score={p.score_breakdown[key]} />
              )
            ))}
          </div>
        </div>

        {/* ── AI Recommendation ── */}
        <div className={clsx('rounded-xl border p-4 mb-3', aiCfg.bg, aiCfg.border)}>
          <div className="flex items-center justify-between mb-2">
            <div className={clsx('flex items-center gap-2 font-bold text-sm', aiCfg.text)}>
              <AICfgIcon className="w-4 h-4" />
              {aiCfg.label}
            </div>
            <button onClick={handleRegenerate} disabled={regenerating}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors">
              <Bot className={clsx('w-3.5 h-3.5', regenerating && 'animate-spin')} />
              {regenerating ? 'Analysing...' : 'Re-run AI'}
            </button>
          </div>
          <p className="text-xs text-gray-700 leading-relaxed mb-2">{p.ai_recommendation_text}</p>
          {p.ai_conditions.length > 0 && (
            <div className="mt-2 space-y-1">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Conditions / Concerns</div>
              {p.ai_conditions.map((c, i) => (
                <div key={i} className="flex items-start gap-1.5 text-xs text-gray-700">
                  <span className="text-amber-500 mt-0.5 flex-shrink-0">▸</span> {c}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Expand: scope + service lines ── */}
        <button onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors w-full">
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          {expanded ? 'Hide' : 'Show'} deal scope & service lines
        </button>

        {expanded && (
          <div className="mt-3 space-y-3 border-t border-gray-100 pt-3">
            {deal.scope_summary && (
              <div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Scope Summary</div>
                <p className="text-xs text-gray-600 leading-relaxed">{deal.scope_summary}</p>
              </div>
            )}
            {deal.service_lines.length > 0 && (
              <div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">Service Lines</div>
                <div className="space-y-1">
                  {deal.service_lines.map((sl, i) => (
                    <div key={i} className="flex justify-between text-xs">
                      <span className="text-gray-700">{sl.service_name}</span>
                      <span className="text-gray-500">{sl.quantity} {sl.unit} · {fmt(sl.total)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-xs font-bold pt-1 border-t border-gray-100">
                    <span>Total</span>
                    <span>{fmt(deal.total_value)}</span>
                  </div>
                </div>
              </div>
            )}
            {p.reference_projects.length > 0 && (
              <div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Reference Engagements</div>
                <div className="flex flex-wrap gap-1.5">
                  {p.reference_projects.map((ref, i) => (
                    <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{ref}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Approval Actions ── */}
      {!actionTaken ? (
        <div className="border-t border-gray-100 px-5 py-3 bg-gray-50">
          {!showActionForm ? (
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => { setPendingAction('approved'); setShowActionForm(true); }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-md transition-colors">
                <CheckCircle className="w-3.5 h-3.5" /> Approve
              </button>
              <button onClick={() => { setPendingAction('conditionally_approved'); setShowActionForm(true); }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-md transition-colors">
                <AlertTriangle className="w-3.5 h-3.5" /> Approve with Conditions
              </button>
              <button onClick={() => { setPendingAction('in_review'); setShowActionForm(true); }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md transition-colors">
                <Search className="w-3.5 h-3.5" /> Request Review
              </button>
              <button onClick={() => { setPendingAction('rejected'); setShowActionForm(true); }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-md transition-colors">
                <XCircle className="w-3.5 h-3.5" /> Reject
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-xs font-semibold text-gray-700 capitalize">
                {pendingAction.replace('_', ' ')} — confirm approver
              </div>
              <input className="input text-sm" placeholder="Your name (e.g. Edwina — VP PS)"
                value={actionBy} onChange={e => setActionBy(e.target.value)} />
              <textarea className="input text-sm" rows={2} placeholder="Notes or conditions (optional)"
                value={actionNotes} onChange={e => setActionNotes(e.target.value)} />
              <div className="flex gap-2">
                <button onClick={() => handleAction(pendingAction)} disabled={!actionBy.trim() || submitting}
                  className="btn-primary text-xs">
                  {submitting ? 'Submitting...' : 'Confirm'}
                </button>
                <button onClick={() => setShowActionForm(false)} className="btn-secondary text-xs">Cancel</button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="border-t border-gray-100 px-5 py-3 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-xs text-gray-600">
              <span className={clsx('font-semibold', actionCfg?.bg || '')}>{actionCfg?.label}</span>
              {p.action_by && <span> by {p.action_by}</span>}
              {p.action_date && <span> · {new Date(p.action_date).toLocaleDateString()}</span>}
            </span>
          </div>
          {p.action_notes && <span className="text-xs text-gray-400 italic truncate max-w-xs">{p.action_notes}</span>}
        </div>
      )}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function DealApprovals() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [config, setConfig] = useState<OKRConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterTier, setFilterTier] = useState(0);
  const [filterStatus, setFilterStatus] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    Promise.all([dealApprovalsApi.list(), dealApprovalsApi.getConfig()])
      .then(([d, c]) => { setDeals(d.data); setConfig(c.data); })
      .finally(() => setLoading(false));
  }, []);

  const handleActionTaken = (id: string, updated: Deal) => {
    setDeals(prev => prev.map(d => d.id === id ? updated : d));
  };

  const filtered = deals.filter(d => {
    const p = d.profile;
    if (filterTier && p.approval_tier !== filterTier) return false;
    if (filterStatus && p.ai_recommendation_status !== filterStatus) return false;
    if (search && !d.name.toLowerCase().includes(search.toLowerCase()) && !d.client_name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalValue = deals.reduce((s, d) => s + d.total_value, 0);
  const avgScore = deals.length ? deals.reduce((s, d) => s + d.profile.deal_score, 0) / deals.length : 0;
  const totalACR = deals.reduce((s, d) => s + d.profile.azure_consumption_monthly, 0);
  const approveCount = deals.filter(d => d.profile.ai_recommendation_status === 'APPROVE').length;

  if (loading) return <div className="p-12 text-center text-gray-400">Loading deal approvals...</div>;

  return (
    <div>
      {/* ── Page Header ── */}
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="page-title flex items-center gap-2">
              <Bot className="w-7 h-7 text-ms-blue" />
              AI-Driven Deal Approvals
            </h1>
            <p className="text-sm text-gray-500 mt-1 max-w-2xl">
              Policy-led, automated, and agent-assisted approvals — shifting from exception-driven workflows to scalable, AI-validated deal governance that accelerates deal velocity while maintaining compliance.
            </p>
          </div>
          <button onClick={() => { setLoading(true); dealApprovalsApi.list().then(r => setDeals(r.data)).finally(() => setLoading(false)); }}
            className="btn-ghost flex items-center gap-1 text-gray-400">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Portfolio summary */}
        <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="card p-4 border-l-4 border-l-ms-blue">
            <div className="text-sm text-gray-500">Pending Pipeline</div>
            <div className="text-2xl font-bold mt-0.5">{fmt(totalValue)}</div>
            <div className="text-xs text-gray-400">{deals.length} deals awaiting decision</div>
          </div>
          <div className="card p-4 border-l-4 border-l-emerald-500">
            <div className="text-sm text-gray-500">AI Avg Deal Score</div>
            <div className="text-2xl font-bold mt-0.5">{avgScore.toFixed(1)}<span className="text-sm font-normal text-gray-400">/100</span></div>
            <div className="text-xs text-gray-400">{approveCount} of {deals.length} AI-recommended Approve</div>
          </div>
          <div className="card p-4 border-l-4 border-l-blue-500">
            <div className="text-sm text-gray-500">Azure ACR Pipeline</div>
            <div className="text-2xl font-bold mt-0.5">{fmt(totalACR)}<span className="text-sm font-normal text-gray-400">/mo</span></div>
            <div className="text-xs text-gray-400">Monthly consumption if all approved</div>
          </div>
          <div className="card p-4 border-l-4 border-l-amber-500">
            <div className="text-sm text-gray-500">Decisions Taken</div>
            <div className="text-2xl font-bold mt-0.5">{deals.filter(d => d.profile.action_taken).length}<span className="text-sm font-normal text-gray-400"> / {deals.length}</span></div>
            <div className="text-xs text-gray-400">{deals.filter(d => !d.profile.action_taken).length} awaiting action</div>
          </div>
        </div>
      </div>

      {/* ── OKR Panel ── */}
      {config && <OKRPanel config={config} />}

      {/* ── Tier Workflow ── */}
      {config && <TierWorkflow tiers={config.tiers} deals={deals} />}

      {/* ── Filters ── */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input className="input pl-9 text-sm" placeholder="Search deals..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input w-auto text-sm py-2" value={filterTier} onChange={e => setFilterTier(+e.target.value)}>
          <option value={0}>All Tiers</option>
          <option value={1}>Tier 1 — Streamlined</option>
          <option value={2}>Tier 2 — Manager Review</option>
          <option value={3}>Tier 3 — Executive</option>
        </select>
        <select className="input w-auto text-sm py-2" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">All AI Recommendations</option>
          <option value="APPROVE">AI: Approve</option>
          <option value="APPROVE_WITH_CONDITIONS">AI: Conditions</option>
          <option value="RECOMMEND_REVIEW">AI: Review</option>
          <option value="FLAG_REJECTION">AI: Flag</option>
        </select>
        <span className="text-sm text-gray-400 ml-auto">{filtered.length} deals</span>
      </div>

      {/* ── Deal Tiles Grid ── */}
      {filtered.length === 0 ? (
        <div className="card p-12 text-center text-gray-400">No deals match your filters.</div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {filtered.map(deal => (
            <DealTile key={deal.id} deal={deal} onActionTaken={handleActionTaken} />
          ))}
        </div>
      )}
    </div>
  );
}
