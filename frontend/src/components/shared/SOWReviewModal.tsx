import { useEffect, useRef, useState } from 'react';
import { X, CheckCircle, AlertTriangle, FileText, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { SOWData, SOWSection, SOWDimension, ContentBlock, verdictFromScore } from '../../data/sow-data';

// ── Types ──────────────────────────────────────────────────────────────────
interface Props {
  dealName: string;
  clientName: string;
  sowData: SOWData;
  onClose: () => void;
}

// ── Helpers ────────────────────────────────────────────────────────────────
const SECTION_TO_DIM: Record<string, string> = {
  outcomes: 'outcome_clarity',
  scope: 'scope_completeness',
  'out-of-scope': 'out_of_scope',
  assumptions: 'assumption_quality',
  timeline: 'timeline_enforceability',
  commercial: 'commercial_integrity',
  governance: 'governance_readiness',
  risk: 'risk_visibility',
};

function verdictColor(score: number) {
  if (score >= 8.5) return { dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' };
  if (score >= 7.5) return { dot: 'bg-blue-500', text: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' };
  if (score >= 6.0) return { dot: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' };
  return { dot: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' };
}

// ── Content Block Renderer ─────────────────────────────────────────────────
function Block({ block }: { block: ContentBlock }) {
  if (block.t === 'p') {
    return <p className="text-[13px] text-gray-700 leading-relaxed mb-3">{block.text}</p>;
  }
  if (block.t === 'bullets') {
    return (
      <ul className="mb-3 space-y-1.5">
        {block.items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-[13px] text-gray-700">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
            <span className="leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    );
  }
  if (block.t === 'table') {
    return (
      <div className="mb-4 overflow-x-auto">
        <table className="w-full text-[12px] border-collapse">
          <thead>
            <tr className="bg-gray-100">
              {block.headers.map((h, i) => (
                <th key={i} className="text-left px-3 py-2 font-semibold text-gray-700 border border-gray-200 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {row.map((cell, j) => (
                  <td key={j} className="px-3 py-2 text-gray-700 border border-gray-200 leading-relaxed">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  return null;
}

// ── SOW Section ────────────────────────────────────────────────────────────
function DocSection({
  section, active, onClick, refCallback,
}: {
  section: SOWSection; active: boolean; onClick: () => void;
  refCallback: (el: HTMLDivElement | null) => void;
}) {
  return (
    <div
      ref={refCallback}
      id={section.id}
      onClick={onClick}
      className={clsx(
        'mb-6 pl-4 border-l-2 transition-all duration-200 cursor-pointer',
        active ? 'border-l-[#2b579a]' : 'border-l-transparent hover:border-l-gray-200',
      )}
    >
      <h2 className={clsx(
        'text-[14px] font-bold mb-3 transition-colors',
        active ? 'text-[#2b579a]' : 'text-gray-900',
      )}>
        {section.number} {section.title}
        {section.dimensionKey && (
          <span className="ml-2 text-[10px] font-normal text-gray-400 normal-case tracking-normal">
            AI-scored
          </span>
        )}
      </h2>
      {section.content.map((block, i) => <Block key={i} block={block} />)}
    </div>
  );
}

// ── Dimension Row ──────────────────────────────────────────────────────────
function DimRow({ dim, active }: { dim: SOWDimension; active: boolean }) {
  const vc = verdictColor(dim.score);
  const pct = (dim.score / 10) * 100;
  return (
    <div className={clsx('flex items-center gap-2 py-1.5 px-2 rounded transition-colors', active && 'bg-blue-50')}>
      <div className={clsx('w-2 h-2 rounded-full flex-shrink-0', vc.dot)} />
      <span className={clsx('text-[11px] flex-1 truncate', active ? 'font-semibold text-[#2b579a]' : 'text-gray-600')}>{dim.label}</span>
      <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden flex-shrink-0">
        <div className={clsx('h-full rounded-full', vc.dot)} style={{ width: `${pct}%` }} />
      </div>
      <span className={clsx('text-[11px] font-bold w-6 text-right flex-shrink-0', vc.text)}>{dim.score.toFixed(1)}</span>
    </div>
  );
}

// ── Analysis Panel ─────────────────────────────────────────────────────────
function AnalysisPanel({ dim }: { dim: SOWDimension }) {
  const vc = verdictColor(dim.score);
  const verdict = verdictFromScore(dim.score);
  return (
    <div className="mt-4 border-t border-gray-100 pt-4">
      <div className="flex items-center gap-2 mb-3">
        <div className={clsx('text-[10px] font-bold uppercase tracking-widest', vc.text)}>{dim.label}</div>
        <div className={clsx('text-[10px] font-semibold px-1.5 py-0.5 rounded', vc.bg, vc.text, 'border', vc.border)}>
          {verdict} · {dim.score.toFixed(1)}
        </div>
      </div>

      {dim.strength && (
        <div className="mb-3">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Strength</div>
          <p className="text-[12px] text-gray-700 leading-relaxed">{dim.strength}</p>
        </div>
      )}

      {dim.gaps.length > 0 && (
        <div className="mb-3">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">
            Gap{dim.gaps.length > 1 ? 's' : ''}
          </div>
          {dim.gaps.map((gap, i) => (
            <div key={i} className="flex items-start gap-1.5 mb-1.5">
              <AlertTriangle className="w-3 h-3 text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-[12px] text-gray-700 leading-relaxed">{gap}</p>
            </div>
          ))}
        </div>
      )}

      <div>
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Recommendation</div>
        <div className="flex items-start gap-1.5">
          <ChevronRight className="w-3 h-3 text-[#2b579a] mt-0.5 flex-shrink-0" />
          <p className="text-[12px] text-[#2b579a] leading-relaxed font-medium">{dim.recommendation}</p>
        </div>
      </div>
    </div>
  );
}

// ── Main Modal ─────────────────────────────────────────────────────────────
export default function SOWReviewModal({ dealName, clientName, sowData, onClose }: Props) {
  const [activeSection, setActiveSection] = useState('executive-summary');
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // IntersectionObserver for scroll-based section activation
  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) {
          // Take the topmost visible section
          setActiveSection(visible[0].target.id);
        }
      },
      { root, threshold: 0.25, rootMargin: '-10% 0px -55% 0px' },
    );
    sectionRefs.current.forEach(el => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [sowData]);

  const activeDimKey = SECTION_TO_DIM[activeSection];
  const activeDim = activeDimKey ? sowData.dimensions.find(d => d.key === activeDimKey) : undefined;

  const compositeVc = verdictColor(sowData.compositeScore);

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* Modal shell */}
      <div className="relative flex flex-col m-3 rounded-lg overflow-hidden shadow-2xl flex-1 min-h-0">

        {/* ── Word Title Bar ── */}
        <div className="flex items-center px-4 h-10 flex-shrink-0 gap-3" style={{ background: '#2b579a' }}>
          <FileText className="w-4 h-4 text-white opacity-80 flex-shrink-0" />
          <span className="text-white text-[13px] font-medium flex-1 truncate">{dealName} — Statement of Work</span>
          <div className={clsx('flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold', compositeVc.bg, compositeVc.text)}>
            SOW Quality: {sowData.compositeScore.toFixed(1)} / 10
          </div>
          <button onClick={onClose} className="ml-2 text-white/70 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Ribbon ── */}
        <div className="flex items-center px-4 h-7 gap-6 flex-shrink-0" style={{ background: '#f3f2f1', borderBottom: '1px solid #d0d0d0' }}>
          {['File', 'Edit', 'View', 'Insert', 'Review', 'Help'].map(item => (
            <span key={item} className="text-[11px] text-gray-600 cursor-default select-none hover:bg-gray-200 px-1.5 py-0.5 rounded transition-colors">{item}</span>
          ))}
          <span className="ml-auto text-[10px] text-gray-400 select-none">Delivery Excellence · AI-Assisted Document Review</span>
        </div>

        {/* ── Content Area ── */}
        <div className="flex flex-1 min-h-0" style={{ background: '#e8e8e8' }}>

          {/* Left — Document Pane */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto py-8 px-6 min-w-0">
            <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-sm">
              {/* Document header */}
              <div className="px-12 pt-10 pb-6 border-b border-gray-100">
                <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Statement of Work · Confidential</div>
                <h1 className="text-xl font-bold text-gray-900 mb-1 leading-snug">{dealName}</h1>
                <div className="text-[12px] text-gray-500">{clientName} · Version 1.0 · {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
              </div>

              {/* Document body */}
              <div className="px-12 py-8">
                {sowData.sections.map(section => (
                  <DocSection
                    key={section.id}
                    section={section}
                    active={activeSection === section.id}
                    onClick={() => setActiveSection(section.id)}
                    refCallback={el => {
                      if (el) sectionRefs.current.set(section.id, el);
                      else sectionRefs.current.delete(section.id);
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right — AI Analysis Pane */}
          <div className="w-80 bg-white border-l border-gray-200 flex flex-col flex-shrink-0">

            {/* Score summary */}
            <div className="px-4 pt-4 pb-3 border-b border-gray-100 flex-shrink-0">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">AI SOW Quality Analysis</div>

              {/* Composite */}
              <div className={clsx('flex items-center justify-between p-2.5 rounded-lg border mb-3', compositeVc.bg, compositeVc.border)}>
                <span className={clsx('text-[12px] font-bold', compositeVc.text)}>Composite Score</span>
                <span className={clsx('text-lg font-bold', compositeVc.text)}>{sowData.compositeScore.toFixed(1)}<span className="text-[11px] font-normal opacity-70"> / 10</span></span>
              </div>

              {/* Dimension rows */}
              <div className="space-y-0.5">
                {sowData.dimensions.map(dim => (
                  <DimRow key={dim.key} dim={dim} active={activeDimKey === dim.key} />
                ))}
              </div>
            </div>

            {/* Active section analysis */}
            <div className="px-4 flex-1 overflow-y-auto min-h-0">
              {activeDim ? (
                <AnalysisPanel dim={activeDim} />
              ) : (
                <div className="mt-4 text-center text-[12px] text-gray-400 leading-relaxed px-2">
                  <FileText className="w-6 h-6 mx-auto mb-2 text-gray-300" />
                  Click any section in the document to view its AI quality analysis.
                </div>
              )}
            </div>

            {/* Alignment flags */}
            <div className="px-4 py-4 border-t border-gray-100 flex-shrink-0">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Strategic Alignment</div>
              <div className="space-y-2">
                {sowData.alignmentFlags.map((flag, i) => (
                  <div key={i} className="flex items-start gap-2">
                    {flag.status === 'ok' ? (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                    )}
                    <div>
                      <div className={clsx('text-[11px] font-medium', flag.status === 'ok' ? 'text-emerald-700' : 'text-amber-700')}>
                        {flag.label}
                      </div>
                      {flag.detail && (
                        <div className="text-[10px] text-gray-500 leading-snug mt-0.5">{flag.detail}</div>
                      )}
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
