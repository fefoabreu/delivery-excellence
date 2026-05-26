import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, BookOpen, CheckCircle, XCircle, Shield, Lightbulb,
  Search, Bot,
} from 'lucide-react';
import clsx from 'clsx';
import { qualityAssuranceApi } from '../api/client';

type LessonCategory = 'success_pattern' | 'failure_mode' | 'risk_mitigation' | 'process_improvement';
interface Lesson {
  id: string; source_project_id: string; source_project_name: string;
  category: LessonCategory; title: string; description: string;
  tags: Record<string, string>; applicability_score: number;
  times_consumed: number; linked_projects: string[]; created_at: string;
}

const LESSON_CFG: Record<LessonCategory, { label: string; bg: string; Icon: typeof Lightbulb }> = {
  success_pattern:     { label: 'Success Pattern',     bg: 'bg-green-100 text-green-700',  Icon: CheckCircle },
  failure_mode:        { label: 'Failure Mode',        bg: 'bg-red-100 text-red-700',      Icon: XCircle },
  risk_mitigation:     { label: 'Risk Mitigation',     bg: 'bg-amber-100 text-amber-700',  Icon: Shield },
  process_improvement: { label: 'Process Improvement', bg: 'bg-blue-100 text-blue-700',    Icon: Lightbulb },
};

export default function QAKnowledgeNetwork() {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    qualityAssuranceApi.getData()
      .then(r => setLessons(r.data.knowledge_network))
      .finally(() => setLoading(false));
  }, []);

  const filtered = lessons.filter(l => {
    if (filterCategory && l.category !== filterCategory) return false;
    if (search && !l.title.toLowerCase().includes(search.toLowerCase()) && !l.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const byCategory = lessons.reduce<Record<string, number>>((acc, l) => { acc[l.category] = (acc[l.category] || 0) + 1; return acc; }, {});
  const totalConsumed = lessons.reduce((s, l) => s + l.times_consumed, 0);

  if (loading) return <div className="p-12 text-center text-gray-400">Loading knowledge network...</div>;

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
              <BookOpen className="w-7 h-7 text-indigo-600" />
              Knowledge Network
            </h1>
            <p className="text-sm text-gray-500 mt-1 max-w-2xl">
              Institutional memory from every project — captured, classified, and connected to live engagements across the Agent Ecosystem.
            </p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 bg-gray-50 text-xs text-gray-400">
            <Bot className="w-3 h-3" /> Powered by Claude
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {(Object.keys(LESSON_CFG) as LessonCategory[]).map(cat => {
          const cfg = LESSON_CFG[cat];
          const CatIcon = cfg.Icon;
          return (
            <div key={cat} className="card p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilterCategory(filterCategory === cat ? '' : cat)}>
              <div className="flex items-center gap-2 mb-1">
                <CatIcon className={clsx('w-4 h-4', cfg.bg.split(' ')[1])} />
                <div className="text-sm text-gray-500">{cfg.label}</div>
              </div>
              <div className="text-2xl font-bold">{byCategory[cat] || 0}</div>
            </div>
          );
        })}
      </div>

      <div className="card p-4 mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-100">
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          <div>
            <div className="text-sm font-bold text-gray-900">{lessons.length} lessons captured · {totalConsumed} times consumed by live projects</div>
            <div className="text-xs text-gray-500">Feeding into Pipeline Agent (deal risk profiles) and Delivery Agent (phase guidance)</div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input className="input pl-9 text-sm" placeholder="Search lessons..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input w-auto text-sm py-2" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
          <option value="">All Categories</option>
          {(Object.keys(LESSON_CFG) as LessonCategory[]).map(cat => (
            <option key={cat} value={cat}>{LESSON_CFG[cat].label}</option>
          ))}
        </select>
        <span className="text-sm text-gray-400 ml-auto">{filtered.length} lessons</span>
      </div>

      <div className="space-y-3">
        {filtered.map(l => {
          const cfg = LESSON_CFG[l.category];
          const CatIcon = cfg.Icon;
          return (
            <div key={l.id} className="card p-5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={clsx('inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded', cfg.bg)}>
                      <CatIcon className="w-3 h-3" /> {cfg.label}
                    </span>
                    <span className="text-xs text-gray-400">Applicability: {l.applicability_score}/100</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">{l.title}</h3>
                  <div className="text-xs text-gray-500">From: {l.source_project_name}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-bold text-indigo-700">{l.times_consumed}x</div>
                  <div className="text-[10px] text-gray-400">consumed</div>
                </div>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed mb-2">{l.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(l.tags).map(([k, v]) => (
                  <span key={k} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded capitalize">{k.replace(/_/g, ' ')}: {v}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
