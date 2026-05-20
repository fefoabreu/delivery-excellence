import { useEffect, useRef, useState } from 'react';
import {
  X, CheckCircle, AlertTriangle, ShieldAlert, ChevronRight,
  TrendingUp, Users, Radio, FileText,
} from 'lucide-react';
import clsx from 'clsx';
import {
  RiskProfileData, RiskSection, RiskDimension, ReferenceProject,
  AgentMatch, MarketSignal, riskColor,
} from '../../data/risk-profile-data';
import { ContentBlock } from '../../data/sow-data';

// ── Types ──────────────────────────────────────────────────────────────────
interface Props {
  dealName: string;
  clientName: string;
  data: RiskProfileData;
  onClose: () => void;
}

const SECTION_TO_DIM: Record<string, string> = {
  'delivery-complexity': 'delivery_complexity',
  'client-readiness': 'client_readiness',
  'commercial-structure': 'commercial_structure',
  'execution-resourcing': 'execution_resourcing',
  'regulatory-compliance': 'regulatory_compliance',
  'partner-ecosystem': 'partner_ecosystem',
  'technology-maturity': 'technology_maturity',
};

// ── Helpers ────────────────────────────────────────────────────────────────
function outcomeIcon(o: ReferenceProject['outcome']) {
  if (o === 'success') return <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />;
  if (o === 'partial') return <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />;
  return <X className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />;
}

function outcomeLabel(o: ReferenceProject['outcome']) {
  return o === 'success' ? 'Successful' : o === 'partial' ? 'Partial' : 'Failed';
}

function severityColor(s: MarketSignal['severity']) {
  if (s === 'info') return 'text-blue-700 bg-blue-50 border-blue-200';
  if (s === 'warning') return 'text-amber-700 bg-amber-50 border-amber-200';
  return 'text-red-700 bg-red-50 border-red-200';
}

// ── Content Block Renderer ─────────────────────────────────────────────────
function Block({ block }: { block: ContentBlock }) {
  if (block.t === 'p') return <p className="text-[13px] text-gray-700 leading-relaxed mb-3">{block.text}</p>;
  if (block.t === 'bullets') return (
    <ul className="mb-3 space-y-1.5">
      {block.items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-[13px] text-gray-700">
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
          <span className="leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
  if (block.t === 'table') return (
    <div className="mb-4 overflow-x-auto">
      <table className="w-full text-[12px] border-collapse">
        <thead><tr className="bg-gray-100">
          {block.headers.map((h, i) => <th key={i} className="text-left px-3 py-2 font-semibold text-gray-700 border border-gray-200">{h}</th>)}
        </tr></thead>
        <tbody>
          {block.rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              {row.map((cell, j) => <td key={j} className="px-3 py-2 text-gray-700 border border-gray-200 leading-relaxed">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  return null;
}

// ── Risk Section (left pane) ───────────────────────────────────────────────
function DocSection({ section, active, onClick, refCb }: {
  section: RiskSection; active: boolean; onClick: () => void;
  refCb: (el: HTMLDivElement | null) => void;
}) {
  const borderColor = section.sectionType === 'precedent' ? 'border-l-amber-400'
    : section.sectionType === 'agents' ? 'border-l-blue-400'
    : section.sectionType === 'signals' ? 'border-l-orange-400'
    : active ? 'border-l-slate-600' : 'border-l-transparent';

  return (
    <div ref={refCb} id={section.id} onClick={onClick}
      className={clsx('mb-6 pl-4 border-l-2 transition-all duration-200 cursor-pointer hover:border-l-slate-300', active ? borderColor : 'border-l-transparent hover:border-l-slate-200')}>
      <h2 className={clsx('text-[14px] font-bold mb-3 flex items-center gap-2', active ? 'text-slate-800' : 'text-gray-900')}>
        {section.sectionType === 'precedent' && <TrendingUp className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />}
        {section.sectionType === 'agents' && <Users className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />}
        {section.sectionType === 'signals' && <Radio className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />}
        {section.number} {section.title}
      </h2>
      {section.content.map((b, i) => <Block key={i} block={b} />)}
    </div>
  );
}

// ── Dimension Row (right pane scorecard) ───────────────────────────────────
function DimRow({ dim, active }: { dim: RiskDimension; active: boolean }) {
  const rc = riskColor(dim.score);
  const pct = (dim.score / 10) * 100;
  return (
    <div className={clsx('flex items-center gap-2 py-1.5 px-2 rounded transition-colors', active && 'bg-slate-100')}>
      <div className={clsx('w-2 h-2 rounded-full flex-shrink-0', rc.dot)} />
      <span className={clsx('text-[11px] flex-1 truncate', active ? 'font-semibold text-slate-800' : 'text-gray-600')}>{dim.label}</span>
      <div className="w-14 h-1.5 bg-gray-100 rounded-full overflow-hidden flex-shrink-0">
        <div className={clsx('h-full rounded-full', rc.dot)} style={{ width: `${pct}%` }} />
      </div>
      <span className={clsx('text-[11px] font-bold w-6 text-right flex-shrink-0', rc.text)}>{dim.score.toFixed(1)}</span>
    </div>
  );
}

// ── Standard analysis panel ────────────────────────────────────────────────
function StandardAnalysis({ dim }: { dim: RiskDimension }) {
  const rc = riskColor(dim.score);
  const verdict = dim.score >= 8.5 ? 'Low Risk' : dim.score >= 7.0 ? 'Managed' : dim.score >= 5.5 ? 'Elevated' : dim.score >= 4.0 ? 'High Risk' : 'Critical';
  return (
    <div className="mt-4 border-t border-gray-100 pt-4">
      <div className="flex items-center gap-2 mb-3">
        <div className={clsx('text-[10px] font-bold uppercase tracking-widest', rc.text)}>{dim.label}</div>
        <div className={clsx('text-[10px] font-semibold px-1.5 py-0.5 rounded border', rc.bg, rc.text, rc.border)}>
          {verdict} · {dim.score.toFixed(1)}
        </div>
        <div className="text-[10px] text-gray-400 ml-auto">{dim.weight}</div>
      </div>
      {dim.strength && (
        <div className="mb-3">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Strength</div>
          <p className="text-[12px] text-gray-700 leading-relaxed">{dim.strength}</p>
        </div>
      )}
      {dim.gaps.length > 0 && (
        <div className="mb-3">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Gap{dim.gaps.length > 1 ? 's' : ''}</div>
          {dim.gaps.map((g, i) => (
            <div key={i} className="flex items-start gap-1.5 mb-1.5">
              <AlertTriangle className="w-3 h-3 text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-[12px] text-gray-700 leading-relaxed">{g}</p>
            </div>
          ))}
        </div>
      )}
      <div>
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Recommendation</div>
        <div className="flex items-start gap-1.5">
          <ChevronRight className="w-3 h-3 text-slate-600 mt-0.5 flex-shrink-0" />
          <p className="text-[12px] text-slate-700 font-medium leading-relaxed">{dim.recommendation}</p>
        </div>
      </div>
    </div>
  );
}

// ── Precedent heatmap panel ────────────────────────────────────────────────
function PrecedentPanel({ projects }: { projects: ReferenceProject[] }) {
  const [active, setActive] = useState<number | null>(null);
  return (
    <div className="mt-4 border-t border-gray-100 pt-4">
      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Comparable Precedents</div>
      <div className="space-y-2 mb-4">
        {projects.map((p, i) => (
          <div key={i}
            onClick={() => setActive(i === active ? null : i)}
            className={clsx('border rounded-lg p-2.5 cursor-pointer transition-colors', active === i ? 'border-slate-300 bg-slate-50' : 'border-gray-200 hover:border-slate-200 hover:bg-gray-50')}>
            <div className="flex items-start gap-2">
              {outcomeIcon(p.outcome)}
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-semibold text-gray-900 leading-snug">{p.name}</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-gray-500">{p.industry} · {p.year}</span>
                  <span className={clsx('text-[10px] font-semibold', p.outcome === 'success' ? 'text-emerald-600' : p.outcome === 'partial' ? 'text-amber-600' : 'text-red-600')}>
                    {outcomeLabel(p.outcome)}
                  </span>
                  <span className="text-[10px] text-gray-400 ml-auto">{p.relevance} relevance</span>
                </div>
              </div>
            </div>
            {active === i && (
              <div className="mt-2 pt-2 border-t border-gray-100">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Lesson</div>
                <p className="text-[11px] text-gray-700 leading-relaxed">{p.lesson}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      {active === null && <p className="text-[11px] text-gray-400 text-center">Click a project to view its lesson.</p>}
    </div>
  );
}

// ── Agent match panel ──────────────────────────────────────────────────────
function AgentsPanel({ agents }: { agents: AgentMatch[] }) {
  return (
    <div className="mt-4 border-t border-gray-100 pt-4">
      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Capability Matches</div>
      {agents.length === 0 && <p className="text-[12px] text-gray-400 text-center">No confirmed agent matches on file.</p>}
      {agents.map((a, i) => (
        <div key={i} className="border border-gray-200 rounded-lg p-3 mb-3 bg-slate-50">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-slate-700 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">
              {a.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <div className="text-[12px] font-semibold text-gray-900">{a.name}</div>
              <div className="text-[10px] text-gray-500">{a.role}</div>
            </div>
          </div>
          <div className="space-y-1.5">
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Delivery Credits</div>
              {a.credits.map((c, j) => (
                <div key={j} className="flex items-center gap-2 text-[11px]">
                  <CheckCircle className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                  <span className="text-gray-700 truncate">{c.project}</span>
                  <span className="text-emerald-700 font-semibold ml-auto flex-shrink-0">CSAT {c.csat.toFixed(1)}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3 text-[10px] text-gray-500 pt-1">
              <span><span className="font-semibold">Avail:</span> {a.availability}</span>
            </div>
            <div className="text-[10px] text-gray-500">
              <span className="font-semibold">Regions:</span> {a.regions.join(', ')}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Market signals panel ───────────────────────────────────────────────────
function SignalsPanel({ signals }: { signals: MarketSignal[] }) {
  if (signals.length === 0) return (
    <div className="mt-4 border-t border-gray-100 pt-4 text-center">
      <Radio className="w-5 h-5 mx-auto mb-2 text-gray-300" />
      <p className="text-[12px] text-gray-400">No active market signals for this deal.</p>
    </div>
  );
  return (
    <div className="mt-4 border-t border-gray-100 pt-4">
      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Active Market Signals</div>
      {signals.map((s, i) => (
        <div key={i} className={clsx('border rounded-lg p-3 mb-3 text-[12px]', severityColor(s.severity))}>
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-[11px]">{s.feed}</span>
            <span className="text-[10px] opacity-70">{s.date}</span>
          </div>
          <p className="leading-relaxed mb-1.5">{s.alert}</p>
          <div className="text-[10px] opacity-70">Affects: {s.dimension}</div>
        </div>
      ))}
    </div>
  );
}

// ── Executive Brief (right pane top) ──────────────────────────────────────
function ExecBrief({ data }: { data: RiskProfileData }) {
  const rc = riskColor(data.compositeScore);
  const b = data.executiveBrief;
  const rows: [string, string][] = [
    ['Headline Risk', b.headlineRisk],
    ['Precedent Signal', b.precedentSignal],
    ['Delivery Confidence', b.deliveryConfidence],
    ['Market Context', b.marketContext],
    ['Decision Guidance', b.decisionGuidance],
  ];
  return (
    <div className="px-4 pt-4 pb-3 border-b border-gray-100 flex-shrink-0">
      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">AI Risk Intelligence</div>
      <div className={clsx('flex items-center justify-between p-2.5 rounded-lg border mb-3', rc.bg, rc.border)}>
        <span className={clsx('text-[11px] font-bold', rc.text)}>{rc.badge}</span>
        <span className={clsx('text-lg font-bold', rc.text)}>{data.compositeScore.toFixed(1)}<span className="text-[11px] font-normal opacity-70"> / 10</span></span>
      </div>
      <div className="space-y-2">
        {rows.map(([label, text]) => (
          <div key={label}>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{label}</div>
            <p className="text-[11px] text-gray-700 leading-relaxed mt-0.5">{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Modal ─────────────────────────────────────────────────────────────
export default function RiskProfileModal({ dealName, clientName, data, onClose }: Props) {
  const [activeSection, setActiveSection] = useState('executive-brief');
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) setActiveSection(visible[0].target.id);
      },
      { root, threshold: 0.25, rootMargin: '-10% 0px -55% 0px' },
    );
    sectionRefs.current.forEach(el => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [data]);

  const activeDimKey = SECTION_TO_DIM[activeSection];
  const activeDim = activeDimKey ? data.dimensions.find(d => d.key === activeDimKey) : undefined;
  const activeSecObj = data.sections.find(s => s.id === activeSection);

  const rc = riskColor(data.compositeScore);

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative flex flex-col m-3 rounded-lg overflow-hidden shadow-2xl flex-1 min-h-0">

        {/* ── Title Bar ── */}
        <div className="flex items-center px-4 h-10 flex-shrink-0 gap-3" style={{ background: '#1e293b' }}>
          <ShieldAlert className="w-4 h-4 text-white opacity-80 flex-shrink-0" />
          <span className="text-white text-[13px] font-medium flex-1 truncate">{dealName} — Risk Profile Assessment</span>
          <div className={clsx('flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold', rc.bg, rc.text)}>
            {rc.badge} · {data.compositeScore.toFixed(1)} / 10
          </div>
          <button onClick={onClose} className="ml-2 text-white/70 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Sub-header ── */}
        <div className="flex items-center px-4 h-7 gap-6 flex-shrink-0" style={{ background: '#334155', borderBottom: '1px solid #475569' }}>
          <span className="text-[11px] text-slate-300">{clientName}</span>
          <span className="text-[11px] text-slate-500">·</span>
          <span className="text-[11px] text-slate-400">Deal Risk Assessment · Delivery Excellence AI</span>
          <span className="ml-auto text-[10px] text-slate-500">Risk Profile Framework v1.0 · {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>

        {/* ── Content Area ── */}
        <div className="flex flex-1 min-h-0" style={{ background: '#e2e8f0' }}>

          {/* Left — Document Pane */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto py-8 px-6 min-w-0">
            <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-sm">
              <div className="px-12 pt-10 pb-6 border-b border-gray-100">
                <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Risk Profile Assessment · Confidential</div>
                <h1 className="text-xl font-bold text-gray-900 mb-1 leading-snug">{dealName}</h1>
                <div className="flex items-center gap-3">
                  <span className="text-[12px] text-gray-500">{clientName}</span>
                  <span className={clsx('text-[11px] font-bold px-2 py-0.5 rounded border', rc.bg, rc.text, rc.border)}>{rc.badge}</span>
                </div>
              </div>
              <div className="px-12 py-8">
                {data.sections.map(section => (
                  <DocSection key={section.id} section={section} active={activeSection === section.id}
                    onClick={() => setActiveSection(section.id)}
                    refCb={el => { if (el) sectionRefs.current.set(section.id, el); else sectionRefs.current.delete(section.id); }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right — Analysis Pane */}
          <div className="w-80 bg-white border-l border-gray-200 flex flex-col overflow-y-auto flex-shrink-0">

            {/* Executive Brief (always visible at top) */}
            <ExecBrief data={data} />

            {/* Dimension scorecard */}
            <div className="px-4 pt-3 pb-3 border-b border-gray-100 flex-shrink-0">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Risk Dimensions</div>
              <div className="space-y-0.5">
                {data.dimensions.map(dim => (
                  <DimRow key={dim.key} dim={dim} active={activeDimKey === dim.key} />
                ))}
              </div>
            </div>

            {/* Active section analysis or special view */}
            <div className="px-4 flex-1 min-h-0">
              {activeSecObj?.sectionType === 'precedent' && <PrecedentPanel projects={data.referenceProjects} />}
              {activeSecObj?.sectionType === 'agents' && <AgentsPanel agents={data.agentMatches} />}
              {activeSecObj?.sectionType === 'signals' && <SignalsPanel signals={data.marketSignals} />}
              {activeSecObj?.sectionType === 'standard' && activeDim && <StandardAnalysis dim={activeDim} />}
              {(activeSecObj?.sectionType === 'brief' || !activeSecObj) && (
                <div className="mt-4 text-center text-[12px] text-gray-400 leading-relaxed px-2">
                  <FileText className="w-6 h-6 mx-auto mb-2 text-gray-300" />
                  Click any section to view the AI risk analysis for that dimension.
                </div>
              )}
            </div>

            {/* Alignment flags */}
            <div className="px-4 py-4 border-t border-gray-100 flex-shrink-0">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Risk Alignment Signals</div>
              <div className="space-y-2">
                {data.alignmentFlags.map((flag, i) => (
                  <div key={i} className="flex items-start gap-2">
                    {flag.status === 'ok'
                      ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                      : <AlertTriangle className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />}
                    <div>
                      <div className={clsx('text-[11px] font-medium', flag.status === 'ok' ? 'text-emerald-700' : 'text-amber-700')}>{flag.label}</div>
                      {flag.detail && <div className="text-[10px] text-gray-500 leading-snug mt-0.5">{flag.detail}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
