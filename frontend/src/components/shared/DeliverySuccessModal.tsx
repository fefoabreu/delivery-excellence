import { useState, useEffect } from 'react';
import {
  X, ChevronDown, CheckCircle, AlertTriangle, TrendingUp, ArrowUp, ArrowDown,
  Users, BookOpen, Presentation, ChevronRight, Activity, Target,
  Sparkles, Network, Layers, Calendar,
} from 'lucide-react';
import clsx from 'clsx';
import {
  DeliverySuccessData, CapabilityDimension, ComparableEngagement, AppliedLesson,
  RecommendedTeam, KeyMilestone, FailureMode,
  successColor, outcomeStyle, capacityBadge, riskStyle,
} from '../../data/delivery-success-data';

interface Props {
  dealName: string;
  clientName: string;
  data: DeliverySuccessData;
  onClose: () => void;
}

const LESSON_CFG: Record<string, { label: string; cls: string }> = {
  success_pattern:     { label: 'Success Pattern',     cls: 'bg-emerald-100 text-emerald-700' },
  failure_mode:        { label: 'Failure Mode',        cls: 'bg-red-100 text-red-700' },
  risk_mitigation:     { label: 'Risk Mitigation',     cls: 'bg-amber-100 text-amber-700' },
  process_improvement: { label: 'Process Improvement', cls: 'bg-blue-100 text-blue-700' },
};

const FORECAST_DOT: Record<string, string> = {
  green: 'bg-emerald-500',
  amber: 'bg-amber-500',
  red:   'bg-red-500',
};
const FORECAST_TEXT: Record<string, string> = {
  green: 'text-emerald-700',
  amber: 'text-amber-700',
  red:   'text-red-700',
};

// ── Slide cards ─────────────────────────────────────────────────────────────
function BriefCard({ label, text, accent }: { label: string; text: string; accent?: boolean }) {
  return (
    <div className={clsx('rounded-lg border p-3 flex flex-col gap-1', accent ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200')}>
      <div className={clsx('text-[9px] font-bold uppercase tracking-widest', accent ? 'text-slate-400' : 'text-gray-400')}>{label}</div>
      <p className={clsx('text-[11px] leading-relaxed line-clamp-4', accent ? 'text-white' : 'text-gray-700')}>{text}</p>
    </div>
  );
}

function SlideCapRow({ dim }: { dim: CapabilityDimension }) {
  const sc = successColor(dim.score);
  const pct = (dim.score / 10) * 100;
  return (
    <div className="flex items-center gap-2 py-0.5">
      <div className={clsx('w-2 h-2 rounded-full flex-shrink-0', sc.dot)} />
      <span className="text-[10px] text-gray-600 w-40 flex-shrink-0 truncate">{dim.label}</span>
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={clsx('h-full rounded-full', sc.dot)} style={{ width: `${pct}%` }} />
      </div>
      <span className={clsx('text-[10px] font-bold w-6 text-right flex-shrink-0', sc.text)}>{dim.score.toFixed(1)}</span>
    </div>
  );
}

function SlideCompRow({ comp }: { comp: ComparableEngagement }) {
  const oc = outcomeStyle(comp.outcome);
  const dot = comp.outcome === 'green' ? 'bg-emerald-500' : comp.outcome === 'amber' ? 'bg-amber-500' : comp.outcome === 'red' ? 'bg-red-500' : 'bg-gray-400';
  return (
    <div className="flex items-center gap-2 py-0.5">
      <div className={clsx('w-2 h-2 rounded-full flex-shrink-0', dot)} />
      <span className="text-[10px] text-gray-700 flex-1 truncate">{comp.name}</span>
      <span className={clsx('text-[10px] font-semibold flex-shrink-0', oc.color)}>{oc.label}</span>
    </div>
  );
}

function SlideLessonRow({ lesson }: { lesson: AppliedLesson }) {
  const cfg = LESSON_CFG[lesson.category];
  return (
    <div className="flex items-start gap-2 py-0.5">
      <span className={clsx('text-[8px] font-bold px-1 py-0.5 rounded uppercase tracking-wide flex-shrink-0 w-14 text-center', cfg.cls)}>
        {lesson.category === 'success_pattern' ? 'Success' : lesson.category === 'failure_mode' ? 'Failure' : lesson.category === 'risk_mitigation' ? 'Mitigate' : 'Process'}
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] text-gray-700 leading-snug line-clamp-2">{lesson.title}</div>
        <div className="text-[9px] text-gray-400 mt-0.5">{lesson.sourceProject} · {lesson.applicability}% fit</div>
      </div>
    </div>
  );
}

function SlideTeamRow({ member }: { member: RecommendedTeam }) {
  const initials = member.pmName.split(' ').map(n => n[0]).join('').slice(0, 2);
  const cap = capacityBadge(member.capacityBand);
  return (
    <div className="flex items-center gap-2 py-0.5">
      <div className="w-5 h-5 rounded-full bg-slate-700 text-white flex items-center justify-center text-[9px] font-bold flex-shrink-0">{initials}</div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-semibold text-gray-800 truncate">{member.pmName}</div>
        <div className="text-[9px] text-gray-400 truncate">{member.role}</div>
      </div>
      <span className={clsx('text-[8px] font-semibold px-1 py-0.5 rounded uppercase tracking-wide flex-shrink-0', cap.bg, cap.text)}>{cap.label}</span>
    </div>
  );
}

// ── Trajectory mini-chart ───────────────────────────────────────────────────
function TrajectoryChart({ data }: { data: DeliverySuccessData }) {
  const points = [
    { x: 0,   label: 'Start', health: data.trajectory.d30 === 'green' ? 'green' : 'green', ew: data.trajectory.predictedEwAtStart },
    { x: 30,  label: 'D30',   health: data.trajectory.d30, ew: data.trajectory.predictedEwAtStart + (data.trajectory.predictedEwAt90 - data.trajectory.predictedEwAtStart) * 0.33 },
    { x: 60,  label: 'D60',   health: data.trajectory.d60, ew: data.trajectory.predictedEwAtStart + (data.trajectory.predictedEwAt90 - data.trajectory.predictedEwAtStart) * 0.66 },
    { x: 90,  label: 'D90',   health: data.trajectory.d90, ew: data.trajectory.predictedEwAt90 },
  ];
  const maxEw = 100;
  const W = 280, H = 60, PAD = 8;
  const xScale = (x: number) => PAD + (x / 90) * (W - PAD * 2);
  const yScale = (ew: number) => PAD + (1 - ew / maxEw) * (H - PAD * 2);

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xScale(p.x).toFixed(1)} ${yScale(p.ew).toFixed(1)}`).join(' ');

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-16">
      {/* threshold lines */}
      <line x1={PAD} x2={W - PAD} y1={yScale(60)} y2={yScale(60)} stroke="#fbbf24" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.5" />
      <line x1={PAD} x2={W - PAD} y1={yScale(80)} y2={yScale(80)} stroke="#ef4444" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.5" />
      {/* trajectory path */}
      <path d={pathD} stroke="#0078d4" strokeWidth="1.5" fill="none" />
      {/* points */}
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={xScale(p.x)} cy={yScale(p.ew)} r="3" className={FORECAST_DOT[p.health]} fill="currentColor" />
          <text x={xScale(p.x)} y={H - 1} fontSize="6" textAnchor="middle" fill="#9ca3af">{p.label}</text>
        </g>
      ))}
    </svg>
  );
}

// ── Accordion section ───────────────────────────────────────────────────────
function AccordionSection({ title, icon: Icon, badge, children }: { title: string; icon: typeof BookOpen; badge?: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-gray-50 transition-colors">
        <Icon className="w-3 h-3 text-gray-400 flex-shrink-0" />
        <span className="text-[11px] font-medium text-gray-700 flex-1">{title}</span>
        {badge && <span className="text-[9px] font-bold text-gray-400 flex-shrink-0">{badge}</span>}
        <ChevronDown className={clsx('w-3.5 h-3.5 text-gray-400 flex-shrink-0 transition-transform duration-150', open && 'rotate-180')} />
      </button>
      {open && <div className="px-3 pb-3 border-t border-gray-50">{children}</div>}
    </div>
  );
}

// ── Slide ───────────────────────────────────────────────────────────────────
function DeliverySuccessSlide({ dealName, clientName, data }: { dealName: string; clientName: string; data: DeliverySuccessData }) {
  const sc = successColor(data.compositeScore);
  const b = data.executiveBrief;
  const traj = data.trajectory;
  const ctx = data.portfolioContext;

  return (
    <div className="bg-white rounded shadow-xl flex flex-col overflow-hidden w-full h-full">
      <div className={clsx('h-1.5 w-full flex-shrink-0', sc.dot)} />

      <div className="flex-1 overflow-y-auto px-8 py-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Delivery Success Intelligence · Synthesized from Knowledge Network + Delivery Agent · Confidential</div>
            <h1 className="text-[19px] font-bold text-gray-900 leading-tight">{dealName}</h1>
            <div className="text-[12px] text-gray-500 mt-0.5">{clientName}</div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="text-center">
              <div className="text-[10px] text-gray-400 uppercase tracking-widest">Success Prob.</div>
              <div className="text-[22px] font-bold text-gray-900 leading-none">{data.successProbability}<span className="text-sm text-gray-400 font-normal">%</span></div>
              <div className="text-[9px] text-gray-400 mt-0.5">Confidence: {data.confidence}</div>
            </div>
            <div className={clsx('px-3 py-1.5 rounded-lg border text-[12px] font-bold', sc.bg, sc.text, sc.border)}>
              {sc.badge}
            </div>
            <div className="text-right">
              <div className={clsx('text-[28px] font-bold leading-none', sc.text)}>{data.compositeScore.toFixed(1)}</div>
              <div className="text-[10px] text-gray-400">/ 10</div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 mb-5" />

        {/* Executive Brief */}
        <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">Delivery Confidence Brief</div>
        <div className="grid grid-cols-3 gap-2 mb-2">
          <BriefCard label="Closest Analog" text={b.closestAnalog} accent />
          <BriefCard label="Success Probability" text={b.successProbability} />
          <BriefCard label="Top Risk Pattern" text={b.topRiskPattern} />
        </div>
        <div className="grid grid-cols-2 gap-2 mb-5">
          <BriefCard label="Capacity & Team Match" text={b.capacityMatch} />
          <BriefCard label="Decision Guidance" text={b.decisionGuidance} />
        </div>

        <div className="border-t border-gray-100 mb-5" />

        {/* Trajectory chart band */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Predicted Trajectory · Synthesized from comparable engagements</div>
            <div className="flex items-center gap-3 text-[9px]">
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Green</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500" /> Amber</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500" /> Red</span>
            </div>
          </div>
          <div className="grid grid-cols-[1fr_220px] gap-4">
            <div className="rounded-lg border border-gray-200 p-3 bg-gradient-to-br from-slate-50 to-white">
              <TrajectoryChart data={data} />
              <p className="text-[10px] text-gray-600 leading-relaxed mt-1">{traj.rationale}</p>
            </div>
            <div className="grid grid-cols-4 gap-1">
              {(['d30','d60','d90','end'] as const).map(k => {
                const v = traj[k];
                return (
                  <div key={k} className="text-center rounded border border-gray-200 bg-white p-1.5">
                    <div className="text-[8px] text-gray-400 uppercase">{k === 'end' ? 'End' : k.toUpperCase().replace('D', 'Day ')}</div>
                    <div className={clsx('w-3 h-3 rounded-full mx-auto mt-1', FORECAST_DOT[v])} />
                    <div className={clsx('text-[9px] font-semibold mt-0.5', FORECAST_TEXT[v])}>{v}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 mb-5" />

        {/* Lower: capabilities | references / lessons / team */}
        <div className="grid grid-cols-[1fr_200px] gap-6">
          {/* Capability scorecard */}
          <div>
            <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">Delivery Capabilities</div>
            <div className="space-y-1.5">
              {data.capabilities.map(dim => <SlideCapRow key={dim.key} dim={dim} />)}
            </div>

            <div className="mt-4 grid grid-cols-4 gap-2">
              <div className="rounded-lg border border-gray-200 p-2 text-center">
                <div className="text-[14px] font-bold text-gray-900">{ctx.similarCompleted + ctx.similarActive}</div>
                <div className="text-[9px] text-gray-400">Similar engagements</div>
              </div>
              <div className="rounded-lg border border-gray-200 p-2 text-center">
                <div className="text-[14px] font-bold text-emerald-700">{ctx.overallSuccessRate}<span className="text-[10px] text-gray-400 font-normal">%</span></div>
                <div className="text-[9px] text-gray-400">Historical success</div>
              </div>
              <div className="rounded-lg border border-gray-200 p-2 text-center">
                <div className="text-[14px] font-bold text-gray-900">{ctx.avgFinalCsat.toFixed(1)}</div>
                <div className="text-[9px] text-gray-400">Avg CSAT</div>
              </div>
              <div className="rounded-lg border border-gray-200 p-2 text-center flex items-center justify-center gap-1">
                <span className="text-[12px] font-bold text-gray-900">{ctx.recentTrendDirection}</span>
                {ctx.recentTrendDirection === 'improving' ? <ArrowDown className="w-3 h-3 text-emerald-500" />
                  : ctx.recentTrendDirection === 'declining' ? <ArrowUp className="w-3 h-3 text-red-500" /> : null}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {/* Comparables */}
            <div>
              <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Comparable Engagements</div>
              <div className="space-y-1">
                {data.comparables.slice(0, 5).map((c, i) => <SlideCompRow key={i} comp={c} />)}
              </div>
            </div>

            {/* Applied lessons */}
            <div>
              <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Knowledge Network · Applied</div>
              <div className="space-y-1.5">
                {data.appliedLessons.slice(0, 4).map((l, i) => <SlideLessonRow key={i} lesson={l} />)}
              </div>
            </div>

            {/* Recommended Team */}
            <div>
              <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Recommended Team</div>
              <div className="space-y-1">
                {data.recommendedTeam.slice(0, 4).map((m, i) => <SlideTeamRow key={i} member={m} />)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 border-t border-gray-100 px-8 py-2 flex items-center justify-between">
        <span className="text-[9px] text-gray-400">Delivery Excellence · QA Knowledge Network + Delivery Agent · AI-Generated · {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        <span className="text-[9px] text-gray-300">Slide 1 of 1</span>
      </div>
    </div>
  );
}

// ── Main Modal ──────────────────────────────────────────────────────────────
export default function DeliverySuccessModal({ dealName, clientName, data, onClose }: Props) {
  const sc = successColor(data.compositeScore);

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
          <span className="text-white text-[13px] font-medium flex-1 truncate">{dealName} — Delivery Success Intelligence</span>
          <div className={clsx('flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold', sc.bg, sc.text)}>
            {sc.badge} · {data.compositeScore.toFixed(1)} / 10
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
          <span className="ml-auto text-[10px] text-gray-400 select-none">Delivery Excellence · Cross-Agent Intelligence</span>
        </div>

        {/* Slide + Right Panel */}
        <div className="flex flex-1 min-h-0">
          <div className="flex-1 overflow-hidden flex items-stretch p-6" style={{ background: '#c8c8c8' }}>
            <DeliverySuccessSlide dealName={dealName} clientName={clientName} data={data} />
          </div>

          <div className="w-72 bg-white border-l border-gray-200 flex flex-col overflow-hidden flex-shrink-0">
            <div className="px-3 py-2 border-b border-gray-200 flex-shrink-0">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cross-Agent Detail</div>
              <div className="text-[9px] text-gray-400 mt-0.5">Knowledge Network · Portfolio · Capacity · Forecast</div>
            </div>
            <div className="flex-1 overflow-y-auto">

              <AccordionSection title="Capability Detail" icon={Target} badge={`${data.capabilities.length}`}>
                <div className="mt-2 space-y-2">
                  {data.capabilities.map((c, i) => {
                    const cscore = successColor(c.score);
                    return (
                      <div key={i} className="border border-gray-200 rounded p-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-semibold text-gray-900">{c.label}</span>
                          <span className={clsx('text-[10px] font-bold', cscore.text)}>{c.score.toFixed(1)} · {c.weight}</span>
                        </div>
                        <p className="text-[10px] text-gray-600 leading-relaxed mb-1">{c.evidence}</p>
                        {c.gaps.length > 0 && (
                          <div className="mb-1">
                            {c.gaps.map((g, gi) => (
                              <div key={gi} className="flex items-start gap-1">
                                <AlertTriangle className="w-2.5 h-2.5 text-amber-500 mt-0.5 flex-shrink-0" />
                                <p className="text-[10px] text-gray-700 leading-snug">{g}</p>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="flex items-start gap-1 pt-1 border-t border-gray-100">
                          <ChevronRight className="w-2.5 h-2.5 text-slate-600 mt-0.5 flex-shrink-0" />
                          <p className="text-[10px] text-slate-700 font-medium leading-snug">{c.recommendation}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </AccordionSection>

              <AccordionSection title="Comparable Engagements" icon={Network} badge={`${data.comparables.length}`}>
                <div className="mt-2 space-y-2">
                  {data.comparables.map((c, i) => {
                    const oc = outcomeStyle(c.outcome);
                    return (
                      <div key={i} className="border border-gray-200 rounded p-2">
                        <div className="flex items-center gap-1.5 mb-1">
                          <div className={clsx('w-2 h-2 rounded-full flex-shrink-0',
                            c.outcome === 'green' ? 'bg-emerald-500' : c.outcome === 'amber' ? 'bg-amber-500' : c.outcome === 'red' ? 'bg-red-500' : 'bg-gray-400')} />
                          <span className="text-[11px] font-semibold text-gray-900 leading-snug flex-1">{c.name}</span>
                          <span className={clsx('text-[9px] font-bold flex-shrink-0', oc.color)}>{oc.label}</span>
                        </div>
                        <div className="text-[10px] text-gray-400 mb-1">{c.industry} · {c.serviceLine} · {c.budget} · {c.duration} · {c.relevance} relevance</div>
                        <p className="text-[10px] text-gray-600 leading-relaxed">{c.keyTakeaway}</p>
                        {c.csat !== undefined && c.csat > 0 && (
                          <div className="flex items-center gap-2 mt-1 pt-1 border-t border-gray-100 text-[9px]">
                            <span className="text-gray-500">CSAT: <span className="font-bold text-emerald-700">{c.csat.toFixed(1)}</span></span>
                            <span className="text-gray-500">Margin: <span className={clsx('font-bold', c.marginVariance >= 0 ? 'text-emerald-700' : 'text-red-700')}>{c.marginVariance >= 0 ? '+' : ''}{c.marginVariance}%</span></span>
                            <span className="text-gray-500">Schedule: <span className={clsx('font-bold', c.scheduleVariance <= 0 ? 'text-emerald-700' : 'text-red-700')}>{c.scheduleVariance > 0 ? '+' : ''}{c.scheduleVariance}wk</span></span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </AccordionSection>

              <AccordionSection title="Knowledge Network · Applied Lessons" icon={BookOpen} badge={`${data.appliedLessons.length}`}>
                <div className="mt-2 space-y-2">
                  {data.appliedLessons.map((l, i) => {
                    const cfg = LESSON_CFG[l.category];
                    return (
                      <div key={i} className="border border-gray-200 rounded p-2">
                        <div className="flex items-start gap-1.5 mb-1">
                          <span className={clsx('text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide flex-shrink-0', cfg.cls)}>{cfg.label}</span>
                          <span className="text-[10px] font-bold text-gray-400 ml-auto flex-shrink-0">{l.applicability}%</span>
                        </div>
                        <div className="text-[11px] font-semibold text-gray-900 leading-snug mb-1">{l.title}</div>
                        <div className="text-[9px] text-gray-400 mb-1">Source: {l.sourceProject}</div>
                        <p className="text-[10px] text-gray-600 leading-relaxed mb-1">{l.description}</p>
                        <div className="flex items-start gap-1 pt-1 border-t border-gray-100">
                          <Sparkles className="w-2.5 h-2.5 text-amber-500 mt-0.5 flex-shrink-0" />
                          <p className="text-[10px] text-slate-700 font-medium leading-snug">{l.actionable}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </AccordionSection>

              <AccordionSection title="Recommended Team & Capacity" icon={Users} badge={`${data.recommendedTeam.length}`}>
                <div className="mt-2 space-y-2">
                  {data.recommendedTeam.map((m, i) => {
                    const cap = capacityBadge(m.capacityBand);
                    return (
                      <div key={i} className="border border-gray-200 rounded p-2">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-6 h-6 rounded-full bg-slate-700 text-white flex items-center justify-center text-[9px] font-bold flex-shrink-0">
                            {m.pmName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[11px] font-semibold text-gray-900 truncate">{m.pmName}</div>
                            <div className="text-[9px] text-gray-400">{m.role}</div>
                          </div>
                          <span className={clsx('text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide flex-shrink-0', cap.bg, cap.text)}>{cap.label}</span>
                        </div>
                        <p className="text-[10px] text-gray-600 leading-relaxed mb-1">{m.relevantExperience}</p>
                        <div className="flex items-center gap-2 text-[9px] pt-1 border-t border-gray-100">
                          {m.csatHistory > 0 && <span className="text-gray-500">CSAT: <span className="font-bold text-emerald-700">{m.csatHistory.toFixed(1)}</span></span>}
                          <span className="text-gray-500">·</span>
                          <span className="text-gray-500">{m.availability}</span>
                        </div>
                        <p className="text-[9px] text-gray-400 italic mt-1">{m.trackRecord}</p>
                      </div>
                    );
                  })}
                </div>
              </AccordionSection>

              <AccordionSection title="30/60/90 Forecast & Key Milestones" icon={Calendar} badge={`${data.keyMilestones.length}`}>
                <div className="mt-2 space-y-2">
                  {data.keyMilestones.map((km, i) => {
                    const rs = riskStyle(km.risk);
                    return (
                      <div key={i} className="border border-gray-200 rounded p-2">
                        <div className="flex items-center gap-1.5 mb-1">
                          <div className={clsx('w-2 h-2 rounded-full flex-shrink-0', rs.dot)} />
                          <span className="text-[11px] font-semibold text-gray-900 leading-snug flex-1">{km.milestone}</span>
                          <span className={clsx('text-[9px] font-bold uppercase flex-shrink-0', rs.text)}>{km.risk}</span>
                        </div>
                        <div className="text-[9px] text-gray-400 mb-1">{km.timing}</div>
                        <p className="text-[10px] text-gray-600 leading-relaxed mb-1">{km.signal}</p>
                        <div className="flex items-start gap-1 pt-1 border-t border-gray-100">
                          <ChevronRight className="w-2.5 h-2.5 text-slate-600 mt-0.5 flex-shrink-0" />
                          <p className="text-[10px] text-slate-700 font-medium leading-snug">{km.preventive}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </AccordionSection>

              <AccordionSection title="Failure Modes to Watch" icon={AlertTriangle} badge={`${data.failureModes.length}`}>
                <div className="mt-2 space-y-2">
                  {data.failureModes.map((fm, i) => (
                    <div key={i} className="border border-gray-200 rounded p-2">
                      <div className="flex items-start gap-1.5 mb-1">
                        <AlertTriangle className="w-3 h-3 text-amber-500 mt-0.5 flex-shrink-0" />
                        <span className="text-[11px] font-semibold text-gray-900 leading-snug">{fm.mode}</span>
                      </div>
                      <div className="text-[9px] text-gray-400 mb-1">Historical frequency: {fm.historicalFrequency}</div>
                      {fm.earlyWarnings.length > 0 && (
                        <div className="mb-1">
                          <div className="text-[9px] font-bold text-gray-500 uppercase tracking-wide mb-0.5">Early warnings</div>
                          {fm.earlyWarnings.map((w, wi) => (
                            <div key={wi} className="flex items-start gap-1">
                              <span className="text-amber-500 mt-0.5 flex-shrink-0">·</span>
                              <p className="text-[10px] text-gray-600 leading-snug">{w}</p>
                            </div>
                          ))}
                        </div>
                      )}
                      {fm.preventiveActions.length > 0 && (
                        <div className="mb-1 pt-1 border-t border-gray-100">
                          <div className="text-[9px] font-bold text-gray-500 uppercase tracking-wide mb-0.5">Preventive actions</div>
                          {fm.preventiveActions.map((a, ai) => (
                            <div key={ai} className="flex items-start gap-1">
                              <CheckCircle className="w-2 h-2 text-emerald-500 mt-1 flex-shrink-0" />
                              <p className="text-[10px] text-gray-700 leading-snug">{a}</p>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="text-[9px] text-red-600 font-medium mt-1">If it materializes: {fm.costIfMaterializes}</div>
                    </div>
                  ))}
                </div>
              </AccordionSection>

              <AccordionSection title="Portfolio Context" icon={Layers}>
                <div className="mt-2 grid grid-cols-2 gap-1.5 text-[10px]">
                  <div className="rounded border border-gray-200 p-2">
                    <div className="text-[9px] text-gray-400">Similar active</div>
                    <div className="text-[14px] font-bold text-gray-900">{data.portfolioContext.similarActive}</div>
                  </div>
                  <div className="rounded border border-gray-200 p-2">
                    <div className="text-[9px] text-gray-400">Similar completed</div>
                    <div className="text-[14px] font-bold text-gray-900">{data.portfolioContext.similarCompleted}</div>
                  </div>
                  <div className="rounded border border-gray-200 p-2">
                    <div className="text-[9px] text-gray-400">Success rate</div>
                    <div className="text-[14px] font-bold text-emerald-700">{data.portfolioContext.overallSuccessRate}%</div>
                  </div>
                  <div className="rounded border border-gray-200 p-2">
                    <div className="text-[9px] text-gray-400">Avg CSAT</div>
                    <div className="text-[14px] font-bold text-gray-900">{data.portfolioContext.avgFinalCsat.toFixed(1)}</div>
                  </div>
                  <div className="rounded border border-gray-200 p-2 col-span-2">
                    <div className="text-[9px] text-gray-400">Margin variance · Trend</div>
                    <div className="flex items-center gap-2">
                      <span className={clsx('text-[14px] font-bold', data.portfolioContext.avgMarginVariance >= 0 ? 'text-emerald-700' : 'text-red-700')}>{data.portfolioContext.avgMarginVariance >= 0 ? '+' : ''}{data.portfolioContext.avgMarginVariance}%</span>
                      <span className="text-[10px] text-gray-500 capitalize">· {data.portfolioContext.recentTrendDirection}</span>
                    </div>
                  </div>
                </div>
              </AccordionSection>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
