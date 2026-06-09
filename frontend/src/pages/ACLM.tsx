import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Bot, Network, BookOpen, BarChart2, Server,
  TrendingUp, Zap, Shield, Lock, Globe, ClipboardList,
  Scale, Brain, Activity, ArrowRight, ChevronRight, ExternalLink,
} from 'lucide-react';
import clsx from 'clsx';

// ── Strategic Pillars ──────────────────────────────────────────────────────
const PILLARS = [
  { icon: Network,    title: 'Agentic AI in CLM',       desc: 'Autonomous approval routing replacing manual workflow coordination',     status: 'Foundation' },
  { icon: BookOpen,   title: 'Playbook Enforcement',     desc: 'AI enforces clause standards and flags deviations before human review',  status: 'Foundation' },
  { icon: BarChart2,  title: 'Predictive Deal Scoring',  desc: 'ML-scored risk, delivery probability, and relationship health per deal', status: 'Foundation' },
  { icon: Server,     title: 'Big Tech Infrastructure',  desc: 'Salesforce, Microsoft, Google, AWS as the approval intelligence layer', status: 'Foundation' },
  { icon: TrendingUp, title: 'Industry Benchmarks',      desc: 'BCG, McKinsey, Accenture — how top firms have embedded AI in approvals', status: 'Foundation' },
  { icon: Zap,        title: 'The Frontier 2026–2028',   desc: 'Autonomous commerce, outcome-tied contracts, AI governance clauses',    status: 'Roadmap'    },
];

// ── Framework Tenets ───────────────────────────────────────────────────────
const TENETS = [
  { icon: Shield,        label: 'Empowerment Tables',      desc: 'Authority thresholds defining who approves what at each deal value and risk tier',                 bg: 'bg-blue-50',    border: 'border-blue-200',    iconBg: 'bg-blue-100',    iconColor: 'text-blue-700',    heading: 'text-blue-900'    },
  { icon: Lock,          label: 'Enterprise Auth Policies', desc: 'Service types, delivery models, and client segments that require specific approval paths',         bg: 'bg-blue-50',    border: 'border-blue-200',    iconBg: 'bg-blue-100',    iconColor: 'text-blue-700',    heading: 'text-blue-900'    },
  { icon: Globe,         label: 'Regional Business Rules',  desc: 'Distinct rule sets for Americas, EMEA, and APAC reflecting local regulatory and commercial norms', bg: 'bg-emerald-50', border: 'border-emerald-200', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-700', heading: 'text-emerald-900' },
  { icon: ClipboardList, label: 'Approval Playbook',        desc: 'The operational runbook governing end-to-end execution of the approval process',                    bg: 'bg-emerald-50', border: 'border-emerald-200', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-700', heading: 'text-emerald-900' },
  { icon: Scale,         label: 'Legal Compliance',         desc: 'Clause standards, deviation handling, jurisdiction requirements, and audit trail obligations',      bg: 'bg-purple-50',  border: 'border-purple-200',  iconBg: 'bg-purple-100',  iconColor: 'text-purple-700',  heading: 'text-purple-900'  },
  { icon: Brain,         label: 'Responsible AI',           desc: 'Model transparency, human oversight checkpoints, and AI governance clauses in contracts',           bg: 'bg-purple-50',  border: 'border-purple-200',  iconBg: 'bg-purple-100',  iconColor: 'text-purple-700',  heading: 'text-purple-900'  },
];

// ── Process Stages ─────────────────────────────────────────────────────────
const STAGES = [
  { n: 1, label: 'Opportunity\nApproval',          desc: 'Initial qualification and strategic fit assessment',           bg: 'bg-emerald-500', light: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-900' },
  { n: 2, label: 'Deal\nShaping',                  desc: 'Scope definition, pricing model, and risk profiling',          bg: 'bg-blue-500',    light: 'bg-blue-50',    border: 'border-blue-300',    text: 'text-blue-900'    },
  { n: 3, label: 'Technical\nand Business',         desc: 'Delivery team confirmation and resource commitment',            bg: 'bg-indigo-600',  light: 'bg-indigo-50',  border: 'border-indigo-300',  text: 'text-indigo-900'  },
  { n: 4, label: 'Pricing &\nInvestment Approval', desc: 'Final P&L, margin, and ECIF investment review',                bg: 'bg-purple-600',  light: 'bg-purple-50',  border: 'border-purple-300',  text: 'text-purple-900'  },
  { n: 5, label: 'Deal\nApproval',                 desc: 'Tier-routed sign-off with AI Deal Intelligence Score',          bg: 'bg-purple-900',  light: 'bg-purple-50',  border: 'border-purple-400',  text: 'text-purple-900'  },
];

// ── Main Page ──────────────────────────────────────────────────────────────
export default function ACLM() {
  const navigate = useNavigate();

  return (
    <div>

      {/* ── Page Header ── */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/deal-approvals')}
          className="btn-ghost text-ink-faint text-sm mb-4 -ml-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to AI Deal Approvals
        </button>

        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-3 w-[3px] rounded-full bg-flux-sheen" />
              <span className="eyebrow">Strategy Framework</span>
            </div>
            <h1 className="page-title">A-CLM</h1>
            <p className="font-display text-base font-medium italic text-ink-soft mt-0.5">Agentic Contract Lifecycle Management</p>
            <p className="text-sm text-ink-faint mt-1.5 max-w-2xl">
              The operating model for AI-governed deal approvals — from opportunity qualification to pricing sign-off,
              grounded in policy, driven by agents, and closed-loop with delivery performance.
            </p>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className="live-chip"><span className="signal-dot !h-1.5 !w-1.5" />Powered by Claude</div>
          </div>
        </div>

        <div className="mt-5 h-px bg-gradient-to-r from-flux via-cyan-signal/40 to-transparent" />
      </div>

      {/* ── Strategic Foundation ── */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Strategic Foundation</h2>
          <span className="text-xs text-gray-400">6 pillars · Based on 2026 market intelligence</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {PILLARS.map(({ icon: Icon, title, desc, status }) => (
            <div key={title} className="card p-4 flex gap-3 hover:shadow-md transition-shadow">
              <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
                <Icon className="w-4 h-4 text-ms-blue" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-semibold text-gray-900 truncate">{title}</span>
                  <span className={clsx('flex-shrink-0 text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full',
                    status === 'Foundation' ? 'bg-ms-blue/10 text-ms-blue' : 'bg-amber-100 text-amber-700')}>
                    {status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Governance Framework ── */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Governance Framework</h2>
          <span className="text-xs text-gray-400">6 tenets · Policy-led · Regionally calibrated</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {TENETS.map(({ icon: Icon, label, desc, bg, border, iconBg, iconColor, heading }) => (
            <div key={label} className={clsx('rounded-xl border p-4', bg, border)}>
              <div className="flex items-start gap-3">
                <div className={clsx('flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center', iconBg)}>
                  <Icon className={clsx('w-4 h-4', iconColor)} />
                </div>
                <div>
                  <div className={clsx('text-sm font-bold mb-1', heading)}>{label}</div>
                  <p className="text-xs text-gray-600 leading-relaxed">{desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Deal Approval Process ── */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Deal Approval Process</h2>
          <span className="text-xs text-gray-400">5 stages · Sequential · AI-validated at each gate</span>
        </div>
        <div className="card p-5">
          <div className="flex items-stretch gap-0">
            {STAGES.map((stage, i) => (
              <div key={stage.n} className="flex items-center flex-1 min-w-0">
                <div className={clsx('flex-1 rounded-xl border p-4 min-w-0', stage.light, stage.border)}>
                  <div className={clsx('inline-flex items-center justify-center w-6 h-6 rounded-full text-white text-xs font-bold mb-2', stage.bg)}>
                    {stage.n}
                  </div>
                  <div className={clsx('text-xs font-bold leading-tight mb-1.5 whitespace-pre-line', stage.text)}>{stage.label}</div>
                  <p className="text-[11px] text-gray-500 leading-relaxed">{stage.desc}</p>
                </div>
                {i < STAGES.length - 1 && (
                  <div className="flex-shrink-0 flex items-center justify-center w-6">
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Agent Ecosystem ── */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Agent Ecosystem</h2>
          <span className="text-xs text-gray-400">3 agents · Closed-loop · Live feedback</span>
        </div>

        <div className="card p-5">
          <div className="grid grid-cols-3 gap-4 items-center">

            {/* Pipeline Agent */}
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-4 h-4 text-amber-700" />
                </div>
                <div>
                  <div className="text-sm font-bold text-amber-900">Pipeline Agent</div>
                  <div className="text-[10px] font-semibold text-amber-600 uppercase tracking-wide">Sends ahead →</div>
                </div>
              </div>
              <div className="space-y-2">
                {['Forward-looking signals on deal types approaching the approval funnel', 'Anticipated complexity and risk tiers', 'Bottleneck prediction'].map(item => (
                  <div key={item} className="flex items-start gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                    <span className="text-xs text-amber-800 leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Arrows + A-CLM Hub */}
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-1 text-amber-400 w-full justify-end pr-2">
                <div className="flex-1 h-px bg-amber-200" />
                <ArrowRight className="w-4 h-4 flex-shrink-0" />
              </div>

              {/* Clickable A-CLM Cockpit hub */}
              <button
                onClick={() => navigate('/aclm-cockpit')}
                className="w-full rounded-xl border-2 border-ms-blue bg-ms-blue p-4 text-white shadow-lg hover:bg-blue-700 hover:border-blue-700 transition-colors group text-left"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold">A-CLM Cockpit</div>
                    <div className="text-[10px] font-semibold text-blue-200 uppercase tracking-wide">Central Hub</div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-blue-300 group-hover:text-white transition-colors flex-shrink-0" />
                </div>
                <div className="space-y-1.5">
                  {['Approval routing', 'Playbook enforcement', 'Deal Intelligence Score', 'Audit trail'].map(item => (
                    <div key={item} className="flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-blue-300 flex-shrink-0" />
                      <span className="text-xs text-blue-100">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-white/20 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-blue-200 group-hover:text-white transition-colors">
                  Open Business Value Cockpit
                  <ArrowRight className="w-3 h-3" />
                </div>
              </button>

              <div className="flex items-center gap-1 text-emerald-400 w-full justify-start pl-2">
                <ArrowRight className="w-4 h-4 flex-shrink-0 rotate-180" />
                <div className="flex-1 h-px bg-emerald-200" />
              </div>
            </div>

            {/* Delivery Agent */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <Activity className="w-4 h-4 text-emerald-700" />
                </div>
                <div>
                  <div className="text-sm font-bold text-emerald-900">Delivery Agent</div>
                  <div className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wide">← Feeds back</div>
                </div>
              </div>
              <div className="space-y-2">
                {['Live health metrics per approved deal', 'Budget burn and milestone status', 'RAID updates and satisfaction scores'].map(item => (
                  <div key={item} className="flex items-start gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                    <span className="text-xs text-emerald-800 leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-400">
            <div className="w-1.5 h-1.5 rounded-full bg-ms-blue flex-shrink-0" />
            Closed-loop system — approval decisions inform delivery expectations; delivery outcomes refine future approval intelligence.
          </div>
        </div>
      </div>

    </div>
  );
}
