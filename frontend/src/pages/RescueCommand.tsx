import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Siren, ArrowLeft, Radio, Clock, TrendingDown, Gauge, Flag, Crosshair,
  AlertTriangle, ShieldAlert, CheckCircle2, Circle, CircleDot, Users,
  Bot, FileText, Target, ArrowRight, Flame, Activity, BookOpen, Zap,
} from 'lucide-react';
import clsx from 'clsx';

// ─────────────────────────────────────────────────────────────────────────────
// Rescue Command — war-room cockpit mock (Section 11 of the QA Framework)
// Self-contained mock data; deliberately dark "mission-control" identity that
// contrasts with the calm Power BI operational tabs.
// ─────────────────────────────────────────────────────────────────────────────

type Phase = 'triage' | 'stabilize' | 'recharter' | 'war_room' | 'exit';

const ENGAGEMENT = {
  project: 'Adatum Cloud Foundation',
  client: 'Adatum Corporation',
  rescueLead: 'Priya Nadkarni · QA Director',
  sponsor: 'Marcus Bell · VP Delivery (Sponsor)',
  pm: 'Tom Reyes',
  dayOfRescue: 12,
  valueAtRisk: 540_000,
  contractValue: 1_200_000,
  reportedStatus: 'AMBER',
  trueStatus: 'RED',
  ewCurrent: 71,
  ewStart: 88,
  ewTarget: 40,
  targetGreen: 'Jul 18, 2026',
  currentPhase: 'war_room' as Phase,
};

const PHASES: { id: Phase; label: string; n: string; state: 'done' | 'active' | 'pending'; note: string }[] = [
  { id: 'triage',    label: 'Declare & Triage', n: '1', state: 'done',    note: '72h audit · true status established' },
  { id: 'stabilize', label: 'Stabilize',        n: '2', state: 'done',    note: 'Scope frozen · sponsor secured' },
  { id: 'recharter', label: 'Re-Charter',       n: '3', state: 'done',    note: 'GO approved by Recovery Board' },
  { id: 'war_room',  label: 'War Room',          n: '4', state: 'active',  note: 'Daily command · EW burning down' },
  { id: 'exit',      label: 'Stabilized Exit',  n: '5', state: 'pending', note: '0 of 4 exit criteria held' },
];

const RED_FLAGS = [
  { flag: 'Scope creep with no budget/timeline change', detail: '3 change requests absorbed without commercial adjustment', sev: 'high' },
  { flag: 'Sponsor disengagement', detail: 'Client sponsor missed last 2 steering committees', sev: 'high' },
  { flag: 'Earned-value divergence', detail: 'CPI 0.78 · SPI 0.71 — both well below baseline', sev: 'high' },
  { flag: 'Key-person dependency', detail: 'Lead architect 100% allocated, no backup', sev: 'med' },
];

const ROOT_CAUSES = [
  'ExpressRoute provisioning dependency under-managed — 6-week slip never re-baselined',
  'Requirements signed off before landing-zone design was validated',
  'No technical architect assigned until Day 70 (setup checkpoint gap)',
];

const EW_SERIES = [88, 87, 89, 85, 83, 84, 80, 78, 76, 74, 72, 71];

const WAR_ROOM_LOG = [
  { day: 12, date: 'May 30', ew: 71, onTrack: true,  note: 'Landing-zone design re-validated with client architects. Milestone R3 unblocked.' },
  { day: 11, date: 'May 29', ew: 72, onTrack: true,  note: 'ExpressRoute alternate circuit confirmed — removes the critical-path dependency.' },
  { day: 10, date: 'May 28', ew: 74, onTrack: true,  note: 'Technical architect onboarded full-time. Backup identified for lead.' },
  { day: 9,  date: 'May 27', ew: 76, onTrack: false, note: 'Client sponsor re-engaged but pushed back on revised timeline. Escalated to Recovery Board.' },
];

const CHARTER = {
  decision: 'go' as 'go' | 'reset' | 'stop',
  revisedScope: 'Phase 1 landing zone + 2 priority workloads. Workloads 3–4 deferred to a follow-on SOW.',
  resourceAsks: ['+1 Technical Architect (committed)', 'Backup network engineer', 'Exec sponsor air-cover for client renegotiation'],
  successCriteria: [
    'All health dimensions Green for 3 consecutive weeks',
    'EW score held below 45',
    'Revised milestones R1–R4 delivered & accepted',
    'Client sponsor satisfaction signal positive',
  ],
  approvedAt: 'May 21, 2026',
};

const BOARD = {
  sponsor: 'Marcus Bell · VP Delivery',
  members: ['Account Exec — Dana Liu', 'QA Director — Priya Nadkarni', 'Delivery PM — Tom Reyes', 'Client Sponsor — invited (Standard disclosure)'],
  nextSession: 'Jun 3, 2026 · 9:00 AM',
  recentDecisions: [
    { decision: 'Approved GO on revised charter', owner: 'Board', when: 'May 21' },
    { decision: 'Authorized +1 architect & backup engineer', owner: 'M. Bell', when: 'May 21' },
    { decision: 'Open client renegotiation on deferred workloads', owner: 'D. Liu', when: 'Jun 3' },
  ],
};

const COPILOT_FEED = [
  { icon: FileText, text: 'Drafted Recovery Board pack for Jun 3 session — status, EW trend, charter, 2 asks.', when: '2h ago', kind: 'prep' },
  { icon: AlertTriangle, text: 'Milestone R4 at risk — dependency on client data migration sign-off slipping.', when: '5h ago', kind: 'alert' },
  { icon: BookOpen, text: 'Surfaced 2 analogous rescues from Knowledge Network with 89% recovery rate.', when: '1d ago', kind: 'insight' },
  { icon: Activity, text: 'Daily health check complete — EW down 1pt to 71. On track 4 of last 5 days.', when: '1d ago', kind: 'ok' },
];

const EXIT_CRITERIA = [
  { criterion: 'All health dimensions Green for 3 consecutive weeks', met: false, progress: 'Week 1 of 3' },
  { criterion: 'EW score held below 45', met: false, progress: 'Currently 71 → target 40' },
  { criterion: 'Revised milestones R1–R4 delivered & accepted', met: false, progress: 'R1–R2 done · R3 in progress' },
  { criterion: 'Client sponsor satisfaction signal positive', met: false, progress: 'Re-engaged · awaiting signal' },
];

const KNOWLEDGE = [
  { project: 'Fabrikam Network Modernization', match: 92, outcome: 'Recovered in 51 days', lesson: 'Re-baselining the dependency chain early was decisive.' },
  { project: 'Northwind Cloud Migration', match: 86, outcome: 'Recovered in 63 days', lesson: 'Adding a backup architect removed the key-person risk that stalled week 2.' },
];

// ── helpers ──────────────────────────────────────────────────────────────────
const fmtMoney = (v: number) => v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(1)}M` : `$${(v / 1_000).toFixed(0)}K`;

function MissionClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="tabular-nums font-mono">
      {now.toLocaleTimeString('en-US', { hour12: false })} UTC{now.getTimezoneOffset() <= 0 ? '+' : '-'}
    </span>
  );
}

// EW burndown SVG
function EWBurndown({ series }: { series: number[] }) {
  const W = 640, H = 170, padL = 34, padB = 22, padT = 12;
  const data = series;
  const lo = 30, hi = 95;
  const x = (i: number) => padL + (i / (data.length - 1)) * (W - padL - 10);
  const y = (v: number) => padT + (1 - (v - lo) / (hi - lo)) * (H - padT - padB);

  const linePath = data.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L ${x(data.length - 1).toFixed(1)} ${(H - padB).toFixed(1)} L ${padL} ${(H - padB).toFixed(1)} Z`;
  // projection from current to target green
  const projX = W - 10;
  const projPath = `M ${x(data.length - 1).toFixed(1)} ${y(data[data.length - 1]).toFixed(1)} L ${projX} ${y(ENGAGEMENT.ewTarget).toFixed(1)}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-44">
      <defs>
        <linearGradient id="ewfill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* gridlines */}
      {[40, 60, 80].map(g => (
        <g key={g}>
          <line x1={padL} x2={W - 10} y1={y(g)} y2={y(g)} stroke="#1e293b" strokeWidth="1" />
          <text x={6} y={y(g) + 3} fill="#475569" fontSize="9">{g}</text>
        </g>
      ))}
      {/* target green threshold */}
      <line x1={padL} x2={W - 10} y1={y(ENGAGEMENT.ewTarget)} y2={y(ENGAGEMENT.ewTarget)} stroke="#10b981" strokeWidth="1.25" strokeDasharray="4 3" />
      <text x={W - 10} y={y(ENGAGEMENT.ewTarget) - 4} fill="#34d399" fontSize="9" textAnchor="end">TARGET GREEN ≤ {ENGAGEMENT.ewTarget}</text>
      {/* area + line */}
      <path d={areaPath} fill="url(#ewfill)" />
      <path d={linePath} fill="none" stroke="#f59e0b" strokeWidth="2.25" />
      {/* projection */}
      <path d={projPath} fill="none" stroke="#34d399" strokeWidth="1.75" strokeDasharray="5 4" opacity="0.8" />
      {/* points */}
      {data.map((v, i) => (
        <circle key={i} cx={x(i)} cy={y(v)} r={i === data.length - 1 ? 4 : 2} fill={i === data.length - 1 ? '#fbbf24' : '#b45309'} stroke={i === data.length - 1 ? '#fff7ed' : 'none'} strokeWidth="1.5" />
      ))}
      <text x={x(0)} y={H - 6} fill="#475569" fontSize="9">Day 1</text>
      <text x={x(data.length - 1)} y={H - 6} fill="#fbbf24" fontSize="9" textAnchor="middle">Day {ENGAGEMENT.dayOfRescue}</text>
    </svg>
  );
}

// ── dark panel primitive ─────────────────────────────────────────────────────
function Panel({ title, icon: Icon, accent = 'text-slate-400', right, children }: {
  title: string; icon: typeof Radio; accent?: string; right?: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-slate-900/70 border border-slate-800 backdrop-blur">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Icon className={clsx('w-4 h-4', accent)} />
          <span className="text-[11px] font-bold tracking-widest uppercase text-slate-300">{title}</span>
        </div>
        {right}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function StatTile({ label, value, sub, accent, Icon }: { label: string; value: React.ReactNode; sub: string; accent: string; Icon: typeof Gauge }) {
  return (
    <div className="rounded-xl bg-slate-900/70 border border-slate-800 px-4 py-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold tracking-widest uppercase text-slate-500">{label}</span>
        <Icon className={clsx('w-4 h-4', accent)} />
      </div>
      <div className="mt-1.5 text-2xl font-bold text-slate-100 tabular-nums">{value}</div>
      <div className="text-[11px] text-slate-500 mt-0.5">{sub}</div>
    </div>
  );
}

export default function RescueCommand() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  // The cockpit can be launched from a Critical project or a stalled Get-to-Green
  // plan; the launching engagement's identity is passed via query params and
  // overrides the default scenario header. The detailed panels remain a
  // representative recovery scenario.
  const ewParam = Number(params.get('ew'));
  const varParam = Number(params.get('var'));
  const e = {
    ...ENGAGEMENT,
    project: params.get('project') || ENGAGEMENT.project,
    client: params.get('client') || ENGAGEMENT.client,
    rescueLead: params.get('lead') || ENGAGEMENT.rescueLead,
    ewCurrent: Number.isFinite(ewParam) && ewParam > 0 ? ewParam : ENGAGEMENT.ewCurrent,
    valueAtRisk: Number.isFinite(varParam) && varParam > 0 ? varParam : ENGAGEMENT.valueAtRisk,
  };
  const ewDelta = e.ewStart - e.ewCurrent;
  // keep the burndown's final point in sync with the launched project's EW
  const ewSeries = [...EW_SERIES.slice(0, -1), e.ewCurrent];

  return (
    <div className="-m-8 min-h-screen bg-slate-950 text-slate-200 selection:bg-amber-500/30">
      {/* faint scanline / grid texture */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '36px 36px' }} />

        {/* ── Command bar ─────────────────────────────────────────────────── */}
        <div className="sticky top-0 z-20 bg-gradient-to-r from-red-950/90 via-slate-950/95 to-slate-950/95 border-b border-red-900/50 backdrop-blur">
          <div className="px-6 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <button onClick={() => navigate('/quality-assurance')} className="text-slate-500 hover:text-slate-200 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="relative">
                <Siren className="w-7 h-7 text-red-500" />
                <span className="absolute -inset-1 rounded-full bg-red-500/30 animate-ping" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black tracking-[0.25em] text-red-400 uppercase">Rescue Command</span>
                  <span className="px-1.5 py-0.5 rounded bg-red-500/20 border border-red-500/40 text-[10px] font-bold tracking-wider text-red-300">CRITICAL</span>
                </div>
                <div className="text-base font-bold text-white truncate leading-tight">{e.project}</div>
                <div className="text-[11px] text-slate-400 truncate">{e.client} · Lead: {e.rescueLead}</div>
              </div>
            </div>

            <div className="flex items-center gap-5 flex-shrink-0">
              <div className="hidden lg:flex items-center gap-2 text-[11px] text-slate-400">
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span className="font-semibold text-emerald-400">LIVE</span>
                <span className="text-slate-600">·</span>
                <Clock className="w-3.5 h-3.5" /> <MissionClock />
              </div>
              <div className="text-right">
                <div className="text-[10px] tracking-widest uppercase text-slate-500">Mission Day</div>
                <div className="text-xl font-black text-amber-400 tabular-nums leading-none">DAY {e.dayOfRescue}</div>
              </div>
              <div className="text-right border-l border-slate-800 pl-5">
                <div className="text-[10px] tracking-widest uppercase text-slate-500">Value at Risk</div>
                <div className="text-xl font-black text-white tabular-nums leading-none">{fmtMoney(e.valueAtRisk)}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-5 space-y-5 relative">
          {/* ── Phase rail ───────────────────────────────────────────────── */}
          <div className="rounded-xl bg-slate-900/50 border border-slate-800 px-4 py-3">
            <div className="flex items-center gap-1 overflow-x-auto">
              {PHASES.map((p, i) => (
                <div key={p.id} className="flex items-center gap-1 flex-1 min-w-[150px]">
                  <div className={clsx(
                    'flex-1 rounded-lg px-3 py-2 border transition-colors',
                    p.state === 'active' ? 'bg-amber-500/10 border-amber-500/50'
                      : p.state === 'done' ? 'bg-emerald-500/5 border-emerald-800/50'
                      : 'bg-slate-900/40 border-slate-800'
                  )}>
                    <div className="flex items-center gap-2">
                      {p.state === 'done' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        : p.state === 'active' ? <CircleDot className="w-4 h-4 text-amber-400 animate-pulse" />
                        : <Circle className="w-4 h-4 text-slate-600" />}
                      <span className={clsx('text-xs font-bold tracking-wide',
                        p.state === 'active' ? 'text-amber-300' : p.state === 'done' ? 'text-emerald-300' : 'text-slate-500')}>
                        {p.n}. {p.label}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5 pl-6">{p.note}</div>
                  </div>
                  {i < PHASES.length - 1 && <ArrowRight className="w-4 h-4 text-slate-700 flex-shrink-0" />}
                </div>
              ))}
            </div>
          </div>

          {/* ── KPI strip ────────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatTile label="Days in Rescue" value={e.dayOfRescue} sub={`Target Green ${e.targetGreen}`} accent="text-amber-400" Icon={Clock} />
            <StatTile label="Early Warning" value={<span className="text-amber-400">{e.ewCurrent}</span>}
              sub={`▼ ${ewDelta} from ${e.ewStart} at declare`} accent="text-emerald-400" Icon={TrendingDown} />
            <StatTile label="Recovery Milestones" value={<>2<span className="text-slate-600 text-lg"> / 4</span></>} sub="R1–R2 accepted · R3 active" accent="text-sky-400" Icon={Target} />
            <StatTile label="Charter Decision" value={<span className="text-emerald-400">GO</span>} sub={`Board-approved ${CHARTER.approvedAt}`} accent="text-emerald-400" Icon={Flag} />
          </div>

          {/* ── Main grid ────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            {/* Left / center column (2/3) */}
            <div className="xl:col-span-2 space-y-5">

              {/* Ground truth */}
              <Panel title="Ground Truth — Triage" icon={Crosshair} accent="text-red-400"
                right={<span className="text-[10px] text-slate-500">72h audit · Day 1–3</span>}>
                <div className="flex items-stretch gap-3 mb-4">
                  <div className="flex-1 rounded-lg bg-slate-950/60 border border-slate-800 px-4 py-3 text-center">
                    <div className="text-[10px] tracking-widest uppercase text-slate-500 mb-1">Reported</div>
                    <div className="text-lg font-black text-amber-400">{e.reportedStatus}</div>
                  </div>
                  <div className="flex items-center text-slate-600"><ArrowRight className="w-5 h-5" /></div>
                  <div className="flex-1 rounded-lg bg-red-950/40 border border-red-900/60 px-4 py-3 text-center">
                    <div className="text-[10px] tracking-widest uppercase text-red-400/70 mb-1">True (Agent-assessed)</div>
                    <div className="text-lg font-black text-red-400">{e.trueStatus}</div>
                  </div>
                  <div className="flex-1 rounded-lg bg-slate-950/60 border border-slate-800 px-4 py-3 text-center">
                    <div className="text-[10px] tracking-widest uppercase text-slate-500 mb-1">Status Delta</div>
                    <div className="text-lg font-black text-white">+1 tier</div>
                  </div>
                </div>

                <div className="text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-2">Red Flags Detected</div>
                <div className="grid sm:grid-cols-2 gap-2 mb-4">
                  {RED_FLAGS.map((f, i) => (
                    <div key={i} className="rounded-lg bg-slate-950/50 border border-slate-800 px-3 py-2">
                      <div className="flex items-start gap-2">
                        <ShieldAlert className={clsx('w-3.5 h-3.5 mt-0.5 flex-shrink-0', f.sev === 'high' ? 'text-red-400' : 'text-amber-400')} />
                        <div>
                          <div className="text-xs font-semibold text-slate-200">{f.flag}</div>
                          <div className="text-[11px] text-slate-500">{f.detail}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-2">Root Causes</div>
                <div className="space-y-1.5">
                  {ROOT_CAUSES.map((rc, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <Flame className="w-3.5 h-3.5 text-red-500 mt-0.5 flex-shrink-0" /> {rc}
                    </div>
                  ))}
                </div>
              </Panel>

              {/* EW burndown */}
              <Panel title="Recovery Burndown — Early Warning Score" icon={TrendingDown} accent="text-amber-400"
                right={<div className="flex items-center gap-3 text-[10px] text-slate-500">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-amber-500 inline-block" />Actual</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-emerald-400 inline-block" style={{ borderTop: '1px dashed' }} />Projected</span>
                </div>}>
                <EWBurndown series={ewSeries} />
                <div className="text-[11px] text-slate-500 mt-1">
                  Projected to reach <span className="text-emerald-400 font-semibold">Green (≤{e.ewTarget})</span> by {e.targetGreen} if current trajectory holds.
                </div>
              </Panel>

              {/* War room log */}
              <Panel title="War Room — Daily Command Log" icon={Radio} accent="text-emerald-400"
                right={<span className="text-[10px] text-slate-500">Phase 4 · daily cadence</span>}>
                <div className="space-y-2">
                  {WAR_ROOM_LOG.map((d, i) => (
                    <div key={i} className={clsx('rounded-lg border px-3 py-2.5', d.onTrack ? 'bg-emerald-500/5 border-emerald-900/50' : 'bg-red-500/5 border-red-900/50')}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-200">Day {d.day}</span>
                          <span className="text-[10px] text-slate-500">{d.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-amber-400 tabular-nums">EW {d.ew}</span>
                          <span className={clsx('text-[10px] font-bold px-1.5 py-0.5 rounded',
                            d.onTrack ? 'bg-emerald-500/15 text-emerald-300' : 'bg-red-500/15 text-red-300')}>
                            {d.onTrack ? 'ON TRACK' : 'OFF TRACK'}
                          </span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{d.note}</p>
                    </div>
                  ))}
                </div>
              </Panel>
            </div>

            {/* Right column (1/3) */}
            <div className="space-y-5">

              {/* Rescue Copilot */}
              <Panel title="Rescue Copilot" icon={Bot} accent="text-cyan-400"
                right={<span className="flex items-center gap-1 text-[10px] text-cyan-400"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />active</span>}>
                <div className="rounded-lg bg-cyan-500/10 border border-cyan-500/30 px-3 py-2.5 mb-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Zap className="w-3.5 h-3.5 text-cyan-300" />
                    <span className="text-[10px] font-bold tracking-widest uppercase text-cyan-300">Copilot Recommends</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    Hold Rescue intensity one more week. EW is burning down steadily but R4 dependency on client data sign-off is the next blocker — escalate it at the Jun 3 board.
                  </p>
                </div>
                <div className="space-y-2.5">
                  {COPILOT_FEED.map((f, i) => {
                    const Icon = f.icon;
                    const color = f.kind === 'alert' ? 'text-amber-400' : f.kind === 'insight' ? 'text-cyan-400' : f.kind === 'ok' ? 'text-emerald-400' : 'text-slate-400';
                    return (
                      <div key={i} className="flex items-start gap-2">
                        <Icon className={clsx('w-3.5 h-3.5 mt-0.5 flex-shrink-0', color)} />
                        <div>
                          <p className="text-[11px] text-slate-300 leading-snug">{f.text}</p>
                          <span className="text-[10px] text-slate-600">{f.when}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Panel>

              {/* Recovery charter */}
              <Panel title="Recovery Charter" icon={FileText} accent="text-emerald-400"
                right={<span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-[10px] font-bold text-emerald-300 tracking-wider">GO</span>}>
                <div className="flex gap-1.5 mb-3">
                  {(['go', 'reset', 'stop'] as const).map(d => (
                    <div key={d} className={clsx('flex-1 text-center rounded-md py-1.5 text-[11px] font-bold tracking-wider uppercase border',
                      CHARTER.decision === d
                        ? d === 'go' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' : 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                        : 'bg-slate-950/50 border-slate-800 text-slate-600')}>
                      {d}
                    </div>
                  ))}
                </div>
                <div className="text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-1">Revised Scope</div>
                <p className="text-[11px] text-slate-300 mb-3 leading-relaxed">{CHARTER.revisedScope}</p>
                <div className="text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-1.5">Resource Asks</div>
                <div className="space-y-1 mb-3">
                  {CHARTER.resourceAsks.map((r, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-300"><span className="text-emerald-400 mt-0.5">+</span>{r}</div>
                  ))}
                </div>
              </Panel>

              {/* Executive Recovery Board */}
              <Panel title="Executive Recovery Board" icon={Users} accent="text-sky-400"
                right={<span className="text-[10px] text-slate-500">Next {BOARD.nextSession.split('·')[0]}</span>}>
                <div className="rounded-lg bg-slate-950/50 border border-slate-800 px-3 py-2 mb-3">
                  <div className="text-[10px] tracking-widest uppercase text-slate-500">Chair / Sponsor</div>
                  <div className="text-xs font-semibold text-slate-200">{BOARD.sponsor}</div>
                </div>
                <div className="space-y-1 mb-3">
                  {BOARD.members.map((m, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-400"><Circle className="w-1.5 h-1.5 fill-slate-600 text-slate-600" />{m}</div>
                  ))}
                </div>
                <div className="text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-1.5">Recent Decisions</div>
                <div className="space-y-1.5">
                  {BOARD.recentDecisions.map((d, i) => (
                    <div key={i} className="flex items-start gap-2 text-[11px]">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300">{d.decision} <span className="text-slate-600">· {d.owner} · {d.when}</span></span>
                    </div>
                  ))}
                </div>
              </Panel>

              {/* Exit criteria */}
              <Panel title="Exit Criteria — Handback Gate" icon={Target} accent="text-amber-400"
                right={<span className="text-[10px] text-slate-500">0 of {EXIT_CRITERIA.length} held</span>}>
                <div className="space-y-2">
                  {EXIT_CRITERIA.map((c, i) => (
                    <div key={i} className="flex items-start gap-2">
                      {c.met ? <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> : <Circle className="w-4 h-4 text-slate-600 mt-0.5 flex-shrink-0" />}
                      <div>
                        <div className="text-[11px] text-slate-300 leading-snug">{c.criterion}</div>
                        <div className="text-[10px] text-amber-400/80">{c.progress}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>

              {/* Knowledge match */}
              <Panel title="Knowledge Network — Analogous Rescues" icon={BookOpen} accent="text-violet-400">
                <div className="space-y-2">
                  {KNOWLEDGE.map((k, i) => (
                    <div key={i} className="rounded-lg bg-slate-950/50 border border-slate-800 px-3 py-2">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[11px] font-semibold text-slate-200">{k.project}</span>
                        <span className="text-[10px] font-bold text-violet-300">{k.match}% match</span>
                      </div>
                      <div className="text-[10px] text-emerald-400 mb-1">{k.outcome}</div>
                      <p className="text-[11px] text-slate-500 leading-snug">{k.lesson}</p>
                    </div>
                  ))}
                </div>
              </Panel>
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-600 pt-2 pb-6">
            Rescue Command · AI-Driven Quality Assurance · Section 11 — Executive Oversight &amp; Rescue Engagement Model · Mock cockpit
          </div>
        </div>
      </div>
    </div>
  );
}
