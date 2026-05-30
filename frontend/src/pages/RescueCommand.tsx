import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Siren, ArrowLeft, Radio, Clock, TrendingDown, Gauge, Flag, Crosshair,
  AlertTriangle, ShieldAlert, CheckCircle2, Circle, CircleDot, Users,
  Bot, FileText, Target, ArrowRight, Flame, Activity, BookOpen, Zap,
} from 'lucide-react';
import clsx from 'clsx';
import { qualityAssuranceApi } from '../api/client';

// ─────────────────────────────────────────────────────────────────────────────
// Rescue Command — war-room cockpit (Section 11 of the QA Framework).
// Every panel is derived from the launched project's real QA signals; the
// cockpit fetches the same portfolio dataset the Portfolio Monitor uses, finds
// the engagement by `pid`, and generates a deterministic recovery scenario.
// A curated default scenario is used as a fallback.
// ─────────────────────────────────────────────────────────────────────────────

type Phase = 'triage' | 'stabilize' | 'recharter' | 'war_room' | 'exit';
type CharterDecision = 'go' | 'reset' | 'stop';
type FeedKind = 'prep' | 'alert' | 'insight' | 'ok';

interface ProjectMonitor {
  project_id: string; name: string; client_name: string; project_manager: string;
  overall_health: 'green' | 'amber' | 'red'; phase: string;
  budget: number; burn_rate: number; completion_pct: number;
  days_in_current_status: number; ai_narrative: string;
  early_warning: { score: number; components: Record<string, number> };
  health_dimensions: Record<string, 'green' | 'amber' | 'red'>;
}
interface Lesson { source_project_name?: string; category?: string; title?: string; description?: string; applicability_score?: number }

interface PhaseStep { id: Phase; label: string; n: string; state: 'done' | 'active' | 'pending'; note: string }
interface Scenario {
  project: string; client: string; rescueLead: string;
  dayOfRescue: number; valueAtRisk: number;
  reportedStatus: string; trueStatus: string; statusDelta: number;
  ewCurrent: number; ewStart: number; ewTarget: number; targetGreen: string;
  ewSeries: number[];
  milestonesDone: number; milestonesTotal: number;
  redFlags: { flag: string; detail: string; sev: 'high' | 'med' }[];
  rootCauses: string[];
  warRoom: { day: number; date: string; ew: number; onTrack: boolean; note: string }[];
  charter: { decision: CharterDecision; revisedScope: string; resourceAsks: string[]; approvedAt: string };
  board: { sponsor: string; members: string[]; nextSession: string; recentDecisions: { decision: string; owner: string; when: string }[] };
  copilotRecommend: string;
  copilotFeed: { kind: FeedKind; text: string; when: string }[];
  exitCriteria: { criterion: string; met: boolean; progress: string }[];
  knowledge: { project: string; match: number; outcome: string; lesson: string }[];
  phases: PhaseStep[];
}

// ── deterministic RNG (stable per engagement) ────────────────────────────────
function hashStr(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function rngFrom(seed: number) {
  let a = seed >>> 0;
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

// ── date helpers ─────────────────────────────────────────────────────────────
const addDays = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const md = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
const mdy = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const fmtMoney = (v: number) => v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(1)}M` : `$${(v / 1_000).toFixed(0)}K`;

const TIERS = ['GREEN', 'AMBER', 'RED'];
const FEED_ICON: Record<FeedKind, typeof FileText> = { prep: FileText, alert: AlertTriangle, insight: BookOpen, ok: Activity };

// Component → human-readable red flag / root cause / resource ask templates
const FLAG_TPL: Record<string, { flag: string; detail: (p: ProjectMonitor) => string }> = {
  burn_completion_gap: { flag: 'Earned-value divergence', detail: p => `${p.burn_rate}% burned at only ${p.completion_pct}% complete — CPI ≈ ${(p.completion_pct / Math.max(1, p.burn_rate)).toFixed(2)}` },
  satisfaction_trend: { flag: 'Client satisfaction declining', detail: () => 'Sponsor engagement weakening; satisfaction signal trending down' },
  escalation_frequency: { flag: 'Escalation frequency rising', detail: p => `Repeated escalations during ${p.phase}` },
  milestone_slip_rate: { flag: 'Milestones slipping', detail: () => 'Delivery cadence decelerating against the plan' },
  raid_severity: { flag: 'RAID severity accumulating', detail: () => 'Unresolved high-severity risks and issues clustering' },
  health_trend_velocity: { flag: 'Rapid health deterioration', detail: () => 'Multiple dimensions moved toward Red recently' },
};
const CAUSE_TPL: Record<string, (p: ProjectMonitor) => string> = {
  burn_completion_gap: p => `Budget burn outpaced delivery (${p.burn_rate}% consumed at ${p.completion_pct}% complete) and was never re-baselined`,
  milestone_slip_rate: p => `A critical-path dependency went unmanaged through the ${p.phase} phase`,
  satisfaction_trend: () => 'Stakeholder expectations were not reset after early scope changes',
  raid_severity: () => 'High-severity risks accumulated without assigned mitigation owners',
  escalation_frequency: () => 'Issues escalated repeatedly without root-cause resolution',
  health_trend_velocity: () => 'Health eroded across multiple dimensions faster than governance could respond',
};
const ASK_TPL: Record<string, string> = {
  burn_completion_gap: 'Commercial renegotiation on out-of-scope change requests',
  milestone_slip_rate: '+1 senior technical lead to clear the critical path',
  satisfaction_trend: 'Executive sponsor air-cover for client realignment',
  raid_severity: 'Dedicated risk owner for the top RAID items',
  escalation_frequency: 'Named executive owner for the escalation path',
  health_trend_velocity: 'Additional delivery capacity to stabilize the team',
};
const BLOCKER_PHRASE: Record<string, string> = {
  burn_completion_gap: 'the budget-burn vs completion gap',
  milestone_slip_rate: 'the slipping critical-path milestone',
  satisfaction_trend: 'the softening client-sponsor relationship',
  raid_severity: 'the cluster of unmitigated high-severity risks',
  escalation_frequency: 'the rising escalation frequency',
  health_trend_velocity: 'the broad health deterioration',
};
const SPONSORS = ['Marcus Bell · VP Delivery', 'Elena Cho · VP Delivery', 'David Okafor · GM Services', 'Sofia Ramos · VP Delivery'];
const ACCOUNT_EXECS = ['Dana Liu', 'Raj Patel', 'Mara Jensen', 'Tom Becker'];

function buildScenario(p: ProjectMonitor, lessons: Lesson[], leadParam: string | null): Scenario {
  const R = rngFrom(hashStr(p.project_id || p.name));
  const ri = (lo: number, hi: number) => Math.floor(R() * (hi - lo + 1)) + lo;
  const pick = <T,>(arr: T[]) => arr[Math.floor(R() * arr.length)];

  const ewCurrent = Math.round(p.early_warning.score);
  const ewTarget = 40;
  const ewStart = Math.min(98, ewCurrent + ri(12, 20));
  const today = new Date();

  // status: reported vs agent-assessed "true"
  const reportedIdx = TIERS.indexOf(p.overall_health.toUpperCase());
  const worsenBy = ewCurrent >= 82 ? 2 : ewCurrent >= 62 ? 1 : 0;
  const trueIdx = Math.min(2, reportedIdx + worsenBy);
  const statusDelta = trueIdx - reportedIdx;

  const dayOfRescue = Math.min(18, Math.max(7, p.days_in_current_status || ri(9, 15)));
  const valueAtRisk = Math.round(p.budget * (ewCurrent / 100));

  // recovery trajectory: declining series from ewStart → ewCurrent with noise
  const n = 12;
  const ewSeries = Array.from({ length: n }, (_, i) => {
    if (i === 0) return ewStart;
    if (i === n - 1) return ewCurrent;
    const base = ewStart + (ewCurrent - ewStart) * (i / (n - 1));
    return Math.max(ewTarget + 2, Math.min(98, Math.round(base + (R() * 6 - 3))));
  });

  // weeks-to-green and target date
  const weeksToGreen = Math.max(3, Math.min(10, Math.ceil((ewCurrent - ewTarget) / 6)));
  const targetGreen = mdy(addDays(today, weeksToGreen * 7));
  const declaredAt = addDays(today, -dayOfRescue);
  const approvedAt = md(addDays(declaredAt, Math.min(7, dayOfRescue - 1)));
  const nextSession = `${md(addDays(today, ri(2, 5)))} · 9:00 AM`;

  // rank signal components
  const comps = p.early_warning.components || {};
  const ranked = Object.keys(FLAG_TPL)
    .map(k => ({ k, v: Math.round(comps[k] ?? 0) }))
    .sort((a, b) => b.v - a.v);
  const topKeys = ranked.filter(r => r.v >= 35).slice(0, 4).map(r => r.k);
  const keys = topKeys.length >= 2 ? topKeys : ranked.slice(0, 3).map(r => r.k);

  const redFlags = keys.slice(0, 4).map(k => {
    const v = Math.round(comps[k] ?? 0);
    return { flag: FLAG_TPL[k].flag, detail: FLAG_TPL[k].detail(p), sev: (v >= 62 ? 'high' : 'med') as 'high' | 'med' };
  });

  const firstSentence = (p.ai_narrative || '').split(/(?<=\.)\s/)[0]?.trim();
  const rootCauses = [
    ...(firstSentence ? [firstSentence.replace(/\.$/, '') + '.'] : []),
    ...keys.slice(0, 2).map(k => CAUSE_TPL[k](p)),
  ].filter((v, i, a) => a.indexOf(v) === i).slice(0, 3);

  const topKey = keys[0];
  const blocker = BLOCKER_PHRASE[topKey] || 'the top open risk';

  // war room: last 4 days from the tail of the series
  const tail = ewSeries.slice(-4);
  const wrNotes: Record<string, string[]> = {
    burn_completion_gap: ['Re-baselined the budget and froze out-of-scope change requests.', 'Commercial renegotiation opened with the client on deferred scope.'],
    milestone_slip_rate: ['Critical-path dependency unblocked; milestone re-sequenced.', 'Added a senior lead to recover the slipping milestone.'],
    satisfaction_trend: ['Client sponsor re-engaged; expectations reset for the revised plan.', 'Steering cadence restored with the client sponsor.'],
    raid_severity: ['Top RAID items assigned owners and mitigation dates.', 'High-severity risk burned down after owner reassignment.'],
    escalation_frequency: ['Escalation path clarified with a named exec owner.', 'Open escalations triaged and consolidated.'],
    health_trend_velocity: ['Added delivery capacity; two dimensions stabilized.', 'Team re-baselined to halt the health slide.'],
  };
  const notePool = wrNotes[topKey] || ['Recovery actions progressing against the charter.'];
  const warRoom = tail.map((ew, i) => {
    const dayN = dayOfRescue - (tail.length - 1 - i);
    const onTrack = i === 0 ? false : true; // oldest day was the setback that triggered tighter command
    return {
      day: dayN, date: md(addDays(today, -(tail.length - 1 - i))), ew, onTrack,
      note: i === 0
        ? `Setback: ${blocker} flagged. Escalated to the Recovery Board.`
        : notePool[(i - 1) % notePool.length],
    };
  }).reverse();
  const onTrackCount = warRoom.filter(w => w.onTrack).length;

  // charter
  const decision: CharterDecision = ewCurrent >= 90 ? 'reset' : 'go';
  const resourceAsks = keys.slice(0, 3).map(k => ASK_TPL[k]).filter((v, i, a) => a.indexOf(v) === i);
  if (resourceAsks.length < 2) resourceAsks.push('Executive sponsor air-cover for client realignment');
  const charter = {
    decision,
    revisedScope: `Re-baselined to protect the ${p.phase} commitments; lower-priority workstreams deferred to a follow-on SOW.`,
    resourceAsks,
    approvedAt,
  };

  // board
  const sponsor = pick(SPONSORS);
  const accountExec = pick(ACCOUNT_EXECS);
  const lead = leadParam || 'Priya Nadkarni · QA Director';
  const leadName = lead.split('·')[0].trim();
  const board = {
    sponsor,
    members: [
      `Account Exec — ${accountExec}`,
      `QA Director — ${leadName}`,
      `Delivery PM — ${p.project_manager}`,
      `Client Sponsor — ${p.client_name} (invited)`,
    ],
    nextSession,
    recentDecisions: [
      { decision: `Approved ${decision.toUpperCase()} on the revised charter`, owner: 'Board', when: approvedAt },
      { decision: `Authorized ${resourceAsks[0].toLowerCase()}`, owner: sponsor.split('·')[0].trim().split(' ')[0] + '.', when: approvedAt },
      { decision: `Drive ${blocker} to closure`, owner: accountExec.split(' ')[0] + '.', when: md(addDays(today, ri(2, 5))) },
    ],
  };

  // milestones
  const milestonesTotal = 4;
  const milestonesDone = Math.max(0, Math.min(milestonesTotal, Math.round(((ewStart - ewCurrent) / Math.max(1, ewStart - ewTarget)) * milestonesTotal)));

  // exit criteria
  const greenDims = Object.values(p.health_dimensions || {}).filter(v => v === 'green').length;
  const totalDims = Object.values(p.health_dimensions || {}).length || 5;
  const exitCriteria = [
    { criterion: 'All health dimensions Green for 3 consecutive weeks', met: false, progress: `${greenDims}/${totalDims} Green · week 1 of 3` },
    { criterion: `Early Warning held below ${ewTarget}`, met: ewCurrent <= ewTarget, progress: `Currently ${ewCurrent} → target ${ewTarget}` },
    { criterion: 'Re-baselined milestones delivered and accepted', met: false, progress: `${milestonesDone} of ${milestonesTotal} accepted` },
    { criterion: 'Client sponsor satisfaction signal positive', met: false, progress: 'Re-engaged · awaiting signal' },
  ];
  const heldCount = exitCriteria.filter(c => c.met).length;

  // knowledge network — pull analogous lessons from the same dataset
  const relevant = (lessons || [])
    .filter(l => l.category === 'failure_mode' || l.category === 'risk_mitigation')
    .sort((a, b) => (b.applicability_score ?? 0) - (a.applicability_score ?? 0))
    .slice(0, 2);
  let knowledge = relevant.map(l => ({
    project: l.source_project_name || 'Prior engagement',
    match: ri(80, 95),
    outcome: `Recovered in ${ri(45, 70)} days`,
    lesson: l.title || l.description || 'Lessons captured in the Knowledge Network.',
  }));
  if (knowledge.length < 2) {
    knowledge = [
      ...knowledge,
      { project: 'Fabrikam Network Modernization', match: ri(84, 93), outcome: `Recovered in ${ri(48, 60)} days`, lesson: 'Re-baselining the dependency chain early was decisive.' },
    ].slice(0, 2);
  }

  const trendWord = ewCurrent < ewStart ? 'burning down' : 'holding';
  const copilotRecommend = `Hold Rescue intensity — EW is ${trendWord} (${ewStart}→${ewCurrent}). The next blocker is ${blocker}; escalate it at the ${nextSession.split('·')[0].trim()} board.`;
  const copilotFeed = [
    { kind: 'prep' as FeedKind, text: `Drafted the Recovery Board pack for the ${nextSession.split('·')[0].trim()} session.`, when: '2h ago' },
    { kind: 'alert' as FeedKind, text: `${blocker.charAt(0).toUpperCase() + blocker.slice(1)} flagged as the next critical-path risk.`, when: '5h ago' },
    { kind: 'insight' as FeedKind, text: `Surfaced ${knowledge.length} analogous rescue${knowledge.length !== 1 ? 's' : ''} from the Knowledge Network.`, when: '1d ago' },
    { kind: 'ok' as FeedKind, text: `Daily health check complete — EW ${ewCurrent}, ${onTrackCount} of last ${warRoom.length} days on track.`, when: '1d ago' },
  ];

  const phases: PhaseStep[] = [
    { id: 'triage', label: 'Declare & Triage', n: '1', state: 'done', note: '72h audit · true status established' },
    { id: 'stabilize', label: 'Stabilize', n: '2', state: 'done', note: 'Scope frozen · sponsor secured' },
    { id: 'recharter', label: 'Re-Charter', n: '3', state: 'done', note: `${decision.toUpperCase()} approved by Recovery Board` },
    { id: 'war_room', label: 'War Room', n: '4', state: 'active', note: 'Daily command · EW burning down' },
    { id: 'exit', label: 'Stabilized Exit', n: '5', state: 'pending', note: `${heldCount} of ${exitCriteria.length} exit criteria held` },
  ];

  return {
    project: p.name, client: p.client_name, rescueLead: lead,
    dayOfRescue, valueAtRisk,
    reportedStatus: TIERS[reportedIdx], trueStatus: TIERS[trueIdx], statusDelta,
    ewCurrent, ewStart, ewTarget, targetGreen, ewSeries,
    milestonesDone, milestonesTotal,
    redFlags, rootCauses, warRoom, charter, board,
    copilotRecommend, copilotFeed, exitCriteria, knowledge, phases,
  };
}

// Curated fallback (used when the dataset can't be loaded or matched)
function buildDefault(params: URLSearchParams): Scenario {
  const ewCurrent = Number(params.get('ew')) || 71;
  const ewStart = 88, ewTarget = 40;
  const today = new Date();
  return {
    project: params.get('project') || 'Adatum Cloud Foundation',
    client: params.get('client') || 'Adatum Corporation',
    rescueLead: params.get('lead') || 'Priya Nadkarni · QA Director',
    dayOfRescue: 12,
    valueAtRisk: Number(params.get('var')) || 540_000,
    reportedStatus: 'AMBER', trueStatus: 'RED', statusDelta: 1,
    ewCurrent, ewStart, ewTarget,
    targetGreen: mdy(addDays(today, 49)),
    ewSeries: [88, 87, 89, 85, 83, 84, 80, 78, 76, 74, 72, ewCurrent],
    milestonesDone: 2, milestonesTotal: 4,
    redFlags: [
      { flag: 'Scope creep with no budget/timeline change', detail: '3 change requests absorbed without commercial adjustment', sev: 'high' },
      { flag: 'Sponsor disengagement', detail: 'Client sponsor missed last 2 steering committees', sev: 'high' },
      { flag: 'Earned-value divergence', detail: 'CPI 0.78 · SPI 0.71 — both well below baseline', sev: 'high' },
      { flag: 'Key-person dependency', detail: 'Lead architect 100% allocated, no backup', sev: 'med' },
    ],
    rootCauses: [
      'ExpressRoute provisioning dependency under-managed — 6-week slip never re-baselined',
      'Requirements signed off before landing-zone design was validated',
      'No technical architect assigned until Day 70 (setup checkpoint gap)',
    ],
    warRoom: [
      { day: 12, date: md(today), ew: ewCurrent, onTrack: true, note: 'Landing-zone design re-validated with client architects. Milestone R3 unblocked.' },
      { day: 11, date: md(addDays(today, -1)), ew: 72, onTrack: true, note: 'ExpressRoute alternate circuit confirmed — removes the critical-path dependency.' },
      { day: 10, date: md(addDays(today, -2)), ew: 74, onTrack: true, note: 'Technical architect onboarded full-time. Backup identified for lead.' },
      { day: 9, date: md(addDays(today, -3)), ew: 76, onTrack: false, note: 'Client sponsor re-engaged but pushed back on revised timeline. Escalated to Recovery Board.' },
    ],
    charter: {
      decision: 'go',
      revisedScope: 'Phase 1 landing zone + 2 priority workloads. Workloads 3–4 deferred to a follow-on SOW.',
      resourceAsks: ['+1 Technical Architect (committed)', 'Backup network engineer', 'Exec sponsor air-cover for client renegotiation'],
      approvedAt: md(addDays(today, -5)),
    },
    board: {
      sponsor: 'Marcus Bell · VP Delivery',
      members: ['Account Exec — Dana Liu', 'QA Director — Priya Nadkarni', 'Delivery PM — Tom Reyes', 'Client Sponsor — invited (Standard disclosure)'],
      nextSession: `${md(addDays(today, 4))} · 9:00 AM`,
      recentDecisions: [
        { decision: 'Approved GO on revised charter', owner: 'Board', when: md(addDays(today, -5)) },
        { decision: 'Authorized +1 architect & backup engineer', owner: 'M. Bell', when: md(addDays(today, -5)) },
        { decision: 'Open client renegotiation on deferred workloads', owner: 'D. Liu', when: md(addDays(today, 4)) },
      ],
    },
    copilotRecommend: 'Hold Rescue intensity one more week. EW is burning down steadily but the R4 dependency on client data sign-off is the next blocker — escalate it at the next board.',
    copilotFeed: [
      { kind: 'prep', text: 'Drafted Recovery Board pack — status, EW trend, charter, 2 asks.', when: '2h ago' },
      { kind: 'alert', text: 'Milestone R4 at risk — dependency on client data migration sign-off slipping.', when: '5h ago' },
      { kind: 'insight', text: 'Surfaced 2 analogous rescues from the Knowledge Network with 89% recovery rate.', when: '1d ago' },
      { kind: 'ok', text: `Daily health check complete — EW down to ${ewCurrent}. On track 3 of last 4 days.`, when: '1d ago' },
    ],
    exitCriteria: [
      { criterion: 'All health dimensions Green for 3 consecutive weeks', met: false, progress: 'Week 1 of 3' },
      { criterion: `Early Warning held below ${ewTarget}`, met: false, progress: `Currently ${ewCurrent} → target ${ewTarget}` },
      { criterion: 'Revised milestones R1–R4 delivered & accepted', met: false, progress: 'R1–R2 done · R3 in progress' },
      { criterion: 'Client sponsor satisfaction signal positive', met: false, progress: 'Re-engaged · awaiting signal' },
    ],
    knowledge: [
      { project: 'Fabrikam Network Modernization', match: 92, outcome: 'Recovered in 51 days', lesson: 'Re-baselining the dependency chain early was decisive.' },
      { project: 'Northwind Cloud Migration', match: 86, outcome: 'Recovered in 63 days', lesson: 'Adding a backup architect removed the key-person risk that stalled week 2.' },
    ],
    phases: [
      { id: 'triage', label: 'Declare & Triage', n: '1', state: 'done', note: '72h audit · true status established' },
      { id: 'stabilize', label: 'Stabilize', n: '2', state: 'done', note: 'Scope frozen · sponsor secured' },
      { id: 'recharter', label: 'Re-Charter', n: '3', state: 'done', note: 'GO approved by Recovery Board' },
      { id: 'war_room', label: 'War Room', n: '4', state: 'active', note: 'Daily command · EW burning down' },
      { id: 'exit', label: 'Stabilized Exit', n: '5', state: 'pending', note: '0 of 4 exit criteria held' },
    ],
  };
}

function MissionClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  return (
    <span className="tabular-nums font-mono">
      {now.toLocaleTimeString('en-US', { hour12: false })} UTC{now.getTimezoneOffset() <= 0 ? '+' : '-'}
    </span>
  );
}

// EW burndown SVG
function EWBurndown({ series, target }: { series: number[]; target: number }) {
  const W = 640, H = 170, padL = 34, padB = 22, padT = 12;
  const data = series;
  const lo = 30, hi = 95;
  const x = (i: number) => padL + (i / (data.length - 1)) * (W - padL - 10);
  const y = (v: number) => padT + (1 - (v - lo) / (hi - lo)) * (H - padT - padB);

  const linePath = data.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L ${x(data.length - 1).toFixed(1)} ${(H - padB).toFixed(1)} L ${padL} ${(H - padB).toFixed(1)} Z`;
  const projPath = `M ${x(data.length - 1).toFixed(1)} ${y(data[data.length - 1]).toFixed(1)} L ${W - 10} ${y(target).toFixed(1)}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-44">
      <defs>
        <linearGradient id="ewfill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[40, 60, 80].map(g => (
        <g key={g}>
          <line x1={padL} x2={W - 10} y1={y(g)} y2={y(g)} stroke="#1e293b" strokeWidth="1" />
          <text x={6} y={y(g) + 3} fill="#475569" fontSize="9">{g}</text>
        </g>
      ))}
      <line x1={padL} x2={W - 10} y1={y(target)} y2={y(target)} stroke="#10b981" strokeWidth="1.25" strokeDasharray="4 3" />
      <text x={W - 10} y={y(target) - 4} fill="#34d399" fontSize="9" textAnchor="end">TARGET GREEN ≤ {target}</text>
      <path d={areaPath} fill="url(#ewfill)" />
      <path d={linePath} fill="none" stroke="#f59e0b" strokeWidth="2.25" />
      <path d={projPath} fill="none" stroke="#34d399" strokeWidth="1.75" strokeDasharray="5 4" opacity="0.8" />
      {data.map((v, i) => (
        <circle key={i} cx={x(i)} cy={y(v)} r={i === data.length - 1 ? 4 : 2} fill={i === data.length - 1 ? '#fbbf24' : '#b45309'} stroke={i === data.length - 1 ? '#fff7ed' : 'none'} strokeWidth="1.5" />
      ))}
      <text x={x(0)} y={H - 6} fill="#475569" fontSize="9">Day 1</text>
      <text x={x(data.length - 1)} y={H - 6} fill="#fbbf24" fontSize="9" textAnchor="middle">Now</text>
    </svg>
  );
}

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
  const search = params.toString();
  const [scenario, setScenario] = useState<Scenario | null>(null);

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
        if (!p) p = [...projects].sort((a, b) => b.early_warning.score - a.early_warning.score)[0];
        setScenario(p ? buildScenario(p, lessons, q.get('lead')) : buildDefault(q));
      })
      .catch(() => { if (alive) setScenario(buildDefault(q)); });
    return () => { alive = false; };
  }, [search]);

  if (!scenario) {
    return (
      <div className="-m-8 min-h-screen bg-slate-950 text-slate-300 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <Siren className="w-8 h-8 text-red-500" />
            <span className="absolute -inset-1 rounded-full bg-red-500/30 animate-ping" />
          </div>
          <div className="text-sm tracking-widest uppercase text-slate-400">Establishing ground truth…</div>
        </div>
      </div>
    );
  }

  const e = scenario;
  const ewDelta = e.ewStart - e.ewCurrent;

  return (
    <div className="-m-8 min-h-screen bg-slate-950 text-slate-200 selection:bg-amber-500/30">
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
              {e.phases.map((p, i) => (
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
                  {i < e.phases.length - 1 && <ArrowRight className="w-4 h-4 text-slate-700 flex-shrink-0" />}
                </div>
              ))}
            </div>
          </div>

          {/* ── KPI strip ────────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatTile label="Days in Rescue" value={e.dayOfRescue} sub={`Target Green ${e.targetGreen}`} accent="text-amber-400" Icon={Clock} />
            <StatTile label="Early Warning" value={<span className="text-amber-400">{e.ewCurrent}</span>}
              sub={`▼ ${ewDelta} from ${e.ewStart} at declare`} accent="text-emerald-400" Icon={TrendingDown} />
            <StatTile label="Recovery Milestones" value={<>{e.milestonesDone}<span className="text-slate-600 text-lg"> / {e.milestonesTotal}</span></>} sub={`${e.milestonesDone} accepted · ${Math.max(0, e.milestonesTotal - e.milestonesDone)} in flight`} accent="text-sky-400" Icon={Target} />
            <StatTile label="Charter Decision" value={<span className={e.charter.decision === 'go' ? 'text-emerald-400' : 'text-amber-400'}>{e.charter.decision.toUpperCase()}</span>} sub={`Board-approved ${e.charter.approvedAt}`} accent={e.charter.decision === 'go' ? 'text-emerald-400' : 'text-amber-400'} Icon={Flag} />
          </div>

          {/* ── Main grid ────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
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
                    <div className="text-lg font-black text-white">{e.statusDelta > 0 ? `+${e.statusDelta} tier` : 'confirmed'}</div>
                  </div>
                </div>

                <div className="text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-2">Red Flags Detected</div>
                <div className="grid sm:grid-cols-2 gap-2 mb-4">
                  {e.redFlags.map((f, i) => (
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
                  {e.rootCauses.map((rc, i) => (
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
                <EWBurndown series={e.ewSeries} target={e.ewTarget} />
                <div className="text-[11px] text-slate-500 mt-1">
                  Projected to reach <span className="text-emerald-400 font-semibold">Green (≤{e.ewTarget})</span> by {e.targetGreen} if the current trajectory holds.
                </div>
              </Panel>

              {/* War room log */}
              <Panel title="War Room — Daily Command Log" icon={Radio} accent="text-emerald-400"
                right={<span className="text-[10px] text-slate-500">Phase 4 · daily cadence</span>}>
                <div className="space-y-2">
                  {e.warRoom.map((d, i) => (
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

            {/* Right column */}
            <div className="space-y-5">

              {/* Rescue Copilot */}
              <Panel title="Rescue Copilot" icon={Bot} accent="text-cyan-400"
                right={<span className="flex items-center gap-1 text-[10px] text-cyan-400"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />active</span>}>
                <div className="rounded-lg bg-cyan-500/10 border border-cyan-500/30 px-3 py-2.5 mb-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Zap className="w-3.5 h-3.5 text-cyan-300" />
                    <span className="text-[10px] font-bold tracking-widest uppercase text-cyan-300">Copilot Recommends</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">{e.copilotRecommend}</p>
                </div>
                <div className="space-y-2.5">
                  {e.copilotFeed.map((f, i) => {
                    const Icon = FEED_ICON[f.kind];
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
                right={<span className={clsx('px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider', e.charter.decision === 'go' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/15 text-amber-300')}>{e.charter.decision.toUpperCase()}</span>}>
                <div className="flex gap-1.5 mb-3">
                  {(['go', 'reset', 'stop'] as const).map(d => (
                    <div key={d} className={clsx('flex-1 text-center rounded-md py-1.5 text-[11px] font-bold tracking-wider uppercase border',
                      e.charter.decision === d
                        ? d === 'go' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' : 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                        : 'bg-slate-950/50 border-slate-800 text-slate-600')}>
                      {d}
                    </div>
                  ))}
                </div>
                <div className="text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-1">Revised Scope</div>
                <p className="text-[11px] text-slate-300 mb-3 leading-relaxed">{e.charter.revisedScope}</p>
                <div className="text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-1.5">Resource Asks</div>
                <div className="space-y-1 mb-1">
                  {e.charter.resourceAsks.map((r, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-300"><span className="text-emerald-400 mt-0.5">+</span>{r}</div>
                  ))}
                </div>
              </Panel>

              {/* Executive Recovery Board */}
              <Panel title="Executive Recovery Board" icon={Users} accent="text-sky-400"
                right={<span className="text-[10px] text-slate-500">Next {e.board.nextSession.split('·')[0]}</span>}>
                <div className="rounded-lg bg-slate-950/50 border border-slate-800 px-3 py-2 mb-3">
                  <div className="text-[10px] tracking-widest uppercase text-slate-500">Chair / Sponsor</div>
                  <div className="text-xs font-semibold text-slate-200">{e.board.sponsor}</div>
                </div>
                <div className="space-y-1 mb-3">
                  {e.board.members.map((m, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-400"><Circle className="w-1.5 h-1.5 fill-slate-600 text-slate-600" />{m}</div>
                  ))}
                </div>
                <div className="text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-1.5">Recent Decisions</div>
                <div className="space-y-1.5">
                  {e.board.recentDecisions.map((d, i) => (
                    <div key={i} className="flex items-start gap-2 text-[11px]">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300">{d.decision} <span className="text-slate-600">· {d.owner} · {d.when}</span></span>
                    </div>
                  ))}
                </div>
              </Panel>

              {/* Exit criteria */}
              <Panel title="Exit Criteria — Handback Gate" icon={Target} accent="text-amber-400"
                right={<span className="text-[10px] text-slate-500">{e.exitCriteria.filter(c => c.met).length} of {e.exitCriteria.length} held</span>}>
                <div className="space-y-2">
                  {e.exitCriteria.map((c, i) => (
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
                  {e.knowledge.map((k, i) => (
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
            Rescue Command · AI-Driven Quality Assurance · Section 11 — Executive Oversight &amp; Rescue Engagement Model · Data-driven from portfolio signals
          </div>
        </div>
      </div>
    </div>
  );
}
