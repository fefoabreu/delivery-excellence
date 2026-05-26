import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Bot, Shield, Activity, Target, TrendingUp,
  Users, BookOpen, Globe, BarChart2, Eye, AlertTriangle,
  ArrowRight, ChevronRight, ExternalLink, Lightbulb, Heart,
} from 'lucide-react';
import clsx from 'clsx';

const PILLARS = [
  {
    n: 1, icon: Target, title: 'Engagement Setup Assurance',
    subtitle: '30-60-90 Day Assessments',
    desc: 'Mandatory checkpoints for top-quartile engagements validating governance, team, tooling, and delivery baselines at 30, 60, and 90 days post-kickoff.',
    status: 'Active', color: 'emerald',
  },
  {
    n: 2, icon: Eye, title: 'Preemptive Monitoring',
    subtitle: 'Always-On Surveillance',
    desc: 'Continuous analysis of RAID logs, health dimension trends, budget burn, milestone velocity, and satisfaction signals producing a composite Early Warning Score (0-100).',
    status: 'Active', color: 'emerald',
  },
  {
    n: 3, icon: Activity, title: 'Periodic Health Reviews',
    subtitle: 'Individual Project Assessments',
    desc: 'AI-generated Health Review Briefs comparing current health against historical trajectory and portfolio benchmarks. Four outcomes: Continue, Watch, Intervene, Escalate.',
    status: 'Active', color: 'emerald',
  },
  {
    n: 4, icon: Users, title: 'Regional Health Reviews',
    subtitle: 'Monthly Leadership Reviews',
    desc: 'AI-powered nomination engine selects candidate projects for leadership review, prepares talking points and materials, and tracks post-review actions to closure.',
    status: 'Active', color: 'emerald',
  },
  {
    n: 5, icon: TrendingUp, title: 'Executive Early Warning & Get-to-Green',
    subtitle: 'Tiered Alerts + Recovery Plans',
    desc: 'Three-tier alert system (Watch → Caution → Critical) with AI-generated Get-to-Green plans including root cause analysis, immediate actions, and weekly progress tracking.',
    status: 'Active', color: 'emerald',
  },
  {
    n: 6, icon: BookOpen, title: 'Knowledge Network',
    subtitle: 'Lessons Learned Knowledge Graph',
    desc: 'Captures, classifies, and connects lessons from project outcomes. Feeds Pipeline Agent (deal risk), Delivery Agent (phase guidance), and QA Agent (model tuning).',
    status: 'Active', color: 'blue',
  },
  {
    n: 7, icon: Heart, title: 'QA Director Partnership',
    subtitle: 'Human-AI Collaboration',
    desc: 'Agent monitors 100% of portfolio; QA Director focuses on the 10-15% needing human judgment. Override tracking feeds into QA Evals for continuous model improvement.',
    status: 'Active', color: 'blue',
  },
];

const DIFFERENTIATORS = [
  { icon: Globe, label: 'Client-Facing QA Agent', desc: 'Industry-first contract companion providing curated, permission-controlled quality assurance visibility to clients — no firm has productized this', bg: 'bg-teal-50', border: 'border-teal-200', iconBg: 'bg-teal-100', iconColor: 'text-teal-700', heading: 'text-teal-900' },
  { icon: BookOpen, label: 'Knowledge Network', desc: 'Agentic knowledge graph capturing lessons from every project and feeding them into the Pipeline and Delivery agents — closing the institutional memory loop', bg: 'bg-indigo-50', border: 'border-indigo-200', iconBg: 'bg-indigo-100', iconColor: 'text-indigo-700', heading: 'text-indigo-900' },
  { icon: BarChart2, label: 'QA Eval Model', desc: 'Prediction accuracy tracking (precision, recall, F1), director override analysis, and checkpoint-to-outcome correlation — proving the agent\'s value to the business', bg: 'bg-purple-50', border: 'border-purple-200', iconBg: 'bg-purple-100', iconColor: 'text-purple-700', heading: 'text-purple-900' },
];

const ALERT_STAGES = [
  { n: 1, label: 'Watch', threshold: '> 60', desc: 'PM and Delivery Lead notified. Update RAID log, address flags.', bg: 'bg-amber-500', light: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-900' },
  { n: 2, label: 'Caution', threshold: '> 75', desc: 'QA Director reviews within 48 hours and decides on intervention.', bg: 'bg-orange-500', light: 'bg-orange-50', border: 'border-orange-300', text: 'text-orange-900' },
  { n: 3, label: 'Critical', threshold: '> 85', desc: 'Executive notification with AI-generated risk brief within 1 week.', bg: 'bg-red-600', light: 'bg-red-50', border: 'border-red-300', text: 'text-red-900' },
];

export default function QAFramework() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="mb-8">
        <button onClick={() => navigate('/quality-assurance')}
          className="btn-ghost flex items-center gap-1.5 text-gray-400 text-sm mb-4 -ml-1">
          <ArrowLeft className="w-4 h-4" /> Back to AI Quality Assurance
        </button>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold tracking-widest text-ms-blue uppercase">Strategy Framework</span>
            </div>
            <h1 className="page-title flex items-center gap-2.5">
              <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-ms-blue">
                <Shield className="w-5 h-5 text-white" />
              </span>
              AI-QA Framework
            </h1>
            <p className="text-base font-medium text-gray-500 mt-0.5">AI-Driven Quality Assurance Operating Model</p>
            <p className="text-sm text-gray-400 mt-1 max-w-2xl">
              Proactive, always-on portfolio quality monitoring — transforming QA from a reactive review function
              into an intelligence layer that predicts and prevents delivery failures before they impact clients and revenue.
            </p>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 bg-gray-50 text-xs text-gray-400">
              <Bot className="w-3 h-3" /> Powered by Claude
            </div>
          </div>
        </div>

        <div className="mt-5 h-px bg-gradient-to-r from-ms-blue via-blue-300 to-transparent" />
      </div>

      {/* ── 7 Pillars ── */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">The 7 Pillars</h2>
          <span className="text-xs text-gray-400">7 capabilities · Always-on · AI-monitored</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {PILLARS.map(({ n, icon: Icon, title, subtitle, desc, status, color }) => (
            <div key={n} className="card p-4 flex gap-3 hover:shadow-md transition-shadow">
              <div className={clsx('flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center',
                color === 'emerald' ? 'bg-emerald-100' : 'bg-blue-100')}>
                <Icon className={clsx('w-4 h-4', color === 'emerald' ? 'text-emerald-700' : 'text-blue-700')} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-semibold text-gray-900 truncate">{title}</span>
                  <span className="flex-shrink-0 text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                    {status}
                  </span>
                </div>
                <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-1">{subtitle}</div>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Differentiators ── */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Differentiators</h2>
          <span className="text-xs text-gray-400">Industry-first capabilities</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {DIFFERENTIATORS.map(({ icon: Icon, label, desc, bg, border, iconBg, iconColor, heading }) => (
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

      {/* ── Early Warning Escalation Path ── */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Early Warning Escalation Path</h2>
          <span className="text-xs text-gray-400">3 tiers · Threshold-based · SLA-governed</span>
        </div>
        <div className="card p-5">
          <div className="flex items-stretch gap-0">
            {ALERT_STAGES.map((stage, i) => (
              <div key={stage.n} className="flex items-center flex-1 min-w-0">
                <div className={clsx('flex-1 rounded-xl border p-4 min-w-0', stage.light, stage.border)}>
                  <div className={clsx('inline-flex items-center justify-center w-6 h-6 rounded-full text-white text-xs font-bold mb-2', stage.bg)}>
                    {stage.n}
                  </div>
                  <div className={clsx('text-sm font-bold leading-tight mb-1', stage.text)}>{stage.label}</div>
                  <div className="text-[10px] font-medium text-gray-400 mb-1.5">Score {stage.threshold}</div>
                  <p className="text-[11px] text-gray-500 leading-relaxed">{stage.desc}</p>
                </div>
                {i < ALERT_STAGES.length - 1 && (
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
          <span className="text-xs text-gray-400">4 agents · Closed-loop · Knowledge-driven</span>
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
                  <div className="text-[10px] font-semibold text-amber-600 uppercase tracking-wide">Receives lessons →</div>
                </div>
              </div>
              <div className="space-y-2">
                {['Deal risk profiles informed by delivery outcomes', 'Historical success rates for similar engagements', 'Pre-sales handoff quality signals'].map(item => (
                  <div key={item} className="flex items-start gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                    <span className="text-xs text-amber-800 leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* QA Agent Hub */}
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-1 text-amber-400 w-full justify-end pr-2">
                <div className="flex-1 h-px bg-amber-200" />
                <ArrowRight className="w-4 h-4 flex-shrink-0" />
              </div>

              <div className="w-full rounded-xl border-2 border-ms-blue bg-ms-blue p-4 text-white shadow-lg text-left">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold">QA Agent</div>
                    <div className="text-[10px] font-semibold text-blue-200 uppercase tracking-wide">Central Intelligence</div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  {['Early warning monitoring', 'Get-to-Green recovery', 'Checkpoint assurance', 'Knowledge capture'].map(item => (
                    <div key={item} className="flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-blue-300 flex-shrink-0" />
                      <span className="text-xs text-blue-100">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-white/20 grid grid-cols-2 gap-2">
                  <button onClick={() => navigate('/qa-knowledge-network')}
                    className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-blue-200 hover:text-white transition-colors bg-white/10 rounded-lg py-1.5 px-2">
                    <BookOpen className="w-3 h-3" /> Knowledge Network <ExternalLink className="w-2.5 h-2.5" />
                  </button>
                  <button onClick={() => navigate('/qa-client-portal')}
                    className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-blue-200 hover:text-white transition-colors bg-white/10 rounded-lg py-1.5 px-2">
                    <Globe className="w-3 h-3" /> Client Portal <ExternalLink className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>

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
                  <div className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wide">← Feeds health data</div>
                </div>
              </div>
              <div className="space-y-2">
                {['Live health metrics per project', 'Budget burn and milestone status', 'RAID updates and satisfaction scores'].map(item => (
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
            Closed-loop system — delivery outcomes feed into QA intelligence; QA lessons improve pipeline risk assessment and future delivery guidance.
          </div>
        </div>
      </div>
    </div>
  );
}
