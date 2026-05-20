import { useState, useEffect } from 'react';
import {
  X, ChevronDown, CheckCircle, AlertTriangle, TrendingUp,
  Users, Radio, Presentation, ChevronRight,
} from 'lucide-react';
import clsx from 'clsx';
import {
  RiskProfileData, RiskSection, RiskDimension,
  ReferenceProject, AgentMatch, MarketSignal, riskColor,
} from '../../data/risk-profile-data';
import { ContentBlock } from '../../data/sow-data';

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
  if (o === 'success') return <CheckCircle className="w-3 h-3 text-emerald-500 flex-shrink-0" />;
  if (o === 'partial') return <AlertTriangle className="w-3 h-3 text-amber-500 flex-shrink-0" />;
  return <X className="w-3 h-3 text-red-500 flex-shrink-0" />;
}

function severityDot(s: MarketSignal['severity']) {
  return s === 'critical' ? 'bg-red-500' : s === 'warning' ? 'bg-amber-500' : 'bg-blue-500';
}

// ── Content Block Renderer ─────────────────────────────────────────────────
function Block({ block, compact }: { block: ContentBlock; compact?: boolean }) {
  if (block.t === 'p') return (
    <p className={clsx('text-gray-700 leading-relaxed mb-2', compact ? 'text-[11px]' : 'text-[12px]')}>{block.text}</p>
  );
  if (block.t === 'bullets') return (
    <ul className="mb-2 space-y-1">
      {block.items.map((item, i) => (
        <li key={i} className={clsx('flex items-start gap-1.5 text-gray-700', compact ? 'text-[11px]' : 'text-[12px]')}>
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
          <span className="leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
  if (block.t === 'table') return (
    <div className="mb-3 overflow-x-auto">
      <table className="w-full text-[11px] border-collapse">
        <thead><tr className="bg-gray-100">
          {block.headers.map((h, i) => <th key={i} className="text-left px-2 py-1.5 font-semibold text-gray-700 border border-gray-200">{h}</th>)}
        </tr></thead>
        <tbody>
          {block.rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              {row.map((cell, j) => <td key={j} className="px-2 py-1.5 text-gray-700 border border-gray-200">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  return null;
}

// ── Slide: Executive Brief cards ───────────────────────────────────────────
function BriefCard({ label, text, accent }: { label: string; text: string; accent?: boolean }) {
  return (
    <div className={clsx('rounded-lg border p-3 flex flex-col gap-1', accent ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200')}>
      <div className={clsx('text-[9px] font-bold uppercase tracking-widest', accent ? 'text-slate-400' : 'text-gray-400')}>{label}</div>
      <p className={clsx('text-[11px] leading-relaxed line-clamp-4', accent ? 'text-white' : 'text-gray-700')}>{text}</p>
    </div>
  );
}

// ── Slide: Dimension row ───────────────────────────────────────────────────
function SlideDimRow({ dim }: { dim: RiskDimension }) {
  const rc = riskColor(dim.score);
  const pct = (dim.score / 10) * 100;
  return (
    <div className="flex items-center gap-2 py-0.5">
      <div className={clsx('w-2 h-2 rounded-full flex-shrink-0', rc.dot)} />
      <span className="text-[10px] text-gray-600 w-36 flex-shrink-0 truncate">{dim.label}</span>
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={clsx('h-full rounded-full', rc.dot)} style={{ width: `${pct}%` }} />
      </div>
      <span className={clsx('text-[10px] font-bold w-6 text-right flex-shrink-0', rc.text)}>{dim.score.toFixed(1)}</span>
    </div>
  );
}

// ── Slide: Reference row ───────────────────────────────────────────────────
function SlideRefRow({ project: r }: { project: ReferenceProject }) {
  const label = r.outcome === 'success' ? 'Success' : r.outcome === 'partial' ? 'Partial' : 'Failed';
  const col = r.outcome === 'success' ? 'text-emerald-600' : r.outcome === 'partial' ? 'text-amber-600' : 'text-red-600';
  return (
    <div className="flex items-center gap-2 py-0.5">
      {outcomeIcon(r.outcome)}
      <span className="text-[10px] text-gray-700 flex-1 truncate">{r.name}</span>
      <span className={clsx('text-[10px] font-semibold flex-shrink-0', col)}>{label}</span>
    </div>
  );
}

// ── Slide: Agent row ───────────────────────────────────────────────────────
function SlideAgentRow({ agent }: { agent: AgentMatch }) {
  const initials = agent.name.split(' ').map(n => n[0]).join('').slice(0, 2);
  const topCsat = agent.credits[0]?.csat;
  return (
    <div className="flex items-center gap-2 py-0.5">
      <div className="w-5 h-5 rounded-full bg-slate-700 text-white flex items-center justify-center text-[9px] font-bold flex-shrink-0">{initials}</div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-semibold text-gray-800 truncate">{agent.name}</div>
        <div className="text-[9px] text-gray-400 truncate">{agent.role}</div>
      </div>
      {topCsat && <span className="text-[10px] font-bold text-emerald-600 flex-shrink-0">{topCsat.toFixed(1)}</span>}
    </div>
  );
}

// ── Right Panel: Collapsible section ───────────────────────────────────────
function AccordionSection({ section, data }: { section: RiskSection; data: RiskProfileData }) {
  const [open, setOpen] = useState(false);
  const dimKey = SECTION_TO_DIM[section.id];
  const dim = dimKey ? data.dimensions.find(d => d.key === dimKey) : undefined;
  const rc = dim ? riskColor(dim.score) : null;

  const sectionIcon = section.sectionType === 'precedent'
    ? <TrendingUp className="w-3 h-3 text-amber-500 flex-shrink-0" />
    : section.sectionType === 'agents'
    ? <Users className="w-3 h-3 text-blue-500 flex-shrink-0" />
    : section.sectionType === 'signals'
    ? <Radio className="w-3 h-3 text-orange-500 flex-shrink-0" />
    : dim && rc ? <div className={clsx('w-2 h-2 rounded-full flex-shrink-0', rc.dot)} /> : null;

  return (
    <div className="border-b border-gray-100">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-gray-50 transition-colors"
      >
        {sectionIcon}
        <span className="text-[11px] font-medium text-gray-700 flex-1">{section.number} {section.title}</span>
        {dim && rc && <span className={clsx('text-[10px] font-bold flex-shrink-0', rc.text)}>{dim.score.toFixed(1)}</span>}
        <ChevronDown className={clsx('w-3.5 h-3.5 text-gray-400 flex-shrink-0 transition-transform duration-150', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="px-3 pb-3 border-t border-gray-50">
          {/* Section content */}
          <div className="mt-2">
            {section.content.map((b, i) => <Block key={i} block={b} compact />)}
          </div>

          {/* Dimension analysis (standard sections) */}
          {dim && rc && (
            <div className="mt-2 pt-2 border-t border-gray-100">
              <div className={clsx('inline-flex items-center gap-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded border mb-2', rc.bg, rc.text, rc.border)}>
                {dim.score >= 8.5 ? 'Low Risk' : dim.score >= 7.0 ? 'Managed' : dim.score >= 5.5 ? 'Elevated' : dim.score >= 4.0 ? 'High Risk' : 'Critical'} · {dim.score.toFixed(1)}
              </div>
              {dim.strength && (
                <div className="mb-2">
                  <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">Strength</div>
                  <p className="text-[11px] text-gray-700 leading-relaxed">{dim.strength}</p>
                </div>
              )}
              {dim.gaps.length > 0 && (
                <div className="mb-2">
                  <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">Gaps</div>
                  {dim.gaps.map((g, i) => (
                    <div key={i} className="flex items-start gap-1 mb-1">
                      <AlertTriangle className="w-2.5 h-2.5 text-amber-500 mt-0.5 flex-shrink-0" />
                      <p className="text-[11px] text-gray-700 leading-relaxed">{g}</p>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex items-start gap-1">
                <ChevronRight className="w-2.5 h-2.5 text-slate-600 mt-0.5 flex-shrink-0" />
                <p className="text-[11px] text-slate-700 font-medium leading-relaxed">{dim.recommendation}</p>
              </div>
            </div>
          )}

          {/* Precedent special view */}
          {section.sectionType === 'precedent' && (
            <div className="mt-2 space-y-2">
              {data.referenceProjects.map((rp, i) => (
                <div key={i} className="border border-gray-200 rounded p-2">
                  <div className="flex items-center gap-1.5 mb-1">
                    {outcomeIcon(rp.outcome)}
                    <span className="text-[11px] font-semibold text-gray-900 leading-snug">{rp.name}</span>
                  </div>
                  <div className="text-[10px] text-gray-400 mb-1">{rp.industry} · {rp.year} · {rp.relevance} relevance</div>
                  <p className="text-[11px] text-gray-600 leading-relaxed">{rp.lesson}</p>
                </div>
              ))}
            </div>
          )}

          {/* Agents special view */}
          {section.sectionType === 'agents' && (
            <div className="mt-2 space-y-2">
              {data.agentMatches.map((a, i) => (
                <div key={i} className="border border-gray-200 rounded p-2">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-6 h-6 rounded-full bg-slate-700 text-white flex items-center justify-center text-[9px] font-bold">
                      {a.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold text-gray-900">{a.name}</div>
                      <div className="text-[9px] text-gray-400">{a.role}</div>
                    </div>
                  </div>
                  {a.credits.map((c, j) => (
                    <div key={j} className="flex items-center gap-1.5 text-[10px]">
                      <CheckCircle className="w-2.5 h-2.5 text-emerald-500 flex-shrink-0" />
                      <span className="text-gray-600 flex-1 truncate">{c.project}</span>
                      <span className="text-emerald-600 font-semibold">CSAT {c.csat.toFixed(1)}</span>
                    </div>
                  ))}
                  <div className="text-[9px] text-gray-400 mt-1">{a.availability} · {a.regions.join(', ')}</div>
                </div>
              ))}
            </div>
          )}

          {/* Signals special view */}
          {section.sectionType === 'signals' && (
            <div className="mt-2 space-y-2">
              {data.marketSignals.length === 0 && <p className="text-[11px] text-gray-400">No active market signals.</p>}
              {data.marketSignals.map((s, i) => (
                <div key={i} className="border border-gray-200 rounded p-2">
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className={clsx('w-2 h-2 rounded-full flex-shrink-0', severityDot(s.severity))} />
                    <span className="text-[10px] font-bold text-gray-700">{s.feed}</span>
                    <span className="text-[9px] text-gray-400 ml-auto">{s.date}</span>
                  </div>
                  <p className="text-[11px] text-gray-600 leading-relaxed">{s.alert}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main Slide ─────────────────────────────────────────────────────────────
function RiskSlide({ dealName, clientName, data }: { dealName: string; clientName: string; data: RiskProfileData }) {
  const rc = riskColor(data.compositeScore);
  const b = data.executiveBrief;

  return (
    <div className="bg-white rounded shadow-xl flex flex-col overflow-hidden w-full h-full">
      {/* Risk tier accent bar */}
      <div className={clsx('h-1.5 w-full flex-shrink-0', rc.dot)} />

      {/* Slide content */}
      <div className="flex-1 overflow-y-auto px-8 py-6">

        {/* ── Slide Header ── */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Risk Profile Assessment · Confidential</div>
            <h1 className="text-[19px] font-bold text-gray-900 leading-tight">{dealName}</h1>
            <div className="text-[12px] text-gray-500 mt-0.5">{clientName}</div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className={clsx('px-3 py-1.5 rounded-lg border text-[12px] font-bold', rc.bg, rc.text, rc.border)}>
              {rc.badge}
            </div>
            <div className="text-right">
              <div className={clsx('text-[28px] font-bold leading-none', rc.text)}>{data.compositeScore.toFixed(1)}</div>
              <div className="text-[10px] text-gray-400">/ 10</div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 mb-5" />

        {/* ── Executive Brief: 5 signal cards ── */}
        <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">Executive Risk Brief</div>
        <div className="grid grid-cols-3 gap-2 mb-2">
          <BriefCard label="Headline Risk" text={b.headlineRisk} accent />
          <BriefCard label="Precedent Signal" text={b.precedentSignal} />
          <BriefCard label="Delivery Confidence" text={b.deliveryConfidence} />
        </div>
        <div className="grid grid-cols-2 gap-2 mb-6">
          <BriefCard label="Market Context" text={b.marketContext} />
          <BriefCard label="Decision Guidance" text={b.decisionGuidance} />
        </div>

        <div className="border-t border-gray-100 mb-5" />

        {/* ── Lower section: dimensions | references / agents / signals ── */}
        <div className="grid grid-cols-[1fr_180px] gap-6">

          {/* Dimension scorecard */}
          <div>
            <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">Risk Dimensions</div>
            <div className="space-y-1.5">
              {data.dimensions.map(dim => <SlideDimRow key={dim.key} dim={dim} />)}
            </div>
          </div>

          {/* Right column: refs / agents / signals */}
          <div className="space-y-4">
            {/* Reference projects */}
            <div>
              <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Comparable Precedents</div>
              <div className="space-y-1">
                {data.referenceProjects.map((r, i) => <SlideRefRow key={i} project={r} />)}
              </div>
            </div>

            {/* Agents */}
            {data.agentMatches.length > 0 && (
              <div>
                <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Delivery Match</div>
                <div className="space-y-1.5">
                  {data.agentMatches.map((a, i) => <SlideAgentRow key={i} agent={a} />)}
                </div>
              </div>
            )}

            {/* Market signals */}
            {data.marketSignals.length > 0 && (
              <div>
                <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Market Signals</div>
                <div className="space-y-1">
                  {data.marketSignals.map((s, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <div className={clsx('w-2 h-2 rounded-full mt-0.5 flex-shrink-0', severityDot(s.severity))} />
                      <p className="text-[10px] text-gray-600 leading-relaxed line-clamp-2">{s.alert}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Alignment flags */}
            <div>
              <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Alignment Signals</div>
              <div className="space-y-1">
                {data.alignmentFlags.map((f, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    {f.status === 'ok'
                      ? <CheckCircle className="w-2.5 h-2.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                      : <AlertTriangle className="w-2.5 h-2.5 text-amber-500 mt-0.5 flex-shrink-0" />}
                    <span className={clsx('text-[10px] leading-snug', f.status === 'ok' ? 'text-emerald-700' : 'text-amber-700')}>{f.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide footer */}
      <div className="flex-shrink-0 border-t border-gray-100 px-8 py-2 flex items-center justify-between">
        <span className="text-[9px] text-gray-400">Delivery Excellence · Risk Profile Framework v1.0 · AI-Generated · {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        <span className="text-[9px] text-gray-300">Slide 1 of 1</span>
      </div>
    </div>
  );
}

// ── Main Modal ─────────────────────────────────────────────────────────────
export default function RiskProfileModal({ dealName, clientName, data, onClose }: Props) {
  const rc = riskColor(data.compositeScore);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative flex flex-col m-3 rounded-lg overflow-hidden shadow-2xl flex-1 min-h-0">

        {/* ── PowerPoint Title Bar ── */}
        <div className="flex items-center px-4 h-10 flex-shrink-0 gap-3" style={{ background: '#1e293b' }}>
          <Presentation className="w-4 h-4 text-white opacity-80 flex-shrink-0" />
          <span className="text-white text-[13px] font-medium flex-1 truncate">{dealName} — Risk Profile</span>
          <div className={clsx('flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold', rc.bg, rc.text)}>
            {rc.badge} · {data.compositeScore.toFixed(1)} / 10
          </div>
          <button onClick={onClose} className="ml-2 text-white/70 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── PowerPoint Ribbon ── */}
        <div className="flex items-center px-4 h-7 gap-5 flex-shrink-0" style={{ background: '#f3f2f1', borderBottom: '1px solid #d0d0d0' }}>
          {['File', 'Home', 'Insert', 'Design', 'Transitions', 'Slide Show', 'Review'].map(tab => (
            <span key={tab} className="text-[11px] text-gray-600 cursor-default select-none hover:bg-gray-200 px-1.5 py-0.5 rounded">{tab}</span>
          ))}
          <span className="ml-auto text-[10px] text-gray-400 select-none">Delivery Excellence · AI Risk Intelligence</span>
        </div>

        {/* ── Slides Area + Right Panel ── */}
        <div className="flex flex-1 min-h-0">

          {/* Slide canvas (center — takes remaining width) */}
          <div className="flex-1 overflow-hidden flex items-stretch p-6" style={{ background: '#c8c8c8' }}>
            <RiskSlide dealName={dealName} clientName={clientName} data={data} />
          </div>

          {/* Right panel — collapsible sections ── */}
          <div className="w-72 bg-white border-l border-gray-200 flex flex-col overflow-hidden flex-shrink-0">
            <div className="px-3 py-2 border-b border-gray-200 flex-shrink-0">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Detailed Assessment</div>
              <div className="text-[9px] text-gray-400 mt-0.5">Click any section to expand</div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {data.sections.map(section => (
                <AccordionSection key={section.id} section={section} data={data} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
