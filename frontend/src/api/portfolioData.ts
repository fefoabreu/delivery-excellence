// ─────────────────────────────────────────────────────────────────────────────
// Portfolio sync layer — single source of truth for delivery health.
//
// The AI-Quality Assurance portfolio_monitor is the authoritative, richest
// dataset (30 actively-monitored engagements with Early-Warning intelligence,
// predictions, and rescue/oversight signals). Legacy delivery projects that are
// not in the QA monitor (completed/cancelled history) are merged in for
// historical completeness. The Executive Dashboard, Portfolio Dashboard, and
// Delivery module all consume this so they stay in sync with AI-QA.
// ─────────────────────────────────────────────────────────────────────────────

import { qualityAssuranceApi, deliveryApi } from './client';

export type HealthStatus = 'green' | 'amber' | 'red';
export type AlertLevel = 'watch' | 'caution' | 'critical';
export type QAAssessment = 'continue' | 'watch' | 'intervene' | 'escalate';

export interface UnifiedProject {
  id: string;
  name: string;
  client_name: string;
  project_manager?: string;
  technical_lead?: string;
  phase?: string;
  status: string;
  budget: number;
  actuals: number;
  burn_rate: number;
  completion_pct: number;
  start_date?: string;
  end_date?: string;
  overall_health: HealthStatus;
  dims: Record<string, HealthStatus>;       // schedule, budget, scope, risk, satisfaction
  executive_summary?: string;
  open_raid_count?: number;
  milestone_count?: number;
  // ── QA intelligence (present when hasQA) ──
  hasQA: boolean;
  ew?: number;
  alert_level?: AlertLevel | null;
  ai_assessment?: QAAssessment;
  trend?: string;
  trend_delta?: number;
  prediction_30d?: HealthStatus;
  prediction_60d?: HealthStatus;
  prediction_90d?: HealthStatus;
  components?: Record<string, number>;
  ai_narrative?: string;
  qa_director_override?: string | null;
  // ── derived engagement-intensity flags (same criteria as Portfolio Monitor) ──
  isRescue: boolean;
  isOversight: boolean;
  valueAtRisk: number;
}

export interface PortfolioIntel {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  onHoldProjects: number;
  cancelledProjects: number;
  totalBudget: number;             // active
  totalActuals: number;            // active
  burnRate: number;                // active, %
  avgCompletion: number;           // active, %
  health: Record<HealthStatus, number>;            // active
  dimensionHealth: Record<string, Record<HealthStatus, number>>; // active
  // QA-monitored intelligence
  monitoredCount: number;
  avgEW: number;
  alertCounts: { watch: number; caution: number; critical: number };
  predictions30: Record<HealthStatus, number>;
  valueAtRisk: number;
  rescue: UnifiedProject[];
  oversight: UnifiedProject[];
  needAttention: UnifiedProject[];   // amber/red monitored, sorted by EW desc
  getToGreen: { total: number; active: number; on_track: number; resolved: number; recoveryRate: number };
}

const DIMS = ['schedule', 'budget', 'scope', 'risk', 'satisfaction'] as const;

function rescueValueAtRisk(budget: number, ew: number) {
  return Math.round(budget * (ew / 100));
}

function fromQA(p: any): UnifiedProject {
  const ew = Math.round(p.early_warning?.score ?? 0);
  return {
    id: p.project_id,
    name: p.name,
    client_name: p.client_name,
    project_manager: p.project_manager,
    phase: p.phase,
    status: p.status,
    budget: p.budget,
    actuals: p.actuals,
    burn_rate: p.burn_rate,
    completion_pct: p.completion_pct,
    start_date: p.start_date,
    end_date: p.end_date,
    overall_health: p.overall_health,
    dims: p.health_dimensions || {},
    executive_summary: p.ai_narrative,
    hasQA: true,
    ew,
    alert_level: p.early_warning?.alert_level ?? null,
    ai_assessment: p.ai_assessment,
    trend: p.early_warning?.trend,
    trend_delta: p.early_warning?.trend_delta,
    prediction_30d: p.early_warning?.prediction_30d,
    prediction_60d: p.early_warning?.prediction_60d,
    prediction_90d: p.early_warning?.prediction_90d,
    components: p.early_warning?.components,
    ai_narrative: p.ai_narrative,
    qa_director_override: p.qa_director_override ?? null,
    isRescue: p.early_warning?.alert_level === 'critical' || p.ai_assessment === 'escalate',
    isOversight: false, // set after we know the top-2 green by budget
    valueAtRisk: rescueValueAtRisk(p.budget, ew),
  };
}

function fromDelivery(p: any): UnifiedProject {
  return {
    id: p.id,
    name: p.name,
    client_name: p.client_name,
    project_manager: p.project_manager,
    technical_lead: p.technical_lead,
    phase: p.phase,
    status: p.status,
    budget: p.budget,
    actuals: p.actuals,
    burn_rate: p.burn_rate,
    completion_pct: p.completion_pct,
    start_date: p.start_date,
    end_date: p.end_date,
    overall_health: p.overall_health,
    dims: {
      schedule: p.health_schedule, budget: p.health_budget, scope: p.health_scope,
      risk: p.health_risk, satisfaction: p.health_satisfaction,
    },
    executive_summary: p.executive_summary,
    open_raid_count: p.open_raid_count,
    milestone_count: p.milestone_count,
    hasQA: false,
    isRescue: false,
    isOversight: false,
    valueAtRisk: 0,
  };
}

export interface PortfolioBundle {
  projects: UnifiedProject[];
  intel: PortfolioIntel;
  getToGreenRaw: any[];
}

export async function loadPortfolio(): Promise<PortfolioBundle> {
  const [qaRes, dlRes] = await Promise.all([
    qualityAssuranceApi.getData(),
    deliveryApi.listProjects().catch(() => ({ data: [] as any[] })),
  ]);
  const qa = qaRes.data || {};
  const monitor: any[] = qa.portfolio_monitor || [];
  const g2g: any[] = qa.get_to_green || [];
  const delivery: any[] = (dlRes as any).data || [];

  const qaIds = new Set(monitor.map(p => p.project_id));
  const projects: UnifiedProject[] = [
    ...monitor.map(fromQA),
    ...delivery.filter(p => !qaIds.has(p.id)).map(fromDelivery),
  ];

  // oversight = top-2 active green QA engagements by budget (same as Portfolio Monitor)
  const oversightIds = new Set(
    projects
      .filter(p => p.hasQA && p.status === 'active' && p.overall_health === 'green')
      .sort((a, b) => b.budget - a.budget)
      .slice(0, 2)
      .map(p => p.id)
  );
  projects.forEach(p => { p.isOversight = oversightIds.has(p.id); });

  const active = projects.filter(p => p.status === 'active');
  const monitored = projects.filter(p => p.hasQA);

  const health: Record<HealthStatus, number> = { green: 0, amber: 0, red: 0 };
  active.forEach(p => { health[p.overall_health]++; });

  const dimensionHealth: Record<string, Record<HealthStatus, number>> = {};
  DIMS.forEach(d => { dimensionHealth[d] = { green: 0, amber: 0, red: 0 }; });
  active.forEach(p => DIMS.forEach(d => {
    const v = p.dims[d] as HealthStatus | undefined;
    if (v) dimensionHealth[d][v]++;
  }));

  const predictions30: Record<HealthStatus, number> = { green: 0, amber: 0, red: 0 };
  monitored.forEach(p => { if (p.prediction_30d) predictions30[p.prediction_30d]++; });

  const alertCounts = { watch: 0, caution: 0, critical: 0 };
  monitored.forEach(p => { if (p.alert_level) alertCounts[p.alert_level]++; });

  const totalBudget = active.reduce((s, p) => s + p.budget, 0);
  const totalActuals = active.reduce((s, p) => s + p.actuals, 0);

  const g2gActive = g2g.filter(g => g.status === 'active').length;
  const g2gOnTrack = g2g.filter(g => g.status === 'on_track').length;
  const g2gResolved = g2g.filter(g => g.status === 'resolved').length;

  const intel: PortfolioIntel = {
    totalProjects: projects.length,
    activeProjects: active.length,
    completedProjects: projects.filter(p => p.status === 'completed').length,
    onHoldProjects: projects.filter(p => p.status === 'on_hold').length,
    cancelledProjects: projects.filter(p => p.status === 'cancelled').length,
    totalBudget,
    totalActuals,
    burnRate: totalBudget ? Math.round((totalActuals / totalBudget) * 1000) / 10 : 0,
    avgCompletion: active.length ? Math.round(active.reduce((s, p) => s + p.completion_pct, 0) / active.length) : 0,
    health,
    dimensionHealth,
    monitoredCount: monitored.length,
    avgEW: monitored.length ? Math.round(monitored.reduce((s, p) => s + (p.ew || 0), 0) / monitored.length) : 0,
    alertCounts,
    predictions30,
    valueAtRisk: monitored.reduce((s, p) => s + p.valueAtRisk, 0),
    rescue: projects.filter(p => p.isRescue),
    oversight: projects.filter(p => p.isOversight),
    needAttention: monitored
      .filter(p => p.overall_health !== 'green' || (p.ew || 0) >= 50)
      .sort((a, b) => (b.ew || 0) - (a.ew || 0)),
    getToGreen: {
      total: g2g.length, active: g2gActive, on_track: g2gOnTrack, resolved: g2gResolved,
      recoveryRate: g2g.length ? Math.round((g2gOnTrack + g2gResolved) / g2g.length * 100) : 0,
    },
  };

  return { projects, intel, getToGreenRaw: g2g };
}

// ── consistent launch URLs to the QA command surfaces ──
export function rescueHref(p: UnifiedProject): string {
  const q = new URLSearchParams({
    pid: p.id, project: p.name, client: p.client_name, lead: 'Priya Nadkarni · QA Director',
    ew: String(p.ew ?? 0), var: String(p.valueAtRisk),
  });
  return `/rescue-command?${q.toString()}`;
}
export function oversightHref(p: UnifiedProject): string {
  const q = new URLSearchParams({
    pid: p.id, project: p.name, client: p.client_name, lead: 'Priya Nadkarni · QA Director', val: String(p.budget),
  });
  return `/oversight?${q.toString()}`;
}

export const fmtMoney = (v: number) =>
  v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(1)}M` : v >= 1_000 ? `$${(v / 1_000).toFixed(0)}K` : `$${v}`;
