export type HealthStatus = 'green' | 'amber' | 'red';

export type OpportunityStage =
  | 'prospect' | 'qualify' | 'develop' | 'propose'
  | 'negotiate' | 'closed_won' | 'closed_lost';

export interface Opportunity {
  id: string;
  name: string;
  client_name: string;
  client_contact?: string;
  client_contact_email?: string;
  stage: OpportunityStage;
  estimated_value: number;
  probability: number;
  weighted_value: number;
  description?: string;
  owner?: string;
  close_date?: string;
  services: string[];
  industry?: string;
  region?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ServiceLine {
  id: string;
  service_id: string;
  service_name: string;
  category: string;
  quantity: number;
  unit: string;
  unit_price: number;
  discount_pct: number;
  total: number;
}

export interface Contract {
  id: string;
  opportunity_id?: string;
  contract_number: string;
  name: string;
  client_name: string;
  total_value: number;
  status: string;
  approval_status: string;
  approved_by?: string;
  approved_at?: string;
  scope_summary?: string;
  terms_conditions?: string;
  start_date?: string;
  end_date?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  service_lines: ServiceLine[];
  has_handoff: boolean;
  has_delivery: boolean;
}

export interface HandoffContact {
  id: string;
  name: string;
  title?: string;
  email?: string;
  phone?: string;
  role: string;
}

export interface Handoff {
  id: string;
  contract_id: string;
  customer_vision?: string;
  business_objectives: string[];
  success_criteria: string[];
  risks: string[];
  pitfalls: string[];
  key_decisions: string[];
  delivery_notes?: string;
  pre_sales_owner?: string;
  delivery_owner?: string;
  status: string;
  completed_at?: string;
  created_at: string;
  contacts: HandoffContact[];
}

export interface DeliveryProject {
  id: string;
  contract_id: string;
  name: string;
  client_name: string;
  project_manager?: string;
  technical_lead?: string;
  overall_health: HealthStatus;
  health_schedule: HealthStatus;
  health_budget: HealthStatus;
  health_scope: HealthStatus;
  health_risk: HealthStatus;
  health_satisfaction: HealthStatus;
  status: string;
  start_date?: string;
  end_date?: string;
  budget: number;
  actuals: number;
  burn_rate: number;
  completion_pct: number;
  phase?: string;
  executive_summary?: string;
  created_at: string;
  updated_at: string;
  milestone_count: number;
  open_raid_count: number;
}

export interface Milestone {
  id: string;
  project_id: string;
  name: string;
  description?: string;
  due_date?: string;
  completed_date?: string;
  status: string;
  owner?: string;
  deliverables: string[];
}

export interface RAIDItem {
  id: string;
  project_id: string;
  item_type: 'risk' | 'assumption' | 'issue' | 'dependency';
  title: string;
  description?: string;
  impact: string;
  probability?: string;
  status: string;
  owner?: string;
  due_date?: string;
  mitigation?: string;
  created_at: string;
}

export interface StatusUpdate {
  id: string;
  project_id: string;
  period: string;
  overall_health: HealthStatus;
  summary: string;
  accomplishments: string[];
  next_steps: string[];
  escalations: string[];
  created_at: string;
}

export interface ServiceCatalog {
  id: string;
  name: string;
  category: string;
  practice?: string;
  description?: string;
  unit?: string;
  list_price?: number;
  active: boolean;
}

export interface PipelineMetrics {
  total_opportunities: number;
  active_opportunities: number;
  total_pipeline_value: number;
  weighted_pipeline_value: number;
  closed_won_count: number;
  closed_won_value: number;
  win_rate: number;
  by_stage: Record<string, { count: number; value: number; weighted: number }>;
  by_region: Record<string, { count: number; value: number }>;
  by_owner: Record<string, { count: number; value: number }>;
}

export interface DeliveryMetrics {
  total_projects: number;
  active_projects: number;
  completed_projects: number;
  health_summary: Record<string, number>;
  total_budget: number;
  total_actuals: number;
  overall_burn_rate: number;
  avg_completion: number;
  open_raid_items: number;
  overdue_milestones: number;
  dimension_health: Record<string, Record<string, number>>;
  projects_at_risk: Array<{ id: string; name: string; client_name: string; overall_health: string }>;
}
