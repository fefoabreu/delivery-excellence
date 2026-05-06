import { useEffect, useState, useCallback } from 'react';
import {
  ChevronRight, ChevronDown, LayoutList, Columns3,
  Filter, RefreshCw, CheckCircle2, Circle, ArrowUp,
  ArrowRight as ArrowRightIcon, ArrowDown, Minus,
} from 'lucide-react';
import clsx from 'clsx';
import { backlogApi } from '../api/client';

// ── Types ──────────────────────────────────────────────────────────────────
interface WorkItem {
  id: string;
  work_item_id: string;
  item_type: 'epic' | 'feature' | 'user_story';
  parent_id: string | null;
  epic_area: string;
  title: string;
  description?: string;
  acceptance_criteria: string[];
  assigned_to?: string;
  status: string;
  priority: string;
  story_points?: number;
  iteration?: string;
  tags: string[];
  business_value?: number;
  total_sp?: number;
  done_sp?: number;
  features?: FeatureItem[];
  stories?: WorkItem[];
  child_count: number;
}
interface FeatureItem extends WorkItem { stories: WorkItem[]; }

// ── Config ─────────────────────────────────────────────────────────────────
const EPIC_LABELS: Record<string, string> = {
  governance: 'Delivery Governance & Operating Rhythm',
  standards: 'Delivery Standards',
  portfolio_insights: 'Portfolio Insights',
  risk_management: 'Risk, Issues & Change Management',
  financial_excellence: 'Financial & Operational Excellence',
  readiness_excellence: 'Readiness & Execution Excellence',
  business_assets: 'Business Excellence Assets',
  agentic_ai: 'Agentic AI & AI Infusion',
  delivery_methodology: 'Consulting Delivery Methodologies',
};

const STATUS_CFG: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  new:         { label: 'New',         bg: 'bg-gray-100',    text: 'text-gray-600',   dot: 'bg-gray-400' },
  active:      { label: 'Active',      bg: 'bg-blue-50',     text: 'text-blue-700',   dot: 'bg-blue-500' },
  in_progress: { label: 'In Progress', bg: 'bg-indigo-50',   text: 'text-indigo-700', dot: 'bg-indigo-500' },
  resolved:    { label: 'Resolved',    bg: 'bg-green-50',    text: 'text-green-700',  dot: 'bg-green-500' },
  closed:      { label: 'Closed',      bg: 'bg-gray-200',    text: 'text-gray-700',   dot: 'bg-gray-500' },
};

const PRIORITY_CFG: Record<string, { icon: typeof ArrowUp; color: string; label: string }> = {
  critical: { icon: ArrowUp,        color: 'text-red-600',    label: 'Critical' },
  high:     { icon: ArrowUp,        color: 'text-orange-500', label: 'High' },
  medium:   { icon: Minus,          color: 'text-blue-500',   label: 'Medium' },
  low:      { icon: ArrowDown,      color: 'text-gray-400',   label: 'Low' },
};

const PERSONA_CFG: Record<string, { initials: string; bg: string; text: string; full: string }> = {
  Edwina: { initials: 'EW', bg: 'bg-indigo-600', text: 'text-white', full: 'Edwina — VP Professional Services' },
  Karina: { initials: 'KA', bg: 'bg-teal-600',   text: 'text-white', full: 'Karina — Americas Leader' },
  Maikel: { initials: 'MK', bg: 'bg-purple-700', text: 'text-white', full: 'Maikel — VP Delivery Excellence' },
};

const EPIC_COLORS = [
  'border-l-indigo-500', 'border-l-blue-500', 'border-l-cyan-500',
  'border-l-red-500', 'border-l-amber-500', 'border-l-green-500',
  'border-l-purple-500', 'border-l-pink-500', 'border-l-teal-500',
];

// ── Sub-components ─────────────────────────────────────────────────────────
function StatusChip({ status }: { status: string }) {
  const cfg = STATUS_CFG[status] || STATUS_CFG.new;
  return (
    <span className={clsx('inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium', cfg.bg, cfg.text)}>
      <span className={clsx('w-1.5 h-1.5 rounded-full', cfg.dot)} />
      {cfg.label}
    </span>
  );
}

function PriorityIcon({ priority }: { priority: string }) {
  const cfg = PRIORITY_CFG[priority] || PRIORITY_CFG.medium;
  const Icon = cfg.icon;
  return <Icon className={clsx('w-3.5 h-3.5 flex-shrink-0', cfg.color)} aria-label={cfg.label} />;
}

function PersonaAvatar({ name, size = 'sm' }: { name?: string; size?: 'sm' | 'xs' }) {
  if (!name) return <div className={clsx('rounded-full bg-gray-200', size === 'sm' ? 'w-6 h-6' : 'w-5 h-5')} />;
  const cfg = PERSONA_CFG[name] || { initials: name.slice(0, 2).toUpperCase(), bg: 'bg-gray-500', text: 'text-white' };
  return (
    <div className={clsx('rounded-full flex items-center justify-center flex-shrink-0 font-semibold', cfg.bg, cfg.text, size === 'sm' ? 'w-6 h-6 text-[10px]' : 'w-5 h-5 text-[9px]')} title={name}>
      {cfg.initials}
    </div>
  );
}

function SpBadge({ sp, done, total }: { sp?: number; done?: number; total?: number }) {
  if (total !== undefined && done !== undefined) {
    const pct = total ? Math.round(done / total * 100) : 0;
    return (
      <div className="flex items-center gap-1.5">
        <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-ms-blue rounded-full" style={{ width: `${pct}%` }} />
        </div>
        <span className="text-xs text-gray-400">{done}/{total} SP</span>
      </div>
    );
  }
  if (!sp) return null;
  return <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded min-w-[28px] text-center">{sp}</span>;
}

function ItemTypeTag({ type }: { type: string }) {
  const cfg = {
    epic:       { label: 'Epic',    bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-500' },
    feature:    { label: 'Feature', bg: 'bg-blue-100',   text: 'text-blue-700',   dot: 'bg-blue-500' },
    user_story: { label: 'Story',   bg: 'bg-sky-100',    text: 'text-sky-700',    dot: 'bg-sky-500' },
  }[type] || { label: type, bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' };
  return (
    <span className={clsx('inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide', cfg.bg, cfg.text)}>
      <span className={clsx('w-1.5 h-1.5 rounded-full', cfg.dot)} />
      {cfg.label}
    </span>
  );
}

// ── Work Item Detail Drawer ────────────────────────────────────────────────
function ItemDrawer({ item, onClose, onUpdate }: { item: WorkItem; onClose: () => void; onUpdate: (id: string, data: object) => void }) {
  const [status, setStatus] = useState(item.status);
  const [saving, setSaving] = useState(false);

  const save = async (field: string, val: string) => {
    setSaving(true);
    await backlogApi.updateItem(item.id, { [field]: val });
    onUpdate(item.id, { [field]: val });
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <div className="w-[520px] bg-white shadow-2xl flex flex-col overflow-y-auto">
        <div className="p-5 border-b border-gray-200 flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <ItemTypeTag type={item.item_type} />
              <span className="text-xs text-gray-400 font-mono">{item.work_item_id}</span>
            </div>
            <h2 className="text-base font-semibold text-gray-900 leading-snug">{item.title}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl font-bold flex-shrink-0">×</button>
        </div>

        <div className="p-5 space-y-5">
          {/* Status & Priority Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-gray-500 font-medium mb-1">State</div>
              <select
                className="input text-sm"
                value={status}
                onChange={e => { setStatus(e.target.value); save('status', e.target.value); }}
                disabled={saving}
              >
                {Object.entries(STATUS_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium mb-1">Priority</div>
              <div className="flex items-center gap-2 mt-1">
                <PriorityIcon priority={item.priority} />
                <span className="text-sm capitalize">{item.priority}</span>
              </div>
            </div>
          </div>

          {/* Assigned / Iteration / SP */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-gray-500 font-medium mb-1">Assigned To</div>
              {item.assigned_to ? (
                <div className="flex items-center gap-2">
                  <PersonaAvatar name={item.assigned_to} />
                  <span className="text-sm">{item.assigned_to}</span>
                </div>
              ) : <span className="text-sm text-gray-400">Unassigned</span>}
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium mb-1">Iteration</div>
              <span className="text-sm">{item.iteration || '—'}</span>
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium mb-1">Story Points</div>
              <span className="text-sm font-semibold">{item.story_points ?? '—'}</span>
            </div>
          </div>

          {/* Area */}
          <div>
            <div className="text-xs text-gray-500 font-medium mb-1">Area / Epic</div>
            <span className="text-sm text-gray-700">{EPIC_LABELS[item.epic_area] || item.epic_area}</span>
          </div>

          {/* Tags */}
          {item.tags?.length > 0 && (
            <div>
              <div className="text-xs text-gray-500 font-medium mb-1.5">Tags</div>
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map(t => <span key={t} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{t}</span>)}
              </div>
            </div>
          )}

          {/* Acceptance Criteria */}
          {item.acceptance_criteria?.length > 0 && (
            <div>
              <div className="text-xs text-gray-500 font-medium mb-2">Acceptance Criteria</div>
              <ul className="space-y-2">
                {item.acceptance_criteria.map((ac, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    {ac}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Board View ─────────────────────────────────────────────────────────────
function BoardView({ epics, onSelect }: { epics: WorkItem[]; onSelect: (item: WorkItem) => void }) {
  const cols = ['new', 'active', 'in_progress', 'resolved', 'closed'];
  const allStories = epics.flatMap(e => (e.features || []).flatMap(f => f.stories || []));

  return (
    <div className="flex gap-3 overflow-x-auto pb-4">
      {cols.map(col => {
        const cfg = STATUS_CFG[col];
        const cards = allStories.filter(s => s.status === col);
        return (
          <div key={col} className="flex-shrink-0 w-64">
            <div className={clsx('flex items-center justify-between px-3 py-2 rounded-t-lg border-t-2 bg-gray-50 border border-b-0',
              col === 'new' ? 'border-t-gray-400' : col === 'active' ? 'border-t-blue-500' : col === 'in_progress' ? 'border-t-indigo-500' : col === 'resolved' ? 'border-t-green-500' : 'border-t-gray-600'
            )}>
              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">{cfg.label}</span>
              <span className="text-xs text-gray-400 font-medium">{cards.length}</span>
            </div>
            <div className="border border-t-0 border-gray-200 rounded-b-lg bg-gray-50 min-h-[200px] p-2 space-y-2">
              {cards.map(card => (
                <button key={card.id} onClick={() => onSelect(card)}
                  className="w-full text-left bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md hover:border-ms-blue transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-gray-400">{card.work_item_id}</span>
                    <PriorityIcon priority={card.priority} />
                  </div>
                  <p className="text-xs text-gray-800 font-medium leading-snug line-clamp-3">{card.title.replace(/^As \w+, I want /, '')}</p>
                  <div className="flex items-center justify-between mt-2">
                    <PersonaAvatar name={card.assigned_to} size="xs" />
                    <SpBadge sp={card.story_points} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function Backlog() {
  const [epics, setEpics] = useState<WorkItem[]>([]);
  const [metrics, setMetrics] = useState<Record<string, unknown>>({});
  const [tab, setTab] = useState<'backlog' | 'board'>('backlog');
  const [epicFilter, setEpicFilter] = useState('');
  const [personaFilter, setPersonaFilter] = useState('');
  const [expandedEpics, setExpandedEpics] = useState<Set<string>>(new Set());
  const [expandedFeatures, setExpandedFeatures] = useState<Set<string>>(new Set());
  const [selectedItem, setSelectedItem] = useState<WorkItem | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([
      backlogApi.getTree({ epic_area: epicFilter || undefined, assigned_to: personaFilter || undefined }),
      backlogApi.getMetrics(),
    ]).then(([t, m]) => {
      setEpics(t.data);
      setMetrics(m.data);
      // Auto-expand first epic
      if (t.data.length > 0 && expandedEpics.size === 0) {
        setExpandedEpics(new Set([t.data[0].id]));
      }
    }).finally(() => setLoading(false));
  }, [epicFilter, personaFilter]);

  useEffect(() => { load(); }, [load]);

  const toggleEpic = (id: string) => setExpandedEpics(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleFeature = (id: string) => setExpandedFeatures(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const handleUpdate = (id: string, data: object) => {
    setEpics(prev => prev.map(epic => ({
      ...epic,
      features: (epic.features || []).map(feat => ({
        ...feat,
        stories: (feat.stories || []).map(story =>
          story.id === id ? { ...story, ...data } : story
        ),
      })),
    })));
  };

  const totalSp = metrics.total_sp as number || 0;
  const doneSp = metrics.done_sp as number || 0;
  const pctDone = metrics.pct_complete as number || 0;
  const byStatus = (metrics.by_status as Record<string, number>) || {};
  const byPersona = (metrics.by_persona as Record<string, number>) || {};

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Delivery Excellence Backlog</h1>
            <p className="text-sm text-gray-500 mt-0.5">Strategic initiatives across 9 epics · Edwina · Karina · Maikel</p>
          </div>
          <button onClick={load} className="btn-ghost flex items-center gap-1 text-gray-400"><RefreshCw className="w-4 h-4" /></button>
        </div>

        {/* Metrics bar */}
        <div className="mt-4 grid grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="card p-3 text-center">
            <div className="text-xl font-bold text-gray-900">{metrics.total_epics as number || 0}</div>
            <div className="text-xs text-gray-500">Epics</div>
          </div>
          <div className="card p-3 text-center">
            <div className="text-xl font-bold text-gray-900">{metrics.total_features as number || 0}</div>
            <div className="text-xs text-gray-500">Features</div>
          </div>
          <div className="card p-3 text-center">
            <div className="text-xl font-bold text-gray-900">{metrics.total_stories as number || 0}</div>
            <div className="text-xs text-gray-500">User Stories</div>
          </div>
          <div className="card p-3 text-center">
            <div className="text-xl font-bold text-gray-900">{totalSp}</div>
            <div className="text-xs text-gray-500">Total Story Points</div>
          </div>
          <div className="card p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500">Progress</span>
              <span className="text-xs font-semibold">{pctDone}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-ms-blue rounded-full" style={{ width: `${pctDone}%` }} />
            </div>
            <div className="text-xs text-gray-400 mt-1">{doneSp} / {totalSp} SP done</div>
          </div>
        </div>

        {/* Persona summary */}
        <div className="mt-3 flex gap-3 flex-wrap">
          {Object.entries(PERSONA_CFG).map(([name, cfg]) => (
            <div key={name} className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-1.5">
              <div className={clsx('w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold', cfg.bg, cfg.text)}>{cfg.initials}</div>
              <div>
                <span className="text-xs font-semibold text-gray-700">{name}</span>
                <span className="text-xs text-gray-400 ml-1">· {byPersona[name] || 0} stories</span>
              </div>
            </div>
          ))}
          <div className="flex items-center gap-3 ml-auto">
            {Object.entries(byStatus).filter(([, v]) => v > 0).map(([k, v]) => {
              const cfg = STATUS_CFG[k];
              return (
                <div key={k} className="flex items-center gap-1 text-xs text-gray-500">
                  <span className={clsx('w-2 h-2 rounded-full', cfg?.dot || 'bg-gray-400')} />
                  {cfg?.label || k}: <strong>{v}</strong>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filter + Tab bar */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          <button onClick={() => setTab('backlog')}
            className={clsx('px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5',
              tab === 'backlog' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700')}>
            <LayoutList className="w-3.5 h-3.5" /> Backlog
          </button>
          <button onClick={() => setTab('board')}
            className={clsx('px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5',
              tab === 'board' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700')}>
            <Columns3 className="w-3.5 h-3.5" /> Board
          </button>
        </div>

        <div className="flex items-center gap-1 text-gray-400"><Filter className="w-3.5 h-3.5" /></div>

        <select className="input w-auto text-sm py-1.5" value={epicFilter} onChange={e => setEpicFilter(e.target.value)}>
          <option value="">All Epics</option>
          {Object.entries(EPIC_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>

        <select className="input w-auto text-sm py-1.5" value={personaFilter} onChange={e => setPersonaFilter(e.target.value)}>
          <option value="">All Personas</option>
          <option value="Edwina">Edwina — VP PS</option>
          <option value="Karina">Karina — Americas</option>
          <option value="Maikel">Maikel — VP DE</option>
        </select>

        {(epicFilter || personaFilter) && (
          <button onClick={() => { setEpicFilter(''); setPersonaFilter(''); }} className="text-xs text-ms-blue hover:underline">Clear filters</button>
        )}
      </div>

      {loading ? (
        <div className="p-12 text-center text-gray-400">Loading backlog...</div>
      ) : tab === 'board' ? (
        <BoardView epics={epics} onSelect={setSelectedItem} />
      ) : (
        /* ── Backlog Tree ── */
        <div className="space-y-3">
          {epics.map((epic, epicIdx) => {
            const epicExpanded = expandedEpics.has(epic.id);
            const epicColor = EPIC_COLORS[epicIdx % EPIC_COLORS.length];
            const totalStories = (epic.features || []).reduce((s, f) => s + (f.stories?.length || 0), 0);
            const doneStories = (epic.features || []).reduce((s, f) => s + (f.stories?.filter(st => ['resolved','closed'].includes(st.status)).length || 0), 0);

            return (
              <div key={epic.id} className={clsx('card border-l-4 overflow-hidden', epicColor)}>
                {/* Epic header */}
                <button
                  onClick={() => toggleEpic(epic.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex-shrink-0">
                    {epicExpanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                  </div>
                  <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide flex-shrink-0">Epic</span>
                  <span className="text-xs font-mono text-gray-400 flex-shrink-0">{epic.work_item_id}</span>
                  <span className="font-semibold text-gray-900 flex-1 text-sm">{epic.title}</span>
                  <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                    <SpBadge done={epic.done_sp} total={epic.total_sp} />
                    <span className="text-xs text-gray-400">{doneStories}/{totalStories} stories</span>
                    <span className="text-xs text-gray-400">{(epic.features || []).length} features</span>
                    <PriorityIcon priority={epic.priority} />
                  </div>
                </button>

                {/* Features */}
                {epicExpanded && (
                  <div className="border-t border-gray-100">
                    {(epic.features || []).map(feat => {
                      const featExpanded = expandedFeatures.has(feat.id);
                      const doneFeatStories = (feat.stories || []).filter(s => ['resolved', 'closed'].includes(s.status)).length;
                      return (
                        <div key={feat.id}>
                          {/* Feature row */}
                          <button
                            onClick={() => toggleFeature(feat.id)}
                            className="w-full flex items-center gap-3 px-4 py-2.5 pl-10 hover:bg-blue-50/50 transition-colors text-left border-b border-gray-50"
                          >
                            <div className="flex-shrink-0">
                              {featExpanded ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
                            </div>
                            <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide flex-shrink-0">Feature</span>
                            <span className="text-[10px] font-mono text-gray-400 flex-shrink-0">{feat.work_item_id}</span>
                            <span className="font-medium text-gray-800 flex-1 text-sm">{feat.title}</span>
                            <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                              <StatusChip status={feat.status} />
                              <SpBadge done={feat.done_sp} total={feat.total_sp} />
                              <span className="text-xs text-gray-400">{doneFeatStories}/{feat.stories?.length || 0}</span>
                              <PersonaAvatar name={feat.assigned_to} />
                            </div>
                          </button>

                          {/* User stories */}
                          {featExpanded && (
                            <div className="bg-gray-50/60">
                              {/* Column headers */}
                              <div className="flex items-center gap-3 px-4 py-1.5 pl-20 border-b border-gray-200 bg-gray-100/60">
                                <div className="flex-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wide">User Story</div>
                                <div className="w-24 text-[10px] font-semibold text-gray-400 uppercase tracking-wide text-center">State</div>
                                <div className="w-16 text-[10px] font-semibold text-gray-400 uppercase tracking-wide text-center">Priority</div>
                                <div className="w-16 text-[10px] font-semibold text-gray-400 uppercase tracking-wide text-center">Points</div>
                                <div className="w-24 text-[10px] font-semibold text-gray-400 uppercase tracking-wide text-center">Iteration</div>
                                <div className="w-16 text-[10px] font-semibold text-gray-400 uppercase tracking-wide text-center">Assigned</div>
                              </div>
                              {(feat.stories || []).map(story => {
                                const isDone = ['resolved', 'closed'].includes(story.status);
                                return (
                                  <button
                                    key={story.id}
                                    onClick={() => setSelectedItem(story)}
                                    className={clsx(
                                      'w-full flex items-center gap-3 px-4 py-2 pl-20 border-b border-gray-100 last:border-0 hover:bg-white transition-colors text-left group',
                                      isDone && 'opacity-60'
                                    )}
                                  >
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                      {isDone
                                        ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                                        : <Circle className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />}
                                      <span className="text-[10px] font-mono text-gray-400 flex-shrink-0">{story.work_item_id}</span>
                                      <span className={clsx('text-sm text-gray-700 truncate group-hover:text-ms-blue transition-colors', isDone && 'line-through text-gray-400')}>
                                        {story.title.replace(/^As \w+,\s*I want /, '')}
                                      </span>
                                    </div>
                                    <div className="w-24 flex justify-center flex-shrink-0"><StatusChip status={story.status} /></div>
                                    <div className="w-16 flex justify-center flex-shrink-0"><PriorityIcon priority={story.priority} /></div>
                                    <div className="w-16 flex justify-center flex-shrink-0"><SpBadge sp={story.story_points} /></div>
                                    <div className="w-24 text-center flex-shrink-0">
                                      <span className="text-xs text-gray-400">{story.iteration || '—'}</span>
                                    </div>
                                    <div className="w-16 flex justify-center flex-shrink-0">
                                      <PersonaAvatar name={story.assigned_to} size="xs" />
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {selectedItem && (
        <ItemDrawer
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onUpdate={(id, data) => { handleUpdate(id, data); setSelectedItem(prev => prev ? { ...prev, ...data } : null); }}
        />
      )}
    </div>
  );
}
