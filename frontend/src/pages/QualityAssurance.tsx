import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield, Activity, AlertTriangle, CheckCircle, XCircle,
  TrendingUp, TrendingDown, Minus, Search, RefreshCw,
  Bot, Target, Clock, BarChart2, ArrowRight, ArrowUp, ArrowDown,
  BookOpen, Users, Eye, ChevronDown, ChevronUp, Lightbulb,
  FileText, Layers, Zap, Heart, Globe,
} from 'lucide-react';
import clsx from 'clsx';
import { qualityAssuranceApi } from '../api/client';
import HealthReviewModal from '../components/shared/HealthReviewModal';

// ── Types ──────────────────────────────────────────────────────────────────
type HealthStatus = 'green' | 'amber' | 'red';
type QAAssessment = 'continue' | 'watch' | 'intervene' | 'escalate';
type AlertLevel = 'watch' | 'caution' | 'critical';
type CheckpointPhase = 'day_30' | 'day_60' | 'day_90';
type G2GStatus = 'active' | 'on_track' | 'stalled' | 'resolved' | 'escalated';
type NominationStatus = 'nominated' | 'confirmed' | 'presented' | 'deferred';
type LessonCategory = 'success_pattern' | 'failure_mode' | 'risk_mitigation' | 'process_improvement';
type DisclosurePolicy = 'minimal' | 'standard' | 'transparent';
type Tab = 'monitor' | 'checkpoints' | 'reviews' | 'g2g';

interface EarlyWarning {
  score: number; alert_level: AlertLevel | null;
  components: Record<string, number>;
  prediction_30d: HealthStatus; prediction_60d: HealthStatus; prediction_90d: HealthStatus;
  calculated_at: string; trend: string; trend_delta: number;
}
interface ProjectMonitor {
  project_id: string; name: string; client_name: string; project_manager: string;
  overall_health: HealthStatus; status: string; phase: string;
  budget: number; actuals: number; burn_rate: number; completion_pct: number;
  start_date: string; end_date: string;
  early_warning: EarlyWarning;
  health_dimensions: Record<string, HealthStatus>;
  ai_assessment: QAAssessment; ai_narrative: string;
  days_in_current_status: number; qa_director_override: string | null;
}
interface Checkpoint {
  id: string; project_id: string; project_name: string; client_name: string;
  phase: CheckpointPhase; due_date: string; completed_date: string | null;
  maturity_score: number | null; criteria_met: string[]; criteria_gaps: string[];
  ai_assessment: string; qa_director_override: string | null;
  status: 'pending' | 'passed' | 'flagged' | 'waived';
}
interface G2GPlan {
  id: string; project_id: string; project_name: string; client_name: string;
  project_manager: string; qa_specialist: string | null; status: G2GStatus;
  started_date: string; target_green_date: string; current_ew_score: number;
  root_causes: string[];
  immediate_actions: { action: string; owner: string; due: string; done: boolean }[];
  recovery_milestones: { milestone: string; target_date: string; status: string }[];
  success_criteria: string[];
  weekly_assessments: { week: string; on_track: boolean; ew_score: number; notes: string }[];
}
interface Nomination {
  id: string; project_id: string; project_name: string; client_name: string;
  nomination_reason: string; early_warning_score: number; value_at_risk: number;
  ai_talking_points: string[]; preparation_notes: string; status: NominationStatus;
}
interface Lesson {
  id: string; source_project_id: string; source_project_name: string;
  category: LessonCategory; title: string; description: string;
  tags: Record<string, string>; applicability_score: number;
  times_consumed: number; linked_projects: string[]; created_at: string;
}
interface ClientView {
  project_id: string; project_name: string; client_name: string;
  disclosure_policy: DisclosurePolicy; client_health_status: HealthStatus;
  client_narrative: string;
  milestone_progress: { name: string; status: string; due: string; completion_pct: number }[];
  disclosed_risks: { risk: string; mitigation: string; status: string }[];
  next_update_date: string; client_sentiment_signals: string[];
}
interface QAEvals {
  prediction_accuracy: { true_positives: number; false_positives: number; true_negatives: number; false_negatives: number; precision: number; recall: number; f1_score: number };
  recovery_stats: { total_g2g_plans: number; resolved_within_60d: number; recovery_rate: number; avg_recovery_days: number; active_plans: number };
  alignment: { total_assessments: number; director_overrides: number; override_rate: number; override_breakdown: { ai_too_aggressive: number; ai_too_lenient: number } };
  checkpoint_correlation: { high_maturity_green_rate: number; low_maturity_red_rate: number; avg_maturity_by_outcome: Record<string, number> };
  monthly_trend: { month: string; avg_ew_score: number; portfolio_green_pct: number; predictions_correct: number; predictions_total: number }[];
}
interface KR { id: string; label: string; unit: string; current: number; target: number; direction: string; description: string }
interface AlertTier { level: string; label: string; threshold: number; description: string; color: string; sla: string; notified: string }
interface QAConfig {
  objective: string; krs: KR[];
  kpis: { label: string; value: string; target: string }[];
  alert_tiers: AlertTier[];
}
interface QAData {
  portfolio_monitor: ProjectMonitor[];
  checkpoints: Checkpoint[];
  get_to_green: G2GPlan[];
  health_reviews: {
    current_period: string; region: string;
    nominations: Nomination[];
    post_review_actions: { id: string; review_period: string; project_name: string; action: string; owner: string; due: string; done: boolean }[];
  };
  knowledge_network: Lesson[];
  client_portal: ClientView[];
  qa_evals: QAEvals;
}

// ── Helpers ────────────────────────────────────────────────────────────────
const fmt = (v: number) => v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(1)}M` : v >= 1_000 ? `$${(v / 1_000).toFixed(0)}K` : `$${v}`;
const fmtPct = (current: number, target: number, dir: string) => {
  const pct = dir === 'higher'
    ? Math.min(100, (current / target) * 100)
    : Math.min(100, ((2 * target - current) / target) * 100);
  return Math.max(0, pct);
};

const HEALTH_CFG: Record<HealthStatus, { bg: string; text: string; dot: string; label: string }> = {
  green: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500', label: 'Green' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500', label: 'Amber' },
  red:   { bg: 'bg-red-50',   text: 'text-red-700',   dot: 'bg-red-500',   label: 'Red' },
};

const ASSESSMENT_CFG: Record<QAAssessment, { label: string; bg: string; text: string; Icon: typeof CheckCircle }> = {
  continue:  { label: 'Continue',  bg: 'bg-green-50 border-green-200',   text: 'text-green-700',  Icon: CheckCircle },
  watch:     { label: 'Watch',     bg: 'bg-amber-50 border-amber-200',   text: 'text-amber-700',  Icon: Eye },
  intervene: { label: 'Intervene', bg: 'bg-orange-50 border-orange-200', text: 'text-orange-700', Icon: AlertTriangle },
  escalate:  { label: 'Escalate',  bg: 'bg-red-50 border-red-200',       text: 'text-red-700',    Icon: XCircle },
};

const ALERT_CFG: Record<AlertLevel, { label: string; bg: string; text: string }> = {
  watch:    { label: 'Watch',    bg: 'bg-amber-100', text: 'text-amber-800' },
  caution:  { label: 'Caution',  bg: 'bg-orange-100', text: 'text-orange-800' },
  critical: { label: 'Critical', bg: 'bg-red-100',    text: 'text-red-800' },
};

const PHASE_LABEL: Record<string, string> = { day_30: 'Day 30', day_60: 'Day 60', day_90: 'Day 90' };
const CP_STATUS_CFG: Record<string, { label: string; bg: string }> = {
  pending: { label: 'Pending', bg: 'bg-blue-100 text-blue-700' },
  passed:  { label: 'Passed',  bg: 'bg-green-100 text-green-700' },
  flagged: { label: 'Flagged', bg: 'bg-amber-100 text-amber-700' },
  waived:  { label: 'Waived',  bg: 'bg-gray-100 text-gray-600' },
};

const G2G_STATUS_CFG: Record<G2GStatus, { label: string; bg: string }> = {
  active:    { label: 'Active',    bg: 'bg-blue-100 text-blue-700' },
  on_track:  { label: 'On Track',  bg: 'bg-green-100 text-green-700' },
  stalled:   { label: 'Stalled',   bg: 'bg-red-100 text-red-700' },
  resolved:  { label: 'Resolved',  bg: 'bg-emerald-100 text-emerald-700' },
  escalated: { label: 'Escalated', bg: 'bg-purple-100 text-purple-700' },
};

const LESSON_CFG: Record<LessonCategory, { label: string; bg: string; Icon: typeof Lightbulb }> = {
  success_pattern:      { label: 'Success Pattern',      bg: 'bg-green-100 text-green-700',  Icon: CheckCircle },
  failure_mode:         { label: 'Failure Mode',         bg: 'bg-red-100 text-red-700',      Icon: XCircle },
  risk_mitigation:      { label: 'Risk Mitigation',      bg: 'bg-amber-100 text-amber-700',  Icon: Shield },
  process_improvement:  { label: 'Process Improvement',  bg: 'bg-blue-100 text-blue-700',    Icon: Lightbulb },
};

const DISCLOSURE_CFG: Record<DisclosurePolicy, { label: string; bg: string; description: string }> = {
  minimal:     { label: 'Minimal',     bg: 'bg-gray-100 text-gray-700',   description: 'Monthly summary, RAG status only' },
  standard:    { label: 'Standard',    bg: 'bg-blue-100 text-blue-700',   description: 'Biweekly narrative, risks with mitigations' },
  transparent: { label: 'Transparent', bg: 'bg-emerald-100 text-emerald-700', description: 'Weekly detail, full risk visibility' },
};

const ewScoreColor = (s: number) =>
  s >= 80 ? 'text-red-700' : s >= 60 ? 'text-orange-700' : s >= 40 ? 'text-amber-700' : 'text-green-700';
const ewScoreBg = (s: number) =>
  s >= 80 ? 'bg-red-500' : s >= 60 ? 'bg-orange-500' : s >= 40 ? 'bg-amber-500' : 'bg-green-500';
const ewBarColor = ewScoreBg;
const ewScoreRing = (s: number) =>
  s >= 80 ? 'stroke-red-500' : s >= 60 ? 'stroke-orange-500' : s >= 40 ? 'stroke-amber-500' : 'stroke-green-500';

const TrendIcon = ({ trend }: { trend: string }) => {
  if (trend === 'worsening') return <ArrowUp className="w-3 h-3 text-red-500" />;
  if (trend === 'improving') return <ArrowDown className="w-3 h-3 text-green-500" />;
  return <Minus className="w-3 h-3 text-gray-400" />;
};

const DIMS = ['schedule', 'budget', 'scope', 'risk', 'satisfaction'] as const;

// ── OKR Panel ──────────────────────────────────────────────────────────────
function OKRPanel({ config }: { config: QAConfig }) {
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
        {config.krs.map(kr => {
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
                <div className={clsx('h-full rounded-full transition-all', onTrack ? 'bg-green-500' : 'bg-amber-500')} style={{ width: `${pct}%` }} />
              </div>
              <div className="text-[10px] text-gray-400">{kr.description}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Power BI Style Components ──────────────────────────────────────────────
function PowerBIFrame({ title, subtitle, slicers, children }: { title: string; subtitle: string; slicers?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-gray-50 rounded-xl border border-gray-300 overflow-hidden shadow-sm">
      {/* Title bar — Power BI signature */}
      <div className="bg-slate-900 px-4 py-2.5 flex items-center gap-3">
        <div className="w-6 h-6 rounded-sm flex items-center justify-center" style={{ background: '#F2C811' }}>
          <span className="text-[9px] font-black text-slate-900 leading-none">Pbi</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-white text-[13px] font-semibold leading-tight">{title}</div>
          <div className="text-slate-400 text-[10px] leading-tight">{subtitle}</div>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-slate-400">
          <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Live</span>
          <span>Last refresh: just now</span>
        </div>
      </div>
      {/* Slicer ribbon */}
      {slicers && (
        <div className="bg-white px-4 py-2 border-b border-gray-200 flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mr-1">Filters</span>
          {slicers}
        </div>
      )}
      <div className="p-4 bg-[#faf9f8]">{children}</div>
    </div>
  );
}

function PBITile({ label, value, sublabel, accent, trend }: { label: string; value: React.ReactNode; sublabel?: string; accent?: string; trend?: { icon: typeof ArrowUp; text: string; color: string } }) {
  return (
    <div className="bg-white rounded-md border border-gray-200 p-3.5 relative overflow-hidden">
      {accent && <div className={clsx('absolute top-0 left-0 right-0 h-1', accent)} />}
      <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">{label}</div>
      <div className="text-3xl font-bold text-gray-900 leading-none tracking-tight">{value}</div>
      {sublabel && <div className="text-[11px] text-gray-500 mt-1.5">{sublabel}</div>}
      {trend && (
        <div className={clsx('flex items-center gap-1 mt-1.5 text-[10px] font-semibold', trend.color)}>
          <trend.icon className="w-3 h-3" />
          <span>{trend.text}</span>
        </div>
      )}
    </div>
  );
}

function PBIVisual({ title, subtitle, children, className }: { title: string; subtitle?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={clsx('bg-white rounded-md border border-gray-200 p-4 flex flex-col', className)}>
      <div className="flex items-start justify-between mb-3 flex-shrink-0">
        <div>
          <div className="text-[12px] font-bold text-gray-800">{title}</div>
          {subtitle && <div className="text-[10px] text-gray-400">{subtitle}</div>}
        </div>
      </div>
      <div className="flex-1 min-h-0">{children}</div>
    </div>
  );
}

function PBIDonut({ segments, centerLabel, centerValue }: { segments: { label: string; value: number; color: string }[]; centerLabel?: string; centerValue?: string }) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  let offset = 0;
  return (
    <div className="flex items-center gap-4">
      <div className="relative flex-shrink-0">
        <svg viewBox="0 0 36 36" className="w-28 h-28 -rotate-90">
          <circle cx="18" cy="18" r="15.5" fill="none" stroke="#f3f4f6" strokeWidth="5" />
          {segments.map((s, i) => {
            const pct = total > 0 ? (s.value / total) * 100 : 0;
            const dasharray = `${pct} 100`;
            const dashoffset = -offset;
            offset += pct;
            return <circle key={i} cx="18" cy="18" r="15.5" fill="none" stroke={s.color} strokeWidth="5" strokeDasharray={dasharray} strokeDashoffset={dashoffset} strokeLinecap="butt" />;
          })}
        </svg>
        {(centerValue || centerLabel) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {centerValue && <div className="text-2xl font-bold text-gray-900 leading-none">{centerValue}</div>}
            {centerLabel && <div className="text-[9px] text-gray-400 uppercase tracking-wide mt-0.5">{centerLabel}</div>}
          </div>
        )}
      </div>
      <div className="flex-1 space-y-1.5">
        {segments.map(s => (
          <div key={s.label} className="flex items-center gap-2 text-[11px]">
            <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: s.color }} />
            <span className="text-gray-600 flex-1 truncate">{s.label}</span>
            <span className="font-bold text-gray-900">{s.value}</span>
            <span className="text-gray-400 w-9 text-right">{total > 0 ? ((s.value / total) * 100).toFixed(0) : 0}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PBIBarChart({ items, valueColor, maxValue }: { items: { label: string; value: number; sub?: string }[]; valueColor: (v: number) => string; maxValue?: number }) {
  const max = maxValue ?? Math.max(...items.map(i => i.value), 1);
  return (
    <div className="space-y-1.5">
      {items.map(item => (
        <div key={item.label} className="flex items-center gap-2 text-[11px]">
          <div className="w-36 flex-shrink-0 min-w-0">
            <div className="text-gray-700 truncate font-medium">{item.label}</div>
            {item.sub && <div className="text-[9px] text-gray-400 truncate">{item.sub}</div>}
          </div>
          <div className="flex-1 h-6 bg-gray-50 rounded-sm relative overflow-hidden">
            <div className={clsx('h-full', valueColor(item.value))} style={{ width: `${(item.value / max) * 100}%` }} />
            <span className="absolute inset-0 flex items-center px-2 text-[10px] font-bold text-gray-700">{item.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function PBISlicer({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded px-2 py-1">
      <span className="text-[10px] font-semibold text-gray-500">{label}:</span>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="text-[11px] bg-transparent border-0 outline-none cursor-pointer text-gray-800 font-medium">
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

// ── Alert Tiers Panel ──────────────────────────────────────────────────────
function AlertTiersPanel({ tiers, projects }: { tiers: AlertTier[]; projects: ProjectMonitor[] }) {
  const COLORS: Record<string, { bg: string; light: string; border: string; text: string }> = {
    amber:  { bg: 'bg-amber-500',  light: 'bg-amber-50',  border: 'border-amber-200',  text: 'text-amber-700' },
    orange: { bg: 'bg-orange-500', light: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700' },
    red:    { bg: 'bg-red-600',    light: 'bg-red-50',    border: 'border-red-200',    text: 'text-red-700' },
  };
  const ICONS = [Eye, AlertTriangle, XCircle];

  return (
    <div className="card p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title">Early Warning Alert Tiers</h2>
        <span className="text-xs text-gray-400">Threshold-based · AI-monitored · QA Director validated</span>
      </div>
      <div className="flex items-stretch gap-0 relative">
        {tiers.map((tier, i) => {
          const c = COLORS[tier.color];
          const TierIcon = ICONS[i];
          const count = projects.filter(p => p.early_warning.alert_level === tier.level).length;
          return (
            <div key={tier.level} className="flex-1 flex items-stretch">
              <div className={clsx('flex-1 rounded-xl border p-4', c.light, c.border)}>
                <div className="flex items-center justify-between mb-3">
                  <div className={clsx('flex items-center gap-2 px-2.5 py-1 rounded-full text-white text-xs font-bold', c.bg)}>
                    <TierIcon className="w-3 h-3" /> {tier.label}
                  </div>
                  {count > 0 && <span className={clsx('text-xs font-bold px-2 py-0.5 rounded-full border', c.light, c.text, c.border)}>{count} project{count > 1 ? 's' : ''}</span>}
                </div>
                <div className="font-semibold text-gray-900 text-sm mb-1">Score &gt; {tier.threshold}</div>
                <div className="text-xs text-gray-500 mb-3 leading-relaxed">{tier.description}</div>
                <div className="border-t border-gray-200 pt-2 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="font-medium">SLA:</span> <span className="text-gray-600">{tier.sla}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <Users className="w-3 h-3 text-gray-400" />
                    <span className="font-medium">Notified:</span> <span className="text-gray-600">{tier.notified}</span>
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

// ── Portfolio Monitor Tab ──────────────────────────────────────────────────
function PortfolioMonitorTab({ projects, config }: { projects: ProjectMonitor[]; config: QAConfig }) {
  const [search, setSearch] = useState('');
  const [filterHealth, setFilterHealth] = useState('');
  const [filterAssessment, setFilterAssessment] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = projects.filter(p => {
    if (filterHealth && p.overall_health !== filterHealth) return false;
    if (filterAssessment && p.ai_assessment !== filterAssessment) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.client_name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }).sort((a, b) => b.early_warning.score - a.early_warning.score);

  const avgEW = projects.length ? Math.round(projects.reduce((s, p) => s + p.early_warning.score, 0) / projects.length) : 0;
  const greenPct = projects.length ? Math.round((projects.filter(p => p.overall_health === 'green').length / projects.length) * 100) : 0;
  const alertCount = projects.filter(p => p.early_warning.alert_level).length;
  const totalBudget = projects.reduce((s, p) => s + p.budget, 0);

  const healthSegments = [
    { label: 'Green', value: projects.filter(p => p.overall_health === 'green').length, color: '#10b981' },
    { label: 'Amber', value: projects.filter(p => p.overall_health === 'amber').length, color: '#f59e0b' },
    { label: 'Red',   value: projects.filter(p => p.overall_health === 'red').length,   color: '#ef4444' },
  ];
  const assessmentSegments = [
    { label: 'Continue',  value: projects.filter(p => p.ai_assessment === 'continue').length,  color: '#10b981' },
    { label: 'Watch',     value: projects.filter(p => p.ai_assessment === 'watch').length,     color: '#f59e0b' },
    { label: 'Intervene', value: projects.filter(p => p.ai_assessment === 'intervene').length, color: '#f97316' },
    { label: 'Escalate',  value: projects.filter(p => p.ai_assessment === 'escalate').length,  color: '#ef4444' },
  ];
  const ewByProject = [...projects].sort((a, b) => b.early_warning.score - a.early_warning.score).slice(0, 7).map(p => ({
    label: p.name.length > 28 ? p.name.slice(0, 26) + '…' : p.name,
    value: p.early_warning.score,
    sub: p.client_name,
  }));

  return (
    <div className="space-y-4">
      <AlertTiersPanel tiers={config.alert_tiers} projects={projects} />

      <PowerBIFrame
        title="Portfolio Health Monitor"
        subtitle="Delivery Excellence · Real-time portfolio quality assurance"
        slicers={<>
          <PBISlicer label="Health" value={filterHealth} onChange={setFilterHealth} options={[
            { value: '', label: 'All' },
            { value: 'green', label: 'Green' },
            { value: 'amber', label: 'Amber' },
            { value: 'red', label: 'Red' },
          ]} />
          <PBISlicer label="Assessment" value={filterAssessment} onChange={setFilterAssessment} options={[
            { value: '', label: 'All' },
            { value: 'continue', label: 'Continue' },
            { value: 'watch', label: 'Watch' },
            { value: 'intervene', label: 'Intervene' },
            { value: 'escalate', label: 'Escalate' },
          ]} />
          <div className="relative flex-1 max-w-xs ml-auto">
            <Search className="absolute left-2.5 top-1.5 w-3.5 h-3.5 text-gray-400" />
            <input className="text-[11px] bg-gray-50 border border-gray-200 rounded pl-7 pr-2 py-1 w-full outline-none focus:border-ms-blue"
              placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <span className="text-[10px] text-gray-400">{filtered.length} of {projects.length}</span>
        </>}
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <PBITile label="Portfolio Budget" value={fmt(totalBudget)} sublabel={`${projects.length} active projects`} accent="bg-ms-blue" />
          <PBITile label="Portfolio Health" value={<>{greenPct}<span className="text-lg text-gray-400 font-normal">%</span></>} sublabel="Green projects · Target ≥75%"
            accent={greenPct >= 75 ? 'bg-emerald-500' : 'bg-amber-500'} />
          <PBITile label="Avg Early Warning" value={<span className={ewScoreColor(avgEW)}>{avgEW}</span>} sublabel="Target &lt; 40"
            accent={ewBarColor(avgEW)} />
          <PBITile label="Active Alerts" value={alertCount} sublabel={`${projects.filter(p => p.early_warning.alert_level === 'critical').length} critical · ${projects.filter(p => p.early_warning.alert_level === 'caution').length} caution`}
            accent={alertCount > 0 ? 'bg-red-500' : 'bg-gray-300'} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4">
          <PBIVisual title="Health Distribution" subtitle="Project count by RAG status">
            <PBIDonut segments={healthSegments} centerValue={`${projects.length}`} centerLabel="Projects" />
          </PBIVisual>
          <PBIVisual title="AI Assessment Mix" subtitle="Recommended action by project">
            <PBIDonut segments={assessmentSegments} centerValue={`${projects.length}`} centerLabel="Total" />
          </PBIVisual>
          <PBIVisual title="Top 7 by EW Score" subtitle="Highest-risk projects">
            <PBIBarChart items={ewByProject} valueColor={ewBarColor} maxValue={100} />
          </PBIVisual>
        </div>

        <PBIVisual title="Project Detail" subtitle={`${filtered.length} project${filtered.length !== 1 ? 's' : ''} · sorted by Early Warning score (desc)`}>
        <div className="space-y-3 mt-1">
        {filtered.map(p => {
          const ew = p.early_warning;
          const ac = ASSESSMENT_CFG[p.ai_assessment];
          const ACIcon = ac.Icon;
          const isExpanded = expanded === p.project_id;
          return (
            <div key={p.project_id} className={clsx('card overflow-hidden transition-shadow hover:shadow-lg border-l-4',
              p.overall_health === 'red' ? 'border-l-red-500' : p.overall_health === 'amber' ? 'border-l-amber-500' : 'border-l-green-500'
            )}>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={clsx('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold', HEALTH_CFG[p.overall_health].bg, HEALTH_CFG[p.overall_health].text)}>
                        <div className={clsx('w-2 h-2 rounded-full', HEALTH_CFG[p.overall_health].dot)} />
                        {HEALTH_CFG[p.overall_health].label}
                      </span>
                      <span className={clsx('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border', ac.bg, ac.text)}>
                        <ACIcon className="w-3 h-3" /> {ac.label}
                      </span>
                      {ew.alert_level && (
                        <span className={clsx('text-xs font-bold px-2 py-0.5 rounded-full', ALERT_CFG[ew.alert_level].bg, ALERT_CFG[ew.alert_level].text)}>
                          {ALERT_CFG[ew.alert_level].label}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm leading-snug">{p.name}</h3>
                    <div className="text-xs text-gray-500 mt-0.5">{p.client_name} · PM: {p.project_manager} · Phase: {p.phase}</div>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-center">
                      <div className="relative w-14 h-14">
                        <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                          <circle cx="18" cy="18" r="15.5" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                          <circle cx="18" cy="18" r="15.5" fill="none" className={ewScoreRing(ew.score)}
                            strokeWidth="3" strokeDasharray={`${ew.score} 100`} strokeLinecap="round" />
                        </svg>
                        <span className={clsx('absolute inset-0 flex items-center justify-center text-sm font-bold', ewScoreColor(ew.score))}>{ew.score}</span>
                      </div>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <TrendIcon trend={ew.trend} />
                        <span className="text-[10px] text-gray-400">{ew.trend_delta > 0 ? '+' : ''}{ew.trend_delta}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">{fmt(p.budget)}</div>
                      <div className="text-xs text-gray-400">{p.burn_rate}% burned · {p.completion_pct}% complete</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap mb-3">
                  {DIMS.map(d => {
                    const h = p.health_dimensions[d] as HealthStatus;
                    return (
                      <div key={d} className="flex items-center gap-1 text-xs text-gray-500">
                        <div className={clsx('w-2 h-2 rounded-full', HEALTH_CFG[h].dot)} />
                        {d}
                      </div>
                    );
                  })}
                  <div className="ml-auto flex items-center gap-2 text-xs text-gray-400">
                    <span>30d: <span className={clsx('font-semibold', HEALTH_CFG[ew.prediction_30d].text)}>{ew.prediction_30d}</span></span>
                    <span>60d: <span className={clsx('font-semibold', HEALTH_CFG[ew.prediction_60d].text)}>{ew.prediction_60d}</span></span>
                    <span>90d: <span className={clsx('font-semibold', HEALTH_CFG[ew.prediction_90d].text)}>{ew.prediction_90d}</span></span>
                  </div>
                </div>

                <div className={clsx('rounded-lg border p-3 mb-3', ac.bg)}>
                  <div className={clsx('flex items-center gap-2 text-xs font-bold mb-1', ac.text)}>
                    <Bot className="w-3.5 h-3.5" /> AI Assessment
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed">{p.ai_narrative}</p>
                  {p.qa_director_override && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">QA Director Override</div>
                      <p className="text-xs text-gray-600 italic">{p.qa_director_override}</p>
                    </div>
                  )}
                </div>

                <button onClick={() => setExpanded(isExpanded ? null : p.project_id)}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors">
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  {isExpanded ? 'Hide' : 'Show'} signal components
                </button>

                {isExpanded && (
                  <div className="mt-3 border-t border-gray-100 pt-3">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">Early Warning Signal Components</div>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                      {Object.entries(ew.components).map(([key, val]) => (
                        <div key={key} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-600 capitalize">{key.replace(/_/g, ' ')}</span>
                            <span className={clsx('text-xs font-bold', ewScoreColor(val))}>{val}</span>
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className={clsx('h-full rounded-full', ewScoreBg(val))} style={{ width: `${val}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        </div>
        </PBIVisual>
      </PowerBIFrame>
    </div>
  );
}

// ── Checkpoints Tab ────────────────────────────────────────────────────────
function CheckpointsTab({ checkpoints }: { checkpoints: Checkpoint[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filterPhase, setFilterPhase] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const filtered = checkpoints.filter(cp => {
    if (filterPhase && cp.phase !== filterPhase) return false;
    if (filterStatus && cp.status !== filterStatus) return false;
    return true;
  });

  const passed = checkpoints.filter(c => c.status === 'passed').length;
  const flagged = checkpoints.filter(c => c.status === 'flagged').length;
  const pending = checkpoints.filter(c => c.status === 'pending').length;
  const avgScore = checkpoints.filter(c => c.maturity_score !== null);
  const avg = avgScore.length ? Math.round(avgScore.reduce((s, c) => s + (c.maturity_score || 0), 0) / avgScore.length) : 0;

  const statusSegments = [
    { label: 'Passed',  value: passed,  color: '#10b981' },
    { label: 'Flagged', value: flagged, color: '#f59e0b' },
    { label: 'Pending', value: pending, color: '#3b82f6' },
    { label: 'Waived',  value: checkpoints.filter(c => c.status === 'waived').length, color: '#9ca3af' },
  ];
  const phaseSegments = [
    { label: 'Day 30', value: checkpoints.filter(c => c.phase === 'day_30').length, color: '#0078d4' },
    { label: 'Day 60', value: checkpoints.filter(c => c.phase === 'day_60').length, color: '#5c2d91' },
    { label: 'Day 90', value: checkpoints.filter(c => c.phase === 'day_90').length, color: '#e3008c' },
  ];
  const maturityBars = checkpoints.filter(c => c.maturity_score !== null)
    .sort((a, b) => (b.maturity_score || 0) - (a.maturity_score || 0))
    .slice(0, 7)
    .map(c => ({
      label: c.project_name.length > 26 ? c.project_name.slice(0, 24) + '…' : c.project_name,
      value: c.maturity_score || 0,
      sub: `${PHASE_LABEL[c.phase]} · ${c.status}`,
    }));
  const maturityColor = (v: number) => v >= 80 ? 'bg-emerald-500' : v >= 65 ? 'bg-blue-500' : v >= 50 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <div className="space-y-4">
      <PowerBIFrame
        title="Engagement Setup Assurance"
        subtitle="30-60-90 day checkpoints · Top-quartile engagement quality gates"
        slicers={<>
          <PBISlicer label="Phase" value={filterPhase} onChange={setFilterPhase} options={[
            { value: '', label: 'All' },
            { value: 'day_30', label: 'Day 30' },
            { value: 'day_60', label: 'Day 60' },
            { value: 'day_90', label: 'Day 90' },
          ]} />
          <PBISlicer label="Status" value={filterStatus} onChange={setFilterStatus} options={[
            { value: '', label: 'All' },
            { value: 'passed', label: 'Passed' },
            { value: 'flagged', label: 'Flagged' },
            { value: 'pending', label: 'Pending' },
          ]} />
          <span className="text-[10px] text-gray-400 ml-auto">{filtered.length} of {checkpoints.length}</span>
        </>}
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <PBITile label="Passed" value={<span className="text-green-700">{passed}</span>} sublabel={`${checkpoints.length ? Math.round((passed / checkpoints.length) * 100) : 0}% of all checkpoints`} accent="bg-emerald-500" />
          <PBITile label="Flagged" value={<span className="text-amber-700">{flagged}</span>} sublabel="Require QA Director attention" accent="bg-amber-500" />
          <PBITile label="Pending" value={<span className="text-blue-700">{pending}</span>} sublabel="Upcoming assessments" accent="bg-blue-500" />
          <PBITile label="Avg Maturity" value={<>{avg}<span className="text-lg text-gray-400 font-normal">/100</span></>} sublabel="Setup readiness baseline" accent={maturityColor(avg)} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4">
          <PBIVisual title="Checkpoint Status" subtitle="Outcomes across all phases">
            <PBIDonut segments={statusSegments} centerValue={`${checkpoints.length}`} centerLabel="Total" />
          </PBIVisual>
          <PBIVisual title="By Phase" subtitle="Distribution across 30/60/90 day">
            <PBIDonut segments={phaseSegments} centerValue={`${checkpoints.length}`} centerLabel="Checkpoints" />
          </PBIVisual>
          <PBIVisual title="Maturity Scores" subtitle="Top 7 by Setup Maturity Score">
            <PBIBarChart items={maturityBars} valueColor={maturityColor} maxValue={100} />
          </PBIVisual>
        </div>

        <PBIVisual title="Checkpoint Detail" subtitle={`${filtered.length} checkpoint${filtered.length !== 1 ? 's' : ''} · click to expand criteria`}>
        <div className="space-y-3 mt-1">
        {filtered.map(cp => {
          const isExpanded = expanded === cp.id;
          const stCfg = CP_STATUS_CFG[cp.status];
          return (
            <div key={cp.id} className={clsx('card overflow-hidden border-l-4',
              cp.status === 'passed' ? 'border-l-green-500' : cp.status === 'flagged' ? 'border-l-amber-500' : 'border-l-blue-500'
            )}>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{PHASE_LABEL[cp.phase]}</span>
                      <span className={clsx('text-xs font-semibold px-2 py-0.5 rounded', stCfg.bg)}>{stCfg.label}</span>
                      {cp.maturity_score !== null && (
                        <span className={clsx('text-xs font-bold', cp.maturity_score >= 75 ? 'text-green-700' : cp.maturity_score >= 60 ? 'text-amber-700' : 'text-red-700')}>
                          Maturity: {cp.maturity_score}/100
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm">{cp.project_name}</h3>
                    <div className="text-xs text-gray-500">{cp.client_name} · Due: {new Date(cp.due_date).toLocaleDateString()}{cp.completed_date && ` · Completed: ${new Date(cp.completed_date).toLocaleDateString()}`}</div>
                  </div>
                </div>

                <div className="rounded-lg bg-gray-50 border border-gray-100 p-3 mb-2">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">AI Assessment</div>
                  <p className="text-xs text-gray-700 leading-relaxed">{cp.ai_assessment}</p>
                </div>

                {cp.qa_director_override && (
                  <div className="rounded-lg bg-purple-50 border border-purple-100 p-3 mb-2">
                    <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wide mb-1">QA Director Override</div>
                    <p className="text-xs text-purple-700 leading-relaxed italic">{cp.qa_director_override}</p>
                  </div>
                )}

                <button onClick={() => setExpanded(isExpanded ? null : cp.id)}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors">
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  {isExpanded ? 'Hide' : 'Show'} criteria details
                </button>

                {isExpanded && (
                  <div className="mt-3 border-t border-gray-100 pt-3 grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-[10px] font-bold text-green-600 uppercase tracking-wide mb-1.5">Criteria Met ({cp.criteria_met.length})</div>
                      <div className="space-y-1">
                        {cp.criteria_met.map((c, i) => (
                          <div key={i} className="flex items-start gap-1.5 text-xs text-gray-700">
                            <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" /> {c}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-amber-600 uppercase tracking-wide mb-1.5">Gaps ({cp.criteria_gaps.length})</div>
                      <div className="space-y-1">
                        {cp.criteria_gaps.length === 0 ? (
                          <div className="text-xs text-gray-400 italic">No gaps identified</div>
                        ) : cp.criteria_gaps.map((g, i) => (
                          <div key={i} className="flex items-start gap-1.5 text-xs text-gray-700">
                            <AlertTriangle className="w-3 h-3 text-amber-500 mt-0.5 flex-shrink-0" /> {g}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        </div>
        </PBIVisual>
      </PowerBIFrame>
    </div>
  );
}

// ── Get-to-Green Tab ───────────────────────────────────────────────────────
function GetToGreenTab({ plans }: { plans: G2GPlan[] }) {
  const [expanded, setExpanded] = useState<string | null>(plans[0]?.id || null);

  const active = plans.filter(p => p.status === 'active' || p.status === 'on_track').length;
  const resolved = plans.filter(p => p.status === 'resolved').length;
  const stalled = plans.filter(p => p.status === 'stalled').length;

  const statusSegments = [
    { label: 'Active',    value: plans.filter(p => p.status === 'active').length,    color: '#3b82f6' },
    { label: 'On Track',  value: plans.filter(p => p.status === 'on_track').length,  color: '#10b981' },
    { label: 'Stalled',   value: plans.filter(p => p.status === 'stalled').length,   color: '#ef4444' },
    { label: 'Resolved',  value: resolved,                                            color: '#059669' },
    { label: 'Escalated', value: plans.filter(p => p.status === 'escalated').length, color: '#9333ea' },
  ];
  const ewProgress = plans.map(p => ({
    label: p.project_name.length > 26 ? p.project_name.slice(0, 24) + '…' : p.project_name,
    value: p.current_ew_score,
    sub: `${p.weekly_assessments.length} weeks · target ${new Date(p.target_green_date).toLocaleDateString()}`,
  }));
  const milestoneCompletion = plans.map(p => ({
    label: p.project_name.length > 26 ? p.project_name.slice(0, 24) + '…' : p.project_name,
    value: p.recovery_milestones.length > 0 ? Math.round((p.recovery_milestones.filter(m => m.status === 'completed').length / p.recovery_milestones.length) * 100) : 0,
    sub: `${p.recovery_milestones.filter(m => m.status === 'completed').length} of ${p.recovery_milestones.length} milestones`,
  }));

  return (
    <div className="space-y-4">
      <PowerBIFrame
        title="Get-to-Green Recovery Tracking"
        subtitle="Active recovery plans · Root cause-driven · Weekly progress assessments"
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <PBITile label="Active Plans" value={active} sublabel={`${plans.length} total recovery plans`} accent="bg-blue-500" />
          <PBITile label="Resolved" value={<span className="text-green-700">{resolved}</span>} sublabel={`${plans.length ? Math.round((resolved / plans.length) * 100) : 0}% recovery success rate`} accent="bg-emerald-500" />
          <PBITile label="Stalled" value={<span className="text-red-700">{stalled}</span>} sublabel={stalled > 0 ? 'Requires escalation' : 'No stalled plans'} accent={stalled > 0 ? 'bg-red-500' : 'bg-gray-300'} />
          <PBITile label="Avg Recovery Time" value={<>48<span className="text-lg text-gray-400 font-normal"> days</span></>} sublabel="Target ≤ 60 days" accent="bg-purple-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4">
          <PBIVisual title="Plan Status" subtitle="Distribution across recovery phases">
            <PBIDonut segments={statusSegments} centerValue={`${plans.length}`} centerLabel="Plans" />
          </PBIVisual>
          <PBIVisual title="Current EW Scores" subtitle="Real-time risk per active plan">
            <PBIBarChart items={ewProgress} valueColor={ewBarColor} maxValue={100} />
          </PBIVisual>
          <PBIVisual title="Milestone Progress" subtitle="% recovery milestones completed">
            <PBIBarChart items={milestoneCompletion} valueColor={v => v >= 80 ? 'bg-emerald-500' : v >= 50 ? 'bg-blue-500' : v >= 25 ? 'bg-amber-500' : 'bg-red-500'} maxValue={100} />
          </PBIVisual>
        </div>

        <PBIVisual title="Recovery Plan Detail" subtitle={`${plans.length} plan${plans.length !== 1 ? 's' : ''} · click to view weekly progress`}>
        <div className="space-y-3 mt-1">
        {plans.map(plan => {
          const isExpanded = expanded === plan.id;
          const stCfg = G2G_STATUS_CFG[plan.status];
          const completedActions = plan.immediate_actions.filter(a => a.done).length;
          const completedMilestones = plan.recovery_milestones.filter(m => m.status === 'completed').length;

          return (
            <div key={plan.id} className={clsx('card overflow-hidden border-l-4',
              plan.status === 'active' ? 'border-l-blue-500' : plan.status === 'on_track' ? 'border-l-green-500' : plan.status === 'stalled' ? 'border-l-red-500' : 'border-l-emerald-500'
            )}>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={clsx('text-xs font-semibold px-2 py-0.5 rounded', stCfg.bg)}>{stCfg.label}</span>
                      <span className={clsx('text-xs font-bold', ewScoreColor(plan.current_ew_score))}>EW: {plan.current_ew_score}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm">{plan.project_name}</h3>
                    <div className="text-xs text-gray-500">
                      {plan.client_name} · PM: {plan.project_manager}
                      {plan.qa_specialist && <> · QA: {plan.qa_specialist}</>}
                      · Target Green: {new Date(plan.target_green_date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs text-gray-400">Started {new Date(plan.started_date).toLocaleDateString()}</div>
                    <div className="text-xs text-gray-400">
                      Actions: {completedActions}/{plan.immediate_actions.length} · Milestones: {completedMilestones}/{plan.recovery_milestones.length}
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">Root Causes</div>
                  <div className="space-y-1">
                    {plan.root_causes.map((rc, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-xs text-gray-700">
                        <span className="text-red-500 mt-0.5 flex-shrink-0">▸</span> {rc}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">Immediate Actions</div>
                    <div className="space-y-1">
                      {plan.immediate_actions.map((a, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-xs">
                          {a.done ? <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" /> : <Clock className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />}
                          <span className={a.done ? 'text-gray-500 line-through' : 'text-gray-700'}>{a.action}</span>
                          <span className="text-gray-400 flex-shrink-0 ml-auto">({a.owner})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">Recovery Milestones</div>
                    <div className="space-y-1">
                      {plan.recovery_milestones.map((m, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-xs">
                          {m.status === 'completed' ? <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                           : m.status === 'in_progress' ? <Activity className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                           : <Clock className="w-3 h-3 text-gray-300 mt-0.5 flex-shrink-0" />}
                          <span className={m.status === 'completed' ? 'text-gray-500' : 'text-gray-700'}>{m.milestone}</span>
                          <span className="text-gray-400 flex-shrink-0 ml-auto">{new Date(m.target_date).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <button onClick={() => setExpanded(isExpanded ? null : plan.id)}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors">
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  {isExpanded ? 'Hide' : 'Show'} weekly progress ({plan.weekly_assessments.length} weeks)
                </button>

                {isExpanded && (
                  <div className="mt-3 border-t border-gray-100 pt-3">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">Weekly Assessments</div>
                    <div className="space-y-2">
                      {plan.weekly_assessments.map((w, i) => (
                        <div key={i} className={clsx('rounded-lg border p-3', w.on_track ? 'bg-green-50/50 border-green-100' : 'bg-red-50/50 border-red-100')}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-gray-700">Week of {new Date(w.week).toLocaleDateString()}</span>
                            <div className="flex items-center gap-2">
                              <span className={clsx('text-xs font-bold', ewScoreColor(w.ew_score))}>EW: {w.ew_score}</span>
                              <span className={clsx('text-xs font-semibold px-2 py-0.5 rounded', w.on_track ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')}>
                                {w.on_track ? 'On Track' : 'Off Track'}
                              </span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-600">{w.notes}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3">
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">Success Criteria</div>
                      <div className="space-y-1">
                        {plan.success_criteria.map((c, i) => (
                          <div key={i} className="flex items-start gap-1.5 text-xs text-gray-600">
                            <Target className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" /> {c}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        </div>
        </PBIVisual>
      </PowerBIFrame>
    </div>
  );
}

// ── Health Reviews Tab ─────────────────────────────────────────────────────
function HealthReviewsTab({ reviews, projects }: { reviews: QAData['health_reviews']; projects: ProjectMonitor[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [reviewModal, setReviewModal] = useState<string | null>(null);
  const NOM_STATUS: Record<NominationStatus, { label: string; bg: string }> = {
    nominated: { label: 'Nominated', bg: 'bg-blue-100 text-blue-700' },
    confirmed: { label: 'Confirmed', bg: 'bg-green-100 text-green-700' },
    presented: { label: 'Presented', bg: 'bg-purple-100 text-purple-700' },
    deferred:  { label: 'Deferred',  bg: 'bg-gray-100 text-gray-600' },
  };

  const totalNom = reviews.nominations.length;
  const totalVAR = reviews.nominations.reduce((s, n) => s + n.value_at_risk, 0);
  const avgEW = totalNom ? Math.round(reviews.nominations.reduce((s, n) => s + n.early_warning_score, 0) / totalNom) : 0;
  const openActions = reviews.post_review_actions.filter(a => !a.done).length;

  const statusSegments: { label: string; value: number; color: string }[] = [
    { label: 'Nominated', value: reviews.nominations.filter(n => n.status === 'nominated').length, color: '#3b82f6' },
    { label: 'Confirmed', value: reviews.nominations.filter(n => n.status === 'confirmed').length, color: '#10b981' },
    { label: 'Presented', value: reviews.nominations.filter(n => n.status === 'presented').length, color: '#9333ea' },
    { label: 'Deferred',  value: reviews.nominations.filter(n => n.status === 'deferred').length,  color: '#9ca3af' },
  ];
  const ewByNomination = reviews.nominations
    .slice()
    .sort((a, b) => b.early_warning_score - a.early_warning_score)
    .map(n => ({
      label: n.project_name.length > 26 ? n.project_name.slice(0, 24) + '…' : n.project_name,
      value: n.early_warning_score,
      sub: n.client_name,
    }));
  const varBars = reviews.nominations
    .filter(n => n.value_at_risk > 0)
    .sort((a, b) => b.value_at_risk - a.value_at_risk)
    .map(n => ({
      label: n.project_name.length > 26 ? n.project_name.slice(0, 24) + '…' : n.project_name,
      value: Math.round(n.value_at_risk / 1000),
      sub: `${fmt(n.value_at_risk)} at risk`,
    }));

  return (
    <div className="space-y-4">
      <PowerBIFrame
        title={`Monthly Regional Health Review — ${reviews.region} ${reviews.current_period}`}
        subtitle="Executive briefing pack · AI-nominated · QA Director validated"
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <PBITile label="Nominated Projects" value={totalNom} sublabel={`${reviews.nominations.filter(n => n.status === 'confirmed').length} confirmed for review`} accent="bg-ms-blue" />
          <PBITile label="Total Value at Risk" value={fmt(totalVAR)} sublabel="Sum across nominated projects" accent={totalVAR > 0 ? 'bg-red-500' : 'bg-emerald-500'} />
          <PBITile label="Avg EW Score" value={<span className={ewScoreColor(avgEW)}>{avgEW}</span>} sublabel="Across nominations" accent={ewBarColor(avgEW)} />
          <PBITile label="Open Actions" value={openActions} sublabel={`${reviews.post_review_actions.length - openActions} of ${reviews.post_review_actions.length} completed`} accent={openActions > 0 ? 'bg-amber-500' : 'bg-emerald-500'} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4">
          <PBIVisual title="Nomination Status" subtitle="Review pipeline state">
            <PBIDonut segments={statusSegments} centerValue={`${totalNom}`} centerLabel="Total" />
          </PBIVisual>
          <PBIVisual title="EW Scores" subtitle="Risk ranking across nominations">
            <PBIBarChart items={ewByNomination} valueColor={ewBarColor} maxValue={100} />
          </PBIVisual>
          <PBIVisual title="Value at Risk" subtitle="In $K, highest exposure first">
            {varBars.length > 0
              ? <PBIBarChart items={varBars} valueColor={v => v >= 1000 ? 'bg-red-500' : v >= 500 ? 'bg-orange-500' : 'bg-amber-500'} />
              : <div className="text-center text-gray-400 text-xs py-6">No value-at-risk this period</div>}
          </PBIVisual>
        </div>

        <PBIVisual title="Nominated Projects" subtitle={`${totalNom} project${totalNom !== 1 ? 's' : ''} · click Review Briefing for executive slide`}>
        <div className="space-y-3 mt-1">
        {reviews.nominations.map(nom => {
          const isExpanded = expanded === nom.id;
          return (
            <div key={nom.id} className="card overflow-hidden">
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={clsx('text-xs font-semibold px-2 py-0.5 rounded', NOM_STATUS[nom.status].bg)}>{NOM_STATUS[nom.status].label}</span>
                      <span className={clsx('text-xs font-bold', ewScoreColor(nom.early_warning_score))}>EW: {nom.early_warning_score}</span>
                      {nom.value_at_risk > 0 && <span className="text-xs text-red-600 font-medium">Value at risk: {fmt(nom.value_at_risk)}</span>}
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm">{nom.project_name}</h3>
                    <div className="text-xs text-gray-500">{nom.client_name}</div>
                  </div>
                </div>

                <div className="rounded-lg bg-gray-50 border border-gray-100 p-3 mb-2">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Nomination Reason</div>
                  <p className="text-xs text-gray-700">{nom.nomination_reason}</p>
                </div>

                <div className="flex items-center gap-3">
                  <button onClick={() => setReviewModal(nom.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ms-blue text-white text-xs font-semibold hover:bg-blue-700 transition-colors">
                    <FileText className="w-3.5 h-3.5" /> Review Briefing
                  </button>
                  <button onClick={() => setExpanded(isExpanded ? null : nom.id)}
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors">
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    {isExpanded ? 'Hide' : 'Show'} preparation materials
                  </button>
                </div>

                {isExpanded && (
                  <div className="mt-3 border-t border-gray-100 pt-3 space-y-3">
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">AI Talking Points</div>
                      <div className="space-y-1">
                        {nom.ai_talking_points.map((tp, i) => (
                          <div key={i} className="flex items-start gap-1.5 text-xs text-gray-700">
                            <span className="text-ms-blue mt-0.5 flex-shrink-0">▸</span> {tp}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-lg bg-blue-50 border border-blue-100 p-3">
                      <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wide mb-1">Preparation Notes for PM</div>
                      <p className="text-xs text-blue-800 leading-relaxed">{nom.preparation_notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        </div>
        </PBIVisual>

        {reviews.post_review_actions.length > 0 && (
          <div className="mt-3">
            <PBIVisual title="Post-Review Action Tracker" subtitle={`${reviews.post_review_actions.filter(a => !a.done).length} open · ${reviews.post_review_actions.filter(a => a.done).length} done`}>
              <table className="w-full text-xs mt-1">
                <thead>
                  <tr className="bg-gray-50 border-b-2 border-gray-200">
                    <th className="text-left px-3 py-2 font-bold text-gray-500 uppercase tracking-wide text-[10px]">Action</th>
                    <th className="text-left px-3 py-2 font-bold text-gray-500 uppercase tracking-wide text-[10px]">Project</th>
                    <th className="text-left px-3 py-2 font-bold text-gray-500 uppercase tracking-wide text-[10px]">Owner</th>
                    <th className="text-left px-3 py-2 font-bold text-gray-500 uppercase tracking-wide text-[10px]">Due</th>
                    <th className="text-center px-3 py-2 font-bold text-gray-500 uppercase tracking-wide text-[10px]">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.post_review_actions.map(a => (
                    <tr key={a.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-3 py-2.5 text-gray-700">{a.action}</td>
                      <td className="px-3 py-2.5 text-gray-500">{a.project_name}</td>
                      <td className="px-3 py-2.5 text-gray-500">{a.owner}</td>
                      <td className="px-3 py-2.5 text-gray-500">{new Date(a.due).toLocaleDateString()}</td>
                      <td className="px-3 py-2.5 text-center">
                        {a.done
                          ? <span className="inline-flex items-center gap-1 text-green-700 font-semibold"><CheckCircle className="w-3 h-3" /> Done</span>
                          : <span className="inline-flex items-center gap-1 text-amber-600 font-semibold"><Clock className="w-3 h-3" /> Open</span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </PBIVisual>
          </div>
        )}
      </PowerBIFrame>

      {reviewModal && (() => {
        const nom = reviews.nominations.find(n => n.id === reviewModal);
        if (!nom) return null;
        const proj = projects.find(p => p.project_id === nom.project_id);
        const reviewData = {
          project_name: nom.project_name,
          client_name: nom.client_name,
          project_manager: proj?.project_manager || 'TBD',
          overall_health: (proj?.overall_health || 'green') as HealthStatus,
          phase: proj?.phase || 'execute',
          budget: proj?.budget || 0,
          actuals: proj?.actuals || 0,
          burn_rate: proj?.burn_rate || 0,
          completion_pct: proj?.completion_pct || 0,
          start_date: proj?.start_date || '',
          end_date: proj?.end_date || '',
          early_warning_score: nom.early_warning_score,
          ew_trend: proj?.early_warning.trend || 'stable',
          ew_trend_delta: proj?.early_warning.trend_delta || 0,
          ew_components: proj?.early_warning.components || {},
          health_dimensions: proj?.health_dimensions || {},
          predictions: {
            d30: (proj?.early_warning.prediction_30d || 'green') as HealthStatus,
            d60: (proj?.early_warning.prediction_60d || 'green') as HealthStatus,
            d90: (proj?.early_warning.prediction_90d || 'green') as HealthStatus,
          },
          ai_assessment: proj?.ai_assessment || 'continue',
          ai_narrative: proj?.ai_narrative || nom.nomination_reason,
          nomination_reason: nom.nomination_reason,
          value_at_risk: nom.value_at_risk,
          talking_points: nom.ai_talking_points,
          preparation_notes: nom.preparation_notes,
          key_risks: nom.ai_talking_points.filter(tp => tp.toLowerCase().includes('risk') || tp.toLowerCase().includes('concern') || tp.toLowerCase().includes('delay') || tp.toLowerCase().includes('gap')),
          key_achievements: nom.ai_talking_points.filter(tp => tp.toLowerCase().includes('success') || tp.toLowerCase().includes('ahead') || tp.toLowerCase().includes('exceeded') || tp.toLowerCase().includes('strong') || tp.toLowerCase().includes('positive') || tp.toLowerCase().includes('completed')),
          recommendation: nom.preparation_notes,
        };
        if (reviewData.key_risks.length === 0) reviewData.key_risks = ['No critical risks identified — standard monitoring continues'];
        if (reviewData.key_achievements.length === 0) reviewData.key_achievements = ['Project progressing per plan'];
        return <HealthReviewModal data={reviewData} onClose={() => setReviewModal(null)} />;
      })()}
    </div>
  );
}

// ── Knowledge Network Tab ──────────────────────────────────────────────────
function KnowledgeNetworkTab({ lessons }: { lessons: Lesson[] }) {
  const [filterCategory, setFilterCategory] = useState('');
  const [search, setSearch] = useState('');

  const filtered = lessons.filter(l => {
    if (filterCategory && l.category !== filterCategory) return false;
    if (search && !l.title.toLowerCase().includes(search.toLowerCase()) && !l.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const byCategory = lessons.reduce<Record<string, number>>((acc, l) => { acc[l.category] = (acc[l.category] || 0) + 1; return acc; }, {});
  const totalConsumed = lessons.reduce((s, l) => s + l.times_consumed, 0);

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {(Object.keys(LESSON_CFG) as LessonCategory[]).map(cat => {
          const cfg = LESSON_CFG[cat];
          const CatIcon = cfg.Icon;
          return (
            <div key={cat} className="card p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilterCategory(filterCategory === cat ? '' : cat)}>
              <div className="flex items-center gap-2 mb-1">
                <CatIcon className={clsx('w-4 h-4', cfg.bg.split(' ')[1])} />
                <div className="text-sm text-gray-500">{cfg.label}</div>
              </div>
              <div className="text-2xl font-bold">{byCategory[cat] || 0}</div>
            </div>
          );
        })}
      </div>

      <div className="card p-4 mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-100">
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          <div>
            <div className="text-sm font-bold text-gray-900">{lessons.length} lessons captured · {totalConsumed} times consumed by live projects</div>
            <div className="text-xs text-gray-500">Feeding into Pipeline Agent (deal risk profiles) and Delivery Agent (phase guidance)</div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input className="input pl-9 text-sm" placeholder="Search lessons..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input w-auto text-sm py-2" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
          <option value="">All Categories</option>
          {(Object.keys(LESSON_CFG) as LessonCategory[]).map(cat => (
            <option key={cat} value={cat}>{LESSON_CFG[cat].label}</option>
          ))}
        </select>
        <span className="text-sm text-gray-400 ml-auto">{filtered.length} lessons</span>
      </div>

      <div className="space-y-3">
        {filtered.map(l => {
          const cfg = LESSON_CFG[l.category];
          const CatIcon = cfg.Icon;
          return (
            <div key={l.id} className="card p-5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={clsx('inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded', cfg.bg)}>
                      <CatIcon className="w-3 h-3" /> {cfg.label}
                    </span>
                    <span className="text-xs text-gray-400">Applicability: {l.applicability_score}/100</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">{l.title}</h3>
                  <div className="text-xs text-gray-500">From: {l.source_project_name}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-bold text-indigo-700">{l.times_consumed}x</div>
                  <div className="text-[10px] text-gray-400">consumed</div>
                </div>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed mb-2">{l.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(l.tags).map(([k, v]) => (
                  <span key={k} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded capitalize">{k.replace(/_/g, ' ')}: {v}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Client Portal Tab ──────────────────────────────────────────────────────
function ClientPortalTab({ views }: { views: ClientView[] }) {
  return (
    <div>
      <div className="card p-5 mb-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-100">
        <div className="flex items-center gap-3">
          <Globe className="w-5 h-5 text-emerald-600" />
          <div>
            <div className="text-sm font-bold text-gray-900">Client-Facing QA Agent — Contract Companion</div>
            <div className="text-xs text-gray-500">Curated, permission-controlled quality assurance visibility for clients. Industry-first differentiator.</div>
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

// ── QA Evals Tab ───────────────────────────────────────────────────────────
function QAEvalsTab({ evals }: { evals: QAEvals }) {
  const pa = evals.prediction_accuracy;
  const rs = evals.recovery_stats;
  const al = evals.alignment;
  const cc = evals.checkpoint_correlation;

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="card p-4 border-l-4 border-l-emerald-500">
          <div className="text-sm text-gray-500">Prediction Precision</div>
          <div className="text-2xl font-bold text-emerald-700">{pa.precision}%</div>
          <div className="text-xs text-gray-400">TP:{pa.true_positives} FP:{pa.false_positives}</div>
        </div>
        <div className="card p-4 border-l-4 border-l-blue-500">
          <div className="text-sm text-gray-500">Prediction Recall</div>
          <div className="text-2xl font-bold text-blue-700">{pa.recall}%</div>
          <div className="text-xs text-gray-400">TP:{pa.true_positives} FN:{pa.false_negatives}</div>
        </div>
        <div className="card p-4 border-l-4 border-l-purple-500">
          <div className="text-sm text-gray-500">G2G Recovery Rate</div>
          <div className="text-2xl font-bold text-purple-700">{rs.recovery_rate}%</div>
          <div className="text-xs text-gray-400">{rs.resolved_within_60d}/{rs.total_g2g_plans} within 60 days</div>
        </div>
        <div className="card p-4 border-l-4 border-l-amber-500">
          <div className="text-sm text-gray-500">Director Override Rate</div>
          <div className="text-2xl font-bold text-amber-700">{al.override_rate.toFixed(1)}%</div>
          <div className="text-xs text-gray-400">{al.director_overrides}/{al.total_assessments} assessments</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card p-5">
          <h3 className="section-title mb-4">Prediction Accuracy — Confusion Matrix</h3>
          <div className="grid grid-cols-2 gap-2 max-w-xs">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-green-700">{pa.true_positives}</div>
              <div className="text-[10px] text-green-600 font-medium">True Positives</div>
              <div className="text-[10px] text-gray-400">Predicted Red → Went Red</div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-red-700">{pa.false_positives}</div>
              <div className="text-[10px] text-red-600 font-medium">False Positives</div>
              <div className="text-[10px] text-gray-400">Predicted Red → Stayed Green</div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-amber-700">{pa.false_negatives}</div>
              <div className="text-[10px] text-amber-600 font-medium">False Negatives</div>
              <div className="text-[10px] text-gray-400">Predicted Green → Went Red</div>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-emerald-700">{pa.true_negatives}</div>
              <div className="text-[10px] text-emerald-600 font-medium">True Negatives</div>
              <div className="text-[10px] text-gray-400">Predicted Green → Stayed Green</div>
            </div>
          </div>
          <div className="mt-3 text-xs text-gray-500">F1 Score: <span className="font-bold text-gray-900">{pa.f1_score}%</span></div>
        </div>

        <div className="card p-5">
          <h3 className="section-title mb-4">Director Override Analysis</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-600">AI Too Aggressive (Director softened)</span>
                <span className="font-bold text-amber-700">{al.override_breakdown.ai_too_aggressive}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${al.total_assessments ? (al.override_breakdown.ai_too_aggressive / al.total_assessments) * 100 : 0}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-600">AI Too Lenient (Director escalated)</span>
                <span className="font-bold text-red-700">{al.override_breakdown.ai_too_lenient}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full" style={{ width: `${al.total_assessments ? (al.override_breakdown.ai_too_lenient / al.total_assessments) * 100 : 0}%` }} />
              </div>
            </div>
            <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
              AI leans conservative — more overrides are from softening than escalating. This is the safer failure mode.
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h3 className="section-title mb-4">Checkpoint Maturity → Outcome Correlation</h3>
          <div className="space-y-3">
            {Object.entries(cc.avg_maturity_by_outcome).map(([outcome, score]) => (
              <div key={outcome}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="capitalize font-medium text-gray-700">Projects ending {outcome}</span>
                  <span className={clsx('font-bold', HEALTH_CFG[outcome as HealthStatus]?.text || 'text-gray-700')}>Avg Maturity: {score}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={clsx('h-full rounded-full', HEALTH_CFG[outcome as HealthStatus]?.dot || 'bg-gray-400')} style={{ width: `${score}%` }} />
                </div>
              </div>
            ))}
            <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
              Projects with high Day 30 maturity scores ({cc.high_maturity_green_rate}%) stay Green. Low maturity scores predict Red outcomes ({cc.low_maturity_red_rate}%).
            </div>
          </div>
        </div>

        <div className="card p-5">
          <h3 className="section-title mb-4">Monthly Trend</h3>
          <div className="space-y-2">
            {evals.monthly_trend.map(m => (
              <div key={m.month} className="flex items-center gap-3 text-xs">
                <span className="w-16 text-gray-500 font-medium">{m.month}</span>
                <div className="flex-1 flex items-center gap-2">
                  <div className="w-20 text-right">
                    <span className={clsx('font-bold', ewScoreColor(m.avg_ew_score))}>EW: {m.avg_ew_score}</span>
                  </div>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${m.portfolio_green_pct}%` }} />
                  </div>
                  <span className="text-gray-500 w-12">{m.portfolio_green_pct}% G</span>
                  <span className="text-gray-400 w-16">{m.predictions_correct}/{m.predictions_total} pred</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Tab Config ─────────────────────────────────────────────────────────────
const TABS: { id: Tab; label: string; Icon: typeof Shield }[] = [
  { id: 'monitor',     label: 'Portfolio Monitor',  Icon: Activity },
  { id: 'checkpoints', label: 'Checkpoints',        Icon: Target },
  { id: 'reviews',     label: 'Health Reviews',     Icon: Users },
  { id: 'g2g',         label: 'Get-to-Green',       Icon: TrendingUp },
];

// ── Main Page ──────────────────────────────────────────────────────────────
export default function QualityAssurance() {
  const navigate = useNavigate();
  const [config, setConfig] = useState<QAConfig | null>(null);
  const [data, setData] = useState<QAData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('monitor');

  useEffect(() => {
    Promise.all([qualityAssuranceApi.getConfig(), qualityAssuranceApi.getData()])
      .then(([c, d]) => { setConfig(c.data); setData(d.data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-12 text-center text-gray-400">Loading quality assurance...</div>;
  if (!config || !data) return <div className="p-12 text-center text-gray-400">Failed to load QA data.</div>;

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="page-title flex items-center gap-2">
              <Shield className="w-7 h-7 text-ms-blue" />
              AI-Driven Quality Assurance
            </h1>
            <p className="text-sm text-gray-500 mt-1 max-w-2xl">
              Proactive, always-on portfolio quality monitoring — AI-powered early warning, structured recovery, and institutional knowledge that improves every project.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/qa-evals')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-purple-200 bg-purple-50 text-purple-700 text-xs font-semibold hover:bg-purple-100 transition-colors"
            >
              <Target className="w-3.5 h-3.5" />
              AI-QA Evals
              <ArrowRight className="w-3 h-3" />
            </button>
            <button
              onClick={() => navigate('/qa-framework')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-ms-blue/30 bg-ms-blue/5 text-ms-blue text-xs font-semibold hover:bg-ms-blue/10 transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              AI-QA Framework
              <ArrowRight className="w-3 h-3" />
            </button>
            <button onClick={() => { setLoading(true); Promise.all([qualityAssuranceApi.getConfig(), qualityAssuranceApi.getData()]).then(([c, d]) => { setConfig(c.data); setData(d.data); }).finally(() => setLoading(false)); }}
              className="btn-ghost flex items-center gap-1 text-gray-400">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <OKRPanel config={config} />

      <div className="grid grid-cols-4 gap-3 mb-6">
        {TABS.map(t => {
          const TabIcon = t.Icon;
          const isActive = tab === t.id;
          const counts: Record<Tab, () => string> = {
            monitor: () => data ? `${data.portfolio_monitor.length} projects` : '',
            checkpoints: () => data ? `${data.checkpoints.length} assessments` : '',
            reviews: () => data ? `${data.health_reviews.nominations.length} nominated` : '',
            g2g: () => data ? `${data.get_to_green.length} plans` : '',
          };
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={clsx(
                'relative flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left',
                isActive
                  ? 'border-ms-blue bg-ms-blue/5 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
              )}
            >
              <div className={clsx('w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                isActive ? 'bg-ms-blue' : 'bg-gray-100')}>
                <TabIcon className={clsx('w-5 h-5', isActive ? 'text-white' : 'text-gray-500')} />
              </div>
              <div>
                <div className={clsx('text-sm font-semibold', isActive ? 'text-ms-blue' : 'text-gray-700')}>{t.label}</div>
                <div className="text-[11px] text-gray-400">{counts[t.id]()}</div>
              </div>
              {isActive && <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-ms-blue rounded-full" />}
            </button>
          );
        })}
      </div>

      {tab === 'monitor' && <PortfolioMonitorTab projects={data.portfolio_monitor} config={config} />}
      {tab === 'checkpoints' && <CheckpointsTab checkpoints={data.checkpoints} />}
      {tab === 'g2g' && <GetToGreenTab plans={data.get_to_green} />}
      {tab === 'reviews' && <HealthReviewsTab reviews={data.health_reviews} projects={data.portfolio_monitor} />}
    </div>
  );
}
