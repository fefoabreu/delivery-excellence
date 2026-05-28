import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Globe, CheckCircle, AlertTriangle, Activity, Clock,
  Bot, Eye, Shield, MessageSquare, Send, Sparkles, ChevronRight,
  Briefcase, Target, TrendingUp, Calendar, Building2, ExternalLink,
  Lock, User,
} from 'lucide-react';
import clsx from 'clsx';
import { qualityAssuranceApi } from '../api/client';

type HealthStatus = 'green' | 'amber' | 'red';
type DisclosurePolicy = 'minimal' | 'standard' | 'transparent';
type ViewMode = 'internal' | 'external';

interface ClientView {
  project_id: string; project_name: string; client_name: string;
  disclosure_policy: DisclosurePolicy; client_health_status: HealthStatus;
  client_narrative: string;
  milestone_progress: { name: string; status: string; due: string; completion_pct: number }[];
  disclosed_risks: { risk: string; mitigation: string; status: string }[];
  next_update_date: string; client_sentiment_signals: string[];
}

const HEALTH_CFG: Record<HealthStatus, { bg: string; text: string; dot: string; label: string }> = {
  green: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500', label: 'On Track' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500', label: 'Needs Attention' },
  red:   { bg: 'bg-red-50',   text: 'text-red-700',   dot: 'bg-red-500',   label: 'Critical' },
};
const DISCLOSURE_CFG: Record<DisclosurePolicy, { label: string; bg: string }> = {
  minimal:     { label: 'Minimal',     bg: 'bg-gray-100 text-gray-700' },
  standard:    { label: 'Standard',    bg: 'bg-blue-100 text-blue-700' },
  transparent: { label: 'Transparent', bg: 'bg-emerald-100 text-emerald-700' },
};

// Project-specific suggested questions for the AI Assistant
function suggestedQuestionsFor(view: ClientView): { category: string; questions: string[] }[] {
  return [
    {
      category: 'Project Goals & Vision',
      questions: [
        `What are the key business outcomes ${view.client_name} is aiming for with this engagement?`,
        'How will success be measured at project close?',
        'Which of our objectives are most at risk and why?',
      ],
    },
    {
      category: 'Progress & Milestones',
      questions: [
        'What milestones have been completed and what is next on the critical path?',
        'Are we on track for the next major deliverable?',
        'Which workstream is moving fastest and which is the constraint?',
      ],
    },
    {
      category: 'Risks & Mitigations',
      questions: [
        'What are the top three risks right now and what are we doing about each?',
        'Has anything changed in the risk picture since our last update?',
        'What support do you need from us to keep this project on track?',
      ],
    },
    {
      category: 'Strategic Decisions',
      questions: [
        'Are there any upcoming decisions that need executive input?',
        'How does this project connect to our broader strategic priorities?',
        'What lessons from similar projects should we apply here?',
      ],
    },
  ];
}

// ── Internal View ──────────────────────────────────────────────────────────
function InternalView({ views }: { views: ClientView[] }) {
  return (
    <div>
      <div className="card p-4 mb-6 bg-gradient-to-r from-slate-50 to-gray-50 border-slate-200">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-slate-600" />
          <div>
            <div className="text-sm font-bold text-gray-900">Internal Audit View — What Has Been Communicated to Clients</div>
            <div className="text-xs text-gray-500">Auditable log of disclosed narratives, milestones, and risks. Compare to internal QA data for transparency assurance.</div>
          </div>
          <div className="ml-auto text-right">
            <div className="text-xs font-bold text-slate-700">{views.length} projects configured</div>
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
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">Client-Facing Narrative (as disclosed)</div>
                  <p className="text-xs text-gray-700 leading-relaxed">{v.client_narrative}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">Milestone Progress Shared</div>
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
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">Risks Disclosed to Client</div>
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

// ── External Client View (simulated client portal) ─────────────────────────
function ExternalView({ views }: { views: ClientView[] }) {
  const [selectedId, setSelectedId] = useState(views[0]?.project_id || '');
  const view = views.find(v => v.project_id === selectedId) || views[0];
  const [chatInput, setChatInput] = useState('');
  const [activeCategory, setActiveCategory] = useState(0);

  if (!view) return null;

  const hcfg = HEALTH_CFG[view.client_health_status];
  const completedMilestones = view.milestone_progress.filter(m => m.status === 'completed').length;
  const overallProgress = view.milestone_progress.length > 0
    ? Math.round(view.milestone_progress.reduce((s, m) => s + m.completion_pct, 0) / view.milestone_progress.length)
    : 0;
  const suggestions = suggestedQuestionsFor(view);

  return (
    <div className="-mx-2">
      {/* Browser chrome simulation */}
      <div className="rounded-t-xl overflow-hidden border border-gray-300 shadow-lg">
        <div className="bg-gray-200 px-4 py-2 flex items-center gap-2 border-b border-gray-300">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 mx-3">
            <div className="bg-white rounded px-3 py-1 flex items-center gap-2 text-xs text-gray-600 border border-gray-300">
              <Lock className="w-3 h-3 text-green-600" />
              <span className="text-gray-500">https://</span>
              <span className="font-medium">{view.client_name.toLowerCase().replace(/[^a-z]+/g, '')}.partner-portal.contoso.com</span>
              <span className="text-gray-400">/projects/{view.project_id.slice(0, 8)}</span>
              <span className="ml-auto text-[10px] text-gray-400">Secure · TLS 1.3 · Client SSO</span>
            </div>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
        </div>

        {/* Client portal — sky/teal palette (different from Contoso blue) */}
        <div className="bg-gradient-to-br from-sky-50 via-white to-teal-50 min-h-[600px]">
          {/* Client portal header */}
          <div className="bg-white border-b border-sky-100 px-6 py-3 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900 leading-tight">{view.client_name}</div>
                <div className="text-[10px] text-sky-700 leading-tight font-medium">Partner Project Portal</div>
              </div>
            </div>

            {views.length > 1 && (
              <select value={selectedId} onChange={e => setSelectedId(e.target.value)}
                className="ml-4 bg-sky-50 border border-sky-200 rounded-lg px-3 py-1.5 text-xs text-gray-700 outline-none">
                {views.map(v => <option key={v.project_id} value={v.project_id}>{v.project_name}</option>)}
              </select>
            )}

            <div className="ml-auto flex items-center gap-3">
              <span className="text-xs text-gray-500">Welcome, <span className="font-semibold text-gray-700">Client Executive</span></span>
              <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center">
                <User className="w-4 h-4 text-sky-700" />
              </div>
            </div>
          </div>

          {/* Project header */}
          <div className="px-6 py-5 border-b border-sky-100">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[10px] font-bold text-sky-700 uppercase tracking-widest mb-1">Project Cockpit</div>
                <h1 className="text-xl font-bold text-gray-900">{view.project_name}</h1>
                <div className="text-xs text-gray-500 mt-0.5">Project status updated {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} · Next update {new Date(view.next_update_date).toLocaleDateString()}</div>
              </div>
              <div className={clsx('px-4 py-2 rounded-lg border', hcfg.bg, hcfg.text, 'border-current')}>
                <div className="flex items-center gap-2">
                  <div className={clsx('w-2 h-2 rounded-full', hcfg.dot)} />
                  <span className="font-bold text-sm">{hcfg.label}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main content: dashboard + AI assistant */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-6">
            {/* Left column: Dashboard */}
            <div className="lg:col-span-2 space-y-4">
              {/* KPI tiles */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white rounded-xl border border-sky-100 p-4 shadow-sm">
                  <div className="text-[10px] font-bold text-sky-700 uppercase tracking-wider mb-1.5">Overall Progress</div>
                  <div className="text-3xl font-bold text-gray-900 leading-none">{overallProgress}<span className="text-lg text-gray-400 font-normal">%</span></div>
                  <div className="text-[11px] text-gray-500 mt-1.5">Across all milestones</div>
                  <div className="mt-2 h-1.5 bg-sky-50 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-sky-500 to-teal-500 rounded-full" style={{ width: `${overallProgress}%` }} />
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-sky-100 p-4 shadow-sm">
                  <div className="text-[10px] font-bold text-sky-700 uppercase tracking-wider mb-1.5">Milestones Done</div>
                  <div className="text-3xl font-bold text-gray-900 leading-none">{completedMilestones}<span className="text-lg text-gray-400 font-normal"> / {view.milestone_progress.length}</span></div>
                  <div className="text-[11px] text-gray-500 mt-1.5">Completed on schedule</div>
                  <div className="flex gap-1 mt-2">
                    {view.milestone_progress.map((m, i) => (
                      <div key={i} className={clsx('flex-1 h-1.5 rounded-full', m.status === 'completed' ? 'bg-emerald-500' : m.status === 'in_progress' ? 'bg-sky-400' : 'bg-gray-200')} />
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-sky-100 p-4 shadow-sm">
                  <div className="text-[10px] font-bold text-sky-700 uppercase tracking-wider mb-1.5">Active Risks</div>
                  <div className="text-3xl font-bold text-gray-900 leading-none">{view.disclosed_risks.length}</div>
                  <div className="text-[11px] text-gray-500 mt-1.5">{view.disclosed_risks.filter(r => r.status === 'mitigated').length} mitigated · {view.disclosed_risks.filter(r => r.status !== 'mitigated').length} in progress</div>
                </div>
              </div>

              {/* Project narrative */}
              <div className="bg-white rounded-xl border border-sky-100 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-lg bg-sky-100 flex items-center justify-center">
                    <Briefcase className="w-3.5 h-3.5 text-sky-700" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">Where We Stand</h3>
                  <span className="ml-auto text-[10px] text-gray-400">From your Contoso delivery team</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{view.client_narrative}</p>
              </div>

              {/* Milestones */}
              <div className="bg-white rounded-xl border border-sky-100 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-lg bg-teal-100 flex items-center justify-center">
                    <Target className="w-3.5 h-3.5 text-teal-700" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">Delivery Milestones</h3>
                </div>
                <div className="space-y-3">
                  {view.milestone_progress.map((m, i) => {
                    const isDone = m.status === 'completed';
                    const isActive = m.status === 'in_progress';
                    return (
                      <div key={i} className="flex items-center gap-3">
                        <div className={clsx('w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0',
                          isDone ? 'bg-emerald-100' : isActive ? 'bg-sky-100' : 'bg-gray-100')}>
                          {isDone ? <CheckCircle className="w-4 h-4 text-emerald-600" />
                           : isActive ? <Activity className="w-4 h-4 text-sky-600" />
                           : <Calendar className="w-3.5 h-3.5 text-gray-400" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-0.5">
                            <span className={clsx('text-sm font-medium truncate', isDone ? 'text-gray-500' : 'text-gray-800')}>{m.name}</span>
                            <span className="text-xs text-gray-400 flex-shrink-0">{new Date(m.due).toLocaleDateString()}</span>
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className={clsx('h-full rounded-full', isDone ? 'bg-emerald-500' : 'bg-gradient-to-r from-sky-500 to-teal-500')} style={{ width: `${m.completion_pct}%` }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Disclosed risks */}
              <div className="bg-white rounded-xl border border-sky-100 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">Active Risks & Mitigations</h3>
                  <span className="ml-auto text-[10px] text-gray-400">Shared with full transparency</span>
                </div>
                <div className="space-y-2">
                  {view.disclosed_risks.map((r, i) => (
                    <div key={i} className="rounded-lg border border-amber-100 bg-amber-50/30 p-3">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="text-xs font-semibold text-gray-800">{r.risk}</div>
                        <span className={clsx('text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide flex-shrink-0',
                          r.status === 'mitigated' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700')}>{r.status}</span>
                      </div>
                      <div className="text-xs text-gray-600 leading-relaxed">{r.mitigation}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column: AI Assistant */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-sky-200 shadow-sm overflow-hidden sticky top-4">
                <div className="bg-gradient-to-r from-sky-600 to-teal-600 px-4 py-3 text-white">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-bold">Project Assistant</div>
                      <div className="text-[10px] text-sky-100">Ask anything about this project</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 max-h-[60vh] overflow-y-auto">
                  {/* AI greeting */}
                  <div className="flex gap-2 mb-4">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="flex-1 rounded-lg bg-sky-50 border border-sky-100 p-3 text-xs text-gray-700 leading-relaxed">
                      Hello! I am your dedicated project assistant for <strong>{view.project_name}</strong>. I have real-time visibility into your project status, milestones, risks, and strategic context. Here are some areas you may want to explore:
                    </div>
                  </div>

                  {/* Category tabs */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {suggestions.map((cat, i) => (
                      <button key={i} onClick={() => setActiveCategory(i)}
                        className={clsx('text-[10px] font-semibold px-2 py-1 rounded-full transition-colors',
                          activeCategory === i ? 'bg-sky-600 text-white' : 'bg-sky-50 text-sky-700 hover:bg-sky-100')}>
                        {cat.category}
                      </button>
                    ))}
                  </div>

                  {/* Suggested questions */}
                  <div className="space-y-1.5 mb-4">
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Suggested Questions</div>
                    {suggestions[activeCategory].questions.map((q, i) => (
                      <button key={i} onClick={() => setChatInput(q)}
                        className="w-full text-left rounded-lg border border-sky-100 bg-white hover:bg-sky-50 hover:border-sky-300 transition-colors p-2.5 flex items-start gap-2 group">
                        <MessageSquare className="w-3 h-3 text-sky-500 mt-0.5 flex-shrink-0 group-hover:text-sky-700" />
                        <span className="text-[11px] text-gray-700 leading-snug">{q}</span>
                        <ChevronRight className="w-3 h-3 text-gray-300 ml-auto flex-shrink-0 mt-0.5 group-hover:text-sky-500" />
                      </button>
                    ))}
                  </div>

                  {/* Discussion seed */}
                  <div className="rounded-lg bg-gradient-to-br from-sky-50 to-teal-50 border border-sky-100 p-3 mb-3">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Sparkles className="w-3 h-3 text-sky-600" />
                      <span className="text-[10px] font-bold text-sky-700 uppercase tracking-wide">Discuss with Your Team</span>
                    </div>
                    <p className="text-[11px] text-gray-700 leading-relaxed">
                      Based on your strategic priorities, consider raising these topics in your next steering committee: business value delivered to date, alignment of remaining scope with FY priorities, and resource readiness for the next phase.
                    </p>
                  </div>
                </div>

                {/* Chat input */}
                <div className="border-t border-sky-100 p-3 bg-white">
                  <div className="flex items-center gap-2">
                    <input
                      value={chatInput}
                      onChange={e => setChatInput(e.target.value)}
                      placeholder="Ask anything about this project..."
                      className="flex-1 bg-sky-50 border border-sky-100 rounded-lg px-3 py-2 text-xs outline-none focus:border-sky-400"
                    />
                    <button className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center hover:opacity-90 transition-opacity">
                      <Send className="w-3.5 h-3.5 text-white" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1.5 text-[9px] text-gray-400">
                    <Sparkles className="w-2.5 h-2.5" />
                    AI-powered · Project-aware · Confidential to {view.client_name}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Portal footer */}
          <div className="border-t border-sky-100 px-6 py-3 text-[10px] text-gray-400 flex items-center justify-between bg-white/50">
            <div>© 2026 Contoso Professional Services · Partner Project Portal</div>
            <div className="flex items-center gap-3">
              <span>Privacy</span>
              <span>Security</span>
              <span>Support</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 flex items-center gap-2 text-xs">
        <Eye className="w-3.5 h-3.5 text-amber-600" />
        <span className="text-amber-800"><strong>Preview Mode:</strong> This is how your client experiences the portal. The simulated client-portal URL, branding, and color palette are deliberately distinct from internal Contoso tooling.</span>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function QAClientPortal() {
  const navigate = useNavigate();
  const [views, setViews] = useState<ClientView[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<ViewMode>('external');

  useEffect(() => {
    qualityAssuranceApi.getData()
      .then(r => setViews(r.data.client_portal))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-12 text-center text-gray-400">Loading client portal...</div>;

  return (
    <div>
      <div className="mb-6">
        <button onClick={() => navigate('/qa-framework')}
          className="btn-ghost flex items-center gap-1.5 text-gray-400 text-sm mb-4 -ml-1">
          <ArrowLeft className="w-4 h-4" /> Back to AI-QA Framework
        </button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="page-title flex items-center gap-2">
              <Globe className="w-7 h-7 text-emerald-600" />
              Client-Facing QA Agent
            </h1>
            <p className="text-sm text-gray-500 mt-1 max-w-2xl">
              Industry-first contract companion — a secure, client-centric environment hosted outside the Contoso environment with an AI Assistant that proactively suggests what to ask, discuss, and act on.
            </p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 bg-gray-50 text-xs text-gray-400">
            <Bot className="w-3 h-3" /> Powered by Claude
          </div>
        </div>
      </div>

      {/* View toggle */}
      <div className="inline-flex rounded-lg bg-gray-100 p-1 mb-5">
        <button onClick={() => setMode('external')}
          className={clsx('flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs font-semibold transition-colors',
            mode === 'external' ? 'bg-white shadow-sm text-sky-700' : 'text-gray-500 hover:text-gray-700')}>
          <Globe className="w-3.5 h-3.5" /> Client Portal Preview
        </button>
        <button onClick={() => setMode('internal')}
          className={clsx('flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs font-semibold transition-colors',
            mode === 'internal' ? 'bg-white shadow-sm text-slate-700' : 'text-gray-500 hover:text-gray-700')}>
          <Shield className="w-3.5 h-3.5" /> Internal Audit View
        </button>
      </div>

      {mode === 'external' ? <ExternalView views={views} /> : <InternalView views={views} />}
    </div>
  );
}
