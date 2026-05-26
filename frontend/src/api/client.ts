import axios from 'axios';

const IS_STATIC = import.meta.env.VITE_STATIC_MODE === 'true';
const BASE = import.meta.env.BASE_URL || '/';

// Fetch a static JSON file (GitHub Pages mode)
async function staticGet(path: string) {
  const url = `${BASE}mock-data${path.replace(/\/$/, '')}.json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Static fetch failed: ${url}`);
  const data = await res.json();
  return { data };
}

// No-op for write operations in static mode
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const noop = (..._args: any[]) => Promise.resolve({ data: {} as any });

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' });

export const opportunitiesApi = {
  list: (stage?: string) => IS_STATIC
    ? staticGet('/opportunities').then(r => ({ data: stage ? r.data.filter((o: any) => o.stage === stage) : r.data }))
    : api.get('/opportunities/', { params: stage ? { stage } : {} }),
  get: (id: string) => IS_STATIC ? staticGet(`/opportunities/${id}`) : api.get(`/opportunities/${id}`),
  create: noop,
  update: noop,
  delete: noop,
};

export const contractsApi = {
  list: (status?: string) => IS_STATIC
    ? staticGet('/contracts').then(r => ({ data: status ? r.data.filter((c: any) => c.status === status) : r.data }))
    : api.get('/contracts/', { params: status ? { status } : {} }),
  get: (id: string) => IS_STATIC ? staticGet(`/contracts/${id}`) : api.get(`/contracts/${id}`),
  create: noop,
  update: noop,
  submit: noop,
  approve: noop,
  close: noop,
};

export const handoffApi = {
  list: () => IS_STATIC ? staticGet('/handoffs') : api.get('/handoffs/'),
  get: (id: string) => IS_STATIC ? staticGet(`/handoffs/${id}`) : api.get(`/handoffs/${id}`),
  getByContract: (contractId: string) => IS_STATIC
    ? staticGet('/handoffs').then(r => ({ data: r.data.filter((h: any) => h.contract_id === contractId) }))
    : api.get(`/handoffs/contract/${contractId}`),
  create: noop,
  update: noop,
};

export const deliveryApi = {
  listProjects: (status?: string) => IS_STATIC
    ? staticGet('/delivery-projects').then(r => ({ data: status ? r.data.filter((p: any) => p.status === status) : r.data }))
    : api.get('/delivery/projects', { params: status ? { status } : {} }),
  getProject: (id: string) => IS_STATIC ? staticGet(`/delivery-projects/${id}`) : api.get(`/delivery/projects/${id}`),
  createProject: noop,
  updateProject: noop,
  getMilestones: (projectId: string) => IS_STATIC ? staticGet(`/delivery-projects/${projectId}-milestones`) : api.get(`/delivery/projects/${projectId}/milestones`),
  createMilestone: noop,
  updateMilestone: noop,
  getRaid: (projectId: string, type?: string) => IS_STATIC
    ? staticGet(`/delivery-projects/${projectId}-raid`).then(r => ({ data: type ? r.data.filter((i: any) => i.item_type === type) : r.data }))
    : api.get(`/delivery/projects/${projectId}/raid`, { params: type ? { item_type: type } : {} }),
  createRaid: noop,
  updateRaid: noop,
  getStatusUpdates: (projectId: string) => IS_STATIC ? staticGet(`/delivery-projects/${projectId}-status-updates`) : api.get(`/delivery/projects/${projectId}/status-updates`),
  createStatusUpdate: noop,
};

export const portfolioApi = {
  pipelineMetrics: () => IS_STATIC ? staticGet('/portfolio-pipeline-metrics') : api.get('/portfolio/pipeline-metrics'),
  deliveryMetrics: () => IS_STATIC ? staticGet('/portfolio-delivery-metrics') : api.get('/portfolio/delivery-metrics'),
  executiveSummary: () => IS_STATIC ? staticGet('/portfolio-executive-summary') : api.get('/portfolio/executive-summary'),
};

export const catalogApi = {
  list: (category?: string) => IS_STATIC
    ? staticGet('/catalog').then(r => ({ data: category ? r.data.filter((c: any) => c.category === category) : r.data }))
    : api.get('/catalog/', { params: category ? { category } : {} }),
};

export const agentApi = {
  chat: (data: { message: string; context_type?: string; context_id?: string }) =>
    IS_STATIC ? Promise.resolve({ data: { response: 'AI agent is not available in the demo — run the backend locally for full functionality.' } }) : api.post('/agent/chat', data),
  draftSow: (data: { message: string; context_id?: string }) =>
    IS_STATIC ? Promise.resolve({ data: { response: 'AI agent is not available in the demo — run the backend locally for full functionality.' } }) : api.post('/agent/draft-sow', data),
  healthAnalysis: (data: { message: string; context_id?: string }) =>
    IS_STATIC ? Promise.resolve({ data: { response: 'AI agent is not available in the demo — run the backend locally for full functionality.' } }) : api.post('/agent/health-analysis', data),
};

export const dealApprovalsApi = {
  getConfig: () => IS_STATIC ? staticGet('/deal-approvals-config') : api.get('/deal-approvals/config'),
  list: () => IS_STATIC ? staticGet('/deal-approvals') : api.get('/deal-approvals/'),
  get: (id: string) => IS_STATIC ? staticGet(`/deal-approvals/${id}`) : api.get(`/deal-approvals/${id}`),
  takeAction: noop,
  regenerateAI: noop,
};

export const qualityAssuranceApi = {
  getConfig: () => IS_STATIC ? staticGet('/quality-assurance-config') : api.get('/quality-assurance/config'),
  getData: () => IS_STATIC ? staticGet('/quality-assurance') : api.get('/quality-assurance/'),
};

export const evalsApi = {
  getSummary: () => IS_STATIC ? staticGet('/evals-summary') : api.get('/evals/summary'),
};

export const backlogApi = {
  getTree: (params?: { epic_area?: string; assigned_to?: string }) => IS_STATIC
    ? staticGet('/backlog-tree').then(r => {
        if (!params) return r;
        // client-side filter for static mode
        return r;
      })
    : api.get('/backlog/tree', { params }),
  list: (params?: object) => IS_STATIC ? staticGet('/backlog') : api.get('/backlog/', { params }),
  getMetrics: () => IS_STATIC ? staticGet('/backlog-metrics') : api.get('/backlog/metrics'),
  updateItem: noop,
};

export default api;
