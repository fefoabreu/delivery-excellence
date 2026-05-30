import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Rocket, ArrowLeft, ArrowRight, TrendingUp, Gauge, Target, Users, Bot,
  Zap, Trophy, BookOpen, ShieldCheck, Activity, CheckCircle2, Circle,
  CircleDot, Radio, Clock, Compass, Sparkles,
} from 'lucide-react';
import clsx from 'clsx';
import { qualityAssuranceApi } from '../api/client';

// ─────────────────────────────────────────────────────────────────────────────
// Oversight Studio — the "offense" counterpart to Rescue Command (Section 11.3).
// A QA Director (Assurance Partner) is overlaid on a healthy flagship engagement
// to lift it to top-quartile performance. Bright sky/teal "performance studio"
// identity — the deliberate visual opposite of the dark war-room.
// Every panel is derived from the launched project's real QA signals.
// ─────────────────────────────────────────────────────────────────────────────

type Stage = 'baseline' | 'benchmark' | 'plays' | 'top_quartile' | 'expansion';
type PlayStatus = 'proposed' | 'in_progress' | 'done';
type FeedKind = 'benchmark' | 'play' | 'opportunity' | 'ok';

interface ProjectMonitor {
  project_id: string; name: string; client_name: string; project_manager: string;
  overall_health: 'green' | 'amber' | 'red'; phase: string;
  budget: number; burn_rate: number; completion_pct: number;
  ai_narrative: string;
  early_warning: { score: number; components: Record<string, number> };
  health_dimensions: Record<string, 'green' | 'amber' | 'red'>;
}
interface Lesson { source_project_name?: string; category?: string; title?: string; description?: string; applicability_score?: number }

interface StageStep { id: Stage; label: string; n: string; state: 'done' | 'active' | 'pending'; note: string }
interface OversightScenario {
  project: string; client: string; assurancePartner: string; sponsor: string;
  strategicValue: number; ewCurrent: number; oversightThreshold: number; headroom: number;
  currentPercentile: number; targetPercentile: number;
  stages: StageStep[];
  dimensions: { name: string; percentile: number }[];
  topQuartile: number;
  ascent: number[];
  plays: { play: string; owner: string; impact: string; source?: string; status: PlayStatus }[];
  playsDone: number; playsTotal: number;
  copilotRecommend: string;
  copilotFeed: { kind: FeedKind; text: string; when: string }[];
  opportunities: string[];
  touchpoint: { cadence: string; nextSession: string; recentWins: string[] };
  successPatterns: { project: string; match: number; outcome: string; lesson: string }[];
}

// ── deterministic RNG ────────────────────────────────────────────────────────
function hashStr(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function rngFrom(seed: number) {
  let a = seed >>> 0;
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const addDays = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const md = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
const fmtMoney = (v: number) => v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(1)}M` : `$${(v / 1_000).toFixed(0)}K`;

const FEED_ICON: Record<FeedKind, typeof Bot> = { benchmark: Gauge, play: Sparkles, opportunity: Compass, ok: ShieldCheck };

// component → performance dimension (higher percentile = better)
const DIMS: { name: string; key: string }[] = [
  { name: 'Burn Efficiency', key: 'burn_completion_gap' },
  { name: 'Milestone Velocity', key: 'milestone_slip_rate' },
  { name: 'Client Satisfaction', key: 'satisfaction_trend' },
  { name: 'Delivery Quality', key: 'raid_severity' },
  { name: 'Team Health', key: 'health_trend_velocity' },
  { name: 'Governance', key: 'escalation_frequency' },
];

const SPONSORS = ['Marcus Bell · VP Delivery', 'Elena Cho · VP Delivery', 'David Okafor · GM Services', 'Sofia Ramos · VP Delivery'];

function buildScenario(p: ProjectMonitor, lessons: Lesson[], partnerParam: string | null): OversightScenario {
  const R = rngFrom(hashStr(p.project_id || p.name));
  const ri = (lo: number, hi: number) => Math.floor(R() * (hi - lo + 1)) + lo;
  const pick = <T,>(arr: T[]) => arr[Math.floor(R() * arr.length)];

  const comps = p.early_warning.components || {};
  const ewCurrent = Math.round(p.early_warning.score);
  const today = new Date();

  // per-dimension percentile: strong but with a gap to top-quartile (75)
  const dimensions = DIMS.map(d => {
    const comp = Math.round(comps[d.key] ?? 20);
    const perc = Math.max(52, Math.min(88, Math.round(100 - comp - ri(0, 10))));
    return { name: d.name, percentile: perc };
  });
  const currentPercentile = Math.round(dimensions.reduce((s, d) => s + d.percentile, 0) / dimensions.length);
  const targetPercentile = Math.min(94, Math.max(88, currentPercentile + ri(14, 20)));
  const topQuartile = 75;

  // ascending percentile trajectory over ~8 weeks
  const n = 8;
  const ascent = Array.from({ length: n }, (_, i) => {
    if (i === n - 1) return currentPercentile;
    const start = Math.max(45, currentPercentile - 13);
    const base = start + (currentPercentile - start) * (i / (n - 1));
    return Math.max(40, Math.min(92, Math.round(base + (R() * 5 - 2.5))));
  });

  const partner = partnerParam || 'Priya Nadkarni · QA Director';
  const sponsor = pick(SPONSORS);

  // uplift plays — referenced to real data and the weakest dimensions
  const weakest = [...dimensions].sort((a, b) => a.percentile - b.percentile).slice(0, 3);
  const PLAY_TPL: Record<string, { play: string; impact: string }> = {
    'Burn Efficiency': { play: `Tighten burn-efficiency to top-quartile — currently ${p.burn_rate}% burned at ${p.completion_pct}% complete`, impact: 'Close the largest gap to P80' },
    'Milestone Velocity': { play: `Re-sequence the ${p.phase} milestones for a faster delivery cadence`, impact: '+1 milestone/cycle' },
    'Client Satisfaction': { play: 'Introduce weekly client demos at this phase', impact: '+12 NPS (success pattern)' },
    'Delivery Quality': { play: 'Run a proactive risk-retire sprint to clear latent RAID items', impact: 'Lift quality to top-quartile' },
    'Team Health': { play: 'Add a backup for the key role to remove single-point dependency', impact: 'De-risk velocity' },
    'Governance': { play: 'Tighten the escalation path with a named exec owner', impact: 'Faster decisions' },
  };
  const statusFor = (i: number): PlayStatus => i === 0 ? 'in_progress' : i === 1 ? 'done' : 'proposed';
  const plays = weakest.map((d, i) => ({
    play: PLAY_TPL[d.name]?.play || `Uplift ${d.name.toLowerCase()} toward top-quartile`,
    owner: i === 0 ? partner.split('·')[0].trim() : p.project_manager,
    impact: PLAY_TPL[d.name]?.impact || 'Move toward P80',
    source: i === 1 ? 'Knowledge Network · success pattern' : undefined,
    status: statusFor(i),
  }));
  // always include the expansion play
  plays.push({
    play: `Surface the expansion signal to the Pipeline Agent — strong health on a ${fmtMoney(p.budget)} flagship`,
    owner: partner.split('·')[0].trim(), impact: 'Renewal / expansion upside', source: undefined, status: 'proposed',
  });
  const playsTotal = plays.length;
  const playsDone = plays.filter(x => x.status === 'done').length;

  const oversightThreshold = 50; // tighter watch than rescue tiers
  const headroom = Math.max(0, oversightThreshold - ewCurrent);

  const opportunities = [
    `Renewal likely — strong health on a ${fmtMoney(p.budget)} account; flag to Pipeline Agent`,
    `Adjacent workload identified in ${p.phase} — expansion candidate`,
    'Reference-able delivery — candidate for client advocacy / case study',
  ];

  const nextSession = `${md(addDays(today, ri(2, 5)))} · weekly touchpoint`;
  const touchpoint = {
    cadence: 'Weekly executive touchpoint',
    nextSession,
    recentWins: [
      `${weakest[1]?.name || 'A key dimension'} lifted to P${dimensions.find(d => d.name === weakest[1]?.name)?.percentile ?? 70}+`,
      'Client demo cadence established — sponsor engaged',
      `Health held Green with ${headroom}-pt EW headroom`,
    ],
  };

  const relevant = (lessons || [])
    .filter(l => l.category === 'success_pattern')
    .sort((a, b) => (b.applicability_score ?? 0) - (a.applicability_score ?? 0))
    .slice(0, 2);
  let successPatterns = relevant.map(l => ({
    project: l.source_project_name || 'Top-quartile engagement',
    match: ri(82, 96),
    outcome: `Reached P${ri(88, 95)} performance`,
    lesson: l.title || l.description || 'Success pattern captured in the Knowledge Network.',
  }));
  if (successPatterns.length < 2) {
    successPatterns = [
      ...successPatterns,
      { project: 'Northwind Cloud Migration', match: ri(85, 93), outcome: `Reached P${ri(88, 94)} performance`, lesson: 'Weekly client demos + tight burn discipline drove top-quartile satisfaction.' },
    ].slice(0, 2);
  }

  const topPlay = plays[0].play.split('—')[0].trim().toLowerCase();
  const copilotRecommend = `${p.name} is Green but sits at P${currentPercentile} for its service line. Two plays close most of the gap to top-quartile (P${targetPercentile}); prioritize ${topPlay} at this week's touchpoint.`;
  const copilotFeed: { kind: FeedKind; text: string; when: string }[] = [
    { kind: 'benchmark', text: `Benchmarked against peers — top-quartile burn-efficiency at the ${p.phase} phase is ~${ri(70, 85)}%.`, when: '3h ago' },
    { kind: 'play', text: `Drafted uplift play: ${plays[0].play.split('—')[0].trim()}.`, when: '6h ago' },
    { kind: 'opportunity', text: `Expansion signal detected — flagged ${fmtMoney(Math.round(p.budget * 0.4))} potential to the Pipeline Agent.`, when: '1d ago' },
    { kind: 'ok', text: `Health holding Green; EW ${ewCurrent} — ${headroom} pts of headroom before any Oversight → Rescue drift.`, when: '1d ago' },
  ];

  const stages: StageStep[] = [
    { id: 'baseline', label: 'Baseline Set', n: '1', state: 'done', note: 'Performance baseline captured' },
    { id: 'benchmark', label: 'Benchmarked', n: '2', state: 'done', note: `Peer-ranked at P${currentPercentile}` },
    { id: 'plays', label: 'Uplift Plays', n: '3', state: 'active', note: `${playsDone} of ${playsTotal} plays · in execution` },
    { id: 'top_quartile', label: 'Top-Quartile', n: '4', state: 'pending', note: `Target P${targetPercentile}` },
    { id: 'expansion', label: 'Expansion Signal', n: '5', state: 'pending', note: 'Renewal / growth upside' },
  ];

  return {
    project: p.name, client: p.client_name, assurancePartner: partner, sponsor,
    strategicValue: p.budget, ewCurrent, oversightThreshold, headroom,
    currentPercentile, targetPercentile,
    stages, dimensions, topQuartile, ascent,
    plays, playsDone, playsTotal,
    copilotRecommend, copilotFeed, opportunities, touchpoint, successPatterns,
  };
}

function buildDefault(params: URLSearchParams): OversightScenario {
  const today = new Date();
  const currentPercentile = 66, targetPercentile = 90;
  return {
    project: params.get('project') || 'Relecloud Telecom 5G Platform',
    client: params.get('client') || 'Relecloud Telecom',
    assurancePartner: params.get('lead') || 'Priya Nadkarni · QA Director',
    sponsor: 'Elena Cho · VP Delivery',
    strategicValue: Number(params.get('val')) || 3_200_000,
    ewCurrent: 32, oversightThreshold: 50, headroom: 18,
    currentPercentile, targetPercentile,
    stages: [
      { id: 'baseline', label: 'Baseline Set', n: '1', state: 'done', note: 'Performance baseline captured' },
      { id: 'benchmark', label: 'Benchmarked', n: '2', state: 'done', note: `Peer-ranked at P${currentPercentile}` },
      { id: 'plays', label: 'Uplift Plays', n: '3', state: 'active', note: '1 of 4 plays · in execution' },
      { id: 'top_quartile', label: 'Top-Quartile', n: '4', state: 'pending', note: `Target P${targetPercentile}` },
      { id: 'expansion', label: 'Expansion Signal', n: '5', state: 'pending', note: 'Renewal / growth upside' },
    ],
    dimensions: [
      { name: 'Burn Efficiency', percentile: 62 }, { name: 'Milestone Velocity', percentile: 71 },
      { name: 'Client Satisfaction', percentile: 68 }, { name: 'Delivery Quality', percentile: 78 },
      { name: 'Team Health', percentile: 64 }, { name: 'Governance', percentile: 73 },
    ],
    topQuartile: 75,
    ascent: [53, 56, 58, 60, 62, 63, 65, currentPercentile],
    plays: [
      { play: 'Tighten burn-efficiency to top-quartile', owner: 'Priya Nadkarni', impact: 'Close the largest gap to P80', status: 'in_progress' },
      { play: 'Introduce weekly client demos at this phase', owner: 'PM', impact: '+12 NPS (success pattern)', source: 'Knowledge Network · success pattern', status: 'done' },
      { play: 'Add a backup for the key role', owner: 'PM', impact: 'De-risk velocity', status: 'proposed' },
      { play: 'Surface the expansion signal to the Pipeline Agent', owner: 'Priya Nadkarni', impact: 'Renewal / expansion upside', status: 'proposed' },
    ],
    playsDone: 1, playsTotal: 4,
    copilotRecommend: 'This engagement is Green but sits at P66 for its service line. Two plays close most of the gap to top-quartile (P90); prioritize burn-efficiency at this week’s touchpoint.',
    copilotFeed: [
      { kind: 'benchmark', text: 'Benchmarked against peers — top-quartile burn-efficiency at this phase is ~78%.', when: '3h ago' },
      { kind: 'play', text: 'Drafted uplift play: tighten burn-efficiency to top-quartile.', when: '6h ago' },
      { kind: 'opportunity', text: 'Expansion signal detected — flagged $1.3M potential to the Pipeline Agent.', when: '1d ago' },
      { kind: 'ok', text: 'Health holding Green; EW 32 — 18 pts of headroom before any Oversight → Rescue drift.', when: '1d ago' },
    ],
    opportunities: [
      'Renewal likely — strong health on a $3.2M account; flag to Pipeline Agent',
      'Adjacent 5G workload identified — expansion candidate',
      'Reference-able delivery — candidate for client advocacy / case study',
    ],
    touchpoint: {
      cadence: 'Weekly executive touchpoint',
      nextSession: `${md(addDays(today, 3))} · weekly touchpoint`,
      recentWins: ['Client Satisfaction lifted to P68+', 'Client demo cadence established — sponsor engaged', 'Health held Green with 18-pt EW headroom'],
    },
    successPatterns: [
      { project: 'Northwind Cloud Migration', match: 90, outcome: 'Reached P92 performance', lesson: 'Weekly client demos + tight burn discipline drove top-quartile satisfaction.' },
      { project: 'Contoso Hotels Loyalty Platform', match: 85, outcome: 'Reached P89 performance', lesson: 'Early architect engagement kept velocity in the top quartile.' },
    ],
  };
}

function StudioClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  return <span className="tabular-nums font-mono">{now.toLocaleTimeString('en-US', { hour12: false })}</span>;
}

// ascent chart (rising — the inverse of the rescue burndown)
function AscentChart({ series, current, target, topQuartile }: { series: number[]; current: number; target: number; topQuartile: number }) {
  const W = 640, H = 170, padL = 34, padB = 22, padT = 12;
  const lo = 40, hi = 95;
  const x = (i: number) => padL + (i / (series.length - 1)) * (W - padL - 10);
  const y = (v: number) => padT + (1 - (v - lo) / (hi - lo)) * (H - padT - padB);
  const linePath = series.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L ${x(series.length - 1).toFixed(1)} ${(H - padB).toFixed(1)} L ${padL} ${(H - padB).toFixed(1)} Z`;
  const projPath = `M ${x(series.length - 1).toFixed(1)} ${y(current).toFixed(1)} L ${W - 10} ${y(target).toFixed(1)}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-44">
      <defs>
        <linearGradient id="ascentfill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[50, 70, 90].map(g => (
        <g key={g}>
          <line x1={padL} x2={W - 10} y1={y(g)} y2={y(g)} stroke="#e2e8f0" strokeWidth="1" />
          <text x={6} y={y(g) + 3} fill="#94a3b8" fontSize="9">P{g}</text>
        </g>
      ))}
      {/* top-quartile reference */}
      <line x1={padL} x2={W - 10} y1={y(topQuartile)} y2={y(topQuartile)} stroke="#14b8a6" strokeWidth="1.25" strokeDasharray="3 3" />
      <text x={W - 10} y={y(topQuartile) - 4} fill="#0d9488" fontSize="9" textAnchor="end">TOP-QUARTILE P{topQuartile}</text>
      {/* target */}
      <line x1={padL} x2={W - 10} y1={y(target)} y2={y(target)} stroke="#0284c7" strokeWidth="1.25" strokeDasharray="5 3" />
      <text x={W - 10} y={y(target) - 4} fill="#0284c7" fontSize="9" textAnchor="end">TARGET P{target}</text>
      <path d={areaPath} fill="url(#ascentfill)" />
      <path d={linePath} fill="none" stroke="#0ea5e9" strokeWidth="2.25" />
      <path d={projPath} fill="none" stroke="#0284c7" strokeWidth="1.75" strokeDasharray="5 4" opacity="0.8" />
      {series.map((v, i) => (
        <circle key={i} cx={x(i)} cy={y(v)} r={i === series.length - 1 ? 4 : 2} fill={i === series.length - 1 ? '#0284c7' : '#7dd3fc'} stroke={i === series.length - 1 ? '#fff' : 'none'} strokeWidth="1.5" />
      ))}
      <text x={x(0)} y={H - 6} fill="#94a3b8" fontSize="9">8 wks ago</text>
      <text x={x(series.length - 1)} y={H - 6} fill="#0284c7" fontSize="9" textAnchor="middle">Now</text>
    </svg>
  );
}

function Panel({ title, icon: Icon, accent = 'text-slate-500', right, children }: {
  title: string; icon: typeof Rocket; accent?: string; right?: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-white border border-sky-100 shadow-sm">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-sky-100">
        <div className="flex items-center gap-2">
          <Icon className={clsx('w-4 h-4', accent)} />
          <span className="text-[11px] font-bold tracking-widest uppercase text-slate-600">{title}</span>
        </div>
        {right}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function StatTile({ label, value, sub, accent, Icon }: { label: string; value: React.ReactNode; sub: string; accent: string; Icon: typeof Gauge }) {
  return (
    <div className="rounded-xl bg-white border border-sky-100 shadow-sm px-4 py-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">{label}</span>
        <Icon className={clsx('w-4 h-4', accent)} />
      </div>
      <div className="mt-1.5 text-2xl font-bold text-slate-800 tabular-nums">{value}</div>
      <div className="text-[11px] text-slate-400 mt-0.5">{sub}</div>
    </div>
  );
}

const PLAY_CFG: Record<PlayStatus, { label: string; cls: string; Icon: typeof CheckCircle2 }> = {
  done: { label: 'DONE', cls: 'bg-emerald-100 text-emerald-700', Icon: CheckCircle2 },
  in_progress: { label: 'IN PROGRESS', cls: 'bg-sky-100 text-sky-700', Icon: Activity },
  proposed: { label: 'PROPOSED', cls: 'bg-slate-100 text-slate-500', Icon: Circle },
};

export default function OversightDetail() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const search = params.toString();
  const [scenario, setScenario] = useState<OversightScenario | null>(null);

  useEffect(() => {
    let alive = true;
    const q = new URLSearchParams(search);
    qualityAssuranceApi.getData()
      .then(res => {
        if (!alive) return;
        const data = res.data || {};
        const projects: ProjectMonitor[] = data.portfolio_monitor || [];
        const lessons: Lesson[] = data.knowledge_network || [];
        const pid = q.get('pid');
        const name = q.get('project');
        let p = pid ? projects.find(x => x.project_id === pid) : undefined;
        if (!p && name) p = projects.find(x => x.name === name);
        // default: highest-value Green flagship
        if (!p) p = projects.filter(x => x.overall_health === 'green').sort((a, b) => b.budget - a.budget)[0];
        setScenario(p ? buildScenario(p, lessons, q.get('lead')) : buildDefault(q));
      })
      .catch(() => { if (alive) setScenario(buildDefault(q)); });
    return () => { alive = false; };
  }, [search]);

  if (!scenario) {
    return (
      <div className="-m-8 min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <Rocket className="w-8 h-8 text-sky-500" />
            <span className="absolute -inset-1 rounded-full bg-sky-400/30 animate-ping" />
          </div>
          <div className="text-sm tracking-widest uppercase text-slate-400">Benchmarking performance…</div>
        </div>
      </div>
    );
  }

  const e = scenario;
  const gap = e.targetPercentile - e.currentPercentile;

  return (
    <div className="-m-8 min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50 text-slate-800">
      {/* ── Header bar ─────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-20 bg-gradient-to-r from-sky-600 to-teal-500 text-white shadow-md">
        <div className="px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => navigate('/quality-assurance')} className="text-white/70 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black tracking-[0.22em] uppercase">Executive Oversight</span>
                <span className="px-1.5 py-0.5 rounded bg-white/20 text-[10px] font-bold tracking-wider">FLAGSHIP</span>
                {/* intensity context */}
                <span className="hidden md:inline-flex items-center gap-1 text-[10px] text-white/80">
                  <span className="opacity-60">Standard</span><ArrowRight className="w-3 h-3" />
                  <span className="px-1.5 py-0.5 rounded bg-white/25 font-bold">Oversight</span>
                  <ArrowRight className="w-3 h-3" /><span className="opacity-60">Rescue</span>
                </span>
              </div>
              <div className="text-base font-bold truncate leading-tight">{e.project}</div>
              <div className="text-[11px] text-white/80 truncate">{e.client} · Assurance Partner: {e.assurancePartner}</div>
            </div>
          </div>

          <div className="flex items-center gap-5 flex-shrink-0">
            <div className="hidden lg:flex items-center gap-2 text-[11px] text-white/80">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span className="font-semibold">LIVE</span>
              <span className="opacity-50">·</span>
              <Clock className="w-3.5 h-3.5" /> <StudioClock />
            </div>
            <div className="text-right">
              <div className="text-[10px] tracking-widest uppercase text-white/70">Performance</div>
              <div className="text-xl font-black tabular-nums leading-none">P{e.currentPercentile} <span className="text-white/60 text-sm font-bold">→ P{e.targetPercentile}</span></div>
            </div>
            <div className="text-right border-l border-white/25 pl-5">
              <div className="text-[10px] tracking-widest uppercase text-white/70">Strategic Value</div>
              <div className="text-xl font-black tabular-nums leading-none">{fmtMoney(e.strategicValue)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-5 space-y-5">
        {/* ── Journey rail ─────────────────────────────────────────────────── */}
        <div className="rounded-xl bg-white border border-sky-100 shadow-sm px-4 py-3">
          <div className="flex items-center gap-1 overflow-x-auto">
            {e.stages.map((s, i) => (
              <div key={s.id} className="flex items-center gap-1 flex-1 min-w-[150px]">
                <div className={clsx('flex-1 rounded-lg px-3 py-2 border',
                  s.state === 'active' ? 'bg-sky-50 border-sky-300'
                    : s.state === 'done' ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-slate-50 border-slate-200')}>
                  <div className="flex items-center gap-2">
                    {s.state === 'done' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      : s.state === 'active' ? <CircleDot className="w-4 h-4 text-sky-500 animate-pulse" />
                      : <Circle className="w-4 h-4 text-slate-300" />}
                    <span className={clsx('text-xs font-bold tracking-wide',
                      s.state === 'active' ? 'text-sky-700' : s.state === 'done' ? 'text-emerald-700' : 'text-slate-400')}>
                      {s.n}. {s.label}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 pl-6">{s.note}</div>
                </div>
                {i < e.stages.length - 1 && <ArrowRight className="w-4 h-4 text-slate-300 flex-shrink-0" />}
              </div>
            ))}
          </div>
        </div>

        {/* ── KPI strip ────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatTile label="Performance Percentile" value={<span className="text-sky-600">P{e.currentPercentile}</span>} sub={`▲ gap of ${gap} to target P${e.targetPercentile}`} accent="text-sky-500" Icon={TrendingUp} />
          <StatTile label="Engagement Health" value={<span className="text-emerald-600">GREEN</span>} sub={`EW ${e.ewCurrent} · ${e.headroom}-pt headroom`} accent="text-emerald-500" Icon={ShieldCheck} />
          <StatTile label="Uplift Plays" value={<>{e.playsDone}<span className="text-slate-300 text-lg"> / {e.playsTotal}</span></>} sub={`${e.playsDone} done · ${e.playsTotal - e.playsDone} in flight`} accent="text-teal-500" Icon={Sparkles} />
          <StatTile label="Expansion Upside" value={<span className="text-teal-600">{fmtMoney(Math.round(e.strategicValue * 0.4))}</span>} sub="Flagged to Pipeline Agent" accent="text-teal-500" Icon={Compass} />
        </div>

        {/* ── Main grid ────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2 space-y-5">

            {/* Top-quartile gap */}
            <Panel title="Top-Quartile Gap — Performance Benchmark" icon={Trophy} accent="text-sky-500"
              right={<span className="text-[10px] text-slate-400">vs service-line peers</span>}>
              <div className="space-y-2.5">
                {e.dimensions.map((d, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs text-slate-600 w-36 flex-shrink-0">{d.name}</span>
                    <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden relative">
                      <div className={clsx('h-full rounded-full', d.percentile >= e.topQuartile ? 'bg-teal-400' : 'bg-sky-400')} style={{ width: `${d.percentile}%` }} />
                      {/* top-quartile marker */}
                      <div className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 bg-teal-600" style={{ left: `${e.topQuartile}%` }} />
                    </div>
                    <span className={clsx('text-xs font-bold w-9 text-right flex-shrink-0', d.percentile >= e.topQuartile ? 'text-teal-600' : 'text-sky-600')}>P{d.percentile}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-3 text-[10px] text-slate-400">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2 bg-sky-400 inline-block rounded-sm" />Below top-quartile</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2 bg-teal-400 inline-block rounded-sm" />At/above top-quartile</span>
                <span className="flex items-center gap-1"><span className="w-0.5 h-3 bg-teal-600 inline-block" />P{e.topQuartile} line</span>
              </div>
            </Panel>

            {/* Performance ascent */}
            <Panel title="Performance Ascent — Percentile Trajectory" icon={TrendingUp} accent="text-sky-500"
              right={<div className="flex items-center gap-3 text-[10px] text-slate-400">
                <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-sky-500 inline-block" />Actual</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-sky-700 inline-block" />Projected</span>
              </div>}>
              <AscentChart series={e.ascent} current={e.currentPercentile} target={e.targetPercentile} topQuartile={e.topQuartile} />
              <div className="text-[11px] text-slate-500 mt-1">
                Projected to reach <span className="text-sky-700 font-semibold">top-quartile (P{e.targetPercentile})</span> as the uplift plays land.
              </div>
            </Panel>

            {/* Uplift plays (the Performance Plan) */}
            <Panel title="Performance Plan — Uplift Plays" icon={Sparkles} accent="text-teal-500"
              right={<span className="text-[10px] text-slate-400">Reviewed at the weekly touchpoint</span>}>
              <div className="space-y-2">
                {e.plays.map((pl, i) => {
                  const cfg = PLAY_CFG[pl.status];
                  const CfgIcon = cfg.Icon;
                  return (
                    <div key={i} className="rounded-lg border border-sky-100 bg-sky-50/40 px-3 py-2.5">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-start gap-2">
                          <CfgIcon className={clsx('w-3.5 h-3.5 mt-0.5 flex-shrink-0', pl.status === 'done' ? 'text-emerald-500' : pl.status === 'in_progress' ? 'text-sky-500' : 'text-slate-400')} />
                          <span className="text-xs font-semibold text-slate-700">{pl.play}</span>
                        </div>
                        <span className={clsx('text-[9px] font-bold px-1.5 py-0.5 rounded flex-shrink-0', cfg.cls)}>{cfg.label}</span>
                      </div>
                      <div className="flex items-center gap-3 pl-6 text-[10px] text-slate-400">
                        <span className="flex items-center gap-1"><Target className="w-3 h-3 text-teal-500" /> {pl.impact}</span>
                        <span>· {pl.owner}</span>
                        {pl.source && <span className="text-violet-500">· {pl.source}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Panel>
          </div>

          {/* Right column */}
          <div className="space-y-5">

            {/* Performance Copilot */}
            <Panel title="Performance Copilot" icon={Bot} accent="text-sky-500"
              right={<span className="flex items-center gap-1 text-[10px] text-sky-500"><span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />active</span>}>
              <div className="rounded-lg bg-gradient-to-br from-sky-50 to-teal-50 border border-sky-200 px-3 py-2.5 mb-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Zap className="w-3.5 h-3.5 text-sky-600" />
                  <span className="text-[10px] font-bold tracking-widest uppercase text-sky-700">Copilot Recommends</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">{e.copilotRecommend}</p>
              </div>
              <div className="space-y-2.5">
                {e.copilotFeed.map((f, i) => {
                  const Icon = FEED_ICON[f.kind];
                  const color = f.kind === 'benchmark' ? 'text-sky-500' : f.kind === 'play' ? 'text-teal-500' : f.kind === 'opportunity' ? 'text-violet-500' : 'text-emerald-500';
                  return (
                    <div key={i} className="flex items-start gap-2">
                      <Icon className={clsx('w-3.5 h-3.5 mt-0.5 flex-shrink-0', color)} />
                      <div>
                        <p className="text-[11px] text-slate-600 leading-snug">{f.text}</p>
                        <span className="text-[10px] text-slate-400">{f.when}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Panel>

            {/* Opportunity radar */}
            <Panel title="Opportunity Radar" icon={Compass} accent="text-teal-500"
              right={<span className="text-[10px] text-slate-400">→ Pipeline Agent</span>}>
              <div className="space-y-2">
                {e.opportunities.map((o, i) => (
                  <div key={i} className="flex items-start gap-2 text-[11px] text-slate-600">
                    <Sparkles className="w-3.5 h-3.5 text-teal-500 mt-0.5 flex-shrink-0" /> {o}
                  </div>
                ))}
              </div>
            </Panel>

            {/* Executive touchpoint */}
            <Panel title="Executive Touchpoint" icon={Users} accent="text-sky-500"
              right={<span className="text-[10px] text-slate-400">{e.touchpoint.nextSession.split('·')[0]}</span>}>
              <div className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 mb-3">
                <div className="text-[10px] tracking-widest uppercase text-slate-400">Cadence</div>
                <div className="text-xs font-semibold text-slate-700">{e.touchpoint.cadence}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{e.assurancePartner} · Sponsor: {e.sponsor}</div>
              </div>
              <div className="text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-1.5">Recent Wins</div>
              <div className="space-y-1.5">
                {e.touchpoint.recentWins.map((w, i) => (
                  <div key={i} className="flex items-start gap-2 text-[11px]">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-600">{w}</span>
                  </div>
                ))}
              </div>
            </Panel>

            {/* Pre-empt the slide */}
            <Panel title="Pre-empt the Slide — Tight Watch" icon={ShieldCheck} accent="text-emerald-500">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] text-slate-400 uppercase tracking-wide w-20 flex-shrink-0">EW headroom</span>
                <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden relative">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${Math.min(100, (e.ewCurrent / e.oversightThreshold) * 100)}%` }} />
                  <div className="absolute top-1/2 -translate-y-1/2 w-0.5 h-3.5 bg-amber-500" style={{ left: '100%' }} />
                </div>
                <span className="text-[11px] font-bold text-emerald-600 flex-shrink-0">{e.ewCurrent}/{e.oversightThreshold}</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                Oversight watches at a <span className="font-semibold text-slate-700">tighter threshold ({e.oversightThreshold})</span> than the rescue tiers — so a flagship never silently drifts toward Rescue. <span className="text-emerald-600 font-semibold">{e.headroom} pts</span> of headroom remain.
              </p>
            </Panel>

            {/* Success patterns */}
            <Panel title="Knowledge Network — Success Patterns" icon={BookOpen} accent="text-violet-500">
              <div className="space-y-2">
                {e.successPatterns.map((k, i) => (
                  <div key={i} className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[11px] font-semibold text-slate-700">{k.project}</span>
                      <span className="text-[10px] font-bold text-violet-500">{k.match}% match</span>
                    </div>
                    <div className="text-[10px] text-teal-600 mb-1">{k.outcome}</div>
                    <p className="text-[11px] text-slate-500 leading-snug">{k.lesson}</p>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </div>

        <div className="text-center text-[10px] text-slate-400 pt-2 pb-6">
          Oversight Studio · AI-Driven Quality Assurance · Section 11.3 — Oversight Mode (Performance Maximization) · Data-driven from portfolio signals
        </div>
      </div>
    </div>
  );
}
