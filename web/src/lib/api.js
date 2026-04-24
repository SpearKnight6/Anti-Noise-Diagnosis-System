const base = import.meta.env.VITE_API_URL || 'http://localhost:8787/api';

const request = async (path, options = {}) => {
  const token = localStorage.getItem('access_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${base}${path}`, { ...options, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }

  return res.status === 204 ? null : res.json();
};

export const api = {
  listClients: () => request('/clients'),
  createClient: (payload) => request('/clients', { method: 'POST', body: JSON.stringify(payload) }),
  getDashboard: (clientId) => request(`/clients/${clientId}/dashboard`),
  createAudit: (payload) => request('/audits', { method: 'POST', body: JSON.stringify(payload) }),
  saveAuditLayers: (auditId, payload) =>
    request(`/audits/${auditId}/layers`, { method: 'POST', body: JSON.stringify(payload) }),
  listLeaks: (clientId) => request(`/clients/${clientId}/leaks`),
  createTasksFromLeaks: (payload) =>
    request('/tasks/from-leaks', { method: 'POST', body: JSON.stringify(payload) }),
  listTasks: (clientId) => request(`/clients/${clientId}/tasks`),
  updateTask: (taskId, payload) =>
    request(`/tasks/${taskId}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  saveMetrics: (payload) => request('/metrics', { method: 'POST', body: JSON.stringify(payload) }),
  getRevenue: (clientId) => request(`/clients/${clientId}/revenue`),
  report: (clientId) => request(`/clients/${clientId}/report`),
};
