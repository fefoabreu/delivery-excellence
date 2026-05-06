import axios from 'axios';

// In dev: proxied to localhost:8000. In production: set VITE_API_URL to your deployed backend.
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' });

export const opportunitiesApi = {
  list: (stage?: string) => api.get('/opportunities/', { params: stage ? { stage } : {} }),
  get: (id: string) => api.get(`/opportunities/${id}`),
  create: (data: object) => api.post('/opportunities/', data),
  update: (id: string, data: object) => api.put(`/opportunities/${id}`, data),
  delete: (id: string) => api.delete(`/opportunities/${id}`),
};

export const contractsApi = {
  list: (status?: string) => api.get('/contracts/', { params: status ? { status } : {} }),
  get: (id: string) => api.get(`/contracts/${id}`),
  create: (data: object) => api.post('/contracts/', data),
  update: (id: string, data: object) => api.put(`/contracts/${id}`, data),
  submit: (id: string) => api.post(`/contracts/${id}/submit`),
  approve: (id: string, data: object) => api.post(`/contracts/${id}/approve`, data),
  close: (id: string) => api.post(`/contracts/${id}/close`),
};

export const handoffApi = {
  list: () => api.get('/handoffs/'),
  get: (id: string) => api.get(`/handoffs/${id}`),
  getByContract: (contractId: string) => api.get(`/handoffs/contract/${contractId}`),
  create: (data: object) => api.post('/handoffs/', data),
  update: (id: string, data: object) => api.put(`/handoffs/${id}`, data),
};

export const deliveryApi = {
  listProjects: (status?: string) => api.get('/delivery/projects', { params: status ? { status } : {} }),
  getProject: (id: string) => api.get(`/delivery/projects/${id}`),
  createProject: (data: object) => api.post('/delivery/projects', data),
  updateProject: (id: string, data: object) => api.put(`/delivery/projects/${id}`, data),
  getMilestones: (projectId: string) => api.get(`/delivery/projects/${projectId}/milestones`),
  createMilestone: (projectId: string, data: object) => api.post(`/delivery/projects/${projectId}/milestones`, data),
  updateMilestone: (milestoneId: string, data: object) => api.put(`/delivery/milestones/${milestoneId}`, data),
  getRaid: (projectId: string, type?: string) => api.get(`/delivery/projects/${projectId}/raid`, { params: type ? { item_type: type } : {} }),
  createRaid: (projectId: string, data: object) => api.post(`/delivery/projects/${projectId}/raid`, data),
  updateRaid: (raidId: string, data: object) => api.put(`/delivery/raid/${raidId}`, data),
  getStatusUpdates: (projectId: string) => api.get(`/delivery/projects/${projectId}/status-updates`),
  createStatusUpdate: (projectId: string, data: object) => api.post(`/delivery/projects/${projectId}/status-updates`, data),
};

export const portfolioApi = {
  pipelineMetrics: () => api.get('/portfolio/pipeline-metrics'),
  deliveryMetrics: () => api.get('/portfolio/delivery-metrics'),
  executiveSummary: () => api.get('/portfolio/executive-summary'),
};

export const catalogApi = {
  list: (category?: string) => api.get('/catalog/', { params: category ? { category } : {} }),
};

export const agentApi = {
  chat: (data: { message: string; context_type?: string; context_id?: string }) => api.post('/agent/chat', data),
  draftSow: (data: { message: string; context_id?: string }) => api.post('/agent/draft-sow', data),
  healthAnalysis: (data: { message: string; context_id?: string }) => api.post('/agent/health-analysis', data),
};

export const backlogApi = {
  getTree: (params?: { epic_area?: string; assigned_to?: string }) => api.get('/backlog/tree', { params }),
  list: (params?: object) => api.get('/backlog/', { params }),
  getMetrics: () => api.get('/backlog/metrics'),
  updateItem: (id: string, data: object) => api.put(`/backlog/${id}`, data),
};

export default api;
